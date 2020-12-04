<template>
    <div class="preview-container">
        <el-tabs type="card" v-if="projectConfig.projectKey">
            <el-tab-pane>
            <span slot="label"><i class="el-icon-mobile"></i>
                手机
            </span>
                <div class="preview-layer">
                    <div class="preview-bg"/>
                    <div class="preview-phone">
                        <iframe id="preview-html"
                                scrolling="auto"
                                name="preview-html" class="preview-html"
                                frameborder="0"
                                :src="mobilePreviewUrl"
                        />
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane>
            <span slot="label"><i class="el-icon-monitor"></i>
                电脑
            </span>
                <project-form
                    :projectConfig="projectConfig"
                    v-if="projectConfig.projectKey"/>
            </el-tab-pane>
        </el-tabs>
    </div>

</template>

<script>
import ProjectForm from './ProjectForm'

export default {
    name: 'PreView',
    props: {
        projectKey: ''
    },
    data() {
        return {
            mobilePreviewUrl: '',
            projectConfig: {
                projectKey: '',
                showBtns: true
            }
        }
    },
    mounted() {
        let url = window.location.protocol + '//' + window.location.host
        this.mobilePreviewUrl = `${url}/project/view?key=${this.projectKey}`
        this.$set(this.projectConfig, 'projectKey', this.projectKey)
    },
    components: {
        ProjectForm
    }
}
</script>

<style scoped>

.preview-container {
    margin: 0;
    padding: 0;
    background-color: #f7f7f7;
    overflow-y: hidden !important;
}

/deep/ .el-tabs__header {
    width: 300px;
    margin: 0 auto;
    border: none;
}

/deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
    background-color: white;
    border: 1px solid white;
}

div.preview-layer {
    width: 500px;
    height: 100%;
    margin: 10px auto;
    right: 0;
    text-align: center;
    overflow-y: hidden !important;
}

div.preview-layer .preview-bg {
    width: 500px;
    height: 100%;
    margin: 20px auto;
    z-index: 999;
    opacity: 0.7;
    overflow-y: hidden !important;
}

div.preview-layer .preview-phone {
    width: 372px;
    height: 744px;
    background: url('~@/assets/images/appearset_bgc_big.png');
    background-size: 372px 744px;
    z-index: 1000;
    overflow-y: hidden !important;
}

.preview-html {
    width: 345px !important;
    height: 568px !important;
    overflow-y: hidden !important;
    margin: 74px 0 0;
    border-radius: 5px;
    outline: none;
    background-color: #fff;
    border-width: 2px;
    border-style: inset;
    border-color: initial;
    border-image: initial;
    border-top-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 0px;
    border-left-width: 0px;
}

</style>
