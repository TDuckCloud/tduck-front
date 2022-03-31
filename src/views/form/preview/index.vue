<template>
    <div class="preview-container">
        <el-tabs v-if="formConfig.formKey" type="card">
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
                    <p class="text-danger">
                        * 预览只能查看效果，无法提交数据
                    </p>
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
                    <biz-project-form
                        v-if="formConfig.formKey"
                        :form-config="formConfig"
                    />
                </el-scrollbar>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import {BizProjectForm} from 'tduck-form-generator'
import VueQr from 'vue-qr'
import mixin from '../TduckFormMixin'

export default {
    name: 'PreView',
    components: {
        BizProjectForm,
        VueQr
    },
    mixins: [mixin],
    props: {
        previewQrcode: null
    },
    data() {
        return {
            formKey: null,
            mobilePreviewUrl: '',
            formConfig: {
                formKey: '',
                showBtns: true
            }
        }
    },
    mounted() {
        this.formKey = this.$route.query.key
        let url = window.location.protocol + '//' + window.location.host
        this.mobilePreviewUrl = `${url}/project/form/view?key=${this.formKey}`
        this.$set(this.formConfig, 'formKey', this.formKey)
    }
}
</script>

<style lang="scss" scoped>

.preview-container {
  margin: 0;
  padding-top: 30px;
  height: 100vh;
  overflow: hidden!important;
  background-color: var(--color-bg);
}

::v-deep .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: 1px solid #E4E7ED !important;
}

::v-deep .el-tabs__header {
  width: 300px;
  margin: 0 auto;
  border: none;
}

::v-deep .el-dialog__body {
  max-height: calc(100vh - 200px) !important;
}

::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item {
  background-color: white;
  border: 1px solid white;
}

::v-deep .project-form{
  margin: 40px auto 0px;
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

.qrcode-view {
  position: absolute;
  top: 20px;
  right: 260px;

  p {
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
