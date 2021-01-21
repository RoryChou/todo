// 将一个深层对象转换成响应式对象
/**
 *
 * */
function deepReactiveObject (obj) {
  if(isPlainObject(obj)){
    for(let key in obj){
      setReactive(obj, key, obj[key])
    }
  }
  return obj
}

function setReactive (obj, key, val) {
  deepReactiveObject(val)
  Object.defineProperty(obj,key,{
    get () {
      console.log('get', key, val)
      return val
    },
    set (v) {
      console.log('set', v)
      deepReactiveObject(v)
      val = v
    }
  })
}

function isPlainObject (targetObj) {
  return Object.prototype.toString.call(targetObj) === '[object Object]'
}

var data = {
  school: {
    name: 'a',
    age: 22,
    deep: {
      asd: 'asdasd'
    }
  }
}
var reactiveData = deepReactiveObject(data)
