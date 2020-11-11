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
                        <el-form ref="form" label-position="top" size="small" :model="account"
                                 class="account-login-form"
                        >
                            <el-form-item label="手机号/邮箱登录">
                                <el-input v-model="account.username" placeholder="请输入手机号/邮箱" />
                            </el-form-item>
                            <el-form-item label="密码">
                                <el-input v-model="account.password" placeholder="请输入密码" show-password />
                            </el-form-item>
                            <el-form-item label="">
                                <el-radio v-model="agreeProtocol" label="" />
                                <span class="protocol-tip">我已同意</span>
                                <el-link :underline="false" type="primary" class="protocol-tip">《TDuck用户服务协议》</el-link>
                                <el-link :underline="false" type="primary" class="protocol-tip" style="float: right;">忘记密码？</el-link>
                            </el-form-item>
                            <el-form-item>
                                <el-button style="width: 100%;" type="primary">登录</el-button>
                            </el-form-item>
                            <el-form-item style="text-align: center;">
                                <span class="protocol-tip">使用第三方登录 或 </span>
                                <el-link :underline="false" type="primary" class="protocol-tip" @click="()=>{this.formType='reg'}">立即注册</el-link>
                                <div class="other-login">
                                    <svg-icon name="loginQQ" class="other-login-icon" />
                                    <svg-icon name="loginWx" class="other-login-icon" />
                                </div>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
                <el-tabs v-if="formType==='reg'" v-model="regType" class="login-form" style="width: 300px;"
                         @tab-click="loginTypeHandleClick"
                >
                    <el-tab-pane label="手机号注册" name="regPhone">
                        <el-form ref="form" :model="account" label-width="0px">
                            <el-form-item label="">
                                <el-input v-model="account.username" placeholder="请输入手机号" />
                            </el-form-item>
                            <el-form-item label="">
                                <el-input v-model="account.password" placeholder="请输入密码" />
                            </el-form-item>
                            <el-form-item label="">
                                <el-input v-model="account.code" style="width: 150px;" placeholder="请输入验证码" />
                                <el-button style="margin-left: 20px;" type="primary">发送验证码</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" width: 100%;>登录</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="邮箱注册" name="regEmail">
                        <el-form ref="form" :model="account" label-width="0px">
                            <el-form-item label="">
                                <el-input v-model="account.username" placeholder="请输入邮箱" />
                            </el-form-item>
                            <el-form-item label="">
                                <el-input v-model="account.password" placeholder="请输入密码" />
                            </el-form-item>
                            <el-form-item label="">
                                <el-input v-model="account.code" style="width: 150px;" placeholder="请输入验证码" />
                                <el-button style="margin-left: 20px;" type="primary">发送验证码</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" style="width: 100%;">确定</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <div style="display: flex; flex-direction: row;">
                        <el-link style="margin-left: 20px;">忘记密码</el-link>
                        <el-link style="margin-left: 20px;" @click="reigsterHandleClick">立即注册</el-link>
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
        return {
            loginType: 'wx',
            formType: 'reg',
            regType: 'regPhone',
            agreeProtocol: '',
            account: {
                username: '',
                password: ''
            },
            wxLoginQrCode: 'http://qiniu.smileyi.top/20191213/9f217b754ad44f0caaa83040ce62fe93.png'
        }
    },
    methods: {
        loginTypeHandleClick() {
        },
        reigsterHandleClick() {
        },
        login() {
            this.$store.dispatch('token/login').then(() => {
                // 登录成功后路由跳回
                if (this.$route.query.redirect) {
                    this.$router.replace({
                        path: this.$route.query.redirect
                    })
                } else {
                    if (window.history.length <= 1) {
                        this.$router.push({path: '/'})
                    } else {
                        this.$router.go(-1)
                    }
                }
            })
        }
    }
}
</script>
<style scoped>
.loginBody {
    /* border: solid thin black; */
    margin: 70px 0 0 0;
}
.loginBackImg {
    width: 100%;
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
    margin-bottom: 5px;
}
.account-login-form .el-radio {
    margin-right: 0;
}
.account-login-form .protocol-tip {
    font-size: 12px;
}
</style>
