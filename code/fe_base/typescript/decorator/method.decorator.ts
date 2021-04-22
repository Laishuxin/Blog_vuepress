/* class.decorator.ts */

function demo1() {
  function enumerable(value: boolean) {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      descriptor.enumerable = value
    }
  }

  class Person {
    @enumerable(true)
    static staticMethod() {}
    @enumerable(true)
    method() {}
  }
  const p = new Person()
  for (const key in p) {
    console.log(key)
  }
  /**
   * method
   */
}

demo1()
