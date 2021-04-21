var window = {
  name: 'window',
  feature: 'testing'
}

Function.prototype.call3 = function (context) {
  context = context === null || context === undefined ? window : Object(context)
  context.fn = this

  var args = []
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']')
  }
  var result = eval('context.fn(' + args + ')')
  delete context.fn
  return result
}

function callExample3() {
  function test1(arg1) {
    // console.log(this)
    console.log('doing...')
    console.log(arg1)
  }

  test1.call3(1, 'arg1')
  // test1.call(null)
  test1.call3(undefined, 'arg1')
}

callExample3()
