---
title: new
time: 2021-04-21
author: ru shui
category: 前端基础
tag:
  - frontend
  - javascript
  - new
visitor: false
article: true
---

```js
function newObject() {
  var constructor = [].shift.call(arguments)

  var F = function () {}
  F.prototype = constructor.prototype
  var obj = new F()

  var result = constructor.apply(obj, arguments)

  return typeof result === 'object' && result !== null ? result : obj
}
```
