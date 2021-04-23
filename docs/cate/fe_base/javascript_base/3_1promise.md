---
title: Promise原型方法的实现
time: 2021-04-16
author: ru shui
category: 前端基础
tag:
  - frontend
  - javascript
  - promise
visitor: false
article: true
---

## Promise.Prototype.resolve

> Promise.resolve(value)方法返回一个以给定值解析后的 Promise 对象。如果这个值是一个 promise ，那么将返回这个 promise ；如果这个值是 thenable（即带有"then" 方法），返回的 promise 会“跟随”这个 thenable 的对象，采用它的最终状态；否则返回的 promise 将以此值完成。此函数将类 promise 对象的多层嵌套展平。-- MDN

事实上，`Promise.resolve`可以借助`Promise`的构造函数简单实现：

```js
Promise.prototype.resolve = (value) => new Promise((resolve) => resolve(value))
```

## Promise.prototype.reject

> Promise.reject()方法返回一个带有拒绝原因的 Promise 对象。--MDN

同`Promise.resolve`，`Promise.reject`只需要将`new Promise(resolve, reject)`第一个参数`resolve`忽略即可。

```js
Promise.prototype.reject = (reason) =>
  new Promise((_, reject) => reject(reason))
```

## Promise.catch

> catch() 方法返回一个 Promise (en-US)，并且处理拒绝的情况。它的行为与调用 Promise.prototype.then(undefined, onRejected) 相同。 (事实上, calling obj.catch(onRejected) 内部 calls obj.then(undefined, onRejected)). --MDN

`Promise.catch`可以通过调用`promise.then(_, onrejected)`实现。需要注意的是调用的对象是`promise`示例，而不是`Promise`构造函数。

```js
promise.then((value) => value).catch((err) => err)
// 等价于
promise.then((value) => value).then(_, (err) => err)
```

## Promise.prototype.all

> Creates a Promise that is resolved with an array of results when all of the provided Promises resolve, or rejected when any Promise is rejected.
> `Promise.prototype.all`注意事项：

1. 数组中的成员如果为 Promise 时，会执行其 resolve 方法，如果不是 Promise 则会添加的返回值中。
2. resolve 的顺序问题。Promise.all 会按照原先的顺序进行 resolve。
3. 成功：resolved value is an array. 失败：rejected 第一个失败的 Promise。
4. 无论成功与否，`Promise.all`都会尝试 resolve 传入的数组中所有的成员。

```js
function test1() {
  const arr = [1, Promise.resolve(2), 3, Promise.resolve(4)]
  Promise.all(arr).then(
    (value) => console.log('resolved value :', value),
    (reason) => console.log('rejected reason = ', reason)
  )
}

function test2() {
  const arr = [1, Promise.resolve(2), Promise.reject(3), Promise.resolve(4)]
  Promise.all(arr).then(
    (value) => console.log('resolved value :', value),
    (reason) => console.log('rejected reason = ', reason)
  )
}

function test3() {
  const arr = [
    1,
    new Promise((resolve) => setTimeout(() => resolve(2), 1000)),
    3
  ]
  Promise.all(arr).then(
    (value) => console.log('resolved value :', value),
    (reason) => console.log('rejected reason = ', reason)
  )
}

function test4() {
  const arr = [
    1,
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('promise 2 is running.')
        reject(2)
      })
    }),
    3
  ]
  Promise.all(arr).then(
    (value) => console.log('resolved value :', value),
    (reason) => console.log('rejected reason = ', reason)
  )
}

test1() // resolved value: [1, 2, 3, 4]
test2() // rejected reason = 3
test3() // [1, 2, 3]
test4() // promise 2 is running. rejected reason 2
```

### version1

```js
function PromiseAll(arr = []) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(arr)) {
      reject(new TypeError('Parameter should be an array.'))
    }

    const length = arr.length
    let counter = 0

    const result = Array(length)
    for (let i = 0; i < length; i++) {
      Promise.resolve(arr[i]).then((value) => {
        counter++
        result[i] = value

        counter === length && resolve(result)
      }, reject)
    }
  })
}
```

1. 首先，Promise.all 返回的是一个 Promise。
2. 其次，Promise.all 的传入参数需要进行判断。其传入参数应该为可迭代对象（这里用数组代替）。
3. 最后，最重要的是返回值的时机，判断返回的时机需要用到`counter`而不能是，迭代时的计数`i`，这与 Promise 异步执行有关。

### version2

```js
const isIterable = (obj) =>
  obj !== null && typeof obj[Symbol.iterator] === 'function'
/**
 * @param {Iterable} iterable
 * @returns { Promise<any> }
 */
function PromiseAll(iterable) {
  return new Promise((resolve, reject) => {
    if (!isIterable(iterable)) {
      return reject(new TypeError(`${iterable} is not iterable`))
    }

    let counter = 0
    const length = iterable.length
    const result = Array(length)
    iterable.forEach((item, index) => {
      Promise.resolve(item).then((value) => {
        result[index] = value
        ++counter === length && resolve(result)
      }, reject)
    })
  })
}
```

## Promise.race

```js
function PromiseRace(promises) {
  return new Promise((resolve, reject) => {
    if (!isIterable(promises)) {
      reject(new TypeError(` is not iterable`))
    }

    for (const p of promises) {
      Promise.resolve(p).then(resolve, reject)
    }
  })
}
```

## Promise.finally

```js
Promise.prototype.finally = function (callback) {
  return this.then(
    (value) => Promise.resolve(callback()).then(() => value),
    (reason) =>
      Promise.resolve(callback()).then(() => {
        throw reason
      })
  )
}
```

## Promise.done

```js
Promise.prototype.done = function (onFulfilled, onRejected) {
  this.then(onFulfilled, onRejected).catch((err) => {
    setTimeout(() => {
      throw err
    }, 0)
  })
}
```
