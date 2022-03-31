<template>
    <div class="login-container">
        <div class="logo-banner">
            <img src="@/assets/images/logo_banner.png">
        </div>
        <div class="logo-content">
            <span class="hello">Hello ，</span>
            <span class="tips">欢迎使用Tduck！</span>
            <el-tabs
                v-if="formType == 'login'"
                v-model="loginType"
                class="login-form-tab"
            >
                <el-tab-pane v-if="enableWx" label="微信扫码登录" name="wx">
                    <div class="wx-login">
                        <div class="flex-center">
                            <el-image
                                v-loading="wxQrCodeLoading"
                                :src="wxLoginQrCode"
                                class="wx-login-qrcode"
                                fit="fill"
                                @load="
                                    e => {
                                        this.wxQrCodeLoading = false
                                    }
                                "
                            />
                        </div>
                        <div class="text-center">
                            <el-link
                                :underline="false"
                                icon="el-icon-refresh-left"
                                @click="getLoginWxQrCode"
                            >
                                刷新二维码
                            </el-link>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="账号密码登录" name="account">
                    <el-form
                        ref="accountLoginForm"
                        :model="accountForm"
                        :rules="accountLoginRules"
                        class="account-login-form"
                        hide-required-asterisk
                        label-position="top"
                        size="small"
                        status-icon
                        @keyup.enter.native="loginHandle"
                    >
                        <el-form-item prop="account">
                            <el-input
                                v-model="accountForm.account"
                                autocomplete="off"
                                placeholder="请输入手机号/邮箱"
                                prefix-icon="el-icon-user-solid"
                            />
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input
                                v-model="accountForm.password"
                                autocomplete="off"
                                placeholder="请输入密码"
                                prefix-icon="el-icon-lock"
                                show-password
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="loginHandle">
                                登录
                            </el-button>
                            <el-link
                                class="ml-20 link-btn"
                                @click="toForgetPwdHandle"
                            >
                                忘记密码
                            </el-link>
                            <el-link
                                class="ml-20 link-btn"
                                @click="formType = 'reg'"
                            >
                                立即注册
                            </el-link>
                        </el-form-item>
                        <div class="other-login">
                            <span @click="redirectUrl(qqLoginAuthorizeUrl)">
                                <svg-icon
                                    class="other-login-icon"
                                    name="loginQQ"
                                />
                            </span>
                        </div>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
            <register v-else @success="registerSuccessHandle" />
            <p class="desc">关于TDuckApp登录</p>
            <p class="desc">
                若微信扫码失败，请打开 微信授权页面 登录 若QQ登录填鸭云异常，
                可查阅 帮助文档 若因微信、QQ、公众号冻结或账号密码找回失败等
                无法登录，可 自助申请 登录账号
            </p>
        </div>
    </div>
</template>

<script>
import { getCurrentDomain } from '@/utils'
// 引入组件
import constants from '@/utils/constants'
import Register from '../register/index.vue'

export default {
    name: 'Login',
    components: {
        Register
    },
    data() {
        const validateAccount = (rule, value, callback) => {
            const reg1 =
                /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
            const reg2 = /^(?:0|86|\+86)?1[3456789]\d{9}$/
            if (reg1.test(value) || reg2.test(value)) {
                callback()
            } else {
                callback(new Error('请输入正确的账号'))
            }
        }
        return {
            formType: 'login',
            loginType: 'wx',
            agreeProtocol: '',
            accountLoginRules: {
                account: [
                    { required: true, trigger: 'blur', message: '请输入账号' },
                    { trigger: 'blur', validator: validateAccount }
                ],
                password: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入新密码'
                    },
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
            const self = this
            this.getLoginWxQrCode()
            this.refreshWxQrcodeTimer = setInterval(() => {
                if (self.loginType == 'account') {
                    // 如果是账号登录模式就暂停轮询
                    return
                }
                this.getLoginWxQrCode()
            }, 5 * 60 * 1000)
            this.wxQrcodeResultTimer = setInterval(() => {
                if (self.loginType == 'account') {
                    // 如果是账号登录模式就暂停轮询
                    return
                }
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
            this.$router.push({ path: '/forget/password' })
        },
        // qq登录授权地址
        getQQLoginAuthorizeUrl() {
            let reUrl = getCurrentDomain() + '/redirect/qqlogin'
            this.$api
                .get('/login/qq/authorize/url', {
                    params: { redirectUri: reUrl }
                })
                .then(res => {
                    this.qqLoginAuthorizeUrl = res.data
                })
        },
        redirectUrl(url) {
            location.href = url
        },
        getLoginWxQrCodeResult() {
            this.$api
                .get('/login/wx/qrcode/result', {
                    params: { loginId: this.wxLoginId }
                })
                .then(res => {
                    if (res.data) {
                        this.loginSuccessHandle(res.data)
                    }
                })
        },
        loginSuccessHandle(data) {
            this.msgSuccess('登录成功')
            this.$store.dispatch('user/login', data).then(() => {
                // 重置状态
                this.$store
                    .dispatch('global/loginExpired', false)
                    .then(() => {})
                // 登录成功后路由跳回
                if (this.$route.query.redirect) {
                    this.$router.replace({
                        path: this.$route.query.redirect
                    })
                } else {
                    if (window.history.length <= 1) {
                        this.$router.push({ path: '/home' })
                    } else {
                        this.$router.push({ path: '/home' })
                    }
                }
            })
        },
        registerSuccessHandle() {
            this.formType = 'login'
            this.loginType = 'account'
        },
        loginHandle() {
            this.$refs['accountLoginForm'].validate(valid => {
                if (valid) {
                    this.$api
                        .request({
                            url: '/login/account',
                            method: 'post',
                            data: this.accountForm
                        })
                        .then(res => {
                            this.loginSuccessHandle(res.data)
                        })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.login-container {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
}

.logo-banner {
    width: 50%;

    img {
        width: 100%;
    }
}

.logo-content {
    width: 400px;
    margin-left: 100px;

    .hello {
        font-size: 40px;
        font-weight: bold;
        color: #10141c;
        line-height: 134px;
    }

    .wx-login-qrcode {
        width: 192px;
        height: 192px;
        border-radius: 50px;
    }

    .tips {
        font-size: 21px;
        font-weight: bold;
        color: #10141c;
        line-height: 134px;
    }

    .desc {
        font-size: 14px;
        font-weight: 400;
        color: #c0c4cc;
        line-height: 18px;
    }

    .login-form-tab {
        width: 300px;
    }
}

.other-login-icon {
    font-size: 25px;
    cursor: pointer;
}

.logo-content ::v-deep.el-tabs__nav-wrap::after {
    position: static !important;
}

.logo-content ::v-deep.el-tabs__active-bar {
    width: 59px !important;
    height: 7px !important;
    border-radius: 4px !important;
    left: 5% !important;
    background-color: #d8d8d8 !important;
}

.logo-tabs ::v-deep.el-tabs__item.is-active {
    color: #10141c !important;
}

::v-deep .el-input {
    height: 39px !important;
    line-height: 39px !important;
}

.link-btn {
    font-size: 12px !important;
}

::v-deep .el-input__inner {
    height: 39px !important;
    line-height: 39px !important;
    background: #f2f2f2 !important;
    border: none;
}

::v-deep .el-button {
    background: #408efc;
    border-radius: 10px;
    width: 145px;
}
</style>
