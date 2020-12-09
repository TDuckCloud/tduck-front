<template>
    <div />
</template>

<script>
import {getCurrentDomain, getQueryString} from '@/utils'

export default {
    name: 'Redirect',
    data() {
        return {}
    },
    created() {
        // qq 登录重定向
        let code = getQueryString('code')
        let state = getQueryString('state')
        if (code && state) {
            let reUrl = getCurrentDomain() + '/redirect'
            this.$api.post('/login/qq', {authorizeCode: code, redirectUri: reUrl}).then(res => {
                if (res.data) {
                    this.msgSuccess('登录成功')
                    this.$store.dispatch('user/login', res.data).then(() => {
                        // 重置状态
                        this.$store.dispatch('global/loginExpired', false).then(() => {
                        })
                        // 登录成功后路由跳回
                        if (this.$route.query.redirect) {
                            this.$router.replace({
                                path: this.$route.query.redirect
                            })
                        } else {
                            if (window.history.length <= 1) {
                                this.$router.push({path: '/home'})
                            } else {
                                this.$router.push({path: '/home'})
                            }
                        }
                    })
                }
            })
        }
    },
    methods: {}

}
</script>
