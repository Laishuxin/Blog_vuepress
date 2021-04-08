// event loop: micro-task, macro-task and task
console.log('main: 1')

setTimeout(() => Promise.resolve().then(() => console.log('macro-task: with micro-task')))
setTimeout(() => console.log('macro-task: 1'))
Promise.resolve().then(() => console.log('micro-task: 1'))
// setTimeout(() => console.log('macro-task: 2'))
Promise.resolve().then(() => console.log('micro-task: 2'))

console.log('main: 2')
/**
 * main: 1
 * main: 2
 * micro-task: 1
 * micro-task: 2
 * macro-task: 1
 * macro-task: 2
 */