import {deleteRequest, getRequest, postRequest, putRequest} from '../baseRequest'

// 获取模板分类
export const getFormTemplateTypeListRequest = params => getRequest('/form/template/type/list', params)

// 保存为模板
export const createTemplateRequest = data => postRequest('/form/template/create', data)

// 删除模板
export const deleteFormTemplateRequest = data => postRequest('/form/template/delete', data)

// 获取模板数据
export const getFormTemplatePageRequest = params => getRequest('/form/template/page', params)

// 使用模板创建表单
export const useTemplateCreateFormRequest = data => postRequest('/user/form/use-template/create', data)

// 查询项目模板分类列表
export const listCategory = params => getRequest('/form/template/category/page', params)

// 查询项目模板分类详细
export const getCategory = id => getRequest('/form/template/category/' + id)

// 新增项目模板分类
export const addCategory = data => postRequest('/form/template/category', data)

// 修改项目模板分类
export const updateCategory = data => putRequest('/form/template/category', data)

// 删除项目模板分类
export const delCategory = id => deleteRequest('/form/template/category/' + id)

// 导出项目模板分类
export const exportCategory = params => getRequest('/form/template/category/export', params)
