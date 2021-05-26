<template>
    <div class="member-container">
        <el-card class="member-box-card">
            <div class="member-info-view">
                <p class="title pl-10">个人信息</p>
                <div v-if="userInfo" class="account-info-view">
                    <table>
                        <tbody>
                            <tr>
                                <td width="80" style="text-align: right;">用户名：</td>
                                <td>
                                    {{ userInfo.name }}
                                    <el-button type="text" @click="editNameDialogVisible=true">
                                        修改
                                    </el-button>
                                </td>
                            </tr>
                            <tr>
                                <td width="80" style="text-align: right;">账号邮箱：</td>
                                <td>
                                    {{ userInfo.email }}
                                    <el-button type="text" @click="emailDialogVisible=true">绑定</el-button>
                                </td>
                            </tr>
                            <tr>
                                <td width="80" style="text-align: right;">密码：</td>
                                <td>
                                    ******
                                    <el-button type="text" @click="pwdDialogVisible=true">修改</el-button>
                                </td>
                            </tr>
                            <tr>
                                <td width="80" style="text-align: right;">手机号：</td>
                                <td>
                                    {{ userInfo.phoneNumber }}
                                    <el-button v-if="userInfo.phoneNumber" type="text" @click="phoneDialogVisible=true">
                                        修改
                                    </el-button>
                                    <el-button v-else type="text" @click="phoneDialogVisible=true">绑定</el-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="account-avatar-view">
                        <my-upload v-model="showUploadAvatar"
                                   field="file"
                                   :width="300"
                                   :height="300"
                                   :url="getUploadUrl()"
                                   :headers="getUploadHeader()"
                                   img-format="png"
                                   @crop-upload-success="cropUploadSuccess"
                        />
                        <el-avatar
                            style="width: 100px; height: 100px;"
                            :src="userInfo.avatar"
                            @click.native="showUploadAvatar=true"
                        />
                        <div style="margin-left: 10px; margin-top: 5px;">
                            <el-button @click.native="showUploadAvatar=true">更换头像</el-button>
                        </div>
                    </div>
                </div>
                <p class="title pl-10">第三方账号</p>
                <div v-if="userInfo" class="account-info-view">
                    <div style="margin-left: 30px; display: flex; flex-direction: row;">
                        <div class="account-icon-view">
                            <font-icon class="fab fa-weixin icon" :style="{color:userInfo.wxName?'#3F9F3F':''}" />
                            <span v-if="userInfo.wxName">
                                {{ userInfo.wxName }}(已绑定)
                            </span>
                            <el-button v-else type="text" @click="bindWxHandle">绑定</el-button>
                            <el-dialog title="微信扫描二维码绑定"
                                       width="400px"
                                       center
                                       :visible.sync="bindWxDialogVisible"
                            >
                                <el-image
                                    style="width: 150px; height: 150px; display: block; margin: 0 auto;"
                                    :src="bindWxQrcode"
                                    fit="fill"
                                />
                            </el-dialog>
                        </div>
                        <div class="account-icon-view">
                            <font-icon class="fa fa-qq icon" :style="{color:userInfo.qqName?'#078DF0':''}" />
                            <span v-if="userInfo.qqName">
                                {{ userInfo.qqName }}(已绑定)
                            </span>
                            <el-button v-else type="text" @click="redirectUrl(qqLoginAuthorizeUrl)">绑定</el-button>
                        </div>
                        <div class="account-icon-view">
                            <font-icon class="fa fa-weibo icon" />
                            <span v-if="userInfo.wbName">
                                {{ userInfo.wbName }}(已绑定)
                            </span>
                            <el-button v-else type="text">绑定</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
        <div>
            <el-dialog
                title="修改用户名"
                :visible.sync="editNameDialogVisible"
                width="450px"
                center
            >
                <el-form ref="updateNameForm" :model="userInfoForm" :rules="userInfoRules" label-width="80px">
                    <el-form-item label="新用户名" prop="name">
                        <el-input v-model="userInfoForm.name" />
                    </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button type="primary"
                               @click="()=>{
                                   this.$refs['updateNameForm'].validateField('name', err => {
                                       if (!err) {
                                           this.editNameDialogVisible = false;
                                           this.updateUserHandle()
                                       }
                                   })
                               }"
                    >保存</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="修改密码"
                :visible.sync="pwdDialogVisible"
                width="450px"
                center
            >
                <el-form ref="updatePassWordForm"
                         style="width: 300px;"
                         :model="userPwdForm" :rules="userPwdRules" label-width="120px"
                >
                    <el-form-item label="输入旧密码" prop="oldPassword">
                        <el-input v-model="userPwdForm.oldPassword" placeholder="请输入旧密码" show-password />
                    </el-form-item>
                    <el-form-item label="输入新密码" prop="password">
                        <el-input v-model="userPwdForm.password" placeholder="请输入新密码" show-password />
                    </el-form-item>
                    <el-form-item label="重复输入密码" prop="repeatPassword">
                        <el-input v-model="userPwdForm.repeatPassword" placeholder="请重复输入密码" show-password />
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary"
                               @click="()=>{this.pwdDialogVisible = false;this.updateUserPwdHandle()}"
                    >完 成</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="修改邮箱"
                :visible.sync="emailDialogVisible"
                width="450px"
                center
            >
                <el-form ref="updateEmailForm"
                         style="width: 80%;"
                         :model="userInfoForm" :rules="userInfoRules" label-width="80px"
                >
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="userInfoForm.email" placeholder="请输入邮箱" />
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-prevent-re-click
                               type="primary"
                               @click="()=>{this.pwdDialogVisible = false;this.sendUpdateEmail()}"
                    >发送验证邮件</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="修改手机号"
                :visible.sync="phoneDialogVisible"
                width="450px"
                center
            >
                <el-form ref="updatePhoneForm"
                         :model="userInfoForm" :rules="userInfoRules" label-width="120px"
                >
                    <el-form-item label="手机号" prop="phoneNumber">
                        <el-input v-model="userInfoForm.phoneNumber" placeholder="请输入手机号" />
                    </el-form-item>
                    <el-form-item label="输入验证码" prop="code">
                        <el-input v-model="userInfoForm.code" placeholder="请输入验证码"
                                  style="display: inline-block; width: 60%;"
                        />
                        <el-button v-prevent-re-click
                                   style="display: inline-block; width: 40%;"
                                   @click.native="sendUpdatePhoneNumber"
                        >
                            {{ phoneValidateCodeBtnText }}
                        </el-button>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary"
                               @click="()=>{this.phoneDialogVisible = false;this.updateUserPhoneHandle()}"
                    >完 成</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import constants from '@/utils/constants'
import FontIcon from '@/components/FontIcon'
import {getCurrentDomain} from '@/utils'

export default {
    name: 'Member',
    components: {
        FontIcon,
        myUpload
    },
    data() {
        let validateRePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.userPwdForm.repeatPassword) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            memberMenuActive: '1',
            phoneValidateCodeBtnText: '发送验证码',
            userInfoRules: {
                name: [
                    {required: true, trigger: 'blur', message: '请输入昵称'}
                ],
                email: [
                    {required: true, trigger: 'blur', message: '请输入邮箱'},
                    {
                        pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                        message: '请输入正确的邮箱'
                    }
                ],
                phoneNumber: [
                    {required: true, trigger: 'blur', message: '请输入手机号'},
                    {
                        pattern: /^(?:0|86|\+86)?1[3456789]\d{9}$/,
                        message: '请输入正确的手机号'
                    }
                ], code: [
                    {required: true, trigger: 'blur', message: '请输入验证码'}
                ]
            },
            userPwdRules: {
                oldPassword: [
                    {required: true, trigger: 'blur', message: '请输入旧密码'},
                    {
                        pattern: constants.passwordReg,
                        message: constants.passwordRegDesc
                    }
                ],
                password: [
                    {required: true, trigger: 'blur', message: '请输入新密码'},
                    {
                        pattern: constants.passwordReg,
                        message: constants.passwordRegDesc
                    }
                ],
                repeatPassword: [
                    {required: true, trigger: 'blur', validator: validateRePass}
                ]
            },
            bindWxDialogVisible: false,
            bindWxQrcode: '',
            editNameDialogVisible: false,
            pwdDialogVisible: false,
            phoneDialogVisible: false,
            emailDialogVisible: false,
            userInfo: {},
            userInfoForm: {},
            qqLoginAuthorizeUrl: '',
            userPwdForm: {
                oldPassword: '',
                password: '',
                repeatPassword: ''
            },
            showUploadAvatar: false,
            bindWxTimer: null
        }
    },
    created() {
        this.queryUserInfo()
        this.getQQLoginAuthorizeUrl()
        this.getBindWxQrCode()
    },
    destroyed() {
        clearInterval(this.bindWxTimer)
    },
    methods: {
        queryUserInfo() {
            this.$api.get('/user/current/detail').then(res => {
                if (res.data) {
                    this.userInfo = res.data
                    this.$store.dispatch('user/update', this.userInfo).then(() => {

                    })
                }
            })
        },
        getUploadHeader() {
            return {
                'token': this.$store.getters['user/isLogin']
            }
        },
        getUploadUrl() {
            return `${process.env.VUE_APP_API_ROOT}/user/file/upload`
        },
        getBindWxQrCode() {
            this.$api.get('/user/bind/wx/qrcode').then(res => {
                this.bindWxQrcode = res.data
            })
        },
        updateUserPwdHandle() {
            this.$refs['updatePassWordForm'].validate(valid => {
                if (valid) {
                    this.$api.post('/user/update/password', this.userPwdForm).then(res => {
                        if (res.data) {
                            this.msgSuccess('修改成功')
                            this.queryUserInfo()
                        }
                    })
                } else {
                    return false
                }
            })

        },
        sendUpdateEmail() {
            this.$refs['updateEmailForm'].validateField('email', err => {
                if (!err) {
                    this.$api.get('/user/update-email/msg', {params: {email: this.userInfoForm.email}}).then(res => {
                        if (res.data) {
                            this.msgSuccess('发送成功,请去您的邮箱查看')
                            this.emailDialogVisible = false
                        }
                    })
                }
            })
        },
        sendUpdatePhoneNumber() {
            this.$refs['updatePhoneForm'].validateField('phoneNumber', err => {
                if (!err) {
                    this.$api.get(`/user/update-phone/code?phoneNumber=${this.userInfoForm.phoneNumber}`).then(() => {
                        this.msgSuccess('验证码发送成功，5分钟内有效')
                        let count = 60
                        let timer = setInterval(() => {
                            count--
                            this.phoneValidateCodeBtnText = count + 's后重新发送'
                            if (count == 0) {
                                this.phoneValidateCodeBtnText = '发送验证码'
                                clearInterval(timer)
                            }
                        }, 1000)
                    })
                }
            })
        },
        updateUserHandle() {
            this.$api.post('/user/update', this.userInfoForm).then(res => {
                if (res.data) {
                    this.msgSuccess('保存成功')
                    this.queryUserInfo()

                }
            })
        },
        // qq登录授权地址
        getQQLoginAuthorizeUrl() {
            let reUrl = getCurrentDomain() + '/redirect/bindqq'
            this.$api.get('/login/qq/authorize/url', {params: {redirectUri: reUrl}}).then(res => {
                this.qqLoginAuthorizeUrl = res.data
            })
        },
        redirectUrl(url) {
            window.open(url)
        },
        updateUserPhoneHandle() {
            this.$refs['updatePhoneForm'].validateField(['phoneNumber', 'code'], err => {
                if (!err) {
                    this.$api.post('/user/update/phone-number', this.userInfoForm).then(() => {
                        this.msgSuccess('修改成功')
                        this.queryUserInfo()
                    })
                }
            })
        },
        bindWxHandle() {
            this.bindWxDialogVisible = true
            this.bindWxTimer = setInterval(() => {
                this.$api.get('/user/current/detail').then(res => {
                    if (res.data) {
                        let {wxName} = res.data
                        if (wxName) {
                            this.msgSuccess('绑定成功')
                            clearInterval(this.bindWxTimer)
                            this.userInfo.wxName = wxName
                            this.bindWxDialogVisible = false
                        }
                    }
                })
            }, 5 * 1000)
        },
        cropUploadSuccess(res) {
            this.userInfoForm.avatar = res.data
            this.updateUserHandle()
        }
    }
}
</script>

<style lang="scss" scoped>
.member-container {
    display: flex;
    align-content: center;
    justify-content: center;
}
.title {
    color: rgba(16, 16, 16, 100);
    font-size: 16px;
    text-align: left;
    font-weight: bolder;
}
.member-box-card {
    margin-top: 20px;
    width: 1027px;
    height: 747px;
    table {
        color: #101010;
        font-size: 14px;
    }
    table tr {
        line-height: 30px;
    }
}
.account-info-view {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    .icon {
        width: 27px;
        height: 27px;
    }
    .account-icon-view {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-right: 20px;
    }
    .account-icon-view span {
        font-size: 12px;
    }
}
.account-avatar-view {
    width: 180px;
}

</style>
