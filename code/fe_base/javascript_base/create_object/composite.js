function Person (name) {
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

const p = new Person('foo')
console.log('getName = ', p.getName())
p.sayName()

// dynamic composition
function Person2 (name) {
  this.name = name
  if (typeof this.sayName !== 'function') {
    Person2.prototype.sayName = function () {
      console.log('name = ', this.name)
    }
  }
}

console.log('-------------------------')
const p2 = new Person2('foo')
p2.sayName()