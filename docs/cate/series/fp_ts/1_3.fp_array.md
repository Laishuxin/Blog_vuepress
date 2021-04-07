---
title: 数组的函数式编程
time: 2021-04-05
author: ru shui
category: 系列文章
tag:
  - frontend
  - typescript
  - functional programming
  - map
  - forEach
  - filter
  - concatAll
  - zip
  - reduce
visitor: false
article: true
---
(本节代码存放于[arrayUtils](https://github.com/Laishuxin/series_functional_programming_with_ts/tree/main/code/src/arrayUtils))

本节创建的函数为投影函数（Projecting Function）。即，一个数组经过函数的变换后产生另一个新的数组。

## 数组的函数式方法

### map

#### implementation

在写 map 之前，设想我们有这样的需求：将一个全为`number`类型的数组中的数全部求平方，并且映射到另一个数组。
这个需求用`forEach`当然能很好实现：

```ts
const newArr = []
forEach(numberArr, (value) => newArr.push(value * value))
```

这里我们需要创建一个新的数组来保存投影值。于是乎，我们能否将该方法进一步抽象成一个函数，接收一个数组以及投影方法，返回投影数组。这就是我们将要实现的`map`方法：

```ts
export interface Callback<T, R> {
  (value: T, index?: number, arr?: T[]): R
}

const map = <T = any, R = any>(arr: T[], callback: Callback<T, R>): R[] => {
  const projectingArr: R[] = []
  for (let i = 0, len = arr.length; i < len; ++i) {
    projectingArr.push(callback(arr[i], i, arr))
  }
  return projectingArr
}

export default map
```

正如我们上面一样，只是我们把具体实现的步骤封装到 map 函数中，实现进一步的抽象。

我们将写好的`map`抽离到一个`arrayUtils`的函数工具库中，方便后续的使用。当前目录结构如下：

```sh
arrayUtils
|-- index.ts
|-- map.ts
```

`index.ts`用于导出所有的工具函数，还有存放公共部分。
由于`Callback`属于公共部分，后续其他函数也可以使用，我们把`Callback`的定义也放在`index.ts`进行导出。

#### examples

来看下面的例子：

```ts
export interface ReviewItem {
  good?: number
  excellent?: number
}

export interface BookItem {
  id: number
  title: string
  author: string
  rating: number[]
  reviews: ReviewItem[]
}

export type BookList = BookItem[]

export const bookList: BookList = [
  {
    id: 1,
    title: '围城',
    author: '钱钟书',
    rating: [9.5],
    reviews: [{ excellent: 4, good: 5 }],
  },
  {
    id: 2,
    title: '三国演义',
    author: '罗贯中',
    rating: [9.7],
    reviews: [],
  },
  {
    id: 3,
    title: 'how to stop worrying and start living',
    author: 'Dale Carnegie',
    rating: [9.2],
    reviews: [{ good: 4 }],
  },
]
```

假设我们从服务器获取到一些书的信息，在这些信息中，我们需要过滤一些暂时用不着的信息。我们可以用`map`实现这样的需求。例如：我们只需要知道书的书名(title)和作者(author)。于是我们可以这样做：

```ts
import utils from '../arrayUtils/index'
const { map, forEach } = utils

import { bookList } from './example'

const details = map(bookList, (item) => {
  return { title: item.title, author: item.author }
})

forEach(details, (item) =>
  console.log(`author: ${item.author}, title: ${item.title}`),
)
/**
 * author: 钱钟书, title: 围城
 * author: 罗贯中, title: 三国演义
 * author: Dale Carnegie, title: how to stop worrying and start living
 */
```

### filter

对于上面的图书，如果我们只想要哪些评分高于 9.5 的图书呢？
事实上，我们可以创建一个函数，用于过滤那些不必要的 item。这就是`filter`函数，具体实现如下：

#### implementation

```ts
const filter = <T = any>(arr: T[], callback: Callback<T, boolean>): T[] => {
  const filteredArr: T[] = []
  for (let i = 0, len = arr.length; i < len; ++i) {
    if (callback(arr[i], i, arr)) filteredArr.push(arr[i])
  }
  return filteredArr
}
```

事实上，`filter`和`map`有异曲同工之妙，只是在`push`之前，多了一层判断。

#### examples

从之前的图书列表中将评分达到 9.5 的过滤出来

```ts
import utils from '../arrayUtils'
import { bookList } from './example'
const { filter } = utils

const HIGHER_RATING = 9.5
const higherRatingBooks = filter(
  bookList,
  (item) => item.rating[0] >= HIGHER_RATING,
)

console.log(higherRatingBooks)
/**
 * [
 *  { id: 1, title: '围城', author: '钱钟书', rating: [ 9.5 ], reviews: [ [Object] ] },
 *  { id: 2, title: '三国演义', author: '罗贯中', rating: [ 9.7 ], reviews: [] }
 * ]
 */
```

### 连续操作

<!-- #### implementation -->

使用函数式编程的好处在于，我们可以使用函数组合实现不同的需求。

#### examples

例如：在上述的图书中，我们即想将评分达到 9.5 的图书过滤出来，同时，只想知道书名和作者，通过`filter`和`map`的配合使用即可达成该目标。

```ts
import { bookList } from './example'
import utils from '../arrayUtils'
const { map, filter } = utils

const filteredDetails = map(
  filter(bookList, (item) => item.rating[0] >= 9.5),
  (item) => {
    return { author: item.author, title: item.title }
  },
)

console.log(filteredDetails)
/**
 * [ { author: '钱钟书', title: '围城' }, { author: '罗贯中', title: '三国演义' } ]
 */
```

核心代码为：`map(filter())`。先执行过滤操作，然后将过滤后的结果作为`map`的输入，投影到一个新的数组中，从而实现该需要。

### concatAll

在实现`concatAll`，我们先对`bookList`进行升级：

```ts
// example.ts
export interface PressBookItem {
  name: string
  bookDetails: BookList
}

export type PressBookList = PressBookItem[]
const pressBookList: PressBookList = [
  {
    name: 'beginners',
    bookDetails: [
      {
        id: 11,
        title: 'c#',
        author: 'Andreq Troelsen',
        rating: [9.4],
        reviews: [{ good: 4, excellent: 12 }],
      },
      {
        id: 12,
        title: 'Efficient Learning Machines',
        author: 'Rahul Khanna',
        rating: [9.0],
        reviews: [],
      },
    ],
  },
  {
    name: 'pro',
    bookDetails: [
      {
        id: 21,
        title: 'Pro AngularJS',
        author: 'Adam Freeman',
        rating: [8.0],
        reviews: [],
      },
      {
        id: 22,
        title: 'Pro ASP.NET',
        author: 'Adam Freeman',
        rating: [8.4],
        reviews: [{ good: 14, excellent: 12 }],
      },
    ],
  },
]
```

我们将图书进一步分类，划分为`beginners`和`pro`，每一类的书中，又存放一个`bookDetails`。如果我们还想在两种分类中评分到达 9.0 的图书提取出来并且只需要`bookItem`。直接用`filter`能否行得通？
答案是不行的。这是因为我们的`pressBookList`是 一个嵌套数组，`filter`无法使嵌套数组中使用，于是我们可以先使用`map`将`bookDetails`提取出来。

```ts
const bookDetailsList = map(pressBookList, (item) => item.bookDetails)
console.log(bookDetailsList)

/**
 * [
 *   [
 *     {
 *       id: 11,
 *       title: 'c#',
 *       author: 'Andreq Troelsen',
 *       rating: [Array],
 *       reviews: [Array]
 *     },
 *     {
 *       id: 12,
 *       title: 'Efficient Learning Machines',
 *       author: 'Rahul Khanna',
 *       rating: [Array],
 *       reviews: []
 *     }
 *   ],
 *   [
 *     {
 *       id: 21,
 *       title: 'Pro AngularJS',
 *       author: 'Adam Freeman',
 *       rating: [Array],
 *       reviews: []
 *     },
 *     {
 *       id: 22,
 *       title: 'Pro ASP.NET',
 *       author: 'Adam Freeman',
 *       rating: [Array],
 *       reviews: [Array]
 *     }
 *   ]
 * ]
 */
```

使用`map`将`bookDetails`提取出来，但是结果仍然是一个嵌套数组，
我们能否将嵌套数组扁平化？这就是`concatAll`的作用了，顾名思义，`concatAll`是将一个嵌套数组中的数据合并起来形成一个扁平化的数组，具体实现如下：

#### implementation

```ts
const concatAll = <T = any>(arr: T[][]): T[] => {
  const flattenArr: T[] = []
  for (const subArr of arr) {
    flattenArr.push(...subArr)
  }
  return flattenArr
}

export default concatAll
```

核心代码为：`flattenArr.push(...subArr)。这里只需要调用`push`，并且使用`es6`提供的数组展开语法，即可实现。

于是乎，我们可以将之前`map`的结果进行合并，得到一个只含`bookItem`的数组：

```ts
const bookDetails = concatAll(bookDetailsList)
```

#### example

在两种分类中评分到达 9.0 的图书提取出来并且只需要`bookItem`。

```ts
const bookList = filter(
  concatAll(map(pressBookList, (item) => item.bookDetails)),
  (detail) => detail.rating[0] >= 9.0,
)

console.log(bookList)
/**
 * [
 *   {
 *     id: 11,
 *     title: 'c#',
 *     author: 'Andreq Troelsen',
 *     rating: [ 9.4 ],
 *     reviews: [ [Object] ]
 *   },
 *   {
 *     id: 12,
 *     title: 'Efficient Learning Machines',
 *     author: 'Rahul Khanna',
 *     rating: [ 9 ],
 *     reviews: []
 *   }
 * ]
 */
```

核心代码为：`filter(concatAll(map()))`。
先是用`map`将`bookDetails`提出出来，
再用`concatAll`将提取出来的`bookDetails`数组扁平化，
最后再用`filter`对所需要的`bookDetails`过滤出来。

### reduce

在讲`reduce`之前，我们照例抛出一个示例。
例如：实现一个数组的求和操作。

```ts
const numArr: number[] = [1, 2, 3, 4]
// expect: 10
```

一种常规的做法如下：

```ts
let sum = 0
forEach(numArr, (num) => (sum += num))
```

和`map`一样，这里需要一个全局变量，于是，我们可以将该过程封装到一个函数中。
（值得一提的是，上述设置累加器并遍历数组以生成一个单一元素的过程称为归约数组。）

#### implementation

接下来，我们实现我们第一版的`reduce`函数：

```js
const reduce1 = (arr, fn) => {
  let accumulator = 0
  for (let i = 0, len = arr.length; i < len; ++i) {
    accumulator += fn(accumulator, arr[i], i, arr)
  }
  return [accumulator]
}
```

这样我们就成功地实现一个数组累加操作。但是这个实现是存在问题的，例如，我们不再需要累加了，而是需要求阶乘，如果还是按照上面的代码执行，结果将会为 0。一种无脑的操作就是创建一个函数，将累加器`accumulator`设置为 1。但是对于更通用的方式，我们应该再创建`reduce`时，让操作者自己传入一个初始值。具体的实现如下：

```ts
export interface ReduceCallback<T, U> {
  (previousValue: U, currentValue: T, index?: number, arr?: T[]): U
}

const reduce = <T = any, U = T>(
  arr: T[],
  callback: ReduceCallback<T, U>,
  initialValue?: U,
): U[] => {
  const len = arr.length
  if (len === 0) return []

  let accumulator = (initialValue ? initialValue : arr[0]) as U
  let i = initialValue ? 0 : 1
  while (i < len) {
    accumulator = callback(accumulator, arr[i], i, arr)
    ++i
  }
  return [accumulator]
}
```

首先我们定义了`reduce`回调函数的接口，接收两个必选参数`previousValue`和`currentValue`。注意两个参数的类型是不一样的，这是因为`previousValue`可以根据不同的初始值而决定的。

具体的实现中，我们接收一个`initialValue`的可选参数，如果没有指定该参数，则以数组的第一个元素作为初始值。
这里需要注意的是循环的初始值`i = initialValue ? 0 : 1;`。
接下来简单地测试一下`reduce`函数：

```ts
test('reduce', () => {
  const arr = [1, 2, 3]
  const sum = reduce(arr, (prev, curr) => prev + curr)
  const sum2 = reduce(arr, (prev, curr) => prev + curr, 10)
  const prod = reduce(arr, (prev, curr) => prev * curr)
  const prod2 = reduce(arr, (prev, curr) => prev * curr, 10)
  expect(sum[0]).toBe(6)
  expect(sum2[0]).toBe(16)
  expect(prod[0]).toBe(6)
  expect(prod2[0]).toBe(60)

  // ============================
  interface Person {
    scores: number
    count: number
  }
  const foo: Person = { scores: 0, count: 0 }
  const scores = [80, 90, 100]
  const result = reduce<number, Person>(
    scores,
    (prev, curr) => {
      prev.scores += curr
      prev.count++
      return prev
    },
    foo,
  )

  // console.log(result[0])
  // console.log(foo)

  expect(result[0]).toBe(foo)
  expect(foo).toStrictEqual({
    scores: 270,
    count: 3,
  })
})
```

**注意**：我们返回的是一个数组，而非一个单个数值。

#### examples

以之前图书`pressBookList`为例，限制我们要统计的是 reviews 中的`good`和`excellent`的个数，并且返回一个`{good: count, excellent: count}`的对象。

```ts
const reviews = reduce(
  concatAll(map(pressBookList, (item) => item.bookDetails)),
  (prev, curr) => {
    const review = curr.reviews.length >= 0 ? curr.reviews[0] : undefined
    if (!review) return prev
    prev.good += review.good ? review.good : 0
    prev.excellent += review.excellent ? review.excellent : 0
    return prev
  },
  { good: 0, excellent: 0 },
)

console.log(reviews)
/**
 * [ { good: 18, excellent: 24 } ]
 */
```

首先，我们将数组扁平化：`concatAll(map())`，然后归约数组，传入一个初始值。

### zip

设想一个场景：由于`bookDetails`特别庞大，服务器为了减轻压力，将`bookDetails`划分为两部分，一部分为书本身的信息，一部分是销售信息，如下面所示：

```ts{9-18}
export interface BookItem {
  id: number
  title: string
  author: string
  rating: number[]
  reviews: ReviewItem[]
}

export interface BookItemAboutBook {
  id: number
  title: string
  author: string
}

export interface BookItemAboutSales {
  rating: number[]
  reviews: ReviewItem[]
}
export const bookListAboutBook: BookItemAboutBook[] = [
  {
    id: 1,
    title: '围城',
    author: '钱钟书',
  },
  {
    id: 2,
    title: '三国演义',
    author: '罗贯中',
  },
  {
    id: 3,
    title: 'how to stop worrying and start living',
    author: 'Dale Carnegie',
  },
  {
    id: 4,
    title: 'other book',
    author: 'unknown',
  },
]

export const bookListAboutSales: BookItemAboutSales[] = [
  {
    rating: [9.5],
    reviews: [{ excellent: 4, good: 5 }],
  },
  {
    rating: [9.7],
    reviews: [],
  },
  {
    rating: [9.2],
    reviews: [{ good: 4 }],
  },
]
```

我们将之前的`bookList`划分为两部分，(**注意**bookListAboutBook 多出一份书单)如果我们还想执行之前的操作，那么就需要用到`zip`函数了。

#### implementation

`zip`函数就像一个拉链一样，将两个数值**等长度**地连接起来。这就意味着任意一个数组超出的部分会被抛弃。

<center><img src="./images/2021-04-05-14-37-18.png" style="zoom:60%;"></center>

```ts
export interface ZipCallback<T1, T2, R> {
  (value1: T1, value2: T2, index?: number, arr1?: T1[], arr2?: T2[]): R
}

const zip = <T1 = any, T2 = any, R = any>(
  arr1: T1[],
  arr2: T2[],
  callback: ZipCallback<T1, T2, R>,
): R[] => {
  const len = Math.min(arr1.length, arr2.length)
  const result: R[] = []
  for (let i = 0; i < len; ++i) {
    result.push(callback(arr1[i], arr2[i], i, arr1, arr2))
  }
  return result
}
```

#### examples

我们将图书信息和销售信息进行合并，并判断与原先的`bookList`是否相同：

```ts
test('zip', () => {
  const bookListClone: BookList = zip(
    bookListAboutSales,
    bookListAboutBook,
    (sales, book) => {
      return {
        ...sales,
        ...book,
      }
    },
  )
  expect(bookListClone).toStrictEqual(bookList)
})
```

## 小结
投影函数使我们对函数的操作上升一个台阶，我们将这些投影函数存放在`arrayUtils`中，以便后续的使用。
下面列出`arrayUtils`中的工具：
+  `map`
+  `forEach`
+  `filter`
+  `concatAll`
+  `reduce`
+  `zip`

接下来我们将从柯里化和偏函数继续深入理解函数式编程。