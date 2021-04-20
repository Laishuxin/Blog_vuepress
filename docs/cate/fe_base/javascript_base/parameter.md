---
title: 函数传参方式
time: 2021-04-20
author: ru shui
category: basic
tag:
  - frontend
  - javascript
  - function
  - parameter
visitor: false
article: true
---

在 js 中，函数传参方式只有一种--值传递。通过下面的几个例子，我们来验证这个结论：

## case1

```js
var value = 1

function foo(value) {
  value = 2
  console.log(value)
}

foo(value) // 2
console.log(value) // 1
```

我们在函数内部修改了参数`value`的值，这种修改并不会影响到外层变量。

## case2

有些博客对 js 函数传参存在另一种说法，就是，js 对于对象等引用类型的传参方式是引用传参的。下面我们来推翻这个说法。

```js
var obj = {
  value: 1
}

function foo(obj) {
  obj.value = 2
  console.log(obj.value)
}

foo(obj) // 2
console.log(obj.value) // 2
```

从上面结果上看，似乎我们并没能推翻这个结论，反而还验证这个结论：js 对于引用对象是是按引用传参的。

那么，我们再来看下面的例子：

```js
var obj = {
  value: 1
}

function foo(obj) {
  obj = 1
  console.log(obj.value)
}

foo(obj) // undefined
console.log(obj.value) // 1
```

如果说 js 对于引用对象是传引用的话，那么我们在函数内部修改了`obj`的引用，按理说，这种修改也会反应到外部作用域中。
但是，通过实验，我们发现这并没有。这是因为 js 函数的传参方式为值传递，对于引用对象，其值传递传递的是对象的引用的拷贝。
