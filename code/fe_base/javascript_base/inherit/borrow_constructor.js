/* borrow_constructor.js */
// 借用构造函数

function Parent (name) {
  this.name = name
  this.properties = ['friendly', 'talent']
}

Parent.prototype.sayName = function () {
  console.log('name = ', this.name)
}

function Child (name, age) {
  Parent.call(this, name)
  this.age = age
}

const c = new Child('foo', 18)
c.sayName()
console.log('name = ', c.name)
console.log('age = ', c.age)
console.log('properties = ', c.properties)

console.log('modify properties')
c.name = 'bar'
c.properties.push('goodness')
console.log('name = ', c.name)
console.log('properties = ', c.properties)