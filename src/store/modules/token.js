import {
    api
} from '@/api'

const state = {
    token: localStorage.token,
    failuretime: localStorage.failuretime
}

const getters = {
    isLogin: state => {
        let retn = false
        if (state.token != null) {
            let unix = Date.parse(new Date())
            if (unix < state.failuretime * 1000) {
                retn = true
            }
        }
        return retn
    }
}

const actions = {
    login({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            // 模拟登录成功，写入 token 信息
            commit('setData', {
                token: '1234567890',
                failuretime: Date.parse(new Date()) / 1000 + 24 * 60 * 60
            })
            resolve()

            // api.post('member/login', data).then(res => {
            //     commit('setData', res.data)
            //     resolve(res)
            // }).catch(error => {
            //     reject(error)
            // })
        })
    }
}

const mutations = {
    setData(state, data) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('failuretime', data.failuretime)
        state.token = data.token
        state.failuretime = data.failuretime
    }
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}
