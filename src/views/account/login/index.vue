<template>
  <div class="login-container">
    <div class="bg-glowing-blob blob-1"></div>
    <div class="bg-glowing-blob blob-2"></div>

    <div class="login-card-wrapper">
      <div class="logo-banner">
        <div class="banner-header">
          <h1 class="brand-title">Tduck <span class="brand-badge">CE</span></h1>
          <p class="brand-description">简单 · 专业 · 现代的问卷数据收集平台</p>
        </div>
        <div class="banner-illustration-box">
          <img src="@/assets/images/login_illustration.png" alt="Tduck Illustration" />
        </div>
      </div>

      <div class="logo-content" :class="{ 'register-mode': formType !== 'login' }">
        <div v-if="formType == 'login'" class="welcome-header">
          <span class="hello">Hello,</span>
          <span class="tips">欢迎使用 Tduck！</span>
        </div>

        <el-tabs v-if="formType == 'login'" v-model="loginType" class="login-form-tab">
          <el-tab-pane v-if="enableWx" label="微信扫码登录" name="wx">
            <div class="wx-login">
              <div class="flex-center">
                <el-image
                  v-loading="wxQrCodeLoading"
                  :src="wxLoginQrCode"
                  class="wx-login-qrcode"
                  fit="fill"
                  @load="
                    (e) => {
                      this.wxQrCodeLoading = false
                    }
                  "
                />
              </div>
              <div class="text-center">
                <el-link :underline="false" icon="el-icon-refresh-left" class="refresh-link" @click="getLoginWxQrCode">
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
              size="medium"
              status-icon
              @keyup.enter.native="loginHandle"
            >
              <el-form-item prop="account">
                <el-input
                  v-model="accountForm.account"
                  autocomplete="off"
                  placeholder="请输入手机号 / 邮箱"
                  prefix-icon="el-icon-user"
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
              <el-form-item class="form-btn-item">
                <el-button type="primary" class="submit-btn" @click="loginHandle" v-re-click> 登 录 </el-button>
                <div class="form-footer-links">
                  <span class="link-item" @click="formType = 'reg'">立即注册</span>
                  <span class="link-divider">|</span>
                  <span class="link-item" @click="toForgetPwdHandle">忘记密码</span>
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <register v-else @success="registerSuccessHandle" @back="formType = 'login'" />
      </div>
    </div>

    <!-- 极简高雅页脚 -->
    <div class="copyright" v-if="copyright" v-html="copyright"></div>
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
      const reg1 = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
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
      qqLoginAuthorizeUrl: '',
      enableWx: false,
      copyright: ''
    }
  },
  computed: {},
  watch: {},
  async created() {
    let sysRes = await this.$api.get('/public/systemInfoConfig')
    let { openWxMpLogin, copyright } = JSON.parse(sysRes.data)
    this.enableWx = openWxMpLogin || false
    this.copyright = copyright || ''
    if (this.enableWx) {
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
      this.$api.get('/login/wx/qrcode').then((res) => {
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
        .then((res) => {
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
        .then((res) => {
          if (res.data) {
            this.loginSuccessHandle(res.data)
          }
        })
    },
    loginSuccessHandle(data) {
      this.msgSuccess('登录成功')
      this.$store.dispatch('user/login', data).then(() => {
        // 重置状态
        this.$store.dispatch('global/loginExpired', false).then(() => {})
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
      this.$refs['accountLoginForm'].validate((valid) => {
        if (valid) {
          this.$api
            .request({
              url: '/login/account',
              method: 'post',
              data: this.accountForm
            })
            .then((res) => {
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
@import '@/assets/styles/variables.scss';

.login-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f9fa;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

// 柔和炫彩流体背景气泡
.bg-glowing-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  z-index: 1;
  opacity: 0.65;
  pointer-events: none;

  &.blob-1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(51, 112, 255, 0.28) 0%, rgba(121, 194, 243, 0.05) 70%);
    top: -150px;
    left: -150px;
    animation: blobFloat1 25s ease-in-out infinite;
  }

  &.blob-2 {
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(247, 185, 233, 0.28) 0%, rgba(251, 241, 186, 0.05) 70%);
    bottom: -200px;
    right: -150px;
    animation: blobFloat2 30s ease-in-out infinite;
  }
}

@keyframes blobFloat1 {
  0% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(100px, 80px) scale(1.15);
  }
  66% {
    transform: translate(-60px, 150px) scale(0.9);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}

@keyframes blobFloat2 {
  0% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-120px, -100px) scale(1.1);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}

// 黄金分割大卡片盒子
.login-card-wrapper {
  display: flex;
  align-items: stretch;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 28px 60px rgba(31, 35, 41, 0.06), 0 10px 22px rgba(31, 35, 41, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.6);
  padding: 32px;
  width: 980px;
  max-width: 90%;
  min-height: 520px;
  z-index: 10;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

// 左侧 Banner 展示区
.logo-banner {
  flex: 1.15;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 48px;
  border-right: 1px solid rgba(31, 35, 41, 0.08);

  .banner-header {
    margin-bottom: 32px;
    padding-left: 12px;

    .brand-title {
      font-size: 32px;
      font-weight: 850;
      color: $color-primary;
      margin: 0 0 8px 0;
      letter-spacing: -0.8px;
      display: flex;
      align-items: center;

      .brand-badge {
        font-size: 11px;
        font-weight: 800;
        color: #ffffff;
        background: linear-gradient(135deg, #3370ff 0%, #1a56db 100%);
        padding: 2px 6px;
        border-radius: 6px;
        margin-left: 10px;
        letter-spacing: 0.8px;
      }
    }

    .brand-description {
      font-size: 15px;
      color: #646a73;
      margin: 0;
      font-weight: 400;
      letter-spacing: 0.5px;
    }
  }

  .banner-illustration-box {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      max-width: 469px;
      height: auto;
      filter: drop-shadow(0 20px 40px rgba(31, 35, 41, 0.06));
    }
  }
}

// 右侧登录区
.logo-content {
  flex: 0.85;
  padding-left: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s ease;

  &.register-mode {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .welcome-header {
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;

    .hello {
      font-size: 32px;
      font-weight: 850;
      color: #1f2329;
      line-height: 1.2;
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }

    .tips {
      font-size: 15px;
      font-weight: 500;
      color: #646a73;
      letter-spacing: 0.5px;
    }
  }

  .login-form-tab {
    width: 100%;
  }

  .wx-login {
    padding: 16px 0;

    .wx-login-qrcode {
      width: 190px;
      height: 190px;
      border-radius: 16px;
      border: 1px solid rgba(31, 35, 41, 0.08);
      padding: 10px;
      background: #ffffff;
      box-shadow: 0 8px 24px rgba(31, 35, 41, 0.04);
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.02);
      }
    }

    .text-center {
      margin-top: 20px;
    }

    .refresh-link {
      font-size: 13px;
      color: #646a73 !important;

      &:hover {
        color: #3370ff !important;
      }
    }
  }
}

// Tabs 美化
.logo-content ::v-deep .el-tabs__nav-wrap::after {
  height: 1px !important;
  background-color: rgba(31, 35, 41, 0.06) !important;
}

.logo-content ::v-deep .el-tabs__active-bar {
  height: 3px !important;
  border-radius: 2px !important;
  background-color: #3370ff !important;
}

.logo-content ::v-deep .el-tabs__item {
  font-size: 14px;
  color: #646a73;
  font-weight: 600;
  padding-bottom: 12px;
  transition: all 0.2s ease;

  &.is-active {
    color: #3370ff !important;
    font-weight: 700;
    font-size: 15px;
  }
}

.account-login-form {
  margin-top: 20px;
}

// 统一输入框与表单项
::v-deep .el-form-item {
  margin-bottom: 22px;
}

::v-deep .el-input__inner {
  height: 46px !important;
  line-height: 46px !important;
  background: rgba(255, 255, 255, 0.6) !important;
  border: 1px solid rgba(31, 35, 41, 0.12) !important;
  border-radius: 12px !important;
  padding-left: 48px !important;
  color: #1f2329 !important;
  font-size: 14px !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;

  &::placeholder {
    color: #bbbfc4 !important;
  }

  &:hover {
    border-color: rgba(51, 112, 255, 0.45) !important;
    background: rgba(255, 255, 255, 0.95) !important;
  }

  &:focus {
    border-color: #3370ff !important;
    background: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(51, 112, 255, 0.12) !important;
  }
}

// 解决全局 element-custom 样式中 .el-input--prefix .el-input__inner 的 padding-left: 34px !important 导致图标与文本挨得太近的问题
::v-deep .el-input--prefix .el-input__inner {
  padding-left: 48px !important;
}

::v-deep .el-input__prefix {
  left: 16px !important;
  color: #8f959e !important;
  display: flex;
  align-items: center;
  font-size: 16px !important;
}

// 按钮及行为区
.form-btn-item {
  margin-top: 32px;
  margin-bottom: 0px !important;
}

.submit-btn {
  background: linear-gradient(135deg, #3370ff 0%, #1a56db 100%) !important;
  border: none !important;
  color: #ffffff !important;
  border-radius: 12px !important;
  height: 46px !important;
  width: 100% !important;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 2px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 16px rgba(51, 112, 255, 0.2) !important;
  }
}

.form-footer-links {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding: 0 4px;
  font-size: 13px;

  .link-item {
    color: #646a73;
    cursor: pointer;
    font-weight: 600;
    transition: color 0.2s ease;

    &:hover {
      color: #3370ff;
    }
  }

  .link-divider {
    color: rgba(31, 35, 41, 0.08);
    user-select: none;
  }
}

// 注册子组件继承适配
::v-deep .register-container {
  .tips {
    font-size: 15px;
    font-weight: 600;
    color: #1f2329;
    margin-bottom: 20px;
  }

  .code-input {
    width: calc(100% - 130px) !important;

    .el-input__inner {
      width: 100% !important;
    }
  }

  .ml-20 {
    margin-left: 12px !important;
  }

  .el-button--primary:not(.submit-btn) {
    height: 46px !important;
    border-radius: 12px !important;
    font-weight: 600;
    border: 1px solid rgba(31, 35, 41, 0.12) !important;
    background: #ffffff !important;
    color: #1f2329 !important;
    box-shadow: none !important;
    transition: all 0.2s ease !important;

    &:hover {
      background: rgba(31, 35, 41, 0.03) !important;
      border-color: rgba(31, 35, 41, 0.2) !important;
    }
  }

  .width-full {
    @extend .submit-btn;
  }
}

// 页脚版权区
.copyright {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  color: #8f959e;
  font-size: 12px;
  font-weight: 400;
  z-index: 10;
  letter-spacing: 0.5px;

  a {
    color: #646a73;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #3370ff;
    }
  }
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column !important;
    justify-content: flex-start !important;
    overflow-y: auto !important;
    padding: 24px 12px 60px 12px !important;
  }

  .bg-glowing-blob {
    filter: blur(80px) !important;
    &.blob-1 {
      width: 300px !important;
      height: 300px !important;
    }
    &.blob-2 {
      width: 350px !important;
      height: 350px !important;
    }
  }

  .login-card-wrapper {
    width: 100% !important;
    max-width: 420px !important;
    min-height: auto !important;
    padding: 24px 16px !important;
    margin-top: 40px !important;
    margin-bottom: 20px !important;
    border-radius: 16px !important;
  }

  .logo-banner {
    display: none !important;
  }

  .logo-content {
    padding-left: 0 !important;
    flex: 1 !important;
    width: 100% !important;
  }

  .copyright {
    position: static !important;
    transform: none !important;
    margin: 20px auto 0 auto !important;
    text-align: center !important;
    width: 100% !important;
  }
}
</style>
