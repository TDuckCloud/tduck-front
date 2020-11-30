<template>
    <div class="write-container">
        <div v-if="!writeFinish">
            <project-form
                @submit="submitForm"
                :projectConfig="projectConfig"
                v-if="projectConfig.projectKey"/>
        </div>
        <div v-if="writeFinish">
            <div style="text-align: center">
                <el-image
                    v-if="userProjectSetting.submitPromptImg"
                    :src="userProjectSetting.submitPromptImg"
                    fit="cover"></el-image>
            </div>
            <p style="text-align: center" v-if="userProjectSetting.submitPromptText">
                <i class="el-icon-check"/>
                {{userProjectSetting.submitPromptText}}
            </p>
        </div>
    </div>
</template>

<script>
import ProjectForm from './ProjectForm'

export default {
    name: 'WriteView',
    props: {},
    data() {
        return {
            projectConfig: {
                projectKey: '',
                preview: false,
                showBtns: true
            },
            writeFinish: false,
            userProjectSetting: {}
        }
    },
    mounted() {
        let key = this.$route.query.key
        this.projectConfig.projectKey = key
        this.queryProjectSetting()
    },
    components: {
        ProjectForm
    }, methods: {
        queryProjectSetting() {
            this.$api.get(`/user/project/setting/query/${this.projectConfig.projectKey}`).then(res => {
                this.userProjectSetting = res.data
                if(res.data.wxWrite){
                    let ua = navigator.userAgent.toLowerCase()
                    let isWeixin = ua.indexOf('micromessenger') != -1
                    let isAndroid = ua.indexOf('android') != -1
                    let isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1)
                    if (!isWeixin) {
                        document.head.innerHTML = '<title>抱歉，出错了</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"><link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/libs/weui/0.4.1/weui.css">'
                        document.body.innerHTML = '<div class="weui_msg"><div class="weui_icon_area"><i class="weui_icon_info weui_icon_msg"></i></div><div class="weui_text_area"><h4 class="weui_msg_title">请在微信客户端打开链接</h4></div></div>'
                    }
                }
            })
        },
        submitForm(data) {
            this.$api.post('/user/project/result/create', {
                'projectKey': this.projectConfig.projectKey,
                'collectData': data
            }).then(res => {
                this.formState = true
            })
        }
    }
}
</script>

<style scoped>

.write-container {
    margin: 0;
    padding: 0;
}
</style>
