<template>
  <div class="setting-container">
    <el-tabs tab-position="left" class="setting-tabs">
      <el-tab-pane label="提交设置">
        <submit-setting />
      </el-tab-pane>
      <el-tab-pane label="回收设置">
        <write-setting />
      </el-tab-pane>
      <el-tab-pane label="通知设置">
        <notify-setting />
      </el-tab-pane>
      <el-tab-pane label="分享设置">
        <share-setting />
      </el-tab-pane>
      <el-tab-pane label="数据推送">
        <data-push />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import SubmitSetting from './submit'
import WriteSetting from './write'
import NotifySetting from './notify'
import ShareSetting from './share'
import DataPush from './DataPush'

export default {
  name: 'ProjectSetting',
  components: {
    SubmitSetting,
    WriteSetting,
    NotifySetting,
    ShareSetting,
    DataPush
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.setting-container {
  width: 100%;
  background-color: var(--color-bg);
  display: flex;
  justify-content: center;

  .setting-tabs {
    border-radius: 8px;
    margin-top: 20px;
    width: 900px;
    min-height: 500px;
  }
}

::v-deep.el-tabs--left .el-tabs__nav-wrap.is-left::after {
  width: 0;
}

::v-deep.el-tabs--left .el-tabs__nav.is-left,
.el-tabs--left .el-tabs__nav.is-right,
.el-tabs--right .el-tabs__nav.is-left,
.el-tabs--right .el-tabs__nav.is-right {
  background-color: #ffffff !important;
  //box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04) !important;
}
</style>
