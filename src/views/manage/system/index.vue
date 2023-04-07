<template>
  <el-card style="padding-top: 20px; padding-left: 50px">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="系统配置" name="systemInfoConfig">
        <system-info-config v-if="activeName === 'systemInfoConfig'" />
      </el-tab-pane>
      <el-tab-pane label="文件存储" name="fileEnvConfig">
        <oss-config v-if="activeName === 'fileEnvConfig'" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import ConfigMixin from './subconfig/ConfigMixin'
import SystemInfoConfig from './subconfig/SystemInfoConfig.vue'
import OssConfig from './subconfig/OssConfig.vue'

export default {
  name: 'ConfigForm',
  components: { SystemInfoConfig, OssConfig },
  mixins: [ConfigMixin],
  methods: {
    handleTabClick() {
      if (!['systemInfoConfig', 'fileEnvConfig'].includes(this.activeName)) {
        this.handleClick()
      }
    }
  }
}
</script>

<style scoped>
.el-input {
  width: 50%;
}
</style>
