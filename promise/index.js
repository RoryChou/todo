// 1.Promise存在三个状态：pending（等待态）、fulfilled（成功态）、rejected（失败态）
var STATUS_PENDING = 'pending';
var STATUS_FULFILLED = 'fulfilled';
var STATUS_REJECTED = 'rejected';
var MyPromise = /** @class */ (function () {
    function MyPromise(executor) {
        var _this = this;
        this.value = '';
        this.reason = '';
        this.status = STATUS_PENDING;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        var resolve = function (value) {
            // 5.
            if (_this.status === STATUS_PENDING) {
                _this.status = STATUS_FULFILLED;
                _this.value = value;
                _this.onResolvedCallbacks.forEach(function (fn) { return fn(); });
            }
        };
        var reject = function (reason) {
            //6.
            if (_this.status === STATUS_PENDING) {
                _this.status = STATUS_REJECTED;
                _this.reason = reason;
                _this.onRejectedCallbacks.forEach(function (fn) { return fn(); });
            }
        };
        // 7.
        try {
            executor(resolve, reject);
        }
        catch (err) {
            reject(err);
        }
    }
    // 8. then方法返回一个新的promise实例
    // 回调函数执行、注册器
    MyPromise.prototype.then = function (onFulfilled, onRejected) {
        var _this = this;
        var promise2 = new MyPromise(function (resolve, reject) {
            // 8.1
            if (_this.status === STATUS_FULFILLED) {
                try {
                    // todo 如果val还是一个promise呢？递归处理
                    var val = onFulfilled(_this.value);
                    // 递归处理val下面所有返回值，直到返回非promise，再决议promise2
                    _this._resolvePromise(promise2, val, resolve, reject);
                }
                catch (e) {
                    reject(e);
                }
            }
            // 8.2
            if (_this.status === STATUS_REJECTED) {
                onRejected(_this.reason);
            }
            // 忙碌状态,先记录老板吩咐的内容
            if (_this.status === STATUS_PENDING) {
                // onFulfilled传入到成功数组
                _this.onResolvedCallbacks.push(
                // 通过回调的形式来实现:当 promise 被决议时，依次执行之前注册的回调
                function () {
                    try {
                        var res = onFulfilled(_this.value);
                        _this._resolvePromise(promise2, res, resolve, reject);
                    }
                    catch (e) {
                        reject(e);
                    }
                });
                // onRejected传入到失败数组
                _this.onRejectedCallbacks.push(function () { return onRejected(_this.reason); });
            }
        });
        return promise2;
    };
    // 内部递归promise方法
    MyPromise.prototype._resolvePromise = function (promise2, value, resolve, reject) {
        // 防止作为返回值的 promise 可能既调 resolve 又调用 reject 情况
        // let called;
        // 如果循环引用则通过 reject 抛出错误
        // if (value === promise2) {
        //   reject(new TypeError('Chaining cycle detected for promise'));
        // }
        //如果 value 处于 pending，promise 需保持为等待状态直至 value 被执行或拒绝
        //如果 value 处于其他状态，则用相同的值处理 Promise
        var _this = this;
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
        if (MyPromise._isPromise(value)) {
            value.then(function (res) {
                _this._resolvePromise(promise2, res, resolve, reject);
            }, function (err) {
                reject(err);
            });
        }
        else {
            resolve(value);
        }
    };
    // 判断一个对象是否为promise
    MyPromise._isPromise = function (obj) {
        if (obj !== null && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function') {
            return true;
        }
        else {
            return false;
        }
        // 可能不是使用原生Promise、所以用这个方法不是很妥当
        // return obj instanceof MyPromise
    };
    return MyPromise;
}());
var example = new MyPromise(function (resolve, reject) {
    setTimeout(function () {
        resolve(123);
    }, 2000);
});
example.then(function (res) {
    console.log('then', res);
});
new MyPromise((resolve, reject) => {
    console.log("log: 外部promise");
    resolve();
})
    .then(() => {
        console.log("log: 外部第一个then");
        new Promise((resolve, reject) => {
            console.log("log: 内部promise");
            resolve();
        })
            .then(() => {
                console.log("log: 内部第一个then");
            })
            .then(() => {
                console.log("log: 内部第二个then");
            });
    })
    .then(() => {
        console.log("log: 外部第二个then");
    });

var promise1 = new Promise((resolve, reject) => {
    console.log('log: 外部promise')
    resolve()
})
console.log('log: 外部第一个then 之前')
var promise2 = promise1.then(function () {
    console.log("log: 外部第一个then");
    // var promise3 = new Promise((resolve, reject) => {
    //     console.log('log: 内部promise')
    //     resolve()
    // })
    // console.log("log: 内部第一个then 之前");
    // var promise4 = promise3.then(function () {
    //     console.log("log: 内部第一个then");
    // })
    // console.log("log: 内部第一个then 之后")
    // var promise5 = promise4.then(function () {
    //     console.log("log: 内部第二个then");
    // })
    // console.log("log: 内部第二个then 之后")
})
console.log('log: 外部第二个then 之前', promise2.toString())
var promise6 = promise2.then(function () {
    console.log("log: 外部第二个then");
})
new Promise((resolve, reject) => {
    console.log('log: 外部promise')
    resolve()
}).then(function () {
    console.log("log: 外部第一个then");
    // var promise3 = new Promise((resolve, reject) => {
    //     console.log('log: 内部promise')
    //     resolve()
    // })
    // console.log("log: 内部第一个then 之前");
    // var promise4 = promise3.then(function () {
    //     console.log("log: 内部第一个then");
    // })
    // console.log("log: 内部第一个then 之后")
    // var promise5 = promise4.then(function () {
    //     console.log("log: 内部第二个then");
    // })
    // console.log("log: 内部第二个then 之后")
}).then(function () {
    console.log("log: 外部第二个then");
})
