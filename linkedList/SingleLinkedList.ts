class Node {
    val = ''
    next = null
    constructor(val,next){
        this.val = val
        this.next = next
    }
}

class SingleLinkedList {
    val = ''
    next = null
    head = null
    constructor() {
        this.head = null
        this.val = ''
        this.next = null
    }
    get(index){

    }
    addAtHead(val){

    }
    addAtTail(val){

    }
    addAtIndex(index,val){

    }
    deleteAtIndex(index){

    }
}

function test2(n = 4, max = 100) {
    var count = 1
    while (n>0){
        console.log(n)
        n--
        count++
        if(count>max) return false
    }
}
