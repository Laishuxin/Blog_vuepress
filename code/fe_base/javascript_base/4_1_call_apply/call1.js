Function.prototype.call1 = function (context) {
  context.fn = this
  var result = context.fn()
  delete context.fn
  return result
}

function callExample1 () {
  const data = {
    name: 'foo',
    age: 18
  }
  function test1 () {
    console.log(this.name)
    console.log(this.age)
    return 'done'
  }
  
  var result = test1.call1(data)
  console.log('result = ', result)
}

callExample1()