const nav = [
  {
    text: '首页',
    link: '/',
  },
  {
    text: '分类',
    link: '/category/',
    ariaLabel: '分类',
    items: [
      {
        text: '前端基础',
        // link: '/category/fe_base',
        items: [
          { text: 'html', link: '/cate/fe_base/html_base/' },
          { text: 'css', link: '/cate/fe_base/css_base/' },
          { text: 'javascript', link: '/cate/fe_base/javascript_base/' },
          { text: 'typescript', link: '/cate/fe_base/typescript_base/' },
        ],
      },
      {
        text: '系列文章',
        // link: '/category/series/',
        items: [
          { text: '函数式编程', link: '/cate/series/fp_ts/' },
          { text: '常用工具封装', link: '/cate/series/encapsulation/' },
        ],
      },
      {
        text: '环境配置',
        // link: '/category/env_config/',
        items: [{ text: '项目环境配置', link: '/cate/env_config/' }],
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
