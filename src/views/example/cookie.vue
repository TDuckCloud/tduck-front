<template>
    <div>
        <button type="button" @click="setCookie">设置cookie</button>
        <button type="button" @click="removeCookie">删除cookie</button>
        <button type="button" @click="isSetCookie">判断cookie是否设置</button>
        <div>a的cookie值是：{{ cookie }}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cookie: ''
        }
    },
    methods: {
        setCookie() {
            this.$cookies.set('a', 'abc')
            this.cookie = this.$cookies.get('a')
        },
        removeCookie() {
            this.$cookies.remove('a', 'abc')
            this.cookie = this.$cookies.get('a')
        },
        isSetCookie() {
            alert(this.$cookies.isKey('a'))
        }
    }
}
</script>
