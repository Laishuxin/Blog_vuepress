/* parasitic.js */

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

var F = function () {}
F.prototype = Parent.prototype
Child.prototype = new F()
Child.constructor = Child

const c = new Child('foo', 18)
c.sayName()
console.log('name = ', c.name)
console.log('age = ', c.age)

