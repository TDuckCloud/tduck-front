<template>
    <el-form ref="setting" :model="userProjectSettingData">
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
                        <el-switch
                            @change="()=>{this.userProjectSettingData.submitPromptImg=''}"
                            v-model="projectSetting.showPromptImg"/>
                    </el-col>
                </el-row>
                <div v-if="projectSetting.showPromptImg">
                    <div class="block">
                        <el-image
                            class="submit-prompt-img"
                            :src="userProjectSettingData.submitPromptImg"
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
                        <el-switch
                            @change="()=>{
                            this.userProjectSettingData.submitPromptText=''
                            this.saveUserProjectSetting()
                        }"
                            v-model="projectSetting.showPromptText"/>
                    </el-col>
                </el-row>
                <el-row v-if="projectSetting.showPromptText">
                    <el-col :span="20" class="setting-input">
                        <el-input v-model="userProjectSettingData.submitPromptText"
                                  :show-word-limit="true"
                                  :maxlength="100"
                                  @change="saveUserProjectSetting"/>
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                    <el-col :span="12">
                        <p class="project-setting-label">跳转网页地址</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            @change="()=>{
                            this.userProjectSettingData.submitJumpUrl=''
                            this.saveUserProjectSetting()
                        }"
                            v-model="projectSetting.showSubmitJumpUrl"/>
                    </el-col>
                </el-row>
                <el-row v-if="projectSetting.showSubmitJumpUrl">
                    <el-col :span="20" class="setting-input">
                        <el-input
                            :show-word-limit="true"
                            :maxlength="100"
                            @change="saveUserProjectSetting"
                            v-model="userProjectSettingData.submitJumpUrl"/>
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
                        <el-switch
                            @change="saveUserProjectSetting"
                            v-model="userProjectSettingData.wxWrite"/>
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                    <el-col :span="12">
                        <p class="project-setting-label">定时收集表单</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            @change="()=>{
                            this.projectSetting.timingQuantitativeForm=false
                               this.clearFieldHandle(['timedCollectionBeginTime','timedCollectionEndTime'
                            ,'timedNotEnabledPromptText','timedDeactivatePromptText'])
                            this.saveUserProjectSetting()
                        }"
                            v-model="projectSetting.timingCollectForm"/>
                    </el-col>
                </el-row>
                <div v-if="projectSetting.timingCollectForm">
                    <el-row type="flex" align="middle">
                        <el-col :span="5">
                            <p class="project-setting-sub-label">收集时间：</p>
                        </el-col>
                        <el-col :span="8">
                            <el-date-picker
                                type="datetime"
                                style="width: 100%;border: none"
                                align="center"
                                class="collection-date-picker"
                                @change="saveUserProjectSetting"
                                v-model="userProjectSettingData.timedCollectionBeginTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择开始时间">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="1"><span>  至</span></el-col>
                        <el-col :span="8">
                            <el-date-picker
                                type="datetime"
                                align="center"
                                class="collection-date-picker"
                                style="width: 100%;border: none"
                                @change="saveUserProjectSetting"
                                v-model="userProjectSettingData.timedCollectionEndTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="结束日期">
                            </el-date-picker>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
                        <el-col :span="8">
                            <p class="project-setting-sub-label">未启用提示语：</p>
                        </el-col>
                        <el-col :span="15">
                            <el-input class="setting-input" style="width: 80%"
                                      :show-word-limit="true"
                                      :maxlength="100"
                                      @change="saveUserProjectSetting"
                                      v-model="userProjectSettingData.timedNotEnabledPromptText"/>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
                        <el-col :span="8">
                            <p class="project-setting-sub-label">停用后提示语：</p>
                        </el-col>
                        <el-col :span="15">
                            <el-input class="setting-input" style="width: 80%"
                                      :show-word-limit="true"
                                      :maxlength="100"
                                      @change="saveUserProjectSetting"
                                      v-model="userProjectSettingData.timedDeactivatePromptText"/>
                        </el-col>
                    </el-row>
                </div>
                <el-row type="flex" align="middle">
                    <el-col :span="12">
                        <p class="project-setting-label">定时定量表单</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            @change="()=>{
                            this.projectSetting.timingCollectForm=false
                            this.clearFieldHandle(['timedCollectionBeginTime','timedCollectionEndTime'
                            ,'timedNotEnabledPromptText','timedDeactivatePromptText','timedQuantitativeQuantity','timedEndPromptText'])
                            this.saveUserProjectSetting()
                        }"
                            v-model="projectSetting.timingQuantitativeForm"/>
                    </el-col>
                </el-row>
                <div v-if="projectSetting.timingQuantitativeForm">
                    <el-row type="flex" align="middle">
                        <el-col :span="5">
                            <p class="project-setting-sub-label">收集时间：</p>
                        </el-col>
                        <el-col :span="8">
                            <el-date-picker
                                type="datetime"
                                style="width: 100%;border: none"
                                align="center"
                                class="collection-date-picker"
                                @change="saveUserProjectSetting"
                                v-model="userProjectSettingData.timedCollectionBeginTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择开始时间">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="1"><span>  至</span></el-col>
                        <el-col :span="8">
                            <el-date-picker
                                type="datetime"
                                align="center"
                                class="collection-date-picker"
                                @change="saveUserProjectSetting"
                                style="width: 100%;border: none"
                                v-model="userProjectSettingData.timedCollectionEndTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="结束日期">
                            </el-date-picker>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
                        <el-col :span="8">
                            <p class="project-setting-sub-label">未启用提示语：</p>
                        </el-col>
                        <el-col :span="15">
                            <el-input class="setting-input" style="width: 80%"
                                      @change="saveUserProjectSetting"
                                      :show-word-limit="true"
                                      :maxlength="100"
                                      v-model="userProjectSettingData.timedNotEnabledPromptText"/>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
                        <el-col :span="8">
                            <p class="project-setting-sub-label">停用后提示语：</p>
                        </el-col>
                        <el-col :span="15">
                            <el-input class="setting-input" style="width: 80%"
                                      @change="saveUserProjectSetting"
                                      :show-word-limit="true"
                                      :maxlength="100"
                                      v-model="userProjectSettingData.timedDeactivatePromptText"/>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle" v-if="projectSetting.timingQuantitativeForm">
                        <el-col :span="8">
                            <p class="project-setting-sub-label">定量表单填写数量：</p>
                        </el-col>
                        <el-col :span="15">
                            <el-input class="setting-input" style="width: 80%"
                                      oninput="value=value.replace(/[^\d]/g,'')"
                                      @change="saveUserProjectSetting"
                                      v-model="userProjectSettingData.timedQuantitativeQuantity"/>
                        </el-col>
                    </el-row>
                </div>
                <div v-if="projectSetting.timingQuantitativeForm">
                    <el-row type="flex" align="middle">
                        <el-col :span="8">
                            <p class="project-setting-sub-label">收集完成后提示：</p>
                        </el-col>
                        <el-col :span="15">
                            <el-input class="setting-input" style="width: 80%"
                                      @change="saveUserProjectSetting"
                                      :show-word-limit="true"
                                      :maxlength="100"
                                      v-model="userProjectSettingData.timedEndPromptText"/>
                        </el-col>
                    </el-row>
                </div>
                <el-row type="flex" align="middle">
                    <el-col :span="12">
                        <p class="project-setting-label">每人限制填写1次</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            @change="saveUserProjectSetting"
                            v-model="userProjectSettingData.everyoneWriteOnce"/>
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                    <el-col :span="12">
                        <p class="project-setting-label">每人限制填写1次</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            @change="saveUserProjectSetting"
                            v-model="userProjectSettingData.everyoneDayWriteOnce"/>
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle"
                        v-if="userProjectSettingData.everyoneDayWriteOnce||userProjectSettingData.everyoneWriteOnce">
                    <el-col :span="8">
                        <p class="project-setting-sub-label">重复填写后提示：</p>
                    </el-col>
                    <el-col :span="15">
                        <el-input class="setting-input" style="width: 80%"
                                  @change="saveUserProjectSetting"
                                  :show-word-limit="true"
                                  :maxlength="100"
                                  v-model="userProjectSettingData.writeOncePromptText"/>
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
                            <el-checkbox
                                @change="()=>{
                                this.clearFieldHandle(['newWriteNotifyEmail'])
                                this.saveUserProjectSetting()
                            }"
                                v-model="projectSetting.newFeedbackRemindEmail"></el-checkbox>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle" v-if="projectSetting.newFeedbackRemindEmail">
                        <el-col :span="5" :offset="3">
                            <p class="project-setting-sub-label">请填写邮箱：</p>
                        </el-col>
                        <el-col :span="12">
                            <el-input class="setting-input" style="width: 80%"
                                      @change="saveUserProjectSetting"
                                      v-model="userProjectSettingData.newWriteNotifyEmail"/>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
                        <el-col :span="5">
                            <p class="project-setting-sub-label">发微信提醒我</p>
                        </el-col>
                        <el-col :span="3">
                            <el-checkbox
                                @change="()=>{
                                this.clearFieldHandle(['newWriteNotifyWx'])
                                this.saveUserProjectSetting()
                            }"
                                v-model="projectSetting.newFeedbackRemindWx"></el-checkbox>
                        </el-col>
                        <el-col :span="10">
                            <p class="project-setting-sub-label">
                                需要关注公众号
                                <el-link>TDUCK</el-link>
                            </p>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle" v-if="userProjectSettingData.newWriteNotifyWx">
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
                        <el-switch
                            @change="()=>{
                                this.userProjectSettingData.wxWrite=true
                                this.saveUserProjectSetting()
                            }"
                            v-model="userProjectSettingData.recordWxUser"/>
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
                        <el-switch
                            @change="clearFieldHandle(['userProjectSettingData.shareImg'])"
                            v-model="projectSetting.customizeShareIcon"/>
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
                            :on-success="uploadShareImgHandle"
                            action="/user/file/upload"
                            :show-file-list="false">
                            <div class="block">
                                <el-image
                                    class="share-img"
                                    :src="userProjectSettingData.shareImg"
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
                        <el-switch
                            @change="clearFieldHandle(['userProjectSettingData.shareTitle'])"
                            v-model="projectSetting.customizeShareTitle"/>
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle"
                        v-if="projectSetting.customizeShareTitle">
                    <el-col :span="8">
                        <p class="project-setting-sub-label">请输入标题：</p>
                    </el-col>
                    <el-col :span="15">
                        <el-input
                            @change="saveUserProjectSetting"
                            :show-word-limit="true"
                            :maxlength="100"
                            class="setting-input" style="width: 80%" v-model="userProjectSettingData.shareTitle"/>
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
                        <el-input
                            @change="saveUserProjectSetting"
                            :show-word-limit="true"
                            :maxlength="100"
                            class="setting-input" style="width: 80%" v-model="userProjectSettingData.shareDesc"/>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </el-form>
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
                showPromptText: true,
                showSubmitJumpUrl: false,
                timingCollectForm: false,
                timingQuantitativeForm: false,
                newFeedbackRemind: false,
                newFeedbackRemindEmail: false,
                newFeedbackRemindWx: false,
                customizeShareIcon: false,
                customizeShareTitle: false,
                customizeShareDesc: false
            },
            userProjectSettingData: {
                submitPromptImg: '',
                submitPromptText: '提交成功 !',
                submitJumpUrl: '',
                wxWrite: false,
                timedNotEnabledPromptText: '',
                timedDeactivatePromptText: '',
                timedQuantitativeQuantity: null,
                timedEndPromptText: '',
                everyoneWriteOnce: false,
                everyoneDayWriteOnce: false,
                timedCollectionBeginTime: '',
                timedCollectionEndTime: '',
                writeOncePromptText: '',
                newWriteNotifyEmail: '',
                newWriteNotifyWx: '',
                recordWxUser: false,
                shareImg: '',
                shareTitle: '',
                shareDesc: ''
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
    mounted() {
        this.projectKey = this.$route.query.key
        this.queryUserProjectSetting()
    },
    methods: {
        uploadSubmitPromptHandle(response, file, fileList) {
            this.userProjectSettingData.submitPromptImg = response.data
            this.saveUserProjectSetting()
        },
        uploadShareImgHandle(response, file, fileList) {
            this.userProjectSettingData.shareImg = response.data
            this.saveUserProjectSetting()
        },
        queryUserProjectSetting() {
            this.userProjectSettingData.projectKey = this.projectKey
            this.$api.get(`/user/project/setting/query/${this.projectKey}`).then(res => {
                if (res.data) {
                    this.userProjectSettingData = res.data
                    let {
                        submitPromptImg, submitPromptText, submitJumpUrl, timedCollectionBeginTime,
                        timedQuantitativeQuantity, newWriteNotifyEmail, newWriteNotifyWx,
                        shareImg, shareTitle, shareDesc
                    } = res.data
                    this.projectSetting = {
                        showPromptImg: !!submitPromptImg,
                        showPromptText: !!submitPromptText,
                        showSubmitJumpUrl: !!submitJumpUrl,
                        timingCollectForm: timedCollectionBeginTime & !timedQuantitativeQuantity,
                        timingCollectTimeRange: !!timedQuantitativeQuantity,
                        newFeedbackRemind: newWriteNotifyEmail | newWriteNotifyWx,
                        newFeedbackRemindEmail: !!newWriteNotifyEmail,
                        newFeedbackRemindWx: !!newWriteNotifyWx,
                        customizeShareIcon: !!shareImg,
                        customizeShareTitle: !!shareTitle,
                        customizeShareDesc: !!shareDesc
                    }
                }
            })
        },
        saveUserProjectSetting() {
            this.userProjectSettingData.projectKey = this.projectKey
            this.$api.post('/user/project/setting/save', this.userProjectSettingData).then(res => {
            })
        },
        clearFieldHandle(fields) {
            fields.forEach((field) => {
                this.$set(this.userProjectSettingData, field, '')
            })
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
    margin: 10px 0 0 0;
    background-color: #F7F7F7;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.project-setting-view {
    height: 100%;
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
    width: 80%;
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

.share-img {
    width: 123px;
    height: 117px;
    background-color: #f7f7f7;
    display: flex;
    align-items: center;
    justify-items: center;
    justify-content: center;
}

/deep/ .collection-date-picker input {
    border: none;
    border-bottom: 1px solid rgba(187, 187, 187, 100);
    border-radius: 0;
}
</style>
