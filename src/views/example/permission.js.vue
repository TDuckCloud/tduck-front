<template>
    <div>
        <p>如果未登录，会跳转到登录页，如果已登录，则弹出用户信息。</p>
        <button @click="user">点我</button>
    </div>
</template>

<script>
export default {
    methods: {
        user() {
            if (this.$store.getters['token/isLogin']) {
                alert('token信息：' + this.$store.state.token.token)
            } else {
                this.$toLogin()
            }
        }
    }
}
</script>
