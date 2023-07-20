
import xCrawl from 'x-crawl';
import { set } from 'lodash';


const domain = "https://www.yidoutang.com/case-2300783.html";

// const shape = [2, 3,4,5,6,7,8]; // 一居室、二居室、三居室、四居室、 6= 复式、8=别墅、7=其它
// const type =[1,2,3,,6,7,10,11,14,15,16,9] // 北欧、现代简约 、美式、日式、混搭、中式、法式、工业风、轻奢、复古、其他风格

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
  selector: "h1",
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



const ownerSelectorArr = [{
  selector: "info > div:nth-child(1)",
  key:["owner","job"],
  label: "职业"
},
{
  selector: "info > div:nth-child(2)",
  key: ["owner","age"],
  label: "年龄"
},
{
  selector: "info > div:nth-child(3)",
  key: ["owner", "age"],
  label: "个人简介"
}]



myXCrawl.crawlPage(domain).then(async (res) => {
  const { browser, page } = res.data;

  const currentInfo = {...defaultInfo};

  // base info
   await page.$eval("#caseDetail-main", (node: Element) => {
    selectorArr.forEach(o => {
      const v = node.querySelector(o.selector)?.textContent;
      currentInfo[o.key] = v;
    }) 
  });

  console.log(currentInfo)

  await page.$$eval(".part", (elements: Element[]) => {
    elements.forEach((e) => {
      const partTitle = e.querySelector(".title")?.textContent?.trim();

      if(partTitle === "屋主信息") {
        ownerSelectorArr.forEach(o => {
          const v = e.querySelector(o.selector);
          set(currentInfo, o.key, v);
        })

      } else if (partTitle === "前言") {
          const content = e.querySelector(".text")?.textContent?.trim();
          set(currentInfo, "introduction", content);
      } else {

      }
    })
  })

  console.log(currentInfo)

  // 关闭浏览器
  browser.close()
})