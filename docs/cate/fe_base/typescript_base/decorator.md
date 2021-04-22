---
title: decorator
time: 2021-04-22
author: ru shui
category: 前端基础
tag:
  - frontend
  - typescript
  - decorator
visitor: false
article: true
---

何为装饰器

> A Decorator is a special kind of declaration that can be attached to a class declaration, method, accessor, property, or parameter. Decorators use the form @expression, where expression must **evaluate to a function** that will be **called at runtime with information about the decorated declaration**. --[Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-factories)

简单地说，装饰器就是对待装饰对象的一层包装，例如：我们在送朋友礼物时，会在礼物外边加上一层包装，这层包装在编程中可以称之为装饰器，起到修饰的作用。

我们可以从 typescript 官方文档中了解到：装饰器是一个函数，其次就是装饰器可以在运行时获取被装饰对象的的信息。

## 装饰器的分类

- Class Decorator
- Method Decorator
- Accessor Decorator
- Property Decorator
- Parameter Decorator

## 装饰器的基本使用

在使用装饰器前，我们需要在 tsconfig 开启装饰器支持：

```json
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true
  }
}
```

考虑下面最简单的 Method 装饰器的基本使用：

```ts
function printDecorator(
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) {
  console.log('target: ', target)
  console.log('name: ', name)
  console.log('descriptor: ', descriptor)
}

class Person {
  @printDecorator
  static show(name: string) {}
}

Person.show('foo')
```

首先我们声明了一个装饰器(`printDecorator`)，然后只需要在需要装饰的地方使用`@[[decorator]]`即可，不同类型的装饰器可以得到被装饰对象的信息(也可以说装饰器的参数)也不尽相同。

## 装饰器的组合

多个装饰器可以一起使用，例如：

```ts
@f @g x

// or
@f
@g
x
```

组合的过程与数学中函数的组合类似：$(f \circ g)(x) = f(g(x))$
对于多重组合的装饰器，其执行过程如下：

1. 装饰器表达式的从**上到下**开始执行。
2. 装饰器的执行是**从下到上**。

考虑下面的例子:

```ts
// 可调用装饰器的原理是利用装饰性在装饰之前会执行表达式。
// @first() === @ (first())
// 只要我们在first函数中返回一个装饰器函数即可。
@first()
@second()
method() {}
```

执行过程为

1. first()
2. second()

也就是从上到下。
但是在装饰器内部，执行步骤是从下到上。
来看具体的输出过程即可明白其中的道理：

```ts
// https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-evaluation
function first() {
  console.log('first(): factory evaluated')
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log('first(): called')
  }
}

function second() {
  console.log('second(): factory evaluated')
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log('second(): called')
  }
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
```

## 装饰器的执行过程

1. Parameter Decorators, followed by Method, Accessor, or Property Decorators are applied for each instance member.
2. Parameter Decorators, followed by Method, Accessor, or Property Decorators are applied for each static member.
3. Parameter Decorators are applied for the constructor.
4. Class Decorators are applied for the class.

## Class 装饰器

### 基本使用

Class 装饰器是用于修饰一个类的，其装饰器的参数为被装饰类的构造函数。
考虑下面的例子：

```ts
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
```

**注意**：在装饰器内部修改了类属性/方法，不会在 typescript 中表现出来。考虑下面的例子：

```ts
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
console.log((p as any).age)
/**
 * foo
 * 18
 */
```

如上述例子所示，如果我们直接使用`p.age`则在 ts 中会抛出异常。我们在使用装饰器时，已经为`Person`添加的实例属性，还是可以访问到的。一种解决的方案就是我们可以在类中预先声明好类属性，例如`public age?: number`，这样就可以比避免 typescript 检查类型时抛出异常。

### 注意事项

1. 类装饰器只能用于具体的类上，不能作用在用 typescript declare 的类上
2. 使用类装饰器返回一个新的构造函数，那么需要自行维护好最初的原型。
3. 在装饰器内部修改类属性/方法，不会在 typescript 中表现出来，但是已经作用到被装饰的类上。

## Method 装饰器

Method 装饰器可以接收 3 个参数：

1. 静态成员的构造函数/非静态成员函数
2. 函数名
3. 函数修饰符
   考虑下面的例子：

```ts
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
```

 <!-- TODO(rushui 2021-04-22): fill it -->
## Accessor 装饰器

## Property 装饰器

## Parameter 装饰器

## metadata
