// 重写array的方法，使其触发updateView方法

(function () {
  var oldPro = Array.prototype.push
  var newPro = function () {
    updateView()
    oldPro.call(this,arguments)
  }
})()
