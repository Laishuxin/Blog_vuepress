---
title: Promise进行缓存
time: 2021-04-22
author: ru shui
category: 前端基础
tag:
  - frontend
  - javascript
  - promise
visitor: false
article: true
---

实现一个类似于 memoized 的函数，其缓存的 value 为 Promise

## 基于装饰器实现缓存

```ts
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
```
