<template>
  <div class="create-container">
    <div>
      <div class="create-header-container">
        <div class="filter-container">
          <el-form ref="form" :inline="true">
            <el-form-item label="">
              <el-input
                v-model="queryParams.name"
                class="width80"
                placeholder="请输入模板名称"
                @keyup.enter="queryTemplatePage"
              />
            </el-form-item>
            <el-form-item>
              <el-button class="search-template-btn" type="primary" @click="queryTemplatePage" icon="el-icon-search">
                查询</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <el-menu
          :default-active="queryParams.type"
          mode="horizontal"
          style="background-color: transparent"
          @select="
            (index) => {
              queryParams.type = index
              queryTemplatePage()
            }
          "
        >
          <el-menu-item :`index`="null"> 全部</el-menu-item>
          <el-menu-item v-for="(item, index) in templateTypeList" :key="index" :index="item.id.toString()">
            {{ item.name }}
          </el-menu-item>
        </el-menu>
      </div>
      <div class="project-grid-container">
        <div class="project-grid-view">
          <div v-for="template in templateList" :key="template.id" class="project-template-view">
            <img
              :src="template.coverImg ? template.coverImg : require('@/assets/images/99d0.png')"
              class="preview-img"
            />
            <p class="project-template-title">
              {{ template.name }}
            </p>
            <div class="">
              <el-button icon="el-icon-view" type="text" @click="toProjectTemplate(template.formKey)"> 查看</el-button>
              <el-button icon="el-icon-delete" type="text" @click="handleDelete(template)"> 删除</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center">
      <el-pagination
        v-if="total > 10"
        :current-page.sync="queryParams.current"
        :page-size.sync="queryParams.size"
        :total="total"
        background
        layout="total, prev, pager, next"
        @current-change="queryTemplatePage"
      />
    </div>
  </div>
</template>

<script>
import {
  deleteFormTemplateRequest,
  getFormTemplatePageRequest,
  getFormTemplateTypeListRequest
} from '@/api/project/template'
import { createFormRequest } from '@/api/project/form'

export default {
  name: 'CreateProject',
  data() {
    return {
      queryParams: {
        current: 1,
        size: 12,
        name: '',
        type: null
      },
      total: 0,
      templateTypeList: [],
      templateList: []
    }
  },
  computed: {},
  created() {
    this.queryTemplateType()
    this.queryTemplatePage()
  },
  methods: {
    queryTemplateType() {
      getFormTemplateTypeListRequest().then((res) => {
        this.templateTypeList = res.data
      })
    },
    toProjectTemplate(key) {
      this.$router.push({ path: '/project/template/preview', query: { key: key } })
    },
    handleDelete(item) {
      this.$confirm(`此操作将永久删除${item.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFormTemplateRequest({ formKey: item.formKey }).then((res) => {
          this.msgSuccess('删除成功')
          this.queryTemplatePage()
        })
      })
    },
    queryTemplatePage() {
      getFormTemplatePageRequest(this.queryParams).then((res) => {
        let { records, total, size } = res.data
        this.templateList = records
        this.total = total
        this.queryParams.size = size
        this.projectListLoading = false
      })
    },
    createBlankTemplate() {
      createFormRequest({ description: '表单模板', name: '表单模板' }).then((res) => {
        this.$router.push({ path: '/project/form', query: { key: res.data } })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-img {
  width: 90%;
  height: 130px;
  margin-top: 8px;
  border-radius: 10px;
}

.create-container {
  margin: 0 auto;
  padding: 50px 150px;
  width: 100%;

  .el-pagination {
    margin-top: 20px;
  }
}

.create-header-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.filter-container {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px !important;

  .el-input {
    display: inline-block;
    width: 300px !important;
  }
}

.project-grid-view {
  display: flex;
  max-width: 1200px;
  flex-direction: row;
  flex-wrap: wrap;
}

.tag-title {
  font-size: 20px;
  border-bottom: 3px solid rgba(68, 68, 68, 100);
  line-height: 25px;
}

.project-template-view {
  width: 151px;
  height: 196px;
  line-height: 20px;
  border-radius: 10px;
  text-align: center;
  margin: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  background: white;
  position: relative;
}

.project-template-view:hover .project-template-use-view {
  display: block;
  cursor: pointer;
}

.project-template-use-view {
  position: absolute;
  width: 100%;
  height: 28px;
  z-index: 100;
  background-color: #f0f0f0;
  filter: alpha(opacity=60);
  -moz-opacity: 0.6;
  opacity: 0.6;
  display: none;
  border: none;
}

.project-template-title {
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
  margin: 0 3px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.el-menu.el-menu--horizontal {
  border-bottom: none;
}
</style>
