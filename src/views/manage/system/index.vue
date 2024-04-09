<template>
  <el-card style="padding-top: 20px; padding-left: 50px">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="系统配置" name="systemInfoConfig">
        <system-info-config v-if="activeName === 'systemInfoConfig'" />
      </el-tab-pane>
      <el-tab-pane label="文件存储" name="fileEnvConfig">
        <oss-config v-if="activeName === 'fileEnvConfig'" />
      </el-tab-pane>
      <el-tab-pane label="邮件配置" name="emailEnvConfig">
        <el-form ref="emailEnvConfig" :model="form" label-width="80px">
          <el-form-item
            :rules="[{ required: true, message: '请输入邮件host', trigger: 'blur' }]"
            label="Host"
            prop="host"
          >
            <el-input v-model="form.host" placeholder="smtp.88.com" />
          </el-form-item>
          <el-form-item :rules="[{ required: true, message: '请输入port', trigger: 'blur' }]" label="port" prop="port">
            <el-input v-model="form.port" placeholder="465" />
          </el-form-item>
          <el-form-item
            :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]"
            label="用户名"
            prop="port"
          >
            <el-input v-model="form.username" placeholder="输入邮箱账号" />
          </el-form-item>
          <el-form-item
            :rules="[{ required: true, message: '请输入授权码', trigger: 'blur' }]"
            label="授权码"
            prop="password"
          >
            <el-input v-model="form.password" placeholder="授权码非账号密码" show-password />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit"> 保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="短信配置" name="smsEnvConfig">
        <el-form ref="smsEnvConfig" :model="form" label-width="120px">
          <el-form-item
            :rules="[{ required: true, message: '请选择短信渠道', trigger: 'blur' }]"
            label="短信渠道"
            prop="type"
          >
            <el-select v-model="form.type" placeholder="请选择短信渠道">
              <el-option label="阿里云" value="ALIYUN" />
              <el-option label="腾讯云" value="TENCENT_CLOUD" />
              <el-option label="中昱维信" value="VEESING" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="form.type == 'VEESING'"
            :rules="[{ required: true, message: '请输入appId', trigger: 'blur' }]"
            label="appId"
            prop="appId"
          >
            <el-input v-model="form.appId" placeholder="请输入appId" />
          </el-form-item>
          <el-form-item
            v-if="form.type == 'VEESING'"
            :rules="[{ required: true, message: '请输入appKey', trigger: 'blur' }]"
            label="appKey"
            prop="secretKey"
          >
            <el-input v-model="form.secretKey" placeholder="请输入appKey" />
          </el-form-item>
          <el-form-item
            v-if="form.type == 'ALIYUN'"
            :rules="[{ required: true, message: '请输入AccessKeyID', trigger: 'blur' }]"
            label="AccessKeyID"
            prop="secretId"
          >
            <el-input v-model="form.secretId" placeholder="请输入AccessKeyID" />
          </el-form-item>
          <el-form-item
            v-if="form.type == 'ALIYUN'"
            :rules="[{ required: true, message: '请输入AccessKeySecret', trigger: 'blur' }]"
            label="AccessKeySecret"
            prop="secretKey"
          >
            <el-input v-model="form.secretKey" placeholder="请输入AccessKeySecret" />
          </el-form-item>
          <el-form-item
            v-if="form.type == 'ALIYUN'"
            :rules="[{ required: true, message: '请输入短信签名', trigger: 'blur' }]"
            label="签名"
            prop="sign"
          >
            <el-input v-model="form.sign" placeholder="请输入短信签名" />
          </el-form-item>
          <el-form-item
            v-if="form.type == 'TENCENT_CLOUD'"
            :rules="[{ required: true, message: '请输入SecretId', trigger: 'blur' }]"
            label="SecretId"
            prop="secretId"
          >
            <el-input v-model="form.secretId" placeholder="请输入SecretId" />
          </el-form-item>
          <el-form-item
            v-if="form.type == 'TENCENT_CLOUD'"
            :rules="[{ required: true, message: '请输入SecretKey', trigger: 'blur' }]"
            label="SecretKey"
            prop="secretKey"
          >
            <el-input v-model="form.secretKey" placeholder="请输入SecretKey" />
          </el-form-item>
          <el-form-item
            v-if="form.type == 'TENCENT_CLOUD'"
            :rules="[{ required: true, message: '请输入短信签名', trigger: 'blur' }]"
            label="签名"
            prop="sign"
          >
            <el-input v-model="form.sign" placeholder="请输入短信签名" />
          </el-form-item>
          <el-form-item
            v-if="form.type == 'TENCENT_CLOUD'"
            :rules="[{ required: true, message: '请输入appId', trigger: 'blur' }]"
            label="appId"
            prop="appId"
          >
            <el-input v-model="form.appId" placeholder="请输入appId" />
          </el-form-item>
          <el-form-item
            :rules="[{ required: true, message: '请输入模板id', trigger: 'blur' }]"
            label="模板id"
            prop="templateId"
          >
            <el-input v-model="form.templateId" placeholder="请输入模板id" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit"> 保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="微信公众号" name="wxMpEnvConfig">
        <el-form ref="wxMpEnvConfig" :model="form" label-width="120px">
          <el-form-item
            :rules="[{ required: true, message: '请输入appId', trigger: 'blur' }]"
            label="appId"
            prop="appId"
          >
            <el-input v-model="form.appId" placeholder="请输入appId" />
          </el-form-item>
          <el-form-item
            :rules="[{ required: true, message: '请输入appSecret', trigger: 'blur' }]"
            label="appSecret"
            prop="secret"
          >
            <el-input v-model="form.secret" placeholder="请输入appSecret" />
          </el-form-item>
          <el-form-item
            :rules="[{ required: true, message: '请输入token', trigger: 'blur' }]"
            label="token"
            prop="token"
          >
            <el-input v-model="form.token" placeholder="请输入token" />
          </el-form-item>
          <el-form-item
            :rules="[{ required: true, message: '请输入AESKey', trigger: 'blur' }]"
            label="aesKey"
            prop="aesKey"
          >
            <el-input v-model="form.aesKey" placeholder="请输入AESKey" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit"> 保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import ConfigMixin from './subconfig/ConfigMixin'
import SystemInfoConfig from './subconfig/SystemInfoConfig.vue'
import OssConfig from './subconfig/OssConfig.vue'

export default {
  name: 'ConfigForm',
  components: { SystemInfoConfig, OssConfig },
  mixins: [ConfigMixin],
  methods: {
    handleTabClick() {
      if (!['systemInfoConfig', 'fileEnvConfig'].includes(this.activeName)) {
        this.handleClick()
      }
    }
  }
}
</script>

<style scoped>
.el-input {
  width: 50%;
}
</style>
