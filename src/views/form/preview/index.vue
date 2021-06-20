<template>
    <div class="preview-container">
        <el-tabs v-if="projectConfig.projectKey" type="card">
            <el-tab-pane>
                <span slot="label"><i class="el-icon-mobile" />
                    手机
                </span>
                <div class="preview-layer">
                    <div class="preview-bg" />
                    <div class="preview-phone">
                        <iframe id="preview-html"
                                :src="mobilePreviewUrl"
                                class="preview-html" frameborder="0"
                                name="preview-html"
                                scrolling="auto"
                        />
                    </div>
                </div>
                <div v-if="mobilePreviewUrl&&previewQrcode" class="qrcode-view">
                    <p>手机扫码查看效果</p>
                    <vue-qr
                        v-if="mobilePreviewUrl&&previewQrcode" :size="194" :text="mobilePreviewUrl"
                    />
                </div>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-monitor" />
                    电脑
                </span>
                <el-scrollbar style="height: 77vh;overflow-x: hidden!important;">
                    <project-form
                        v-if="projectConfig.projectKey"
                        :project-config="projectConfig"
                    />
                </el-scrollbar>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import ProjectForm from './ProjectForm'
import VueQr from 'vue-qr'

export default {
    name: 'PreView',
    components: {
        ProjectForm,
        VueQr
    },
    props: {
        previewQrcode: null
    },
    data() {
        return {
            projectKey: null,
            mobilePreviewUrl: '',
            projectConfig: {
                projectKey: '',
                showBtns: true
            }
        }
    },
    mounted() {
        this.projectKey = this.$route.query.key
        let url = window.location.protocol + '//' + window.location.host
        this.mobilePreviewUrl = `${url}/project/view?key=${this.projectKey}`
        this.$set(this.projectConfig, 'projectKey', this.projectKey)
    }
}
</script>

<style lang="scss" scoped>

.preview-container {
  margin: 0;
  padding-top: 30px;
  background-color: #f7f7f7;
}
::v-deep .el-tabs--card>.el-tabs__header .el-tabs__nav{
  border: 1px solid #E4E7ED!important;
}
::v-deep .el-tabs__header {
  width: 300px;
  margin: 0 auto;
  border: none;
}

::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item {
  background-color: white;
  border: 1px solid white;
}

div.preview-layer {
  width: 500px;
  height: 100%;
  margin: 10px auto;
  right: 0;
  text-align: center;
}

div.preview-layer .preview-bg {
  width: 500px;
  height: 100%;
  margin: 20px auto;
  z-index: 999;
  opacity: 0.7;
}

div.preview-layer .preview-phone {
  width: 372px;
  height: 744px;
  background: url('~@/assets/images/appearset_bgc_big.png');
  background-size: 372px 744px;
  z-index: 1000;
}

.qrcode-view{
  position: absolute;
  top: 0;
  right: 20px;
  p{
    text-align: center;
    font-size: 12px;
    color: #303133;
  }
}

.preview-html {
  width: 345px !important;
  height: 568px !important;
  margin: 74px 0 0;
  border-radius: 5px;
  outline: none;
  background-color: #fff;
  border-width: 2px;
  border-style: inset;
  border-color: initial;
  border-image: initial;
  border-top-width: 0;
  border-right-width: 0;
  border-bottom-width: 0;
  border-left-width: 0;
}

</style>
