/* eslint-disable no-undef */

const { readdirSync } = require('fs');
const { resolve } = require('path');

/**
 * 获取主 JS 和 CSS 文件名
 */
function getMainStaticFileName() {
  let mainCssFileName = '';
  let mainJsFileName = '';

  const fileNameList = readdirSync(resolve('./dist'));
  for (const fileName of fileNameList) {
    if (/umi.*.css/.test(fileName)) {
      mainCssFileName = fileName;
    } else if (/umi.*.js/.test(fileName)) {
      mainJsFileName = fileName;
    }
  }

  if (mainCssFileName === '' || mainJsFileName === '') {
    throw new Error('找不到主静态文件');
  }

  return { mainCssFileName, mainJsFileName };
}

/**
 * 获取 HTML 字符串
 */

exports.getHtmlByConfig = function(configString) {
  const { mainCssFileName, mainJsFileName } = getMainStaticFileName();
  return `<!DOCTYPE html><html><head><link rel="icon" href="https://cdn.wul.ai/file-analyze/logo.png" type="image/x-icon"/><link rel="stylesheet" href="/${mainCssFileName}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no"><title>UiBot AI能力平台</title><script>window.routerBase = "/";window.config=${configString};</script></head><body><div id="root"></div><script src="/${mainJsFileName}"></script></body></html>`;
};
