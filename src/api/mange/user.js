import { getRequest, postRequest } from '../baseRequest'

// 查询用户列表
export const listUser = (params) => getRequest('/mange/user/page', params)

// 查询用户详细
export const getUser = (id) => getRequest('/mange/user/' + id)

// 新增用户
export const addUser = (data) => postRequest('/mange/user/add', data)

// 修改用户
export const updateUser = (data) => postRequest('/mange/user/update', data)

// 删除用户
export const delUser = (id) => postRequest('/mange/user/delete/' + id)
