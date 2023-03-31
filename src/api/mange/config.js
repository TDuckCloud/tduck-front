import request from '@/api/index'

// 获取系统配置
export function getEnvConfig(key) {
  return request({
    url: '/system/env/config/' + key,
    method: 'get'
  })
}

export function getEnvConfigValue(key) {
  return request({
    url: '/system/env/config/value/' + key,
    method: 'get'
  })
}

export function getSystemInfoConfig() {
  return request({
    url: '/public/systemInfoConfig',
    method: 'get'
  })
}

// 保存系统配置
export function saveEnvConfig(data) {
  return request({
    url: '/system/env/config/save',
    method: 'post',
    data: data
  })
}
