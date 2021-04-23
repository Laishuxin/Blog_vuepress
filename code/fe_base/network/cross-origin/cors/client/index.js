// const axios = require('axios')
const SERVER_ADDR = 'http://localhost:8088'

axios.defaults.headers['Content-Type'] = 'application/json'

axios
  .get(SERVER_ADDR + '/user', {
    name: 'xx'
  })
  .then((value) => console.log('value = ', value))
  .catch((err) => console.log('err = ', err))

axios
  .get('https://www.zhihu.com/api/v4/stickers')
  .then((value) => console.log('value from zhihu: ', value))
  .catch((err) => console.log('err from zhihu: ', err))
