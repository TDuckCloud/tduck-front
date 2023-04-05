<template>
  <el-dialog title="导出" :visible.sync="dialogVisible" width="30%" center>
    默认导出当前页显示数据，建议导出筛选后的数据，可以调整当页大小导出更多数据，<span class="text-danger"
      >导出全量数据可能会导致占用太多资源，影响系统正常使用！</span
    >
    <el-switch
      v-model="allDownload"
      class="m20"
      active-text="导出全量数据"
      inactive-text="导出当前页数据"
      active-color="#ed5565"
      @change="changeAllDownload"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleDownload">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { downloadFormDataFileRequest } from '../../../api/project/data'

export default {
  name: 'DownloadFile',
  props: {
    queryParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 全量导出
      allDownload: false,
      dialogVisible: false
    }
  },
  methods: {
    openDownloadFile() {
      this.dialogVisible = true
    },
    changeAllDownload(val) {
      if (val) {
        this.queryParams.size = null
        this.queryParams.current = null
      }
    },
    handleDownload() {
      this.dialogVisible = false
      let params = JSON.parse(JSON.stringify(this.queryParams))
      if (this.allDownload) {
        params.size = null
        params.current = null
      }
      downloadFormDataFileRequest(this.queryParams).then((res) => {
        this.$process({
          tips: '* 导出当前筛选出的全部附件',
          message: '附件导出中',
          key: res.data
        })
      })
    }
  }
}
</script>

<style scoped></style>
