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
            default: '300px'
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
            this.$api.get('https://unpkg.com/echarts@3.6.2/map/json/china.json').then(res=>{
                echarts.registerMap('china', res);
                this.chart = echarts.init(this.$el, 'macarons')
                this.setOptions(this.chartOption)
            })
        },
        setOptions(chartOption) {
            if (!this.chart) {
                return
            }
            this.chart.setOption(chartOption)
        }
    }
}
</script>
