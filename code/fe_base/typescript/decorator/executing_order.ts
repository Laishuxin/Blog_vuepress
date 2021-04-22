/* executing_order.ts */
/* the executing order of composition decorators */

// https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-evaluation
function first() {
  console.log("first(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first(): called");
  };
}

function second() {
  console.log("second(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second(): called");
  };
}

class ExampleClass {
  @first()
  @second()
  static method() {}
}

ExampleClass.method()
/**
 * first(): factory evaluated
 * second(): factory evaluated
 * second(): called
 * first(): called
 */