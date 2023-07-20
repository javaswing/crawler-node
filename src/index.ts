
import xCrawl from 'x-crawl';
import { set } from 'lodash';

const domain = "https://www.yidoutang.com/case-2300783.html";
const myXCrawl = xCrawl({ maxRetry: 3});


type infoType = {
  title: string;
  author: string;
  shape: string;
  area: string;
  style: string;
  money: string;
  address: string;
  owner: {
    job: string
    age: string;
    desc: string;
  }
  introduction:string;
  other: string;
} & Record<string, any>;

const defaultInfo: infoType = {
  title: "",
  author: "",
  shape: "",
  area: "",
  style: "",
  money: "",
  address: "",
  introduction:"",
  other: "",
  owner: {
    job: "",    
    age: "",
    desc: "",
  }
}


const selectorArr: {selector: string, key: string, label: string}[] = [{
  selector: ">h1",
  key: 'title',
  label: '标题'
},
{
  selector: "div.case-userWrap.clearfix > div > a",
  key: 'author',
  label: "作者"
},
{
  selector: "p > a:nth-child(1) > em",
  key: 'shape',
  label: "户型"
},
{
  selector: "p > a:nth-child(2) > em",
  key: 'area',
  label: "面积"
},
{
  selector: "p > a:nth-child(3) > em",
  key: "style",
  label: "风格"
},
{
  selector: "p > a:nth-child(4) > em",
  key: "money",
  label: "预算"
},
{
  selector: "p > a:nth-child(5) > em",
  key: "address",
  label: "地区"
}
];

// #caseDetail-main > div.case-content.newcase-content > div:nth-child(1) > div.info > div:nth-child(1)

const ownerSelectorArr = [{
  selector: 'div.info > div:nth-child(1)',
  key:["owner","job"],
  label: "职业"
},
{
  selector: 'div.info > div:nth-child(2)',
  key: ["owner","age"],
  label: "年龄"
},
{
  selector: 'div.info > div:nth-child(3)',
  key: ["owner", "desc"],
  label: "个人简介"
}]



myXCrawl.crawlPage(domain).then(async (res) => {
  const { browser, page } = res.data;

  const currentInfo = {...defaultInfo};

 // base info
  for (const selector of selectorArr) {
    const v = await page.$eval(`#caseDetail-main ${selector.selector}`, (node: Element) => node.textContent?.trim()) 
    set(currentInfo, selector.key, v)
  }

  console.log(currentInfo)


  const partList = await page.$$(".part");
  
  for (const p of partList) {
    const partTitle = await p.$eval(".title", node => node?.textContent?.trim());

    if(partTitle === "屋主信息") {

      for (const s of ownerSelectorArr) {
        try {
          // 简介不确定
          const v = await p.$eval(s.selector, node => node.textContent?.trim().split("\n")[1].trim());       
          set(currentInfo, s.key, v);
        } catch (error) {
          console.error('ownerSelectorArr error ' + s.label)
        }       
      }
    }

    // } else
     if (partTitle === "前言") {
        const content = await p.$eval(".text", node => node?.textContent?.trim());
        set(currentInfo, "introduction", content);
    }
    
  }
  console.log(currentInfo)
  // 关闭浏览器
  browser.close()
})