import api from '@/api'

const state = {
  banner: []
}

const getters = {
  bannerCount: (state) => {
    return state.banner.length
  }
}

const actions = {
  getBanner({ commit }) {
    api
      .get('banner/list', {
        params: {
          categoryid: 1
        }
      })
      .then((res) => {
        commit('setBanner', res.data.banner)
      })
  }
}

const mutations = {
  setBanner(state, banner) {
    state.banner = banner
  },
  removeLast(state) {
    state.banner.splice(state.banner.length - 1, 1)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
