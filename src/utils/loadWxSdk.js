import loadScript from './loadScript'
import ELEMENT from 'element-ui'

let wxObj

export default function loadWXJs(cb) {
  if (wxObj) {
    cb(wxObj)
    return
  }

  const loading = ELEMENT.Loading.service({
    fullscreen: true,
    lock: true,
    text: 'wxsdk资源加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.5)'
  })

  loadScript('https://res.wx.qq.com/open/js/jweixin-1.6.0.js', () => {
    loading.close()
    // eslint-disable-next-line no-undef
    wxObj = wx
    cb(wxObj)
  })
}
