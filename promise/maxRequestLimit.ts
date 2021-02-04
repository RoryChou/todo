// 通过max控制请求并发度，当所有请求完成后，执行callback。
// 请求使用fetch即可
function sendRequest (urls: string[],max:number,callback: () => void) {
  const obj:any = {}
  Object.defineProperty(obj,'index',{
    set(v: any): void {
      this.value = v
      // 通知
      executor()
    },
    get(): any {
      return this.value
    },
    value: 0,
    writable: true
  })

  function executor() {
    if(urls.length === 0) {
      callback()
      return
    }
    if(obj.index < max) {
      fetch(urls.pop()).then(res => {
        obj.index--
      })
      obj.index++
    }
  }
  executor()
}

async function sendRequestPromise(urls: string[], max: number, callback: () => void) {
  let resolveTask = []
  let index = 0
  if(urls.length === 0) {
    callback()
    return false
  }
  if(index>= max) {
    // @ts-ignore
    await new Promise((resolve, reject) => {
      resolveTask.push(resolve)
    })
  }
  index++
  fetch(urls.pop()).then(res => {
    index--
    resolveTask.pop()()
  })

  function send() {

  }
}


interface promiseChain {
  resolveFn: () => Promise<any>
}
function promiseQueue(tasks: promiseChain[]) {
  return tasks.reduce((promise,task) => {
    return promise.then(task.resolveFn)
    // @ts-ignore
  }, Promise.resolve())
}

function sendRequestMax(tasks, max, callback) {
  let count = 0
  const length = tasks.length
  let resultQueue = []
  function executor() {
    if(length === count) {
      // @ts-ignore
      Promise.all(resultQueue).then(() => {
        callback()
      })
      return
    }
    if(count < max) {
      let res = tasks[count]().then(() => {
        count--
        length !== count && executor()
      })
      resultQueue.push(res)
      count++
      executor()
    }
  }
  executor()
}
let urls = []
let i = 0
while(i < 20) {
  urls.push('https://www.runoob.com/jsref/met-element-addeventlistener.html')
  i++
}
sendRequestMax(urls,4,function () {
  console.log('callback')
})

function multiRequest(urls = [], maxNum) {
  // 请求总数量
  const len = urls.length;
  // 根据请求数量创建一个数组来保存请求的结果
  const result = new Array(len).fill(false);
  // 当前完成的数量
  let count = 0;

  return new Promise((resolve, reject) => {
    // 请求maxNum个
    while (count < maxNum) {
      next();
    }
    function next() {
      let current = count++;
      // 处理边界条件
      if (current >= len) {
        // 请求全部完成就将promise置为成功状态, 然后将result作为promise值返回
        !result.includes(false) && resolve(result);
        return;
      }
      const url = urls[current];
      console.log(`开始 ${current}`, new Date().toLocaleString());
      fetch(url)
      .then((res) => {
        // 保存请求结果
        result[current] = res;
        console.log(`完成 ${current}`, new Date().toLocaleString());
        // 请求没有全部完成, 就递归
        if (current < len) {
          next();
        }
      })
      .catch((err) => {
        console.log(`结束 ${current}`, new Date().toLocaleString());
        result[current] = err;
        // 请求没有全部完成, 就递归
        if (current < len) {
          next();
        }
      });
    }
  });
}

