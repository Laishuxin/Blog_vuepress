function test1() {
  function foo(a, b) {
    function a() {}
    console.log(a)
  }

  foo()
}

function test2 () {
  function foo (a) {
    var b = 2
    function c () {}
    var d = function () {}
    b = 3
    console.log(c)
  }
  
  foo(1)
}

// test2()

function test3 () {
  function foo (a) {
    console.log('arguments = ')
    console.log(arguments)
    console.log(`a = ${a}`)

    arguments[0] = 11

    console.log('arguments = ')
    console.log(arguments)
    console.log(`a = ${a}`)
  }
  
  foo(1)
}

test3()