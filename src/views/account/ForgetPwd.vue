<template>
    <div class="app-container">
        <div v-if="retrieveStep===1" class="pwd-container">
            <div style="width: 350px;">
                <h4 class="title">找回密码</h4>
                <el-tabs
                    v-model="retrieveType" class="login-form"
                >
                    <el-tab-pane label="手机找回" name="phone">
                        <el-form ref="phoneForm" :model="retrieveAccountForm" label-width="0px" :rules="phoneRules">
                            <el-form-item label="" prop="phoneNumber">
                                <el-input v-model="retrieveAccountForm.phoneNumber" placeholder="请输入手机号"
                                          autocomplete="off"
                                />
                            </el-form-item>
                            <el-form-item label="" prop="code">
                                <el-input v-model="retrieveAccountForm.code" style="width: 150px;" placeholder="请输入验证码"
                                          autocomplete="off"
                                />
                                <el-button style="margin-left: 20px;" type="primary" :disabled="emailValidateCodeBtn"
                                           @click="sendPhoneValidateCodeHandle"
                                >
                                    {{ emailValidateCodeBtnText }}
                                </el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" style="width: 100%;" @click="phoneRetrievePassWordHandle">
                                    找回密码
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="邮箱找回" name="email">
                        <el-form ref="emailForm" status-icon :model="retrieveAccountForm"
                                 label-width="0px"
                        >
                            <el-form-item label="" prop="email">
                                <el-input v-model="retrieveAccountForm.email" placeholder="请输入邮箱" autocomplete="off" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" style="width: 100%;" @click="sendEmailValidateHandle">
                                    找回密码
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div v-if="retrieveStep===2" class="reset-pwd-view">
            <div style="width: 350px;">
                <h4 class="title">重置密码</h4>
                <div class="rest-pwd-user-view">
                    <i class="el-icon-user" />
                    <span>{{ resetAccount }}</span>
                </div>
                <el-form ref="resetPwdForm" :model="resetPwdForm" label-width="0px" :rules="pwdRules">
                    <el-form-item label="" prop="password">
                        <el-input v-model="resetPwdForm.password" show-password placeholder="请输入密码"
                                  autocomplete="off"
                        />
                    </el-form-item>
                    <el-form-item label="" prop="rePassword">
                        <el-input v-model="resetPwdForm.rePassword" show-password placeholder="请再次输入密码"
                                  autocomplete="off"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="width: 100%;" @click="resetPasswordHandle">
                            提交
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <Verify
            ref="verify"
            :mode="'pop'"
            :captcha-type="'blockPuzzle'"
            :img-size="{ width: '330px', height: '155px' }"
            @success="verifySuccessHandle"
        />
    </div>
</template>

<script>
// 引入组件
import Verify from '@/components/verifition/Verify'

export default {
    name: 'RetrievePwd',
    components: {
        Verify
    },
    data() {
        let validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('密码最少为6位数'))
            } else {
                if (this.resetPwdForm.rePassword !== '') {
                    this.$refs.restPwdForm.validateField('rePassword')
                }
                callback()
            }
        }
        let validateRePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.resetPwdForm.rePassword) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            retrieveStep: 1,
            retrieveType: 'phone',
            emailValidateCodeBtn: false,
            emailValidateCodeBtnText: '发送验证码',
            retrieveAccountForm: {
                phoneNumber: '',
                email: '',
                password: ''
            },
            resetAccount: '',
            resetPwdForm: {
                code: '',
                password: '',
                rePassword: ''
            },
            phoneRules: {
                phoneNumber: [
                    {required: true, trigger: 'blur', message: '请输入手机号'},
                    {
                        pattern: /^(?:0|86|\+86)?1[3456789]\d{9}$/,
                        message: '请输入正确的手机号'
                    }
                ],
                code: {required: true, trigger: 'blur', message: '请输入验证码'}
            },
            pwdRules: {
                password: [{required: true, trigger: 'blur', validator: validatePassword}],
                rePassword: [{required: true, trigger: 'blur', validator: validateRePass}]
            }
        }
    },
    created() {
        let code = this.$route.query.code
        if (code) {
            this.retrieveStep = 2
        }
    },
    methods: {
        sendPhoneValidateCodeHandle() {
            this.$refs['phoneForm'].validateField('phoneNumber', err => {
                if (!err) {
                    this.$refs.verify.show()
                }
            })
        },
        sendPhoneValidateCode() {
            let slideCode = params.captchaVerification
            this.$refs['phoneForm'].validateField('phoneNumber', err => {
                if (!err) {
                    this.emailValidateCodeBtn = true
                    this.$api.get(`/retrieve/password/phone/code?phoneNumber=${this.retrieveAccountForm.phoneNumber}&slideCode=${slideCode}`).then(() => {
                        this.msgSuccess('验证码发送成功，5分钟内有效')
                        this.emailValidateCodeBtn = true
                        let count = 60
                        let timer = setInterval(() => {
                            count--
                            this.emailValidateCodeBtnText = count + 's后重新发送'
                            if (count == 0) {
                                this.emailValidateCodeBtnText = '发送验证码'
                                this.emailValidateCodeBtn = false
                                clearInterval(timer)
                            }
                        }, 1000)
                    })
                }
            })
        },
        phoneRetrievePassWordHandle() {
            this.$refs['phoneForm'].validate(valid => {
                if (valid) {
                    this.$api.post('/retrieve/password/check/phone-code', this.retrieveAccountForm).then(res => {
                        if (res.data) {
                            this.msgSuccess('验证成功')
                            this.resetPwdForm.code = res.data
                            this.resetAccount = this.retrieveAccountForm.phoneNumber
                            this.retrieveStep = 2
                        }
                    })
                }
            })
        },
        resetPasswordHandle() {
            this.$refs['resetPwdForm'].validate(valid => {
                if (valid) {
                    this.$api.post('/retrieve/password/reset', this.resetPwdForm).then(res => {
                        if (res.data) {
                            this.msgSuccess('密码重置成功，快去登录吧')
                            this.$router.push({path: '/login'})
                        }
                    })
                }
            })
        },
        sendEmailValidateHandle() {
            this.$refs['emailForm'].validateField('email', err => {
                if (!err) {
                    this.$refs.verify.show()
                }
            })
        },
        sendEmailValidate() {
            this.$refs['emailForm'].validateField('email', err => {
                if (!err) {
                    this.$refs.verify.show()
                }
            })
        },
        verifySuccessHandle(params) {
            if (this.retrieveType == 'phone') {
                this.sendPhoneValidateCode(params)
            } else {
                this.sendEmailValidate(params)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.app-container {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
}
.title {
    color: rgba(16, 16, 16, 100);
    font-size: 28px;
    text-align: center;
}
.pwd-container {
    width: 20%;
    height: 50%;
    align-content: center;
}
.rest-pwd-user-view {
    line-height: 80px;
    height: 100px;
    padding: 10px;
    .el-icon-user {
        display: inline-block;
        width: 20%;
        color: #717171;
        text-align: left;
        font-size: 50px;
    }
    span {
        color: #4c4c4c;
        display: inline-block;
        text-align: center;
        font-size: 19px;
        width: 80%;
    }
}
</style>
