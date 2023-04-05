<template>
  <!-- 数据导入 -->
  <el-dialog :title="upload.title" :visible.sync="upload.open" append-to-body width="400px">
    <el-upload
      ref="upload"
      :action="upload.url + '?updateSupport=' + upload.updateSupport"
      :disabled="upload.isUploading"
      :headers="upload.headers"
      :limit="1"
      :data="upload.data"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      accept=".xlsx, .xls"
      class="upload-demo"
      drag
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">
        为保证数据导入顺利，推荐您使用:
        <el-link style="font-size: 12px" type="primary" @click="importTemplate"> 下载模板 </el-link>
      </div>
      <div slot="tip" class="el-upload__tip">只能上传xls、xlsx格式文件，且不超过2MB</div>
      <div slot="tip" class="el-upload__tip text-danger">
        导入目前只能支持如文本、数字、单选、多选、下拉、日期时间、评分、图片选择、滑块、上传、签名、省市、地理位置、手机号等。
      </div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitFileForm"> 确 定 </el-button>
      <el-button @click="upload.open = false"> 取 消 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth'
import { downloadImportTemplateRequest } from '@/api/project/data'

export default {
  name: 'Import',
  props: {
    formKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      upload: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: '数据导入',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        data: {
          formKey: ''
        },
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_API_ROOT + '/user/form/data/import'
      }
    }
  },
  created() {
    this.upload.data.formKey = this.formKey
  },
  methods: {
    /** 下载模板操作 */
    importTemplate() {
      downloadImportTemplateRequest({ formKey: this.formKey }).then((response) => {
        this.download(response, '导入表单数据模板')
      })
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert(response.data, '导入结果', { dangerouslyUseHTMLString: true })
      this.$emit('success')
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style scoped></style>
