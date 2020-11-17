// import api from '@/api'

const state = {
    token: localStorage.token,
    userInfo: localStorage.userInfo
}

const getters = {
    isLogin: state => {
        return state.token
    },
    userInfo: state => {
        return state.userInfo
    }
}

const actions = {
    login(context, payload) {
        return new Promise(resolve => {
            // 模拟登录成功，写入 token 信息
            context.commit('setData', {
                token: payload.token,
                userInfo: payload
            })
            resolve()
        })
    }
}

const mutations = {
    setData(state, data) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
        state.token = data.token
        state.userInfo = JSON.stringify(data.userInfo)
    }
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}
