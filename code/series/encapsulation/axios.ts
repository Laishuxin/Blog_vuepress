import axios, { AxiosRequestConfig, AxiosStatic } from 'axios'
import qs from 'qs'
const setRequestUrl = (axios: AxiosStatic): void => {
  let baseUrl: string
  const env = process.env.NODE_ENV
  switch (env) {
    case 'production':
      baseUrl = 'https://production:port'
      break
    case 'test':
      baseUrl = 'http://test:port'
    default:
      baseUrl = 'http://development:port'
  }
  axios.defaults.baseURL = baseUrl
}

const setRequestInterceptor = (axios: AxiosStatic): void => {
  axios.interceptors.request.use(
    (config) => {
      let token = localStorage.getItem('token')
      token && (config.headers['Authorization'] = token)
      return config
    },
    (err) => Promise.reject(err),
  )
}

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

const setInterceptor = (axios: AxiosStatic): void => {
  setRequestInterceptor(axios)
  setResponseInterceptor(axios)
}

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

const setOthers = (axios: AxiosStatic): void => {
  axios.defaults.timeout = 10000
  axios.defaults.withCredentials = true
}

setRequestUrl(axios)
setInterceptor(axios)
setRequestDataType(axios)
setOthers(axios)

export default axios
