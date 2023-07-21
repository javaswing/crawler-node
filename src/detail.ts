import { set } from "lodash";
import { XCrawlInstance } from "x-crawl";
import { infoType } from "./app";

// const domain = "https://www.yidoutang.com/case-2162913.html";
// const myXCrawl = xCrawl({ maxRetry: 3 });

// instance.crawlPage(domain).then(async (res) => {
//   const { browser, page } = res.data;

//   currentInfo.currentUrl = domain;

//   // base info
//   for (const selector of baseArr) {
//     const v = await page.$eval(
//       `#caseDetail-main ${selector.selector}`,
//       (node: Element) => node.textContent?.trim()
//     );
//     set(currentInfo, selector.key, v);
//   }

//   for (const selector of selectorArr) {
//     try {
//       const v = await page.$eval(
//         `#caseDetail-main ${selector.selector}`,
//         (node: Element) => node.textContent?.trim().split("：")[1].trim()
//       );
//       set(currentInfo, selector.key, v);
//     } catch (error) {
//       console.error(selector.label + error);
//     }
//   }

//   const partList = await page.$$(".part");

//   for (const p of partList) {
//     const partTitle = await p.$eval(".title", (node) =>
//       node?.textContent?.trim()
//     );

//     if (partTitle === "屋主信息") {
//       for (const s of ownerSelectorArr) {
//         try {
//           // 简介不确定
//           const v = await p.$eval(s.selector, (node) =>
//             node.textContent?.trim().split("\n")[1].trim()
//           );
//           set(currentInfo, s.key, v);
//         } catch (error) {
//           console.error("ownerSelectorArr error " + s.label);
//         }
//       }
//     } else if (partTitle === "前言") {
//       const content = await p.$eval(".text", (node) =>
//         node?.textContent?.trim()
//       );
//       set(currentInfo, "introduction", content);
//     } else {
//       const v = await p.$$eval(".text", (node) =>
//         node.map((n) => n.textContent?.trim() + " ")
//       );
//       const newContent = currentInfo.content + v;
//       set(currentInfo, "content", newContent);
//     }
//   }

//   saveToExcel([currentInfo], "output.xlsx");

//   // 关闭浏览器
//   browser.close();
// });

const baseArr = [
  {
    selector: ">h1",
    key: "title",
    label: "标题",
  },
  {
    selector: "div.case-userWrap.clearfix > div > a",
    key: "author",
    label: "作者",
  },
];

const selectorArr: { selector: string; key: string; label: string }[] = [
  {
    selector: "p > a:nth-child(1) > em",
    key: "shape",
    label: "户型",
  },
  {
    selector: "p > a:nth-child(2) > em",
    key: "area",
    label: "面积",
  },
  {
    selector: "p > a:nth-child(3) > em",
    key: "style",
    label: "风格",
  },
  {
    selector: "p > a:nth-child(4) > em",
    key: "money",
    label: "预算",
  },
  {
    selector: "p > a:nth-child(5) > em",
    key: "address",
    label: "地区",
  },
];

const ownerSelectorArr = [
  {
    selector: "div.info > div:nth-child(1)",
    key: ["owner", "job"],
    label: "职业",
  },
  {
    selector: "div.info > div:nth-child(2)",
    key: ["owner", "age"],
    label: "年龄",
  },
  {
    selector: "div.info > div:nth-child(3)",
    key: ["owner", "desc"],
    label: "个人简介",
  },
];

export async function crawlDetail(
  instance: XCrawlInstance,
  url: string,
  viewCount: string,
  commentCount: string
): Promise<infoType> {
  const currentInfo: infoType = {
    title: "",
    author: "",
    shape: "",
    area: "",
    style: "",
    money: "",
    address: "",
    introduction: "",
    owner: {
      job: "",
      age: "",
      desc: "",
    },
    content: "",
    currentUrl: "",
    viewCount: "",
    commentCount: "",
  };

  const res = await instance.crawlPage(url);
  const { page } = res.data;

  currentInfo.currentUrl = url;
  currentInfo.viewCount = viewCount;
  currentInfo.commentCount = commentCount;

  // base info
  for (const selector of baseArr) {
    const v = await page.$eval(
      `#caseDetail-main ${selector.selector}`,
      (node: Element) => node.textContent?.trim()
    );
    set(currentInfo, selector.key, v);
  }

  for (const selector of selectorArr) {
    try {
      const v = await page.$eval(
        `#caseDetail-main ${selector.selector}`,
        (node: Element) => node.textContent?.trim().split("：")[1].trim()
      );
      set(currentInfo, selector.key, v);
    } catch (error) {
      console.error(selector.label + error);
    }
  }

  const partList = await page.$$(".part");

  for (const p of partList) {
    const partTitle = await p.$eval(".title", (node) =>
      node?.textContent?.trim()
    );

    if (partTitle === "屋主信息") {
      for (const s of ownerSelectorArr) {
        try {
          // 简介不确定
          const v = await p.$eval(s.selector, (node) =>
            node.textContent?.trim().split("\n")[1].trim()
          );
          set(currentInfo, s.key, v);
        } catch (error) {
          console.error("ownerSelectorArr error " + s.label);
        }
      }
    } else if (partTitle === "前言") {
      const content = await p.$eval(".text", (node) =>
        node?.textContent?.trim()
      );
      set(currentInfo, "introduction", content);
    } else {
      const v = await p.$$eval(".text", (node) =>
        node.map((n) => n.textContent?.trim() + " ")
      );
      const newContent = currentInfo.content + v;
      set(currentInfo, "content", newContent);
    }
  }

  page.close();

  return currentInfo;
}
