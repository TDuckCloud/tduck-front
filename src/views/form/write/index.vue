<template>
  <div class="write-container">
    <form-qrcode />
    <h1 id="inActiveTime" style="display: none" />
    <div v-cloak v-if="writeStatus == 0">
      <el-result :title="writeNotStartPrompt" icon="error" />
    </div>
    <div v-cloak v-if="writeStatus == 3">
      <el-card class="pwdinput-card text-center">
        <div slot="header" class="clearfix">
          <span> 请输入密码填写</span>
        </div>
        <el-input v-model="writePassword" placeholder="请输入密码填写" />
        <el-button class="width50 mt20" type="primary" @click="handleCheckWritePwd"> 确定</el-button>
      </el-card>
    </div>
    <div v-if="writeStatus == 1" class="form-container">
      <biz-project-form v-if="formConfig.formKey" ref="bizProjectForm" :form-config="formConfig" @submit="submitForm" />
    </div>
    <div v-cloak v-if="writeStatus == 2" class="title-icon-view">
      <div v-if="userFormSetting.submitShowType === 2" v-html="userFormSetting.submitShowCustomPageContent" />
      <el-result v-else :title="'提交成功'" icon="success" />
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { BizProjectForm } from 'tduck-form-generator'
import 'tduck-form-generator/dist/TduckForm.css'
import { getQueryString } from '@/utils'
import constants from '@/utils/constants'
import { removeFormData } from '@/utils/db'
import { getAuthorizationUrl, getAuthorizationUserInfo, getWxSignature } from '@/api/project/wxmp'
import { isWxEnv, onlyWxOpenHandle, setWxConfig } from './wx'
import TduckFormMixin from '../TduckFormMixin'
import { createFormResultRequest, publicCreateFormResultRequest, viewFormResultRequest } from '@/api/project/data'
import { checkWritePwdRequest, getPublicSettingsRequest, getWriteSettingStatusRequest } from '@/api/project/setting'
import { jumpUrl } from './SubmitJump'
import { checkWriteCountCap, saveWriteCount } from '@/views/form/write/DeviceWriteCount'
import FormQrcode from '@/views/form/write/FormQrcode.vue'

const uaParser = require('ua-parser-js')
const ua = uaParser(navigator.userAgent)

require('@/utils/ut')

export default {
  name: 'WriteView',
  components: {
    FormQrcode,
    BizProjectForm
  },
  mixins: [TduckFormMixin],
  props: {
    // 1：公开填写 2：指定成员填写
    writeType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      formKey: '',
      writePassword: '',
      inActiveTime: 0,
      formConfig: {
        formKey: '',
        preview: false,
        showBtns: true,
        supportText: 'Powered By Tduck 填鸭表单'
      },
      writeStatus: 1,
      // 不允许填写的提示信息
      writeNotStartPrompt: '',
      userFormSetting: {},
      // 微信授权地址
      wxAuthorizationUrl: '',
      wxAuthorizationCode: '',
      wxUserInfo: {},
      wxSignature: {},
      // 待提交表单数据
      submitFormData: {
        completeTime: null,
        formKey: null,
        submitOs: ua.os.name,
        submitBrowser: ua.browser.name,
        submitUa: ua,
        wxUserInfo: null,
        wxOpenId: null,
        originalData: null
      },
      // 提交后返回的数据
      submitResult: {
        // 随机编号
        randomNumberText: '',
        // 考试成绩
        examScoreText: ''
      }
    }
  },
  async created() {
    this.formKey = this.$route.query.key || this.$route.params.key
    // cookie获取微信用户信息
    this.getCookieAuthorizationUserInfo()
    // 微信授权重定向到该页 会携带code参数
    let wxCode = getQueryString('code')
    if (wxCode) {
      this.wxAuthorizationCode = wxCode
      await this.getWxAuthorizationUserInfo()
    }
    // 微信逻辑授权结束 授权地址
    this.getWxAuthorizationUrl()
    // 检查是否能进入填写
    this.queryProjectSettingStatus()
    // 查询相关设置 检查是否能打开等
    let settingRes = await this.queryProjectSetting()
    // 非微信环境不加载微信相关 加快访问速度
    if (constants.enableWx && isWxEnv()) {
      // 加载微信相关 获取签名
      getWxSignature({ url: window.location.href }).then((res) => {
        this.wxSignature = res.data
        setWxConfig(this.wxSignature, settingRes.data)
      })
    }
    viewFormResultRequest(this.formKey).then(() => {})
  },
  methods: {
    queryProjectSettingStatus() {
      // 是否能进入填写
      getWriteSettingStatusRequest({
        formKey: this.formKey,
        type: this.writeType,
        wxOpenId: this.wxUserInfo ? this.wxUserInfo.openid : ''
      }).then((res) => {
        if (res.msg) {
          this.writeNotStartPrompt = res.msg
          this.writeStatus = 0
        }
      })
    },
    getCookieAuthorizationUserInfo() {
      // cookie缓存拿一次 没有的话调接口拿
      let wxUserInfo = Cookies.get('wxUserInfo')
      if (wxUserInfo) {
        wxUserInfo = JSON.parse(wxUserInfo)
        console.log(wxUserInfo)
        if (wxUserInfo.openid) {
          this.wxUserInfo = wxUserInfo
        }
      }
    },
    getWxAuthorizationUserInfo() {
      // 根据code 获取用户授权信息
      let wxAuthorizationCode = this.wxAuthorizationCode
      return getAuthorizationUserInfo({
        code: wxAuthorizationCode
      }).then((res) => {
        if (res.data) {
          console.log('wxuser')
          this.wxUserInfo = res.data
          Cookies.set('wxUserInfo', JSON.stringify(res.data))
          console.log(this.wxUserInfo)
        }
      })
    },
    getWxAuthorizationUrl() {
      // 获取微信授权url地址
      getAuthorizationUrl({ url: window.location.href }).then((res) => {
        if (res.data) {
          this.wxAuthorizationUrl = res.data
        }
      })
    },
    async queryProjectSetting() {
      // 填写设置
      let res = await getPublicSettingsRequest(this.formKey)
      this.formConfig.formKey = this.formKey
      if (res.data) {
        this.userFormSetting = res.data
        this.formConfig.setting = res.data
        // 设备填写次数校验
        this.checkDeviceWriteLimit()
        // 仅在微信环境打开
        if (res.data && res.data.onlyWxWrite) {
          // 记录微信用户信息
          if (res.data.recordWxUser && !this.wxAuthorizationCode) {
            if (Object.keys(this.wxUserInfo).length === 0) {
              location.href = this.wxAuthorizationUrl
            }
          } else {
            onlyWxOpenHandle()
          }
        }
        // 开启了密码填写
        if (res.data && res.data.passwordWriteStatus) {
          this.writeStatus = 3
        }
      }
      return res
    },
    /**
     * 检查设备填写次数
     */
    checkDeviceWriteLimit() {
      if (this.userFormSetting.deviceWriteCountLimitStatus) {
        const flag = checkWriteCountCap(this.formKey, this.userFormSetting.deviceWriteCountLimit)
        if (flag) {
          this.writeNotStartPrompt = this.userFormSetting.deviceWriteCountLimitText
          this.writeStatus = 0
        }
        return flag
      }
    },
    handleCheckWritePwd() {
      checkWritePwdRequest({
        formKey: this.formKey,
        password: this.writePassword
      }).then((res) => {
        this.writeStatus = 1
      })
    },
    async submitForm(data) {
      // 完成时间
      this.submitFormData.completeTime = document.getElementById('inActiveTime').innerText
      this.submitFormData.wxUserInfo = this.wxUserInfo
      this.submitFormData.wxOpenId = this.wxUserInfo ? this.wxUserInfo.openid : ''
      this.submitFormData.originalData = data.formModel
      this.submitFormData.formKey = this.formKey
      this.submitFormData.formId = data.formId
      this.submitFormData.formType = this.$refs.bizProjectForm.formConf.formType
      let res = null
      if (this.writeType === 1) {
        res = await publicCreateFormResultRequest(this.submitFormData)
      } else {
        res = await createFormResultRequest(this.submitFormData)
      }
      this.handleSubmitSuccess(res.data)
    },
    // 提交成功后处理
    handleSubmitSuccess(data) {
      this.submitResult = data
      // 删除临时缓存数据
      removeFormData(this.formKey)
      // 如果开启了设备填写次数限制 则保存记录
      saveWriteCount(this.formKey)
      this.writeStatus = 2
      if (this.userFormSetting.submitJump) {
        jumpUrl(this.userFormSetting.submitJumpUrl, data.id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.write-container {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

.title-icon-view {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.icon-view {
  width: 59px;
  height: 59px;
  border-radius: 100px;
  background-color: #0076ff;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
}

.success-icon {
  text-align: center;
  color: white;
  font-size: 30px;
}

.pwdinput-card {
  width: 350px;
  margin: 200px auto;
  min-height: 200px;
}
::v-deep .project-form {
  padding: 20px;
}
</style>
