<template>
    <div id="login">
        <el-row class="loginBody">
            <el-col :span="12">
                <img class="loginBackImg" src="http://qiniu.smileyi.top/login-banner">
            </el-col>
            <el-col :span="12">
                <el-tabs v-if="formType=='login'" v-model="loginType" class="login-form-tab" style="width: 320px;"
                         @tab-click="loginTypeHandleClick"
                >
                    <el-tab-pane label="微信扫码登录" name="wx">
                        <div class="wx-login">
                            <div style="text-align: center;">
                                <img class="qrcode" :src="wxLoginQrCode">
                            </div>
                            <div style="text-align: center;">
                                <el-link icon="el-icon-refresh-left" :underline="false">刷新二维码</el-link>
                            </div>
                            <el-divider style="width: 100px;" />
                            <div style="display: flex; flex-direction: row;">
                                <el-link style="margin-left: 20px;">忘记密码</el-link>
                                <el-link style="margin-left: 20px;" @click="()=>{this.formType='reg'}">立即注册</el-link>
                                <div class="other-login">
                                    <svg-icon name="loginQQ" class="other-login-icon" />
                                    <svg-icon name="loginWx" class="other-login-icon" />
                                </div>
                            </div>
                            <el-divider style="width: 100px;" />
                            <p class="login-tip">关于TDuckCloud登录</p>
                            <p class="login-tip">
                                若微信扫码失败，请打开 微信授权页面 登录
                                若QQ登录填鸭云异常，可查阅 帮助文档
                                若因微信、QQ、公众号冻结或账号密码找回失败等无法登录，可 自助申请 登录账号
                            </p>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="账号密码登录" name="account">
                        <el-form ref="accountLoginForm" label-position="top" size="small" :model="accountForm" :rules="accountLoginRules"
                                 class="account-login-form" status-icon hide-required-asterisk
                        >
                            <el-form-item label="手机号/邮箱登录" prop="account">
                                <el-input v-model="accountForm.account" placeholder="请输入手机号/邮箱" autocomplete="off" />
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input v-model="accountForm.password" placeholder="请输入密码" autocomplete="off"
                                          show-password
                                />
                            </el-form-item>
                            <el-form-item label="">
                                <el-radio v-model="agreeProtocol" label="" />
                                <span class="protocol-tip">我已同意</span>
                                <el-link :underline="false" type="primary" class="protocol-tip">《TDuck用户服务协议》</el-link>
                                <el-link :underline="false" type="primary" class="protocol-tip" style="float: right;">
                                    忘记密码？
                                </el-link>
                            </el-form-item>
                            <el-form-item>
                                <el-button style="width: 100%;" type="primary" @click="loginHandle">登录</el-button>
                            </el-form-item>
                            <el-form-item style="text-align: center;">
                                <span class="protocol-tip">使用第三方登录 或 </span>
                                <el-link :underline="false" type="primary" class="protocol-tip"
                                         @click="()=>{this.formType='reg'}"
                                >
                                    立即注册
                                </el-link>
                                <div class="other-login">
                                    <svg-icon name="loginQQ" class="other-login-icon" />
                                    <svg-icon name="loginWx" class="other-login-icon" />
                                </div>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
                <el-tabs
                    v-if="formType==='reg'" v-model="regType" class="login-form" style="width: 300px;"
                    @tab-click="registerHandleClick"
                >
                    <el-tab-pane label="手机号注册" name="regPhone">
                        <el-form ref="form" :model="accountForm" label-width="0px">
                            <el-form-item label="">
                                <el-input v-model="accountForm.username" placeholder="请输入手机号" autocomplete="off" />
                            </el-form-item>
                            <el-form-item label="">
                                <el-input v-model="accountForm.password" show-password placeholder="请输入密码"
                                          autocomplete="off"
                                />
                            </el-form-item>
                            <el-form-item label="">
                                <el-input v-model="accountForm.code" style="width: 150px;" placeholder="请输入验证码"
                                          autocomplete="off"
                                />
                                <el-button style="margin-left: 20px;" type="primary">发送验证码</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" style="width: 100%;">登录</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="邮箱注册" name="regEmail">
                        <el-form ref="emailRegForm" status-icon :rules="emailRegRules" :model="accountForm"
                                 label-width="0px"
                        >
                            <el-form-item label="" prop="email">
                                <el-input v-model="accountForm.email" placeholder="请输入邮箱" autocomplete="off" />
                            </el-form-item>
                            <el-form-item label="" prop="password">
                                <el-input v-model="accountForm.password" show-password placeholder="请输入密码"
                                          autocomplete="off"
                                />
                            </el-form-item>
                            <el-form-item label="" prop="code">
                                <el-input v-model="accountForm.code" oninput="value=value.replace(/[^\d]/g,'')"
                                          style="width: 150px;" maxlength="4" placeholder="请输入验证码"
                                          autocomplete="off"
                                />
                                <el-button style="margin-left: 20px;" :disabled="validateCodeBtn" type="primary"
                                           @click="sendEmailCodeHandle"
                                >
                                    {{ validateCodeBtnText }}
                                </el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" style="width: 100%;" @click="emailRegHandle">确定</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <div style="display: flex; flex-direction: row;">
                        <el-link style="margin-left: 20px;">忘记密码</el-link>
                        <el-link style="margin-left: 20px;" @click="registerHandleClick">立即注册</el-link>
                        <div class="other-login">
                            <svg-icon name="loginQQ" class="other-login-icon" />
                            <svg-icon name="loginWx" class="other-login-icon" />
                        </div>
                    </div>
                </el-tabs>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    name: 'Login',
    data() {
        const validatePassword = (rule, value, callback) => {
            // /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{10,20}$/
            if (value.length < 6) {
                callback(new Error('密码最少为6位数'))
            } else {
                callback()
            }
        }
        const validateAccount = (rule, value, callback) => {
            // /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{10,20}$/
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
            validateCodeBtn: false,
            validateCodeBtnText: '发送验证码',
            formType: 'login',
            regType: 'regPhone',
            agreeProtocol: '',
            emailRegRules: {
                email: [
                    {required: true, trigger: 'blur', message: '请输入邮箱'},
                    {
                        pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                        message: '请输入正确的邮箱'
                    }
                ],
                password: [{required: true, trigger: 'blur', validator: validatePassword}],
                code: {required: true, trigger: 'blur', message: '请输入验证码'}
            },
            accountLoginRules: {
                account: [
                    {required: true, trigger: 'blur', message: '请输入账号'}, {trigger: 'blur', validator: validateAccount}],
                password: [{required: true, trigger: 'blur', validator: validatePassword}]
            },
            accountForm: {
                email: '',
                password: ''
            },
            wxLoginQrCode: 'http://qiniu.smileyi.top/20191213/9f217b754ad44f0caaa83040ce62fe93.png'
        }
    },
    methods: {
        loginTypeHandleClick() {
        },
        registerHandleClick() {
        },
        sendEmailCodeHandle() {
            this.$refs.emailRegForm.validateField('email', err => {
                if (!err) {
                    this.validateCodeBtn = true
                    this.$api.get(`/user/send-email-code?email=${this.account.email}`).then(() => {
                        this.msgSuccess('验证码发送成功，5分钟内有效')
                        this.validateCodeBtn = true
                        let count = 60
                        let timer = setInterval(() => {
                            count--
                            this.validateCodeBtnText = count + 's后重新发送'
                            if (count == 0) {
                                this.validateCodeBtnText = '发送验证码'
                                clearInterval(timer)
                            }
                        }, 1000)
                    })
                }
            })
        },
        emailRegHandle() {
            this.$refs['emailRegForm'].validate(valid => {
                if (valid) {
                    this.$api.post('/user/email-register', this.accountForm).then(() => {
                        this.msgSuccess('注册成功，快去登录吧')
                        setTimeout(() => {
                            this.formType = 'login'
                            this.loginType = 'account'
                        }, 1000)
                    })
                } else {
                    return false
                }
            })
        },
        loginHandle() {
            this.$refs['accountLoginForm'].validate(valid => {
                if (valid) {
                    this.$api.post('/user/account-login', this.accountForm).then(res => {
                        this.msgSuccess('登录成功')
                        this.$store.dispatch('user/login', res.data).then(() => {
                            // 登录成功后路由跳回
                            // eslint-disable-next-line no-debugger
                            debugger
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
                    })
                } else {
                    return false
                }
            })
        }
    }
}
</script>
<style scoped>
.loginBody {
    margin: 70px 0 0 0;
}
.loginBackImg {
    left: 271px;
    top: 353px;
    width: 489px;
    height: 447px;
}
.login-form-tab {
    margin-left: 100px;
    height: 500px;
    width: 520px;
    .wx-login {
        display: flex;
        align-content: center;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .qrcode {
            margin: 20px;
        }
    }
}
.other-login {
    margin-left: auto;
}
.login-tip {
    color: rgba(16, 16, 16, 1);
    font-size: 13px;
    font-weight: 400;
    text-align: left;
    line-height: 20px;
}
.account-login-form .el-form-item--small.el-form-item {
    margin-bottom: 8px;
}
.account-login-form .el-radio {
    margin-right: 0;
}
.account-login-form .protocol-tip {
    font-size: 12px;
}
</style>
