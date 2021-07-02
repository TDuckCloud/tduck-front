<template>
    <div class="analysis">
        <div v-if="list.length && list.length !== 0">
            <div v-for="(item, index) in list" :key="index">
                <div class="content">
                    <div class="title">
                        <span style="font-size: 16px">Q：{{ item.label }}（{{ item.type }}）</span>

                        <div>
                            <span>图表类型：</span>
                            <el-select v-model="item.chartType" placeholder="请选择">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </div>
                    </div>
                    <line-chart
                        class="chart"
                        :chart-option="getCharData(item)"
                        :width="'90vw'"
                    />
                </div>
                <el-divider />
            </div>
        </div>
        <data-empty v-else style="padding: 20px" desc="只有单选、多选、下拉框组件可以生成图表" />
    </div>
</template>

<script>
import LineChart from '@/components/echarts/LineChart'
export default {
    components: {
        LineChart
    },
    data() {
        return {
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
                xAxis: [
                    {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '数量',
                        type: 'line',
                        barWidth: '40%',
                        data: [10, 52, 200, 334, 390, 330, 220]
                    }
                ]
            },
            list: [],
            options: [
                {
                    value: 'pie',
                    label: '饼图'
                },
                /* {
          value: "ring",
          label: "环形图",
        }, */
                {
                    value: 'bar',
                    label: '柱状图'
                },
                {
                    value: 'line',
                    label: '折线图'
                }
            ]
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            this.$api
                .get('/user/project/report/analysis', {
                    params: { projectKey: this.$route.query.key }
                })
                .then(res => {
                    this.list = res.data
                })
        },
        getCharData(data) {
            const config = {
                tooltip: {
                    backgroundColor: 'rgba(255,255,255,0.8)', // 通过设置rgba调节背景颜色与透明度
                    color: 'black',
                    borderWidth: '1',
                    borderColor: 'rgb(156,209,255)',
                    textStyle: {
                        color: 'black'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '数量',
                        type: 'pie',
                        barWidth: '40%'
                    }
                ]
            }
            if (['bar', 'line'].includes(data.chartType)) {
                config.tooltip.axisPointer = {
                    type: 'line'
                }
                config.tooltip.trigger = 'axis'
                config.xAxis[0].data = data.fieldName
                config.series[0].data = data.data
                config.series[0].type = data.chartType
            } else {
                // 环形图暂时不用   无法切换到饼图
                /* if ("ring" === data.chartType) {
          config.series[0].radius = ["40%", "70%"];
          
          config.series[0].emphasis = {
                label: {
                    show: true,
                    fontSize: '25',
                    fontWeight: 'bold'
                }
            }
        }else{
          delete config.series[0].radius
          delete config.series[0].label
        } */
                config.series[0].data = []
                Object.keys(data.map).forEach(key => {
                    config.series[0].data.push({ name: key, value: data.map[key] })
                })
                // config.series[0].data = data.map
            }
            return config
        }
    }
}
</script>

<style lang="scss" scoped>
.analysis {
  width: 100%;
  // padding: 20px;
  .content {
    padding: 20px;
    width: 100%;
    .title {
      font-size: 14px;
      padding: 0 30px;
      height: 54px;
      line-height: 54px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      .select {
        float: right;
      }
    }
  }
}
</style>