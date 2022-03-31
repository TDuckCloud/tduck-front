<template>
    <div class="project-setting-view ">
        <p class="project-setting-title">
            分享设置
        </p>
        <el-form ref="shareSettingForm" :model="shareSettingForm">
            <div class="setting-item">
                <p class="label">
                    自定义分享图标
                </p>
                <el-switch v-model="shareSettingForm.shareImg" />
            </div>
            <div v-if="shareSettingForm.shareImg">
                <p class="project-setting-label">
                    请上传分享图片 *
                    建议尺寸500px*500px
                </p>
                <el-upload
                    ref="logoUpload"
                    :action="getUploadUrl"
                    :headers="getUploadHeader"
                    :on-success="uploadShareImgHandle"
                    :show-file-list="false"
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                >
                    <div class="block">
                        <el-image
                            :src="shareSettingForm.shareImgUrl"
                            class="share-img"
                            fit="cover "
                        >
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline" />
                            </div>
                        </el-image>
                    </div>
                </el-upload>
            </div>
            <div class="setting-item">
                <p class="label">
                    自定义分享标题
                </p>
                <el-switch v-model="shareSettingForm.shareTitle" />
            </div>
            <el-form-item v-if="shareSettingForm.shareTitle" :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]"
                          prop="shareTitleContent"
            >
                <el-input
                    v-model="shareSettingForm.shareTitleContent"
                    placeholder="请输入标题"
                />
            </el-form-item>
            <div class="setting-item">
                <p class="label">
                    自定义分享描述
                </p>
                <el-switch v-model="shareSettingForm.shareDesc" />
            </div>
            <el-form-item v-if="shareSettingForm.shareDesc" :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]"
                          prop="shareDescContent"
            >
                <el-input v-model="shareSettingForm.shareDescContent" placeholder="请输入描述" />
            </el-form-item>
            <div class="submit-btn">
                <el-button type="primary" @click="saveSettingHandle">
                    保存设置
                </el-button>
            </div>
        </el-form>
        <div v-if="shareSettingForm.shareDesc||shareSettingForm.shareTitle||shareSettingForm.shareImg">
            <div class="share-preview">
                <div class="share-preview-msg">
                    <div>
                        <p class="share-preview-msg-title">
                            {{ shareSettingForm.shareTitleContent }}
                        </p>
                        <p class="share-preview-msg-desc">
                            {{ shareSettingForm.shareDescContent }}
                        </p>
                    </div>
                    <div>
                        <img v-if="shareSettingForm.shareImgUrl" :src="shareSettingForm.shareImgUrl"
                             class="share-preview-img"
                        >
                    </div>
                </div>
                <div>
                    <!--                        <img :src="" class="share-user-avatar">-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import mixin from './mixin'
import {getShareSettingRequest, saveShareSettingRequest} from '@/api/project/setting.js'

export default {
    name: 'ShareSetting',
    mixins: [mixin],
    data() {
        return {
            shareSettingForm: {
                shareImg: false,
                shareImgUrl: null,
                shareTitle: false,
                shareTitleContent: null,
                shareDesc: false,
                shareDescContent: null
            }
        }
    },
    mounted() {
        this.formKey = this.$route.query.key
        this.queryUserProjectSetting()
    },
    destroyed() {
    },
    methods: {
        uploadShareImgHandle(response) {
            this.shareSettingForm.shareImgUrl = response.data
        },
        queryUserProjectSetting() {
            getShareSettingRequest(this.formKey).then(res => {
                if (res.data) {
                    this.shareSettingForm = res.data
                }
            })
        },
        saveSettingHandle() {
            this.$refs['shareSettingForm'].validate(valid => {
                // 图片检查
                if (this.shareSettingForm.shareImg && !this.shareSettingForm.shareImgUrl) {
                    this.msgError('请上传分享显示图片')
                    return
                }
                if (valid) {
                    this.shareSettingForm.formKey = this.formKey
                    saveShareSettingRequest(this.shareSettingForm).then(() => {
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
@import "settting";

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
  width: 210px;
  height: 88px;
  border-radius: 5px;
  background-color: white;
  color: rgba(16, 16, 16, 100);
  box-shadow: 0 0 3px 0 rgba(157, 158, 162, 100);
  padding: 5px;
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: center;
  position: relative;
}

.share-preview-msg::after {
  content: '';
  border: 10px solid transparent;
  border-left-color: #fff;
  position: absolute;
  right: -18px;
  top: 5px;
  width: 0;
}

.share-preview-msg-title {
  line-height: 22px;
  height: 25px;
  margin: 3px;
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
  text-align: left;
}

.share-preview-msg-desc {
  margin: 3px;
  color: rgba(144, 147, 153, 100);
  font-size: 12px;
  line-height: 20px;
  height: 60px;
  width: 155px;
  text-align: left;
}

.share-preview-img {
  width: 49px;
  height: 46px;
  margin-right: 5px;
}

.share-user-avatar {
  width: 49px;
  height: 49px;
  border-radius: 6px;
}

</style>
