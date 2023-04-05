// 报表相关api
import { getRequest } from '../baseRequest'

// 获取表单基础报表信息
export const getFormReportRequest = (params) => getRequest('/user/form/report/stats', params)

// 表单收集数
export const getFormSituationRequest = (params) => getRequest('/user/form/report/situation', params)
// 表单收集位置
export const getFormPositionRequest = (params) => getRequest('/user/form/report/position', params)
// 收集设备
export const getFormDeviceRequest = (params) => getRequest('/user/form/report/device', params)
// 提交来源
export const getFormSourceRequest = (params) => getRequest('/user/form/report/source', params)
// 选项分析
export const getFormAnalysisRequest = (params) => getRequest('/user/form/report/analysis', params)
