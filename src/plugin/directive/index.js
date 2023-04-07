import enterNumber from './tools/enterNumber'
import focus from './tools/focus'
import preventReClick from './tools/preventReClick'

const install = function (Vue) {
  Vue.directive('enterNumber', enterNumber)
  Vue.directive('focus', focus)
  Vue.directive('reClick', preventReClick)
}

export default install
