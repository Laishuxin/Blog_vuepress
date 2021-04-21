function newObject() {
  var constructor = [].shift.call(arguments)

  var F = function () {}
  F.prototype = constructor.prototype
  var obj = new F()

  var result = constructor.apply(obj, arguments)

  return typeof result === 'object' && result !== null ? result : obj
}

function Person(name, age) {
  this.name = name
  this.age = age
}

function Animal(type, life) {
  this.type = type
  this.life = life
  return {
    type: 'kidding you',
    notALife: 'not a life'
  }
}

Person.prototype.ancestor = 'Monkey'

var person = newObject(Person, 'foo', 20)
var animal = newObject(Animal, 'foo', 20)
console.log('name = ', person.name)
console.log('age = ', person.age)
console.log('ancestor = ', person.ancestor)

console.log('type = ', animal.type)
console.log('life = ', animal.life)
console.log('notALife = ', animal.notALife)
