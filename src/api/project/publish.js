// 表单发布相关接口
import { getRequest, postRequest } from '../baseRequest'

// 获取表单公开发布状态
export const getFormStatusRequest = (formKey) => getRequest('/user/form/' + formKey)
// 发布表单
export const publishFormRequest = (data) => postRequest('/user/form/publish', data)
// 停止发布表单
export const stopPublishFormRequest = (data) => postRequest('/user/form/stop', data)
