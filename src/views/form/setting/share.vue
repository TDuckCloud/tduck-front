<template>
  <div class="project-setting-view">
    <p class="project-setting-title">
      分享设置
      <span class="small-font-size ml20 text-secondary-color"> 自定义表单在微信分享的标题以及图片等 </span>
    </p>
    <el-divider />
    <el-form ref="shareSettingForm" :model="shareSettingForm">
      <div class="setting-item">
        <p class="label">自定义分享图标</p>
        <el-switch v-model="shareSettingForm.shareWxImg" />
      </div>
      <div v-if="shareSettingForm.shareWxImg">
        <p class="project-setting-label">请上传分享图片 * 建议尺寸500px*500px</p>
        <el-upload
          ref="logoUpload"
          :action="getUploadUrl"
          :headers="getUploadHeader"
          :on-success="uploadShareImgHandle"
          :show-file-list="false"
          accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
        >
          <div class="block">
            <el-image :src="shareSettingForm.shareWxImgUrl" class="share-img" fit="cover ">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </div>
        </el-upload>
      </div>
      <div class="setting-item">
        <p class="label">自定义分享标题</p>
        <el-switch v-model="shareSettingForm.shareWxTitle" />
      </div>
      <el-form-item
        v-if="shareSettingForm.shareWxTitle"
        :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]"
        prop="shareWxTitleContent"
      >
        <el-input v-model="shareSettingForm.shareWxTitleContent" placeholder="请输入标题" />
      </el-form-item>
      <div class="setting-item">
        <p class="label">自定义分享描述</p>
        <el-switch v-model="shareSettingForm.shareWxDesc" />
      </div>
      <el-form-item
        v-if="shareSettingForm.shareWxDesc"
        :rules="[{ required: true, message: '请输入描述', trigger: 'blur' }]"
        prop="shareWxDescContent"
      >
        <el-input v-model="shareSettingForm.shareWxDescContent" placeholder="请输入描述" />
      </el-form-item>
      <div class="submit-btn">
        <el-button type="primary" @click="saveSettingHandle"> 保存设置 </el-button>
      </div>
    </el-form>
    <div v-if="shareSettingForm.shareWxDesc || shareSettingForm.shareWxTitle || shareSettingForm.shareWxImg">
      <div class="share-preview">
        <div class="share-preview-msg">
          <p class="share-preview-msg-title">
            {{ shareSettingForm.shareWxTitleContent }}
          </p>
          <div class="share-preview-body">
            <p class="share-preview-msg-desc">
              {{ shareSettingForm.shareWxDescContent }}
            </p>
            <img
              v-if="shareSettingForm.shareWxImgUrl"
              :src="shareSettingForm.shareWxImgUrl"
              class="share-preview-img"
            />
          </div>
          <img :src="getUserInfos.avatar" class="share-user-avatar" />
        </div>
        <div class="user-avatar-place" />
      </div>
    </div>
  </div>
</template>

<script>
import mixin from './mixin'
import { getSettingRequest, saveSettingRequest } from '../../../api/project/setting'

export default {
  name: 'ShareSetting',
  mixins: [mixin],
  data() {
    return {
      shareSettingForm: {
        shareWxImg: false,
        shareWxImgUrl: null,
        shareWxTitle: false,
        shareWxTitleContent: null,
        shareWxDesc: false,
        shareWxDescContent: null
      }
    }
  },
  computed: {
    getUserInfos() {
      return this.$store.state.user
    }
  },
  mounted() {
    this.formKey = this.$route.query.key
    this.queryUserProjectSetting()
  },
  destroyed() {},
  methods: {
    uploadShareImgHandle(response) {
      this.shareSettingForm.shareWxImgUrl = response.data
    },
    queryUserProjectSetting() {
      getSettingRequest(this.formKey).then((res) => {
        if (res.data) {
          this.shareSettingForm = res.data
        }
      })
    },
    saveSettingHandle() {
      this.$refs['shareSettingForm'].validate((valid) => {
        // 图片检查
        if (this.shareSettingForm.shareWxImg && !this.shareSettingForm.shareWxImgUrl) {
          this.msgError('请上传分享显示图片')
          return
        }
        if (valid) {
          this.shareSettingForm.formKey = this.formKey
          saveSettingRequest(this.shareSettingForm).then(() => {
            this.msgSuccess('保存成功')
            this.queryUserProjectSetting()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'settting';

.share-img {
  width: 123px;
  height: 117px;
  background-color: #f7f7f7;
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: center;
}

.share-preview {
  width: 360px;
  height: 162px;
  margin: 0 auto;
  border-radius: 5px;
  background-color: rgba(210, 210, 210, 42);
  border: 1px solid rgba(255, 255, 255, 100);
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-around;
}

.share-preview-msg {
  width: 240px;
  border-radius: 5px;
  background-color: white;
  color: rgba(16, 16, 16, 100);
  box-shadow: 0 0 3px 0 rgba(157, 158, 162, 100);
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  justify-content: center;
  position: relative;
}

.share-preview-msg::after {
  content: '';
  border: 8px solid transparent;
  border-left-color: #fff;
  position: absolute;
  right: -14px;
  top: 14px;
  width: 0;
}

.share-preview-msg-title {
  width: 100%;
  line-height: 22px;
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
  text-align: left;

  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-wrap: break-word;
}

.share-preview-body {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 5px;
}

.share-preview-msg-desc {
  flex: 1;
  color: rgba(144, 147, 153, 100);
  font-size: 12px;
  line-height: 18px;
  text-align: left;
  min-height: 49px;

  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  word-wrap: break-word;
}

.share-preview-img {
  width: 49px;
  height: 49px;
  margin-left: 10px;
}

.share-user-avatar {
  width: 49px;
  height: 49px;
  border-radius: 6px;

  position: absolute;
  right: -65px;
  top: 0;
}
</style>
