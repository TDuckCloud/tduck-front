<template>
  <div v-if="files && files.length" class="file-list-wrapper">
    <ul class="el-upload-list el-upload-list--text">
      <li v-for="(f, index) in files" :key="index" tabindex="0" class="el-upload-list__item is-success">
        <a class="el-upload-list__item-name" :href="f.url" target="_blank">
          <i class="el-icon-document" />{{ f.name }}
        </a>
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-circle-check" />
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'FileList',
  props: {
    files: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.file-list-wrapper {
  width: 95%;
}
</style>
