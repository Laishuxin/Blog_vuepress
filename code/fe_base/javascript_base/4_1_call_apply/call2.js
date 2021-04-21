// version1: using es6 syntax
Function.prototype.call2_1 = function (context, ...args) {
  context.fn = this
  var result = context.fn(...args)

  delete context.fn
  return result
}

// version2: traditional implementation
Function.prototype.call2_2 = function (context) {
  context.fn = this
  // var result = context.fn()
  // As we are unable to use es6 syntax, we do need to use eval
  // for the complement of variable length of parameters
  var args = []
  //! i start from 1 not 0.
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']')
  }

  // console.log(''+ args)   // argument[1], argument[2]
  var result = eval('context.fn(' + args + ')')
  delete context.fn
  return result
}

function callExample2() {
  const data = {
    name: 'foo',
    age: 18
  }
  function test1(arg1, arg2) {
    console.log(this.name)
    console.log(this.age)
    console.log(arg1)
    console.log(arg2)
  }

  // test1.call2_2(data, 'arg1', 'arg2')
  test1.call2_2(1)
}

callExample2()
