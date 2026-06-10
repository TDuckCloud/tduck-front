<template>
  <div class="forget-pwd-wrapper">
    <!-- 背景多重微光晕 -->
    <div class="background-decor">
      <div class="glow-circle glow-1"></div>
      <div class="glow-circle glow-2"></div>
    </div>

    <!-- 主毛玻璃卡片 -->
    <div class="forget-card">
      <!-- 品牌Logo -->
      <div class="brand-header">
        <img class="header-logo-img" src="~@/assets/images/logo-blue.png" @click="$router.push({ path: '/' })" />
      </div>

      <!-- 步骤微指示器 -->
      <div class="steps-indicator">
        <div class="step-dot" :class="{ active: retrieveStep >= 1 }"></div>
        <div class="step-line" :class="{ active: retrieveStep >= 2 }"></div>
        <div class="step-dot" :class="{ active: retrieveStep >= 2 }"></div>
        <div class="step-line" :class="{ active: retrieveStep >= 3 }"></div>
        <div class="step-dot" :class="{ active: retrieveStep === 3 }"></div>
      </div>

      <!-- 步骤过渡视图 -->
      <transition name="fade-slide" mode="out-in">
        <!-- 步骤1: 输入邮箱 -->
        <div v-if="retrieveStep === 1" key="step1" class="step-container">
          <div class="text-center mb-6">
            <h4 class="title">找回密码</h4>
            <p class="subtitle">我们将向您的邮箱发送一封密码重置邮件</p>
          </div>

          <el-form ref="emailForm" :model="retrieveAccountForm" :rules="emailRules" label-width="0px" status-icon>
            <el-form-item label="" prop="email">
              <el-input
                v-model="retrieveAccountForm.email"
                autocomplete="off"
                placeholder="请输入您的邮箱地址"
                prefix-icon="el-icon-message"
              />
            </el-form-item>
            <el-form-item style="margin-top: 24px">
              <el-button class="btn-submit" type="primary" @click="sendEmailValidateHandle"> 发送重置邮件 </el-button>
            </el-form-item>
          </el-form>

          <div class="back-to-login">
            <router-link to="/login" class="login-link"> <i class="el-icon-back" /> 返回登录页面 </router-link>
          </div>
        </div>

        <!-- 步骤2: 重置密码 -->
        <div v-if="retrieveStep === 2" key="step2" class="step-container">
          <div class="text-center mb-4">
            <h4 class="title">设置新密码</h4>
            <p class="subtitle">请为您的账户设置一个安全的新密码</p>
          </div>

          <div class="user-display-capsule">
            <i class="el-icon-user-solid" />
            <span>{{ resetAccount }}</span>
          </div>

          <el-form ref="resetPwdForm" :model="resetPwdForm" :rules="pwdRules" label-width="0px">
            <el-form-item label="" prop="password">
              <el-input
                v-model="resetPwdForm.password"
                autocomplete="off"
                placeholder="新密码 (不少于6位)"
                show-password
                prefix-icon="el-icon-lock"
              />
            </el-form-item>
            <el-form-item label="" prop="rePassword" style="margin-top: 16px">
              <el-input
                v-model="resetPwdForm.rePassword"
                autocomplete="off"
                placeholder="请再次输入密码确认"
                show-password
                prefix-icon="el-icon-circle-check"
              />
            </el-form-item>
            <el-form-item style="margin-top: 28px">
              <el-button class="btn-submit" type="primary" @click="resetPasswordHandle"> 更新并提交 </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 步骤3: 邮件发送成功 -->
        <div v-if="retrieveStep === 3" key="step3" class="step-container success-view">
          <div class="icon-pulse-wrap">
            <i class="el-icon-message-solid" />
          </div>
          <h4 class="title">重置邮件已发送</h4>
          <p class="success-desc">
            我们已向您的邮箱
            <strong style="color: #1d1d1f">{{ retrieveAccountForm.email }}</strong>
            发送了密码重置链接，请登录您的邮箱查收并点击该链接以重置密码。
          </p>
          <div class="msg-footer">
            <span>没有收到邮件？请检查垃圾箱，或 </span>
            <el-button type="text" class="resend-btn" @click="sendEmailValidate">重新发送</el-button>
          </div>
          <div class="back-to-login" style="margin-top: 32px">
            <el-button class="btn-submit" type="primary" @click="$router.push('/login')"> 去登录页 </el-button>
          </div>
        </div>
      </transition>
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
      } else if (value !== this.resetPwdForm.password) {
        // 修复原代码中的小Bug：原代码比对的是 rePassword 自身，导致可能失效，现更正为 password
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      retrieveStep: 1,
      retrieveType: 'email',
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
      this.$refs['phoneForm'].validateField('phoneNumber', (err) => {
        if (!err) {
          this.sendPhoneValidateCode()
        }
      })
    },
    sendPhoneValidateCode() {
      const phoneNumber = this.retrieveAccountForm.phoneNumber
      this.$refs['phoneForm'].validateField('phoneNumber', (err) => {
        if (!err) {
          this.emailValidateCodeBtn = true
          this.$api
            .request({
              url: '/retrieve/password/phone/code',
              method: 'get',
              params: { phoneNumber: phoneNumber }
            })
            .then(() => {
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
      this.$refs['phoneForm'].validate((valid) => {
        if (valid) {
          this.$api.post('/retrieve/password/check/phone-code', this.retrieveAccountForm).then((res) => {
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
      this.$refs['resetPwdForm'].validate((valid) => {
        if (valid) {
          this.$api.post('/retrieve/password/reset', this.resetPwdForm).then((res) => {
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
      this.$refs['emailForm'].validateField('email', (err) => {
        if (!err) {
          this.sendEmailValidate()
        }
      })
    },
    sendEmailValidate() {
      this.$refs['emailForm'].validate((valid) => {
        if (valid) {
          this.$api
            .request({
              url: '/retrieve/password/email',
              method: 'get',
              params: { email: this.retrieveAccountForm.email }
            })
            .then(() => {
              this.retrieveStep = 3
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.forget-pwd-wrapper {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at 10% 20%, #f4f7fc 0%, #eef1f9 45%, #e6eebf 100%); /* HSL 微调 */
  background-image: radial-gradient(circle at 15% 15%, #f4f7fc 0%, #eef1f9 50%, #e3ebfa 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  overflow: hidden;
  position: relative;
}

/* 背景模糊泡泡装饰 */
.background-decor {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}
.glow-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.6;
}
.glow-1 {
  width: 450px;
  height: 450px;
  background: rgba(59, 130, 246, 0.18);
  top: -12%;
  left: 12%;
}
.glow-2 {
  width: 550px;
  height: 550px;
  background: rgba(147, 51, 234, 0.12);
  bottom: -15%;
  right: 15%;
}

/* 主精致毛玻璃卡片 */
.forget-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 24px;
  padding: 42px 38px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.02), 0 24px 70px rgba(59, 130, 246, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  margin: 20px;
}

.brand-header {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}
.header-logo-img {
  height: 38px;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.header-logo-img:hover {
  transform: scale(1.05);
}

/* 步骤指示器 */
.steps-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  gap: 8px;
}
.step-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}
.step-dot.active {
  background: #3b82f6;
  transform: scale(1.2);
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
}
.step-line {
  width: 28px;
  height: 2px;
  background: rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}
.step-line.active {
  background: rgba(59, 130, 246, 0.3);
}

.step-container {
  width: 100%;
}

.text-center {
  text-align: center;
}
.mb-4 {
  margin-bottom: 16px;
}
.mb-6 {
  margin-bottom: 24px;
}

.title {
  color: #1d1d1f;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}
.subtitle {
  color: #86868b;
  font-size: 13.5px;
  line-height: 1.4;
  margin: 0;
}

/* 覆盖Element UI 输入框 */
::v-deep {
  .el-input {
    .el-input__inner {
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.12);
      background-color: rgba(0, 0, 0, 0.015);
      height: 48px;
      line-height: 48px;
      padding: 0 16px 0 40px; /* 为 prefix 图标预留空间 */
      font-size: 14.5px;
      color: #1d1d1f;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

      &::placeholder {
        color: #a1a1a6;
      }

      &:focus {
        border-color: #3b82f6;
        background-color: #ffffff;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
      }
    }

    .el-input__prefix {
      left: 12px;
      display: flex;
      align-items: center;
      color: #86868b;
      font-size: 17px;
    }

    .el-input__suffix {
      right: 12px;
      display: flex;
      align-items: center;

      .el-input__icon {
        line-height: 48px;
        color: #86868b;
        font-size: 16px;
      }
    }
  }

  .el-form-item {
    margin-bottom: 0px; /* 完全接管间距 */

    .el-form-item__error {
      padding-top: 6px;
      left: 4px;
      font-size: 12px;
      color: #ff3b30; /* 苹果级警示红 */
    }
  }
}

/* 按钮设计 */
.btn-submit {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  font-size: 15px;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 1px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.28);
    transform: translateY(-1px);
    color: #ffffff;
  }

  &:active {
    transform: translateY(1px) scale(0.985);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.18);
  }
}

/* 链接样式 */
.back-to-login {
  text-align: center;
  margin-top: 20px;
}
.login-link {
  font-size: 13.5px;
  font-weight: 500;
  color: #86868b;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s ease;

  &:hover {
    color: #3b82f6;
  }
}

/* 步骤2: 账号显示舱 */
.user-display-capsule {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.035);
  padding: 8px 16px;
  border-radius: 20px;
  margin: 0 auto 24px auto;
  gap: 8px;
  width: fit-content;

  i {
    font-size: 14px;
    color: #86868b;
  }
  span {
    font-size: 13.5px;
    color: #515154;
    font-weight: 500;
  }
}

/* 步骤3: 成功视图 */
.success-view {
  text-align: center;
  padding: 12px 0 0 0;
}
.icon-pulse-wrap {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px auto;
  color: #3b82f6;
  font-size: 34px;
  animation: pulse-blue-shadow 2s infinite;
}
@keyframes pulse-blue-shadow {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.3);
  }
  70% {
    box-shadow: 0 0 0 14px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}
.success-desc {
  font-size: 14px;
  color: #86868b;
  line-height: 1.6;
  margin: 0 0 24px 0;
}
.msg-footer {
  font-size: 13px;
  color: #86868b;

  .resend-btn {
    padding: 0;
    font-size: 13px;
    font-weight: 500;
    color: #3b82f6;

    &:hover {
      color: #2563eb;
      text-decoration: underline;
    }
  }
}

/* 过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter {
  opacity: 0;
  transform: translateY(8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 576px) {
  .forget-pwd-wrapper {
    flex-direction: column !important;
    justify-content: flex-start !important;
    overflow-y: auto !important;
    padding: 20px 10px 60px 10px !important;
  }

  .glow-circle {
    filter: blur(60px) !important;
    &.glow-1 {
      width: 250px !important;
      height: 250px !important;
    }
    &.glow-2 {
      width: 300px !important;
      height: 300px !important;
    }
  }

  .forget-card {
    padding: 30px 20px !important;
    margin-top: 40px !important;
    margin-bottom: 20px !important;
    border-radius: 16px !important;
    max-width: 100% !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
}
</style>
