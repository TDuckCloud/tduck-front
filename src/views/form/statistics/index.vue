<template>
    <div class="statistics-tabs">
        <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="列表视图" name="list">
                <list />
            </el-tab-pane>
            <el-tab-pane label="统计视图" name="chart">
                <chart />
            </el-tab-pane>
            <el-tab-pane label="数据分析" name="analysis">
                <analysis />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import list from './list'
import chart from './chart'
import analysis from './analysis'

export default {
    name: 'ProjectStatistics',
    components: {
        list,
        chart,
        analysis
    },
    data() {
        return {
            activeName: 'list'
        }
    },
    mounted() {

    }, methods: {}

}
</script>

<style scoped>
.statistics-tabs {
  padding: 20px;
  //width: 99%;
  height: 100%;
}

::v-deep .el-tabs__content {
  padding: 0;
}
</style>
