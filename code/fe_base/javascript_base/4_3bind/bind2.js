/* bind2.js */

// version2: allow partial parameters
Function.prototype.bind1 = function (ctx) {
  var self = this
  var args = [].slice.call(arguments, 1)

  return function () {
    var bindArgs = [].slice.call(arguments)
    return self.apply(ctx, args.concat(bindArgs))
  }
}

function test1() {
  const person = {
    name: 'foo',
    age: 18
  }
  function printing(weight, height) {
    console.log('name = ', this.name)
    console.log('age = ', this.age)
    console.log('weight = ', weight)
    console.log('height = ', height)
  }

  const bindPrinting = printing.bind1(person, '50kg')
  bindPrinting('150cm')
}

test1()
