/**
 * @param {Promise<any>} promise
 * @param {(error: any) => Promise<any>} onRejected
 * @returns
 */
function PromiseCatch(promise, onRejected) {
  return Promise.prototype.then.call(promise, undefined, onRejected)
}

PromiseCatch(Promise.reject(123), (err) => console.log('catch err: ', err))
