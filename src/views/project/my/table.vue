<template>
  <div class="project-table-view">
    <el-table
      :data="projectList"
      border
      empty-text="暂无数据"
      highlight-current-row
      style="width: 100%"
      @row-click="handleRowClick"
    >
      <el-table-column align="center" width="300" label="标题" prop="name">
        <template slot-scope="scope">
          <span class="pl10 one-text-overflow">
            {{ scope.row.textName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.type == '3'" />
          <span v-for="status in projectStatusList" v-else :key="status.code">
            <span v-if="status.code == scope.row.status">
              {{ status.name }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.type == '3'">文件夹</span>
          <span v-else>
            <span>
              {{ getType(scope.row.type).name }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" />
      <el-table-column align="center" label="更新时间" prop="updateTime" />
      <el-table-column width="200" align="center" label="操作">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="toProjectHandle(scope.row, 'editor')">
              <i class="el-icon-edit" />
              编辑
            </el-button>
            <span />
            <el-popconfirm
              v-if="scope.row.status == 2"
              title="确定停止收集该项目吗？"
              @confirm="stopProject(scope.row.formKey)"
            >
              <el-button slot="reference" class="text-danger" type="text">
                <i class="el-icon-video-pause" />
                停止
              </el-button>
            </el-popconfirm>
            <el-popconfirm
              v-if="scope.row.status != 2"
              title="确定删除该项目吗？"
              @confirm="logicDeleteForm(scope.row.formKey)"
            >
              <el-button slot="reference" class="text-danger" type="text">
                <i class="el-icon-delete" />
                删除
              </el-button>
            </el-popconfirm>
            <el-button type="text" @click="toProjectHandle(scope.row, 'statistics')">
              <i class="el-icon-data-analysis" />
              统计
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'MyFormTable',
  mixins: [mixin],
  props: {
    projectList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 我的表单页还是协作页区分 默认为表单页 协作页某些内容不显示
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    handleRowClick(row, column, event) {}
  }
}
</script>

<style scoped>
.project-table-view {
  margin-top: 20px;
  width: 100%;
}

.icon-wenjianjia {
  color: var(--color-primary);
}

.el-table tr {
  cursor: pointer;
}
</style>
