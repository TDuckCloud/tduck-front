// 跳转url
export function jumpUrl(url, dataId) {
  console.log(url)
  if (!url) {
    return
  }
  // 如果url不包含http://或者https://，则自动添加
  if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1) {
    url = 'http://' + url
  }
  // 如果url包含/poster/gen 则添加dataId参数
  if (url.indexOf('/poster/gen') !== -1) {
    url = addUrlParam(url, 'dataId', dataId)
  }
  setTimeout(() => {
    window.location.replace(url)
  }, 3000)
}

/**
 * 给url添加参数
 */
export function addUrlParam(url, name, value) {
  if (url.indexOf('?') !== -1) {
    url += '&'
  } else {
    url += '?'
  }
  url += name + '=' + value
  return url
}
