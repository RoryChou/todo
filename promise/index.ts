// 1.Promise存在三个状态：pending（等待态）、fulfilled（成功态）、rejected（失败态）
const STATUS_PENDING = 'pending'
const STATUS_FULFILLED = 'fulfilled'
const STATUS_REJECTED = 'rejected'

interface Executor {
  (resolve:(res?:any) => void, reject?:(err?:any) => void):void
}
class MyPromise {
  private value:any = ''
  private reason:any = ''
  private status:string = STATUS_PENDING
  private onResolvedCallbacks = []
  private onRejectedCallbacks = []
  constructor(executor:Executor) {
    const resolve = value => {
      // 5.
      if (this.status === STATUS_PENDING) {
        this.status = STATUS_FULFILLED
        this.value = value
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }
    const reject = reason => {
      //6.
      if (this.status === STATUS_PENDING) {
        this.status = STATUS_REJECTED
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    // 7.
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  // 8. then方法返回一个新的promise实例
  // 回调函数执行、注册器
  then(onFulfilled, onRejected?) {
    const promise2 = new MyPromise((resolve, reject) => {
      // 8.1
      if (this.status === STATUS_FULFILLED) {
        // todo 推入微任务，目的是为了将promise2传入_resolvePromise内
        // 浏览器环境没有微任务方法，只能用setTimeout模拟，但是setTimeout是宏任务
        setTimeout(() => {
          try {
            // todo 如果val还是一个promise呢？递归处理
            const val = onFulfilled(this.value)
            // 递归处理val下面所有返回值，直到返回非promise，再决议promise2
            this._resolvePromise(promise2,val,resolve,reject)
          }catch (e) {
            reject(e)
          }
        })
      }
      // 8.2
      if (this.status === STATUS_REJECTED) {
        onRejected(this.reason)
      }

      // 忙碌状态,先记录老板吩咐的内容
      if (this.status === STATUS_PENDING) {
        // onFulfilled传入到成功数组
        this.onResolvedCallbacks.push(
        // 通过回调的形式来实现:当 promise 被决议时，依次执行之前注册的回调
        () => {
          setTimeout(() => {
            try {
              let res = onFulfilled(this.value)
              this._resolvePromise(promise2, res, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
        // onRejected传入到失败数组
        this.onRejectedCallbacks.push(() => onRejected(this.reason))
      }
    })
    return promise2
  }

  // 内部递归promise方法
  _resolvePromise(promise2,value,resolve,reject) {
    // 防止作为返回值的 promise 可能既调 resolve 又调用 reject 情况
    // let called;
    // 如果循环引用则通过 reject 抛出错误
    // if (value === promise2) {
    //   reject(new TypeError('Chaining cycle detected for promise'));
    // }
    //如果 value 处于 pending，promise 需保持为等待状态直至 value 被执行或拒绝
    //如果 value 处于其他状态，则用相同的值处理 Promise

    //无论 value 是对象还是函数，只要有 then 方法就可以被决议
    // if (value && typeof value === 'object' || typeof value === 'function') {
    //   // 以下情况都需要使用 try/catch 包裹起来
    //   // 因为可能存在 then 方法被定义了一个抛出错误的访问器的情况
    //   try {
    //     let then = value.then
    //     if (typeof then === 'function') {
    //       // 这里为了符合 a+ 规范需要使用 call 的形式绑定 this 指向
    //       then.call(value,
    //       // 定义如何展开这个 promise
    //       // 内部给 then 方法自定义了 onFulfilled/onRejected 函数，规定处理逻辑
    //       // 当作为返回值的 promise 被决议后再决议这个 then 方法生成的 promise(promise2)
    //       res => {
    //         if (called) return;
    //         called = true;
    //         // 递归调用 resolvePromise 直到传入的 value 不是一个 promise 对象为止
    //         // 传递 promise2 是为了通过闭包保留 promise2 防止后续的循环引用
    //         this._resolvePromise(promise2, res, resolve, reject);
    //       },
    //       err => {
    //         if (called) return;
    //         called = true;
    //         reject(err);
    //       })
    //     } else {
    //       // 是一个对象但没有 then 方法则直接决议
    //       resolve(value)
    //     }
    //   } catch (e) {
    //     // 报错情况需要让这个 promise2 状态变为 reject 并且锁定防止多次更改
    //     if (called) return;
    //     called = true;
    //     reject(e);
    //   }
    // } else {
    //   resolve(value)
    // }

    if(MyPromise._isPromise(value)) {
      value.then(res => {
        this._resolvePromise(promise2,res,resolve,reject)
      }, err => {
        reject(err)
      })
    } else {
      resolve(value)
    }

  }

  // 判断一个对象是否为promise
  static _isPromise(obj:any):boolean {
    if(obj !== null && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function') {
      return true
    } else {
      return false
    }
    // 可能不是使用原生Promise、所以用这个方法不是很妥当
    // return obj instanceof MyPromise
  }
}

var example = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    // resolve函数做了三件事
    // 1. 将example状态设置为fulfilled
    // 2. 将example内部value值设置为123
    // 3. 执行example内部的回调函数队列
    resolve(123)
  }, 2000)
})

// then函数挂载回调函数至example
example.then(res => {
  console.log('then', res)
})



