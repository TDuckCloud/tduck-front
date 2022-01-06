// 表单发布相关接口
import {getRequest, postRequest} from '../baseRequest'

// 查询项目权限组详细
export const listAuthGroup = key => getRequest('/form/auth/group/list', {formKey: key})

// 查询授权组授权对象
export const getAuthObjs = id => getRequest('/form/auth/' + id)

// 查询授权组授权对象
export const saveAuthObjs = data => postRequest('/form/auth/save', data)

// 查询项目权限组详细
export const getAuthGroup = id => getRequest('/form/auth/group/' + id)

// 新增项目权限组
export const createAuthGroup = data => postRequest('/form/auth/group/create', data)

// 修改项目权限组
export const updateAuthGroup = data => postRequest('/form/auth/group/update', data)

// 删除项目权限组
export const delAuthGroup = id => postRequest('/form/auth/group/delete/' + id)

// 获取表单用户的权限
export const getFormUserAuthRequest = formKey => getRequest('/user/form/auth/' + formKey)

// 获取表单公开发布状态
export const getFormStatusRequest = formKey => getRequest('/user/form/' + formKey)
// 发布表单
export const publishFormRequest = data => postRequest('/user/form/publish', data)
// 停止发布表单
export const stopPublishFormRequest = data => postRequest('/user/form/stop', data)
