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
                        <iframe id="preview-html" name="preview-html" class="preview-html"
                                frameborder="0"
                                src="http://localhost:8888/#/project/view?key=ec4dfaab04a94608a972845a5a459d3e"
                        />
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane>
            <span slot="label"><i class="el-icon-monitor"></i>
                电脑
            </span>
                <project-form :projectConfig="projectConfig" />
            </el-tab-pane>
        </el-tabs>
    </div>

</template>

<script>
import ProjectForm from './ProjectForm'

export default {
    name: 'PreView',
    props: {
        projectConfig: {
            projectKey: '',
            headImgUrl: '',
            color: ''
        }
    },
    data() {
        return {}
    },
    mounted() {
        this.projectConfig = {
            headImgUrl: 'http://cdn1.wenjuan.com/appear-PC-防疫13.png',
            projectKey: 'afd5c3562c924d20b7da67b1f192ce25'
        }
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

.preview-html {
    width: 318px !important;
    height: 568px !important;
    margin: 74px 0 0;
    border-radius: 5px;
    outline: none;
    background-color: #fff;
}
</style>
