import request from '@/api/index'

// 公众号签名
export function getWxSignature(params) {
  return request({
    url: '/wx/jsapi/signature',
    method: 'get',
    params: params
  })
}

//  获取授权用户信息
export function getAuthorizationUserInfo(params) {
  return request({
    url: '/wx/jsapi/authorization/user/info',
    method: 'get',
    params: params
  })
}
// 获取授权地址
export function getAuthorizationUrl(params) {
  return request({
    url: '/wx/jsapi/authorization/url',
    method: 'get',
    params: params
  })
}
