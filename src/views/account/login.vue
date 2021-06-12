<template>
    <div class="login-container">
        <el-row class="login-body">
            <el-col :offset="4" :span="5">
                <img class="login-img" src="@/assets/images/5b968a75b5e42.png">
            </el-col>
            <el-col :offset="3" :span="10">
                <el-tabs v-if="formType=='login'"
                         v-model="loginType" class="login-form-tab"
                >
                    <el-tab-pane v-if="enableWx" label="微信扫码登录" name="wx">
                        <div class="wx-login">
                            <div>
                                <el-image
                                    v-loading="wxQrCodeLoading"
                                    :src="wxLoginQrCode"
                                    class="wx-login-qrcode"
                                    fit="fill"
                                    @load="(e)=>{
                                        this.wxQrCodeLoading=false
                                    }"
                                />
                            </div>
                            <div>
                                <el-link :underline="false"
                                         icon="el-icon-refresh-left"
                                         @click="getLoginWxQrCode"
                                >
                                    刷新二维码
                                </el-link>
                            </div>
                            <el-divider class="divider-width" />
                            <el-row>
                                <el-col :span="6">
                                    <el-link class="login-tip" @click="toForgetPwdHandle">忘记密码</el-link>
                                </el-col>
                                <el-col :span="6">
                                    <el-link class="login-tip">
                                        <el-link class="login-tip" @click="()=>{this.formType='reg'}">立即注册</el-link>
                                    </el-link>
                                </el-col>
                                <el-col :offset="3" :span="9">
                                    <div class="other-login">
                                        <span @click="redirectUrl(qqLoginAuthorizeUrl)">
                                            <svg-icon class="other-login-icon" name="loginQQ" />
                                        </span>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-divider class="divider-width" />
                            <p class="login-tip">关于TDuckApp登录</p>
                            <p class="login-tip">
                                若微信扫码失败，请打开 微信授权页面 登录
                                若QQ登录填鸭云异常，可查阅 帮助文档
                                若因微信、QQ、公众号冻结或账号密码找回失败等无法登录，可 自助申请 登录账号
                            </p>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="账号密码登录" name="account">
                        <el-form ref="accountLoginForm" :model="accountForm" :rules="accountLoginRules"
                                 class="account-login-form"
                                 hide-required-asterisk
                                 label-position="top"
                                 size="small"
                                 status-icon
                                 @keyup.enter.native="loginHandle"
                        >
                            <el-form-item label="手机号/邮箱登录" prop="account">
                                <el-input v-model="accountForm.account" autocomplete="off" placeholder="请输入手机号/邮箱" />
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input v-model="accountForm.password" autocomplete="off" placeholder="请输入密码"
                                          show-password
                                />
                            </el-form-item>
                            <el-form-item label="">
                                <el-row align="middle" type="flex">
                                    <el-col :span="3">
                                        <el-radio v-model="agreeProtocol" label="" />
                                    </el-col>
                                    <el-col :span="4">
                                        <span class="protocol-tip">我已同意</span>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-link :underline="false" class="protocol-tip" type="primary">
                                            《TDuck用户服务协议》
                                        </el-link>
                                    </el-col>
                                    <el-col :offset="1" :span="6">
                                        <el-link :underline="false" class="protocol-tip" type="primary"
                                                 @click="toForgetPwdHandle"
                                        >
                                            忘记密码？
                                        </el-link>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item>
                                <el-button class="width-full" type="primary" @click="loginHandle">登录</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-row align="middle" type="flex">
                                    <el-col :offset="6" :span="8">
                                        <span class="protocol-tip">使用第三方登录 或 </span>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-link :underline="false" class="protocol-tip" type="primary"
                                                 @click="()=>{this.formType='reg'}"
                                        >
                                            立即注册
                                        </el-link>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :offset="8">
                                        <div class="other-login">
                                            <span @click="redirectUrl(qqLoginAuthorizeUrl)">
                                                <svg-icon class="other-login-icon" name="loginQQ" />
                                            </span>
                                            <svg-icon class="other-login-icon"
                                                      name="loginWx"
                                                      @click="()=>{
                                                          this.formType='login'
                                                          this.loginType='wx'
                                                      }"
                                            />
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
                <el-tabs
                    v-if="formType==='reg'" v-model="regType" class="register-form"
                >
                    <el-tab-pane label="手机号注册" name="regPhone">
                        <el-form ref="phoneRegForm" :model="accountForm" :rules="phoneRegRules" label-width="0px">
                            <el-form-item label="" prop="phoneNumber">
                                <el-input v-model="accountForm.phoneNumber" autocomplete="off" placeholder="请输入手机号" />
                            </el-form-item>
                            <el-form-item label="" prop="password">
                                <el-input v-model="accountForm.password" autocomplete="off" placeholder="请输入密码"
                                          show-password
                                />
                            </el-form-item>
                            <el-form-item label="" prop="code">
                                <el-input v-model="accountForm.code" autocomplete="off" class="code-input"
                                          placeholder="请输入验证码"
                                />
                                <el-button :disabled="phoneValidateCodeBtn" class="ml-20" type="primary"
                                           @click="sendPhoneCodeHandle"
                                >
                                    {{ phoneValidateCodeBtnText }}
                                </el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button class="width-full" type="primary" @click="phoneRegHandle">确定</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="邮箱注册" name="regEmail">
                        <el-form ref="emailRegForm" :model="accountForm" :rules="emailRegRules" label-width="0px"
                                 status-icon
                        >
                            <el-form-item label="" prop="email">
                                <el-input v-model="accountForm.email" autocomplete="off" placeholder="请输入邮箱" />
                            </el-form-item>
                            <el-form-item label="" prop="password">
                                <el-input v-model="accountForm.password" autocomplete="off" placeholder="请输入密码"
                                          show-password
                                />
                            </el-form-item>
                            <el-form-item label="" prop="code">
                                <el-input v-model="accountForm.code" autocomplete="off"
                                          class="code-input" maxlength="4" oninput="value=value.replace(/[^\d]/g,'')"
                                          placeholder="请输入验证码"
                                />
                                <el-button :disabled="emailValidateCodeBtn" class="ml-20" type="primary"
                                           @click="sendEmailCodeHandle"
                                >
                                    {{ emailValidateCodeBtnText }}
                                </el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button class="width-full" type="primary" @click="emailRegHandle">确定</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <div class="flex-row">
                        <el-link class="ml-20 link-btn" @click="toForgetPwdHandle">忘记密码</el-link>
                        <el-link class="ml-20 link-btn" @click="registerHandleClick">立即注册</el-link>
                        <div class="other-login">
                            <span @click="redirectUrl(qqLoginAuthorizeUrl)">
                                <svg-icon class="other-login-icon" name="loginQQ" />
                            </span>
                            <svg-icon class="other-login-icon"
                                      name="loginWx"
                                      @click="()=>{
                                          this.formType='login',
                                          this.loginType='wx'
                                      }"
                            />
                        </div>
                    </div>
                </el-tabs>
            </el-col>
        </el-row>
    </div>
</template>
<script>

import {getCurrentDomain} from '@/utils'
// 引入组件
import constants from '@/utils/constants'

export default {
    name: 'Login',
    data() {
        const validateAccount = (rule, value, callback) => {
            const reg1 = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
            const reg2 = /^(?:0|86|\+86)?1[3456789]\d{9}$/
            if (reg1.test(value) || reg2.test(value)) {
                callback()
            } else {
                callback(new Error('请输入正确的账号'))
            }
        }
        return {
            loginType: 'wx',
            emailValidateCodeBtn: false,
            emailValidateCodeBtnText: '发送验证码',
            phoneValidateCodeBtn: false,
            phoneValidateCodeBtnText: '发送验证码',
            formType: 'login',
            regType: 'regPhone',
            agreeProtocol: '',
            phoneRegRules: {
                phoneNumber: [
                    {required: true, trigger: 'blur', message: '请输入手机号'},
                    {
                        pattern: /^(?:0|86|\+86)?1[3456789]\d{9}$/,
                        message: '请输入正确的手机号'
                    }
                ],
                password: [
                    {required: true, trigger: 'blur', message: '请输入新密码'},
                    {
                        pattern: constants.passwordReg,
                        message: constants.passwordRegDesc
                    }
                ],
                code: {required: true, trigger: 'blur', message: '请输入验证码'}
            },
            emailRegRules: {
                email: [
                    {required: true, trigger: 'blur', message: '请输入邮箱'},
                    {
                        pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                        message: '请输入正确的邮箱'
                    }
                ],
                password: [
                    {required: true, trigger: 'blur', message: '请输入新密码'},
                    {
                        pattern: constants.passwordReg,
                        message: constants.passwordRegDesc
                    }
                ],
                code: {required: true, trigger: 'blur', message: '请输入验证码'}
            },
            accountLoginRules: {
                account: [
                    {required: true, trigger: 'blur', message: '请输入账号'}, {trigger: 'blur', validator: validateAccount}],
                password: [
                    {required: true, trigger: 'blur', message: '请输入新密码'},
                    {
                        pattern: constants.passwordReg,
                        message: constants.passwordRegDesc
                    }
                ]
            },
            accountForm: {
                email: '',
                phoneNumber: '',
                password: ''
            },
            wxQrCodeLoading: true,
            wxLoginQrCode: '',
            wxLoginId: '',
            refreshWxQrcodeTimer: null,
            wxQrcodeResultTimer: null,
            qqLoginAuthorizeUrl: ''
        }
    },
    computed: {
        enableWx() {
            return constants.enableWx
        }
    },
    watch: {},
    created() {
        if (constants.enableWx) {
            this.getLoginWxQrCode()
            this.refreshWxQrcodeTimer = setInterval(() => {
                this.getLoginWxQrCode()
            }, 5 * 60 * 1000)
            this.wxQrcodeResultTimer = setInterval(() => {
                this.getLoginWxQrCodeResult()
            }, 5 * 1000)
            this.getQQLoginAuthorizeUrl()
        } else {
            this.loginType = 'account'
        }
    },
    destroyed() {
        clearInterval(this.refreshWxQrcodeTimer)
        clearInterval(this.wxQrcodeResultTimer)
    },
    methods: {
        // 获取微信登录二维码
        getLoginWxQrCode() {
            this.wxQrCodeLoading = true
            this.$api.get('/login/wx/qrcode').then(res => {
                this.wxLoginQrCode = res.data.qrCodeUrl
                this.wxLoginId = res.data.loginId
            })
        },
        // 忘记密码
        toForgetPwdHandle() {
            this.$router.push({path: '/forget/password'})
        },
        // qq登录授权地址
        getQQLoginAuthorizeUrl() {
            let reUrl = getCurrentDomain() + '/redirect/qqlogin'
            this.$api.get('/login/qq/authorize/url', {params: {redirectUri: reUrl}}).then(res => {
                this.qqLoginAuthorizeUrl = res.data
            })
        },
        redirectUrl(url) {
            console.log(url)
            location.href = url
        },
        getLoginWxQrCodeResult() {
            this.$api.get('/login/wx/qrcode/result', {params: {loginId: this.wxLoginId}}).then(res => {
                if (res.data) {
                    this.loginSuccessHandle(res.data)
                }
            })
        },
        sendEmailCodeHandle() {
            this.$refs['emailRegForm'].validateField('email', err => {
                if (!err) {
                    this.emailValidateCodeBtn = true
                    this.$api.get(`/register/email/code?email=${this.accountForm.email}`).then(() => {
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
        sendPhoneCodeHandle() {
            this.$refs['phoneRegForm'].validateField('phoneNumber', err => {
                if (!err) {
                    this.phoneValidateCodeBtn = true
                    this.$api.get(`/register/phone/code?phoneNumber=${this.accountForm.phoneNumber}`).then(() => {
                        this.msgSuccess('验证码发送成功，5分钟内有效')
                        this.phoneValidateCodeBtn = true
                        let count = 60
                        let timer = setInterval(() => {
                            count--
                            this.phoneValidateCodeBtnText = count + 's后重新发送'
                            if (count == 0) {
                                this.phoneValidateCodeBtnText = '发送验证码'
                                this.phoneValidateCodeBtn = false
                                clearInterval(timer)
                            }
                        }, 1000)
                    })
                }
            })
        },
        phoneRegHandle() {
            this.$refs['phoneRegForm'].validate(valid => {
                if (valid) {
                    this.$api.post('/register/phone', this.accountForm).then(() => {
                        this.registerSuccessHandle()
                    })
                } else {
                    return false
                }
            })
        },
        emailRegHandle() {
            this.$refs['emailRegForm'].validate(valid => {
                if (valid) {
                    this.$api.post('/register/email', this.accountForm).then(() => {
                        this.registerSuccessHandle()
                    })
                } else {
                    return false
                }
            })
        },
        registerSuccessHandle() {
            this.msgSuccess('注册成功，快去登录吧')
            setTimeout(() => {
                this.formType = 'login'
                this.loginType = 'account'
            }, 1000)
        },
        loginSuccessHandle(data) {
            this.msgSuccess('登录成功')
            this.$store.dispatch('user/login', data).then(() => {
                // 重置状态
                this.$store.dispatch('global/loginExpired', false).then(() => {
                })
                // 登录成功后路由跳回
                if (this.$route.query.redirect) {
                    this.$router.replace({
                        path: this.$route.query.redirect
                    })
                } else {
                    if (window.history.length <= 1) {
                        this.$router.push({path: '/home'})
                    } else {
                        this.$router.push({path: '/home'})
                    }
                }
            })
        },
        loginHandle() {
            this.$api.request({
                url: '/login/account',
                method: 'post',
                data: this.accountForm
            }).then(res => {
                this.loginSuccessHandle(res.data)
            })
        }
    }
}
</script>
<style lang="scss" scoped>

.login-body {
    padding-top: 90px;
}
.login-img {
    width: 559px;
    height: 447px;
}
.login-form-tab {
    margin-left: 100px;
    height: 500px;
    width: 320px;
    text-align: center;
}
.wx-login-qrcode {
    width: 194px;
    height: 194px;
}
.other-login .other-login-icon {
    margin-left: 10px;
    cursor: pointer;
}
.login-tip {
    color: rgba(16, 16, 16, 1);
    font-size: 13px;
    font-weight: 400;
    text-align: left;
    line-height: 20px;
}
.register-form {
    width: 300px;
}
.divider-width {
    width: 300px;
}
.code-input {
    width: 180px;
}
.account-login-form {
    text-align: left;
}other-login-icon
.link-btn{
  font-size: 12px!important;
}
.account-login-form .el-form-item--small.el-form-item {
    margin-bottom: 8px;
}
.account-login-form .el-radio {
    margin-right: 0;
}
.wx-login .el-divider--horizontal {
    margin: 10px 0;
}
.account-login-form .protocol-tip {
    font-size: 12px;
    line-height: 40px;
}
.el-form-item--small .el-form-item__content,
.el-form-item--small .el-form-item__label {
    line-height: 40px;
}
</style>
