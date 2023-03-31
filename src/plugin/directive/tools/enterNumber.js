/**
 * 只允许输入数字
 */
export default {
  bind(el, { value = 2 }) {
    el = el.nodeName == 'INPUT' ? el : el.children[0]
    var RegStr = value == 0 ? `^[\\+\\-]?\\d+\\d{0,0}` : `^[\\+\\-]?\\d+\\.?\\d{0,${value}}`
    el.addEventListener('keyup', function () {
      el.value = el.value.match(new RegExp(RegStr, 'g'))
      el.dispatchEvent(new Event('input'))
    })
  }
}
