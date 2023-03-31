/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */

/* eslint-disable guard-for-in */
/**
 * num 小于0，左缩进num*2个空格； 大于0，右缩进num*2个空格。
 * @param {string} str 代码
 * @param {number} num 缩进次数
 * @param {number} len 【可选】缩进单位，空格数
 */
export function indent(str, num, len = 2) {
  if (num === 0) return str
  const isLeft = num < 0
  const result = []
  let reg
  let spaces = ''
  if (isLeft) {
    num *= -1
    reg = new RegExp(`(^\\s{0,${num * len}})`, 'g')
  } else {
    for (let i = 0; i < num * len; i++) spaces += ' '
  }

  str.split('\n').forEach((line) => {
    line = isLeft ? line.replace(reg, '') : spaces + line
    result.push(line)
  })
  return result.join('\n')
}

// 首字母大小
export function titleCase(str) {
  return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

// 下划转驼峰
export function camelCase(str) {
  return str.replace(/-[a-z]/g, (str1) => str1.substr(-1).toUpperCase())
}

export function isNumberStr(str) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str)
}

export const exportDefault = 'export default '

export const beautifierConf = {
  html: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'separate',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  },
  js: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'normal',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: true,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  }
}

function stringify(obj) {
  return JSON.stringify(obj, (key, val) => {
    if (typeof val === 'function') {
      return `${val}`
    }
    return val
  })
}

function parse(str) {
  JSON.parse(str, (k, v) => {
    if (v.indexOf && v.indexOf('function') > -1) {
      return eval(`(${v})`)
    }
    return v
  })
}

export function jsonClone(obj) {
  return parse(stringify(obj))
}

export function jsonSimpleClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
// 深拷贝对象
export function deepClone(obj) {
  const _toString = Object.prototype.toString

  // null, undefined, non-object, function
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  // DOM Node
  if (obj.nodeType && 'cloneNode' in obj) {
    return obj.cloneNode(true)
  }

  // Date
  if (_toString.call(obj) === '[object Date]') {
    return new Date(obj.getTime())
  }

  // RegExp
  if (_toString.call(obj) === '[object RegExp]') {
    const flags = []
    if (obj.global) {
      flags.push('g')
    }
    if (obj.multiline) {
      flags.push('m')
    }
    if (obj.ignoreCase) {
      flags.push('i')
    }

    return new RegExp(obj.source, flags.join(''))
  }

  const result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {}

  for (const key in obj) {
    result[key] = deepClone(obj[key])
  }

  return result
}

export function uuid() {
  let s = []
  let hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  let uuid = s.join('')
  return uuid
}

export function getQueryString(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substr(1).match(reg) // 获取url中"?"符后的字符串并正则匹配
  let context = ''
  if (r != null) context = r[2]
  reg = null
  r = null
  return context == null || context == '' || context == 'undefined' ? '' : context
}

/**
 * 获取当前域名
 *  http://www.baidu.com
 * @returns {string}
 */
export function getCurrentDomain() {
  return window.location.protocol + '//' + window.location.host
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */

export function debounce(func, wait, immediate) {
  // eslint-disable-next-line no-unused-vars
  let timeout, args, context, timestamp, result
  // eslint-disable-next-line no-unused-vars
  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      // eslint-disable-next-line no-unused-vars
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        // eslint-disable-next-line no-unused-vars
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }
}

/**
 * 将毫秒数转为hh:mm:ss或mm:ss格式
 * 如果毫秒数超过60分钟，则以hh:mm:ss格式显示，反之以mm:ss格式显示
 * @param ms 毫秒数
 * @returns {string}
 */
export function timeFormat(ms) {
  let h = Math.floor(ms / 1000 / 60 / 60)
  let m = Math.floor(ms / 1000 / 60)
  let s = Math.floor(ms / 1000)
  if (h === 1) {
    // 当时间刚好是60分钟时，让它以mm:ss格式显示,即显示60:00,而不是显示01:00:00
    if (m / 60 === 1 && s % 60 === 0) {
      h = ''
      m = '60:'
    } else {
      h = '01:'
      m = addZero(m % 60) + ':'
    }
    s = addZero(s % 60)
  } else {
    h = h === 0 ? '' : addZero(h) + ':'
    m = addZero(m % 60) + ':'
    s = addZero(s % 60)
  }
  return h + m + s
}

// 进行补0操作
function addZero(n) {
  return n < 10 ? '0' + n : n
}

/**
 * 判断是否是Url
 * @param str
 * @returns {boolean}
 */
export function checkIsUrl(str) {
  let oRegUrl = new RegExp()
  // aa.bb.com
  oRegUrl.compile('^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&?/.=]+$')
  if (!oRegUrl.test(str)) {
    return false
  }
  return true
}

/**
 * 打开
 * @param url
 */
export function openUrl(url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

/**
 * json对象转url参数
 * @param json
 * @returns {string|*}
 */
export function jsonToParam(json) {
  if (!json) return ''
  return Object.keys(json)
    .map((key) => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
    .join('&')
}

/**
 * 是否是json
 * @param str
 * @returns {boolean}
 */
// eslint-disable-next-line no-unused-vars
function isJsonString(str) {
  try {
    if (typeof JSON.parse(str) == 'object') {
      return true
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return false
}
/**
 * 去除html标签 空格 保留文本
 */
export function removeHtmlTag(str) {
  if (!str) return ''
  return str.replace(/<[^>]+>/g, '').replaceAll('&nbsp;', '')
}
