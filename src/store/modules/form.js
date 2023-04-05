const state = {
  // 是否折叠
  isCollapse: false
}

const getters = {
  isCollapse: (state) => {
    return state.isCollapse
  }
}

const actions = {
  setIsCollapse(context, payload) {
    return new Promise((resolve) => {
      // 模拟登录成功，写入 token 信息
      context.commit('setIsCollapse', payload)
      resolve()
    })
  }
}

const mutations = {
  setIsCollapse(state, status) {
    state.isCollapse = status
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
