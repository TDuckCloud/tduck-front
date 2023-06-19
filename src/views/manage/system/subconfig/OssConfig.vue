<template>
  <div>
    <el-alert class="title" title="* 请注意，更改此配置后，需要重启后端项目才能生效" type="info">
      <a
        href="https://doc.tduckcloud.com/openSource/configure/fileConfigure.html"
        target="_blank"
        style="color: #0080ff"
        type="primary"
      >
        文件配置文档</a
      >
    </el-alert>

    <el-form class="form" ref="fileEnvConfig" :model="form" label-width="150px">
      <el-form-item
        label="存储平台"
        prop="ossType"
        :rules="[{ required: true, message: '请选择存储平台', trigger: 'blur' }]"
      >
        <el-select v-model="form.ossType" placeholder="请选择存储平台">
          <el-option label="阿里云" value="ALIYUN" />
          <el-option label="七牛云" value="QINIU" />
          <el-option label="又拍云" value="UPYUN" />
          <el-option label="本地" value="LOCAL" />
          <el-option label="通用S3" value="S3" />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.ossType !== 'LOCAL'"
        label="AccessKeyID"
        prop="accessKeyId"
        :rules="[{ required: true, message: '请输入AccessKeyID', trigger: 'blur' }]"
      >
        <el-input class="input" v-model="form.accessKeyId" placeholder="请输入AccessKeyID" />
      </el-form-item>
      <el-form-item
        v-if="form.ossType !== 'LOCAL'"
        label="AccessKeySecret"
        prop="accessKeySecret"
        :rules="[{ required: true, message: '请输入AccessKeySecret', trigger: 'blur' }]"
      >
        <el-input v-model="form.accessKeySecret" placeholder="请输入accessKeySecret" />
      </el-form-item>
      <el-form-item
        v-if="form.ossType === 'ALIYUN' || form.ossType === 'S3'"
        label="Endpoint"
        prop="endpoint"
        :rules="[{ required: true, message: '请输入Endpoint', trigger: 'blur' }]"
      >
        <el-input v-model="form.endpoint" placeholder="请输入Endpoint" />
      </el-form-item>
      <el-form-item
        v-if="form.ossType !== 'LOCAL'"
        label="bucketName"
        prop="bucketName"
        :rules="[{ required: true, message: '请输入bucketName', trigger: 'blur' }]"
      >
        <el-input v-model="form.bucketName" placeholder="请输入bucketName" />
      </el-form-item>
      <el-form-item
        v-if="form.ossType === 'LOCAL'"
        label="存储路径"
        prop="uploadFolder"
        :rules="[{ required: true, message: '请输入存储路径', trigger: 'blur' }]"
      >
        <el-input v-model="form.uploadFolder" placeholder="请输入存储路径" />
      </el-form-item>
      <el-form-item
        label="访问域名"
        prop="domain"
        :rules="[{ required: true, message: '请输入能访问文件的域名', trigger: 'blur' }]"
      >
        <el-input v-model="form.domain" placeholder="请输入能访问文件的域名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit"> 保存 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ConfigMixin from './ConfigMixin'

export default {
  name: 'OssConfig',
  mixins: [ConfigMixin],
  data() {
    return {}
  },
  async created() {
    this.activeName = 'fileEnvConfig'
    await this.handleClick()
  },
  mounted() {}
}
</script>

<style scoped>
.form {
  margin-top: 20px;
  width: 600px;
}
</style>
