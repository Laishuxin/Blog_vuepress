console.log('start')
setTimeout(() => {
  console.log('children2')
  Promise.resolve().then(() => {
    console.log('children3')
  })
}, 0)

new Promise((resolve) => {
  console.log('children 4')
  setTimeout(() => {
    console.log('children 5')
    resolve('children 6')
  }, 0)
}).then((res) => {
  console.log('children 7')
  setTimeout(() => {
    console.log(res)
  }, 0)
})

// start
// children 4
// children 2
// children 3
// children 5
// children 7
// children 6

