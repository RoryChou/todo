class SimpleMvvm {
  constructor (options){
    this.$el = options.el
    this.$data = options.data
    new Compiler(this.$el)
  }

}
class Compiler {
  constructor($el){
    let fragment = document.createDocumentFragment()
    let elem = document.querySelector($el)
    // 把儿子node弄进去处理一下
    fragment.appendChild(elem.firstChild)
    this.compile(fragment)
    // 把儿子node重新添加回来
    elem.appendChild(fragment)
  }
  compile(fragment){

  }
}
