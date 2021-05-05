// ---------------------------------------------------
// axios types
interface AxiosRequestConfig {
  url: string
}

interface AxiosResponse {
  data: any
}

interface AxiosPromise extends Promise<AxiosResponse> {}

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  return Promise.resolve({
    data: `Done: ${config.url}`
  })
}
// -----------------------------------------------------

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface ResolvedFn<T> {
  (val: T): T
}

interface RejectedFn<T = any> {
  (error: T): any
}

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

class InterceptorManager<T> {
  private readonly interceptors: Array<Interceptor<T> | null> = []

  /**
   * Use an interceptor and return its id.
   * @param resolved resolved callback
   * @param rejected  rejected callback
   * @returns Interceptor id.
   */
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({ resolved, rejected })
    return this.interceptors.length - 1
  }

  eject(id: number): void {
    if (this.interceptors[id]) this.interceptors[id] = null
  }

  forEach(callback: (interceptor: Interceptor<T>) => any) {
    this.interceptors.forEach((interceptor) => {
      interceptor && callback(interceptor)
    })
  }
}

// implementation
interface PromiseChainNode<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

class Axios {
  interceptors: Interceptors

  constructor() {
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  /**
   * Make a request
   */
  request(config: AxiosRequestConfig): AxiosPromise {
    let promise = Promise.resolve(config)

    const chain: PromiseChainNode<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    this.interceptors.request.forEach((interceptor) => {
      chain.unshift(interceptor)
    })

    this.interceptors.response.forEach((interceptor) => {
      chain.push(interceptor)
    })

    while (chain.length) {
      const { resolved, rejected } = chain.shift()
      promise = promise.then(resolved, rejected)
    }
    return promise as any
  }
}

const axios = new Axios()

function test1() {
  axios.interceptors.request.use(
    (config) => {
      config.url += '-1'
      return config
    },
    (error) => {
      console.error(`request nterceptor 1: ${error}`)
    }
  )

  axios.interceptors.request.use(
    (config) => {
      config.url += '-2'
      return config
    },
    (error) => {
      console.error(`request interceptor 2: ${error}`)
    }
  )

  axios.interceptors.response.use(
    (res) => {
      res.data += '--1'
      return res
    },
    (error) => console.error(`response interceptor 1: ${error}`)
  )

  axios.interceptors.response.use(
    (res) => {
      res.data += '--2'
      return res
    },
    (error) => console.error(`response interceptor 2: ${error}`)
  )

  axios
    .request({ url: 'test1' })
    .then((value) => console.log('value = ', value))
    .catch((err) => console.error('error = ', err))
}

function test2() {
  axios.interceptors.request.use(
    (config) => {
      config.url += '-1'
      return config
    },
    (error) => {
      console.error(`request nterceptor 1: ${error}`)
    }
  )

  const id = axios.interceptors.request.use(
    (config) => {
      config.url += '-2'
      return config
    },
    (error) => {
      console.error(`request interceptor 2: ${error}`)
    }
  )

  axios.interceptors.response.use(
    (res) => {
      res.data += '--1'
      return res
    },
    (error) => console.error(`response interceptor 1: ${error}`)
  )

  axios.interceptors.response.use(
    (res) => {
      res.data += '--2'
      return res
    },
    (error) => console.error(`response interceptor 2: ${error}`)
  )

  axios.interceptors.request.eject(id)
  axios
    .request({ url: 'test2' })
    .then((value) => console.log('value = ', value))
    .catch((err) => console.error('error = ', err))
}
// test1()
test2()
