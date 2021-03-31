const sidebar = {
  '/categories/fe_base/html_base/': getcategoriesFeBaseHtml(),
  '/categories/fe_base/css_base/': getcategoriesFeBaseCss(),
  '/categories/fe_base/javascript_base/': getcategoriesFeBaseJavascript(),
  '/categories/fe_base/typescript_base/': getcategoriesFeBaseTypescript(),
  '/categories/series/fp_ts/': getcategoriesSeriesFpTs(
    '函数式编程入门',
    '函数式编程进阶',
  ),
  '/categories/env_config/': getcategoriesEnvConfig(),
  '/categories/series/': ['fp_ts'],
  '/categories/fe_base/': [
    'html_base/',
    'css_base/',
    'javascript_base/',
    'typescript_base/',
  ],
}

function getcategoriesSeriesFpTs(groupA, groupB) {
  return [
    {
      title: groupA,
      collapsable: false,
      children: ['0_setup', '1_hoc'],
    },
    {
      title: groupB,
      collapsable: false,
      children: ['10_monad'],
    },
  ]
}

function getcategoriesFeBaseHtml() {
  return ['layout', 'labels']
}

function getcategoriesFeBaseCss() {
  return ['selector']
}

function getcategoriesFeBaseJavascript() {
  return ['this']
}

function getcategoriesFeBaseTypescript() {
  return ['interface']
}

function getcategoriesEnvConfig() {
  return ['vite_vue3_ts']

}

module.exports = sidebar
