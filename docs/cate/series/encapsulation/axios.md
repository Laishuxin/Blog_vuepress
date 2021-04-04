---
title: 封装axios
time: 2021-04-04
author: ru shui
category: 系列文章
tag:
  - frontend
  - typescript
  - encapsulation
  - axios
visitor: false
article: true
---
（本节代码存放于[axios封装]()）
命名规范：
一般而言，对网络请求相关的文件会存放在`api`文件夹中。对于`axios`一般命名为`http.js`或`http.ts`。

封装axios分为如下几个步骤：
+ 对请求的`url`进行封装。
  根据不同的环境设置不同的请求`url`。例如：在开发环境下，请求的`url`为`http://localhost:8080`。
+ 按照要求设置请求传递的数据格式。
  这个需要根据所给的api环境决定。
+ 设置拦截器
  + 设置请求拦截器。
  + 设置响应拦截器。
+ 其他。例如：对超时请求的处理，跨域是否携带凭证等。

这里，为了代码的简洁，我们为每一个步骤设定了一个函数，分别如下：
+ `setRequestUrl`
+ `setRequestDateType`
+ `setInterceptor`
  + `setRequestInterceptor`
  + `setResponseInterceptor`
+ `setOthers`

这样整个封装过程就是一个填写函数的过程，下面给出初步的代码：
```ts
// @/api/http.ts
import axios, { AxiosStatic } from 'axios'

const setRequestUrl = (axios: AxiosStatic): void => {}

const setRequestInterceptor = (axios: AxiosStatic): void => {}

const setResponseInterceptor = (axios: AxiosStatic): void => {}


const setInterceptor = (axios: AxiosStatic): void => {
  setRequestInterceptor(axios)
  setResponseInterceptor(axios)
}
const setRequestDataType = (
  axios: AxiosStatic,
  type: 'urlencoded' | 'json' = 'json',
): void => {}

const setOthers = (axios: AxiosStatic): void => {}

setRequestUrl(axios)
setInterceptor(axios)
setRequestDataType(axios)
setOthers(axios)

export default axios
```

## 封装请求url
```ts
const setRequestUrl = (axios: AxiosStatic): void => {
  let baseUrl: string
  const env = process.env.NODE_ENV
  switch (env) {
    case 'production':
      baseUrl = 'https://production:port'
      break;
    case 'test':
      baseUrl = 'http://test:port'
    default:
      baseUrl = 'http://development:port'
  }
  axios.defaults.baseURL = baseUrl
}
```
这里的url需要根据具体的情况而定，有些项目使用到类似于`dotenv`的工具，这里只需要修改特定环境下的请求`url`即可。
## 封装请求数据格式
```ts
const setRequestDataType = (
  axios: AxiosStatic,
  type: 'urlencoded' | 'json' = 'json',
): void => {
  let contentType: string
  switch (type) {
    case 'urlencoded':
      contentType = 'application/x-www-form-urlencoded'
      axios.defaults.transformRequest = (data) => qs.stringify(data)
      break
    default:
      contentType = 'application/json;charset=utf-8'
      axios.defaults.transformRequest = (data) => JSON.stringify(data)
  }
  axios.defaults.headers['Content-Type'] = contentType
}
```
这里可以设置不同的数据格式，需要根据服务器请求要求。
值得注意的是，如果发送请求的数据格式为`urlencoded`，需要借助`qs`进行数据格式转换。

## 封装拦截器
### 封装请求拦截器
```ts
const setRequestInterceptor = (axios: AxiosStatic): void => {
  axios.interceptors.request.use(
    config => {
      let token = localStorage.getItem('token')
      token && (config.headers['Authorization'] = token)
      return config
    },
    err => Promise.reject(err)
  )
}
```
常见的请求拦截器就是在发送请求时，携带对应的`token`字段，出现异常直接向外抛，让使用者自行处理。具体需要根据`api`的要求。
### 封装响应拦截器
响应拦截器会相对复杂一些。
首先，对响应结果进行判断，如果结果正常，我们就直接返回响应的数据。如果出现异常，我们则对异常进行处理即可。
由于对异常的处理比较繁琐，我们直接使用一个函数进行封装。
```ts
  axios.interceptors.response.use(
    (response) => response.data,
    (err) => handleResponseError(err)
  )
```

接下来就是具体异常的处理。我们先根据`api`文档的规范，判断服务器是否返回数据。如果是，则说明我们发送的请求服务器已经收到了，但是存在某些原因。否则，说明客户端发送的请求服务器没有接收到，可能是断网或者其他原因。下面给出参考，具体的实现可以根据需要进行修改：
```ts
const handleResponseErrorByStatus = (response: any) => {
  const status: number = response.status
  switch (status) {
    case 401: // 权限问题，未登录/需要验证
      break
    case 403: //服务器拒绝执行：token/Credential过期
      break
    case 404: // 找不到页面
      break
  }
}

const handleResponseError = (err: any): Promise<any> => {
  // 具体的响应字段需要根据api的设置，如果存在响应，
  // 只是说明发送请求成功，但是可能是参数或者其他原因
  // 导致服务器不能正确返回结果
  const response = err.response
  if (response) {
    // 具体字段需要根据api设置
    handleResponseErrorByStatus(response)
  } else {
    // 客户端断网，导致没能获取到服务器的请求
    if (!window.navigator.onLine) {
    }
  }
  return Promise.reject(err)
}
```
整体的代码如下：

```ts
const handleResponseErrorByStatus = (response: any) => {
  const status: number = response.status
  switch (status) {
    case 401: // 权限问题，未登录/需要验证
      break
    case 403: //服务器拒绝执行：token/Credential过期
      break
    case 404: // 找不到页面
      break
  }
}

const handleResponseError = (err: any): Promise<any> => {
  // 具体的响应字段需要根据api的设置，如果存在响应，
  // 只是说明发送请求成功，但是可能是参数或者其他原因
  // 导致服务器不能正确返回结果
  const response = err.response
  if (response) {
    // 具体字段需要根据api设置
    handleResponseErrorByStatus(response)
  } else {
    // 客户端断网，导致没能获取到服务器的请求
    if (!window.navigator.onLine) {
    }
  }
  return Promise.reject(err)
}

const setResponseInterceptor = (axios: AxiosStatic): void => {
  axios.interceptors.response.use(
    (response) => response.data,
    (err) => handleResponseError(err),
  )
}
```

## 其他
例如设置超时请求时间等：
```ts
const setOthers = (axios: AxiosStatic): void => {
  axios.defaults.timeout = 10000
  axios.defaults.withCredentials = true
}
```