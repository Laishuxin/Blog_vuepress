---
title: bind
time: 2021-04-21
author: ru shui
category: 前端基础
tag:
  - frontend
  - javascript
  - bind
visitor: false
article: true
---

bind 最重要的功能是接收一个 context，返回函数绑定 context 后的函数

## version1: 简化版实现

```js
Function.prototype.bind1 = function (context) {
  var self = this
  return function () {
    return self.apply(context, arguments)
  }
}
```

## version2: 部分传参

```js
Function.prototype.bind1 = function (ctx) {
  var self = this
  var args = [].slice.call(arguments, 1)

  return function () {
    var bindArgs = [].slice.call(arguments)
    return self.apply(ctx, args.concat(bindArgs))
  }
}
```

## version3: 作为构造函数

```js
Function.prototype.bind1 = function () {
  if (typeof this !== 'function') {
    throw new TypeError('bind function must be callable.')
  }

  var self = this
  var args = [].slice.call(arguments, 1)

  var F = function () {}

  var bindFunc = function () {
    var bindArgs = [].slice.call(arguments)
    return self.apply(this instanceof F ? this : context, args.concat(bindArgs))
  }
  F.prototype = this.prototype
  bindFunc.prototype = new F()
  return bindFunc
}
```
