import request from '../index'

/**
 * 查询配置的webhook
 */
// 查询db数据库列表
export function getWebHook(sourceType, sourceId) {
  return request({
    url: '/webhook/config/',
    method: 'get',
    params: { sourceType, sourceId }
  })
}

/**
 * 保存webhook
 */
export function saveWebHook(data) {
  return request({
    url: '/webhook/config/save',
    method: 'post',
    data: data
  })
}

/**
 * 发送测试webHook
 */
export function sendTestWebHook(data) {
  return request({
    url: '/webhook/config/sendTest',
    method: 'post',
    data: data
  })
}

/**
 * 获取数据同步接口apiKey
 */
export function getApiKey(formKey) {
  return request({
    url: '/sync/apikey',
    method: 'get',
    params: {
      formKey: formKey
    }
  })
}
