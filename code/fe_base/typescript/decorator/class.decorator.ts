/* class.decorator.ts */

function demo1() {
  function decoratePerson(constructor: Function) {
    console.log('decorating person...')
  }

  @decoratePerson
  class Person {
    public name: string
    constructor(name: string) {
      this.name = name
    }
  }

  new Person('foo')
  /**
   * decorating person...
   */
}

function demo2 () {
  function decoratePerson(constructor: Function) {
    constructor.prototype.age = 18
  }

  @decoratePerson
  class Person {
    public name: string
    constructor(name: string) {
      this.name = name
    }
  }

  const p = new Person('foo')
  console.log(p.name)
  // Property 'age' does not exist on type 'Person'.ts(2339)
  // console.log(p.age)
  console.log((p as any) .age)
  /**
   * foo
   * 18
   */
}

// demo1()
demo2()
