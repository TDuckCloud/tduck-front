<template>
  <div class="rc-bin-container">
    <el-table
      v-if="projectList && projectList.length > 0"
      :data="projectList"
      border
      empty-text="暂无数据"
      highlight-current-row
      stripe
      style="width: 100%"
    >
      <el-table-column align="center" label="标题" prop="name" show-overflow-tooltip />
      <el-table-column align="center" label="收集数" prop="resultCount" />
      <el-table-column align="center" label="创建时间" prop="createTime" />
      <el-table-column align="center" label="删除时间" prop="updateTime" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="restoreProject(scope.row.key, 1)"> 恢复 </el-button>
          <el-popconfirm title="确定删除该项目吗？" @confirm="deleteProject(scope.row.key)">
            <el-button slot="reference" class="pink-text-btn" type="text"> 删除 </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="project-page-view">
      <el-pagination
        v-if="total > 10"
        :current-page.sync="queryParams.current"
        :page-size.sync="queryParams.size"
        :total="total"
        background
        layout="total, prev, pager, next"
        @current-change="queryRecycleProjectPage"
      />
    </div>
    <el-empty v-if="!projectList || projectList.length == 0" slot="empty" description="暂无数据" />
  </div>
</template>
<script>
import { deleteRecycleFormRequest, listRecycleFormRequest, restoreRecycleFormRequest } from '@/api/project/form'

export default {
  name: 'RecycleBin',
  data() {
    return {
      total: 0,
      queryParams: {
        current: 1,
        size: 10,
        name: '',
        beginDateTime: null,
        endDateTime: null,
        status: null
      },
      projectList: [],
      projectListLoading: true
    }
  },
  computed: {},
  created() {
    this.queryRecycleProjectPage()
  },
  methods: {
    restoreProject(key) {
      restoreRecycleFormRequest({ formKey: key }).then((res) => {
        if (res.data) {
          this.msgSuccess('恢复成功')
          this.queryRecycleProjectPage()
        }
      })
    },
    deleteProject(key) {
      deleteRecycleFormRequest({ formKey: key }).then((res) => {
        if (res.data) {
          this.msgSuccess('刪除成功')
          this.queryRecycleProjectPage()
        }
      })
    },
    queryRecycleProjectPage() {
      listRecycleFormRequest(this.queryParams).then((res) => {
        let { records, total, size } = res.data
        this.projectList = records
        this.total = total
        this.queryParams.size = size
        this.projectListLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.rc-bin-container {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  align-content: center;
}

.back-view {
  display: flex;
  width: 80%;
  align-content: flex-start;
  margin: 10px;
}

.project-page-view {
  margin-top: 30px;
}
</style>
