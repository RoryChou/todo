async function asyncInOrder (urls) {
  for(let i of urls) {
    await fetch(i)
  }
}

function promiseInorder (urls) {
  const resolvedFn = Promise.resolve()
  urls.reduce((total,current) => {
    return total.then(() => {

    })
  },resolvedFn)
}

var a = [1,2,3,4,5]
a.reduce((total,current) => {
  return total+current
})

function logInOrder(urls) {
  // 远程读取所有URL
  const textPromises = urls.map(url => {
    return fetch(url).then(response => response.text());
  });

  // 按次序输出
  textPromises.reduce((chain, textPromise) => {
    return chain.then(() => textPromise)
      .then(text => console.log(text));
  }, Promise.resolve());
}
