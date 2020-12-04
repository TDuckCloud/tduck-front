import axios from 'axios'
// import qs from 'qs'
import {MessageBox, Message} from 'element-ui'
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
    timeout: 10000,
    responseType: 'json',
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(
    request => {
        /**
         * 全局拦截请求发送前提交的参数
         * 以下代码为示例，在登录状态下，分别对 post 和 get 请求加上 token 参数
         */
        if (store.getters['user/isLogin']) {
            request.headers.token = store.state.user.token
        }
        if (request.method == 'post') {
            if (request.data instanceof FormData) {
                if (store.getters['user/isLogin']) {
                    // 如果是 FormData 类型（上传图片）
                    request.data.append('token', store.state.user.token)
                }
            } else {
                // 带上 token
                if (request.data == undefined) {
                    request.data = {}
                }
                // 参数验签
                let timestamp = new Date().getTime()
                request.data.timestamp = '' + timestamp
                let sign = signMd5Utils.getSign(request.url, request.data)
                request.data.sign = sign
            }
        } else if (request.method === 'get') {
            // 带上 token
            if (request.params == undefined) {
                request.params = {}
            }
            let timestamp = new Date().getTime()
            request.params.timestamp = '' + timestamp
            let sign = signMd5Utils.getSign(request.url, request.params)
            request.params.sign = sign
        }
        return request
    }
)

api.interceptors.response.use(
    response => {
        /**
         * 全局拦截请求发送后返回的数据，如果数据有报错则在这做全局的错误提示
         * 假设返回数据格式为：{"code":500,"msg":"邮箱地址不正确","data":null}
         * 规则是当 code 为 200 时表示请求成功，500 发生错误
         * 为 401 时表示接口需要登录或者登录状态失效，需要重新登录
         * 请求出错时 msg 会返回错误信息
         * 则代码如下
         */
        const res = response.data
        if (res.code === 200) {
            return Promise.resolve(res)
        } else if (res.code === 500 || res.code == 403) {
            // 这里做错误提示，如果使用了 element ui 则可以使用 Message 进行提示
            Message({
                message: res.msg || 'Error',
                type: 'error',
                duration: 5 * 1000
            })
        } else if (res.code === 401) {
            // to re-login
            MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                toLogin()
            })
        }
        return Promise.reject(res)
    },
    error => {
        return Promise.reject(error)
    }
)

export default api
