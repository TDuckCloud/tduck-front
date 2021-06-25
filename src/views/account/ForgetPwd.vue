<template>
    <div class="app-container">
        <div v-if="retrieveStep===1" class="pwd-container">
            <div>
                <img class="header-logo-img" src="@/assets/images/indexLogo.svg"
                     @click="$router.push({path:'/'})"
                >
                <h4 class="title">找回密码</h4>
                <el-tabs
                    v-model="retrieveType"
                    class="login-form"
                >
                    <el-tab-pane label="手机找回" name="phone">
                        <el-form ref="phoneForm" :model="retrieveAccountForm" :rules="phoneRules" label-width="0px">
                            <el-form-item prop="phoneNumber">
                                <el-input
                                    v-model="retrieveAccountForm.phoneNumber"
                                    autocomplete="off"
                                    placeholder="请输入手机号"
                                />
                            </el-form-item>
                            <el-form-item label="" prop="code">
                                <el-input v-model="retrieveAccountForm.code" class="width50" autocomplete="off" placeholder="请输入验证码" />
                                <el-button
                                    :disabled="emailValidateCodeBtn"
                                    class="ml-20"
                                    type="primary"
                                    @click="sendPhoneValidateCodeHandle"
                                >
                                    {{ emailValidateCodeBtnText }}
                                </el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button class="width-full" type="primary" @click="phoneRetrievePassWordHandle">
                                    找回密码
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="邮箱找回" name="email">
                        <el-form
                            ref="emailForm"
                            :model="retrieveAccountForm"
                            :rules="emailRules"
                            label-width="0px"
                            status-icon
                        >
                            <el-form-item label="" prop="email">
                                <el-input v-model="retrieveAccountForm.email" autocomplete="off" placeholder="请输入邮箱" />
                            </el-form-item>
                            <el-form-item>
                                <el-button class="width-full" type="primary" @click="sendEmailValidateHandle">
                                    找回密码
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div v-if="retrieveStep===2" class="reset-pwd-view">
            <img class="header-logo-img" src="@/assets/images/indexLogo.svg"
                 @click="$router.push({path:'/'})"
            >
            <div>
                <h4 class="title">重置密码</h4>
                <div class="rest-pwd-user-view">
                    <i class="el-icon-user" />
                    <span>{{ resetAccount }}</span>
                </div>
                <el-form ref="resetPwdForm" :model="resetPwdForm" :rules="pwdRules" label-width="0px">
                    <el-form-item label="" prop="password">
                        <el-input
                            v-model="resetPwdForm.password"
                            autocomplete="off"
                            placeholder="请输入密码"
                            show-password
                        />
                    </el-form-item>
                    <el-form-item label="" prop="rePassword">
                        <el-input
                            v-model="resetPwdForm.rePassword"
                            autocomplete="off"
                            placeholder="请再次输入密码"
                            show-password
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="resetPasswordHandle">
                            提交
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div v-if="retrieveStep==3" class="msg-view">
            <p>
                我们已向你的邮箱中发送了重置密码的邮件，请查看并点击邮件中的链接。
                没有收到邮件？请检查您的垃圾邮件或者重新发送
            </p>
        </div>
    </div>
</template>

<script>
import constants from '@/utils/constants'

export default {
    name: 'RetrievePwd',
    data() {
        const validateRePass = (rule, value, callback) => {
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
            emailSendSuccess: true,
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
                    { required: true, trigger: 'blur', message: '请输入手机号' },
                    {
                        pattern: /^(?:0|86|\+86)?1[3456789]\d{9}$/,
                        message: '请输入正确的手机号'
                    }
                ],
                code: { required: true, trigger: 'blur', message: '请输入验证码' }
            },
            emailRules: {
                email: [
                    { required: true, trigger: 'blur', message: '请输入邮箱' },
                    {
                        pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                        message: '请输入正确的邮箱'
                    }
                ]
            },
            pwdRules: {
                password: [
                    { required: true, trigger: 'blur', message: '请输入新密码' },
                    {
                        pattern: constants.passwordReg,
                        message: constants.passwordRegDesc
                    }
                ],
                rePassword: [{ required: true, trigger: 'blur', validator: validateRePass }]
            }
        }
    },
    created() {
        const code = this.$route.query.code
        if (code) {
            this.resetAccount = this.$route.query.email
            this.resetPwdForm.code = code
            this.retrieveStep = 2
        }
    },
    methods: {
        sendPhoneValidateCodeHandle() {
            this.$refs['phoneForm'].validateField('phoneNumber', err => {
                if (!err) {
                    this.sendPhoneValidateCode()
                }
            })
        },
        sendPhoneValidateCode() {
            const phoneNumber = this.retrieveAccountForm.phoneNumber
            this.$refs['phoneForm'].validateField('phoneNumber', err => {
                if (!err) {
                    this.emailValidateCodeBtn = true
                    this.$api.request({
                        url: '/retrieve/password/phone/code',
                        method: 'get',
                        params: { phoneNumber: phoneNumber }
                    }).then(() => {
                        this.msgSuccess('验证码发送成功，5分钟内有效')
                        this.emailValidateCodeBtn = true
                        let count = 60
                        const timer = setInterval(() => {
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
                            setTimeout(() => {
                                this.$router.push({ path: '/login' })
                            }, 2000)
                        }
                    })
                }
            })
        },
        sendEmailValidateHandle() {
            this.$refs['emailForm'].validateField('email', err => {
                if (!err) {
                    this.sendEmailValidate()
                }
            })
        },
        sendEmailValidate() {
            this.$refs['emailForm'].validate(valid => {
                if (valid) {
                    this.$api.request({
                        url: '/retrieve/password/email',
                        method: 'get',
                        params: { email: this.retrieveAccountForm.email }
                    }).then(() => {
                        this.retrieveStep = 3
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixin.scss';

.app-container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}

.header-logo-img {
  width: 120px;
  height: 35px;
  float: left;
  margin-left: 25px;
  cursor: pointer;
}
.title {
  color: rgba(16, 16, 16, 100);
  font-size: 28px;
  text-align: center;
}

.pwd-container {
  width: 25%;
  height: 50%;
  align-content: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 50px;
  div {
    width: 350px;
  }
}

.reset-pwd-view {
  div {
    width: 350px;
    padding: 50px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
  }
}

.msg-view {
  @include position-center(xy);

  text-align: center;
  color: #929292;
  width: 30%;
}
</style>
