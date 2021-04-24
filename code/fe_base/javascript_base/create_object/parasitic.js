// 寄生构造
function Person (name) {
  var obj = new Object()
  obj.name = name
  obj.sayName = function () {
    console.log('name = ', this.name)
  }
  return obj
}


const p = new Person('foo')
p.sayName()