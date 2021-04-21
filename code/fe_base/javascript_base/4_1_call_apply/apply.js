var window = {
  name: 'window',
  feature: 'testing'
}

Function.prototype.apply1 = function (context, arr) {
  context = context === null || context === undefined ? window : Object(context)
  context.fn = this
  var result
  if (arr === undefined) {
    result = context.fn()
  } else {
    if (typeof arr !== 'object') {
      throw new TypeError('CreateListFromArrayLike called on non-object')
    }
    var args = []
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push('arr[' + i + ']')
    }
    result = eval('context.fn(' + args + ')')
  }

  delete context.fn
  return result
}

function applyExample() {
  const data = {
    name: 'foo',
    age: 18
  }
  function test1(arg1, arg2) {
    console.log(arg1)
    console.log(arg2)
    console.log(this.name)
    console.log(this.age)
  }

  test1.apply1(data, ['arg1', 'arg2'])
  test1.apply1(data)

  function test2(arg1, arg2) {
    console.log(arg1)
    console.log(arg2)
    console.log(this.name)
    console.log(this.age)
  }

  test2.apply1(null, ['arg1', 'arg2'])
}

applyExample()
