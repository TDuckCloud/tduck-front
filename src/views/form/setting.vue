<template>
    <el-row class="project-setting-container" type="flex" justify="center" align="top">
        <el-col :span="5" :offset="3" class="project-setting-view">
            <p class="project-setting-title">
                提交设置
            </p>
            <p class="project-setting-label">提交后</p>
            <el-row type="flex" align="middle">
                <el-col :span="12">
                    <p class="project-setting-label">显示提示图片</p>
                </el-col>
                <el-col :span="12">
                    <el-switch v-model="projectSetting.showPromptImg"/>
                </el-col>
            </el-row>
            <div v-if="projectSetting.showPromptImg">
                <div class="block">
                    <el-image
                        class="submit-prompt-img"
                        :src="projectSetting.promptImgUrl"
                        fit="cover ">
                        <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                        </div>
                    </el-image>
                </div>
                <el-upload
                    ref="logoUpload"
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                    :headers="getUploadHeader"
                    :on-success="uploadSubmitPromptHandle"
                    action="/user/file/upload"
                    :show-file-list="false">
                    <el-link slot="trigger" size="small" type="primary">请上传提示图片 *</el-link>
                </el-upload>
            </div>
            <el-row type="flex" align="middle">
                <el-col :span="12">
                    <p class="project-setting-label">显示提示文字</p>
                </el-col>
                <el-col :span="12">
                    <el-switch v-model="projectSetting.showPromptText"/>
                </el-col>
            </el-row>
            <el-row v-if="projectSetting.showPromptText">
                <el-col :span="20" class="setting-input">
                    <el-input v-model="projectSetting.promptText"/>
                </el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="12">
                    <p class="project-setting-label">跳转网页地址</p>
                </el-col>
                <el-col :span="12">
                    <el-switch v-model="projectSetting.showSubmitJumpUrl"/>
                </el-col>
            </el-row>
            <el-row v-if="projectSetting.showSubmitJumpUrl">
                <el-col :span="20" class="setting-input">
                    <el-input v-model="projectSetting.submitJumpUrl"/>
                </el-col>
            </el-row>
        </el-col>
        <el-col :span="6" class="project-setting-view" style="text-align: center">
            <p class="project-setting-title">
                回收设置
            </p>
            <el-row type="flex" align="middle">
                <el-col :span="12">
                    <p class="project-setting-label">只在微信中填写</p>
                </el-col>
                <el-col :span="12">
                    <el-switch v-model="projectSetting.onlyWxWrite"/>
                </el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="12">
                    <p class="project-setting-label">定时收集表单</p>
                </el-col>
                <el-col :span="12">
                    <el-switch v-model="projectSetting.timingCollectForm"/>
                </el-col>
            </el-row>
            <div v-if="projectSetting.timingCollectForm">
                <el-row type="flex" align="middle">
                    <el-col :span="8">
                        <p class="project-setting-sub-label">收集时间：</p>
                    </el-col>
                    <el-col :span="15">
                        <el-input class="setting-input" style="width: 30%" v-model="projectSetting.submitJumpUrl"/>
                        <span>至</span>
                        <el-input class="setting-input" style="width: 30%" v-model="projectSetting.submitJumpUrl"/>
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                    <el-col :span="8">
                        <p class="project-setting-sub-label">未启用提示语：</p>
                    </el-col>
                    <el-col :span="15">
                        <el-input class="setting-input" style="width: 80%" v-model="projectSetting.submitJumpUrl"/>
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                    <el-col :span="8">
                        <p class="project-setting-sub-label">停用后提示语：</p>
                    </el-col>
                    <el-col :span="15">
                        <el-input class="setting-input" style="width: 80%" v-model="projectSetting.submitJumpUrl"/>
                    </el-col>
                </el-row>
            </div>
            <el-row type="flex" align="middle">
                <el-col :span="12">
                    <p class="project-setting-label">定时定量表单</p>
                </el-col>
                <el-col :span="12">
                    <el-switch v-model="projectSetting.timingQuantitativeForm"/>
                </el-col>
            </el-row>
            <div v-if="projectSetting.timingQuantitativeForm">
                <el-row type="flex" align="middle">
                    <el-col :span="8">
                        <p class="project-setting-sub-label">收集完成后提示：</p>
                    </el-col>
                    <el-col :span="15">
                        <el-input class="setting-input" style="width: 80%" v-model="projectSetting.submitJumpUrl"/>
                    </el-col>
                </el-row>
            </div>
            <el-row type="flex" align="middle">
                <el-col :span="12">
                    <p class="project-setting-label">每人限制填写1次</p>
                </el-col>
                <el-col :span="12">
                    <el-switch v-model="projectSetting.everyoneWriteOnce"/>
                </el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="12">
                    <p class="project-setting-label">每人限制填写1次</p>
                </el-col>
                <el-col :span="12">
                    <el-switch v-model="projectSetting.everyoneDayWriteOnce"/>
                </el-col>
            </el-row>
            <el-row type="flex" align="middle"
                    v-if="projectSetting.everyoneDayWriteOnce||projectSetting.everyoneWriteOnce">
                <el-col :span="8">
                    <p class="project-setting-sub-label">重复填写后提示：</p>
                </el-col>
                <el-col :span="15">
                    <el-input class="setting-input" style="width: 80%" v-model="projectSetting.submitJumpUrl"/>
                </el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="12">
                    <p class="project-setting-label">新反馈提醒我</p>
                </el-col>
                <el-col :span="12">
                    <el-switch v-model="projectSetting.newFeedbackRemind"/>
                </el-col>
            </el-row>
            <div v-if="projectSetting.newFeedbackRemind">
                <el-row type="flex" align="middle">
                    <el-col :span="5">
                        <p class="project-setting-sub-label">发邮件提醒我</p>
                    </el-col>
                    <el-col :span="3">
                        <el-checkbox v-model="projectSetting.newFeedbackRemindEmail"></el-checkbox>
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle" v-if="projectSetting.newFeedbackRemindEmail">
                    <el-col :span="5" :offset="3">
                        <p class="project-setting-sub-label">请填写邮箱：</p>
                    </el-col>
                    <el-col :span="12">
                        <el-input class="setting-input" style="width: 80%" v-model="projectSetting.submitJumpUrl"/>
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                    <el-col :span="5">
                        <p class="project-setting-sub-label">发微信提醒我</p>
                    </el-col>
                    <el-col :span="3">
                        <el-checkbox v-model="projectSetting.newFeedbackRemindWx"></el-checkbox>
                    </el-col>
                    <el-col :span="10">
                        <p class="project-setting-sub-label">
                            需要关注公众号
                            <el-link>TDUCK</el-link>
                        </p>
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle" v-if="projectSetting.newFeedbackRemindWx">
                    <el-col :span="5" :offset="3">
                        <p class="project-setting-sub-label">提醒人：</p>
                    </el-col>
                    <el-col :span="12">
                        <img style="width: 24px;height: 24px;" src=""/>
                    </el-col>
                </el-row>
            </div>
            <el-row type="flex" align="middle">
                <el-col :span="12">
                    <p class="project-setting-label">记录微信用户个人信息</p>
                </el-col>
                <el-col :span="12">
                    <el-switch v-model="projectSetting.recordWxUser"/>
                </el-col>
            </el-row>
            <el-row>
                <p class="project-setting-sub-label">
                    * 开启后将会授权登录，提供微信昵称、性别、城市信息
                </p>
            </el-row>
        </el-col>
        <el-col :span="6" class="project-setting-view">
            <p class="project-setting-title">
                分享设置
            </p>
            <el-row type="flex" align="middle">
                <el-col :span="12">
                    <p class="project-setting-label">自定义分享图标</p>
                </el-col>
                <el-col :span="12">
                    <el-switch v-model="projectSetting.customizeShareIcon"/>
                </el-col>
            </el-row>
            <el-row type="flex" align="middle" v-if="projectSetting.customizeShareIcon">
                <el-col :span="10">
                    <p class="project-setting-label">
                        请上传分享图片 *
                        建议尺寸500px*500px
                    </p>
                </el-col>
                <el-col :span="12">
                    <el-upload
                        ref="logoUpload"
                        accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                        :headers="getUploadHeader"
                        :on-success="uploadSubmitPromptHandle"
                        action="/user/file/upload"
                        :show-file-list="false">
                        <div class="block">
                            <el-image
                                class="share-img"
                                :src="projectSetting.promptImgUrl"
                                fit="cover ">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </div>
                    </el-upload>
                </el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="12">
                    <p class="project-setting-label">自定义分享标题</p>
                </el-col>
                <el-col :span="12">
                    <el-switch v-model="projectSetting.customizeShareTitle" />
                </el-col>
            </el-row>
            <el-row type="flex" align="middle"
                    v-if="projectSetting.customizeShareTitle">
                <el-col :span="8">
                    <p class="project-setting-sub-label">请输入标题：</p>
                </el-col>
                <el-col :span="15">
                    <el-input class="setting-input" style="width: 80%" v-model="projectSetting.submitJumpUrl"/>
                </el-col>
            </el-row>
            <el-row type="flex" align="middle">
                <el-col :span="12">
                    <p class="project-setting-label">自定义分享描述</p>
                </el-col>
                <el-col :span="12">
                    <el-switch v-model="projectSetting.customizeShareDesc"/>
                </el-col>
            </el-row>
            <el-row type="flex" align="middle"
                    v-if="projectSetting.customizeShareDesc">
                <el-col :span="8">
                    <p class="project-setting-sub-label">请输入描述：</p>
                </el-col>
                <el-col :span="15">
                    <el-input class="setting-input" style="width: 80%" v-model="projectSetting.submitJumpUrl"/>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
export default {
    name: 'projectSetting',
    props: {
        projectKey: ''
    },
    data() {
        return {
            projectSetting: {
                showPromptImg: false,
                promptImgUrl: '',
                showPromptText: '',
                promptText: '提交成功 | ',
                showSubmitJumpUrl: false,
                submitJumpUrl: '',
                onlyWxWrite: false,
                timingCollectForm: false,
                timingQuantitativeForm: false,
                everyoneWriteOnce: false,
                everyoneDayWriteOnce: false,
                newFeedbackRemind: false,
                newFeedbackRemindEmail: false,
                newFeedbackRemindWx: false,
                recordWxUser: false,
                customizeShareIcon: false,
                customizeShareTitle: false,
                customizeShareDesc: false

            }
        }
    },
    computed: {
        getUploadHeader() {
            return {
                'token': this.$store.getters['user/isLogin']
            }
        }
    },
    methods: {
        uploadSubmitPromptHandle(response, file, fileList) {
            this.projectSetting.promptImgUrl = response.data
        }
    }
}
</script>

<style scoped>
.project-setting-container {
    width: 100%;
    height: 100%;
    min-height: 85vh;
    padding: 0px;
    margin:10px 0 0 0;
    background-color: #F7F7F7;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.project-setting-view {
    height:100%;
    line-height: 20px;
    border-radius: 7px;
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    text-align: center;
    font-family: Arial;
    border: 1px solid rgba(255, 255, 255, 100);
    background-color: white;
    margin-right: 10px;
    padding: 10px;
}

.project-setting-title {
    color: rgba(16, 16, 16, 100);
    font-size: 18px;
    text-align: left;
    font-weight: 550;
    margin-left: 20px;
}

.project-setting-label {
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    text-align: left;
    line-height: 20px;
}

.project-setting-sub-label {
    color: rgba(144, 147, 149, 100);
    font-size: 14px;
    text-align: left;
    margin-left: 2px;
    line-height: 20px;
}

.submit-prompt-img {
    width: 340px;
    height: 117px;
    background-color: #f7f7f7;
    display: flex;
    align-items: center;
    justify-items: center;
    justify-content: center;
}

/deep/ .setting-input input {
    border: none;
    border-bottom: 1px solid rgba(187, 187, 187, 100);
    border-radius: 0;
    line-height: 20px;
    height: 20px;
}
.share-img{
    width: 123px;
    height: 117px;
    background-color: #f7f7f7;
    display: flex;
    align-items: center;
    justify-items: center;
    justify-content: center;
}
</style>
