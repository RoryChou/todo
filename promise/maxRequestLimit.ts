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
  }, Promise.resolve())
}

function sendRequestMax(urls, max, callback) {
  let count = 0
  function executor() {
    if(urls.length === 0) {
      callback()
      return
    }
    if(count < max) {
      count++
      let url = urls.pop()
      fetch(url).then(res => {
        count--
        executor()
      }).catch(err => {
        count--
        executor()
      })
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
