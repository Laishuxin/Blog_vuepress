/* prototype.js */

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

const p = new Person()

p.sayName()
