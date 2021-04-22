/* bind3.js */

// version3: new

Function.prototype.bind1 = function () {
  if (typeof this !== 'function') {
    throw new TypeError('bind function must be callable.')
  }
  
  var self = this
  var args = [].slice.call(arguments, 1)
  
  var F = function () {}
  
  var bindFunc = function () {
    var bindArgs = [].slice.call(arguments)
    return self.apply(
      this instanceof F ? this : context,
      args.concat(bindArgs)
    )
  }
  F.prototype = this.prototype
  bindFunc.prototype = new F()
  return bindFunc
}

function test1() {
  const person = {
    weight: '5kg',
    height: '5cm'
  }

  function Person(weight, height) {
    console.log('weight = ', weight)
    console.log('height = ', height)
    this.weight = weight
    this.height = height
  }

  const BindPerson = Person.bind1(person, '50kg')
  const p = new BindPerson('150cm')
  console.log('p.weight = ', p.weight)
  console.log('p.height = ', p.height)
}

test1()
