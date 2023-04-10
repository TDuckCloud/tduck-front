import { getRequest, postRequest } from '../baseRequest'

// 创建表单
export const createFormRequest = (data) => postRequest('/user/form/create', data)
// 修改表单
export const updateFormRequest = (data) => postRequest('/user/form/update', data)
// 获取项目详情
export const getProjectRequest = (formKey) => getRequest(`/user/form/${formKey}`)
//恢复表单
export const restoreRecycleFormRequest = (data) => postRequest('/user/form/recycle/restore', data)
// 从回收站删除表单
export const deleteRecycleFormRequest = (data) => postRequest('/user/form/recycle/delete', data)
// 查询回收站表单
export const listRecycleFormRequest = (data) => getRequest('/user/form/recycle/page', data)
// 逻辑删除表单
export const logicDeleteFormRequest = (data) => postRequest('/user/form/logic/delete', data)
// 删除表单
export const deleteFormRequest = (data) => postRequest('/user/form/delete', data)

// 停止收集表单
export const stopFormRequest = (data) => postRequest('/user/form/stop', data)

// 查询表单分页
export const pageFormRequest = (params) => getRequest('/user/form/page', params)

// 查询表单项内容
export const listProjectItemRequest = (params) => getRequest('/user/form/item/list', params)

// 查询表单项内容
export const listFormFieldsRequest = (formKey) => getRequest(`/user/form/fields/${formKey}`)

// 查询固定表单项内容
export const listFixedFormFieldsRequest = (formKey) => getRequest(`/user/form/fixed/fields/${formKey}`)

// 查询表单逻辑列表
export const getFormLogicRequest = (params) => getRequest('/user/form/logic', params)

// 保存表单逻辑
export const saveFormLogicRequest = (data) => postRequest('/user/form/logic/save', data)

// 查询主题列表
export const listThemeRequest = (params) => getRequest('/form/theme/list', params)

// 保存表单选中主题
export const saveUserThemeRequest = (data) => postRequest('/user/form/theme/save', data)

// 查询表单主题
export const getUserThemeRequest = (projectKey) => getRequest(`/user/form/theme/${projectKey}`)
