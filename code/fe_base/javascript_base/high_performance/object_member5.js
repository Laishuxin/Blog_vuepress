/* object_member5.js */

function Book(title, publisher) {
  this.title = title
  title.publisher = publisher
}

Book.prototype.sayTitle = function () {
  console.log(this.title)
}

const book1 = new Book('book1', 'publisher1')
// true
console.log(book1 instanceof Book)
// true
console.log(book1 instanceof Object)

// book1
book1.sayTitle()

// [object Object]
console.log(book1.toString())
