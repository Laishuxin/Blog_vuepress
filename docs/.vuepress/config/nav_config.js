const {
  pCateSeries,
  pCateEnvConfig,
  pCateBase,
  pRoot,
  pLife,
  pTag,
  pTimeline,
  pAbout,
} = require('./const')

const categoryItems = [
  { text: '前端基础', link: `${pCateBase}` },
  { text: '系列文章', link: `${pCateSeries}` },
  { text: '环境配置', link: `${pCateEnvConfig}` },
]

const config = [
  { text: '首页', link: pRoot },
  { text: '分类', items: categoryItems },
  { text: '生活', link: pLife },
  { text: '标签', link: pTag },
  { text: '归档', link: pTimeline },
  { text: '关于', link: pAbout },
]

module.exports = config
