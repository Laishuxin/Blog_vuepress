const nav = [
  {
    text: '首页',
    link: '/',
  },
  {
    text: '分类',
    ariaLabel: '分类',
    items: [
      {
        text: '前端基础',
        items: [
          { text: 'html', link: '/categories/fe_base/html_base/' },
          { text: 'css', link: '/categories/fe_base/css_base/' },
          { text: 'javascript', link: '/categories/fe_base/javascript_base/' },
          { text: 'typescript', link: '/categories/fe_base/typescript_base/' },
        ],
      },
      {
        text: '系列文章',
        items: [{ text: '函数式编程', link: '/categories/series/fp_ts/' }],
      },
      {
        text: '环境配置',
        items: [{ text: '项目环境配置', link: '/categories/env_config/' }],
      },
    ],
  },
  {
    text: '标签',
    link: '/tag/',
  },
  {
    text: '归档',
    link: '/timeline/',
  },
  {
    text: '关于',
    link: '/about/',
  },
]

module.exports = nav
