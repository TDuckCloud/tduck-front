<template>
  <div class="branch">
    <el-card class="branch-card" shadow="hover">
      <template #header>
        <font-icon class="fa fa-pie-chart" />
        <span> 常用设备 </span>
      </template>
      <t-chart class="device-echart" :init-options="initOptions" :option="option" theme="tduck-echarts-theme" />
    </el-card>
  </div>
</template>

<script>
import TChart from '@/views/components/TChart'
import { getFormDeviceRequest } from '@/api/project/report'

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
          trigger: 'item'
        },
        series: [
          {
            name: '常用设备',
            type: 'pie',
            radius: ['50%', '70%'],
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: []
          }
        ]
      }
    }
  },
  created() {
    this.getProjectSubmitDevice()
  },
  methods: {
    getProjectSubmitDevice() {
      getFormDeviceRequest({ formKey: this.formKey }).then((res) => {
        if (res.data && res.data.length) {
          this.option.series[0].data = res.data.map((item) => {
            return { value: item.count, name: item.osName ? item.osName : '其他' }
          })
        }
      })
    }
  }
}
</script>
