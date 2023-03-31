<template>
  <biz-project-form v-if="formConfig.formKey" :form-config="formConfig" @submit="submitForm" />
</template>

<script>
import { BizProjectForm } from 'tduck-form-generator'
import 'tduck-form-generator/dist/TduckForm.css'
import mixin from '../TduckFormMixin'

export default {
  components: {
    BizProjectForm
  },
  mixins: [mixin],
  data() {
    return {
      formConfig: {
        formKey: '',
        preview: true,
        showBtns: true
      }
    }
  },
  created() {
    this.formConfig.formKey = this.$route.query.key
  },
  methods: {
    submitForm() {
      this.msgError('预览无法提交数据')
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .project-form {
  overflow-x: hidden !important;
  padding: 5px !important;
}
::v-deep .project-form {
  padding: 20px;
}
</style>
