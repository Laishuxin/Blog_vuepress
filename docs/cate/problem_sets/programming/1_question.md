---
title: question 1
time: 2021-04-13
author: ru shui
category: problem sets
tag:
  - frontend
  - problem set
visitor: false
article: true
---

将数组扁平化去除其中重复的数据，最终得到一个升序且不重复的数组。
测试用例：
`var arr = [ [ 1, 2, 2 ], [ 3, 4, 5, 5 ], [ 6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10 ]`

## 问题分析

1. 扁平化
   - 考虑手写一个 flatten
   - 利用 API：`Array.flat()`
2. 去重
   - 利用`Set`去重。
   - 利用`{}`去重。
3. 排序
   - 利用`Array.sort()`实现排序

## 问题解决

### 方案 1：取巧，通过 toString 实现扁平化

```ts
// 1. flatten
const flatArr = arr
  .toString()
  .split(',')
  .map((item) => parseInt(item))
console.log('flatArr = ')
console.log(flatArr)
// 2. duplicate
const duplicatedArr = Array.from(new Set(flatArr))
console.log('duplicatedArr = ')
console.log(duplicatedArr)
// 3. sort
const result = duplicatedArr.sort((a, b) => a - b)
console.log('result = ')
console.log(result)
```

函数式编程写法：

```ts
interface Handler {
  (arr: Array<any>): Array<any>
}
type PipeOut = (arr: Array<any>) => Array<any>

function flatten(arr: Array<any>): Array<any> {
  // return arr.flat(Infinity)
  return arr
    .toString()
    .split(',')
    .map((item) => parseInt(item))
}
function duplicate(arr: Array<any>): Array<any> {
  return Array.from(new Set(arr))
}
function sort(arr: Array<any>): Array<any> {
  return arr.sort((a, b) => a - b)
}

function pipe(...handlers: Handler[]): PipeOut {
  return (arg: Array<any>) => handlers.reduce((prev, curr) => curr(prev), arg)
}

const gen = pipe(flatten, duplicate, sort)
const result = gen(arr)
console.log('result = ')
console.log(result)
```

### 方案 2：手写 flatten

```ts
function flatten(arr: Array<any>, target: any[] = []): Array<any> {
  var isArray = Array.isArray
  for (var i = 0, len = arr.length; i < len; i++) {
    var v = arr[i]
    if (isArray(v)) {
      flatten(v, target)
    } else target.push(v)
  }
  return target
}
```
