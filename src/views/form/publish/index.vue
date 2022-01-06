<template>
    <div>
        <el-card class="publish-card">
            <div slot="header">
                <span>发布</span>
                <span class="desc-text ml-10">公开发布后，所有访问的用户都能够填写数据</span>
            </div>
            <p class="desc-text m20">
                开启后，会生成表单填写链接，所有即可填写表单
            </p>
            <el-switch
                v-model="publishStatus" @change="handlePublishChange"
            />
            <url-operate v-if="publishStatus" :link-url="createDataLink" class="url-op" />
            <el-divider />
        </el-card>
    </div>
</template>

<script>
import UrlOperate from './UrlOperate'
import {getFormStatusRequest, publishFormRequest, stopPublishFormRequest} from '../../../api/project/publish'

export default {
    name: 'DesignatedPublish',
    components: {
        UrlOperate
    },
    data() {
        return {
            publishStatus: false,
            createDataLink: '',
            formKey: ''
        }
    },
    created() {
        this.formKey = this.$route.query.key
        let url = window.location.protocol + '//' + window.location.host
        this.createDataLink = `${url}/s/${this.formKey}`
        this.getProjectStatus()
    },
    methods: {
        getProjectStatus() {
            getFormStatusRequest(this.formKey).then(res => {
                if (res.data.status == 2) {
                    this.publishStatus = true
                } else {
                    this.publishStatus = false
                }
            })
        },
        handlePublishChange(val) {
            if (val) {
                this.publishProject()
            } else {
                this.stopPublishProject()
            }
        },
        publishProject() {
            publishFormRequest({key: this.formKey}).then(() => {
                this.publishStatus = true
                this.msgSuccess('发布成功')
            })
        },
        stopPublishProject() {
            stopPublishFormRequest({key: this.formKey}).then(res => {
                if (res.data) {
                    this.msgSuccess('停止成功')
                    this.getProjectStatus()
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.publish-card{
  width: 900px;
  height: 500px;
  margin: 20px auto;
  padding: 50px;
}
.url-op{
  margin-top: 50px;
}
</style>
