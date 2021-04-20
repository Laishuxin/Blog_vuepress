---
title: 变量对象
time: 2021-04-16
author: ru shui
category: 前端基础
tag:
  - frontend
  - javascript
  - variable object
visitor: false
article: true
---

js 引擎在执行代码的时候会创建一个执行上下文，每个执行上下文中含有 3 个重要属性：

1. 变量对象
2. 作用域链
3. this

下面简单了解一下变量对象

## 基本定义

> 变量对象是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明。

不同的执行上下文对应的变量对象不同，我们先来了解一下全局变量对象。

## 全局上下文

在浏览器中，全局作用域对象/全局对象，为`window`对象，可以在全局作用域下通过`this`访问到全局对象`window`。
对于全局对象：

1. 可以通过`this`进行访问。

   `console.log(this === window); // true`

2. 全局对象也是通过`Object`实例化后的对象。

   `console.log(this instanceof Object); // true`

3. 预定义了很多函数和属性。例如：`Math, window.xxx`。
4. 作为全局变量的宿主。

   `var a = 1; console.log(a === window.a); // true`

## 函数上下文

在函数执行上下文中，用活动对象（activation object）来表示变量对象。也就是说活动对象就是变量对象。
从语法层面上看，活动对象就是当 js 引擎进入函数执行上下文时，这个变量对象才被激活，所以称之为活动对象。

活动对象是在进入函数上下文时才被创建的，它通过函数的`arguments`属性初始化。`arguments`属性值为`Arguments`对象。

## 执行过程

1. 进入执行上下文。
2. 开始执行代码。

### 进入执行上下文

当进入执行上下文时，变量对象创建，其包含如下属性：

1. 函数的所有形参。

   ActiveObject[key] = value;
   对于没有实参的参数，将 value 设置为 undefined。

2. 函数的声明。

   变量对象通过 key-value 的方式保存函数的声明，如果原先存在与函数名相同的变量，则会进行覆盖。

3. 变量声明初始化。

   变量对象采用变量名+undefined 为变量进行初始化。

来看下面的例子：

```js
function foo(a) {
  var b = 2
  function c() {}
  var d = function () {}

  b = 3
}

foo(1)
```

进入函数执行上下文后，ActiveObject 为

```js
ActiveObject = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
```

### 代码执行

开始执行代码的时候，会根据代码修改活动对象中的变量。
上述代码执行完成后，活动对象变为：

```js
ActiveObject = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c(){},
    d: reference to FunctionExpression "d"
}
```

## reference

- [JavaScript 深入之变量对象](https://github.com/mqyqingfeng/Blog/issues/5)
