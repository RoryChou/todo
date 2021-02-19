function echo<T>(arg: T): T {
  return arg
}
const res = echo('str')

function swap<T,U>(tuple: [T,U]):[U,T] {
  return [tuple[1], tuple[0]]
}
const res2 = swap(['1',2])

function echoArr<T>(arg:T[]):T[] {
  console.log(arg.length)
  return  arg
}
const arr = echoArr([1,2,3])

interface IWithLength {
  length: Number
}
function echoWithLength<T extends IWithLength>(arg: T):T {
  console.log(arg.length)
  return  arg
}
const str = echoWithLength('123')
const obj = echoWithLength({})
const arr = echoWithLength([1,2,3])
const number = echoWithLength(123)
