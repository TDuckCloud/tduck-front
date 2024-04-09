<template>
  <el-form style="width: 600px" v-if="!loading" ref="systemInfoConfig" :model="form" label-width="120px">
    <el-form-item label="系统版本">
      <el-tag effect="dark" type="success"> V5.0</el-tag>
    </el-form-item>
    <el-form-item label="公众号登录" prop="openWxMpLogin">
      <el-switch v-model="form.openWxMpLogin" placeholder="https://pro.tduckcloud.com/" />
      <div style="margin-left: 10px; font-size: 12px; color: #8a8f97">
        * 开启公众号登录后，请在配置文件中进行公众号参数配置并重新编译重启后端
      </div>
    </el-form-item>
    <el-form-item
      label="基础域名"
      prop="webBaseUrl"
      :rules="[{ required: true, message: '请输入项目前端所在域名', trigger: 'blur' }]"
    >
      <el-input v-model="form.webBaseUrl" placeholder="https://pro.tduckcloud.com/" />
      <div style="margin-left: 10px; font-size: 12px; color: #8a8f97">* 请填写站点实际域名</div>
    </el-form-item>
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
