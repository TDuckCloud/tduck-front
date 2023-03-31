<template>
  <div class="source">
    <el-card class="source-card" shadow="hover">
      <template #header>
        <span>
          <font-icon class="fa fa-bar-chart" />
          提交来源
        </span>
      </template>
      <t-chart class="source-echart" :init-options="initOptions" :option="option" theme="tduck-echarts-theme" />
    </el-card>
  </div>
</template>

<script>
import TChart from '@/views/components/TChart'
import { getFormSourceRequest } from '@/api/project/report'

export default {
  components: { TChart },
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
          top: '0%',
          left: '2%',
          right: '20%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: [
          {
            splitLine: {
              show: false
            },
            type: 'value',
            show: false
          }
        ],
        yAxis: [
          {
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            type: 'category',
            axisTick: {
              show: false
            },
            data: []
          }
        ],
        series: [
          {
            name: '数量',
            type: 'bar',
            barWidth: 15,
            label: {
              show: true,
              position: 'right',
              color: '#1890FF',
              fontSize: 12,
              formatter: ({ data }) => {
                return `${data}`
              }
            },
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            data: []
          }
        ]
      }
    }
  },
  created() {
    this.getProjectSubmitSource()
  },
  methods: {
    getProjectSubmitSource() {
      getFormSourceRequest({ formKey: this.formKey }).then((res) => {
        if (res.data && res.data.length) {
          this.option.yAxis[0].data = res.data.map((item) => {
            return item.browserName ? item.browserName : '其他'
          })
          this.option.series[0].data = res.data.map((item) => {
            return item.count
          })
        }
      })
    }
  }
}
</script>
