import request from '@/api/index'
import { getRequest, postRequest } from '../baseRequest'

// 查看表单
export const viewFormResultRequest = (formKey) => getRequest(`/user/form/data/view/${formKey}`)
// 保存表单结果数据
export const createFormResultRequest = (data) => postRequest('/user/form/data/create', data)
// 保存公开表单结果数据
export const publicCreateFormResultRequest = (data) => postRequest('/user/form/data/public/create', data)
// 查询数据列表
export const listFormDataTableRequest = (data) => postRequest('/user/form/data/query', data)
// 查询数据详情
export const getFormDataDetailsRequest = (dataId) => getRequest(`/user/form/data/details/${dataId}`)
// 删除数据
export const deleteFormDataRequest = (data, key) => postRequest(`/user/form/data/delete/${key}`, data)
// 修改数据
export const updateFormDataRequest = (data) => postRequest('/user/form/data/update', data)
// 导出附件
export const downloadFormDataFileRequest = (data) => postRequest('/user/form/data/download/file', data)
// 导出数据
export const exportDataRequest = (data) => {
  return request({
    url: '/user/form/data/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

// 下载导入模板
export const downloadImportTemplateRequest = (params) => {
  return request({
    url: '/user/form/data/import/template',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}
// 保存评论数据
export const saveReplyRequest = (data) => postRequest('/user/form/data/reply', data)
// 查询回复列表
export const listReplyRequest = (params) => getRequest('/user/form/data/reply/list', params)
// 根据数据id查询备注内容
export const getRemarkRequest = (dataId) => getRequest(`/user/form/data/remark/${dataId}`)
// 保存备注内容
export const saveRemarkRequest = (data) => postRequest('/user/form/data/saveRemark', data)
