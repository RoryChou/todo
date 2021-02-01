import util from './util.js'
function staticOne () {
  console.log('staticOne')
  util()
}
const someObj = {
  a:1,
  b:2
}
staticOne()
console.log(someObj)

setTimeout(() => {
  import('./async.js').then(res => {
    console.log(res.default.name)
  })
}, 3000)
