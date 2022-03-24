<template>
    <el-row class="">
        <el-col :span="13">
            <el-input :disabled="true" :value="linkUrl" size="mini" />
        </el-col>
        <el-col :span="8">
            <el-button-group>
                <el-button v-clipboard:copy="linkUrl" v-clipboard:error="()=>{msgError('复制失败')}"
                           v-clipboard:success="()=>{msgSuccess('复制成功')}"
                           icon="el-icon-copy-document"
                           size="mini"
                           type="primary"
                >
                    复 制
                </el-button>
                <el-button icon="el-icon-s-promotion" size="mini" type="primary" @click="handleOpen">
                    打 开
                </el-button>
                <el-popover
                    placement="right"
                    trigger="click"
                    width="200"
                >
                    <vue-qr v-if="linkUrl" :size="194"
                            :callback="qrCodeGenSuccess"
                            :text="linkUrl"
                    />
                    <el-link class="text-center width-full" size="mini" type="primary" @click="handleDownloadQrCode">
                        下载
                    </el-link>
                    <el-button slot="reference" size="mini" type="primary">
                        <font-icon class="fa fa-qrcode" />
                    </el-button>
                </el-popover>
            </el-button-group>
        </el-col>
    </el-row>
</template>

<script>
import VueQr from 'vue-qr'

export default {
    name: 'UrlOperate',
    components: {
        VueQr
    },
    props: {
        linkUrl: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            qrCodeFileUrl: null
        }
    },
    methods: {
        handleOpen() {
            window.open(this.linkUrl, '_blank')
        },
        handleDownloadQrCode() {
            this.downloadFile('qrcode.png', this.qrCodeFileUrl)
        },
        qrCodeGenSuccess(dataUrl) {
            this.qrCodeFileUrl = dataUrl
        },
        downloadFile(fileName, content) {
            let aLink = document.createElement('a')
            let blob = this.base64ToBlob(content) // new Blob([content]);
            let evt = document.createEvent('HTMLEvents')
            evt.initEvent('click', true, true)// initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
            aLink.download = fileName
            aLink.href = URL.createObjectURL(blob)
            // aLink.dispatchEvent(evt);
            aLink.click()
        },
        // base64转blob
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

<style scoped>

</style>
