class SimpleMvvm {
  constructor (options){
    this.$el = options.el
    this.$data = options.data
    new Compiler(this.$el, this.$data)
  }

}
class Compiler {
  constructor($el, $data){
    this.$data = $data
    let fragment = document.createDocumentFragment()
    let elem = document.querySelector('#app')
    fragment.appendChild(elem.firstChild)
    // console.log('elem', elem)
    // 把儿子node从文档中取出，放入fragment中处理
    // 此时的儿子node是不在文档中的

    // console.log('333', fragment)
    // 处理node
    // this.compile(fragment)
    // 把儿子node重新添加回来
    // elem.appendChild(fragment)
  }
  /**
   * @param fragment
   * @desc 1. 替换文本节点中的{{}}为真正的值
   * 2. 替换
   * */
  compile(fragment){
    let childNodes = fragment.childNodes
    console.log('222', childNodes)
    childNodes.forEach(node => {
      this.compileText(node)
    })
  }
  compileText(node) {
    console.log('222', node)
    // 判断文本节点中是否包含{{}}
    let txtContent = node.textContent
    console.log('111', txtContent)
    if (/\{\{(.+?)\}\}/.test(txtContent)) {
      var newContent = ''
      txtContent.match(/\{\{(.+?)\}\}/)[1].split('.').forEach((item, index) => {
        if(index === 0) {
          newContent = this.$data[item]
        } else {
          newContent = newContent[item]
        }
      })
      console.log('111', newContent)
      // node.textContent = newContent
      /*node.textContent = txtContent.replace(/\{\{(.+?)\}\}/g, (...args) => {
        // args[1]为{{}}内部的内容
        return args[1].split('.').reduce((data, current) => {
          return data[current]
        }, this.$data)
      })*/
    }
  }
}
