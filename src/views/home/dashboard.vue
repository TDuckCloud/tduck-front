<template>
    <el-row style="min-width: 1024px;">
        <el-row type="flex" align="top" justify="space-around">
            <el-col :offset="1" :span="11">
                <el-row type="flex" align="middle" justify="center">
                    <el-col :span="3">
                        <p class="tagTitle">回收概览</p>
                    </el-col>
                    <el-col :offset="1" :span="21">
                        <el-select v-model="activeProjectKey"
                                   placeholder="请选择"
                                   @change="projectChangeHandle"
                        >
                            <el-option

                                v-for="item in projectListData"
                                :key="item.key"
                                :label="item.name"
                                :value="item.key"
                            />
                        </el-select>
                    </el-col>
                </el-row>
                <el-row
                    style="width: 719px; height: 450px; border-radius: 10px; border: 1px solid rgba(187, 187, 187, 100);"
                >
                    <el-row style="height: 50px;" />
                    <el-row>
                        <el-row type="flex" justify="space-around" style="text-align: center;">
                            <el-col :span="5">
                                <span>有效回收量</span>
                            </el-col>
                            <el-col :span="5">
                                <span>总浏览量</span>
                            </el-col>
                            <el-col :span="5">
                                <span>回收率</span>
                            </el-col>
                            <el-col :span="5">
                                <span>平均完成时间</span>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-around" style="text-align: center;">
                            <el-col :span="5">
                                <count-to :end-val="projectStats.completeCount"
                                          style="font-size: 20px;"
                                />
                            </el-col>
                            <el-col :span="5">
                                <count-to :end-val="projectStats.viewCount" style="font-size: 20px;" />
                            </el-col>
                            <el-col :span="5">
                                <count-to :end-val="projectStats.completeRate" style="font-size: 20px;" />
                                %
                            </el-col>
                            <el-col :span="5">
                                <span style="font-size: 20px;">
                                    {{ projectStats.avgCompleteFormatStr }}
                                </span>
                            </el-col>
                        </el-row>
                    </el-row>
                    <el-row>
                        <line-chart :chart-option="lineChartOptionData" />
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
                        <map-chart :chart-option="mapChartOptionData" />
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
                            <bar-chart :chart-option="barChartOptionData" />
                        </el-row>
                    </el-col>
                    <el-col :span="12">
                        <el-row>
                            <el-col :span="5">
                                <p class="tagTitle">来源渠道</p>
                            </el-col>
                        </el-row>
                        <el-row>
                            <pie-chart :chart-option="pieChartOptionData" />
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
import {timeFormat} from '@/utils/index'

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
            projectListData: null,
            projectStats: {
                avgCompleteTime: 0,
                avgCompleteFormatStr: 0,
                viewCount: 0,
                completeCount: 0,
                completeRate: 0
            },
            activeProjectKey: null,
            // 回收折现图
            lineChartOptionData: {},
            mapChartOptionData: {},
            barChartOptionData: {},
            pieChartOptionData: {}
        }
    },
    created() {
        this.$api.get('/user/project/list', {params: {status: 2}}).then(res => {
            this.projectListData = res.data
            if (res.data) {
                this.activeProjectKey = res.data[0].key
                this.projectChangeHandle()
            }
        })
    }, methods: {
        projectChangeHandle() {
            this.getProjectStats()
            this.getProjectSituation()
            this.getProjectSubmitPosition()
            this.getProjectSubmitDevice()
            this.getProjectSubmitSource()
        },
        getProjectStats() {
            this.$api.get('/user/project/report/stats', {params: {projectKey: this.activeProjectKey}}).then(res => {
                this.projectStats = res.data
                if (this.projectStats.completeCount) {
                    let rate = this.projectStats.completeCount / this.projectStats.viewCount
                    this.projectStats.completeRate = rate > 1 ? 100 : rate * 100
                    this.projectStats.avgCompleteFormatStr = timeFormat(this.projectStats.avgCompleteTime)
                }
            })
        },
        getProjectSituation() {
            this.$api.get('/user/project/report/situation', {params: {projectKey: this.activeProjectKey}}).then(res => {
                this.lineChartOptionData = {
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisTick: {
                            show: false
                        },
                        data: res.data.map(item => {
                            return item.createTime
                        })
                    },
                    tooltip: {
                        trigger: 'axis',
                        backgroundColor: 'rgba(255,255,255,0.8)', // 通过设置rgba调节背景颜色与透明度
                        color: 'black',
                        borderWidth: '1',
                        borderColor: 'rgb(156,209,255)',
                        textStyle: {
                            color: 'black'
                        }
                    },
                    yAxis: {
                        type: 'value',
                        minInterval: 1
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    series: [{
                        data: res.data.map(item => {
                            return item.count
                        }),
                        name: '回收数',
                        stack: '总量',
                        type: 'line',
                        areaStyle: {}
                    }]
                }
            })
        },
        // 项目提交地址
        getProjectSubmitPosition() {
            this.$api.get('/user/project/report/position', {params: {projectKey: this.activeProjectKey}}).then(res => {
                this.mapChartOptionData = {
                    tooltip: {
                        trigger: 'item',
                        backgroundColor: 'rgba(255,255,255,0.8)', // 通过设置rgba调节背景颜色与透明度
                        color: 'black',
                        borderWidth: '1',
                        borderColor: 'rgb(156,209,255)',
                        textStyle: {
                            color: 'black'
                        }
                    },
                    visualMap: {
                        type: 'piecewise',
                        show: false,
                        pieces: [
                            {min: 1500},
                            {min: 900, max: 1500},
                            {min: 310, max: 1000},
                            {min: 1, max: 300}
                        ],
                        color: ['#E0022B', '#E09107', '#A3E00B']
                    },
                    toolbox: {
                        show: false,
                        orient: 'vertical',
                        left: 'right',
                        top: 'center',
                        feature: {
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    series: [
                        {
                            name: '提交数',
                            type: 'map',
                            mapType: 'china',
                            zoom: 1.2,
                            roam: false,
                            label: {
                                show: true,
                                color: 'rgb(0,0,0)'
                            },
                            data: Object.keys(res.data).map(key => {
                                return {name: key.replace(/省(s?)|市(s?)|\//ig, ''), value: res.data[key]}
                            })
                        }
                    ]
                }
            })

        },
        // 常用设备
        getProjectSubmitDevice() {
            this.barChartOptionData = {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(255,255,255,0.8)', // 通过设置rgba调节背景颜色与透明度
                    color: 'black',
                    borderWidth: '1',
                    borderColor: 'rgb(156,209,255)',
                    textStyle: {
                        color: 'black'
                    },
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: ['虾米', '印尼', '美国', '印度', '中国', '世界人口(万)']
                },
                series: [
                    {
                        name: '2011年',
                        type: 'bar',
                        data: [18203, 23489, 29034, 104970, 131744, 630230]
                    }
                ]
            }

        },
        getProjectSubmitSource() {
            this.pieChartOptionData = {
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(255,255,255,0.8)', // 通过设置rgba调节背景颜色与透明度
                    color: 'black',
                    borderWidth: '1',
                    borderColor: 'rgb(156,209,255)',
                    textStyle: {
                        color: 'black'
                    }
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: 335, name: '直接访问'},
                            {value: 310, name: '邮件营销'},
                            {value: 234, name: '联盟广告'},
                            {value: 135, name: '视频广告'},
                            {value: 1548, name: '搜索引擎'}
                        ]
                    }
                ]
            }

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
.el-select-dropdown__item {
    width: 300px !important;
}
</style>
