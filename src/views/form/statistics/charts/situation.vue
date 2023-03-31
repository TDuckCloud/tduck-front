<template>
  <el-card class="situation" shadow="hover">
    <template #header>
      <font-icon class="fa fa-line-chart" />
      周收集趋势
    </template>
    <t-chart style="width: 100%" :init-options="initOptions" :option="option" theme="tduck-echarts-theme" />
  </el-card>
</template>

<script>
import TChart from '@/views/components/TChart'
import { getFormSituationRequest } from '@/api/project/report'

export default {
  components: {
    TChart
  },
  props: {
    formKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      initOptions: {
        renderer: 'svg'
      },
      option: {
        tooltip: {
          trigger: 'axis',
          extraCssText: 'z-index:1'
        },
        grid: {
          top: '5%',
          left: '2%',
          right: '4%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            minInterval: 1
          }
        ],
        series: [
          {
            name: '回收量',
            stack: '总量',
            type: 'line',
            data: [],
            smooth: true,
            areaStyle: {},
            itemStyle: {
              borderRadius: [0, 5, 5, 0],
              color: new TChart.graphic.LinearGradient(
                0,
                0,
                1,
                0,
                ['#3ED572', '#399efd'].map((color, offset) => ({
                  color,
                  offset
                }))
              )
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.getProjectSituation()
  },
  methods: {
    getProjectSituation() {
      getFormSituationRequest({ formKey: this.formKey }).then((res) => {
        this.option.xAxis[0].data = res.data.map((item) => {
          return item.createTime
        })
        this.option.series[0].data = res.data.map((item) => {
          return item.count
        })
      })
    }
  }
}
</script>
