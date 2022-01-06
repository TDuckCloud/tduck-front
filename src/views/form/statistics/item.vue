<template>
    <div>
        <div v-if="projectItemData.type=='UPLOAD'">
            <div v-if="getItemValue['files']">
                <!-- 图片文件渲染图片栏 -->
                <template v-if="getItemValue['type'] == 'image'">
                    <span v-for="file in getItemValue['files']" :key="JSON.stringify(file)">
                        <el-image class="item-thumbnail-image-preview" :src="file.url" :preview-src-list="getItemValue['files'].map( img => img.url)" lazy />
                    </span>
                </template>

                <!-- 其他文件渲染文件下载链接 -->
                <template v-else>
                    <el-link
                        v-for="file in getItemValue['files']"

                        :key="file"
                        :href="file.url" target="_blank"
                        type="primary"
                    >
                        <span> {{ file.fileName }}</span>
                    </el-link>
                </template>
            </div>
            <span v-else>/</span>
        </div>
        <div v-else-if="projectItemData.type=='SIGN_PAD'">
            <el-image class="item-thumbnail-image-preview" :src="getItemValue || ''" :preview-src-list="[getItemValue || '']" lazy />
        </div>
        <div v-else>
            {{ getItemValue || '/' }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'ResultItem',
    props: {
        projectItemData: {
            type: Object,
            default: function() {
                return {}
            }
        },
        resultData: {
            type: Object,
            default: function() {
                return {}
            }
        },
        fieldItemId: {
            type: Number,
            default: 0
        }
    },
    computed: {
        processData() {
            console.log('数据', this.projectItemData)
            return this.resultData ? this.resultData['processData'] : {}
        },
        getItemValue() {
            if (this.processData[`field${this.fieldItemId}other`]) {
                // 如果存在其他的内容，返回lable+内容
                return this.processData[`field${this.fieldItemId}`] + ':' + this.processData[`field${this.fieldItemId}other`]
            }
            return this.processData[`field${this.fieldItemId}`] ? this.processData[`field${this.fieldItemId}`] : ''
        }
    }

}
</script>

<style scoped>
.item-thumbnail-image-preview {
  width: 106px;
  height: 106px;
  margin-right: 15px;
  margin-bottom: 15px;
  border: 1px solid #EBEEF5;
  background: #0001;
}

</style>
