<template>
  <div />
</template>

<script>
import { getCurrentDomain, getQueryString } from '@/utils'

export default {
  name: 'Redirect',
  data() {
    return {}
  },
  created() {
    // 重定向类型
    let type = this.$route.params.type
    if (type == 'qqlogin') {
      this.qqLoginHandle()
    } else if (type == 'bindqq') {
      this.bindQqHandle()
    }
  },
  methods: {
    bindQqHandle() {
      let code = getQueryString('code')
      let state = getQueryString('state')
      if (code && state) {
        let reUrl = getCurrentDomain() + '/redirect/bindqq'
        this.$api.post('/user/bind/qq', { authorizeCode: code, redirectUri: reUrl }).then((res) => {
          if (res.data) {
            this.msgSuccess('绑定成功')
            window.close()
          } else {
            this.msgError('绑定失败，该qq已经绑定其他账号')
          }
        })
      }
    },
    qqLoginHandle() {
      // qq 登录重定向
      let code = getQueryString('code')
      let state = getQueryString('state')
      if (code && state) {
        let reUrl = getCurrentDomain() + '/redirect/qqlogin'
        this.$api.post('/login/qq', { authorizeCode: code, redirectUri: reUrl }).then((res) => {
          if (res.data) {
            this.msgSuccess('登录成功')
            this.$store.dispatch('user/login', res.data).then(() => {
              // 重置状态
              this.$store.dispatch('global/loginExpired', false).then(() => {})
              // 登录成功后路由跳回
              if (this.$route.query.redirect) {
                this.$router.replace({
                  path: this.$route.query.redirect
                })
              } else {
                if (window.history.length <= 1) {
                  this.$router.push({ path: '/home' })
                } else {
                  this.$router.push({ path: '/home' })
                }
              }
            })
          }
        })
      }
    }
  }
}
</script>
