import {getRequest, postRequest} from '../baseRequest'

// 查询提交设置
export const getSubmitSettingRequest = key => getRequest(`/user/form/submit-setting/${key}`)

// 保存提交设置
export const saveSubmitSettingRequest = data => postRequest('/user/form/submit-setting/save', data)

// 查询填写设置
export const getWriteSettingRequest = key => getRequest(`/user/form/write-setting/${key}`)

// 保存提交设置
export const saveWriteSettingRequest = data => postRequest('/user/form/write-setting/save', data)

// 查询通知设置
export const getNotifySettingRequest = key => getRequest(`/user/form/notify-setting/${key}`)

// 保存通知设置
export const saveNotifySettingRequest = data => postRequest('/user/form/notify-setting/save', data)

// 查询分享设置
export const getShareSettingRequest = key => getRequest(`/user/form/share-setting/${key}`)

// 保存分享设置
export const saveShareSettingRequest = data => postRequest('/user/form/share-setting/save', data)

// 获取微信通知用户
export const getWxNotifyUserRequest = params => getRequest('/user/form/wx/notify-user', params)

// 获取订阅微信通知二维码
export const getWxNotifyQrcodeRequest = params => getRequest('/user/form/wx/notify-qrcode', params)

// 删除微信通知用户
export const deleteWxNotifyUserRequest = (key, openId) => postRequest(`/user/form/wx/delete/notify-user?key=${key}&openId=${openId}`)

// 获取填写状态
export const getWriteSettingStatusRequest = params => getRequest('/user/form/setting-status', params)

