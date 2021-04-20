---
title: 闭包
time: 2021-04-20
author: ru shui
category: problem sets
tag:
  - frontend
  - javascript
  - problem sets
  - closure
visitor: false
article: true
---

## 简述下面代码的执行过程

### case1

```js
var data = []

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i)
  }
}

data[0]() // 3
data[1]() // 3
data[2]() // 3
```

对于全局函数，其执行上下文为：

```js
var globalContext = {
  VO: {
    data: [...],
    i: 3
  }
}
```

对于`data[i]`函数的执行上下文为

```js
var dataIContext = {
  scope: [AO, globalContext.VO]
}
```

`data[i]`函数在执行的时候，会根据作用域链，首先在`AO`中查找变量 i，由于变量 i 并不存在于 AO 中，于是会沿着作用域链在`globalContext.VO`进行查找，由于这里是引用类型，在`globalContext.VO`中，`i = 3`，所以函数输出为 3。

### case2

```js
var data = []

for (var i = 0; i < 3; i++) {
  data[i] = (function (i) {
    return function () {
      console.log(i)
    }
  })(i)
}

data[0]() // 0
data[1]() // 1
data[2]() // 2
```

使用匿名函数执行的方式会修改函数的作用域链，来看修改后的作用域：

```js
var globalContext = {
  VO: {
    data: [],
    i: 3
  }
}

var dataIContext = {
  scope: [AO, lambdaFuncContext.AO, globalContext.VO]
}
```
同样在执行`data[i]`时，会沿着作用域链进行查找：
首先`AO`中并没有i，所以会到`lambdaFuncContext.AO`中进行查找，由于js是按值传参的，所以`lambdaFuncContext.AO.i = i`，也就是会按照迭代的i进行输出。
