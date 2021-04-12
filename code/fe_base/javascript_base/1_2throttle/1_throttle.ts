/* 1_throttle.ts */

console.log('throttle version1')

function throttle (fn: Function, wait = 1000): Function {
  let previous = 0
  return function (...args: any[]) {
    let now = +new Date()
    let result: any

    if (now - previous >= wait) {
      result = fn.apply(this, args)
      previous = now
    }
    return result
  }
}
