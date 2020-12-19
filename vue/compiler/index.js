const compiler = require('vue-template-compiler')

// 插值
const template = '<p>{{message}}</p>'

// 编译
const res = compiler.compile(template)
console.log(res.render)
