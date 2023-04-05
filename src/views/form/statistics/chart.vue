<template>
  <div class="dashboard-container">
    <el-card class="count-card" shadow="hover">
      <template #header>
        <font-icon class="fa fa-university" />
        基础信息
      </template>
      <el-row class="count-card-content">
        <el-col :span="6">
          <p>有效回收量</p>
          <h1>
            <count-to :end-val="projectStats.completeCount" />
          </h1>
        </el-col>
        <el-col :span="6">
          <p>总浏览量</p>
          <h1>
            <count-to :end-val="projectStats.viewCount" />
          </h1>
        </el-col>
        <el-col :span="6">
          <p>回收率</p>
          <h1>
            <count-to :end-val="projectStats.completeRate" />
            %
          </h1>
        </el-col>
        <el-col :span="6">
          <p>平均完成时间</p>
          <h1>
            {{ projectStats.avgCompleteFormatStr }}
          </h1>
        </el-col>
      </el-row>
    </el-card>
    <situation :form-key="formKey" />
    <position-map :form-key="formKey" />
    <el-row>
      <el-col :span="12">
        <device :form-key="formKey" />
      </el-col>
      <el-col :span="12">
        <submit-source :form-key="formKey" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getFormReportRequest } from '@/api/project/report'
import { timeFormat } from '@/utils'
import situation from './charts/situation'
import PositionMap from './charts/PositionMap'
import device from './charts/device'
import SubmitSource from './charts/source'

export default {
  name: 'StatisticsChart',
  components: {
    situation,
    PositionMap,
    device,
    SubmitSource
  },
  data() {
    return {
      formKey: '',
      projectStats: {
        avgCompleteTime: 0,
        avgCompleteFormatStr: 0,
        viewCount: 0,
        completeCount: 0,
        completeRate: 0
      }
    }
  },
  created() {
    this.formKey = this.$route.query.key
    this.getProjectStats()
  },
  methods: {
    getProjectStats() {
      getFormReportRequest({ formKey: this.formKey }).then((res) => {
        this.projectStats = res.data
        if (this.projectStats.completeCount) {
          let rate = this.projectStats.completeCount / this.projectStats.viewCount
          this.projectStats.completeRate = rate > 1 ? 100 : rate * 100
          this.projectStats.avgCompleteFormatStr = timeFormat(this.projectStats.avgCompleteTime)
        } else {
          this.projectStats.completeRate = 0
          this.projectStats.avgCompleteFormatStr = 0
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 0;
  padding: 0;
  overflow-x: hidden !important;
  min-height: 500px;

  .count-card {
    padding: 20px;

    &-content {
      margin-top: 20px;
      text-align: center;
    }
  }
}
::v-deep .el-card {
  margin: 20px;
}
</style>
