/* eslint-disable no-undef */
/* eslint-disable one-var */
const hSize = 10
const wSize = 9
class Piece {
  static role = {
    empty: 0,
    captain: 1,
    guard: 2,
    elephant: 3,
    horse: 4,
    car: 5,
    duck: 6,
    soldier: 7
  }
  static str = {
    [Piece.role.empty]: 'empty',
    [Piece.role.captain]: 'captain',
    [Piece.role.guard]: 'guard',
    [Piece.role.elephant]: 'elephant',
    [Piece.role.horse]: 'horse',
    [Piece.role.car]: 'car',
    [Piece.role.duck]: 'duck',
    [Piece.role.soldier]: 'soldier'
  }
  static cName = {
    [Piece.role.empty]: '',
    [Piece.role.captain]: '王',
    [Piece.role.guard]: '士',
    [Piece.role.elephant]: '象',
    [Piece.role.horse]: '马',
    [Piece.role.car]: '车',
    [Piece.role.duck]: '鸭',
    [Piece.role.soldier]: '兵'
  }
  static moveChk = {
    [Piece.role.empty]: () => false,
    [Piece.role.captain]: (x1, y1, x2, y2) => {
      const canMove = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
      ]
      return canMove.some((move) => {
        return x1 + move.x === x2 && y1 + move.y === y2
      })
    },
    [Piece.role.guard]: (x1, y1, x2, y2) => {
      const canMove = [
        { x: 1, y: 1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
        { x: -1, y: -1 }
      ]
      return canMove.some((move) => {
        return x1 + move.x === x2 && y1 + move.y === y2
      })
    },
    [Piece.role.elephant]: (x1, y1, x2, y2) => {
      const canMove = [
        { x: 2, y: 2, xLim: 1, yLim: 1 },
        { x: 2, y: -2, xLim: 1, yLim: -1 },
        { x: -2, y: 2, xLim: -1, yLim: 1 },
        { x: -2, y: -2, xLim: -1, yLim: -1 }
      ]
      return canMove.some((move) => {
        return x1 + move.x === x2 && y1 + move.y === y2 && map[x1 + move.xLim][y1 + move.yLim].isEmpty()
      })
    },
    [Piece.role.horse]: (x1, y1, x2, y2) => {
      const canMove = [
        { x: -1, y: 2, xLim: 0, yLim: 1 },
        { x: 1, y: 2, xLim: 0, yLim: 1 },
        { x: 2, y: 1, xLim: 1, yLim: 0 },
        { x: 2, y: -1, xLim: 1, yLim: 0 },
        { x: 1, y: -2, xLim: 0, yLim: -1 },
        { x: -1, y: -2, xLim: 0, yLim: -1 },
        { x: -2, y: -1, xLim: -1, yLim: 0 },
        { x: -2, y: 1, xLim: -1, yLim: 0 }
      ]
      return canMove.some((move) => {
        return x1 + move.x === x2 && y1 + move.y === y2 && map[x1 + move.xLim][y1 + move.yLim].isEmpty()
      })
    },
    [Piece.role.car]: (x1, y1, x2, y2) => {
      if (x1 === x2 && y1 !== y2) {
        // Horizontally, check if there are non-empty elements between the 2 positions
        const [left, right] = y1 < y2 ? [y1, y2] : [y2, y1]
        return map[x1].slice(left + 1, right).every((element) => element.isEmpty())
      } else if (y1 === y2 && x1 !== x2) {
        // Vertically, check if there are non-empty elements between the 2 positions
        const [top, bottom] = x1 < x2 ? [x1, x2] : [x2, x1]
        return map.slice(top + 1, bottom).every((subArr) => subArr[y1].isEmpty())
      }
      return false
    },
    [Piece.role.duck]: (x1, y1, x2, y2) => {
      const canDis = [
        { dx: 1, dy: 1 },
        { dx: 1, dy: -1 },
        { dx: -1, dy: 1 },
        { dx: -1, dy: -1 }
      ]
      return canDis.some((dis) => {
        return (x1 + dis.dx * 3 === x2 && y1 + dis.dy * 2 === y2 && map[x1 + dis.dx * 2][y1 + dis.dy].isEmpty() && map[x1 + dis.dx][y1].isEmpty()) ||
          (x1 + dis.dx * 2 === x2 && y1 + dis.dy * 3 === y2 && map[x1 + dis.dx][y1 + dis.dy * 2].isEmpty() && map[x1][y1 + dis.dy].isEmpty())
      })
    },
    [Piece.role.soldier]: (x1, y1, x2, y2) => {
      const canMove = [
        { x: 1, y: 1 },
        { x: 1, y: 0 },
        { x: 1, y: -1 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
        { x: -1, y: 1 },
        { x: -1, y: 0 },
        { x: -1, y: -1 }
      ]
      return canMove.some((move) => {
        return x1 + move.x === x2 && y1 + move.y === y2
      })
    }
  }
  constructor(type, team = 0) {
    this.type = type
    this.team = team
    this.name = Piece.str[type]
    this.cName = Piece.cName[type]
  }
  setPosition(x, y) {
    this.x = x
    this.y = y
  }
  canMoveTo(x, y) {
    if (x < 0 || y < 0 || x >= hSize || y >= wSize || this.team !== curTeam || map[x][y].team === curTeam) return false
    return Piece.moveChk[this.type](this.x, this.y, x, y)
  }
  isEmpty() {
    return this.type === 0
  }
  onDeath() {
    if (this.type === 1) {
      curTeam = 3
      text = `${this.team === 1 ? '蓝' : '红'}方胜利`
      curtain = curtainTime
      textColor = curtainColor = this.team === 1 ? '#00f' : '#f00'
    }
  }
}
class Rect {
  constructor(left, top, right, bottom) {
    this.left = left
    this.top = top
    this.right = right
    this.bottom = bottom
  }
  get width() {
    return this.right - this.left
  }
  get height() {
    return this.bottom - this.top
  }
  get midX() {
    return (this.left + this.right) / 2
  }
  get midY() {
    return (this.top + this.bottom) / 2
  }
}
const initMap = [
  [
    new Piece(Piece.role.car, 1), new Piece(Piece.role.horse, 1), new Piece(Piece.role.elephant, 1),
    new Piece(Piece.role.guard, 1), new Piece(Piece.role.captain, 1), new Piece(Piece.role.guard, 1),
    new Piece(Piece.role.elephant, 1), new Piece(Piece.role.horse, 1), new Piece(Piece.role.car, 1)
  ],
  [
    new Piece(0), new Piece(0), new Piece(0), new Piece(0), new Piece(0),
    new Piece(0), new Piece(0), new Piece(0), new Piece(0)
  ],
  [
    new Piece(Piece.role.duck, 1), new Piece(0), new Piece(0), new Piece(0), new Piece(0),
    new Piece(0), new Piece(0), new Piece(0), new Piece(Piece.role.duck, 1)
  ],
  [
    new Piece(Piece.role.soldier, 1), new Piece(0), new Piece(Piece.role.soldier, 1),
    new Piece(0), new Piece(Piece.role.soldier, 1), new Piece(0),
    new Piece(Piece.role.soldier, 1), new Piece(0), new Piece(Piece.role.soldier, 1)
  ],
  [
    new Piece(0), new Piece(0), new Piece(0), new Piece(0), new Piece(0),
    new Piece(0), new Piece(0), new Piece(0), new Piece(0)
  ],
  [
    new Piece(0), new Piece(0), new Piece(0), new Piece(0), new Piece(0),
    new Piece(0), new Piece(0), new Piece(0), new Piece(0)
  ],
  [
    new Piece(Piece.role.soldier, 2), new Piece(0), new Piece(Piece.role.soldier, 2),
    new Piece(0), new Piece(Piece.role.soldier, 2), new Piece(0),
    new Piece(Piece.role.soldier, 2), new Piece(0), new Piece(Piece.role.soldier, 2)
  ],
  [
    new Piece(Piece.role.duck, 2), new Piece(0), new Piece(0), new Piece(0), new Piece(0),
    new Piece(0), new Piece(0), new Piece(0), new Piece(Piece.role.duck, 2)
  ],
  [
    new Piece(0), new Piece(0), new Piece(0), new Piece(0), new Piece(0),
    new Piece(0), new Piece(0), new Piece(0), new Piece(0)
  ],
  [
    new Piece(Piece.role.car, 2), new Piece(Piece.role.horse, 2), new Piece(Piece.role.elephant, 2),
    new Piece(Piece.role.guard, 2), new Piece(Piece.role.captain, 2), new Piece(Piece.role.guard, 2),
    new Piece(Piece.role.elephant, 2), new Piece(Piece.role.horse, 2), new Piece(Piece.role.car, 2)
  ]
]
const blockSize = 80
const boardRect = new Rect(40, 40, 40 + wSize * blockSize, 40 + hSize * blockSize)
const textRect = new Rect(boardRect.left + 10, boardRect.bottom + 40, boardRect.right - 10, boardRect.bottom + 80)
const stageRect = new Rect(0, 0, boardRect.right + 40, textRect.bottom + 40)
const menuRect = new Rect(stageRect.right, 0, stageRect.right + 600, stageRect.bottom)
const appRect = new Rect(0, 0, menuRect.right, menuRect.bottom)
const errShowTime = 40
const shineTime = 40
const shakeTime = 10
const curtainTime = 60
const shakeDis = [0, 1, 1, 2, 2, 3, 4, 6, 9, 13, 20]
let map = [], badClick = [], shine = [], canChoose = [], move = 0
let stage, ctx, menu, restart
let text = '红方下棋', textColor = '#f00'
let curtain = 0, curtainColor
let windowWidth, windowHeight
function resize() {
  windowWidth = document.documentElement.clientWidth
  windowHeight = document.documentElement.clientHeight
  const scale = Math.min(windowWidth / appRect.width, windowHeight / appRect.height)
  stage.css({ width: stageRect.width * scale, height: stageRect.height * scale })
  menu.css({ width: menuRect.width * scale, height: menuRect.height * scale - 200, fontSize: 24 * scale, padding: 20 * scale })
}
window.addEventListener('resize', resize)
function init() {
  // initialize game arrays
  initMap.forEach((subArr, i) => {
    map[i] = [...subArr]
    subArr.forEach((element, j) => {
      element.setPosition(i, j)
    })
  })
  badClick = Array(hSize).fill().map(() => Array(wSize).fill(0))
  shine = Array(hSize).fill().map(() => Array(wSize).fill(0))
  canChoose = Array(hSize).fill().map(() => Array(wSize).fill(false))
  // create stage canvas and menu elements
  stage = $(`<canvas width='${stageRect.width}' height='${stageRect.height}'></canvas>`)
  ctx = stage[0].getContext('2d')
  menu = $(`<div id='menu'><h3>菜单</h3><fieldset><legend>操作</legend></fieldset><fieldset><legend>关于</legend><p>这个项目由 <a href='https://github.com/caibyte' target="_blank">caibyte</a> 编写, <a href='https://github.com/FredB-mine' target="_blank">Dr.Alfred</a> 进行修改</p><p><a href='https://github.com/caibyte/DuckchessOnline' target="_blank">github链接</a>&nbsp;&nbsp;<a href='http://alfredoj.natapp1.cc/static/games/DuckchessOnline/LICENSE.html' target="_blank">MIT条款</a></p></fieldset><fieldset><legend>规则</legend><a href='https://www.luogu.com.cn/problem/P5380' target="_blank">点我查看</a></fieldset></div>`)
  restart = $('<button class="btn">重新开始</button>')
  menu.children('fieldset')[0].append(restart[0])
  resize()
  restart.click(() => {
    initMap.forEach((subArr, i) => {
      map[i] = [...subArr]
      subArr.forEach((element, j) => {
        element.setPosition(i, j)
      })
    })
    shine = Array(hSize).fill().map(() => Array(wSize).fill(0))
    canChoose = Array(hSize).fill().map(() => Array(wSize).fill(false))
    curTeam = 1
    text = '红方下棋'
    textColor = '#f00'
    curtainColor = '#fff'
    curtain = curtainTime
  })
  stage.click((e) => {
    click.push({ x: e.offsetX / stage.width() * stageRect.width, y: e.offsetY / stage.height() * stageRect.height })
  })
  stage.mousemove((e) => {
    const cx = (boardRect.bottom - e.offsetY / stage.height() * stageRect.height) / blockSize | 0
    const cy = (e.offsetX / stage.width() * stageRect.width - boardRect.left) / blockSize | 0
    if (cx < 0 || cx >= hSize || cy < 0 || cy >= wSize) hovering = null
    else hovering = { x: cx, y: cy }
  })
  $('#main').append(stage).append(menu)
  // hide loading
  $('#loading').hide()
}
let curTeam = 1 // current team to move
let hovering = null, selecting = null // current chess piece selected
let click = []
function checkmateType() {
  let rx, ry, bx, by
  for (let i = 0; i < hSize; i++) {
    for (let j = 0; j < wSize; j++) {
      if (map[i][j].type === 1) {
        if (map[i][j].team === 1) {
          [rx, ry] = [i, j]
        }
        if (map[i][j].team === 2) {
          [bx, by] = [i, j]
        }
      }
    }
  }
  for (let i = 0; i < hSize; i++) {
    for (let j = 0; j < wSize; j++) {
      if (map[i][j].team === 1 &&
          map[i][j].canMoveTo(bx, by)) {
        return 1
      }
      if (map[i][j].team === 2 &&
          map[i][j].canMoveTo(rx, ry)) {
        return 2
      }
    }
  }
  return 0
}
function update() {
  const updateClick = (pos) => {
    let cx = (boardRect.bottom - pos.y) / blockSize | 0, cy = (pos.x - boardRect.left) / blockSize | 0
    if (cx < 0 || cx >= hSize || cy < 0 || cy >= wSize) return
    if (selecting === null) {
      if (map[cx][cy].team === curTeam) {
        selecting = { x: cx, y: cy }
        for (let i = 0; i < hSize; ++i) {
          for (let j = 0; j < wSize; ++j) {
            canChoose[i][j] = map[cx][cy].canMoveTo(i, j)
          }
        }
      } else {
        canChoose = Array(hSize).fill().map(() => Array(wSize).fill(false))
        badClick[cx][cy] = errShowTime // for moving an enemy chess or space
      }
    } else {
      if (map[selecting.x][selecting.y].canMoveTo(cx, cy)) {
        curTeam = 3 - curTeam
        text = `${curTeam === 1 ? '红' : '蓝'}方下棋`
        textColor = curTeam === 1 ? '#f00' : '#00f'
        shine[selecting.x][selecting.y] = 0
        shine[cx][cy] = shineTime
        move = shakeTime
        canChoose = Array(hSize).fill().map(() => Array(wSize).fill(false))
        map[cx][cy].onDeath()
        map[selecting.x][selecting.y].setPosition(cx, cy)
        map[cx][cy] = map[selecting.x][selecting.y]
        map[selecting.x][selecting.y] = new Piece(0)
        selecting = null
        let tp = checkmateType()
        if (tp !== 0) {
          text += `, ${tp === 2 ? '红' : '蓝'}方已被将军`
        }
      } else if (map[cx][cy].team === curTeam) {
        selecting = { x: cx, y: cy }
        for (let i = 0; i < hSize; ++i) {
          for (let j = 0; j < wSize; ++j) {
            canChoose[i][j] = map[cx][cy].canMoveTo(i, j)
          }
        }
      } else {
        selecting = null
        canChoose = Array(hSize).fill().map(() => Array(wSize).fill(false))
        badClick[cx][cy] = errShowTime // for bad movement
      }
    }
  }
  const updateAnimation = () => {
    if (curtain) --curtain
    if (move) --move
    for (let i = 0; i < hSize; ++i) {
      for (let j = 0; j < wSize; ++j) {
        if (badClick[i][j]) --badClick[i][j]
        if (shine[i][j]) --shine[i][j]
      }
    }
  }
  click.forEach(pos => {
    updateClick(pos)
  })
  click = []
  updateAnimation()
}
CanvasRenderingContext2D.prototype.box = function (x, y, l, r, w, c) {
  this.strokeStyle = c
  this.lineWidth = w
  this.beginPath()
  this.moveTo(x - r, y - r - w / 2)
  this.lineTo(x - r, y - l)
  this.stroke()
  this.closePath()
  this.beginPath()
  this.moveTo(x - r + w / 2, y - r)
  this.lineTo(x - l, y - r)
  this.stroke()
  this.closePath()
  this.beginPath()
  this.moveTo(x + r, y - r - w / 2)
  this.lineTo(x + r, y - l)
  this.stroke()
  this.closePath()
  this.beginPath()
  this.moveTo(x + r - w / 2, y - r)
  this.lineTo(x + l, y - r)
  this.stroke()
  this.closePath()
  this.beginPath()
  this.moveTo(x - r, y + r + w / 2)
  this.lineTo(x - r, y + l)
  this.stroke()
  this.closePath()
  this.beginPath()
  this.moveTo(x - r + w / 2, y + r)
  this.lineTo(x - l, y + r)
  this.stroke()
  this.closePath()
  this.beginPath()
  this.moveTo(x + r, y + r + w / 2)
  this.lineTo(x + r, y + l)
  this.stroke()
  this.closePath()
  this.beginPath()
  this.moveTo(x + r - w / 2, y + r)
  this.lineTo(x + l, y + r)
  this.stroke()
  this.closePath()
}
function render() {
  ctx.clearRect(stageRect.left, stageRect.top, stageRect.width, stageRect.height)
  ctx.save()
  ctx.translate(0, shakeDis[move]) // shake SFX
  const renderBoard = () => {
    ctx.fillStyle = '#fd4'
    ctx.fillRect(boardRect.left, boardRect.top, boardRect.width, boardRect.height)
    ctx.strokeStyle = '#640'
    ctx.lineWidth = 3
    for (let i = 0; i < wSize; ++i) {
      ctx.beginPath()
      ctx.moveTo(boardRect.left + blockSize / 2 + i * blockSize, boardRect.top + blockSize / 2)
      ctx.lineTo(boardRect.left + blockSize / 2 + i * blockSize, boardRect.bottom - blockSize / 2)
      ctx.stroke()
      ctx.closePath()
      ctx.fillStyle = '#666'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = '30px sans-serif'
      ctx.fillText(i, boardRect.left + blockSize / 2 + i * blockSize, boardRect.bottom + 15)
    }
    for (let i = 0; i < hSize; ++i) {
      ctx.beginPath()
      ctx.moveTo(boardRect.left + blockSize / 2, boardRect.top + blockSize / 2 + i * blockSize)
      ctx.lineTo(boardRect.right - blockSize / 2, boardRect.top + blockSize / 2 + i * blockSize)
      ctx.stroke()
      ctx.closePath()
      ctx.fillStyle = '#666'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = '30px sans-serif'
      ctx.fillText(hSize - i - 1, boardRect.left - 15, boardRect.top + blockSize / 2 + i * blockSize)
    }
  }
  const renderChess = () => {
    // render hovering sign
    if (hovering && (map[hovering.x][hovering.y].team === curTeam || canChoose[hovering.x][hovering.y])) {
      const x = boardRect.left + blockSize / 2 + hovering.y * blockSize, y = boardRect.bottom - blockSize / 2 - hovering.x * blockSize
      ctx.box(x, y, 20, 35, 4, '#fff')
    }
    // render selecting sign
    if (selecting) {
      const x = boardRect.left + blockSize / 2 + selecting.y * blockSize, y = boardRect.bottom - blockSize / 2 - selecting.x * blockSize
      ctx.box(x, y, 20, 35, 4, '#7f8')
    }
    // render chess
    for (let i = 0; i < hSize; ++i) {
      for (let j = 0; j < wSize; ++j) {
        // render error sign
        const x = boardRect.left + blockSize / 2 + j * blockSize, y = boardRect.bottom - blockSize / 2 - i * blockSize
        ctx.box(x, y, 20, 35, 4, `#f44${(badClick[i][j] / errShowTime * 15 | 0).toString(16)}`)
        // render optional sign
        if (!map[i][j].isEmpty()) {
          // shade
          ctx.beginPath()
          ctx.arc(x, y + 6, 30, 0, 2 * Math.PI)
          ctx.fillStyle = '#0007'
          ctx.fill()
          ctx.closePath()
          // shape
          ctx.beginPath()
          ctx.arc(x, y, 30, 0, 2 * Math.PI)
          ctx.fillStyle = '#eee'
          ctx.fill()
          ctx.closePath()
          ctx.beginPath()
          ctx.arc(x, y + 3, 30, 0, 2 * Math.PI)
          ctx.fillStyle = '#eee'
          ctx.fill()
          ctx.closePath()
          ctx.beginPath()
          ctx.arc(x, y, 26, 0, 2 * Math.PI)
          ctx.strokeStyle = map[i][j].team === 1 ? '#f00' : '#00f'
          ctx.lineWidth = 2
          ctx.stroke()
          ctx.closePath()
          // text
          ctx.fillStyle = map[i][j].team === 1 ? '#f00' : '#00f'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.font = '25px sans-serif'
          ctx.fillText(map[i][j].cName, x, y)
          // render shiny sign
          ctx.beginPath()
          ctx.arc(x, y, 30, 0, 2 * Math.PI)
          ctx.fillStyle = `#fff${(shine[i][j] / shineTime * 13 | 0).toString(16)}`
          ctx.fill()
          ctx.closePath()
        }
        if (canChoose[i][j]) {
          ctx.beginPath()
          ctx.arc(x, y, 10, 0, 2 * Math.PI)
          ctx.fillStyle = '#3f4d'
          ctx.fill()
          ctx.closePath()
        }
      }
    }
  }
  const renderText = () => {
    ctx.fillStyle = '#ccc'
    ctx.fillRect(textRect.left, textRect.top, textRect.width, textRect.height)
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '30px sans-serif'
    ctx.fillText(text, textRect.midX, textRect.midY)
  }
  const renderCurtain = () => {
    if (curtain) {
      ctx.fillStyle = curtainColor + (curtain / curtainTime * 10 | 0).toString(16)
      ctx.fillRect(stageRect.left, stageRect.top, stageRect.width, stageRect.height)
    }
  }
  renderBoard()
  renderChess()
  renderText()
  renderCurtain()
  ctx.restore()
}
function main() {
  update()
  render()
  requestAnimationFrame(main)
}
window.addEventListener('load', () => {
  init()
  main()
})
