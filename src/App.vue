<template>
  <div id="app">
    <RouterView v-if="isRouterAlive" />
  </div>
</template>

<script>
import TduckForm from 'tduck-form-generator'
import { getCurrentDomain } from '@/utils'

export default {
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  watch: {
    $route: 'routeChange'
  },
  async beforeCreate() {
    window.tduckBaseUrl = process.env['VUE_APP_API_ROOT']
    if (process.env['VUE_APP_API_ROOT']) {
      localStorage.setItem(TduckForm.constant.BASE_URL, process.env['VUE_APP_API_ROOT'])
    } else {
      localStorage.setItem(TduckForm.constant.BASE_URL, getCurrentDomain())
    }
    // 获取系统配置并存储到 localStorage
    try {
      const sysRes = await this.$api.get('/public/systemInfoConfig')
      const systemConfig = JSON.parse(sysRes.data)
      localStorage.setItem('systemConfig', JSON.stringify(systemConfig))
    } catch (error) {
      console.error('获取系统配置失败:', error)
    }
    window.aMapKey = process.env['VUE_APP_MAP_KEY']
    window.aMapSecurityJsCode = process.env['VUE_APP_SECURITY_JSCODE']
    console.log('更新日期：2025-6-9 12:39:04')
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => (this.isRouterAlive = true))
    },
    routeChange(newVal, oldVal) {
      if (newVal.name == oldVal.name) {
        this.reload()
      }
    }
  },
  metaInfo: {
    titleTemplate: (title) => {
      try {
        const systemConfig = JSON.parse(localStorage.getItem('systemConfig'))
        const systemName = systemConfig?.systemName || process.env.VUE_APP_TITLE
        return title ? `${title} - ${systemName}` : systemName
      } catch (error) {
        console.error('获取系统名称失败:', error)
        return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
      }
    }
  }
}
</script>
