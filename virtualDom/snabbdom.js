// h函数，创建vnode
// patch函数，对比vnode并渲染在页面上
var container = document.querySelector('body')
var vnode = h('hl#container',{className: 'container'},[
  h('li',{style:{color:'#000'}},'this is black'),
  'this is a empty node',
  h('a',{href:'www.baidu.com'},'to baidu'),
])

patch(container,vnode)

var newVnode = h('hl#container',{className: 'container'},[
  h('li',{style:{color:'#fff'}},'this is white'),
  'this is a empty node',
  h('a',{href:'www.baidu.com'},'to baidu'),
])

patch(vnode,newVnode)
