<template>
    <div class="publish-container">
        <div>
            <div class="publish-btn-view" v-if="!publishStatus">
                <el-button
                    @click="publishProject"
                    size="medium"
                    class="publish-btn"
                    type="primary"><i class="el-icon-document-checked el-icon--right">开始发布</i></el-button>
            </div>
            <div class="publish-finish-view" v-if="publishStatus">
                <el-row type="flex" align="middle">
                    <el-col :span="20" style="">
                        <div style="display: flex;justify-content: center">
                            <div class="icon-view">
                                <i class="el-icon-check success-icon"/>
                            </div>
                        </div>
                        <div>
                            <p class="success-title">恭喜您，发布成功！</p>
                        </div>
                        <div>
                            <p class="link-text"> {{ writeLink }}</p>
                        </div>
                        <el-row>
                            <el-col :span="6" :offset="6">
                                <el-button v-clipboard:copy="writeLink"
                                           v-clipboard:success="()=>{this.msgSuccess('复制成功')}"
                                           v-clipboard:error="()=>{this.msgError('复制失败')}" type="primary">复制链接
                                </el-button>
                            </el-col>
                            <el-col :span="6">
                                <el-button type="warning">查看反馈</el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="6">
                        <div>
                            <vue-qr v-if="writeLink" :callback="qrCodeGenSuccess" :text="writeLink"
                                    :size="194"></vue-qr>
                        </div>
                        <div style="text-align: center">
                            <el-link type="primary" @click="()=>{
                                this.downloadFile('qrcode.png',this.qrCodeUrl)
                            }">下载分享二维码</el-link>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>

</template>

<script>
import VueQr from 'vue-qr'

export default {
    name: 'projectPublish',
    components: {
        VueQr
    },
    props: {
        projectKey: ''
    },
    mounted() {
        let url = window.location.protocol + '//' + window.location.host
        this.writeLink = `${url}/project/write?key=${this.projectKey}`
    },
    data() {
        return {
            publishStatus: false,
            writeLink: '',
            qrCodeUrl: ''
        }
    }, methods: {
        publishProject() {
            this.$api.post(`/user/project/publish/${this.projectKey}`).then(res => {
                this.publishStatus = true
                this.msgSuccess('发布成功')
            })
        },
        qrCodeGenSuccess(dataUrl, id) {
            this.qrCodeUrl = dataUrl
        },
        downloadFile(fileName, content) {
            let aLink = document.createElement('a');
            let blob = this.base64ToBlob(content); //new Blob([content]);
            let evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
            aLink.download = fileName;
            aLink.href = URL.createObjectURL(blob);
            // aLink.dispatchEvent(evt);
            aLink.click()
        },
        //base64转blob
        base64ToBlob(code) {
            let parts = code.split(';base64,')
            let contentType = parts[0].split(':')[1]
            let raw = window.atob(parts[1])
            let rawLength = raw.length
            let uInt8Array = new Uint8Array(rawLength)
            for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i)
            }
            return new Blob([uInt8Array], {type: contentType})
        }
    }

}
</script>

<style lang="scss" scoped>
.publish-container {
    width: 100%;
    height: 100%;
    padding: 0px;
    margin: 0;
    background-color: #F7F7F7;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    min-height: 84vh;
    display: flex;
    align-items: center;
    justify-content: center;
}


.publish-finish-view {
    width: 500px;
    height: 200px;
    text-align: center;

    .icon-view {
        width: 59px;
        height: 59px;
        border-radius: 100px;
        background-color: #0076FF;
        display: flex;
        align-items: center;
        align-content: center;
        justify-items: center;
        justify-content: center;
    }

    .success-icon {
        text-align: center;
        color: white;
        font-size: 30px;
    }

    .success-title {
        color: rgba(16, 16, 16, 100);
        font-size: 28px;
    }

    .link-text {
        color: rgba(16, 16, 16, 100);
        font-size: 14px;
    }
}

</style>
