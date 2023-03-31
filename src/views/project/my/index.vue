<template>
  <div class="app-container">
    <div class="form-container">
      <div class="filter-view">
        <el-form ref="form" label-width="100px">
          <el-form-item label="项目更新时间">
            <el-row>
              <el-col :span="10" :xs="24" :sm="24" :md="10" class="mb5">
                <el-date-picker
                  v-model="queryParams.beginDateTime"
                  placeholder="选择开始时间"
                  style="width: 40%"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
                至
                <el-date-picker
                  v-model="queryParams.endDateTime"
                  :default-time="'23:59:59'"
                  placeholder="选择结束时间"
                  style="width: 40%"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-col>
              <el-col :span="14" :xs="24" :sm="24" :md="14">
                <el-input
                  v-model="queryParams.name"
                  placeholder="请输入项目名称"
                  class="project_my_input_search"
                  style="width: 78%"
                  type="text"
                />
                <el-button class="ml-20" icon="el-icon-search" type="primary" @click="queryProjectPage">
                  查询
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-row>
            <el-col :span="5">
              <el-button class="ml-20" icon="el-icon-plus" type="primary" @click="createFormVisible = true">
                创建表单
              </el-button>
            </el-col>
            <el-col :span="9">
              <el-form-item label="项目状态">
                <el-radio-group
                  v-model="queryParams.status"
                  size="small"
                  @change="
                    () => {
                      queryParams.current = 0
                      queryProjectPage()
                    }
                  "
                >
                  <el-radio-button v-for="status in projectStatusList" :key="status.code" :label="status.code">
                    {{ status.name }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item>
                <el-button-group>
                  <el-button
                    :type="dataShowType == 'card' ? 'primary' : 'default'"
                    size="mini"
                    @click="dataShowType = 'card'"
                  >
                    <font-icon class="fas fa-th-large" />
                  </el-button>
                  <el-button
                    :type="dataShowType == 'table' ? 'primary' : 'default'"
                    size="mini"
                    @click="dataShowType = 'table'"
                  >
                    <font-icon class="fas fa-th-list" />
                  </el-button>
                </el-button-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <form-card-list
        v-if="dataShowType == 'card'"
        v-loading="projectListLoading"
        :project-list.sync="projectList"
        @refresh="queryProjectPage"
      />
      <my-form-table
        v-if="dataShowType == 'table'"
        v-loading="projectListLoading"
        :project-list.sync="projectList"
        @refresh="queryProjectPage"
      />
      <div class="project-page-view">
        <el-pagination
          v-if="total > 10"
          :current-page.sync="queryParams.current"
          :page-size.sync="queryParams.size"
          :total="total"
          background
          layout="total, prev, pager, next"
          @current-change="queryProjectPage"
        />
      </div>
    </div>
    <el-dialog class="create-form-dialog" :visible.sync="createFormVisible" title="创建表单" width="30%">
      <el-form ref="createForm" :model="formData" label-width="100px">
        <el-form-item :rules="[{ required: true, message: '名称不能为空' }]" label="表单名称" prop="name">
          <el-input v-model="formData.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述信息" prop="description">
          <el-input v-model="formData.description" :rows="5" autocomplete="off" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="requestLoading.pushFormData" @click="createFormHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { createFormRequest, getUserFormFolderTreeRequest, pageFormRequest, updateFormRequest } from '@/api/project/form'
import FormCardList from './card'
import mixin from './mixin'
import MyFormTable from './table'

export default {
  name: 'MyProject',
  components: {
    MyFormTable,
    FormCardList
  },
  mixins: [mixin],
  data() {
    return {
      createFormVisible: null,
      dataShowType: 'card',
      total: 0,
      queryParams: {
        current: 1,
        size: 12,
        name: '',
        beginDateTime: null,
        endDateTime: null,
        status: null,
        folderId: 0
      },
      formData: {
        description: '',
        name: '未命名问卷',
        type: 0
      },
      projectList: [],
      projectListLoading: true,
      pageCurrent: '',
      requestLoading: {
        // 请求加载中状态
        pushFormData: false,
        pushFolderData: false
      }
    }
  },
  created() {
    this.queryParams.current = 1
    this.queryProjectPage()
  },
  beforeDestroy() {},
  methods: {
    createFormHandle() {
      this.$refs['createForm'].validate((valid) => {
        if (valid) {
          // 默认创建到当前打开文件夹
          this.formData.folderId = this.queryParams.folderId || 0
          this.requestLoading.pushFormData = true
          // 给默认输入的标题加粗
          createFormRequest({
            ...this.formData,
            name: `<h2 style="text-align: center;">${this.formData.name}</h2>`
          })
            .then((res) => {
              this.toProjectHandle(res.data, 'editor')
              this.requestLoading.pushFormData = false
            })
            .catch(() => {
              this.requestLoading.pushFormData = false
            })
        } else {
          return false
        }
      })
    },
    queryProjectPage() {
      pageFormRequest(this.queryParams).then((res) => {
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
.create-form-dialog {
  border-radius: 10px !important;
}

.app-container {
  width: 100%;
  height: 100%;
  padding-top: 50px;
  padding-left: 90px;
}

.form-container {
  margin: 0 auto;
}

.project-page-view {
  margin-top: 30px;
  text-align: center;
}

.form-breadcrumb {
  margin: 10px 50px 10px 0px;
}

::v-deep .el-breadcrumb__inner {
  cursor: pointer !important;
}
</style>

<style lang="scss">
.project_my_input_search {
  width: auto;
  .el-input__inner {
    border-bottom-right-radius: 0px !important;
    border-top-right-radius: 0px !important;
  }
}
</style>
