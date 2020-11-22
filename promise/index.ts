// 1.Promise存在三个状态：pending（等待态）、fulfilled（成功态）、rejected（失败态）
const STATUS_PENDING = 'pending'
const STATUS_FULFILLED = 'fulfilled'
const STATUS_REJECTED = 'rejected'

// 类类型
interface MyPromise {

}

interface Executor {
  (resolve:(res?:any) => void, reject?:(err?:any) => void)
}
class myPromise {
  private value:any = ''
  private reason:any = ''
  private status:string = STATUS_PENDING
  private onResolvedCallbacks = []
  private onRejectedCallbacks = []
  constructor(executor:Executor) {
    // pending为初始态，并可以转化为fulfilled和rejected
    // this.status = STATUS_PENDING
    // this.value = '' // 3
    // this.reason = '' // 4

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
  // 8. then方法返回一个新的promise实例,
  then(onFulfilled, onRejected?) {
    const promise2 = new myPromise((resolve, reject) => {
      // 8.1
      if (this.status === STATUS_FULFILLED) {
        try {
          // todo 如果val还是一个promise呢？递归处理
          const val = onFulfilled(this.value)
          this._resolvePromise(promise2,val,resolve,reject)
          resolve(val)
        }catch (e) {
          reject(e)
        }
      }
      // 8.2
      if (this.status === STATUS_REJECTED) {
        onRejected(this.reason)
      }

      // 忙碌状态,先记录老板吩咐的内容
      if (this.status === STATUS_PENDING) {
        // onFulfilled传入到成功数组
        this.onResolvedCallbacks.push(() => onFulfilled(this.value))
        // onRejected传入到失败数组
        this.onRejectedCallbacks.push(() => onRejected(this.reason))
      }
    })
  }

  // 内部递归promise方法
  _resolvePromise(promise2,x,resolve,reject) {
    // 如果x是promise，则继续递归
    if((typeof x === 'object' && x !== null) || typeof x === 'function') {
      // 有可能是promise, 如果是promise那就要有then方法
      let then = x.then;
      if (typeof then === 'function') { // 到了这里就只能认为他是promise了
        // 如果x是一个promise那么在new的时候executor就立即执行了，就会执行他的resolve，那么数据就会传递到他的then中
        then.call(x, y => {// 当前promise解析出来的结果可能还是一个promise, 直到解析到他是一个普通值
          resolvePromise(promise2, y, resolve, reject);// resolve, reject都是promise2的
        }, r => {
          reject(r);
        });
      } else {
        // 出现像这种结果 {a: 1, then: 1}
        resolve(x);
      }
    } else {
      resolve(x)
    }
  }
}



