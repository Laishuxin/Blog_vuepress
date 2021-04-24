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
