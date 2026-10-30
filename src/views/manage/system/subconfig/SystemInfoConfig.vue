<template>
  <div class="config-form-wrapper">
    <el-form v-if="!loading" ref="systemInfoConfig" :model="form" label-position="top" class="modern-form">
      <el-form-item label="系统当前版本">
        <el-tag effect="light" class="modern-tag">V6.1</el-tag>
        <div class="form-hint">当前系统运行的基础版本号</div>
      </el-form-item>

      <el-form-item
        label="系统名称 (System Name)"
        prop="systemName"
        :rules="[{ required: true, message: '请输入系统名称', trigger: 'blur' }]"
      >
        <el-input v-model="form.systemName" placeholder="例如：Tduck 表单系统" class="modern-input" />
        <div class="form-hint">显示在浏览器标签页标题及系统多处文案中的名称</div>
      </el-form-item>

      <el-form-item label="允许微信公众号登录" prop="openWxMpLogin">
        <el-switch v-model="form.openWxMpLogin" class="modern-switch" />
        <div class="form-hint">
          *
          开启公众号扫码登录功能前，请确保在“微信公众号”配置页填入了正确的开发参数，并<strong>重启后端服务</strong>使配置生效。
        </div>
      </el-form-item>

      <el-form-item
        label="系统基础域名 (Base URL)"
        prop="webBaseUrl"
        :rules="[{ required: true, message: '请输入项目前端所在域名', trigger: 'blur' }]"
      >
        <el-input v-model="form.webBaseUrl" placeholder="例如：https://pro.tduckcloud.com/" class="modern-input" />
        <div class="form-hint">
          * 请填写前端站点实际访问的完整域名，带上协议头（http:// 或 https://），并以斜杠 (/)
          结尾。用于拼接二维码及访问链接。
        </div>
      </el-form-item>

      <el-form-item label="版权说明信息 (Copyright)" prop="copyright">
        <div class="editor-container">
          <tinymce
            v-model="form.copyright"
            toolbar="fontsizeselect bold italic underline strikethrough undo redo blockquote removeformat alignleft aligncenter alignright hr link charmap preview forecolor backcolor fullscreen"
            placeholder="请输入底部的版权说明"
          />
        </div>
        <div class="form-hint">* 显示在表单收集页及系统底部的版权声明信息，支持富文本格式。</div>
      </el-form-item>

      <el-form-item class="form-action">
        <el-button type="primary" class="modern-btn" @click="handleSubmit"> 保 存 配 置 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ConfigMixin from './ConfigMixin'
import Tinymce from '@/components/tinymce/index.vue'
export default {
  name: 'SystemInfoConfig',
  mixins: [ConfigMixin],
  components: {
    Tinymce
  },
  data() {
    return {
      loading: true,
      thirdPartyLoginTypeList: [
        {
          label: '微信',
          value: 'wechatOpen'
        },
        {
          label: '企业微信',
          value: 'wechatEnterprise'
        }
      ]
    }
  },
  async created() {
    await this.handleClick()
    // 判断是否有thirdPartyLoginTypeList 没有的话给加一个 新版本加的 不然会报错
    if (!this.form.thirdPartyLoginTypeList) {
      this.$set(this.form, 'thirdPartyLoginTypeList', [])
      this.$set(this.form, 'allowThirdPartyLogin', false)
    }
    this.loading = false
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.config-form-wrapper {
  max-width: 800px;
  margin-top: 32px;
  margin-left: 16px;
}

.modern-form {
  ::v-deep .el-form-item {
    margin-bottom: 28px;

    .el-form-item__label {
      font-weight: 600;
      color: #1e293b;
      padding-bottom: 8px;
      line-height: 1.4;
    }
  }

  .form-hint {
    font-size: 13px;
    color: #94a3b8;
    margin-top: 6px;
    line-height: 1.5;
  }

  .form-action {
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid #f1f5f9;
  }
}

.modern-input {
  ::v-deep .el-input__inner {
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    padding: 0 16px;
    height: 42px;
    line-height: 42px;
    transition: all 0.2s ease;
    font-size: 14px;
    color: #334155;

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }

    &::placeholder {
      color: #94a3b8;
    }
  }
}

.modern-tag {
  border-radius: 6px;
  padding: 0 12px;
  height: 28px;
  line-height: 26px;
  border: none;
  font-weight: 600;
  background-color: #eff6ff;
  color: #3b82f6;
}

.editor-container {
  /* removed to avoid clipping TinyMCE default border */
}

.modern-btn {
  border-radius: 8px;
  font-weight: 500;
  padding: 12px 32px;
  font-size: 14px;
  transition: all 0.2s;
  border: none;

  &.el-button--primary {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

    &:hover {
      background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }

    &:active {
      transform: translateY(1px);
    }
  }
}
</style>
