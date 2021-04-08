/* object_member4.js */

const book = {
  title: 'high performance javascript',
  publisher: 'yahoo'
}

// true
console.log(book.hasOwnProperty('title'))
// false
console.log(book.hasOwnProperty('toString'))
// [ 'title', 'publisher' ]
console.log(Object.getOwnPropertyNames(book))

// true
console.log('title' in book)
// true
console.log(Reflect.has(book, 'toString'))
