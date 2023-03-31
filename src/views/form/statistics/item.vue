<template>
  <div>
    <div v-if="projectItemData.type == 'UPLOAD'">
      <div v-if="getItemValue['files']">
        <el-link v-for="file in getItemValue['files']" :key="file" :href="file.url" target="_blank" type="primary">
          <span> {{ file.fileName }}</span>
        </el-link>
      </div>
      <span v-else>/</span>
    </div>
    <div v-else>
      {{ getItemValue ? getItemValue : '/' }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultItem',
  props: {
    projectItemData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    resultData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    fieldItemId: {
      type: Number,
      default: 0
    }
  },
  computed: {
    processData() {
      return this.resultData ? this.resultData['processData'] : {}
    },
    getItemValue() {
      return this.processData[`field${this.fieldItemId}`] ? this.processData[`field${this.fieldItemId}`] : ''
    }
  }
}
</script>
