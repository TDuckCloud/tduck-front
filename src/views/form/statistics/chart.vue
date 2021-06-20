<template>
    <div class="dashboard-container">
        <p class="tag-title">回收概览</p>
        <el-divider />
        <div class="project-index-view">
            <div>
                <div>
                    <p class="text-center">有效回收量</p>
                    <count-to :end-val="projectStats.completeCount"
                              style="font-size: 20px;"
                    />
                </div>
                <div>
                    <p>总浏览量</p>
                    <count-to :end-val="projectStats.viewCount" style="font-size: 20px;" />
                </div>
                <div>
                    <p>回收率</p>
                    <count-to :end-val="projectStats.completeRate" style="font-size: 20px;" />
                    %
                </div>
                <div>
                    <p>平均完成时间</p>
                    <span style="font-size: 20px;">
                        {{ projectStats.avgCompleteFormatStr }}
                    </span>
                </div>
            </div>
        </div>
        <div class="line-chat">
            <line-chart :width="'95vw'" :chart-option="lineChartOptionData" />
        </div>
        <p class="tag-title">表单提交地域分布图</p>
        <div style="width: 90%">
            <map-chart :width="'100vw'" :chart-option="mapChartOptionData" :height="'450px'" />
        </div>
        <el-divider />
        <div style="display: flex; flex-direction: row; justify-content: space-around;">
            <div style="width: 50%;">
                <p class="tag-title">常用设备</p>
                <div>
                    <pie-chart :width="'48vw'" :chart-option="pieChartOptionData" :height="'250px'" />
                </div>
            </div>
            <div style="width: 50%;">
                <p class="tag-title">来源渠道</p>
                <div>
                    <bar-chart :width="'48vw'" :chart-option="barChartOptionData" :height="'250px'" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PieChart from '@/components/echarts/PieChart'
import LineChart from '@/components/echarts/LineChart'
import MapChart from '@/components/echarts/MapChart'
import CountTo from '@/components/CountTo'
import BarChart from '@/components/echarts/BarChart'
import {timeFormat} from '@/utils'

export default {
    name: 'StatisticsChart',
    components: {
        CountTo,
        MapChart,
        PieChart,
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
            lineChartOptionData: {
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisTick: {
                        show: false
                    },
                    data: []
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
                    data: [],
                    name: '回收数',
                    stack: '总量',
                    type: 'line',
                    areaStyle: {}
                }]
            },
            mapChartOptionData: {
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
                        zoom: 1.4,
                        roam: false,
                        label: {
                            show: false,
                            color: 'rgb(0,0,0)'
                        },
                        data: []
                    }
                ]
            },
            barChartOptionData: {
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
                    interval: 1,
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: [0]
                },
                series: [
                    {
                        barWidth: 30,
                        name: '数量',
                        type: 'bar',
                        data: [0]
                    }
                ]
            },
            pieChartOptionData: {
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
                        name: '设备类型',
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
                        data: [0]
                    }
                ]
            }
        }
    },
    created() {
        this.activeProjectKey = this.$route.query.key
        this.projectChangeHandle()

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
                } else {
                    this.projectStats.completeRate = 0
                    this.projectStats.avgCompleteFormatStr = 0
                }
            })
        },
        getProjectSituation() {
            this.$api.get('/user/project/report/situation', {params: {projectKey: this.activeProjectKey}}).then(res => {
                this.lineChartOptionData.xAxis.data = res.data.map(item => {
                    return item.createTime
                })
                this.lineChartOptionData.series = [{
                    data: res.data.map(item => {
                        return item.count
                    }),
                    name: '回收数',
                    stack: '总量',
                    type: 'line',
                    areaStyle: {}
                }]
            })
        },
        // 项目提交地址
        getProjectSubmitPosition() {
            this.$api.get('/user/project/report/position', {params: {projectKey: this.activeProjectKey}}).then(res => {
                this.mapChartOptionData.series = [
                    {
                        name: '提交数',
                        type: 'map',
                        mapType: 'china',
                        zoom: 1.2,
                        roam: false,
                        label: {
                            show: false,
                            color: 'rgb(0,0,0)'
                        },
                        data: Object.keys(res.data).map(key => {
                            return {name: key.replace(/省(s?)|市(s?)|\//ig, ''), value: res.data[key]}
                        })
                    }
                ]
            })
        },
        getProjectSubmitSource() {
            this.$api.get('/user/project/report/source', {params: {projectKey: this.activeProjectKey}}).then(res => {
                if (res.data && res.data.length) {
                    this.barChartOptionData.yAxis.data = res.data.map(item => {
                        return item.browserName ? item.browserName : '其他'
                    })
                    this.barChartOptionData.series = [
                        {
                            barWidth: 30,
                            name: '数量',
                            type: 'bar',
                            data: res.data.map(item => {
                                return item.count
                            })
                        }
                    ]
                }
            })
        },
        getProjectSubmitDevice() {
            this.$api.get('/user/project/report/device', {params: {projectKey: this.activeProjectKey}}).then(res => {
                if (res.data && res.data.length) {
                    this.pieChartOptionData.series[0].data = res.data.map(item => {
                        return {value: item.count, name: item.osName ? item.osName : '其他'}
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
    margin: 0;
    padding: 0;
    overflow-x: hidden!important;
}
.tag-title {
    font-size: 16px;
    line-height: 25px;
   margin-left: 20px;
}
.project-index-view {
    & > div {
        display: flex;
        width: 80%;
        text-align: center;
        margin: 0 auto;
        justify-content: space-between;
    }
}
</style>
