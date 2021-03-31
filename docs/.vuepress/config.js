require('dotenv').config()
const { config } = require('vuepress-theme-hope')
const head = require('./config/head_config')
const nav = require('./config/nav_config')
const sidebar = require('./config/sidebar_config')
const BLOG_AUTHOR = process.env.BLOG_AUTHOR || 'ru shui'

module.exports = config({
  base: '/Blog_vuepress/',
  lang: 'zh-CN',
  title: '君子之交淡如水',
  description: `To Build Amazing Things!`,
  theme: 'vuepress-theme-hope',
  head,
  themeConfig:{
    author: BLOG_AUTHOR,
    logo: '/assets/img/logo.png',
    blog: {
      sidebarDisplay: true,
      roundAvatar:false,
    },
    nav,
    sidebar,
    nextLinks: true,
    prevLinks: true,
    breadcrumb: true,
    darkmode: 'switch',
    backToTop: true,
    copyCode: false,
    photoSwipe: true,
    copyright: {
      status: 'local',
      minLength: 200,
    },
    comment: {
      type: 'vssue',
    },
    themeColor: { blue: '#2196f3' },
    mdEnhance: {
      tex: true,
      lineNumbers: true,
      presentation: true,
      align: true,
      footnote: true,
    },
  },
})
