import axios from 'axios'
import router from '@/router/index'
import store from '@/store/index'
import signMd5Utils from '@/util/signMd5Utils'

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
    timeout: 1000 * 30,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
})

api.interceptors.request.use(
    request => {
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
                let timestamp = new Date().getTime()
                request.data.timestamp = '' + timestamp
                let sign = signMd5Utils.getSign(request.url, request.data)
                request.data.sign = sign
                request.data = JSON.stringify(request.data)
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
        if (response.data.code != 200) {
            // 如果接口请求时发现 token 失效，则立马跳转到登录页
            if (response.data.code == 0) {
                toLogin()
                return false
            }
            return Promise.reject(response.data)
        }
        return Promise.resolve(response.data)
    },
    error => {
        return Promise.reject(error)
    }
)

export {
    axios,
    api
}
