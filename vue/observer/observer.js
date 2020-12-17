// 模拟vue中的数据监听过程
function setReactive (data, key, value) {
  observeObj(value)
  Object.defineProperty(data,key,{
    get () {
      return value
    },
    set (v) {
      if(v !== value){
        observeObj(v)
        value = v
        updateView()
      }
    }
  })
}

function updateView () {
  console.log('updateView')
}

var oldPro = Array.prototype
// 挂载原型用
var newPro = Object.create(oldPro)
['push','pop','shift','unshift'].forEach(item => {
  newPro[item] = function () {
    updateView()
    oldPro.call(this,arguments)
  }
})


function observeObj (obj) {
  if(typeof obj !== 'object' || obj === null){
    return obj
  }
  if(Array.isArray(obj)) {
    obj.__proto__ = newPro
  }

  for(var i in obj){
    setReactive(obj,i,obj[i])
  }
}

var data = {
  name: '123',
  age: 11,
  some: {
    a: 1
  }
}

observeObj(data)

data.name = 123
data.name = 1233
