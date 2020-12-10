<template>
    <div class="statistics-container">
        <div class="filter-table-view">
            <el-form :inline="true"  class="demo-form-inline" ref="filterForm">
                <el-form-item label="提交时间" prop="endDateTime">
                    <el-date-picker
                        v-model="queryConditions.beginDateTime"
                        type="datetime"
                        placeholder="开始时间">
                    </el-date-picker>
                    <span> 至 </span>
                    <el-date-picker
                        v-model="queryConditions.endDateTime"
                        type="datetime"
                        placeholder="结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryProjectResult">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="result-table-view">
            <el-table
                stripe :header-cell-style="{background:'#2466a0'}"
                :data="projectResultList">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column v-for="col in fixedCustomColumns" :key="col"
                                 :label="fixedDefaultLabelFormColumn[col]">
                    <template slot-scope="scope">
                        {{ scope.row[col] }}
                    </template>
                </el-table-column>
                <el-table-column v-for="col in otherCustomColumns" :key="col"
                                 :label="projectItemColumns[col]">
                    <template slot-scope="scope">
                        {{ scope.row['processData'][col] }}
                    </template>
                </el-table-column>
                <el-table-column
                    width="50"
                    fixed="right"
                    :render-header="renderHeader">
                </el-table-column>
            </el-table>
        </div>
        <div class="">
            <el-dialog center title="自定义显示列" :visible.sync="customColumnDialogVisible">
                <el-row>
                    <el-col :span="3">
                        <span>显示列：</span>
                    </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-checkbox-group v-model="checkFixedCustomColumns">
                    <el-row>
                        <el-col :span="4" v-for="(val, key, index)  in fixedDefaultLabelFormColumn">
                            <el-checkbox :label="key">{{ val }}</el-checkbox>
                        </el-col>
                    </el-row>
                </el-checkbox-group>
                <el-divider></el-divider>
                <el-checkbox-group v-model="checkOtherCustomColumns">
                    <el-row>
                        <el-col :span="8" v-for="(val, key, index) in projectItemColumns">
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
    </div>
</template>

<script>
import _ from 'lodash'
import {getCheckedColumn, saveCheckedColumn} from '@/utils/db'

const fixedDefaultFormColumn = ['serialNumber', 'submitAddress', 'createTime']
const fixedDefaultLabelFormColumn = {serialNumber: '提交序号', submitAddress: '提交地址', createTime: '提交时间'}

export default {
    name: 'projectStatistics',
    components: {},
    props: {
        projectKey: ''
    },
    mounted() {
        this.queryConditions.projectKey = this.projectKey
        this.queryProjectResult()
        this.queryProjectItems()

    },
    data() {
        return {
            customColumnDialogVisible: false,
            //固定自定义列 如序号等
            fixedCustomColumns: fixedDefaultFormColumn,
            //选中的
            checkFixedCustomColumns: fixedDefaultFormColumn,
            fixedDefaultLabelFormColumn: fixedDefaultLabelFormColumn,
            //自定义表单属性
            checkOtherCustomColumns: [],
            otherCustomColumns: [],
            projectResultList: [],
            projectItemList: [],
            projectItemColumns: {},
            //查询条件
            queryConditions: {
                projectKey: '',
                beginDateTime: '',
                endDateTime: ''
            }
        }
    }, methods: {
        renderHeader(h) {
            return (
                <i class="el-icon-setting" onClick={() => this.customColumnDialogVisible = true}></i>
            )
        },
        queryProjectResult() {
            this.$api.post(`/user/project/result/query`, this.queryConditions).then(res => {
                this.projectResultList = res.data.records
            })
        },
        saveStatisticsCheckedColumns() {
            this.customColumnDialogVisible = false
            this.fixedCustomColumns = this.checkFixedCustomColumns
            this.otherCustomColumns = this.checkOtherCustomColumns
            saveCheckedColumn(this.projectKey, {
                fixedCustomColumns: this.fixedCustomColumns,
                otherCustomColumns: this.otherCustomColumns
            })
        },
        getDbCheckedColumns() {
            let {fixedCustomColumns, otherCustomColumns} = getCheckedColumn(this.projectKey)
            if (fixedCustomColumns) {
                this.fixedCustomColumns = fixedCustomColumns
                this.checkFixedCustomColumns = fixedCustomColumns
            }
            if (otherCustomColumns) {
                this.otherCustomColumns = otherCustomColumns
                this.checkOtherCustomColumns = otherCustomColumns
            }
        },
        queryProjectItems() {
            this.$api.get(`/user/project/item/list/${this.projectKey}`).then(res => {
                if (res.data) {
                    res.data.map((item) => {
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
    width: 100%;
    height: 100%;
    padding: 0px;
    min-height: 85vh;
    background-color: #F7F7F7;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.result-table-view {
    width: 80%;
    margin: 0px auto;
}

.filter-table-view {
    width: 80%;
    margin: 0px auto;
}

/deep/ .el-icon-setting {
    font-size: 24px;
    line-height: 25px;
    color: white;
}
</style>
