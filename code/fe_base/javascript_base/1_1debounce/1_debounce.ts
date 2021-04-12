function debounce (fn: Function, wait = 1000): Function {
  let timeout: number | null = null
  return function () {
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = null
    }
    timeout = setTimeout(fn, wait)
  }
}
