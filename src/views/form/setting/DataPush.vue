<template>
  <div class="p10">
    <div slot="header">
      <span>数据推送</span>
      <span class="desc-text ml10">将数据以JSON格式推送给三方系统</span>
    </div>
    <el-alert
      :closable="false"
      class="m5"
      description="数据提交后，将向填写的webhook地址发送 JSON 格式的填写结果,content-type为json。 该服务器需要返回200状态作为响应。否则平台认为出现异常，最多重试3次"
      style="width: 98%"
      title="温馨提示"
    >
    </el-alert>
    <div v-if="apiKey" class="api-wrap">
      <div>
        表单字段同步API:
        <span> {{ apiBasePath }}/sync/form/fields?apiKey={{ apiKey }}</span>
      </div>
      <div>
        数据同步API:
        <span> {{ apiBasePath }}/sync/form/data?apiKey={{ apiKey }}</span>
      </div>
    </div>
    <div class="p10">
      <el-form ref="webhookForm" :model="form" :rules="rules" size="mini">
        <el-row>
          <el-col :span="5">
            <el-form-item label="" prop="name">
              <el-switch
                v-model="form.enabled"
                active-color="#13ce66"
                active-text="开启"
                inactive-text="关闭"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.enabled" :gutter="20">
          <el-col :span="5">
            <el-form-item label="请求类型" prop="requestType" size="medium">
              <el-select v-model="form.requestType" placeholder="活动区域">
                <el-option label="POST" value="POST"></el-option>
                <el-option label="GET" value="GET"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="推送地址" prop="url" style="margin-top: 4px">
              <el-input
                v-model="form.url"
                placeholder="请输入推送的数据的API地址"
                size="medium"
                style="margin-top: 4px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="事件类型">
          <el-select v-model="form.otherOptions.eventTypes" clearable collapse-tags multiple>
            <el-option label="表单数据新增" value="form_data_add" />
            <el-option label="表单数据修改" value="form_data_update" />
            <el-option label="表单数据删除" value="form_data_delete" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-re-click size="medium" type="primary" @click="handleSave">保存设置</el-button>
          <el-button size="medium" @click="handleSendTest">发送测试</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getApiKey, getWebHook, saveWebHook, sendTestWebHook } from '@/api/project/webhook'

export default {
  name: 'DataPush',
  components: {},
  data() {
    return {
      form: {
        sourceType: '',
        sourceId: '',
        enabled: false,
        requestType: 'POST',
        url: '',
        otherOptions: {
          eventTypes: []
        }
      },
      rules: {
        requestType: [{ required: true, message: '请选择请求类型', trigger: 'blur' }],
        url: [
          { required: true, message: '请输入推送地址', trigger: 'blur' },
          { type: 'url', message: '请输入正确的url地址', trigger: ['blur', 'change'] }
        ]
      },
      apiKey: '',
      apiBasePath: ''
    }
  },
  created() {
    this.form.sourceType = 'form'
    this.form.sourceId = this.$route.query.key
    this.handleQuery()
    getApiKey(this.form.sourceId).then((res) => {
      if (res.data) {
        this.apiKey = res.data
        this.apiBasePath = window.location.origin + '' + process.env['VUE_APP_API_ROOT']
      }
    })
  },
  methods: {
    handleQuery() {
      getWebHook(this.form.sourceType, this.form.sourceId).then((res) => {
        if (res.data) {
          this.form = res.data
          // 旧版本没有这个字段 兼容下 24/4/06
          if (!this.form.otherOptions) {
            this.form.otherOptions = {
              eventTypes: []
            }
          }
        }
      })
    },
    handleSendTest() {
      if (this.form.enabled === false) {
        this.msgError('请先开启数据推送')
        return
      }
      this.$refs.webhookForm.validate((valid) => {
        if (valid) {
          sendTestWebHook(this.form).then((res) => {
            if (res.data) {
              this.msgSuccess('发送成功')
            } else {
              this.msgError('发送失败,请检查地址是否正确，并且服务器是否正常和正确响应')
            }
          })
        } else {
          return false
        }
      })
    },
    handleSave() {
      this.$refs.webhookForm.validate((valid) => {
        if (valid) {
          saveWebHook(this.form).then((res) => {
            this.msgSuccess('保存成功')
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.p10 {
  padding: 10px;
}

.api-wrap {
  padding: 10px;
  font-size: 14px;
}
</style>
