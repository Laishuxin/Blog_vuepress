/* constructor.js */

function Person (name) {
  this.name = name
  this.sayName = function () {
    console.log('name = ', this.name)
  }
}

const p = new Person('foo')
p.sayName()


function PersonConstructor () {
  function sayName () {
    console.log('name = ', this.name)
  }
  
  return function (name) {
    this.name = name
    this.sayName = sayName
  }
}

var Person_ = PersonConstructor()
const p2 = new Person_('foo')
p2.sayName()