Promise.prototype.done = function (onFulfilled, onRejected) {
  this.then(onFulfilled, onRejected).catch((err) => {
    setTimeout(() => {
      throw err
    }, 0)
  })
}
