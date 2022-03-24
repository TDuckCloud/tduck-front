import request from '@/api/index'
import {getRequest, postRequest} from '../baseRequest'

// 查看表单
export const viewFormResultRequest = formKey => getRequest(`/user/form/data/view/${formKey}`)
// 保存表单结果数据
export const createFormResultRequest = data => postRequest('/user/form/data/create', data)
// 公开表单结果保存
export const createPublicFormResultRequest = data => postRequest('/user/form/data/public/create', data)
// 查询数据列表
export const listFormDataTableRequest = data => postRequest('/user/form/data/query', data)
// 删除数据
export const deleteFormDataRequest = (data, key) => postRequest(`/user/form/data/delete/${key}`, data)
// 修改数据
export const updateFormDataRequest = data => postRequest('/user/form/data/update', data)
// 导出附件
export const downloadFormDataFileRequest = data => postRequest('/user/form/data/download/file', data)
// 下载导入模板
export const downloadImportTemplateRequest = params => {
    return request({
        url: '/user/form/data/import/template',
        method: 'get',
        params: params,
        responseType: 'blob'
    })
}
