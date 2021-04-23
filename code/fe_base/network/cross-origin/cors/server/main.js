const express = require('express')
const CONFIG_APP = {
  port: 8088
}
const CONFIG_CORS = {
  allowOrigin: '*',
  credentials: true,
  headers: 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With',
  methods: 'PUT,POST,GET,HEAD,DELETE,OPTIONS,HEAD'
}
const app = express()
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', CONFIG_CORS.allowOrigin)
  res.header('Access-Control-Allow-Credentials', CONFIG_CORS.credentials)
  res.header('Access-Control-Allow-Methods', CONFIG_CORS.methods)
  res.header('Access-Control-Allow-Headers', CONFIG_CORS.headers)

  if (req.method === 'OPTIONS') res.send('OK')
  next()
})

app.get('/user', (req, res) => {
  const data = {
    name: 'foo',
    type: 'testing'
  }

  res.json(data)
})

app.listen(CONFIG_APP, () => {
  console.log(`server is running at http://localhost:${CONFIG_APP.port}`)
})
