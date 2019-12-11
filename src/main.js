import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import lodash from 'lodash'
import {api, axios} from './api'
import dayjs from 'dayjs'
import util from './util/index'
import meta from 'vue-meta'
import cookies from 'vue-cookies'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// 全局组件自动注册
import '@/components/autoRegister'

Vue.use(meta)
Vue.use(cookies)
Vue.use(util)
Vue.use(Element, {size: 'small', zIndex: 3000})
Vue.prototype.$api = api
Vue.prototype.$axios = axios
Vue.prototype._ = lodash
Vue.prototype.$dayjs = dayjs

Vue.config.productionTip = false

// 自动加载 svg 图标
const req = require.context('./assets/icons', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
