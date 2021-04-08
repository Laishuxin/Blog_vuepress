/* object_member1.js */

const obj = {}
console.log(obj.__proto__)
console.log(Object.getPrototypeOf(obj) === obj.__proto__) // true
