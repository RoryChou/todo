// 基于rAF实现一个准确的定时器

function setIntervalNew (time,cb) {
  var lastTime = 0
  function rAFcb (timestamp) {
    if(lastTime === 0) {
      lastTime = timestamp
    }
    if(timestamp - lastTime >= time) {
      cb()
      lastTime = timestamp
    }
    window.$zhtid = window.requestAnimationFrame(rAFcb)
  }
  window.$zhtid =  window.requestAnimationFrame(rAFcb)
}



setIntervalNew(30000,() => {
  console.log(111)
})

cancelAnimationFrame(window.$zhtid)
