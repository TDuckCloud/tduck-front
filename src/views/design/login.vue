<template>
    <div>
        <el-container>
            <el-header style="height: 88px;" class="login-header">
                <el-row type="flex" align='middle' :gutter="24" style="height: 100%; line-height: 20px;">
                    <el-col :span="2" :offset="2">
                        <img class='logo' src="http://q2fgufcw6.bkt.clouddn.com/logo"/>
                    </el-col>
                    <el-col :span="3">
                        <div style="display: flex; justify-content: center; align-items: center;">
                            <p class="logo-text">TDUCK</p>
                            <p class="logo-text-sub">填鸭表单</p>
                        </div>
                    </el-col>
                    <el-col :span="1.5">
                        <router-link class="fun-nav" to="/"> 企业部署</router-link>
                    </el-col>
                    <el-col :span="1.5">
                        <router-link class="fun-nav" to="/2"> 开源版本</router-link>
                    </el-col>
                    <el-col :span="1.5">
                        <router-link class="fun-nav" to="/2"> 提出建议</router-link>
                    </el-col>
                    <el-col :span="11">
                    </el-col>
                </el-row>
            </el-header>
            <el-main class="login-main">
                <div class="content">
                    <div class="banner">
                        <img
                            style="width: 489px; height: 477px"
                            src="http://q2fgufcw6.bkt.clouddn.com/login-banner"/>
                    </div>
                    <div class="login-form">
                        <el-tabs style="width: 300px;" v-model="loginType" @tab-click="loginTypeHandleClick">
                            <el-tab-pane label="微信扫码登录" name="wx">
                                <div class="wx-login">
                                    <img class="qrcode" :src="wxLoginQrCode"/>
                                    <el-link icon="el-icon-refresh-left" :underline="false">刷新二维码</el-link>
                                    <el-divider></el-divider>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="账号密码登录" name="account">
                                <el-form ref="form" :model="account" label-width="80px">
                                    <el-form-item label="账号名称">
                                        <el-input v-model="account.username"></el-input>
                                    </el-form-item>
                                    <el-form-item label="密码">
                                        <el-input show-password  v-model="account.password"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" >登录</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <div style="display: flex;flex-direction: row;">
                                <el-link style="margin-left: 20px">忘记密码</el-link>
                                <el-link style="margin-left: 20px">立即注册</el-link>
                                <div class="other-login">
                                    <svg-icon class-name="other-login-icon" icon-class="loginQQ"/>
                                    <svg-icon class-name="other-login-icon" icon-class="loginWx"/>
                                </div>
                            </div>
                            <el-divider style="width: 100px"></el-divider>
                            <p class="login-tip">
                                关于TDuckCloud登录
                                若微信扫码失败，请打开 微信授权页面 登录
                                若QQ登录填鸭云异常，可查阅 帮助文档
                                若因微信、QQ、公众号冻结或账号密码找回失败等无法登录，可 自助申请 登录账号
                            </p>
                        </el-tabs>
                    </div>
                </div>
                <div class="footer">
                    <el-link icon="el-icon-user" style="color: #FFFFFF">关于我们</el-link>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>

    export default {
        name: 'designLogin',
        data() {
            return {
                loginType: 'wx',
                account: {
                    username: '',
                    password: ''
                },
                wxLoginQrCode: 'http://q2fgufcw6.bkt.clouddn.com/20191213/9f217b754ad44f0caaa83040ce62fe93.png'
            }
        },
        methods: {
            loginTypeHandleClick() {
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
<style lang="scss" scoped>
    .logo {
        left: 148px;
        top: 20px;
        width: 88px;
        height: 88px;
        border-radius: 100px;
    }

    .logo-text {
        color: rgba(96, 96, 96, 1);
        font-size: 20px;
    }

    .login-header {
        line-height: 20px;
        background-color: rgba(255, 255, 255, 1);
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        text-align: center;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0);
    }

    .logo-text-sub {
        margin-left: 5px;
        color: rgba(96, 96, 96, 1);
        font-size: 16px;
    }

    .fun-nav {
        color: rgba(96, 95, 95, 1);
        font-size: 18px;
        text-align: left;
        text-decoration: none;
    }

    .login-main {
        height: 60%;
        padding: 0px;
        background: url("~@/assets/images/loginView.jpg");

        .content {
            margin-top: 40px;
            width: 100%;
            height: 730px;
            background-color: #FFFFFF;
            display: flex;
            align-content: center;
            align-items: center;
            justify-content: center;

            .banner {

            }
        }
    }

    .login-form {
        margin-left: 100px;
        height: 400px;
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

        .other-login {
            margin-left: auto;

            .other-login-icon {
                margin-left: 10px;
            }
        }

        .login-tip {
            color: rgba(16, 16, 16, 1);
            font-size: 14px;
            text-align: left;
        }
    }

    .footer {
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
