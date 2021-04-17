/**
 * Resolve a value and then return a resolved Promise.
 * @param {any} value
 * @returns {Promise<any>}
 */
function PromiseResolve(value) {
  return new Promise((resolve) => resolve(value))
}

console.log(Object.prototype.toString.call(PromiseResolve(123)))
PromiseResolve(123).then((value) => console.log(value))
PromiseResolve(new Promise((resolve) => resolve('a promise'))).then((value) =>
  console.log(value)
)
