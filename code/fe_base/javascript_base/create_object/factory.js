function createPerson (name) {
  var obj = new Object()
  obj.name = name
  obj.sayName = function () {
    console.log('name = ', this.name)
  }
  return obj
}

const p = createPerson('foo')
p.sayName()
