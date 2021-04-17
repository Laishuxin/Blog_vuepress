/**
 * Reject a value and then return rejected promise
 * @param {any} reason rejected reason
 * @returns {Promise<any>}
 */
function PromiseReject(reason) {
  return new Promise((_, reject) => reject(reason))
}

// test return value
console.log(
  Object.prototype.toString.call(PromiseReject(1).catch((err) => err))
)

// test regular value
PromiseReject(123).then(
  (value) => {
    console.log('resolved value: ', value)
  },
  (reason) => {
    console.log('rejected reason: ', reason)
  }
)

// test promise
PromiseReject(new Promise((resolve) => resolve('resolved promise')))
  .then(
    (value) => {
      console.log('resolved value: ', value)
    },
    (reason) => {
      console.log('rejected reason: ', reason)
    }
  )

// test promise
PromiseReject(new Promise((_, reject) => reject('rejected promise'))).then(
  (value) => {
    console.log('resolved value: ', value)
  },
  (reason) => {
    console.log('rejected reason: ', reason)
  }
)
