const utils = require('./utils')
const { isObject, isArray } = utils

function shallowCopy(value) {
  if (!isObject(value)) return value

  var newObj = isArray(value) ? [] : {}

  for (var key in value) {
    if (value.hasOwnProperty(key)) {
      newObj[key] = value[key]
    }
  }
  return newObj
}

function test1 () {
  const obj = {
    a: 1,
    b: [1, 2, 3],
    c: 'c',
    d: {d: 1}
  }
  const newObj = shallowCopy(obj)
  console.log(newObj)
  newObj['b'][1] = 200
  console.log('cloned: ')
  console.log(newObj)
  console.log('raw: ')
  console.log(obj)
}

function test2() {
  const obj = [1, '2', {c: 3}, [1, 2, 3, 5], Symbol('symbol')]
  const newObj = shallowCopy(obj)
  // console.log(newObj[4])
  console.log(newObj)
} 

test1()
test2()