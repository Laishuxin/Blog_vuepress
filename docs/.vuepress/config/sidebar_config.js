const sidebar = {
  '/cate/fe_base/html_base/': getCateFeBaseHtml(),
  '/cate/fe_base/css_base/': getCateFeBaseCss(),
  '/cate/fe_base/javascript_base/': getCateFeBaseJavascript(),
  '/cate/fe_base/typescript_base/': getCateFeBaseTypescript(),
  '/cate/series/fp_ts/': getCateSeriesFpTs('函数式编程入门', '函数式编程进阶'),
  '/cate/series/encapsulation/': getCateSeriesEnc('网络请求相关'),
  '/cate/env_config/': getCateEnvConfig(),
  '/cate/series/': ['fp_ts'],
  '/cate/fe_base/': [
    'html_base/',
    'css_base/',
    'javascript_base/',
    'typescript_base/',
  ],
}

function getCateSeriesFpTs(groupA, groupB) {
  return [
    {
      title: groupA,
      collapsable: false,
      children: [
        '0_setup',
        '1_hoc',
        '2_closure_hoc',
        '3_fp_array',
        '4_curry_partial',
      ],
    },
    {
      title: groupB,
      collapsable: false,
      children: ['10_todo'],
    },
  ]
}

function getCateSeriesEnc(groupA) {
  return [
    {
      title: groupA,
      collapsable: false,
      children: ['axios', 'fetch'],
    },
  ]
}

function getCateFeBaseHtml() {
  return ['layout', 'labels']
}

function getCateFeBaseCss() {
  return ['selector']
}

function getCateFeBaseJavascript() {
  return ['event_loop']
}

function getCateFeBaseTypescript() {
  return ['interface']
}

function getCateEnvConfig() {
  return ['vite_vue3_ts']
}

module.exports = sidebar
