// 模拟vue中的数据监听过程
function setReactive (target) {
    if(typeof target !== 'object' || target === null){
        return target
    }
    const observed = new Proxy(target,{
        get(target, p, receiver) {
            // 只处理本身（非原型）属性
            const ownKeys = Reflect.ownKeys(target)
            if (ownKeys.includes(p)) {
                console.log('get', p)
            }
            const value = Reflect.get(target, p, receiver)
            // 惰性递归,提高初始化性能
            return setReactive(value)
        },
        set(target, p, value, receiver) {
            if(value !== target[p]) {
                // 判断是新增还是修改
                const result = Reflect.set(target, p, value, receiver)
                console.log('set',p,value)
                // 返回是否设置成功
                return result
            }
        },
        deleteProperty(target, p) {
            const result = Reflect.deleteProperty(target, p)
            console.log('delete', p)
            return result
        },
        defineProperty(target, p, attributes) {
            const result = Reflect.defineProperty(target, p, attributes)
            console.log('defineProperty', p, attributes)
            return result
        }
    })
    return observed
}

function updateView () {
    console.log('updateView')
}


var data = {
    name: '123',
    age: 11,
    some: {
        a: 1
    },
    arr: []
}

data = setReactive(data)

// data.name = 123
// data.name = 1233
