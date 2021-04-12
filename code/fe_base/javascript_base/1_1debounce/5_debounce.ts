/* 5_debounce.ts */

function debounce (fn: Function, wait = 1000, immediate = true): Function {
  let timeout: number | null = null
  return function (...args: any[]) {
    let callNow = timeout === null
    let result: any;
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = null
    }

    if (immediate) {
      timeout = setTimeout(() => (timeout = null), wait)
      if (callNow) {
        result = fn.apply(this, args)
      }
    } else {
      timeout = setTimeout(fn.bind(this, ...args), wait)
    }
    return result
  }
}
