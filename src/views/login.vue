<template>
    <div>
        <button @click="login">模拟登录</button>
    </div>
</template>

<script>
export default {
    methods: {
        login() {
            this.$store.dispatch('token/login').then(() => {
                // 登录成功后路由跳回
                if (this.$route.query.redirect) {
                    this.$router.replace({
                        path: this.$route.query.redirect
                    })
                } else {
                    if (window.history.length <= 1) {
                        this.$router.push({ path: '/' })
                    } else {
                        this.$router.go(-1)
                    }
                }
            })
        }
    }
}
</script>
