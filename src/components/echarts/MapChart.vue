<template>
    <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
const echarts = require('echarts')
require('./china.js')
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
        }
    },
    data() {
        return {
            chart: null
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

            this.chart.setOption({
                title: {
                    text: '订单量',
                    subtext: '纯属虚构',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['订单量']
                },
                visualMap: {
                    type: 'piecewise',
                    pieces: [

                        {min: 1500},
                        {min: 900, max: 1500},
                        {min: 310, max: 1000},
                        {min: 200, max: 300},
                        {min: 10, max: 200, label: '10 到 200（自定义label）'},
                        {value: 123, label: '123（自定义特殊颜色）', color: 'grey'},
                        {min: 5, max: 5, label: '5（自定义特殊颜色）', color: 'black'},
                        {max: 5}
                    ],
                    color: ['#E0022B', '#E09107', '#A3E00B']
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                roamController: {
                    show: true,
                    left: 'right',
                    mapTypeControl: {
                        'china': true
                    }
                },
                series: [
                    {
                        name: '订单量',
                        type: 'map',
                        mapType: 'china',
                        roam: false,
                        label: {
                            show: true,
                            color: 'rgb(249, 249, 249)'
                        },
                        data: [
                            {name: '北京', value: 5},
                            {name: '天津', value: Math.round(Math.random() * 2000)},
                            {name: '上海', value: Math.round(Math.random() * 2000)},
                            {name: '重庆', value: Math.round(Math.random() * 2000)},
                            {name: '河北', value: 0},
                            {name: '河南', value: Math.round(Math.random() * 2000)},
                            {name: '云南', value: 123},
                            {name: '辽宁', value: 305},
                            {name: '黑龙江', value: Math.round(Math.random() * 2000)},
                            {name: '湖南', value: 200},
                            {name: '安徽', value: Math.round(Math.random() * 2000)},
                            {name: '山东', value: Math.round(Math.random() * 2000)},
                            {name: '新疆', value: Math.round(Math.random() * 2000)},
                            {name: '江苏', value: Math.round(Math.random() * 2000)},
                            {name: '浙江', value: Math.round(Math.random() * 2000)},
                            {name: '江西', value: Math.round(Math.random() * 2000)},
                            {name: '湖北', value: Math.round(Math.random() * 2000)},
                            {name: '广西', value: Math.round(Math.random() * 2000)},
                            {name: '甘肃', value: Math.round(Math.random() * 2000)},
                            {name: '山西', value: Math.round(Math.random() * 2000)},
                            {name: '内蒙古', value: Math.round(Math.random() * 2000)},
                            {name: '陕西', value: Math.round(Math.random() * 2000)},
                            {name: '吉林', value: Math.round(Math.random() * 2000)},
                            {name: '福建', value: Math.round(Math.random() * 2000)},
                            {name: '贵州', value: Math.round(Math.random() * 2000)},
                            {name: '广东', value: Math.round(Math.random() * 2000)},
                            {name: '青海', value: Math.round(Math.random() * 2000)},
                            {name: '西藏', value: Math.round(Math.random() * 2000)},
                            {name: '四川', value: Math.round(Math.random() * 2000)},
                            {name: '宁夏', value: Math.round(Math.random() * 2000)},
                            {name: '海南', value: Math.round(Math.random() * 2000)},
                            {name: '台湾', value: Math.round(Math.random() * 2000)},
                            {name: '香港', value: Math.round(Math.random() * 2000)},
                            {name: '澳门', value: Math.round(Math.random() * 2000)}
                        ]
                    }
                ]
            })
        }
    }
}
</script>
