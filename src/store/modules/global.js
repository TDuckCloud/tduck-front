/**
 * 存放全局公用状态
 */

const state = {
  reLogin: false
}

const getters = {
  isReLogin: (state) => {
    return state.reLogin
  }
}

const actions = {
  loginExpired(context, status) {
    return new Promise((resolve) => {
      context.commit('setReLogin', {
        status: status
      })
      resolve()
    })
  }
}

const mutations = {
  setReLogin(state, data) {
    state.reLogin = data.status
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
