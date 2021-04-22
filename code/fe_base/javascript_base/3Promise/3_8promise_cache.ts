/* 3_8promise_cache.js */

function enableCache(
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) {
  const map = new Map<string, Promise<any> | null>()
  const func = descriptor.value

  descriptor.value = async function (...args: any[]) {
    const key = name + JSON.stringify(args)
    // cache not exists and make cache
    if (!map.get(key)) {
      try {
        map.set(key, Promise.resolve(func.apply(this, args)))
      } catch (err) {
        map.set(key, null)
      }
    }

    return map.get(key)
  }
  return descriptor
}

// helper class
class HttpRequest {
  @enableCache
  static async getUser(username: string): Promise<string | null> {
    return `hello, ${username}`
  }
}

HttpRequest.getUser('aaa')
  .then((value) => console.log('value = ', value))
  .catch((err) => console.log('err = ', err))
HttpRequest.getUser('bbb')
  .then((value) => console.log('value = ', value))
  .catch((err) => console.log('err = ', err))
HttpRequest.getUser('aaa')
  .then((value) => console.log('value = ', value))
  .catch((err) => console.log('err = ', err))
HttpRequest.getUser('aaa')
  .then((value) => console.log('value = ', value))
  .catch((err) => console.log('err = ', err))

/**
 * value =  hello, aaa
 * value =  hello, bbb
 * value =  hello, aaa
 * value =  hello, aaa
 */