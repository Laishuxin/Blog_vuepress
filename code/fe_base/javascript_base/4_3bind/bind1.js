/* bind1.js */

// version1: basic implementation
Function.prototype.bind1 = function (context) {
  var self = this
  return function () {
    return self.apply(context, arguments)
  }
}

function test1() {
  const person = {
    name: 'foo',
    age: 18
  }

  function printing() {
    console.log(this.name)
    console.log(this.age)
  }
  
  const bindPrinting = printing.bind1(person)
  bindPrinting()
}

test1()