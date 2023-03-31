<template>
  <div class="project-setting-view">
    <p class="project-setting-title">
      提交设置
      <span class="small-font-size ml20 text-secondary-color">
        自定义表单提交成功后的提示内容，以及可以跳转指定链接
      </span>
    </p>
    <el-divider />
    <el-form ref="submitSettingForm" :model="submitSettingForm" :rules="settingRules" @submit.native.prevent>
      <div class="setting-item">
        <p class="label" style="width: 30%">提交后显示方式</p>
        <el-radio-group v-model="submitSettingForm.submitShowType">
          <el-radio :label="1"> 系统默认提示 </el-radio>
          <el-radio :label="2"> 自定义文案 </el-radio>
        </el-radio-group>
      </div>
      <div v-if="submitSettingForm.submitShowType === 2" class="mt20">
        <el-input v-model="submitSettingForm.submitShowCustomPageContent" />
      </div>
      <div class="setting-item">
        <p class="label">提交后跳转网页地址</p>
        <el-switch v-model="submitSettingForm.submitJump" />
      </div>
      <el-form-item
        v-if="submitSettingForm.submitJump"
        prop="submitJumpUrl"
        :rules="[
          { required: true, message: '请输入跳转地址', trigger: 'blur' },
          {
            type: 'url',
            message: '请输入正确的url地址',
            trigger: ['blur', 'change']
          }
        ]"
      >
        <el-input v-model="submitSettingForm.submitJumpUrl" placeholder="https://demo.tduckapp.com" />
      </el-form-item>
      <div class="submit-btn">
        <el-button type="primary" @click="saveSettingHandle"> 保存设置 </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import mixin from './mixin'
import { getSettingRequest, saveSettingRequest } from '../../../api/project/setting'

export default {
  name: 'SubmitSetting',
  mixins: [mixin],
  data() {
    return {
      settingRules: {},
      submitSettingForm: {
        // 提交后显示类型
        submitShowType: 1,
        // 自定义显示内容
        submitShowCustomPageContent: '提交成功',
        submitJump: false,
        submitJumpUrl: '',
        publicResult: false
      }
    }
  },
  mounted() {
    this.queryUserProjectSetting()
  },
  destroyed() {},
  methods: {
    uploadSubmitPromptHandle(response) {
      this.submitSettingForm.promptImgUrl = response.data
    },
    queryUserProjectSetting() {
      getSettingRequest(this.formKey).then((res) => {
        if (res.data) {
          this.submitSettingForm = res.data
        }
      })
    },
    saveSettingHandle() {
      this.$refs['submitSettingForm'].validate((valid) => {
        // 图片检查
        if (this.submitSettingForm.promptImg && !this.submitSettingForm.promptImgUrl) {
          this.msgError('请上传提示图片')
          return
        }
        if (valid) {
          this.submitSettingForm.formKey = this.formKey
          saveSettingRequest(this.submitSettingForm).then(() => {
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
