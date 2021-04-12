/* 3_debounce.ts */

function debounce(fn: Function, wait = 1000): Function {
  let timeout: number | null = null
  return function (...args: any[]) {
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = null
    }
    timeout = setTimeout(fn.bind(this, ...args), wait)
  }
}
