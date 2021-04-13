var arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10]

function solution1() {
  // console.log(arr.toString())
  // console.log(arr.toString().split(','))
  // 1. flatten
  const flatArr = arr
    .toString()
    .split(',')
    .map((item) => parseInt(item))
  console.log('flatArr = ')
  console.log(flatArr)
  // 2. duplicate
  const duplicatedArr = Array.from(new Set(flatArr))
  console.log('duplicatedArr = ')
  console.log(duplicatedArr)
  // 3. sort
  const result = duplicatedArr.sort((a, b) => a - b)
  console.log('result = ')
  console.log(result)
}

function solution2() {
  interface Handler {
    (arr: Array<any>): Array<any>
  }
  type PipeOut = (arr: Array<any>) => Array<any>

  function flatten(arr: Array<any>): Array<any> {
    // return arr.flat(Infinity)
    return arr.toString().split(',').map(item => parseInt(item))
  }
  function duplicate(arr: Array<any>): Array<any> {
    return Array.from(new Set(arr))
  }
  function sort(arr: Array<any>): Array<any> {
    return arr.sort((a, b) => a - b)
  }

  function pipe(...handlers: Handler[]): PipeOut {
    return (arg: Array<any>) => handlers.reduce((prev, curr) => curr(prev), arg)
  }

  const gen = pipe(flatten, duplicate, sort)
  const result = gen(arr)
  console.log('result = ')
  console.log(result)
}

function solution3() {
  interface Handler {
    (arr: Array<any>): Array<any>
  }
  type PipeOut = (arr: Array<any>) => Array<any>

  function flatten(arr: Array<any>, target: any[] = []): Array<any> {
    var isArray = Array.isArray
    for (var i = 0, len = arr.length; i < len; i++) {
      var v = arr[i]
      if (isArray(v)) { flatten(v, target) }
      else target.push(v)
    }
    return target
  }

  function duplicate(arr: Array<any>): Array<any> {
    return Array.from(new Set(arr))
  }
  function sort(arr: Array<any>): Array<any> {
    return arr.sort((a, b) => a - b)
  }

  function pipe(...handlers: Handler[]): PipeOut {
    return (arg: Array<any>) => handlers.reduce((prev, curr) => curr(prev), arg)
  }

  const gen = pipe(flatten, duplicate, sort)
  const result = gen(arr)
  // const result = flatten(arr)
  console.log('s3 result = ')
  console.log(result)
}

// solution1()
// solution2()
solution3()
