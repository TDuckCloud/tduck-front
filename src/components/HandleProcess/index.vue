<template>
  <el-dialog title="提示" :visible.sync="dialogVisible" :before-close="handleClose" width="30%">
    <p style="text-align: center; color: #a1a1a1">{{ percentage >= 100 ? completeMessage : message }}</p>
    <el-progress :percentage="percentage" />
    <el-link v-if="downloadUrl" :href="downloadUrl" type="primary"> 下载地址 </el-link>
  </el-dialog>
</template>

<script>
export default {
  name: 'HandleProcess',
  props: {},
  data() {
    return {
      completeMessage: '已完成',
      message: '处理中',
      downloadUrl: '',
      key: '',
      timer: null,
      percentage: 0,
      dialogVisible: true
    }
  },
  created() {
    this.getHandleProcess()
    this.timer = setInterval(() => {
      this.getHandleProcess()
    }, 5000)
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    /**
     * 获取处理进去
     */
    getHandleProcess() {
      this.$api.get(`/common/process?key=${this.key}`).then((res) => {
        let { rate, url } = res.data
        if (rate) {
          this.percentage = rate
        }
        if (url) {
          this.downloadUrl = url
          clearInterval(this.timer)
        }
      })
    },
    handleClose() {
      clearInterval(this.timer)
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
</script>
