<template>
    <div class="create-container">
        <div v-if="!authGroupOptions.length">
            <el-result icon="error" title="无权限访问" sub-title="无权限进行操作，请联系管理员" />
        </div>
        <div v-else>
            <el-row class="header" type="flex" justify="center" align="middle">
                <el-col :span="20" :offset="2">
                    <el-select v-model="currentAuthGroup" value-key="value" placeholder="请选择权限组">
                        <el-option
                            v-for="item in authGroupOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item"
                        />
                    </el-select>
                </el-col>
            </el-row>
            <div v-if="!currentAuthGroup||currentAuthGroup.value==='submit'">
                <div v-if="writeStatus==1">
                    <h1 id="inActiveTime" style="display: none;" />
                    <biz-project-form
                        v-if="formConfig.formKey"
                        :form-config="formConfig"
                        @submit="submitForm"
                    />
                </div>
                <el-result v-if="writeStatus==2" title="提交成功">
                    <template slot="icon">
                        <img src="@/assets/images/submit-success.png">
                    </template>
                    <template slot="extra">
                        <el-button type="primary" size="medium" @click="writeStatus=1">
                            返回
                        </el-button>
                    </template>
                </el-result>
            </div>
            <div v-else>
                <data-table :mode="2" :auth-group="currentAuthGroup.auth" />
            </div>
        </div>
    </div>
</template>

<script>
import DataTable from './index'
import BizProjectForm from '@/formgen/src/components/BizProjectForm'
import mixin from '../TduckFormMixin'
import {createFormResultRequest, viewFormResultRequest} from '@/api/project/data'
import {getFormUserAuthRequest} from '@/api/project/publish'

const uaParser = require('ua-parser-js')
const ua = uaParser(navigator.userAgent)

export default {
    name: 'DataCreate',
    components: {
        BizProjectForm,
        DataTable
    },
    mixins: [mixin],
    props: {},
    data() {
        return {
            noAuthority: false,
            currentAuthGroup: null,
            authGroupOptions: [

            ],
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
                submitPromptText: false,
                submitPromptTextContent: '填写完成！',
                submitPromptImgUrl: ''
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
        getFormUserAuthRequest(this.formConfig.formKey).then(res => {
            // 检查是否有新增的权限 无权限则进入
            if (!res.data) {
                return
            }
            // 是否有填写权限
            let isAdd = res.data.some(item => item.btnPerms.includes('add'))
            let defaultOptions = new Array()
            if (isAdd) {
                defaultOptions = [{
                    value: 'submit',
                    label: '提交'
                }]
            }
            this.authGroupOptions = defaultOptions.concat(res.data.map(item => {
                return {value: item.id, label: item.name, auth: item}
            }))
            this.currentAuthGroup = defaultOptions[0]
        })
    },
    mounted() {
        viewFormResultRequest(this.formConfig.formKey).then(() => {
        })
    }, methods: {
        openPublicResultHandle() {
            let formKey = this.formConfig.formKey
            this.$router.replace({path: '/project/public/result', query: {formKey}})
        },
        submitForm(data) {
            // 完成时间
            createFormResultRequest({
                'completeTime': null,
                'formKey': this.formConfig.formKey,
                'submitOs': ua.os.name,
                'submitBrowser': ua.browser.name,
                'submitUa': ua,
                'wxUserInfo': this.wxUserInfo,
                'wxOpenId': this.wxUserInfo ? this.wxUserInfo.openid : '',
                'originalData': data.formModel
            }).then(() => {
                this.writeStatus = 2
                if (this.userFormSetting.submitJumpUrl) {
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
.create-container {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;

  .header {
    height: 50px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }
}

</style>
