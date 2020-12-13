function createElement (vnode) {
  var tag = vnode.tag
  var attrs = vnode.attrs || {}
  var children = vnode.children || []

  var elem = document.createElement(tag)

  for(attr in attrs) {
    if(attrs.hasOwnProperty(attr)) {
      elem.setAttribute(attr, attrs[attr])
    }
  }
  for(var i = 0;i < children.length;i++) {
    if(typeof children === 'string'){
      elem.innerHTML = children
    } else {
      elem.appendChild(createElement(children[i]))
    }
  }
  return elem
}
function Parent() {
  this.a = 1;
  this.b = [1, 2, this.a];
  this.c = { demo: 5 };
  this.show = function () {
    console.log(this.a , this.b , this.c.demo );
  }
}
function Child() {
  this.a = 2;
  this.change = function () {
    this.b.push(this.a);
    this.a = this.b.length;
    this.c.demo = this.a++;
  }
}
Child.prototype = new Parent();
var parent = new Parent();
var child1 = new Child();
var child2 = new Child();
child1.a = 11;
child2.a = 12;
parent.show();1,[1,2,1],5
child1.show();11,[1,2,1],5
console.log(child1)
child2.show();12,[1,2,1],5
child1.change();5,[1,2,1,11],5
child2.change();6,[1,2,1,11,5],6
parent.show();1,[1,2,1],5
child1.show();5,[1,2,1,11,5],6
child2.show();6,[1,2,1,11,5],6
