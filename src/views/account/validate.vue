<template>
  <div class="account-validate-container">
    <div v-if="bindEmailErr" style="display: flex; flex-direction: column; align-items: center">
      <el-alert
        title="绑定失败"
        type="error"
        :closable="false"
        :center="true"
        description="绑定邮箱失败，可能是超出绑定时间或者是该邮箱已被绑定等，请稍后重试！"
        show-icon
      />
      <el-button style="width: 50%" @click="$router.push({ path: '/home' })">返回首页</el-button>
    </div>
    <div v-else style="display: flex; flex-direction: column; align-items: center">
      <el-alert
        title="绑定成功"
        type="success"
        :closable="false"
        :center="true"
        description="你现在可以通过邮箱登录"
        show-icon
      />
      <el-button style="width: 50%" @click="$router.push({ path: '/home' })">返回首页</el-button>
    </div>
  </div>
</template>

<script>
import { getQueryString } from '@/utils'

export default {
  name: 'Redirect',
  data() {
    return {
      bindEmailErr: true
    }
  },
  created() {
    // 绑定邮件验证
    let type = getQueryString('type')
    if (type == 'updateEmail') {
      let code = this.$route.query.code
      let email = this.$route.query.email
      this.$api.post('/user/update/email', { email: email, key: code }).then((res) => {
        this.bindEmailErr = !res.data
      })
    }
  },
  methods: {}
}
</script>
<style scoped>
.account-validate-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
  justify-items: center;
  align-items: center;
}
.el-alert--error.is-light,
.el-alert--success.is-light {
  background-color: transparent;
}
.el-alert {
  display: flex;
  flex-direction: column;
}
::v-deep .el-alert__content {
  margin-top: 20px;
  text-align: center;
}
::v-deep .el-alert__title {
  font-size: 18px;
  line-height: 25px;
}
::v-deep .el-alert__icon.is-big {
  font-size: 60px;
  width: 60px;
}
</style>
