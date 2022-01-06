<template>
    <div class="app-container">
        <vxe-grid ref="xGrid" v-bind="gridOptions"
                  @cell-click="handleViewOrUpdate"
                  @cell-menu="cellContextMenuEvent"
                  @menu-click="contextMenuClickEvent"
        >
            <template #toolbar_buttons>
                <el-button v-if="checkBtnPerms('add')" icon="el-icon-plus" type="primary" @click="handleAdd">
                    添加
                </el-button>
                <el-button v-if="checkBtnPerms('import')" icon="el-icon-upload2" type="primary" @click="handleImport">
                    导入
                </el-button>
                <el-button v-if="checkBtnPerms('download')" icon="el-icon-download" type="primary" @click="handleDownload">
                    下载附件
                </el-button>
                <el-button v-if="checkBtnPerms('delete')" icon="el-icon-remove" type="danger" @click="handleDelete">
                    删除
                </el-button>
            </template>
            <!--自定义空数据模板-->
            <template #empty>
                <el-empty slot="empty" description="暂无数据" />
            </template>
        </vxe-grid>
        <ViewOrUpdate v-if="formModel"
                      ref="viewOrUpdateDialog"
                      :can-update="checkBtnPerms('update')"
                      :fields="fields" :form-key="formKey" :form-model="formModel"
                      @reload="handleReloadTable"
        />
        <el-dialog :visible.sync="addDialogVisible"
                   title="添加"
        >
            <biz-project-form
                v-if="formConfig.formKey"
                :key="formParseKey"
                :form-config="formConfig"
                @submit="submitForm"
            />
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">
                    取 消
                </el-button>
            </div>
        </el-dialog>
        <import ref="dataImport" :form-key="formKey" @success="handleReloadTable" />
    </div>
</template>

<script>

import {BizProjectForm}  from 'tduck-form-generator'
import ViewOrUpdate from './ViewOrUpdate'
import {
    createFormResultRequest,
    deleteFormDataRequest,
    downloadFormDataFileRequest,
    listFormDataTableRequest
} from '@/api/project/data'
import {listFormFieldsRequest} from '@/api/project/form'
import _ from 'lodash'
import Import from './import'

export default {
    name: 'FormData',
    components: {
        Import,
        BizProjectForm,
        ViewOrUpdate
    },
    props: {
        // 模式
        mode: {
            type: Number,
            required: false,
            default: 1
        },
        // 权限信息
        authGroup: {
            type: Object,
            required: false
        }
    },
    data() {
        return {
            formKey: '',
            formConfig: {
                formKey: '',
                preview: false,
                showBtns: true
            },
            formParseKey: new Date().getTime(),
            formModel: {},
            gridOptions: {
                border: true,
                stripe: true,
                resizable: true,
                showHeaderOverflow: true,
                showOverflow: true,
                highlightHoverRow: true,
                keepSource: true,
                id: 'formDataGrid',
                rowId: 'id',
                customConfig: {
                    storage: true
                },
                printConfig: {},
                menuConfig: {
                    body: {
                        options: [
                            [
                                {code: 'copy', name: '复制内容', prefixIcon: 'fa fa-copy', visible: true, disabled: false},
                                {code: 'clear', name: '清除内容', visible: true, disabled: false}
                            ],
                            [
                                {code: 'myPrint', name: '打印', prefixIcon: 'fa fa-print', visible: true, disabled: false},
                                {code: 'myExport', name: '导出.csv', prefixIcon: 'fa fa-download', visible: true, disabled: false}
                            ]
                        ]
                    }
                },
                sortConfig: {
                    trigger: 'cell',
                    remote: true
                },
                filterConfig: {
                    remote: true
                },
                pagerConfig: {
                    pageSize: 10,
                    pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000]
                },
                toolbarConfig: {
                    refresh: true,
                    import: false,
                    export: false,
                    print: false,
                    zoom: true,
                    custom: false,
                    slots: {
                        buttons: 'toolbar_buttons'
                    }
                },
                proxyConfig: {
                    seq: true, // 启用动态序号代理，每一页的序号会根据当前页数变化
                    sort: true, // 启用排序代理，当点击排序时会自动触发 query 行为
                    filter: true, // 启用筛选代理，当点击筛选时会自动触发 query 行为
                    // 对应响应结果 { result: [], page: { total: 100 } }
                    props: {
                        result: 'data.rows', // 配置响应结果列表字段
                        total: 'data.total' // 配置响应结果总页数字段
                    },
                    ajax: {
                        // 接收 Promise 对象
                        query: ({page, sorts, filters, form}) => {
                            this.queryParams.size = page.pageSize
                            this.queryParams.current = page.currentPage - 1
                            this.queryParams.formKey = this.formKey
                            return listFormDataTableRequest(this.queryParams)
                        },
                        // 查询全部 导出全部时会被调用
                        queryAll: () => {
                            this.queryParams.size = null
                            this.queryParams.current = null
                            this.queryParams.formKey = this.formKey
                            return listFormDataTableRequest(this.queryParams).then(res => {
                                // 临时处理对象导出显示
                                let datas = []
                                res.data.rows.forEach(data => {
                                    let dataObj = {}
                                    _.keys(data).forEach(key => {
                                        if (_.isObject(data[key])) {
                                            dataObj[key] = JSON.stringify(data[key])
                                        } else {
                                            dataObj[key] = data[key]
                                        }
                                    })
                                    datas.push(dataObj)
                                })
                                return Promise.resolve(datas)
                            })
                        }
                    }
                },
                columns: [],
                importConfig: {
                    // remote: true,
                    // importMethod: this.importMethod,
                    types: ['csv', 'html', 'xml', 'txt'],
                    modes: ['insert']
                },
                exportConfig: {
                    // remote: true,
                    // exportMethod: this.exportMethod,
                    isMerge: false,
                    isAllExpand: false,
                    types: ['xlsx', 'csv', 'html', 'xml', 'txt'],
                    modes: ['current', 'selected', 'all']
                },
                checkboxConfig: {
                    // labelField: 'id',
                    reserve: true,
                    highlight: true,
                    range: true
                }
            },
            queryDialogVisible: false,
            addDialogVisible: false,
            fields: [],
            queryParams: {
                authGroupId: null,
                formKey: '',
                filter: {}
            }
        }
    },
    created() {
        this.formKey = this.$route.query.key || this.$route.params.key
        this.handleQueryFields()
        this.initPerms()
    },
    methods: {
        /**
         * 检查按钮是否有权限
         * @param btn
         */
        checkBtnPerms(btn) {
            if (this.mode === 1) {
                return true
            }
            return this.authGroup.btnPerms.includes(btn)
        },
        // 初始化权限
        initPerms() {
            // 管理模式
            if (this.mode === 1) {
                ['export', 'print', 'custom'].forEach(key => {
                    this.gridOptions.toolbarConfig[key] = true
                })
                return true
            }
            this.authGroup.btnPerms.forEach(key => {
                this.gridOptions.toolbarConfig[key] = true
            })
            // 允许编辑的字段
            this.fields.forEach(field => {
                let haveFieldIds = this.authGroup.fieldEditPerms
                // 没权限字段全部禁用
                if (!haveFieldIds.includes(field.value)) {
                    if (field.scheme) {
                        field.scheme.disabled = true
                    }
                }
            })
        },
        handleQueryFields() {
            return new Promise((resolve, reject) => {
                if (this.mode === 1) {
                    listFormFieldsRequest(this.formKey).then(res => {
                        this.handleTableColumns(res.data)
                        resolve(this.fields)
                    })
                } else {
                    listFormFieldsRequest(this.formKey).then(res => {
                        let haveFieldIds = this.authGroup.fieldVisiblePerms
                        this.fields = res.data.filter(item => haveFieldIds.includes(item.value))
                        this.handleTableColumns(this.fields)
                        resolve(this.fields)
                    })
                    this.queryParams.authGroupId = this.authGroup.id
                }
            })
        },
        /**
     * 格式化处理表格数据
     */
        handleTableColumns(fields) {
            // 部分组件格式化显示 Json
            let firstCol = [{type: 'checkbox', width: 60}]
            this.gridOptions.columns = firstCol.concat(fields.map(item => {
                // 如果是个json对象 格式化成json字符串
                if (['SELECT', 'IMAGE_UPLOAD', 'UPLOAD', 'CASCADER', 'IMAGE_SELECT', 'SUB_FORM', 'HORIZONTAL_INPUT', 'MATRIX_INPUT', 'MATRIX_SCALE', 'MATRIX_SELECT'].includes(item.type)) {
                    return {
                        field: item.value, title: item.label, slots: {
                            // 使用 JSX 渲染
                            default: ({row}) => {
                                if (item.type === 'CASCADER') {
                                    return row[item.value] && row[item.value].join(',')
                                }
                                let value = JSON.stringify(row[item.value])
                                return [
                                    value
                                ]
                            }
                        }
                    }
                }
                return {field: item.value, title: item.label}
            }))
            this.fields = fields
        },
        handleQuery() {
            this.queryDialogVisible = true
        },
        handleImport() {
            this.$refs.dataImport.upload.open = true
        },
        handleDownload() {
            if (!this.$refs.xGrid.$data.tablePage.total) {
                this.$message.error('无附件，无法导出')
                return
            }
            downloadFormDataFileRequest(this.queryParams).then(res => {
                this.$process({
                    tips: '* 导出当前筛选出的全部附件',
                    message: '附件导出中',
                    key: res.data
                })
            })
        },
        handleDelete() {
            let ids = this.$refs.xGrid.getCheckboxRecords(true).map(item => item.id)
            if (!ids.length) {
                this.msgWarning('请选择数据')
                return
            }
            this.$confirm(`此操作将删除选中的${ids.length}条数据, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteFormDataRequest(ids, this.formKey).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.$refs.xGrid.commitProxy('reload')
                })
            }).catch(() => {

            })
        },
        handleAdd() {
            this.formConfig.formKey = this.formKey
            this.formParseKey = new Date().getTime()
            this.addDialogVisible = true
        },
        handleReloadTable() {
            this.$refs.xGrid.commitProxy('reload')
        },
        cellContextMenuEvent({row}) {
            const $grid = this.$refs.xGrid
            $grid.setCurrentRow(row)
        },
        handleViewOrUpdate(event) {
            if (!this.checkBtnPerms('detail')) {
                return
            }
            if (event.triggerCheckbox) {
                return
            }
            this.formModel = event.row
            this.$refs.viewOrUpdateDialog.showDialog()
        },
        contextMenuClickEvent({menu, row, column}) {
            const $grid = this.$refs.xGrids
            switch (menu.code) {
                case 'copy':
                    if (row && column) {
                        if (this.$copyText(row[column.property])) {
                            this.msgSuccess('已复制到剪贴板')
                        }
                    }
                    break
                case 'clear':
                    $grid.clearData(row, column.property)
                    break
                case 'myPrint':
                    $grid.print()
                    break
                case 'myExport':
                    $grid.exportData()
                    break
            }
        },
        submitForm(data) {
            createFormResultRequest({
                'completeTime': 0,
                'formKey': this.formConfig.formKey,
                'submitOs': '',
                'submitBrowser': '',
                'submitUa': null,
                'wxUserInfo': null,
                'wxOpenId': '',
                'originalData': data.formModel
            }).then(() => {
                setTimeout(() => {
                    this.$refs.xGrid.commitProxy('reload')
                }, 1000)
                this.addDialogVisible = false
                this.msgSuccess('添加成功')
            })
        }
    }

}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
}

::v-deep .project-form {
  background-color: #FFFFFF !important;
  width: 100% !important;
}

</style>
