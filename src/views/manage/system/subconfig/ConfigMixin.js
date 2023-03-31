import { getEnvConfig, saveEnvConfig } from '@/api/mange/config'

export default {
  data() {
    return {
      activeName: 'systemInfoConfig',
      form: {},
      config: {}
    }
  },
  created() {},
  methods: {
    async handleClick() {
      const res = await getEnvConfig(this.activeName)
      if (res.data) {
        this.config = res.data
        this.form = res.data.envValue
      } else {
        this.config = {}
        this.form = {}
      }
    },
    handleSubmit() {
      this.$refs[this.activeName].validate((valid) => {
        if (valid) {
          this.config.envKey = this.activeName
          this.config.envValue = this.form
          saveEnvConfig(this.config).then((res) => {
            this.msgSuccess('保存成功')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
