// 测试for循环，for in 循环，数组forEach，some方法的跳出逻辑

function forOne() {
    const arr = [1,2,3,4,5]
    for(let i = 0;i <arr.length;i++){
        console.log('for begin')
        if(arr[i] === 3) {
            break
        }
    }
}

forOne()

function forTwo() {
    const arr = [[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5]]
    for(let i = 0;i <arr.length;i++){
        console.log('for begin')
        for(let j = 0;j <arr.length;j++){
            console.log('for inside')
            if(arr[i][j] === 3) {
                break
            }
        }
    }
}
forTwo()
