export default {
    install(Vue) {
        Vue.prototype.$toLogin = function() {
            this.$router.push({
                path: '/login',
                query: {
                    redirect: this.$route.fullPath
                }
            })
        }
    }
}
