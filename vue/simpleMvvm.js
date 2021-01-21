class SimpleMvvm {
  constructor (options){
    this.$el = options.el
    this.$data = options.data
    new Observer(this.$data)
    new Compiler(this.$el, this.$data)
  }

}
class Compiler {
  constructor($el, $data){
    this.$data = $data
    let fragment = document.createDocumentFragment()
    let elem = document.querySelector($el)
    // 把儿子node从文档中取出，放入fragment中处理
    // 此时的儿子node是不在文档中的
    // fixme 此处需要过滤其他类型的节点，如换行
    fragment.appendChild(elem.firstChild)
    // 处理node
    this.compile(fragment)
    // 把儿子node重新添加回来
    elem.appendChild(fragment)
  }
  /**
   * @param fragment
   * @desc 1. 替换文本节点中的{{}}为真正的值
   * 2. 替换
   * */
  compile(fragment){
    let childNodes = fragment.childNodes
    childNodes.forEach(node => {
      // fixme 待处理其他类型的节点，现在只有text节点
      this.compileText(node)
    })
  }
  compileText(node) {
    // 判断文本节点中是否包含{{}}
    let txtContent = node.textContent
    if (/\{\{(.+?)\}\}/.test(txtContent)) {
      new Watcher(function (newVal) {
        node.textContent = newVal
      })
      // var newContent = ''
      // txtContent.match(/\{\{(.+?)\}\}/)[1].split('.').forEach((item, index) => {
      //   if(index === 0) {
      //     newContent = this.$data[item]
      //   } else {
      //     newContent = newContent[item]
      //   }
      // })
      // node.textContent = newContent
      node.textContent = txtContent.replace(/\{\{(.+?)\}\}/g, (...args) => {
        console.log('replace')
        // args[1]为{{}}内部的内容
        return args[1].split('.').reduce((data, current) => {
          console.log('reduce')
          return data[current]
        }, this.$data)
      })
    }
  }
}

class Observer {
  constructor (data){
    this.observer(data)
  }
  /**
   * 递归添加响应式
   * */
  observer(data){
    if (data && typeof data === 'object') {
      for (let key in data) {
        let value = data[key]
        this.observer(value)
        // 添加响应式, 每个响应式属性对应一个dep实例，用来收集依赖&触发更新
        let dep = new Dep()
        let that = this
        Object.defineProperty(data, key,{
          configurable: true,
          enumerable: true,
          get () {
            console.log('get')
            // 依赖收集
            dep.loadWatcher()
            return value
          },
          set (v) {
            console.log('set')
            // 看看新加的属性值是不是需要监听一下
            that.observer(v)
            value = v
            // 通知修改
            dep.notify(v)
          }
        })

      }
    }
  }
}

class Watcher {
  constructor (cb){
    this.cb = cb
    Dep.watcher = this
  }
  update(newVal){
    this.cb(newVal)
  }
}

class Dep {
  constructor (){}
  loadWatcher(){
    // fixme 此处dep与watcher是一对多的关系，应该用队列保存watcher，此处简略表示
    this.watcher = Dep.watcher
  }
  notify(newVal){
    this.watcher.update(newVal)
  }
}
