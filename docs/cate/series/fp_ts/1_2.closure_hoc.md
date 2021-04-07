---
title: 闭包与高阶函数
time: 2021-04-03
author: ru shui
category: 系列文章
tag:
  - frontend
  - typescript
  - closure
  - hoc
  - functional programming
visitor: false
article: true
---

## 闭包

简单地说，闭包就是延长局部变量的作用域。
一般而言，在`js`中，外部作用域无法直接访问函数内部作用域，但是通过闭包延长局部变量作用域，使得函数外部也可以访问/修改函数内部的变量。从一个列子出发，理解闭包。

```ts
function outer() {
  let variable = 1

  return function inner(value?: number) {
    if (value) variable = value
    console.log(variable)
  }
}

const inner = outer()
inner()
inner(2)
```

分析上面的例子：`inner`内部又可以正常范围`outer`函数作用域下的变量，`outer`返回函数`inner`，通过这样的方式，我们间接实现了全局作用域访问`outer`函数内部作用域，也就是延长了函数内部的作用域，这就是闭包。

## 闭包与高阶函数

闭包与高阶函数搭配使用可以合成各种有用的工具函数，下面将介绍几个实用的工具函数：

- unary
- once
- memoized

### unary：限制变量

从一个示例出发，你觉得下面会输出什么：

```js
;['1', '2', '3'].map(parseInt)
```

答案是：`[1, NaN, NaN]`。这是因为这里的`parseInt`可以接收两个参数`(string, radix)`，由于`map`会将`index`传给`parseInt`的`radix`，导致出现此类错误。具体请看：[['1','2','3'].map(parseInt)的返回值是什么?](http://mp.weixin.qq.com/s?src=11&timestamp=1617435948&ver=2985&signature=qv6mZQKF7n3c981HeRFOY0Jy6*MTkW6bTU*-AceNVCRxLLgCHXk9ZLG0v3bPEe0qx441cwZss-hc1HHvCIENUd7BeEEEvXQw9I17XmiBbqaFDfFue6e9R99t9f4AzRtE&new=1)。
解决这一个问题的关键是在调用`parseInt`的时候，只传入一个参数，另一个参数`radix`为默认值。
而我们要介绍的`unary`就可以实现这样的功能，来看具体的实现：

```ts
export default function unary(fn: Function): any {
  return fn.length === 1 ? fn : (arg: any): any => fn(arg)
}
```

我们先判断传入函数的参数列表是否满足要求，如果不满足，则重新加工该函数，让其只能使用一个参数。

### once：一次函数

有时候，我们只需要运行一次给定的函数，我们可以通过闭包+高阶函数实现这个功能：

```ts
const once = (fn: any): any => {
  let done = false

  return function (...args: any[]): undefined | any {
    if (done) {
      return undefined
    }
    done = true
    return fn(...args)
  }
}
```

这里通过使用闭包，延长内部变量`done`的作用域，从而限制函数的多次执行。下面是测试代码：

```ts
test('once', () => {
  let count = 0
  const increasingOnce = once(() => {
    count++
  })
  increasingOnce()
  increasingOnce()
  increasingOnce()
  expect(count).toBe(1)
})
```

### memoized：实现缓存
在讲缓存之前，来看一个例子：
```ts
function factor(n: number): number {
  if (n <= 0) return n
  let result = 1;
  for (let i = 2; i <= n; ++i) {
    result *= i
  }
  return result
}

factor(1)
factor(2)
factor(3)
factor(4)
```
我们需要计算1-4的阶乘，于是我们需要连续使用`factor`，但是这里存在一个性能优化问题，我们知道`factor(2) = 2 * factor(1)`，那么我们能否充分利用之前已经求算过的结果？显然是可以的，只要我们创建一个缓存，将之前计算的结果缓存下来，就可以避免不必要的计算。具体的实现如下：
```ts{2,6}
export default function memoized(fn: any): any {
  const cache = Object.create(null)
  return function (this: any, arg: any) {
    // to debug
    // console.log(cache)
    return cache[arg] || (cache[arg] = fn.call(this, arg))
  }
}
```
核心代码为高亮部分，我们创建一个对象作为缓存，每次在执行函数之前，我们需要先去缓存中查看是否有之前计算的结果，如果存在直接返回之前的结果，如果不存在，则在返回结果之前，将其缓存下来以便后续的使用。

## 小结
通过本节的示例，我们可以看到闭包和高阶函数搭配使用，可以充分利用缓存，优化性能。