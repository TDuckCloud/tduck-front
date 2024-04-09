<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item label="主题名称" prop="name">
        <el-input
          v-model="queryParams.name"
          clearable
          placeholder="请输入主题名称"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery"> 搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"> 重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAdd"> 新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="single" icon="el-icon-edit" plain size="mini" type="success" @click="handleUpdate">
          修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="multiple" icon="el-icon-delete" plain size="mini" type="danger" @click="handleDelete">
          删除
        </el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="themeList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="ID" prop="id" />
      <el-table-column align="center" label="主题名称" prop="name" />
      <el-table-column align="center" label="主题风格" prop="style">
        <template slot-scope="scope">
          {{ getStyleName(scope.row.style) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="头部图片" prop="headImgUrl">
        <template slot-scope="scope">
          <el-image
            :preview-src-list="[scope.row.headImgUrl]"
            :src="scope.row.headImgUrl"
            style="width: 100px; height: 50px"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="背景图片" prop="backgroundImg">
        <template slot-scope="scope">
          <template v-if="scope.row.backgroundImg">
            <el-image
              :preview-src-list="[scope.row.backgroundImg]"
              :src="scope.row.backgroundImg"
              style="width: 100px; height: 50px"
            />
          </template>
          <template v-else>
            <p>未配置背景图片</p>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="主题颜色" prop="color">
        <template slot-scope="scope">
          <span :style="{ backgroundColor: scope.row.themeColor }" class="color-block" />
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)"> 修改</el-button>
          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)"> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :limit.sync="queryParams.size"
      :page.sync="queryParams.current"
      :total="total"
      @pagination="getList"
    />

    <!-- 添加或修改项目主题外观模板对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="主题名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入主题名称" />
        </el-form-item>
        <el-form-item label="主题风格" prop="style">
          <el-select v-model="form.style" placeholder="请选择主题风格">
            <el-option v-for="c in themeCategoryList" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="头部图片" prop="headImgUrl">
          <image-upload v-model="form.headImgUrl" />
        </el-form-item>
        <el-form-item label="背景图片" prop="backgroundImg">
          <image-upload v-model="form.backgroundImg" />
        </el-form-item>
        <el-form-item label="主题颜色">
          <el-color-picker v-model="form.themeColor" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm"> 确 定</el-button>
        <el-button @click="cancel"> 取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addTheme, delTheme, getTheme, listCategory, listTheme, updateTheme } from '@/api/project/theme'

export default {
  name: 'FormTheme',
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 项目主题外观模板表格数据
      themeList: [],
      // 分类
      themeCategoryList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        current: 1,
        size: 10
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: '主题名称不能为空', trigger: 'blur' }],
        style: [{ required: true, message: '主题风格不能为空', trigger: 'change' }],
        headImgUrl: [{ required: true, message: '头部图片不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getThemeCategoryList()
  },
  methods: {
    /** 查询项目主题外观模板列表 */
    getList() {
      this.loading = true
      listTheme(this.queryParams).then((response) => {
        this.themeList = response.data.records
        this.total = response.data.total
        this.loading = false
      })
    },
    getThemeCategoryList() {
      listCategory().then((response) => {
        this.themeCategoryList = response.data
      })
    },
    getStyleName(id) {
      let item = this.themeCategoryList.find((item) => item.id == id)
      return item ? item.name : ''
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        style: null,
        headImgUrl: null,
        backgroundImg: null,
        themeColor: null,
        updateTime: null,
        createTime: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加主题'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getTheme(id).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改主题'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateTheme(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addTheme(this.form).then((response) => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除项目主题外观模板编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return delTheme(ids)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.color-block {
  width: 20px;
  height: 20px;
  display: inline-block;
  margin: 3px auto;
}
</style>
