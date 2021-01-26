var a = [
  {
    question: 'SH20-3-10'
  },
  {
    question: 'SH20-3-2'
  },
  {
    question: 'SH20-3-1'
  },
  {
    question: 'SH20-3-3-1'
  },
  {
    question: 'SH20-3-3-0'
  },
  {
    question: 'SH20-3-3'
  },
  {
    question: 'SH20-3-3-4'
  },
  {
    question: 'SH20-3-9'
  }
]
var b = a.sort(function (a, b) {
  var i = 1;
  while(i < 4) {
    var currentNumA = a.question.split('-')[i] || -1
    var currentNumB = b.question.split('-')[i] || -1
    if(currentNumA === currentNumB && currentNumA !== -1){
      i++
    } else {
      return currentNumA - currentNumB
    }
  }
})
