/**
 * 设备填写次数校验相关
 */
import Cookies from 'js-cookie'

const preKey = 'deviceWriteCount_'

/**
 * 保存填写次数 如果没有则创建 有则—+1
 * @param formKey 表单Id
 */
export function saveWriteCount(formKey) {
  try {
    let writeCount = getWriteCount(formKey)
    if (writeCount) {
      writeCount = parseInt(writeCount) + 1
      setWriteCount(formKey, writeCount)
    } else {
      setWriteCount(formKey, 1)
    }
  } catch (e) {
    console.log(e)
  }
}

/**
 * 检查次数是否达到上限
 *
 */
export function checkWriteCountCap(formKey, totalCount) {
  const count = getWriteCount(formKey, totalCount)
  return count >= totalCount
}

/**
 * 保存
 */
function setWriteCount(formKey, writeCount = 1) {
  if (isSupportLocalStore()) {
    return localStorage.setItem(preKey + formKey, writeCount)
  } else {
    return Cookies.set(preKey + formKey, writeCount)
  }
}

/**
 * 从存储获取填写次数 检查浏览器是否支持localstore 不支持则cookie
 */
function getWriteCount(formKey) {
  // js 判断流量 是否支持localStorage
  if (isSupportLocalStore()) {
    return localStorage.getItem(preKey + formKey)
  } else {
    return Cookies.get(preKey + formKey)
  }
}

/**
 * 是否支持LocalStore
 */
function isSupportLocalStore() {
  return window.Storage && window.localStorage && window.localStorage instanceof Storage
}
