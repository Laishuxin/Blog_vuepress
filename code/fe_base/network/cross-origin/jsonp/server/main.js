/* main.js */

const express = require('express')

const SERVER_PORT = 8080
const app = express()

app.get('/api', (req, res) => {
  let { callback = Function.prototype } = req.query
  const data = {
    name: 'foo',
    age: 18
  }
  res.end(`${callback}(${JSON.stringify(data)})`)
})
app.listen(SERVER_PORT, () => {
  console.log(`server is running at http://localhost:${SERVER_PORT}`)
})
