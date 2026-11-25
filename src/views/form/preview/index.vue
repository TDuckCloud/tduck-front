<template>
  <div class="preview-container">
    <div v-if="displayClose" class="preview-close-btn" @click="$emit('close')" title="关闭预览">
      <i class="el-icon-close" />
    </div>

    <el-tabs v-if="formConfig.formKey" type="card" class="custom-preview-tabs">
      <el-tab-pane>
        <span slot="label"> <i class="el-icon-mobile" /> 手机 </span>
        <div class="preview-layer">
          <div class="preview-phone">
            <iframe
              id="preview-html"
              :src="mobilePreviewUrl"
              class="preview-html"
              frameborder="0"
              name="preview-html"
              scrolling="auto"
            />
          </div>
        </div>
        <div v-if="mobilePreviewUrl && previewQrcode" class="qrcode-view">
          <div class="qrcode-card">
            <h3 class="qrcode-title">手机扫码预览</h3>
            <div class="qrcode-wrapper">
              <vue-qr v-if="mobilePreviewUrl && previewQrcode" :size="140" :margin="0" :text="mobilePreviewUrl" />
            </div>
            <p class="tips-text"><i class="el-icon-info"></i> 仅查看效果无法提交</p>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane>
        <span slot="label"> <i class="el-icon-monitor" /> 电脑 </span>
        <el-scrollbar style="height: calc(100vh - 120px); overflow-x: hidden !important">
          <div class="pc-preview-wrapper">
            <biz-project-form v-if="formConfig.formKey" :form-config="formConfig" />
          </div>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { BizProjectForm } from 'tduck-form-generator'
import 'tduck-form-generator/dist/TduckForm.css'
import VueQr from 'vue-qr'
import mixin from '../TduckFormMixin'

export default {
  name: 'PreView',
  components: {
    BizProjectForm,
    VueQr
  },
  mixins: [mixin],
  props: {
    previewQrcode: null,
    showClose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formKey: null,
      mobilePreviewUrl: '',
      formConfig: {
        formKey: '',
        showBtns: true
      }
    }
  },
  mounted() {
    this.formKey = this.$route.query.key
    let url = window.location.protocol + '//' + window.location.host
    // 支持二级目录访问
    let publicPath = process.env.BASE_URL || '/'
    let modeSign = this.$router.mode == 'hash' ? '#' : ''
    this.mobilePreviewUrl = `${url}${publicPath}${modeSign}/project/form/view?key=${this.formKey}`
    this.$set(this.formConfig, 'formKey', this.formKey)
  },
  computed: {
    displayClose() {
      if (this.showClose === false) {
        return false
      }
      if (this.$route.query.showClose === 'false' || this.$route.query.showClose === false) {
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-container {
  margin: 0;
  padding-top: 32px;
  height: 100vh;
  overflow: hidden !important;
  background-color: #f7f8fa;
  position: relative;
}

.preview-close-btn {
  position: absolute;
  top: 24px;
  right: 32px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 2000;

  i {
    font-size: 22px;
    color: #4b5563;
    transition: color 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);

    i {
      color: #1f2937;
    }
  }
}

::v-deep .custom-preview-tabs {
  > .el-tabs__header {
    width: max-content;
    margin: 0 auto 30px auto;
    border: none;

    .el-tabs__nav {
      border: none !important;
      border-radius: 12px;
      background-color: #f1f3f5;
      padding: 6px;
      display: flex;
    }

    .el-tabs__item {
      border: none !important;
      border-radius: 8px;
      height: 40px;
      line-height: 40px;
      padding: 0 32px !important;
      margin: 0;
      color: #6b7280;
      font-size: 15px;
      font-weight: 500;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      align-items: center;
      gap: 6px;

      i {
        font-size: 18px;
        margin-right: 4px;
      }

      &.is-active {
        background-color: #ffffff;
        color: #3370ff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        font-weight: 600;
      }

      &:hover:not(.is-active) {
        color: #374151;
      }
    }
  }
}

.pc-preview-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 16px;
  min-height: 800px;
  padding: 40px;
}

div.preview-layer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: relative;
}

div.preview-layer .preview-phone {
  width: 372px;
  height: 744px;
  background: url('~@/assets/images/appearset_bgc_big.png') no-repeat center center;
  background-size: contain;
  z-index: 1000;
  position: relative;
}

.qrcode-view {
  position: absolute;
  top: 140px;
  left: calc(50% + 220px);
  z-index: 100;
}

.qrcode-card {
  width: 220px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  }

  .qrcode-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 16px 0;
    letter-spacing: 0.5px;
  }

  .qrcode-wrapper {
    background: #f9fafb;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #f3f4f6;
    margin-bottom: 16px;
    transition: all 0.3s ease;

    &:hover {
      border-color: #e5e7eb;
      background: #ffffff;
    }

    img {
      border-radius: 8px;
      display: block;
    }
  }

  .tips-text {
    font-size: 12px;
    color: #6b7280;
    margin: 0;
    text-align: center;
    line-height: 1.5;
    display: flex;
    align-items: center;
    gap: 6px;

    i {
      color: #9ca3af;
      font-size: 14px;
    }
  }
}

.preview-html {
  width: 345px !important;
  height: 568px !important;
  margin: 74px 0 0 14px;
  border-radius: 5px;
  outline: none;
  background-color: #fff;
  border: none;
}

::v-deep .project-form-wrapper {
  background: transparent !important;
  min-height: auto !important;
  padding: 0 !important;
}

::v-deep .project-form {
  box-shadow: none !important;
}
</style>
