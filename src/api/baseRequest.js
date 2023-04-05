import request from './index'

// post
export function postRequest(url, parameter) {
  return request({
    url,
    method: 'post',
    data: parameter
  })
}

// post method= {post | put}
export function httpRequest(url, parameter, method) {
  return request({
    url,
    method,
    data: parameter
  })
}

// put
export function putRequest(url, parameter) {
  return request({
    url,
    method: 'put',
    data: parameter
  })
}

// get
export function getRequest(url, parameter) {
  return request({
    url,
    method: 'get',
    params: parameter
  })
}

// deleteRequest
export function deleteRequest(url, parameter) {
  return request({
    url,
    method: 'delete',
    params: parameter
  })
}
