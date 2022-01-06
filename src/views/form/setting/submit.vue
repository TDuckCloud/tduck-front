<template>
    <div class="project-setting-view">
        <el-form ref="submitSettingForm" :model="submitSettingForm" :rules="settingRules">
            <p class="project-setting-title">
                提交设置
            </p>
            <div class="setting-item">
                <p class="label">
                    显示提示图片
                </p>
                <el-switch v-model="submitSettingForm.promptImg" />
            </div>
            <div v-if="submitSettingForm.promptImg">
                <div class="block">
                    <el-image
                        :src="submitSettingForm.promptImgUrl"
                        class="submit-prompt-img"
                        fit="cover "
                    >
                        <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline" />
                        </div>
                    </el-image>
                </div>
                <el-upload
                    ref="logoUpload"
                    :action="getUploadUrl"
                    :headers="getUploadHeader"
                    :on-success="uploadSubmitPromptHandle"
                    :show-file-list="false"
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                >
                    <el-button slot="trigger" size="small" type="text">
                        请上传提示图片 *
                    </el-button>
                </el-upload>
            </div>
            <div class="setting-item">
                <p class="label">
                    显示提示文字
                </p>
                <el-switch v-model="submitSettingForm.promptText" />
            </div>
            <el-form-item v-if="submitSettingForm.promptText" prop="promptTextContent" :rules="[{ required: true, message: '请输入提示内容', trigger: 'blur' }]">
                <el-input v-model="submitSettingForm.promptTextContent" placeholder="提交成功 !" />
            </el-form-item>
            <div class="setting-item">
                <p class="label">
                    跳转网页地址
                </p>
                <el-switch v-model="submitSettingForm.submitJump" />
            </div>
            <el-form-item v-if="submitSettingForm.submitJump" prop="submitJumpUrl"
                          :rules="[{ required: true, message: '请输入跳转地址', trigger: 'blur' }, { type: 'url', message: '请输入正确的url地址', trigger: ['blur', 'change'] }]"
            >
                <el-input v-model="submitSettingForm.submitJumpUrl" placeholder="https://demo.tduckapp.com" />
            </el-form-item>
            <!--      <div class="setting-item">-->
            <!--        <p class="label">-->
            <!--          公开反馈结果-->
            <!--        </p>-->
            <!--        <el-switch-->
            <!--          v-model="submitSettingForm.publicResult"-->
            <!--        />-->
            <!--      </div>-->
            <div class="submit-btn">
                <el-button type="primary" @click="saveSettingHandle">
                    保存设置
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import mixin from './mixin'
import {getSubmitSettingRequest, saveSubmitSettingRequest} from '@/api/project/setting.js'
export default {
    name: 'ProjectSetting',
    mixins: [mixin],
    data() {
        return {
            settingRules: {
            },
            submitSettingForm: {
                promptImg: false,
                promptImgUrl: '',
                promptText: false,
                promptTextContent: '',
                submitJump: false,
                submitJumpUrl: '',
                publicResult: false
            }
        }
    },
    mounted() {
        this.queryUserProjectSetting()
    },
    destroyed() {
    },
    methods: {
        uploadSubmitPromptHandle(response) {
            this.submitSettingForm.promptImgUrl = response.data
        },
        queryUserProjectSetting() {
            getSubmitSettingRequest(this.formKey).then(res => {
                if (res.data) {
                    this.submitSettingForm = res.data
                }
            })
        },
        saveSettingHandle() {
            this.$refs['submitSettingForm'].validate(valid => {
                // 图片检查
                if (this.submitSettingForm.promptImg && !this.submitSettingForm.promptImgUrl) {
                    this.msgError('请上传提示图片')
                    return
                }
                if (valid) {
                    this.submitSettingForm.formKey = this.formKey
                    saveSubmitSettingRequest(this.submitSettingForm).then(() => {
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
.submit-prompt-img {
  width: 100%;
  height: 117px;
  background-color: #f7f7f7;
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: center;
}

</style>
