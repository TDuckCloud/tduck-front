<template>
  <el-container>
    <el-header class="el-page-header">
      <h5 v-if="projectData">
        {{ projectData.name }}
      </h5>
      <el-button type="primary" @click="openFormHandle"> 访问表单 </el-button>
    </el-header>
    <el-main>
      <el-table :data="projectResultList" class="public-result-table">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form class="public-table-expand" label-position="left">
              <el-form-item v-for="item in projectItemList" :key="item.id" :label="item.label">
                <result-item :field-item-id="item.formItemId" :project-item-data="item" :result-data="props.row" />
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="提交序号" prop="serialNumber" />
        <el-table-column label="提交地址" prop="submitAddress" />
        <el-table-column label="提交时间" prop="createTime" />
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import _ from 'lodash'
import ResultItem from './item'

export default {
  name: 'StatisticsPublic',
  components: {
    ResultItem
  },
  metaInfo: {
    title: '反馈结果',
    meta: [
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=2,user-scalable=yes'
      }
    ]
  },
  data() {
    return {
      projectResultList: [],
      projectItemList: [],
      projectData: null,
      projectItemColumns: {},
      // 查询条件
      queryConditions: {
        current: 1,
        size: 10,
        projectKey: '',
        beginDateTime: '',
        endDateTime: ''
      },
      projectKey: null,
      tableData: []
    }
  },
  created() {
    // this.projectKey = this.$route.query.projectKey
    // this.queryConditions.projectKey = this.projectKey
    // this.queryProjectResult()
    // this.queryProjectItems()
    // this.queryProject()
  },
  methods: {
    openFormHandle() {
      this.$router.replace({ path: `/s/${this.projectKey}` })
    },
    queryProject() {
      this.$api.get(`/user/form/${this.projectKey}`).then((res) => {
        this.projectData = res.data
      })
    },
    queryProjectResult() {
      this.$api.get('/user/form/result/public/page', { params: this.queryConditions }).then((res) => {
        let { records, total, size } = res.data
        this.projectResultList = records
        this.total = total
        this.queryConditions.size = size
      })
    },
    queryProjectItems() {
      this.$api.get('/user/form/item/list', { params: { key: this.projectKey, displayType: true } }).then((res) => {
        if (res.data) {
          res.data.map((item) => {
            _.set(this.projectItemColumns, `field${item.formItemId}`, item.label)
          })
        }
        this.projectItemList = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-header {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  .el-button {
    height: 50%;
  }
}

.el-main {
  background-color: rgba(247, 247, 247, 90);
  height: calc(100vh - 60px);
}

@media screen and (max-width: 750px) {
  .public-result-table {
    width: 100% !important;
  }
  .el-header {
    justify-content: space-between !important;
  }
}

.public-result-table {
  width: 60%;
  margin: 0 auto;
}

.public-table-expand {
  font-size: 0;

  label {
    width: 90px;
    color: #99a9bf;
  }

  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
}
</style>
