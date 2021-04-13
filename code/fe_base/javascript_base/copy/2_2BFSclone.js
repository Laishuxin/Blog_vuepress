/* 2_2BFSclone.js */

const { isObject, isArray } = require("./utils");


/**
 * copy value for object
 * @param {Object} obj 
 * @param {any} key 
 * @param {Array<[obj: Object, key: string, value: any>} queue 
 */
function copyValue (obj, key, value, queue) {
  if (!isObject(value)) {
    obj[key] = value
  } else {
    queue.push([obj, key, value])
  }
}

/**
 * Deep clone base on BFS
 * @param {any} value The value you want to clone
 * @param {Array<[obj: Object, key: string, value: any>} queue 
 */
function deepClone(value, queue = []) {
  if (!isObject(value)) return value
  var newObj = !isArray(value) ? {} : []

  for (var key in value) {
    if (value.hasOwnProperty(key)) {
      copyValue(newObj, key, value[key], queue)
    }
  }
  while (queue.length > 0) {
    var item = queue.shift()
    var obj = item[0]
    var key = item[1]
    var value = item[2]
    obj[key] = deepClone(value, queue)
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