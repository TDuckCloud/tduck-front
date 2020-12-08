<template>
    <div class="statistics-container">
        <template>
            <el-table
                :data="projectResultList"
                style="width: 100%">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="serialNumber"
                    label="提交序号"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="submitAddress"
                    label="提交地址"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="地址">
                </el-table-column>
            </el-table>
        </template>

    </div>

</template>

<script>

export default {
    name: 'projectStatistics',
    components: {},
    props: {
        projectKey: '',
        projectResultList: []
    },
    mounted() {
        this.queryConditions.projectKey = this.projectKey
        this.queryProjectResult()
    },
    data() {
        return {
            //查询条件
            queryConditions: {
                projectKey: ''
            }
        }
    }, methods: {
        queryProjectResult() {
            this.$api.post(`/user/project/result/query`, this.queryConditions).then(res => {
                this.projectResultList = res.data
            })
        }
    }

}
</script>

<style lang="scss" scoped>
.statistics-container {
    width: 100%;
    height: 100%;
    padding: 0px;
    margin: 0;
    background-color: #F7F7F7;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
}

