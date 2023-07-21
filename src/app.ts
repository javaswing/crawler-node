// 1.导入模块 ES/CJS
import xCrawl from 'x-crawl'
import { crawlDetail } from './detail';
import { saveToExcel } from './util';


const targets: string[] = [];

for (let index = 5; index <= 10; index++) {
    targets.push(`https://www.yidoutang.com/case-p${index}/`)
}

export type infoType = {
    title: string;
    author: string;
    shape: string;
    area: string;
    style: string;
    money: string;
    address: string;
    owner: {
      job: string;
      age: string;
      desc: string;
    };
    introduction: string;
    content: string;
    currentUrl: string;
    viewCount: string;
    commentCount: string;
  } & Record<string, any>;

// 2.创建一个爬虫实例
const myXCrawl = xCrawl({ maxRetry: 1, intervalTime: { max: 3000, min: 2000 } });


async function main () {
    let index = 1;

    let infoArr: infoType[] = []
    const pages = await myXCrawl.crawlPage(targets);
    for (const p of pages) {
        const { page, browser } = p.data
        console.log(`开始爬去第${index}页`);

        const list = await page.$$("body .case-item");
        for (const cardItem of list) {
            const viewCount = await cardItem.$eval("div.info > div.case-item-footer.clearfix > div.num > p:nth-child(1) > em", node => node.textContent?.trim())
            const commentCount = await cardItem.$eval("div.info > div.case-item-footer.clearfix > div.num > p:nth-child(2) > em", node => node.textContent?.trim());
            const link = await cardItem.$eval("div.info > div.text > h2 > a", node => node.getAttribute("href"));
            console.log('start link: ', link)
            if(link && commentCount && viewCount) {
                const detailInfo = await crawlDetail(myXCrawl, link, viewCount, commentCount);
               infoArr.push(detailInfo);
               console.log('before waiting ....'); 
               await new Promise((r) => setTimeout(r, 1000))
               console.log('after waiting ....');
            }
            
        }
        page.close();

        if(index === targets.length) {
            browser.close();
            saveToExcel(infoArr, `output-other.xlsx`);
        }
        index++;
    }
    
}
 main();



