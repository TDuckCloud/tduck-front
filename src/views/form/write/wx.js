// 微信相关功能
import loadWXJs from '@/utils/loadWxSdk'

/**
 * 加载 wx sdk 完成初始化
 * @param wxSignature 签名
 * @param shareSetting 分享设置
 */
export function setWxConfig(signature, shareSetting) {
  loadWXJs((wx) => {
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: signature.appId, // 必填，公众号的唯一标识
      timestamp: signature.timestamp, // 必填，生成签名的时间戳
      nonceStr: signature.nonceStr, // 必填，生成签名的随机串
      signature: signature.signature, // 必填，签名
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'onMenuShareAppMessage',
        'onMenuShareTimeline',
        'showMenuItems',
        'hideMenuItems',
        'chooseWXPay'
      ] // 必填，需要使用的JS接口列表
    })
    // sdk准备完成之后调用
    wx.ready(function () {
      // 需在用户可能点击分享按钮前就先调用
      console.log('ready')
      // 微信分享初始化
      setWxProjectShare(wx, shareSetting)
    })
  })
}

/**
 * 微信分享设置
 */
function setWxProjectShare(wx, shareSetting) {
  if (!wx) {
    return
  }
  let { shareWxImgUrl, shareWxTitleContent, shareWxDescContent } = shareSetting
  console.log(shareSetting)
  wx.updateAppMessageShareData({
    title: shareWxTitleContent, // 分享标题
    desc: shareWxDescContent, // 分享描述
    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: shareWxImgUrl, // 分享图标
    success: function () {
      // 设置成功
      console.log('succcess')
    },
    fail: function () {
      console.log('fail')
    }
  })
  wx.updateTimelineShareData({
    title: shareWxTitleContent, // 分享标题
    desc: shareWxDescContent, // 分享描述
    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: shareWxImgUrl, // 分享图标
    success: function () {
      // 设置成功
      console.log('succcess')
    },
    fail: function () {
      console.log('fail')
    }
  })
  wx.onMenuShareTimeline({
    title: shareWxTitleContent, // 分享标题
    desc: shareWxDescContent, // 分享描述
    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: shareWxImgUrl, // 分享图标
    success: function () {
      // 设置成功
      console.log('succcess')
    }
  })
  wx.onMenuShareAppMessage({
    title: shareWxTitleContent, // 分享标题
    desc: shareWxDescContent, // 分享描述
    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: shareWxImgUrl, // 分享图标
    success: function () {
      // 设置成功
      console.log('succcess')
    }
  })
}

/**
 * 仅在微信打开
 */
export function onlyWxOpenHandle() {
  if (!isWxEnv()) {
    document.head.innerHTML =
      '<title>抱歉，出错了</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"><link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/libs/weui/0.4.1/weui.css">'
    document.body.innerHTML =
      '<div class="weui_msg"><div class="weui_icon_area"><i class="weui_icon_info weui_icon_msg"></i></div><div class="weui_text_area"><h4 class="weui_msg_title">请在微信客户端打开链接</h4></div></div>'
  }
}

export function isWxEnv() {
  let wxUa = navigator.userAgent.toLowerCase()
  let isWeixin = wxUa.indexOf('micromessenger') != -1
  return isWeixin
}
