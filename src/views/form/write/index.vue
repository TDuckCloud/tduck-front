<template>
    <div class="write-container">
        <h1 id="inActiveTime" style="display: none;" />
        <div v-if="writeStatus==0" class="title-icon-view">
            <div class="icon-view">
                <i class="el-icon-check success-icon" />
            </div>
            <p v-if="writeNotStartPrompt" style="text-align: center;">
                <span v-if="writeNotStartPrompt">{{ writeNotStartPrompt }}</span>
            </p>
        </div>
        <div v-if="writeStatus==1">
            <project-form
                v-if="projectConfig.projectKey"
                :project-config="projectConfig"
                @submit="submitForm"
            />
        </div>
        <div v-if="writeStatus==2" class="title-icon-view">
            <div class="icon-view">
                <i class="el-icon-check success-icon" />
            </div>
            <p style="text-align: center;">
                <span v-if="userProjectSetting.submitPromptText">{{ userProjectSetting.submitPromptText }}</span>
                <span v-else>{{ globalDefaultValue.projectSubmitPromptText }}</span>
            </p>
            <div>
                <el-image
                    v-if="userProjectSetting.submitPromptImg"
                    :src="userProjectSetting.submitPromptImg"
                    fit="cover"
                />
            </div>
            <el-button v-if="userProjectSetting.publicResult" type="primary" @click="openPublicResultHandle">
                查看数据
            </el-button>
        </div>
    </div>
</template>

<script>
import ProjectForm from '../preview/ProjectForm'
import loadWXJs from '@/utils/loadWxSdk'
import defaultValue from '@/utils/defaultValue'
import {getQueryString} from '@/utils'
import constants from '@/utils/constants'

const uaParser = require('ua-parser-js')
const ua = uaParser(navigator.userAgent)

require('@/utils/ut')
export default {
    name: 'WriteView',
    components: {
        ProjectForm
    },
    props: {},
    data() {
        return {
            inActiveTime: 0,
            projectConfig: {
                projectKey: '',
                preview: false,
                showBtns: true
            },
            writeStatus: 1,
            writeNotStartPrompt: '',
            userProjectSetting: {
                submitPromptText: ''
            },
            globalDefaultValue: defaultValue,
            // 微信授权地址
            wxAuthorizationUrl: '',
            wxAuthorizationCode: '',
            wxUserInfo: {},
            wxSignature: {}
        }
    },
    metaInfo: {
        meta: [
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            }
        ]
    },
    async created() {
        let key = this.$route.query.key || this.$route.params.key
        this.projectConfig.projectKey = key
        let wxCode = getQueryString('code')
        if (wxCode) {
            this.wxAuthorizationCode = wxCode
            await this.getWxAuthorizationUserInfo()
        }
        this.getWxAuthorizationUrl()
        this.queryProjectSettingStatus()
        this.queryProjectSetting()
        if (constants.enableWx) {
            // 加载微信相关 获取签名
            this.$api.get('/wx/jsapi/signature', {params: {url: window.location.href}}).then(res => {
                this.wxSignature = res.data
                this.setWxConfig()
            })
        }

    },
    mounted() {
        this.viewProjectHandle()
    }, methods: {
        viewProjectHandle() {
            // 是否能进入填写
            this.$api.post(`/user/project/result/view/${this.projectConfig.projectKey}`, {params: {projectKey: this.projectConfig.projectKey}}).then(() => {

            })
        },
        queryProjectSettingStatus() {
            // 是否能进入填写
            this.$api.get('/user/project/setting-status', {
                params: {
                    projectKey: this.projectConfig.projectKey,
                    wxOpenId: this.wxUserInfo ? this.wxUserInfo.openid : ''
                }
            }).then(res => {
                if (res.msg) {
                    this.writeNotStartPrompt = res.msg
                    this.writeStatus = 0
                }
            })
        },
        getWxAuthorizationUserInfo() {
            let wxAuthorizationCode = this.wxAuthorizationCode
            // 根据code 获取用户授权信息
            this.$api.get('/wx/jsapi/authorization/user/info', {
                params: {
                    code: wxAuthorizationCode
                }
            }).then(res => {
                if (res.data) {
                    this.wxUserInfo = res.data
                }
            })

        },
        getWxAuthorizationUrl() {
            // 获取微信授权url地址
            this.$api.get('/wx/jsapi/authorization/url', {params: {url: window.location.href}}).then(res => {
                if (res.data) {
                    this.wxAuthorizationUrl = res.data
                }
            })
        },
        setWxConfig() {
            let that = this
            let signature = this.wxSignature
            loadWXJs(wx => {
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: signature.appId, // 必填，公众号的唯一标识
                    timestamp: signature.timestamp, // 必填，生成签名的时间戳
                    nonceStr: signature.nonceStr, // 必填，生成签名的随机串
                    signature: signature.signature, // 必填，签名
                    jsApiList: [
                        'updateAppMessageShareData',
                        'updateTimelineShareData',
                        'onMenuShareAppMessage',
                        'onMenuShareTimeline',
                        'showMenuItems',
                        'hideMenuItems',
                        'chooseWXPay'
                    ] // 必填，需要使用的JS接口列表
                })
                // sdk准备完成之后调用
                wx.ready(function() {
                    // 需在用户可能点击分享按钮前就先调用
                    console.log('ready')
                    that.setWxProjectShare(wx)
                })
            })
        },
        /**
     * 微信分享
     */
        setWxProjectShare(wx) {
            let {shareImg, shareTitle, shareDesc} = this.userProjectSetting
            wx.updateAppMessageShareData({
                title: shareTitle || defaultValue.projectShareTitle, // 分享标题
                desc: shareDesc || defaultValue.projectShareDesc, // 分享描述
                link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: shareImg || defaultValue.projectShareImg, // 分享图标
                success: function() {
                    // 设置成功
                    console.log('succcess')
                },
                fail: function() {
                    console.log('fail')
                }
            })
            wx.updateTimelineShareData({
                title: shareTitle || defaultValue.projectShareTitle, // 分享标题
                desc: shareDesc || defaultValue.projectShareDesc, // 分享描述
                link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: shareImg || defaultValue.projectShareImg, // 分享图标
                success: function() {
                    // 设置成功
                    console.log('succcess')
                },
                fail: function() {
                    console.log('fail')
                }
            })
            wx.onMenuShareTimeline({
                title: shareTitle || defaultValue.projectShareTitle, // 分享标题
                desc: shareDesc || defaultValue.projectShareDesc, // 分享描述
                link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: shareImg || defaultValue.projectShareImg, // 分享图标
                success: function() {
                    // 设置成功
                    console.log('succcess')
                }
            })
            wx.onMenuShareAppMessage({
                title: shareTitle || defaultValue.projectShareTitle, // 分享标题
                desc: shareDesc || defaultValue.projectShareDesc, // 分享描述
                link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: shareImg || defaultValue.projectShareImg, // 分享图标
                success: function() {
                    // 设置成功
                    console.log('succcess')
                }
            })
        },
        queryProjectSetting() {
            this.$api.get(`/user/project/setting/${this.projectConfig.projectKey}`).then(res => {
                if (res.data) {
                    this.userProjectSetting = res.data
                    // 仅在微信环境打开
                    if (res.data && res.data.wxWrite) {
                        // 记录微信用户信息
                        if (res.data.recordWxUser && !this.wxAuthorizationCode) {
                            location.href = this.wxAuthorizationUrl
                        } else {
                            this.onlyWxOpenHandle()
                        }
                    }
                }
            })
        },
        /**
     * 仅在微信打开
     */
        onlyWxOpenHandle() {
            let wxUa = navigator.userAgent.toLowerCase()
            let isWeixin = wxUa.indexOf('micromessenger') != -1
            if (!isWeixin) {
                document.head.innerHTML = '<title>抱歉，出错了</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"><link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/libs/weui/0.4.1/weui.css">'
                document.body.innerHTML = '<div class="weui_msg"><div class="weui_icon_area"><i class="weui_icon_info weui_icon_msg"></i></div><div class="weui_text_area"><h4 class="weui_msg_title">请在微信客户端打开链接</h4></div></div>'
            }
        },
        openPublicResultHandle() {
            let projectKey = this.projectConfig.projectKey
            this.$router.replace({path: '/project/public/result', query: {projectKey}})
        },
        submitForm(data) {
            // 完成时间
            let inActiveTime = document.getElementById('inActiveTime').innerText
            this.$api.post('/user/project/result/create', {
                'completeTime': inActiveTime,
                'projectKey': this.projectConfig.projectKey,
                'submitOs': ua.os.name,
                'submitBrowser': ua.browser.name,
                'submitUa': ua,
                'wxUserInfo': this.wxUserInfo,
                'wxOpenId': this.wxUserInfo ? this.wxUserInfo.openid : '',
                'originalData': data.formModel,
                'processData': data.labelFormModel
            }).then(() => {
                this.writeStatus = 2
                if (this.userProjectSetting.submitJumpUrl) {
                    setTimeout(() => {
                        window.location.replace(this.userProjectSetting.submitJumpUrl)
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
</style>
