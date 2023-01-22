// CopyRight © Rhodes Island Phr.Ltd. All Rights Reserverd
'use strict'

const greyDay = []

const greyDuration = [
  '2022-11-30~2022-12-6',
  '2023-1-5~2023-1-5',
  '2023-1-11~2023-1-14'
]

var time = new Date()

var timeLis = time.toLocaleDateString().replace('/', '-').replace('/', '-')

function greyAll() {
  $('html').css({
    '-webkit-filter': 'grayscale(100%)',
    '-moz-filter': 'grayscale(100%)',
    '-ms-filter': 'grayscale(100%)',
    '-o-filter': 'grayscale(100%)',
    filter: 'progid:DXImageTransform.Microsoft.BasicImage(grayscale=1)',
    _filter: 'none'
  })
}

function Numberlize(src) {
  // console.log('Numberlize src: ', src)
  return Number(src[0]) * 10000 + Number(src[1]) * 100 + Number(src[2])
}

function matchDuration(src) {
  let fromAndTo = src.split('~')
  let beg = Numberlize(fromAndTo[0].split('-'))
  let end = Numberlize(fromAndTo[1].split('-'))
  let now = Numberlize(timeLis.split('-'))
  return beg <= now && now <= end
}

function matchDay(src) {
  let now = Number(timeLis.split('-')[1]) * 100 + Number(timeLis.split('-')[2])
  let match = Number(src.split('-')[0]) * 100 + Number(src.split('-')[1])
  return now === match
}

var d

for (d of greyDuration) {
  if (matchDuration(d)) {
    console.log('Matched Duration, may the deceased rest in peace')
    greyAll()
  }
}

for (d of greyDay) {
  if (matchDay(d)) {
    console.log('Matched Day, may the deceased rest in peace')
    greyAll()
  }
}
