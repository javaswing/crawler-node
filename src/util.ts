import * as XLSX from "xlsx";
import * as fs from "fs";

function convertToNestedObject(obj: any): any {
  const newObj: any = {};
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(newObj, convertToNestedObject(obj[key]));
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

export function saveToExcel(data: any[], filename: string) {
  const newData = data.map(convertToNestedObject);
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(newData);

  // Define Chinese column names here
  const chineseColumnNames: { [key: string]: string } = {
    title: "标题",
    author: "作者",
    shape: "户型",
    area: "面积",
    style: "风格",
    money: "预算",
    address: "地区",
    introduction: "前言",
    job: "职业",
    age: "年龄",
    desc: "个人简介",
    content: "内容",
    currentUrl: "页面地址",
    viewCount: "浏览数",
    commentCount: "评论数"
  };

  // Map English column names to Chinese column names
  const headers = Object.keys(newData[0]).map(
    (key) => chineseColumnNames[key] || key
  );

  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, filename);
}

export function saveJson(data: string, filePath = "./data.json") {
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.error("Error writing JSON to file:", err);
    } else {
      console.log("Array successfully saved as JSON.");
    }
  });
}
