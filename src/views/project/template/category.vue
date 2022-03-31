<template>
    <div class="app-container">
        <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
            <el-form-item label="分类名称" prop="name">
                <el-input
                    v-model="queryParams.name"
                    placeholder="请输入分类名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">
                    搜索
                </el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
                    重置
                </el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    v-hasPermi="['form:template:category:save']"
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd"
                >
                    新增
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    v-hasPermi="['form:template:category:update']"
                    type="success"
                    plain
                    icon="el-icon-edit"
                    size="mini"
                    :disabled="single"
                    @click="handleUpdate"
                >
                    修改
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    v-hasPermi="['form:template:category:delete']"
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple"
                    @click="handleDelete"
                >
                    删除
                </el-button>
            </el-col>
            <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
        </el-row>

        <el-table v-loading="loading" :data="categoryList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="Id" align="center" prop="id" />
            <el-table-column label="分类名称" align="center" prop="name" />
            <el-table-column label="排序" align="center" prop="sort" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        v-hasPermi="['form:template:category:update']"
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                    >
                        修改
                    </el-button>
                    <el-button
                        v-hasPermi="['form:template:category:delete']"
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                    >
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />

        <!-- 添加或修改项目模板分类对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入分类名称" />
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="form.sort" placeholder="请输入排序" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">
                    确 定
                </el-button>
                <el-button @click="cancel">
                    取 消
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {addCategory, delCategory, getCategory, listCategory, updateCategory} from '../../../api/project/template'

export default {
    name: 'Category',
    data() {
        return {
            // 遮罩层
            loading: true,
            // 导出遮罩层
            exportLoading: false,
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
            // 项目模板分类表格数据
            categoryList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                name: null,
                sort: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                name: [
                    { required: true, message: '分类名称不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        /** 查询项目模板分类列表 */
        getList() {
            this.loading = true
            listCategory(this.queryParams).then(response => {
                this.categoryList = response.data.records
                this.total = response.data.total
                this.loading = false
            })
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
                sort: null,
                updateTime: null,
                createTime: null
            }
            this.resetForm('form')
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1
            this.getList()
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm')
            this.handleQuery()
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset()
            this.open = true
            this.title = '添加项目模板分类'
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset()
            const id = row.id || this.ids
            getCategory(id).then(response => {
                this.form = response.data
                this.open = true
                this.title = '修改项目模板分类'
            })
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateCategory(this.form).then(response => {
                            this.msgSuccess('修改成功')
                            this.open = false
                            this.getList()
                        })
                    } else {
                        addCategory(this.form).then(response => {
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
            this.$confirm('是否确认删除项目模板分类编号为"' + ids + '"的数据项？').then(function() {
                return delCategory(ids)
            }).then(() => {
                this.getList()
                this.msgSuccess('删除成功')
            }).catch(() => {})
        }
    }
}
</script>
