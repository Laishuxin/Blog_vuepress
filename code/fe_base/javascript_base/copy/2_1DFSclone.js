/* 2_1DFSclone.js */

const { isObject, isArray } = require("./utils");

// 深度优先实现拷贝

function deepClone(value) {
  if (!isObject(value)) return value
  var newObj = isArray(value) ? [] : {}
  for (var key in value) {
    if (value.hasOwnProperty(key)) {
      var v = value[key]
      newObj[key] = !isObject(v) ? v : deepClone(v)
    }
  }
  return newObj
}


function test1() {
  const obj = {
    a: 1,
    b: [1, 2, 3],
    c: 'c',
    d: {d: 1}
  }
  const newObj = deepClone(obj)
  console.log(newObj)
  newObj['b'][1] = 200
  console.log('cloned: ')
  console.log(newObj)
  console.log('raw: ')
  console.log(obj)
}

test1()