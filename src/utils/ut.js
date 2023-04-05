const uaParser = require('ua-parser-js')
// https://afantasy.ninja/2017/05/08/user-tracking-iii/
// 用户停留时间
// addEvent() 是包装了 `window.addEventListener` 和 `window.attachEvent` 的事件监听函数
const r = window.requestAnimationFrame
const c = window.cancelAnimationFrame
let h
let lt = 0
let ltStart
let inActiveTime
const inActiveThreshold = 60 * 60 * 100
// 创建一个心跳闭包，负责向 lifetime 增加累计时间
h = (function () {
  let timer

  function beat() {
    const now = new Date()
    const diff = now - ltStart
    lt = lt + diff
    inActiveTime = inActiveTime + diff
    ltStart = now
    if (inActiveTime <= inActiveThreshold) {
      timer = r(beat)
    } else {
      timer = null
    }
    document.getElementById('inActiveTime').innerText = inActiveTime
  }

  return {
    start: function () {
      if (!timer) {
        ltStart = new Date()
        timer = r(beat)
      }
    },
    stop: function () {
      if (timer) {
        c(timer)
        timer = null
      }
    }
  }
})()

function onFocus() {
  h.start()
}

function onBlur() {
  h.stop()
}

// 在 PC 端使用 focusin / focusout / focus / blur 事件
if ('onfocusin' in document) {
  document.onfocusin = onFocus
  document.onfocusout = onBlur
} else {
  window.onfocus = onFocus
  window.onblur = onBlur
}
// 在移动端使用 Page Visibility API 检查页面是否 active
const prefixes = ['', 'webkit', 'moz', 'ms', 'o']
let pf
let hiddenKey
let eventKey
if (isMobile) {
  for (let i = 0; i < prefixes.length; i++) {
    pf = prefixes[i]
    hiddenKey = pf ? pf + 'Hidden' : 'hidden'
    if (hiddenKey in document) {
      eventKey = pf + 'visibilitychange'
      break
    }
  }
  if (eventKey) {
    addEvent(document, eventKey, function () {
      document[hiddenKey] ? onBlur() : onFocus()
    })
  }
}
inActiveTime = 0
h.start() // 开始计算 lifetime

function isMobile() {
  const ua = uaParser(navigator.userAgent)
  if (ua.device) {
    let { type } = ua.device
    if (type && type == 'mobile') {
      return true
    }
  }
  return false
}

function addEvent(element, event, callback) {
  if (element.addEventListener) {
    // 支持使用 addEventListener()
    if (event.slice(0, 2) === 'on')
      // 以 "on" 开头，不需要，则去掉
      event = event.slice(2)
    element.addEventListener(event, callback)
  } else if (element.attachEvent) {
    // 支持使用 attachEvent()
    if (event.slice(0, 2) !== 'on')
      // 没有以 "on" 开头，需要，则加上
      event = 'on' + event
    element.attachEvent(event, callback)
  } else {
    event.slice(0, 2) !== 'on' ? (element['on' + event] = callback) : (element[event] = callback)
  }
}
