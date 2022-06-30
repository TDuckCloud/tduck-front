<template>
    <div class="write-container">
        <h1 id="inActiveTime" style="display: none;" />
        <div v-if="writeStatus==0" v-cloak>
            <el-result icon="error" :title="writeNotStartPrompt" :sub-title="writeNotStartPrompt" />
        </div>
        <div v-if="writeStatus==1" class="form-container">
            <biz-project-form
                v-if="formConfig.formKey"
                :form-config="formConfig"
                @submit="submitForm"
            />
        </div>
        <div v-if="writeStatus==2" v-cloak class="title-icon-view">
            <el-result icon="success"
                       :title="userFormSetting.promptText?userFormSetting.promptTextContent:'提交成功！'"
            />
            <div style="text-align: center">
                <el-image
                    v-if="userFormSetting.promptImg"
                    :src="userFormSetting.promptImgUrl"
                    fit="cover"
                />
                <!--                <el-button v-if="userFormSetting.publicResult" type="primary" @click="openPublicResultHandle">-->
                <!--                    查看数据-->
                <!--                </el-button>-->
            </div>
        </div>
    </div>
</template>

<script>
import {BizProjectForm} from 'tduck-form-generator'
import {getQueryString} from '@/utils'
import constants from '@/utils/constants'
import {getAuthorizationUrl, getAuthorizationUserInfo, getWxSignature} from '@/api/project/wxmp'
import {setWxConfig, onlyWxOpenHandle} from './wx'
import _ from 'lodash'
import mixin from '../TduckFormMixin'
import {createPublicFormResultRequest, viewFormResultRequest} from '@/api/project/data'
import {
    getShareSettingRequest,
    getSubmitSettingRequest,
    getWriteSettingRequest,
    getWriteSettingStatusRequest
} from '@/api/project/setting'

const uaParser = require('ua-parser-js')
const ua = uaParser(navigator.userAgent)

require('@/utils/ut')

export default {
    name: 'WriteView',
    components: {
        BizProjectForm
    },
    mixins: [mixin],
    props: {},
    data() {
        return {
            inActiveTime: 0,
            formConfig: {
                formKey: '',
                preview: false,
                showBtns: true
            },
            writeStatus: 1,
            // 不允许填写的提示信息
            writeNotStartPrompt: '',
            userFormSetting: {
            },
            // 微信授权地址
            wxAuthorizationUrl: '',
            wxAuthorizationCode: '',
            wxUserInfo: {},
            wxSignature: {}
        }
    },
    async created() {
        let key = this.$route.query.key || this.$route.params.key
        this.formConfig.formKey = key
        // 微信授权重定向到该页 会携带code参数
        let wxCode = getQueryString('code')
        if (wxCode) {
            this.wxAuthorizationCode = wxCode
            await this.getWxAuthorizationUserInfo()
        }
        // 微信逻辑授权结束
        this.getWxAuthorizationUrl()
        // 检查是否能进入填写
        this.queryProjectSettingStatus()
        this.queryProjectSetting()
        if (constants.enableWx) {
            // 加载微信相关 获取签名
            getWxSignature({url: window.location.href}).then(res => {
                this.wxSignature = res.data
                getShareSettingRequest(this.formConfig.formKey).then(res => {
                    setWxConfig(this.wxSignature, res.data)
                })
            })
        }
    },
    mounted() {
        viewFormResultRequest(this.formConfig.formKey).then(() => {
        })
    }, methods: {
        queryProjectSettingStatus() {
            // 是否能进入填写
            getWriteSettingStatusRequest({
                formKey: this.formConfig.formKey,
                wxOpenId: this.wxUserInfo ? this.wxUserInfo.openid : ''
            }).then(res => {
                if (res.msg) {
                    this.writeNotStartPrompt = res.msg
                    this.writeStatus = 0
                }
            })
        },
        getWxAuthorizationUserInfo() {
            // 根据code 获取用户授权信息
            let wxAuthorizationCode = this.wxAuthorizationCode
            return getAuthorizationUserInfo({
                code: wxAuthorizationCode
            }).then(res => {
                if (res.data) {
                    this.wxUserInfo = res.data
                }
            })
        },
        getWxAuthorizationUrl() {
            // 获取微信授权url地址
            getAuthorizationUrl({url: window.location.href}).then(res => {
                if (res.data) {
                    this.wxAuthorizationUrl = res.data
                }
            })
        },
        queryProjectSetting() {
            // 提交设置
            getSubmitSettingRequest(this.formConfig.formKey).then(res => {
                if (res.data) {
                    this.userFormSetting = this.userFormSetting ? _.assign(this.userFormSetting, res.data) : res.data
                }
            })
            // 填写设置
            getWriteSettingRequest(this.formConfig.formKey).then(res => {
                if (res.data) {
                    this.userFormSetting = this.userFormSetting ? _.assign(this.userFormSetting, res.data) : res.data
                    // 仅在微信环境打开
                    if (res.data && res.data.wxWrite) {
                        // 记录微信用户信息
                        if (res.data.recordWxUser && !this.wxAuthorizationCode) {
                            location.href = this.wxAuthorizationUrl
                        } else {
                            onlyWxOpenHandle()
                        }
                    }
                }
            })

        },
        openPublicResultHandle() {
            let formKey = this.formConfig.formKey
            this.$router.replace({path: '/project/public/result', query: {formKey}})
        },
        submitForm(data) {
            // 完成时间
            let inActiveTime = document.getElementById('inActiveTime').innerText
            createPublicFormResultRequest({
                'completeTime': inActiveTime,
                'formKey': this.formConfig.formKey,
                'submitOs': ua.os.name,
                'submitBrowser': ua.browser.name,
                'submitUa': ua,
                'wxUserInfo': this.wxUserInfo,
                'wxOpenId': this.wxUserInfo ? this.wxUserInfo.openid : '',
                'originalData': data.formModel
            }).then(() => {
                this.writeStatus = 2
                if (this.userFormSetting.submitJump) {
                    setTimeout(() => {
                        window.location.replace(this.userFormSetting.submitJumpUrl)
                    }, 1000)
                }

            })
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
.form-container{
  height: 100%;
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
</style>

<style lang="scss">
@import '../../../assets/styles/elementui-mobile.scss';

.project-form-wrapper {
  width: 100%;
  min-height: 100%;
  padding: 20px 0px;
  background-color: rgba(158, 207, 250, 0.3);
}

.project-form {
  margin: 0px auto;
  width: 800px;
  padding: 15px;
  background-repeat: repeat;
  background-color: #FFFFFF;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}

.project-form .describe-html img {
  max-width: 780px;
  margin: 0px;
}

.project-body::-webkit-scrollbar {
  width: 0 !important;
  background: transparent;
}

.project-body {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

.logo-img {
  max-height: 120px;
}

.submit-btn-form-item button {
  width: 20%;
}

.support-text {
  color: #545454;
  text-shadow: 0 1px 1px #e9e9e9;
  margin-top: 20px;
}

@media screen and (max-width: 750px) {
  .project-form {
    width: 100% !important;
  }
  .logo-img {
    max-height: 2.94rem;
  }
  .submit-btn-form-item {
    text-align: center;
  }
  .submit-btn-form-item button {
    width: 80%;
  }
  .project-form .describe-html img {
    width: 95vw !important;
  }
}
</style>
