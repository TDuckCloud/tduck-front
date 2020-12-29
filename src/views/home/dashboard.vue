<template>
    <el-row>
        <el-row type="flex" align="top" justify="space-around">
            <el-col :offset="1" :span="11">
                <el-row type="flex" align="middle" justify="center">
                    <el-col :span="3">
                        <p class="tagTitle">回收概览</p>
                    </el-col>
                    <el-col :offset="1" :span="21">
                        <el-select v-model="value" placeholder="请选择">
                            <el-option
                                v-for="item in ['表单1']"
                                :key="item"
                                :label="item"
                                :value="item"
                            />
                        </el-select>
                    </el-col>
                </el-row>
                <el-row
                    style="width: 719px; height: 450px; border-radius: 10px; border: 1px solid rgba(187, 187, 187, 100);"
                >
                    <el-row style="height: 50px;" />
                    <el-row>
                        <el-row type="flex" justify="space-around">
                            <el-col :offset="2" :span="5">
                                <span>有效回收量</span>
                            </el-col>
                            <el-col :span="5">
                                <span>总浏览量</span>
                            </el-col>
                            <el-col :span="5">
                                <span>回收率</span>
                            </el-col>
                            <el-col :span="5">
                                <span>平局完成时间</span>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-around">
                            <el-col :offset="2" :span="5">
                                <count-to style="font-size: 20px;">
                                    1231
                                </count-to>
                            </el-col>
                            <el-col :span="5">
                                <count-to style="font-size: 20px;">
                                    3921
                                </count-to>
                            </el-col>
                            <el-col :span="5">
                                <count-to style="font-size: 20px;">
                                    28
                                </count-to>
                                %
                            </el-col>
                            <el-col :span="5">
                                <span style="font-size: 20px;">  12分16秒</span>
                            </el-col>
                        </el-row>
                    </el-row>
                    <el-row>
                        <line-chart :chart-data="lineChartData" />
                    </el-row>
                </el-row>
            </el-col>
            <el-col :span="12">
                <el-row type="flex" align="middle" justify="start">
                    <el-col :span="6">
                        <p class="tagTitle">表单提交地域分布图</p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <map-chart />
                    </el-col>
                </el-row>
                <el-row type="flex" justify="space-around">
                    <el-col :span="12">
                        <el-row>
                            <el-col :span="5">
                                <p class="tagTitle">常用设备</p>
                            </el-col>
                        </el-row>
                        <el-row>
                            <bar-chart />
                        </el-row>
                    </el-col>
                    <el-col :span="12">
                        <el-row>
                            <el-col :span="5">
                                <p class="tagTitle">来源渠道</p>
                            </el-col>
                        </el-row>
                        <el-row>
                            <pie-chart />
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row style="height: 30px;" />
    </el-row>
</template>
<script>
import PieChart from '@/components/echarts/PieChart'
import LineChart from '@/components/echarts/LineChart'
import MapChart from '@/components/echarts/MapChart'
import CountTo from '@/components/CountTo'
import BarChart from '@/components/echarts/BarChart'
const lineChartData = {
    newVisitis: {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
    },
    messages: {
        expectedData: [200, 192, 120, 144, 160, 130, 140],
        actualData: [180, 160, 151, 106, 145, 150, 130]
    },
    purchases: {
        expectedData: [80, 100, 121, 104, 105, 90, 100],
        actualData: [120, 90, 100, 138, 142, 130, 130]
    },
    shoppings: {
        expectedData: [130, 140, 141, 142, 145, 150, 160],
        actualData: [120, 82, 91, 154, 162, 140, 130]
    }
}
export default {
    name: 'HomeDashboard',
    components: {
        CountTo,
        PieChart,
        MapChart,
        BarChart,
        LineChart
    },
    data() {
        return {
            lineChartData: lineChartData.newVisitis
        }
    }
}
</script>

<style scoped>
.tagTitle {
    font-size: 20px;
    border-bottom: 3px solid rgba(68, 68, 68, 100);
    line-height: 25px;
}
</style>
