function callExample1 () {
  const data = {
    name: 'foo',
    age: 18
  }
  function test1 () {
    console.log(this.name)
    console.log(this.age)
  }
  
  test1.call0(data)
}

callExample1()