const { pCate } = require("./nav_path")

const categorySeriesGroup = {
  title: '系列文章',
  path: pCate,
  children: []
}

const sidebar = [
  categorySeriesGroup
]

module.exports = sidebar
