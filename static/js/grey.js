function greyAll() {
  $('html').css({
    '-webkit-filter': 'grayscale(100%)',
    '-moz-filter': 'grayscale(100%)',
    '-ms-filter': 'grayscale(100%)',
    '-o-filter': 'grayscale(100%)',
    // ie滤镜
    filter: 'progid:DXImageTransform.Microsoft.BasicImage(grayscale=1)',
    // ie6 等低版本浏览器不需要加滤镜
    _filter: 'none'
  })
}

function changeTimeFormat(src) {
  let s = src.split('/')
  return [s[1], s[2]]
}

let time = new Date()

let timeLis = changeTimeFormat(time.toLocaleDateString())

const greyT = [
  '11-30'
]

for (var match of greyT) {
  // console.log(match.split('-'), timeLis)
  if (match.split('-')[0] === timeLis[0] && match.split('-')[1] === timeLis[1]) {
    greyAll()
    break
  }
}
