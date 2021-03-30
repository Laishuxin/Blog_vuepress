const head = require('./config/head_config')
const nav = require('./config/nav_config')
const plugins = require('./config/plugins_config')
const sidebar = require('./config/sidebar_config')

module.exports = {
  base: '/Blog_vuepress',
  title: 'ru shui',
  description: `ru shui's blog`,
  head,
  themeConfig: {
    lastUpdated: '更新时间',
    sidebar,
    nav,
    plugins,
  },
}
