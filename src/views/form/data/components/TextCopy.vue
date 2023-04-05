<template>
  <div ref="showPanel" class="text-copy" :class="{ 'box-focus': isShow }" @click="handleCopy">
    <div class="body">
      <span class="pl10">{{ text }}</span>
      <el-link
        v-if="isShow"
        v-clipboard:copy="text"
        v-clipboard:error="
          () => {
            msgError('复制失败')
          }
        "
        v-clipboard:success="
          () => {
            msgSuccess('复制成功')
          }
        "
        class="copy-btn mr10"
        :underline="false"
        @click.stop="() => {}"
      >
        <i class="el-icon-view el-icon-copy-document" />复制
      </el-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextCopy',
  props: {
    text: {
      type: [String, Number, Object, Array],
      default: ''
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  mounted() {
    document.addEventListener('click', this.bodyCloseCopy)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.bodyCloseCopy)
  },
  methods: {
    bodyCloseCopy(e) {
      if (this.$refs.showPanel) {
        let isSelf = this.$refs.showPanel.contains(e.target)
        if (!isSelf) {
          this.isShow = false
        }
      }
    },
    handleCopy() {
      this.isShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
.text-copy {
  position: relative;
  display: flex;
  flex-direction: column;
  line-height: 34px;
  min-height: 34px;
  word-break: break-all;
  background: #f6f8f9;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  cursor: pointer;
  width: 95%;

  .copy-btn {
    float: right;
    width: 45px;
  }
}

.box-focus {
  border: 1px solid #409eff;
}
</style>
