---
title: 执行上下文
time: 2021-04-20
author: ru shui
category: 前端基础
tag:
  - frontend
  - javascript
  - execute context
visitor: false
article: true
---

## 作用域链(scope chain)

由执行上下文变量对象构成的**链表**称之为作用域链。

js 引擎查找变量时会根据作用域链进行变量的查询。

1. 从当前上下文的变量对象中查找
2. 从父级执行上下文的变量对象查找
3. 从全局上下文变量对象查找

## this

### reference

> The Reference type is used to explain the behaviour of such operators as delete, typeof, and the assignment operators.
> A Reference is a resolved name binding.
> A Reference consists of three components, the base value, the referenced name and the Boolean valued strict reference flag.
> The base value is either undefined, an Object, a Boolean, a String, a Number, or an environment record (10.2.1).
> A base value of undefined indicates that the reference could not be resolved to a binding. The referenced name is a String.

一个引用包含三个部分：

- base value
- referenced name
- strict flag
  其中，base value 可以为 undefined, an Object, a Boolean, a String, a Number, or an environment record 其中一种。
  例如：

```js
var foo = 1
var fooReference = {
  base: EnvironmentRecord, // 指向全局环境
  name: 'foo',
  strict: false
}

var foo = {
  bar: function () {}
}

foo.bar()

var barReference = {
  base: foo,
  name: 'bar',
  strict: false
}
```

规范中对于 Reference 的两个常见方法：

- GetBase: GetBase(V). Returns the base value component of the reference V.
- IsPropertyReference: IsPropertyReference(V). Returns true if either the base value is **an object** or **HasPrimitiveBase(V)** is true; otherwise returns false.

例如：

```js
var foo = 1;
var fooReference = {
  base: EnvironmentRecord,
  name: 'foo',
  strict： false,
}

GetBase(fooReference) // 1. 相当于EnvironmentRecord.foo
```

这里，GetBase()得到的是一个具体的值，而不是引用。

### 确定 this 指向

1. Let ref be the result of evaluating MemberExpression.
2. If Type(ref) is Reference, then
   - If IsPropertyReference(ref) is true, then
     Let thisValue be GetBase(ref).
   - Else, the base of ref is an Environment Record
     Let thisValue be the result of calling the ImplicitThisValue concrete method of GetBase(ref).
3. Else, Type(ref) is not Reference.
   Let thisValue be undefined.

简单地理解就是：

1. *MemberExpression*执行结果赋给 ref。这里的*MemberExpression*可以是如下几种类型：
   - PrimaryExpression
   - FunctionExpression (`func()`)
   - MemberExpression [ Expression ](<`obj[func]()`>)
   - MemberExpression.IdentifierName (`obj.func()`)
   - new MemberExpression Arguments (`new Func()`)
2. 判断 ref 是否为引用类型
   - true。如果 ref _IsPropertyReference_，则`this = GetBase(ref)`。如果 ref _IsEnvironmentRecord_，则`this = ImplicitThisValue(ref)`
   - false。`this = undefined`

#### MemberExpression

如何理解`MemberExpression`，来看下面的例子：

```js
// case1
function foo() {}
foo() // MemberExpression = foo

// case2
function foo() {
  function bar() {}
}

foo()() // MemberExpression = foo()

var foo = {
  bar: function () {}
}

foo.bar() // MemberExpression = foo.bar
```

也就是说*MemberExpression*就是最右边括号前面的部分。

### Ref

怎么判断 ref 是否为 Reference 类型，来看下面几个例子：

```js
var value = 1
var foo = {
  value: 2,
  bar: function () {
    return this.value
  }
}

// case0
foo()
// case1
console.log(foo.bar())
// case2
console.log(foo.bar())
// case3
console.log((foo.bar = foo.bar)())
// case4
console.log((false || foo.bar)())
// case5
console.log((foo.bar, foo.bar)())
```

##### case0: `foo()`

这里，_MemberExpression_ 为 foo，也就是 Identifier Resolution.
对于 Identifier Resolution，标准规定了其返回值是一个 Reference，也就是如下代码：

```js
var fooReference = {
  base: EnvironmentRecord,
  name: 'foo',
  strict: false
}
```

根据标准 ref IsEnvironmentRecord，则`this = ImplicitThisValue(ref)`，即该函数返回的是一个 undefined，在非严格模式下，指向window

##### case1: `foo.bar()`

通过之前的描述，我们知道`foo.bar()`的*MemberExpression*为`foo.bar`，那么它是否为一个 Reference？这里需要根据标准加以描述：
对于`Property Accessors`：**Return a value of type Reference** whose base value is baseValue and whose referenced name is propertyNameString, and whose strict mode flag is strict.

对于本例，可以理解为如下代码：

```js
foo.bar() ==
  {
    base: foo,
    baseValue: 2,
    name: 'bar',
    strict: false
  }
```

从标准我们可以得知`Property Accessors`返回的是一个 Reference。那么，根据之前的判断，ref *IsPropertyReference*为 true，则`this = GetBase(ref)`，所以这里返回 2.

##### case2: `(foo.bar)()`

我们来看标准给出的答案：

> Return the result of evaluating Expression. This may be of type Reference. <br/>
> NOTE This algorithm does not apply GetValue to the result of evaluating Expression.

也就是说，使用()并不会执行括号内部的代码。所以返回的结果和 case1 一样。

##### case3: `(foo.bar = foo.bar)()`

对于赋值语句：`3.Let rval be GetValue(rref).`
也就是 right value = GetValue( right ref )。这里使用到了 GetValue，会导致引用丢失，所以返回的不是 Reference。

根据标准 ref is not a reference. `this = undefined`。但是，在非严格模式下，`this = window`，所以这里结果是 1。

##### case4: `(false || foo.bar)()`

对于逻辑判断语句：`Let lval be GetValue(lref).`

同样会造成引用丢失，返回结果和 case3 一样。

##### case5: `(foo.bar, foo.bar)()`

对于逗号：`Call GetValue(lref).`
返回的结果为 1，道理同上。

## 示例

```js
function Foo() {
  getName = function () {
    console.log(1)
  }
  return this
}

function getName() {
  console.log(5)
}

Foo().getName() // 1
```
上述例子的*MemberExpression*为`Foo().getName`，对于`Foo()`，this 指向window，所以`Foo().getName`调用的是window上的getName方法。
**但是**，这里坑就在于，js函数存在提升，所以，一开始`window.getName`指向的是一个函数，然而，在`Foo`函数内部，又将`window.getName`进行修改，所以输出为1。


## reference
