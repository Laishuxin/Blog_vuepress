const isIterable = (obj) =>
  obj !== null && typeof obj[Symbol.iterator] === 'function'
/**
 * @param {Iterable} promises An iterable promises
 * @returns { Promise<any> }
 */
// Promise.race = function (promises) {
//   return new Promise((resolve, reject) => {
//     if (!isIterable(promises)) {
//       reject(new TypeError(`${promises} is not iterable`))
//     }
//     for (const p of promises) {
//       Promise.resolve(p).then(resolve, reject)
//     }
//   })
// }

/**
 * @param {Iterable} promises
 * @returns { Promise }
 */
function PromiseRace(promises) {
  return new Promise((resolve, reject) => {
    if (!isIterable(promises)) {
      reject(new TypeError(` is not iterable`))
    }

    for (const p of promises) {
      Promise.resolve(p).then(resolve, reject)
    }
  })
}

function test1() {
  const arr = [1, 2, 3]
  Promise.race(arr).then(
    (value) => console.log('resolved value = ', value),
    (reason) => console.log('rejected reason = ', reason)
  )

  PromiseRace(arr).then(
    (value) => console.log('PromiseRace resolved value = ', value),
    (reason) => console.log('PromiseRace rejected reason = ', reason)
  )
}

function test2() {
  const arr = [
    new Promise((resolve) => setTimeout(() => resolve(1), 1000)),
    new Promise((resolve) => setTimeout(() => resolve(2), 500)),
    new Promise((resolve) => setTimeout(() => resolve(3), 2000))
  ]
  Promise.race(arr).then(
    (value) => console.log('resolved value = ', value),
    (reason) => console.log('rejected reason = ', reason)
  )

  PromiseRace(arr).then(
    (value) => console.log('PromiseRace resolved value = ', value),
    (reason) => console.log('PromiseRace rejected reason = ', reason)
  )
}

// test1()
test2()