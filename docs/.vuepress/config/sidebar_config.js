const { getFileNames, getFileNamesByGroups } = require('./utils')
const { resolve } = require('path')
const basePath = resolve(__dirname, '../../')

const sidebar = {
  '/cate/fe_base/html_base/': getCateFeBaseHtml(),
  '/cate/fe_base/css_base/': getCateFeBaseCss(),
  '/cate/fe_base/javascript_base/': getCateFeBaseJavascript(),
  '/cate/fe_base/typescript_base/': getCateFeBaseTypescript(),
  '/cate/fe_base/network_base/': getCateFeBaseNetwork(),
  '/cate/series/fp_ts/': getCateSeriesFpTs('函数式编程入门', '函数式编程进阶'),
  '/cate/series/encapsulation/': getCateSeriesEnc('网络请求相关'),
  '/cate/env_config/': getCateEnvConfig(),
  '/cate/series/': ['fp_ts'],
  '/cate/fe_base/': [
    'html_base/',
    'css_base/',
    'javascript_base/',
    'typescript_base/'
  ]
}

function getCateSeriesFpTs(groupA, groupB) {
  const fpTsPath = resolve(basePath, './cate/series/fp_ts/')
  const group = getFileNamesByGroups(fpTsPath, [groupA, groupB])
  return [
    {
      title: groupA,
      collapsable: false,
      children: group[groupA]
    },
    {
      title: groupB,
      collapsable: false,
      children: group[groupB]
    }
  ]
}

function getCateSeriesEnc(groupA) {
  return [
    {
      title: groupA,
      collapsable: false,
      children: ['axios', 'fetch']
    }
  ]
}

function getCateFeBaseHtml() {
  return ['layout', 'labels']
}

function getCateFeBaseCss() {
  return ['selector']
}

function getCateFeBaseJavascript() {
  const jsBasePath = resolve(basePath, './cate/fe_base/javascript_base')
  return getFileNames(jsBasePath)
}

function getCateFeBaseNetwork() {
  const networkBasePath = resolve(basePath, './cate/fe_base/network_base')
  return getFileNames(networkBasePath)
}

function getCateFeBaseTypescript() {
  return ['interface']
}

function getCateEnvConfig() {
  return ['vite_vue3_ts']
}

module.exports = sidebar
