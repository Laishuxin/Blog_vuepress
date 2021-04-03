---
title: 高阶函数
time: 2021-04-01
author: ru shui
category: 系列文章
tag:
  - frontend
  - typescript
  - function programming
  - base
visitor: false
article: true
---

## 何为高阶函数(higher function, HOC)

> 高阶函数就是定义抽象。也有一些教程，把参数/返回值为函数的函数称之为高阶函数。

### 从 forEach 理解抽象

在 javascript 中，如果要遍历一个数组，我们可以使用如下代码：

```js
for (let i = 0; i < arr.length; i++) {
  doSomething(arr[i])
}
```

这样的代码并没有什么高明之处。但是，我们可以将其抽离成一个函数，方便后续的调用？
答案显然是可以的：

```ts
// @/1_hoc/forEach.ts
export interface ForEachCallback<T> {
  (value: T, index: number, arr: T[]): any
}

export function forEach<T = any>(arr: Array<T>, callback: ForEachCallback<T>) {
  for (let i = 0, len = arr.length; i < len; i++) {
    callback(arr[i], i, arr)
  }
}
```

这样我们就把遍历数组的方法抽象出来，顾名思义该方法的作用就是遍历数组，我们不需要考虑内部是如何实现的。
于是乎，我们就可以通过`forEach(arr, doSomething)`来完成我们之前的工作。这样使得代码更加简洁，而且提高代码的复用性。

同样的办法，我们也可以作用与对象上：

```ts
// @/1_hoc/forEach.ts
export interface MyObject<T = any> {
  [key: string]: T
}

export interface ForEachObjectCallback<T> {
  (value: T, key: string, obj: MyObject): any
}

export function forEachObject<T = any>(
  obj: MyObject<T>,
  callback: ForEachObjectCallback<T>,
) {
  let keys = Object.keys(obj)
  for (const key of keys) {
    callback(obj[key], key, obj)
  }
}
```

### 流程控制

有了高阶函数，我们就会变得更加函数式。为此，我们也可以将控制流程抽离成一个高阶函数。
来看下面的一个例子：我们创建一个断言函数，如果断言成功则执行 callback，断言失败，则不执行。

```ts
// @/src/1_hoc/unless.ts
export function unless(condition: boolean, callback: Function) {
  condition && callback()
}
```

有了`unless`，我们可以编写一段代码，在全为数字的数组中找出所有的偶数：

```ts
forEach([1, 2, 3, 4], (value) => {
  unless(value % 2 === 0, () => console.log(`${value} is even`))
})
```

### 真实的高阶函数

上面通过几个简单的例子引出了高阶函数的概念。
下面将从简单的高阶函数开始，逐步引进复杂的高阶函数。

#### every

在日常开发中，我们可以需要对数组中的元素进行校验，例如：判断数组中的所有元素是否为偶数。于是引出了`every`高阶函数：

```ts
// @/src/1_hoc/every.ts
export default function every<T = any>(
  arr: T[],
  fn: (item: T, index?: number, arr?: T[]) => boolean,
): boolean {
  let result = true
  for (let i = 0; i < arr.length; ++i) {
    result = result && fn(arr[i], i, arr)
    if (!result) break
  }
  return result
}
```

这里将初始值设置为`result = true`，为了便捷，当`result = false`时直接退出循环，核心代码为`result = result && fn(arr[i], i, arr)`。

简单地测试一把：

```ts
test('every', () => {
  const arr = Array(10).fill(0)
  const naturalArr = arr.map((value, index) => index)
  const eventArr = arr.map((value, index) => index * 2)

  expect(
    every(naturalArr, (value) => {
      return value % 2 === 0
    }),
  ).toBeFalsy()

  expect(
    every(eventArr, (value) => {
      return value % 2 === 0
    }),
  ).toBeTruthy()
})
```

#### some

类似地，我们也可以定义一个 some 的高阶函数：
顾名思义，some 表示一些，也就是只要数组中存在一个满足条件，则该函数返回`true`。所以需要用到或运算。

```ts
// @/src/1_hoc/some.ts

export default function some<T = any>(
  arr: T[],
  fn: (value: T, index?: number, arr?: T[]) => boolean,
): boolean {
  let result = false

  for (let i = 0; i < arr.length; ++i) {
    result = result || fn(arr[i], i, arr)
    if (result) break
  }
  return result
}
```

与`every`有点不同的是`some`的初始值为 false，采用或运算实现。

简单地测试一把：

```ts
test('some', () => {
  const arr = Array(10).fill(0)
  const naturalArr = arr.map((value, index) => index)

  expect(
    some(naturalArr, (value) => {
      return value === 5
    }),
  ).toBeTruthy()
}
```

#### sort

排序是编程中不可避免的一环。我们很容易对一个数字数组进行排序。例如：对于数字的升序排序，我们可以比较两个数字的大小，数字大的放在数组的后面，数字小的，放在数组的前面。

那么，对于其他抽象类型呢？例如对一群人进行排序，我们即可以按照姓名字符码进行排序，也可以按照升高进行排序。那么，我们是否能将这类排序抽象成数字，然后按照数字的排序方式进行排序。

答案是可以的。事实上，排序的比较规则可以抽象成下面的代码：

```ts
function compare(a, b): number {
  if (a < b) return -1
  else if (a > b) return 1
  else return 0
}
```

只要我们能对`a`，`b`进行量化，我们就可以将抽象类型按照数字的排序方式排序。可以想到，我们可以比较`a`，`b`中的某些字段来实现这个目标。
下面是具体的实现：

```ts
export interface CompareFunction<T = any> {
  (a: T, b: T): number
}

const insertSort = <T = any>(
  arr: T[],
  lo: number,
  hi: number,
  cmpFunc: CompareFunction<T>,
): void => {
  for (let i = lo + 1; i < hi; ++i) {
    for (let j = i; j > lo && cmpFunc(arr[j], arr[j - 1]) < 0; --j) {
      ;[arr[j - 1], arr[j]] = [arr[j], arr[j - 1]]
    }
  }
}

const quickSort = <T = any>(arr: T[], cmpFunc: CompareFunction<T>): void => {
  qSort(arr, 0, arr.length, cmpFunc)
}

const qSort = <T = any>(
  arr: T[],
  lo: number,
  hi: number,
  cmpFunc: CompareFunction<T>,
): void => {
  if (hi < lo + 1) {
    return
  } else if (hi < lo + 10) {
    return insertSort(arr, lo, hi, cmpFunc)
  }
  const pivotIndex = partition(arr, lo, hi, cmpFunc)
  qSort(arr, lo, pivotIndex, cmpFunc)
  qSort(arr, pivotIndex + 1, hi, cmpFunc)
}

const swap = <T>(arr: T[], i: number, j: number): void => {
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}

const partition = <T = any>(
  arr: T[],
  lo: number,
  hi: number,
  cmpFunc: CompareFunction<T>,
): number => {
  // shuffle
  const randIndex = Math.round(Math.random() * (hi - lo)) + lo
  swap(arr, lo, randIndex)
  const pivot = arr[lo]
  let l = lo
  let r = hi - 1

  // sort
  while (l < r) {
    while (cmpFunc(pivot, arr[r]) < 0) --r
    while (l < r && cmpFunc(arr[l], pivot) <= 0) ++l
    if (l < r) {
      swap(arr, l, r)
    }
  }
  swap(arr, lo, l)
  return l
}

export default function sort<T = any>(
  arr: T[],
  cmpFunc: CompareFunction<T>,
): void {
  quickSort(arr, cmpFunc)
}
```

简单地测试一把：

```ts
test('sort', () => {
  const arr0: any[] = []
  const arr1 = [1]
  const arr2 = [2, 1]
  const arrN = [3, 4, 1, 0, 2]
  const arrPerson: { name: string; age: number }[] = [
    { name: 'John1', age: 1 },
    { name: 'John3', age: 3 },
    { name: 'John2', age: 2 },
  ]
  const cmp = (a: number, b: number) => a - b
  sort(arr0, cmp)
  sort(arr1, cmp)
  sort(arr2, cmp)
  sort(arrN, cmp)
  sort(arrPerson, (a, b) => a.age - b.age)
  expect(arr0).toStrictEqual([])
  expect(arr1).toStrictEqual([1])
  expect(arr2).toStrictEqual([1, 2])
  expect(arrN).toStrictEqual([0, 1, 2, 3, 4])

  expect(arrPerson).toStrictEqual([
    { name: 'John1', age: 1 },
    { name: 'John2', age: 2 },
    { name: 'John3', age: 3 },
  ])
})
```

通过定义不同的`CompareFunction`可以实现对任意抽象类型进行排序。
