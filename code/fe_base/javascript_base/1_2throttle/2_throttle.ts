/* 2_throttle.ts */
console.log('throttle version2')

function throttle (fn: Function, wait = 3000): Function {
  let timeout: number = null
  let result: any
  return function (...args: any[]) {
    if (timeout === null) {
      // result = fn.apply(this, args)
      timeout = setTimeout(() => {
        fn.apply(this, args)
        timeout = null
      }, wait)
    }
    return result
  }
}
