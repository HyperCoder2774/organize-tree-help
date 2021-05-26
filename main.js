#!/usr/bin/env node

let inputArr = process.argv.slice(2);
let fs = require("fs");
let path = require("path");
// console.log(inputArr);

let types = {
  media: ["mp4", "mkv", "webm"],
  archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
  documents: ["docx", "doc", "pdf", "xlsx", "xls", "txt", "blend"],
  app: ["exe", "dmg", "pkg", "deb"],
  photo: ["png", "jpg", "jpeg"],
};

let command = inputArr[0];
switch (command) {
  case "tree":
    treeFn(inputArr[1]);
    break;
  case "organize":
    organizeFn(inputArr[1]);
    break;
  case "help":
    helpFn(inputArr[1]);
    break;
  default:
    console.log("Please 🙏🙏 give right command");
    break;
}

function treeFn(dirPath) {
  if (dirPath == undefined) {
    console.log("Please Give the Path");
  } else {
    let doesPath = fs.existsSync(dirPath);
    if (doesPath) {
      treeHelper(dirPath, "");
    } else {
      console.log("Please Give correct Path");
    }
  }
}

function treeHelper(dirPath, indent) {
  let isFile = fs.lstatSync(dirPath).isFile();
  if (isFile) {
    let fileName = path.basename(dirPath);
    console.log(indent, "|---", fileName);
  } else {
    let dirName = path.basename(dirPath);
    console.log(indent, "`---", dirName);
    let childrens = fs.readdirSync(dirPath);
    for (let i = 0; i < childrens.length; i++) {
      let childPath = path.join(dirPath, childrens[i]);
      treeHelper(childPath, indent + "\t");
    }
  }
}

function organizeFn(dirPath) {
  let desPath;
  if (dirPath == undefined) {
    console.log("Please Give the Path");
  } else {
    let doesPath = fs.existsSync(dirPath);
    if (doesPath) {
      desPath = path.join(dirPath, "organize_file");
      if (fs.existsSync(desPath) === false) {
        fs.mkdirSync(desPath);
      }
    } else {
      console.log("Please Give correct Path");
    }
  }
  organizeHelper(dirPath, desPath);
}

function organizeHelper(dir, des) {
  let childNames = fs.readdirSync(dir);
  for (let i = 0; i < childNames.length; i++) {
    let childAddress = path.join(dir, childNames[i]);
    let isFile = fs.lstatSync(childAddress).isFile();
    if (isFile) {
      let category = getCategory(childNames[i]);
      sendFiles(childAddress, des, category);
    }
  }
}

function sendFiles(srcPath, des, category) {
  let categoryPath = path.join(des, category);
  if (fs.existsSync(categoryPath) == false) {
    fs.mkdirSync(categoryPath);
  }
  let fileName = path.basename(srcPath);
  let desPath = path.join(categoryPath, fileName);
  fs.copyFileSync(srcPath, desPath);
  fs.unlinkSync(srcPath);
}

function getCategory(name) {
  let ext = path.extname(name);
  ext = ext.slice(1);
  for (let type in types) {
    let Arry = types[type];
    for (let i = 0; i < Arry.length; i++) {
      if (ext == Arry[i]) {
        return type;
      }
    }
  }
  return "other";
}

function helpFn(dirPath) {
  console.log(`
    List of All the Commands:
        node main.js tree "dirPath"
        node main.js organize "dirPath"
        node main.js help
    `);
}
