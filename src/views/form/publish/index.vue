<template>
  <div class="publish-container">
    <div class="publish-wrapper">
      <!-- 未发布状态 -->
      <transition name="el-fade-in-linear">
        <div v-if="!publishStatus" class="publish-ready-view">
          <div class="publish-ready-content">
            <div class="ready-illustration">
              <div class="icon-pulse-wrapper">
                <i class="el-icon-s-promotion"></i>
              </div>
            </div>
            <h2 class="ready-title">准备好发布您的表单了吗？</h2>
            <p class="ready-desc">发布后，您将获得专属的表单链接和二维码，随时分享给他人填写，并实时收集反馈数据。</p>

            <div class="feature-list">
              <div class="feature-item">
                <div class="feature-icon"><i class="el-icon-link"></i></div>
                <span>生成专属链接</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon"><i class="el-icon-mobile-phone"></i></div>
                <span>专属二维码分享</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon"><i class="el-icon-data-line"></i></div>
                <span>实时数据收集</span>
              </div>
            </div>

            <el-button class="publish-action-btn" type="primary" @click="publishProject" :loading="publishing">
              <i class="el-icon-video-play" v-if="!publishing"></i>
              {{ publishing ? '发布中...' : '立即发布' }}
            </el-button>
          </div>
        </div>
      </transition>

      <!-- 已发布状态 -->
      <transition name="el-fade-in-linear">
        <div v-if="publishStatus" class="publish-success-view">
          <div class="success-header">
            <div class="success-icon-wrapper">
              <i class="el-icon-check"></i>
            </div>
            <h2 class="success-title">发布成功，开始收集数据吧！</h2>
            <p class="success-desc">您的表单已成功发布，请选择以下方式分享给目标人群</p>
          </div>

          <div class="share-cards-container">
            <!-- 链接分享卡片 -->
            <div class="share-card link-card">
              <div class="card-header">
                <div class="header-icon"><i class="el-icon-link"></i></div>
                <h3>网页链接分享</h3>
              </div>
              <p class="card-desc">适合在微信、QQ、微博等社交平台直接发送</p>

              <div class="link-box-wrapper">
                <div class="link-box">
                  <span class="link-text">{{ writeLink }}</span>
                </div>
                <div class="link-actions">
                  <el-button
                    type="primary"
                    class="copy-btn"
                    v-clipboard:copy="writeLink"
                    v-clipboard:error="onCopyError"
                    v-clipboard:success="onCopySuccess"
                  >
                    复制链接
                  </el-button>
                  <el-tooltip content="在新标签页中打开链接预览" placement="top">
                    <el-button plain class="open-btn" @click="openLink(writeLink)">
                      <i class="el-icon-top-right"></i>
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
            </div>

            <!-- 二维码分享卡片 -->
            <div class="share-card qr-card">
              <div class="card-header">
                <div class="header-icon"><i class="el-icon-full-screen"></i></div>
                <h3>扫码填写</h3>
              </div>
              <p class="card-desc">适合线下海报、宣传单或面对面扫码</p>

              <div class="qr-box">
                <div class="qr-border">
                  <vue-qr v-if="writeLink" :callback="qrCodeGenSuccess" :size="160" :margin="10" :text="writeLink" />
                </div>
              </div>

              <div class="card-actions">
                <el-button type="primary" plain class="download-qr-btn" @click="downloadFile('qrcode.png', qrCodeUrl)">
                  <i class="el-icon-download"></i> 下载分享二维码
                </el-button>
              </div>
            </div>
          </div>

          <div class="bottom-actions">
            <el-button class="danger-hover-btn" @click="stopPublishProject">
              <i class="el-icon-video-pause"></i> 停止发布
            </el-button>
            <el-button type="primary" class="gradient-btn" @click="toFeedbackPageHandle">
              <i class="el-icon-s-data"></i> 查看数据反馈
            </el-button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import VueQr from 'vue-qr'
import { getFormStatusRequest, publishFormRequest, stopPublishFormRequest } from '@/api/project/publish'

export default {
  name: 'ProjectPublish',
  components: {
    VueQr
  },
  data() {
    return {
      publishStatus: false,
      publishing: false,
      formKey: '',
      writeLink: '',
      qrCodeUrl: ''
    }
  },
  mounted() {
    this.formKey = this.$route.query.key
    let url = window.location.protocol + '//' + window.location.host
    // 支持二级目录访问
    let publicPath = process.env.BASE_URL || '/'
    let modeSign = this.$router.mode == 'hash' ? '#' : ''
    this.writeLink = `${url}${publicPath}${modeSign}/s/${this.formKey}`
    this.getProjectStatus()
  },
  methods: {
    getProjectStatus() {
      getFormStatusRequest(this.formKey).then((res) => {
        if (res.data.status == 2) {
          this.publishStatus = true
        } else {
          this.publishStatus = false
        }
      })
    },
    publishProject() {
      this.publishing = true
      publishFormRequest({ formKey: this.formKey })
        .then(() => {
          this.publishStatus = true
          this.msgSuccess('发布成功')
        })
        .finally(() => {
          this.publishing = false
        })
    },
    stopPublishProject() {
      this.$confirm('停止发布后，用户将无法继续访问该表单。确定要停止发布吗？', '提示', {
        confirmButtonText: '确定停止',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          stopPublishFormRequest({ formKey: this.formKey }).then((res) => {
            if (res.data) {
              this.msgSuccess('停止成功')
              this.getProjectStatus()
            }
          })
        })
        .catch(() => {})
    },
    qrCodeGenSuccess(dataUrl) {
      this.qrCodeUrl = dataUrl
    },
    downloadFile(fileName, content) {
      let aLink = document.createElement('a')
      let blob = this.base64ToBlob(content)
      let evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true)
      aLink.download = fileName
      aLink.href = URL.createObjectURL(blob)
      aLink.click()
    },
    base64ToBlob(code) {
      let parts = code.split(';base64,')
      let contentType = parts[0].split(':')[1]
      let raw = window.atob(parts[1])
      let rawLength = raw.length
      let uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], { type: contentType })
    },
    toFeedbackPageHandle() {
      this.$router.replace({ path: '/project/form/statistics', query: { key: this.formKey } })
    },
    onCopySuccess() {
      this.msgSuccess('链接已复制到剪贴板')
    },
    onCopyError() {
      this.msgError('复制失败，请手动复制')
    },
    openLink(url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.publish-container {
  width: 100%;
  min-height: 100%;
  padding: 40px 20px;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
}

.publish-wrapper {
  width: 100%;
  max-width: 900px;
}

/* 未发布状态样式 */
.publish-ready-view {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  padding: 60px 40px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.02);

  .ready-illustration {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;

    .icon-pulse-wrapper {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      box-shadow: 0 8px 24px rgba(56, 189, 248, 0.2);

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: inherit;
        animation: pulse 2s infinite ease-in-out;
        z-index: 0;
      }

      i {
        font-size: 48px;
        color: #0284c7;
        z-index: 1;
      }
    }
  }

  .ready-title {
    font-size: 28px;
    color: #1e293b;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .ready-desc {
    font-size: 16px;
    color: #64748b;
    max-width: 500px;
    margin: 0 auto 40px;
    line-height: 1.6;
  }

  .feature-list {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 50px;

    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      .feature-icon {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        background: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;

        i {
          font-size: 24px;
          color: #475569;
        }
      }

      span {
        font-size: 15px;
        color: #334155;
        font-weight: 500;
      }

      &:hover .feature-icon {
        background: #e2e8f0;
        transform: translateY(-5px);

        i {
          color: #0f172a;
        }
      }
    }
  }

  .publish-action-btn {
    padding: 16px 48px;
    font-size: 18px;
    border-radius: 12px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
    transition: all 0.3s ease;

    i {
      margin-right: 8px;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(37, 99, 235, 0.4);
    }
  }
}

/* 已发布状态样式 */
.publish-success-view {
  background: transparent;
}

.success-header {
  text-align: center;
  margin-bottom: 40px;

  .success-icon-wrapper {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #dcfce7;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    box-shadow: 0 8px 24px rgba(34, 197, 94, 0.2);

    i {
      font-size: 40px;
      color: #16a34a;
    }
  }

  .success-title {
    font-size: 28px;
    color: #1e293b;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .success-desc {
    font-size: 16px;
    color: #64748b;
  }
}

.share-cards-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 30px;
}

.share-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .header-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: #eff6ff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;

      i {
        font-size: 20px;
        color: #3b82f6;
      }
    }

    h3 {
      font-size: 20px;
      color: #1e293b;
      margin: 0;
      font-weight: 600;
    }
  }

  .card-desc {
    color: #64748b;
    font-size: 14px;
    margin: 0 0 24px;
  }
}

.link-card {
  .link-box-wrapper {
    margin-top: auto;
  }

  .link-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    word-break: break-all;

    .link-text {
      color: #334155;
      font-size: 15px;
      font-weight: 500;
      line-height: 1.5;
    }
  }

  .link-actions {
    display: flex;
    gap: 12px;

    .copy-btn {
      flex: 1;
      border-radius: 10px;
      height: 44px;
    }

    .open-btn {
      width: 44px;
      height: 44px;
      padding: 0;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 18px;
      }
    }
  }
}

.qr-card {
  .qr-box {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    margin-top: auto;

    .qr-border {
      padding: 10px;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      background: #ffffff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
    }
  }

  .card-actions {
    .download-qr-btn {
      width: 100%;
      height: 44px;
      border-radius: 10px;
      border-color: #bfdbfe;
      color: #2563eb;

      &:hover {
        background: #eff6ff;
        border-color: #93c5fd;
      }
    }
  }
}

.bottom-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;

  .el-button {
    padding: 14px 32px;
    font-size: 16px;
    border-radius: 12px;
    transition: all 0.3s ease;

    i {
      margin-right: 6px;
    }
  }

  .danger-hover-btn {
    border: 1px solid #cbd5e1;
    color: #475569;

    &:hover {
      color: #ef4444;
      border-color: #fca5a5;
      background: #fef2f2;
    }
  }

  .gradient-btn {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.2);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  70% {
    transform: scale(1.3);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .share-cards-container {
    grid-template-columns: 1fr;
  }

  .publish-ready-view {
    padding: 40px 20px;

    .feature-list {
      flex-direction: column;
      gap: 20px;
    }
  }

  .bottom-actions {
    flex-direction: column;

    .el-button {
      width: 100%;
      margin-left: 0 !important;
    }
  }
}
</style>
