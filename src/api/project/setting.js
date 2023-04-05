import { getRequest, postRequest } from '../baseRequest'

// 查询填写设置
export const getSettingRequest = (key) => getRequest(`/user/form/setting/${key}`)
// 保存提交设置
export const saveSettingRequest = (data) => postRequest('/user/form/setting/save', data)

// 获取微信通知用户
export const getWxNotifyUserRequest = (params) => getRequest('/user/form/wx/notify-user', params)

// 获取订阅微信通知二维码
export const getWxNotifyQrcodeRequest = (params) => getRequest('/user/form/wx/notify-qrcode', params)

// 删除微信通知用户
export const deleteWxNotifyUserRequest = (key, openId) =>
  postRequest(`/user/form/wx/delete/notify-user?key=${key}&openId=${openId}`)

// 获取填写状态
export const getWriteSettingStatusRequest = (params) => getRequest('/user/form/setting-status', params)

// 查询表单公开设置
export const getPublicSettingsRequest = (key) => getRequest(`/user/form/public/settings/${key}`)
// 检查填写密码是否正确
export const checkWritePwdRequest = (data) => postRequest('/user/form/public/checkWritePwd', data)
// 查询协作者列表
export const getShareCollaboratorRequest = (formKey) => getRequest('/user/form/collaborator/list', { formKey })
// 添加协作者
export const addShareCollaboratorRequest = (data) => postRequest('/user/form/collaborator/add', data)
// 删除协作者
export const deleteCollaboratorRequest = (data) => postRequest('/user/form/collaborator/delete', data)
