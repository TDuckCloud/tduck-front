import Vue from 'vue'
import App from './App.vue'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import meta from 'vue-meta'
import dayjs from 'dayjs'
import Cookies from 'js-cookie'
import router from './router/index'
import api from './api'
import store from './store/index'
// 全局组件自动注册
import '@/components/autoRegister'
import util from './util/index'

Vue.prototype.$api = api
Vue.prototype.$dayjs = dayjs
Vue.prototype.$cookies = Cookies

Vue.use(meta)
Vue.use(util)
Vue.use(util)
Vue.use(Element, {size: 'small', zIndex: 3000})

// 自动加载 svg 图标
const req = require.context('./assets/icons', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
