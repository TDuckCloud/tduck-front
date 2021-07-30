<template>
    <div class="statistics-container">
        <div class="filter-table-view">
            <el-form ref="filterForm" :inline="true">
                <el-form-item label="提交时间" prop="endDateTime">
                    <el-date-picker
                        v-model="queryConditions.beginDateTime"
                        placeholder="开始时间"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    />
                    <span> 至 </span>
                    <el-date-picker
                        v-model="queryConditions.endDateTime"
                        :default-time="'23:59:59'"
                        placeholder="结束时间"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryProjectResult">查询</el-button>
                    <el-button type="primary" @click="conditionFilterHandle">条件</el-button>
                    <el-button type="success" @click="exportProjectResult">导出</el-button>
                    <el-button type="success" @click="downloadProjectResultFile">下载附件</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="result-table-view">
            <el-table
                :data="projectResultList"
                header-cell-class-name="data-table-header"
                stripe
                @row-dblclick="(row, column, event)=>{
                    this.openDetailDrawerHandle(row)
                }"
            >
                <el-table-column
                    type="selection"
                    width="55"
                />
                <el-table-column
                    v-for="col in fixedCustomColumns" :key="`t${col}`"
                    :label="fixedDefaultLabelFormColumn[col]"
                >
                    <template slot-scope="scope">
                        {{ scope.row[col] }}
                    </template>
                </el-table-column>

                <el-table-column
                    v-for="col in otherCustomColumns"
                    :key="col" :label="projectItemColumns[col]"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{ scope.row['processData'][col] }}
                    </template>
                </el-table-column>

                <el-table-column
                    v-for="col in fixedFormTailColumns" :key="`t${col}`"
                    :label="fixedDefaultLabelFormTailColumn[col]"
                >
                    <template slot-scope="scope">
                        {{ scope.row[col] }}
                    </template>
                </el-table-column>

                <el-table-column
                    :render-header="renderHeader"
                    fixed="right"
                    width="50"
                >
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="openDetailDrawerHandle(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-drawer
                v-if="activeResultRow"
                :visible.sync="detailDrawer"
                :with-header="false"
            >
                <el-scrollbar style="height: 100%;">
                    <el-card class="detail-container">
                        <div slot="header" class="clearfix">
                            <span>提交详情</span>
                        </div>
                        <div>
                            <div v-for="item in projectItemList" :key="item.id">
                                <h4>{{ item.label }}</h4>
                                <result-item :field-item-id="item.formItemId" :project-item-data="item"
                                             :result-data="activeResultRow"
                                />
                                <el-divider />
                            </div>
                        </div>
                    </el-card>
                </el-scrollbar>
            </el-drawer>
            <div style="display: flex; justify-content: center; margin-top: 10px;">
                <el-pagination
                    v-if="total>10"
                    :current-page.sync="queryConditions.current"
                    :page-size.sync="queryConditions.size"
                    :total="total"
                    background
                    layout="total, prev, pager, next"
                    @current-change="queryProjectResult"
                />
            </div>
        </div>
        <div class="custom-col-container">
            <el-dialog :visible.sync="customColumnDialogVisible" center title="自定义显示列">
                <el-row>
                    <el-col :span="3">
                        <span>显示列：</span>
                    </el-col>
                </el-row>
                <el-divider />
                <el-checkbox-group v-model="checkedFixedCustomColumns">
                    <el-row>
                        <el-col v-for="(val, key) in fixedDefaultLabelFormColumn" :key="key" :span="4">
                            <el-checkbox :label="key">{{ val }}</el-checkbox>
                        </el-col>
                    </el-row>
                </el-checkbox-group>
                <el-divider />
                <el-checkbox-group v-model="checkOtherCustomColumns">
                    <el-row>
                        <el-col v-for="(val, key) in projectItemColumns" :key="key" :span="8">
                            <el-checkbox :label="key">{{ val }}</el-checkbox>
                        </el-col>
                    </el-row>
                </el-checkbox-group>
                <el-divider />
                <el-checkbox-group v-model="checkedFixedTailCustomColumns">
                    <el-row>
                        <el-col v-for="(val, key) in fixedDefaultLabelFormTailColumn" :key="key" :span="4">
                            <el-checkbox :label="key">{{ val }}</el-checkbox>
                        </el-col>
                    </el-row>
                </el-checkbox-group>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="customColumnDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveStatisticsCheckedColumns">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <data-filter ref="dataFilter" :fields="projectItemList" @filter="dataFilterHandle" />
    </div>
</template>

<script>
import _ from 'lodash'
import ResultItem from './item'
import DataFilter from './filter'
import {getCheckedColumn, saveCheckedColumn} from '@/utils/db'

// 头部固定标签
const fixedDefaultFormColumn = ['serialNumber']
const fixedDefaultLabelFormColumn = {serialNumber: '提交序号'}
// 尾部固定标签
const fixedDefaultFormTailColumn = ['submitAddress', 'createTime']
const fixedDefaultLabelFormTailColumn = { submitAddress: '提交地址', createTime: '提交时间'}

export default {
    name: 'ProjectStatisticsList',
    components: {
        ResultItem,
        DataFilter
    },
    data() {
        return {
            projectKey: null,
            customFilterDialogVisible: false,
            customColumnDialogVisible: false,
            checkedFilterColumns: [],
            // 固定自定义列 如序号等
            fixedCustomColumns: fixedDefaultFormColumn,
            fixedFormTailColumns: fixedDefaultFormTailColumn,
            // 选中的
            checkedFixedCustomColumns: fixedDefaultFormColumn,
            fixedDefaultLabelFormColumn: fixedDefaultLabelFormColumn,
            checkedFixedTailCustomColumns: fixedDefaultFormTailColumn,
            fixedDefaultLabelFormTailColumn: fixedDefaultLabelFormTailColumn,
            // 自定义表单属性
            checkOtherCustomColumns: [],
            otherCustomColumns: [],
            projectResultList: [],
            projectItemList: [],
            projectData: null,
            projectItemColumns: {},
            total: 0,
            detailDrawer: false,
            activeResultRow: null,
            // 查询条件
            queryConditions: {
                current: 1,
                size: 10,
                projectKey: '',
                beginDateTime: '',
                endDateTime: '',
                extParams: null,
                extComparisons: null
            }
        }
    },
    mounted() {
        this.projectKey = this.$route.query.key
        this.queryConditions.projectKey = this.projectKey
        this.queryProjectResult()
        this.queryProjectItems()
        this.queryProject()
    }, methods: {
        renderHeader() {
            return (
                <i class="el-icon-setting" style="color:currentColor"
                    onClick={() => this.customColumnDialogVisible = true}></i>
            )
        },
        openDetailDrawerHandle(row) {
            this.activeResultRow = row
            this.detailDrawer = true
        },
        queryProject() {
            this.$api.get(`/user/project/${this.projectKey}`).then(res => {
                this.projectData = res.data
            })
        },
        conditionFilterHandle() {
            this.$refs.dataFilter.showDialogHandle()
        },
        dataFilterHandle(params, comparisons) {
            this.queryConditions.extParams = params
            this.queryConditions.extComparisons = comparisons
            this.queryProjectResult()
        },
        queryProjectResult() {
            this.$api.get('/user/project/result/page', {params: this.queryConditions}).then(res => {
                let {records, total, size} = res.data
                this.projectResultList = records
                this.total = total
                this.queryConditions.size = size
            })
        },
        saveStatisticsCheckedColumns() {
            this.customColumnDialogVisible = false
            this.fixedCustomColumns = this.checkedFixedCustomColumns
            this.otherCustomColumns = this.checkOtherCustomColumns
            this.fixedFormTailColumns = this.checkedFixedTailCustomColumns
            saveCheckedColumn(this.projectKey, {
                fixedCustomColumns: this.fixedCustomColumns,
                otherCustomColumns: this.otherCustomColumns,
                fixedCustomTailColumns: this.fixedFormTailColumns
            })
        },
        getDbCheckedColumns() {
            let checkedColumn = getCheckedColumn(this.projectKey)
            if (!checkedColumn) {
                return
            }
            let {fixedCustomColumns, otherCustomColumns, fixedCustomTailColumns} = checkedColumn
            if (fixedCustomColumns) {
                this.fixedCustomColumns = fixedCustomColumns
                this.checkedFixedCustomColumns = fixedCustomColumns
            }
            if (otherCustomColumns) {
                this.otherCustomColumns = otherCustomColumns
                this.checkOtherCustomColumns = otherCustomColumns
            }
            if (fixedCustomTailColumns) {
                this.fixedCustomTailColumns = fixedCustomTailColumns
                this.checkedFixedTailCustomColumns = fixedCustomTailColumns
            }
        },
        downloadProjectResultFile() {
            if (!this.total) {
                this.$message.error('无附件，无法导出')
                return
            }
            this.$api.get('/user/project/result/download/file', {
                params: this.queryConditions
            }).then(res => {
                this.$process({
                    message: '附件导出中',
                    key: res.data
                })
            })
        },
        exportProjectResult() {
            if (!this.total) {
                this.$message.error('无表单有效反馈结果，无法导出')
                return
            }
            this.$api.get('user/project/result/export', {
                params: this.queryConditions,
                responseType: 'blob'
            }).then(res => {
                let blob = res
                let downloadElement = document.createElement('a')
                let href = window.URL.createObjectURL(blob) // 创建下载的链接
                downloadElement.href = href
                downloadElement.download = this.projectData.name + this.$dayjs().format('YYYYMMDDHHMM') + '.xls' // 下载后文件名
                document.body.appendChild(downloadElement)
                downloadElement.click() // 点击下载
                document.body.removeChild(downloadElement) // 下载完成移除元素
                window.URL.revokeObjectURL(href) // 释放掉blob对象
            })
        },
        queryProjectItems() {
            this.$api.get('/user/project/item/list', {params: {key: this.projectKey, displayType: false}}).then(res => {
                if (res.data) {
                    res.data.map(item => {
                        _.set(this.projectItemColumns, `field${item.formItemId}`, item.label)
                    })
                }
                this.projectItemList = res.data
                this.getDbCheckedColumns()
            })
        }
    }

}
</script>

<style scoped>
.statistics-container {
  margin-top: 20px;
  width: 100%;
  height: 100%;
}

.custom-col-container >>> .el-checkbox__label {
  width: 200px;
  min-height: 25px;
  line-height: 25px;
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.result-table-view {
  width: 80%;
  min-height: 75vh;
  margin: 6px auto;
}

.detail-container {
  padding: 20px;
  height: 100% !important;
}

.filter-table-view {
  width: 80%;
  margin: 0 auto;
}

::v-deep .el-icon-setting {
  font-size: 24px;
  line-height: 25px;
  color: white;
}

::v-deep .data-table-header .cell {
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

/* 1.显示滚动条：当内容超出容器的时候，可以拖动： */
::v-deep .el-drawer__body {
  overflow: auto;

  /* overflow-x: auto; */
}

/* 2.隐藏滚动条，太丑了 */
::v-deep .el-drawer__container ::-webkit-scrollbar {
  display: none;
}

</style>
