<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :append-to-body="true"
    width="460px"
    custom-class="first-login-pwd-dialog"
  >
    <div class="first-pwd-container">
      <div class="dialog-header">
        <div class="icon-badge">
          <i class="el-icon-lock" />
        </div>
        <h3 class="dialog-title">首次登录修改密码</h3>
        <p class="dialog-subtitle">为了保障您的账号与数据安全，请设置高强度新密码后再进入系统</p>
      </div>

      <el-form
        ref="pwdForm"
        :model="form"
        :rules="rules"
        label-position="top"
        size="medium"
        status-icon
        @keyup.enter.native="submitHandle"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="form.oldPassword"
            type="password"
            placeholder="请输入当前密码"
            prefix-icon="el-icon-key"
            show-password
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="form.newPassword"
            type="password"
            placeholder="8-20位字符，必须包含字母和数字"
            prefix-icon="el-icon-lock"
            show-password
            autocomplete="off"
          />
          <!-- 密码强度展示 -->
          <div v-if="form.newPassword" class="pwd-strength-container">
            <div class="strength-bars">
              <span class="bar" :class="{ 'active weak': passwordStrength >= 1 }" />
              <span class="bar" :class="{ 'active medium': passwordStrength >= 2 }" />
              <span class="bar" :class="{ 'active strong': passwordStrength >= 3 }" />
            </div>
            <span class="strength-label" :class="strengthClass">{{ strengthText }}</span>
          </div>
          <div class="pwd-tip-text">
            <i class="el-icon-info" /> 需包含字母和数字，长度8-20位，不能使用常见弱密码
          </div>
        </el-form-item>

        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            prefix-icon="el-icon-circle-check"
            show-password
            autocomplete="off"
          />
        </el-form-item>

        <div class="dialog-footer-actions">
          <el-button
            type="primary"
            class="submit-btn"
            :loading="loading"
            @click="submitHandle"
          >
            确认修改并进入系统
          </el-button>
          <div class="back-link-wrapper">
            <el-link :underline="false" type="info" class="cancel-link" @click="cancelHandle">
              <i class="el-icon-back" /> 返回重新登录
            </el-link>
          </div>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import constants from '@/utils/constants'

// 常见弱密码黑名单
const WEAK_PASSWORDS = [
  '123456', '1123456', '1234567', '12345678', '123456789', '88888888', '66666666',
  '11111111', '00000000', 'admin123', 'password', 'admin888', '123123123',
  'qwertyui', 'qwerty123', 'admin', 'root', '123321'
]

export default {
  name: 'FirstLoginUpdatePwd',
  data() {
    const validateNewPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'))
      } else if (value.length < 8 || value.length > 20) {
        callback(new Error('密码长度必须在 8 到 20 位字符之间'))
      } else if (!constants.strongPasswordReg.test(value)) {
        callback(new Error('密码必须同时包含字母和数字'))
      } else if (WEAK_PASSWORDS.includes(value.toLowerCase())) {
        callback(new Error('密码过于简单，不能使用常见弱密码'))
      } else if (this.form.oldPassword && value === this.form.oldPassword) {
        callback(new Error('新密码不能与原密码相同'))
      } else {
        if (this.form.confirmPassword) {
          this.$refs.pwdForm.validateField('confirmPassword')
        }
        callback()
      }
    }

    const validateConfirmPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }

    return {
      dialogVisible: false,
      loading: false,
      loginData: null,
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: validateNewPass, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validateConfirmPass, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    passwordStrength() {
      const pwd = this.form.newPassword
      if (!pwd) return 0
      if (pwd.length < 8 || WEAK_PASSWORDS.includes(pwd.toLowerCase()) || !/[a-zA-Z]/.test(pwd) || !/\d/.test(pwd)) {
        return 1
      }
      let score = 0
      if (/[a-z]/.test(pwd)) score++
      if (/[A-Z]/.test(pwd)) score++
      if (/\d/.test(pwd)) score++
      if (/[^a-zA-Z0-9]/.test(pwd)) score++
      if (pwd.length >= 10) score++

      if (score >= 4) {
        return 3
      }
      return 2
    },
    strengthText() {
      const map = { 1: '强度弱', 2: '强度中', 3: '强度强' }
      return map[this.passwordStrength] || ''
    },
    strengthClass() {
      const map = { 1: 'text-weak', 2: 'text-medium', 3: 'text-strong' }
      return map[this.passwordStrength] || ''
    }
  },
  methods: {
    show(loginData, defaultOldPassword = '') {
      this.loginData = loginData
      this.form = {
        oldPassword: defaultOldPassword || '',
        newPassword: '',
        confirmPassword: ''
      }
      this.loading = false
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.pwdForm) {
          this.$refs.pwdForm.clearValidate()
        }
      })
    },
    cancelHandle() {
      this.dialogVisible = false
      this.loading = false
      this.form = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      this.$emit('cancel')
    },
    submitHandle() {
      this.$refs.pwdForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.loading = true
        this.$api
          .post(
            '/user/update/password',
            {
              oldPassword: this.form.oldPassword,
              password: this.form.newPassword,
              repeatPassword: this.form.confirmPassword
            },
            {
              headers: {
                token: this.loginData && this.loginData.token ? this.loginData.token : ''
              }
            }
          )
          .then((res) => {
            this.loading = false
            if (res.code === 200) {
              this.msgSuccess('密码修改成功，正在进入系统...')
              this.dialogVisible = false
              if (this.loginData) {
                this.loginData.needChangePassword = false
              }
              this.$emit('success', this.loginData)
            }
          })
          .catch(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .first-login-pwd-dialog {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 32px 32px 28px;
  }
}

.first-pwd-container {
  .dialog-header {
    text-align: center;
    margin-bottom: 24px;

    .icon-badge {
      width: 52px;
      height: 52px;
      margin: 0 auto 14px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(64, 158, 255, 0.12) 0%, rgba(64, 158, 255, 0.22) 100%);
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 24px;
        color: #409eff;
      }
    }

    .dialog-title {
      margin: 0 0 8px;
      font-size: 20px;
      font-weight: 600;
      color: #1d2129;
    }

    .dialog-subtitle {
      margin: 0;
      font-size: 13px;
      color: #86909c;
      line-height: 1.5;
    }
  }

  .el-form-item {
    margin-bottom: 18px;

    ::v-deep .el-form-item__label {
      padding-bottom: 4px;
      font-size: 13px;
      font-weight: 500;
      color: #4e5969;
      line-height: 20px;
    }

    ::v-deep .el-input__inner {
      height: 42px;
      line-height: 42px;
      border-radius: 8px;
      border-color: #e5e6eb;
      transition: all 0.25s ease;

      &:focus {
        border-color: #409eff;
        box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
      }
    }
  }

  .pwd-strength-container {
    display: flex;
    align-items: center;
    margin-top: 8px;
    gap: 8px;

    .strength-bars {
      display: flex;
      gap: 4px;
      flex: 1;

      .bar {
        height: 4px;
        flex: 1;
        background-color: #e5e6eb;
        border-radius: 2px;
        transition: background-color 0.3s ease;

        &.active.weak {
          background-color: #f53f3f;
        }

        &.active.medium {
          background-color: #ff7d00;
        }

        &.active.strong {
          background-color: #00b42a;
        }
      }
    }

    .strength-label {
      font-size: 12px;
      width: 44px;
      text-align: right;

      &.text-weak {
        color: #f53f3f;
      }

      &.text-medium {
        color: #ff7d00;
      }

      &.text-strong {
        color: #00b42a;
      }
    }
  }

  .pwd-tip-text {
    font-size: 12px;
    color: #86909c;
    margin-top: 6px;
    line-height: 1.4;

    i {
      margin-right: 2px;
      color: #409eff;
    }
  }

  .dialog-footer-actions {
    margin-top: 24px;

    .submit-btn {
      width: 100%;
      height: 42px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 8px;
      background: linear-gradient(135deg, #409eff 0%, #3a8ee6 100%);
      border: none;
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
      transition: all 0.25s ease;

      &:hover {
        opacity: 0.92;
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(64, 158, 255, 0.38);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .back-link-wrapper {
      margin-top: 14px;
      text-align: center;

      .cancel-link {
        font-size: 13px;
        color: #86909c;
        transition: color 0.2s ease;

        &:hover {
          color: #409eff;
        }

        i {
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
