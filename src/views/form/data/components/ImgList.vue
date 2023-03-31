<template>
  <div class="">
    <div v-if="srcList && srcList.length > 1" class="tips">点击图片查看更多</div>
    <el-image style="width: 100px; height: 100px" :src="url" :preview-src-list="srcList">
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline" />
      </div>
    </el-image>
  </div>
</template>

<script>
export default {
  name: 'ImgList',
  props: {
    imageList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    url() {
      if (this.imageList && this.imageList.length) {
        return this.imageList[0].url
      }
      return null
    },
    srcList() {
      return this.imageList.map((item) => item.url)
    }
  }
}
</script>

<style scoped lang="scss">
.tips {
  color: #999;
  font-size: 12px;
  margin-top: 5px;
}
</style>
