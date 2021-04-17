const isPromise = (promise) =>
  Object.prototype.toString.call(promise) === '[object Promise]'

/**
 *
 * @param {*} arr An iterable of Promises
 * @returns {Promise<any>}A new Promise.
 */
// function PromiseAll(arr = []) {
//   return new Promise((resolve, reject) => {
//     if (!Array.isArray(arr)) {
//       reject(new TypeError('Parameter should be an array.'))
//     }

//     const length = arr.length
//     let counter = 0

//     const result = Array(length)
//     for (let i = 0; i < length; i++) {
//       Promise.resolve(arr[i]).then((value) => {
//         counter++
//         result[i] = value

//         counter === length && resolve(result)
//       }, reject)
//     }
//   })
// }

const isIterable = (obj) =>
  obj !== null && typeof obj[Symbol.iterator] === 'function'
/**
 * @param {Iterable} iterable
 * @returns { Promise<any> }
 */
function PromiseAll(iterable) {
  return new Promise((resolve, reject) => {
    if (!isIterable(iterable)) {
      return reject(new TypeError(`${iterable} is not iterable`))
    }

    let counter = 0
    const length = iterable.length
    const result = Array(length)
    iterable.forEach((item, index) => {
      Promise.resolve(item).then((value) => {
        result[index] = value
        ++counter === length && resolve(result)
      }, reject)
    })
  })
}

function test1() {
  const arr = [1, Promise.resolve(2), 3, Promise.resolve(4)]
  PromiseAll(arr).then(
    // Promise.all(arr).then(
    (value) => console.log('resolved value :', value),
    (reason) => console.log('rejected reason = ', reason)
  )
}

function test2() {
  const arr = [1, Promise.resolve(2), Promise.reject(3), Promise.resolve(4)]
  PromiseAll(arr).then(
    // Promise.all(arr).then(
    (value) => console.log('resolved value :', value),
    (reason) => console.log('rejected reason = ', reason)
  )
}

function test3() {
  const arr = [
    1,
    new Promise((resolve) => setTimeout(() => resolve(2), 1000)),
    3
  ]
  PromiseAll(arr).then(
    // Promise.all(arr).then(
    (value) => console.log('resolved value :', value),
    (reason) => console.log('rejected reason = ', reason)
  )
}

function test4() {
  const arr = [
    1,
    new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('promise 2 is running.')
        reject(2)
      })
    }),
    3
  ]
  PromiseAll(arr).then(
    // Promise.all(arr).then(
    (value) => console.log('resolved value :', value),
    (reason) => console.log('rejected reason = ', reason)
  )
}

test1() // resolved value: [1, 2, 3, 4]
test2() // rejected reason = 3
test3() // [1, 2, 3]
test4() // promise 2 is running. rejected reason 2
