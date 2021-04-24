---
title: javascript创建对象的几种方式及其优缺点
time: 2021-04-24
author: ru shui
category: 前端基础
tag:
  - frontend
  - javascript
  - object
visitor: false
article: false
---

## 工厂模式

```js
function createPerson(name) {
  var obj = new Object()
  obj.name = name
  obj.sayName = function () {
    console.log('name = ', this.name)
  }
  return obj
}

// const p = createPerson('foo')
// p.sayName()
```

缺点：无法识别对象，也就是对象都指向`Object`。

## 构造模式

```js
function Person(name) {
  this.name = name
  this.sayName = function () {
    console.log('name = ', this.name)
  }
}

const p = new Person('foo')
p.sayName()

function PersonConstructor() {
  function sayName() {
    console.log('name = ', this.name)
  }

  return function (name) {
    this.name = name
    this.sayName = sayName
  }
}

var Person_ = PersonConstructor()
// const p2 = new Person_('foo')
// p2.sayName()
```

缺点：每个实例都需要重新创建一个同样的方法。

## 原型模式

```js
function Person() {}

Person.prototype = {
  constructor: Person,
  name: 'foo',
  getName: function () {
    return this.name
  },
  sayName: function () {
    console.log('name = ', this.name)
  }
}
```

缺点：无法初始化。所有的方法/属性都定义在原型上，牵一发而动全身。

## 组合模式

```js
function Person(name) {
  this.name = name
}

Person.prototype = {
  constructor: Person,
  getName: function () {
    return this.name
  },
  sayName: function () {
    console.log('name = ', this.name)
  }
}

// dynamic composition
function Person2(name) {
  this.name = name
  if (typeof this.sayName !== 'function') {
    Person2.prototype.sayName = function () {
      console.log('name = ', this.name)
    }
  }
}
```

使用最广泛的创建对象方式之一，封装性和复用性较好。
在使用动态创建对象的时候，**不可以**使用字面量的方式实现。

## 寄生模式

```js
function Person(name) {
  var obj = new Object()
  obj.name = name
  obj.sayName = function () {
    console.log('name = ', this.name)
  }
  return obj
}
```

缺点：创建的实例无法指向原先的实例。

```js
const p = new Person('foo')
console.log(p instanceof Person) // false
console.log(p instanceof Object) // true
```

这样做也有一定的好处。例如：我们想创建一个`SpecialArray`，但是我们想让它依然是一个`Array`，使用寄生构造完全可以达到这个目的。
