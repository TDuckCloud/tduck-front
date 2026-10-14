<template>
  <div class="member-container">
    <el-card class="member-box-card" :body-style="{ padding: '0px' }">
      <!-- 头部迎宾与头像卡片 (Apple Settings Style Header) -->
      <div v-if="userInfo" class="profile-banner">
        <div class="avatar-wrapper" @click="showUploadAvatar = true">
          <el-avatar :size="96" :src="userInfo.avatar" class="user-avatar" />
          <div class="avatar-hover-overlay">
            <i class="el-icon-camera" />
            <span>更换头像</span>
          </div>
        </div>
        <div class="profile-meta">
          <h2>{{ userInfo.name || '未命名用户' }}</h2>
          <p class="user-email">
            <i class="el-icon-message" />
            <span>{{ userInfo.email || '未绑定邮箱账号' }}</span>
          </p>
          <div class="badge-row">
            <span v-if="userInfo.wxName" class="user-badge wx-badge">
              <font-icon class="fab fa-weixin" /> 已绑定微信
            </span>
          </div>
        </div>
      </div>

      <!-- 主设置分组 (iOS List Group style) -->
      <div v-if="userInfo" class="settings-section">
        <h3 class="section-title">安全与个人配置</h3>
        <div class="settings-group">
          <!-- 昵称项 -->
          <div class="settings-row">
            <div class="row-left">
              <div class="row-icon icon-user">
                <i class="el-icon-user" />
              </div>
              <div class="row-label-group">
                <span class="row-title">用户昵称</span>
                <span class="row-subtitle">展示在系统中的公开名称</span>
              </div>
            </div>
            <div class="row-right">
              <span class="row-value">{{ userInfo.name }}</span>
              <el-button class="pill-action-btn" @click="editNameDialogVisible = true">修改</el-button>
            </div>
          </div>

          <!-- 邮箱账号项 -->
          <div class="settings-row">
            <div class="row-left">
              <div class="row-icon icon-envelope">
                <i class="el-icon-message" />
              </div>
              <div class="row-label-group">
                <span class="row-title">账号邮箱</span>
                <span class="row-subtitle">登录所需的唯一邮箱标识</span>
              </div>
            </div>
            <div class="row-right">
              <span class="row-value">{{ userInfo.email }}</span>
              <el-button class="pill-action-btn" @click="emailDialogVisible = true">绑定</el-button>
            </div>
          </div>

          <!-- 密码项 -->
          <div class="settings-row">
            <div class="row-left">
              <div class="row-icon icon-lock">
                <i class="el-icon-lock" />
              </div>
              <div class="row-label-group">
                <span class="row-title">账号密码</span>
                <span class="row-subtitle">定期修改密码确保资金与表单安全</span>
              </div>
            </div>
            <div class="row-right">
              <span class="row-value">••••••</span>
              <el-button class="pill-action-btn" @click="pwdDialogVisible = true">修改</el-button>
            </div>
          </div>

          <!-- 手机号码项 -->
          <div class="settings-row">
            <div class="row-left">
              <div class="row-icon icon-phone">
                <i class="el-icon-mobile-phone" />
              </div>
              <div class="row-label-group">
                <span class="row-title">手机号码</span>
                <span class="row-subtitle">用于接收验证码及安全密保校验</span>
              </div>
            </div>
            <div class="row-right">
              <span class="row-value">{{ userInfo.phoneNumber || '未绑定手机号' }}</span>
              <el-button class="pill-action-btn" @click="phoneDialogVisible = true">
                {{ userInfo.phoneNumber ? '修改' : '绑定' }}
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 第三方授权分组 -->
      <div v-if="userInfo" class="settings-section" style="padding-top: 0; padding-bottom: 40px">
        <h3 class="section-title">第三方账号关联</h3>
        <div class="third-party-group">
          <div class="third-party-card">
            <div class="card-left">
              <div class="wx-icon-box">
                <font-icon class="fab fa-weixin icon" />
              </div>
              <div class="card-meta">
                <h4>微信极速绑定</h4>
                <p v-if="userInfo.wxName" class="bound-text">
                  <i class="el-icon-circle-check" /> 微信用户：{{ userInfo.wxName }}（已安全授权）
                </p>
                <p v-else class="unbound-text">暂未授权关联微信服务号，无法接收微信推送</p>
              </div>
            </div>
            <div class="card-right">
              <span v-if="userInfo.wxName" class="status-tag success">已绑定</span>
              <span v-else class="status-tag warning">未激活</span>
              <el-button
                class="pill-action-btn"
                :class="{ 'bound-btn': userInfo.wxName }"
                @click="bindWxHandle"
                style="margin-left: 14px"
              >
                {{ userInfo.wxName ? '重新绑定' : '绑定' }}
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 头像裁剪上传裁剪插件 -->
      <my-upload
        v-model="showUploadAvatar"
        field="file"
        :width="300"
        :height="300"
        :url="getUploadUrl()"
        :headers="getUploadHeader()"
        img-format="png"
        @crop-upload-success="cropUploadSuccess"
      />
    </el-card>

    <!-- 全局精绘 Dialog 弹出层 -->
    <div class="dialogs-wrapper">
      <!-- 修改用户名弹窗 -->
      <el-dialog
        title="修改用户名"
        :visible.sync="editNameDialogVisible"
        width="420px"
        center
        append-to-body
        custom-class="member-dialog"
      >
        <el-form
          ref="updateNameForm"
          :model="userInfoForm"
          :rules="userInfoRules"
          label-width="0px"
          style="margin-top: 10px"
        >
          <el-form-item prop="name">
            <el-input v-model="userInfoForm.name" placeholder="请输入新的用户名" prefix-icon="el-icon-user" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editNameDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="
              () => {
                this.$refs['updateNameForm'].validateField('name', (err) => {
                  if (!err) {
                    this.editNameDialogVisible = false
                    this.updateUserHandle()
                  }
                })
              }
            "
            >保 存</el-button
          >
        </span>
      </el-dialog>

      <!-- 修改密码弹窗 -->
      <el-dialog
        title="修改密码"
        :visible.sync="pwdDialogVisible"
        width="440px"
        center
        append-to-body
        custom-class="member-dialog"
      >
        <el-form
          ref="updatePassWordForm"
          :model="userPwdForm"
          :rules="userPwdRules"
          label-width="0px"
          style="margin-top: 10px"
        >
          <el-form-item prop="oldPassword">
            <el-input
              v-model="userPwdForm.oldPassword"
              placeholder="请输入当前旧密码"
              show-password
              prefix-icon="el-icon-lock"
            />
          </el-form-item>
          <el-form-item prop="password" style="margin-top: 14px">
            <el-input
              v-model="userPwdForm.password"
              placeholder="请输入新密码 (6位以上)"
              show-password
              prefix-icon="el-icon-key"
            />
          </el-form-item>
          <el-form-item prop="repeatPassword" style="margin-top: 14px">
            <el-input
              v-model="userPwdForm.repeatPassword"
              placeholder="请重复输入新密码进行确认"
              show-password
              prefix-icon="el-icon-circle-check"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="pwdDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="
              () => {
                this.pwdDialogVisible = false
                this.updateUserPwdHandle()
              }
            "
            >完 成</el-button
          >
        </span>
      </el-dialog>

      <!-- 修改邮箱弹窗 -->
      <el-dialog
        title="绑定/修改邮箱"
        :visible.sync="emailDialogVisible"
        width="420px"
        center
        append-to-body
        custom-class="member-dialog"
      >
        <el-form
          ref="updateEmailForm"
          :model="userInfoForm"
          :rules="userInfoRules"
          label-width="0px"
          style="margin-top: 10px"
        >
          <el-form-item prop="email">
            <el-input v-model="userInfoForm.email" placeholder="请输入您的邮箱地址" prefix-icon="el-icon-message" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="emailDialogVisible = false">取 消</el-button>
          <el-button
            v-prevent-re-click
            type="primary"
            @click="
              () => {
                this.emailDialogVisible = false
                this.sendUpdateEmail()
              }
            "
            >发送验证邮件</el-button
          >
        </span>
      </el-dialog>

      <!-- 修改手机号弹窗 -->
      <el-dialog
        title="绑定/修改手机号"
        :visible.sync="phoneDialogVisible"
        width="440px"
        center
        append-to-body
        custom-class="member-dialog"
      >
        <el-form
          ref="updatePhoneForm"
          :model="userInfoForm"
          :rules="userInfoRules"
          label-width="0px"
          style="margin-top: 10px"
        >
          <el-form-item prop="phoneNumber">
            <el-input
              v-model="userInfoForm.phoneNumber"
              placeholder="请输入您的手机号码"
              prefix-icon="el-icon-mobile-phone"
            />
          </el-form-item>
          <el-form-item prop="code" style="margin-top: 14px" class="phone-code-item">
            <el-input
              v-model="userInfoForm.code"
              placeholder="短信验证码"
              prefix-icon="el-icon-coordinate"
              style="width: 58%; float: left"
            />
            <el-button
              v-prevent-re-click
              style="width: 38%; float: right; height: 40px; border-radius: 10px; font-size: 13px"
              @click.native="sendUpdatePhoneNumber"
            >
              {{ phoneValidateCodeBtnText }}
            </el-button>
            <div style="clear: both"></div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="phoneDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="
              () => {
                this.phoneDialogVisible = false
                this.updateUserPhoneHandle()
              }
            "
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 微信扫码弹窗 -->
      <el-dialog
        title="微信扫码绑定"
        :visible.sync="bindWxDialogVisible"
        width="380px"
        center
        append-to-body
        custom-class="member-dialog"
      >
        <div class="wx-qrcode-wrapper">
          <el-image
            style="width: 170px; height: 170px; display: block; margin: 10px auto"
            :src="bindWxQrcode"
            fit="fill"
          />
          <p class="qrcode-tip">请使用微信扫描上方二维码绑定您的账户</p>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import constants from '@/utils/constants'
import FontIcon from '@/components/FontIcon'
import { getCurrentDomain } from '@/utils'

export default {
  name: 'Member',
  components: {
    FontIcon,
    myUpload
  },
  data() {
    let validateRePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userPwdForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      memberMenuActive: '1',
      phoneValidateCodeBtnText: '发送验证码',
      userInfoRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入昵称' }],
        email: [
          { required: true, trigger: 'blur', message: '请输入邮箱' },
          {
            pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
            message: '请输入正确的邮箱'
          }
        ],
        phoneNumber: [
          { required: true, trigger: 'blur', message: '请输入手机号' },
          {
            pattern: /^(?:0|86|\+86)?1[3456789]\d{9}$/,
            message: '请输入正确的手机号'
          }
        ],
        code: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      userPwdRules: {
        oldPassword: [
          { required: true, trigger: 'blur', message: '请输入旧密码' },
          {
            pattern: constants.passwordReg,
            message: constants.passwordRegDesc
          }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入新密码' },
          {
            pattern: constants.strongPasswordReg,
            message: constants.strongPasswordRegDesc
          }
        ],
        repeatPassword: [{ required: true, trigger: 'blur', validator: validateRePass }]
      },
      bindWxDialogVisible: false,
      bindWxQrcode: '',
      editNameDialogVisible: false,
      pwdDialogVisible: false,
      phoneDialogVisible: false,
      emailDialogVisible: false,
      userInfo: {},
      userInfoForm: {},
      qqLoginAuthorizeUrl: '',
      userPwdForm: {
        oldPassword: '',
        password: '',
        repeatPassword: ''
      },
      showUploadAvatar: false,
      bindWxTimer: null
    }
  },
  created() {
    this.queryUserInfo()
    this.getQQLoginAuthorizeUrl()
    this.getBindWxQrCode()
  },
  destroyed() {
    clearInterval(this.bindWxTimer)
  },
  methods: {
    queryUserInfo() {
      this.$api.get('/user/current/detail').then((res) => {
        if (res.data) {
          this.userInfo = res.data
          // 深度拷贝到编辑表单中，避免直接操作主数据
          this.userInfoForm = { ...res.data }
          this.$store.dispatch('user/update', this.userInfo).then(() => {})
        }
      })
    },
    getUploadHeader() {
      return {
        token: this.$store.getters['user/isLogin']
      }
    },
    getUploadUrl() {
      return `${process.env.VUE_APP_API_ROOT}/user/file/upload`
    },
    getBindWxQrCode() {
      this.$api.get('/user/bind/wx/qrcode').then((res) => {
        this.bindWxQrcode = res.data
      })
    },
    updateUserPwdHandle() {
      this.$refs['updatePassWordForm'].validate((valid) => {
        if (valid) {
          this.$api.post('/user/update/password', this.userPwdForm).then((res) => {
            if (res.data) {
              this.msgSuccess('修改成功')
              this.queryUserInfo()
              // 重置表单
              this.userPwdForm = { oldPassword: '', password: '', repeatPassword: '' }
            }
          })
        } else {
          return false
        }
      })
    },
    sendUpdateEmail() {
      this.$refs['updateEmailForm'].validateField('email', (err) => {
        if (!err) {
          this.$api.get('/user/update-email/msg', { params: { email: this.userInfoForm.email } }).then((res) => {
            if (res.data) {
              this.msgSuccess('发送成功,请去您的邮箱查看')
              this.emailDialogVisible = false
            }
          })
        }
      })
    },
    sendUpdatePhoneNumber() {
      this.$refs['updatePhoneForm'].validateField('phoneNumber', (err) => {
        if (!err) {
          this.$api.get(`/user/update-phone/code?phoneNumber=${this.userInfoForm.phoneNumber}`).then(() => {
            this.msgSuccess('验证码发送成功，5分钟内有效')
            let count = 60
            let timer = setInterval(() => {
              count--
              this.phoneValidateCodeBtnText = count + 's后重新发送'
              if (count === 0) {
                this.phoneValidateCodeBtnText = '发送验证码'
                clearInterval(timer)
              }
            }, 1000)
          })
        }
      })
    },
    updateUserHandle() {
      this.$api.post('/user/update', this.userInfoForm).then((res) => {
        if (res.data) {
          this.msgSuccess('保存成功')
          this.queryUserInfo()
        }
      })
    },
    // qq登录授权地址
    getQQLoginAuthorizeUrl() {
      let reUrl = getCurrentDomain() + '/redirect/bindqq'
      this.$api.get('/login/qq/authorize/url', { params: { redirectUri: reUrl } }).then((res) => {
        this.qqLoginAuthorizeUrl = res.data
      })
    },
    redirectUrl(url) {
      window.open(url)
    },
    updateUserPhoneHandle() {
      this.$refs['updatePhoneForm'].validateField(['phoneNumber', 'code'], (err) => {
        if (!err) {
          this.$api.post('/user/update/phone-number', this.userInfoForm).then(() => {
            this.msgSuccess('修改成功')
            this.queryUserInfo()
          })
        }
      })
    },
    bindWxHandle() {
      this.bindWxDialogVisible = true
      this.bindWxTimer = setInterval(() => {
        this.$api.get('/user/current/detail').then((res) => {
          if (res.data) {
            let { wxName } = res.data
            if (wxName) {
              this.msgSuccess('绑定成功')
              clearInterval(this.bindWxTimer)
              this.userInfo.wxName = wxName
              this.bindWxDialogVisible = false
            }
          }
        })
      }, 5 * 1000)
    },
    cropUploadSuccess(res) {
      this.userInfoForm.avatar = res.data
      this.updateUserHandle()
    }
  }
}
</script>

<style lang="scss" scoped>
.member-container {
  display: flex;
  align-content: center;
  justify-content: center;
  padding: 24px 20px 40px 20px;
  background-color: #f8fafc;
  min-height: calc(100vh - 84px); /* 视情况铺满视口 */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.member-box-card {
  width: 100%;
  max-width: 1000px;
  background: transparent;
  box-shadow: none;
  border: none;
  overflow: visible;
}

/* User Profile Banner 迎宾卡片 */
.profile-banner {
  display: flex;
  align-items: center;
  padding: 38px 44px;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02), 0 10px 30px rgba(0, 0, 0, 0.03);
  gap: 32px;
  margin-bottom: 28px;
}
.avatar-wrapper {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border: 3px solid #ffffff;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 12px 32px rgba(59, 130, 246, 0.12);
  }
}
.user-avatar {
  width: 100%;
  height: 100%;
}
.avatar-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.48);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  opacity: 0;
  transition: opacity 0.3s ease;

  i {
    font-size: 20px;
    margin-bottom: 4px;
  }
  span {
    font-size: 11px;
    font-weight: 500;
  }
}
.avatar-wrapper:hover .avatar-hover-overlay {
  opacity: 1;
}

.profile-meta {
  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #1d1d1f;
    margin: 0 0 6px 0;
    letter-spacing: -0.5px;
  }
}
.user-email {
  font-size: 13.5px;
  color: #86868b;
  margin: 0 0 14px 0;
  display: flex;
  align-items: center;
  gap: 6px;

  i {
    font-size: 15px;
  }
}
.badge-row {
  display: flex;
  gap: 8px;
}
.user-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
  letter-spacing: 0.2px;
}
.rank-badge {
  background: rgba(59, 130, 246, 0.08);
  color: #3b82f6;
}
.wx-badge {
  background: rgba(63, 159, 63, 0.08);
  color: #3f9f3f;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 列表分组大区 */
.settings-section {
  padding: 0;
  margin-bottom: 28px;
}
.section-title {
  font-size: 13.5px;
  font-weight: 600;
  color: #86868b;
  margin: 0 0 12px 8px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.settings-group {
  border-radius: 20px;
  background: #ffffff;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02), 0 10px 30px rgba(0, 0, 0, 0.03);
}
.settings-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  background: #ffffff;
  transition: background-color 0.2s ease;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.035);
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.005);
  }
}

.row-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.row-icon {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.icon-user {
  background: rgba(59, 130, 246, 0.08);
  color: #3b82f6;
}
.icon-envelope {
  background: rgba(16, 185, 129, 0.08);
  color: #10b981;
}
.icon-lock {
  background: rgba(245, 158, 11, 0.08);
  color: #f59e0b;
}
.icon-phone {
  background: rgba(139, 92, 246, 0.08);
  color: #8b5cf6;
}

.row-label-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.row-title {
  font-size: 14.5px;
  font-weight: 600;
  color: #1d1d1f;
}
.row-subtitle {
  font-size: 12px;
  color: #86868b;
}

.row-right {
  display: flex;
  align-items: center;
  gap: 20px;
}
.row-value {
  font-size: 14px;
  color: #515154;
  font-weight: 500;
}

/* 胶囊轻按钮 (Apple Pill Button) */
.pill-action-btn {
  border: none;
  background: rgba(0, 0, 0, 0.04);
  color: #1d1d1f;
  padding: 6px 16px;
  height: auto;
  border-radius: 20px;
  font-size: 12.5px;
  font-weight: 600;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: rgba(0, 0, 0, 0.08);
    color: #000000;
  }
  &:active {
    transform: scale(0.96);
  }
}

/* 第三方授权模块 */
.third-party-group {
  display: grid;
  grid-template-columns: 1fr;
}
.third-party-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 24px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02), 0 10px 30px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(59, 130, 246, 0.2);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.06);
  }
}
.card-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.wx-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(63, 159, 63, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3f9f3f;
  font-size: 24px;
}
.card-meta {
  h4 {
    margin: 0 0 4px 0;
    font-size: 14.5px;
    font-weight: 600;
    color: #1d1d1f;
  }
  p {
    margin: 0;
    font-size: 12.5px;
  }
}
.bound-text {
  color: #3f9f3f;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}
.unbound-text {
  color: #86868b;
}

.card-right {
  display: flex;
  align-items: center;
}
.status-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
}
.status-tag.success {
  background: rgba(63, 159, 63, 0.08);
  color: #3f9f3f;
}
.status-tag.warning {
  background: rgba(245, 158, 11, 0.08);
  color: #f59e0b;
}
.pill-action-btn.bound-btn {
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

/* 微信扫码卡片专属 */
.wx-qrcode-wrapper {
  text-align: center;

  .qrcode-tip {
    font-size: 13px;
    color: #86868b;
    margin-top: 12px;
  }
}
</style>

<style lang="scss">
/* ==========================================================================
   深度覆盖 Element UI Dialog 及 Form 输入框样式，打造极致的高级毛玻璃及圆润观感
   ========================================================================== */
.member-dialog {
  border-radius: 20px !important;
  overflow: hidden !important;
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.12) !important;
  border: 1px solid rgba(255, 255, 255, 0.65) !important;
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  .el-dialog__header {
    padding: 26px 30px 10px 30px;
    text-align: center;
  }

  .el-dialog__title {
    font-weight: 600;
    font-size: 18px;
    color: #1d1d1f;
    letter-spacing: -0.3px;
  }

  .el-dialog__headerbtn {
    top: 26px;
    right: 30px;
    font-size: 16px;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.1);

      .el-dialog__close {
        color: #3b82f6;
      }
    }
  }

  .el-dialog__body {
    padding: 14px 30px 24px 30px;
  }

  .el-dialog__footer {
    padding: 16px 30px 26px 30px;
    border-top: 1px solid rgba(0, 0, 0, 0.035);

    .el-button {
      height: 38px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 13.5px;
      padding: 8px 22px;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .el-button--default {
      background: rgba(0, 0, 0, 0.04);
      border: none;
      color: #515154;

      &:hover {
        background: rgba(0, 0, 0, 0.08);
        color: #1d1d1f;
      }

      &:active {
        transform: scale(0.97);
      }
    }

    .el-button--primary {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border: none;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.18);

      &:hover {
        box-shadow: 0 6px 16px rgba(59, 130, 246, 0.26);
        transform: translateY(-0.5px);
        color: #ffffff;
      }

      &:active {
        transform: translateY(0.5px) scale(0.97);
      }
    }
  }

  /* 弹窗表单样式 */
  .el-form-item {
    margin-bottom: 0px;
  }

  .el-form-item__error {
    padding-top: 5px;
    left: 2px;
    font-size: 11.5px;
    color: #ff3b30;
  }

  .el-input .el-input__inner {
    border-radius: 10px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background-color: rgba(0, 0, 0, 0.015);
    height: 40px;
    line-height: 40px;
    padding: 0 14px 0 36px;
    font-size: 14px;
    color: #1d1d1f;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

    &::placeholder {
      color: #a1a1a6;
    }

    &:focus {
      border-color: #3b82f6;
      background-color: #ffffff;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
    }
  }

  .el-input .el-input__prefix {
    left: 10px;
    display: flex;
    align-items: center;
    color: #86868b;
    font-size: 16px;
  }

  .el-input .el-input__suffix {
    right: 10px;
    display: flex;
    align-items: center;

    .el-input__icon {
      line-height: 40px;
      color: #86868b;
    }
  }

  /* 手机号与验证码联合布局 */
  .phone-code-item .el-button {
    height: 40px;
    border-radius: 10px;
    font-weight: 600;
    background: rgba(0, 0, 0, 0.04);
    color: #1d1d1f;
    border: none;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.08);
    }

    &:active {
      transform: scale(0.97);
    }
  }
}
</style>
