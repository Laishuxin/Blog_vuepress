---
title: 继承的几种方式及其优缺点
time: 2021-04-24
author: ru shui
category: 前端基础
tag:
  - frontend
  - javascript
  - inherit
visitor: false
article: false
---

## 原型链继承

```js
/* prototype.js */
// 原型链继承

function Parent(name) {
  this.name = name
  this.properties = ['friendly', 'talent']
}

function Child() {}

Child.prototype = new Parent('foo')

const c = new Child()
console.log('name = ', c.name)
console.log('properties = ', c.properties)

console.log('modify properties...')
c.name = 'bar' // add property in c rather than modify
c.properties.push('goodness')

console.log('name = ', c.name)
console.log('properties = ', c.properties)
```

缺点：所有的子实例都会使用父类同一个引用类型属性

## 借用构造函数继承（经典继承）

```js
/* borrow_constructor.js */
// 借用构造函数

function Parent(name) {
  this.name = name
  this.properties = ['friendly', 'talent']
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

const c = new Child('foo', 18)
console.log('name = ', c.name)
console.log('age = ', c.age)
console.log('properties = ', c.properties)

console.log('modify properties')
c.name = 'bar'
c.properties.push('goodness')
console.log('name = ', c.name)
console.log('properties = ', c.properties)
```

优点：避免数据共享，其次就是子类可以向父类传参。
缺点：方法定义在构造函数中，每次创建子实例的时候都需要再创建一次方法。(也就是说，子类上并没有父类的成员函数)
例如：

```js
Parent.prototype.sayName = function () {
  console.log('name = ', this.name)
}

c.sayName() // TypeError: c.sayName is not a function
```

## 组合继承

组合继承就是结合了原型继承和借用构造继承而实现的一种继承方式。

```js
/* composite.js */
// 组合继承

function Parent(name) {
  this.name = name
}

Parent.prototype.sayName = function () {
  console.log('name = ', this.name)
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

Child.prototype = new Parent()
Child.prototype.constructor = Child

const c = new Child('foo', 18)
c.sayName()
console.log('name = ', c.name)
console.log('age = ', c.age)
```

缺点：会创建两次`Parent`，一次是在`Child`构造函数中，一个是修改`Child`原型时。

## 寄生组合继承

```js
/* parasitic2.js */
// 寄生组合继承
function Parent(name) {
  this.name = name
}

Parent.prototype.sayName = function () {
  console.log('name = ', this.name)
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

function Inherit(Child, Parent) {
  function F() {}
  F.prototype = Parent.prototype
  var f = new F()
  f.constructor = Child
  Child.prototype = f
}

Inherit(Child, Parent)
const c = new Child('foo', 18)
c.sayName()
console.log('name = ', c.name)
console.log('age = ', c.age)
```

优点：只调用一次 Parent 构造函数，从而避免在原型上创建了一些不必要的属性和方法。同时还能保持原型链不变，而且可以正常使用 instanceof 和 isPrototypeOf。
