function sendRequestMax(tasks, max, callback) {
  let count = 0
  const length = tasks.length
  let resultQueue = []
  while(count < max){
    executor()
  }
  function executor() {
    count++
    if(length <= count) {
      // @ts-ignore
      Promise.all(resultQueue).then(res => {
        callback(res)
      })
      return
    }
    let res = tasks[count]().then(res => {
      console.log('res', res)
      if(length > count) {
        executor()
      }
      return res
    })
    resultQueue.push(res)
  }
}
let tasks = [1,1,2,1,3,1].map(item => {
  return function () {
    return new Promise((resolve, reject) => {
      setTimeout(resolve,item*1000, item)
    })
  }
})
sendRequestMax(tasks,2,function (res) {
  console.log('callback',res)
})
// let tasks = [1,1,1,1,2].map(item => {
//   return new Promise((resolve, reject) => {
//     setTimeout(resolve,item*1000, item)
//   }).then(res => {
//     console.log('res', res)
//     return res
//   })
// })
// Promise.all(tasks).then(res => {
//   console.log(res)
// })
