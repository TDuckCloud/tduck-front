import axios from 'axios'
// import qs from 'qs'
import { Message, MessageBox } from 'element-ui'
import Verification from '@/components/verifition/verification.js'
import router from '@/router/index'
import store from '@/store/index'
import signMd5Utils from '@/utils/sign'

const toLogin = () => {
  router.push({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

const api = axios.create({
  baseURL: process.env.VUE_APP_API_ROOT,
  timeout: 30000,
  responseType: 'json',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((request) => {
  /**
   * 全局拦截请求发送前提交的参数
   * 以下代码为示例，在登录状态下，分别对 post 和 get 请求加上 token 参数
   */
  if (store.getters['user/isLogin']) {
    request.headers.token = store.state.user.token
  }
  signRequest(request)
  return request
})

/**
 * 签名请求
 * @param request
 */
const signRequest = (request) => {
  // 签名验证
  if (request.params == undefined) {
    request.params = {}
  }
  let timestamp = new Date().getTime()
  request.params.timestamp = '' + timestamp
  let sign = signMd5Utils.getSign(request.url, request)
  request.params.sign = sign
}

api.interceptors.response.use(
  async (response) => {
    /**
     * 全局拦截请求发送后返回的数据，如果数据有报错则在这做全局的错误提示
     * 假设返回数据格式为：{"code":500,"msg":"邮箱地址不正确","data":null}
     * 规则是当 code 为 200 时表示请求成功，500 发生错误
     * 为 401 时表示接口需要登录或者登录状态失效，需要重新登录
     * 请求出错时 msg 会返回错误信息
     * 则代码如下
     */
    // 下载具有文件名的文件需要返回完整response
    if (response.headers['content-disposition']) {
      return response
    }
    let errCodes = [500, 405, 403]
    const res = response.data
    if (res.code === 200) {
      return Promise.resolve(res)
    } else if (errCodes.includes(res.code)) {
      // 这里做错误提示，如果使用了 element ui 则可以使用 Message 进行提示
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res)
    } else if (res.code === 401) {
      // 有一个接口进入该方法 其他接口则不在进入
      let reLogin = store.getters['global/isReLogin']
      if (!reLogin) {
        store.dispatch('global/loginExpired', true).then(() => {
          // to re-login
          MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              toLogin()
              // 重置状态
              this.$store.dispatch('global/loginExpired', false).then(() => {})
            })
            .catch(() => {})
        })
      }
      return Promise.reject(res)
    } else if (res.code === 416) {
      // 需要滑动验证
      let result = {}
      await Verification().then(async (value) => {
        response.config.params.slideCode = value
        delete response.config.params.sign
        if (response.config.data) {
          response.config.data = JSON.parse(response.config.data)
        }
        result = await api.request(response.config)
      })
      return Promise.resolve(result)
    }
    return Promise.resolve(res)
  },
  (error) => {
    Message({
      message: '服务开小差了，请稍后再试',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default api
