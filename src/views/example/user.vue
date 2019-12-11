<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="审批人">
                <el-input v-model="username" placeholder="审批人"></el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="getData">查询</el-button>
        <el-table
            :data="tableData">
            <el-table-column
                prop="id"
                label="Id"
                width="180">
            </el-table-column>
            <el-table-column
                prop="date"
                label="日期"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="gender"
                label="性别"
                width="180">
            </el-table-column>
            <el-table-column
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button @click="handleDeleteClick(scope.row,scope)" type="text" size="small">删除</el-button>
                    <el-button type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="current"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: 'user',
        data() {
            return {
                tableData: [],
                current: 1,
                size: 10,
                total: 0,
                username: ''
            }
        },
        methods: {
            handleSizeChange(size) {
                this.size = size
                this.getData()
            },
            handleCurrentChange(current) {
                this.current = current
                this.getData()
            },
            handleDeleteClick(row, scope) {
                this.$api.post(`/api/v1/user/delete?id=${row.id}`).then(res => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                })
            },
            getData() {
                let params = {current: this.current, size: this.size, name: this.username}
                this.$api.get('/api/v1/user/page', {
                    params: params
                }).then(res => {
                    this.tableData = res.data.records
                    this.size = res.data.size
                    this.total = res.data.total
                    this.current = res.data.current
                })
            }
        },
        mounted() {
            this.getData()
        }
    }
</script>

<style scoped>
</style>
