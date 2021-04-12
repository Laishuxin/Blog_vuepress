/* 4_throttle.ts */
console.log('throttle version 4')

interface LeadingAndTrailing {
  leading?: boolean
  trailing?: boolean
}

function throttle(
  fn: Function,
  wait = 1000,
  { leading = true, trailing = false }: LeadingAndTrailing = {
    leading: true,
    trailing: false
  }
): Function {
  //* in order to execute callback the first time
  let previous = 0
  let timeout: number | null = null
  const clear = () => {
    clearTimeout(timeout)
    timeout = null
  }

  return function (...args: any[]) {
    let result: any
    let now = +new Date()
    previous = leading ? previous : now
    // debugger

    // the rest time to execute
    //! to avoid the time of system has been modify
    // if time has been forward, it will be very dangerous
    // if time has been backward, it will be waiting for more time to execute.
    let remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timeout !== null) clear();
      previous = now
      result = fn.apply(this, args)
    } else if (timeout === null && trailing) {
      timeout = setTimeout(() => {
        fn.apply(this, args)
        previous = +new Date()
        timeout = null
      }, remaining)
    }
    
    return result
  }
}
