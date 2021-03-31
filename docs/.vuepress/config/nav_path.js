const rootPath = '/'
const seriesPath = '/series/'
const aboutPath = '/about/'
const tagPath = '/tag/'
const timelinePath = '/timeline/'

const seriesSubItemsPath = {
  envConfig: `${seriesPath}env_config/`,
  feBase: `${seriesPath}fe_base/`,
  fp_ts: `${seriesPath}fp_ts/`,
}

const rootItem = {
  text: '首页',
  link: rootPath,
}

const seriesSubItems = [
  { text: '前端基础', link: seriesSubItemsPath.feBase },
  { text: '函数式编程', link: seriesSubItemsPath.fp_ts },
  { text: '环境配置', link: seriesSubItemsPath.envConfig },
]

const seriesItem = {
  text: '系列文章',
  // link: seriesPath,
  items: seriesSubItems,
}

const aboutItem = {
  text: '关于',
  link: aboutPath,
}

const tagItem = {
  text: '标签',
  link: tagPath,
}

const timelineItem = {
  text: '归档',
  link: timelinePath,
}

module.exports = {
  rootPath,
  seriesPath,
  aboutPath,
  rootItem,
  seriesItem,
  aboutItem,
  tagItem,
  timelineItem,
}
