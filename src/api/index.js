import axios from 'axios'
import qs from 'qs'
import router from '@/router/index'
import store from '@/store/index'
import signMd5Utils from '@/util/sign'

const toLogin = () => {
    router.push({
        path: '/login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    })
}

const api = axios.create({
    baseURL: process.env.NODE_ENV !== 'development' && process.env.VUE_APP_API_ROOT,
    timeout: 10000,
    responseType: 'json',
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
})

api.interceptors.request.use(
    request => {
        /**
         * 全局拦截请求发送前提交的参数
         * 以下代码为示例，在登录状态下，分别对 post 和 get 请求加上 token 参数
         */
        if (request.method == 'post') {
            if (request.data instanceof FormData) {
                if (store.getters['token/isLogin']) {
                    // 如果是 FormData 类型（上传图片）
                    request.data.append('token', store.state.token.token)
                }
            } else {
                // 带上 token
                if (request.data == undefined) {
                    request.data = {}
                }
                if (store.getters['token/isLogin']) {
                    request.data.token = store.state.token.token
                }
                // 参数验签
                let timestamp = new Date().getTime()
                request.data.timestamp = '' + timestamp
                let sign = signMd5Utils.getSign(request.url, request.data)
                request.data.sign = sign
                request.data = qs.stringify(request.data)
            }
        } else {
            // 带上 token
            if (request.params == undefined) {
                request.params = {}
            }
            if (store.getters['token/isLogin']) {
                request.params.token = store.state.token.token
            }
            let timestamp = new Date().getTime()
            console.log(request.params)
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
         * 假设返回数据格式为：{ status: 1, error: '', data: '' }
         * 规则是当 status 为 1 时表示请求成功，为 0 时表示接口需要登录或者登录状态失效，需要重新登录
         * 请求出错时 error 会返回错误信息
         * 则代码如下
         */
        if (response.data.status === 1) {
            if (response.data.error === '') {
                // 请求成功并且没有报错
                return Promise.resolve(response.data)
            } else {
                // 这里做错误提示，如果使用了 element ui 则可以使用 Message 进行提示
                // Message.error(options)
                return Promise.reject(response.data)
            }
        } else {
            toLogin()
        }
    },
    error => {
        return Promise.reject(error)
    }
)

export default api
