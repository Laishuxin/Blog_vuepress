const timestamp = [
  [
    '@vuepress/last-updated',
    {
      transformer: (timestamp) => {
        // 不要忘了安装 moment
        const moment = require('moment')
        return moment(timestamp).format('yyyy-MM-DD HH:mm:ss')
      },
    },
  ],
]

const plugins = [timestamp]

module.exports = plugins
