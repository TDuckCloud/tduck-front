<template>
    <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
const echarts = require('echarts')
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
    mixins: [resize],
    props: {
        className: {
            type: String,
            default: 'chart'
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '350px'
        },
        autoResize: {
            type: Boolean,
            default: true
        },
        chartOption: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            chart: null
        }
    },
    watch: {
        chartOption: {
            deep: true,
            handler(val) {
                this.setOptions(val)
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initChart()
        })
    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$el, 'macarons')
            this.setOptions(this.chartOption)
        },
        setOptions(chartOption) {
            this.chart.setOption(chartOption)
            // this.chart.setOption({
            //   xAxis: {
            //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            //     boundaryGap: false,
            //     axisTick: {
            //       show: false
            //     }
            //   },
            //   grid: {
            //     left: 10,
            //     right: 10,
            //     bottom: 20,
            //     top: 30,
            //     containLabel: true
            //   },
            // tooltip: {
            //   trigger: 'axis',
            //   axisPointer: {
            //     type: 'cross'
            //   },
            //   padding: [5, 10]
            // },
            // yAxis: {
            //   axisTick: {
            //     show: false
            //   }
            // },
            // legend: {
            //   data: ['expected', 'actual']
            // },
            // series: [{
            //     name: 'expected',
            //     smooth: true,
            //     type: 'line',
            //     data: expectedData,
            //     animationDuration: 2800,
            //     animationEasing: 'cubicInOut'
            //   },
            //   {
            //     name: 'actual',
            //     smooth: true,
            //     type: 'line',
            //     itemStyle: {
            //       normal: {
            //         color: '#3888fa',
            //         lineStyle: {
            //           color: '#3888fa',
            //           width: 2
            //         },
            //         areaStyle: {
            //           color: '#f3f8ff'
            //         }
            //       }
            //     },
            //     data: actualData,
            //     animationDuration: 2800,
            //     animationEasing: 'quadraticOut'
            //   }]
            // })
        }
    }
}
</script>
