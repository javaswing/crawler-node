import xCrawl from 'x-crawl';


const domain = "https://www.yidoutang.com/case-2300783.html";

const selectorArr: {selector: string, key: string, label: string}[] = [{
    selector: "> h1",
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


const myXCrawl = xCrawl({ maxRetry: 3,  crawlPage: { launchBrowser: { headless: true } }});

myXCrawl.crawlPage(domain).then(async (res) => {
    const { browser, page } = res.data;

    const n = await page.$eval("#caseDetail-main > h1", node => node.textContent);
    console.log('n', n)


    for (const selector of selectorArr) {
        const v = await page.$eval(`#caseDetail-main ${selector.selector}`, node => node.textContent);
        console.log(selector.key + " : " + v)
    }

    // 关闭浏览器
    browser.close()
});