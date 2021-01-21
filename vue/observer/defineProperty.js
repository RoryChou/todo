// Object.defineProperty的详细描述
// 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。
var data = {}
Object.defineProperty(data, 'test',{
  configurable: false,
  value: 'test'
})
// false
delete data.test

var data1 = {}
Object.defineProperty(data1, 'test',{
  enumerable: false,
  value: 'test'
})
data1.asd = 123
// VM256:7 Uncaught TypeError: data1 is not iterable
for(val of data1) {
  console.log(val)
}
// asd
for(var i in data1){
  console.log(i)
}
// [asd]
Object.keys(data1)

var data2 = {}
Object.defineProperty(data2,'test',{
  writable: true,
  value: 'test'
})
// {data2:{test:111}}
data2.test = 111
// false
delete data2.test

var data3 = {}
var value = 'test'
Object.defineProperty(data3,'test',{
  get () {
    return value
  },
  set (v) {
    value = v
  }
})

data3.test = 123
// false
delete data3.test
// Uncaught TypeError: data3 is not iterable
for(var val of data3){
  console.log(val)
}
