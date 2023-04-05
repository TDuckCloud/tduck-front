<template>
  <el-form v-if="!loading" ref="systemInfoConfig" :model="form" label-width="120px">
    <el-form-item label="系统版本">
      <el-tag type="success" effect="dark"> V4.0</el-tag>
    </el-form-item>
    <el-form-item
      label="公众号登录"
      prop="openWxMpLogin"
      :rules="[{ required: true, message: '请输入项目前端所在域名', trigger: 'blur' }]"
    >
      <el-switch v-model="form.openWxMpLogin" placeholder="https://pro.tduckcloud.com/" />
    </el-form-item>
    <!--        <el-form-item-->
    <!--            label="域名"-->
    <!--            prop="webBaseUrl"-->
    <!--            :rules="[{ required: true, message: '请输入项目前端所在域名', trigger: 'blur' }]"-->
    <!--        >-->
    <!--            <el-input v-model="form.webBaseUrl" placeholder="https://pro.tduckcloud.com/" />-->
    <!--        </el-form-item>-->
    <el-form-item>
      <el-button type="primary" @click="handleSubmit"> 保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import ConfigMixin from './ConfigMixin'

export default {
  name: 'SystemInfoConfig',
  mixins: [ConfigMixin],
  data() {
    return {
      loading: true,
      thirdPartyLoginTypeList: [
        {
          label: '微信',
          value: 'wechatOpen'
        },
        {
          label: '企业微信',
          value: 'wechatEnterprise'
        }
      ]
    }
  },
  async created() {
    await this.handleClick()
    // 判断是否有thirdPartyLoginTypeList 没有的话给加一个 新版本加的 不然会报错
    if (!this.form.thirdPartyLoginTypeList) {
      this.$set(this.form, 'thirdPartyLoginTypeList', [])
      this.$set(this.form, 'allowThirdPartyLogin', false)
    }
    this.loading = false
  },
  mounted() {}
}
</script>

<style scoped></style>
