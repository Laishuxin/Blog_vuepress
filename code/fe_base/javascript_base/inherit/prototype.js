/* prototype.js */
// 原型链继承

function Parent(name) {
  this.name = name
  this.properties = ['friendly', 'talent']
}

function Child () {
}

Child.prototype = new Parent('foo')

const c = new Child()
console.log('name = ', c.name)
console.log('properties = ', c.properties)


console.log('modify properties...')
c.name = 'bar'    // add property in c rather than modify
c.properties.push('goodness')

console.log('name = ', c.name)
console.log('properties = ', c.properties)