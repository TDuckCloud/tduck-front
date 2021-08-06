<template>
    <el-form ref="setting" :model="userProjectSettingData" :rules="settingRules">
        <el-row align="top" class="project-setting-container" justify="center" type="flex">
            <el-col :offset="3" :span="5" class="project-setting-view">
                <p class="project-setting-title">
                    提交设置
                </p>
                <el-row align="middle" type="flex">
                    <el-col :span="12">
                        <p class="project-setting-label">显示提示图片</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            v-model="projectSetting.showPromptImg"
                            @change="()=>{this.userProjectSettingData.submitPromptImg=''}"
                        />
                    </el-col>
                </el-row>
                <div v-if="projectSetting.showPromptImg">
                    <div class="block">
                        <el-image
                            :src="userProjectSettingData.submitPromptImg"
                            class="submit-prompt-img"
                            fit="cover "
                        >
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline" />
                            </div>
                        </el-image>
                    </div>
                    <el-upload
                        ref="logoUpload"
                        :action="getUploadUrl"
                        :headers="getUploadHeader"
                        :on-success="uploadSubmitPromptHandle"
                        :show-file-list="false"
                        accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                    >
                        <el-button slot="trigger" size="small" type="text">请上传提示图片 *</el-button>
                    </el-upload>
                </div>
                <el-row align="middle" type="flex">
                    <el-col :span="12">
                        <p class="project-setting-label">显示提示文字</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            v-model="projectSetting.showPromptText"
                            @change="()=>{
                                this.userProjectSettingData.submitPromptText=''
                                this.saveUserProjectSetting()
                            }"
                        />
                    </el-col>
                </el-row>
                <el-row v-if="projectSetting.showPromptText">
                    <el-col :span="20" class="setting-input">
                        <el-input v-model="userProjectSettingData.submitPromptText"
                                  :maxlength="50"
                                  :show-word-limit="true"
                                  @change="saveUserProjectSetting"
                        />
                    </el-col>
                </el-row>
                <el-row align="middle" type="flex">
                    <el-col :span="12">
                        <p class="project-setting-label">跳转网页地址</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            v-model="projectSetting.showSubmitJumpUrl"
                            @change="()=>{
                                this.userProjectSettingData.submitJumpUrl=''
                                this.saveUserProjectSetting()
                            }"
                        />
                    </el-col>
                </el-row>
                <el-row v-if="projectSetting.showSubmitJumpUrl">
                    <el-col :span="20" class="setting-input">
                        <el-input
                            v-model="userProjectSettingData.submitJumpUrl"
                            :show-word-limit="true"
                            placeholder="https://demo.tduckapp.com"
                            @change="saveUserProjectSetting"
                        />
                    </el-col>
                </el-row>
                <el-row align="middle" type="flex">
                    <el-col :span="12">
                        <p class="project-setting-label">公开反馈结果</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            v-model="userProjectSettingData.publicResult"
                            @change="()=>{
                                this.saveUserProjectSetting()
                            }"
                        />
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="6" class="project-setting-view text-center">
                <p class="project-setting-title">
                    回收设置
                </p>
                <el-row align="middle" type="flex">
                    <el-col :span="12">
                        <p class="project-setting-label">只在微信中填写</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            v-model="userProjectSettingData.wxWrite"
                            @change="saveUserProjectSetting"
                        />
                    </el-col>
                </el-row>
                <el-row align="middle" type="flex">
                    <el-col :span="12">
                        <p class="project-setting-label">定时收集表单</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            v-model="projectSetting.timingCollectForm"
                            @change="()=>{
                                this.projectSetting.timingQuantitativeForm=false
                                this.clearFieldHandle(['timedCollectionBeginTime','timedCollectionEndTime'
                                                       ,'timedNotEnabledPromptText','timedDeactivatePromptText'])
                                this.saveUserProjectSetting()
                            }"
                        />
                    </el-col>
                </el-row>
                <div v-if="projectSetting.timingCollectForm">
                    <el-row align="middle" type="flex">
                        <el-col :span="5">
                            <p class="project-setting-sub-label">收集时间：</p>
                        </el-col>
                        <el-col :span="8">
                            <el-date-picker
                                v-model="userProjectSettingData.timedCollectionBeginTime"
                                align="center"
                                class="collection-date-picker"
                                placeholder="选择开始时间"
                                style="width: 100%; border: none;"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                @change="saveUserProjectSetting"
                            />
                        </el-col>
                        <el-col :span="1"><span>  至</span></el-col>
                        <el-col :span="8">
                            <el-date-picker
                                v-model="userProjectSettingData.timedCollectionEndTime"
                                align="center"
                                class="collection-date-picker"
                                placeholder="结束日期"
                                style="width: 100%; border: none;"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                @change="saveUserProjectSetting"
                            />
                        </el-col>
                    </el-row>
                    <el-row align="middle" type="flex">
                        <el-col :span="8">
                            <p class="project-setting-sub-label">未启用提示语：</p>
                        </el-col>
                        <el-col :span="15">
                            <el-input v-model="userProjectSettingData.timedNotEnabledPromptText" :maxlength="50"
                                      :show-word-limit="true"
                                      class="setting-input"
                                      style="width: 80%;"
                                      @change="saveUserProjectSetting"
                            />
                        </el-col>
                    </el-row>
                    <el-row align="middle" type="flex">
                        <el-col :span="8">
                            <p class="project-setting-sub-label">停用后提示语：</p>
                        </el-col>
                        <el-col :span="15">
                            <el-input v-model="userProjectSettingData.timedDeactivatePromptText" :maxlength="50"
                                      :show-word-limit="true"
                                      class="setting-input"
                                      style="width: 80%;"
                                      @change="saveUserProjectSetting"
                            />
                        </el-col>
                    </el-row>
                </div>
                <el-row align="middle" type="flex">
                    <el-col :span="12">
                        <p class="project-setting-label">定时定量表单</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            v-model="projectSetting.timingQuantitativeForm"
                            @change="()=>{
                                this.projectSetting.timingCollectForm=false
                                this.clearFieldHandle(['timedCollectionBeginTime','timedCollectionEndTime'
                                                       ,'timedNotEnabledPromptText','timedDeactivatePromptText','timedQuantitativeQuantity','timedEndPromptText'])
                                this.saveUserProjectSetting()
                            }"
                        />
                    </el-col>
                </el-row>
                <div v-if="projectSetting.timingQuantitativeForm">
                    <el-row align="middle" type="flex">
                        <el-col :span="5">
                            <p class="project-setting-sub-label">收集时间：</p>
                        </el-col>
                        <el-col :span="8">
                            <el-date-picker
                                v-model="userProjectSettingData.timedCollectionBeginTime"
                                align="center"
                                class="collection-date-picker"
                                placeholder="选择开始时间"
                                style="width: 100%; border: none;"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                @change="saveUserProjectSetting"
                            />
                        </el-col>
                        <el-col :span="1"><span>  至</span></el-col>
                        <el-col :span="8">
                            <el-date-picker
                                v-model="userProjectSettingData.timedCollectionEndTime"
                                align="center"
                                class="collection-date-picker"
                                placeholder="结束日期"
                                style="width: 100%; border: none;"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                @change="saveUserProjectSetting"
                            />
                        </el-col>
                    </el-row>
                    <el-row align="middle" type="flex">
                        <el-col :span="8">
                            <p class="project-setting-sub-label">未启用提示语：</p>
                        </el-col>
                        <el-col :span="15">
                            <el-input v-model="userProjectSettingData.timedNotEnabledPromptText" :maxlength="50"
                                      :show-word-limit="true"
                                      class="setting-input"
                                      style="width: 80%;"
                                      @change="saveUserProjectSetting"
                            />
                        </el-col>
                    </el-row>
                    <el-row align="middle" type="flex">
                        <el-col :span="8">
                            <p class="project-setting-sub-label">停用后提示语：</p>
                        </el-col>
                        <el-col :span="15">
                            <el-input v-model="userProjectSettingData.timedDeactivatePromptText" :maxlength="50"
                                      :show-word-limit="true"
                                      class="setting-input"
                                      style="width: 80%;"
                                      @change="saveUserProjectSetting"
                            />
                        </el-col>
                    </el-row>
                    <el-row v-if="projectSetting.timingQuantitativeForm" align="middle" type="flex">
                        <el-col :span="8">
                            <p class="project-setting-sub-label">定量表单填写数量：</p>
                        </el-col>
                        <el-col :span="15">
                            <el-input v-model="userProjectSettingData.timedQuantitativeQuantity" class="setting-input"
                                      oninput="value=value.replace(/[^\d]/g,'')"
                                      style="width: 80%;"
                                      @change="saveUserProjectSetting"
                            />
                        </el-col>
                    </el-row>
                </div>
                <div v-if="projectSetting.timingQuantitativeForm">
                    <el-row align="middle" type="flex">
                        <el-col :span="8">
                            <p class="project-setting-sub-label">收集完成后提示：</p>
                        </el-col>
                        <el-col :span="15">
                            <el-input v-model="userProjectSettingData.timedEndPromptText" :maxlength="50"
                                      :show-word-limit="true"
                                      class="setting-input"
                                      style="width: 80%;"
                                      @change="saveUserProjectSetting"
                            />
                        </el-col>
                    </el-row>
                </div>
                <el-row align="middle" type="flex">
                    <el-col :span="12">
                        <p class="project-setting-label ">
                            每个微信仅填写一次
                        </p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            v-model="userProjectSettingData.wxWriteOnce"
                            @change="()=>{
                                this.userProjectSettingData.recordWxUser=true
                                this.userProjectSettingData.wxWrite=true
                                this.saveUserProjectSetting()
                            }"
                        />
                    </el-col>
                </el-row>
                <el-row align="middle" type="flex">
                    <el-col :span="12">
                        <p class="project-setting-label ">
                            每人限制填写1次
                            <el-tooltip class="item" content="根据IP地址限制填写" effect="dark" placement="top-start">
                                <i class="el-icon-warning" />
                            </el-tooltip>
                        </p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            v-model="userProjectSettingData.everyoneWriteOnce"
                            @change="saveUserProjectSetting"
                        />
                    </el-col>
                </el-row>
                <el-row align="middle" type="flex">
                    <el-col :span="12">
                        <p class="project-setting-label">每人每天限制填写1次</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            v-model="userProjectSettingData.everyoneDayWriteOnce"
                            @change="saveUserProjectSetting"
                        />
                    </el-col>
                </el-row>
                <el-row v-if="userProjectSettingData.everyoneDayWriteOnce||userProjectSettingData.everyoneWriteOnce"
                        align="middle"
                        type="flex"
                >
                    <el-col :span="8">
                        <p class="project-setting-sub-label">重复填写后提示：</p>
                    </el-col>
                    <el-col :span="15">
                        <el-input v-model="userProjectSettingData.writeOncePromptText" :maxlength="50"
                                  :show-word-limit="true"
                                  class="setting-input"
                                  style="width: 80%;"
                                  @change="saveUserProjectSetting"
                        />
                    </el-col>
                </el-row>
                <el-row align="middle" type="flex">
                    <el-col :span="12">
                        <p class="project-setting-label">新反馈提醒我</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch v-model="projectSetting.newFeedbackRemind" />
                    </el-col>
                </el-row>
                <div v-if="projectSetting.newFeedbackRemind">
                    <el-row align="middle" type="flex">
                        <el-col :span="5">
                            <p class="project-setting-sub-label">发邮件提醒我</p>
                        </el-col>
                        <el-col :span="3">
                            <el-checkbox
                                v-model="projectSetting.newFeedbackRemindEmail"
                                @change="()=>{
                                    this.clearFieldHandle(['newWriteNotifyEmail'])
                                    this.saveUserProjectSetting()
                                }"
                            />
                        </el-col>
                    </el-row>
                    <el-row v-if="projectSetting.newFeedbackRemindEmail" align="middle" type="flex">
                        <el-col :offset="3" :span="5">
                            <p class="project-setting-sub-label">请填写邮箱：</p>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="newWriteNotifyEmail">
                                <el-input v-model="userProjectSettingData.newWriteNotifyEmail" class="setting-input"
                                          placeholder="多个邮箱用 ; 隔开"
                                          style="width: 80%;"
                                          @change="saveUserProjectSetting"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row align="middle" type="flex">
                        <el-col :span="5">
                            <p class="project-setting-sub-label">发微信提醒我</p>
                        </el-col>
                        <el-col :span="3">
                            <el-checkbox
                                v-model="projectSetting.newFeedbackRemindWx"
                                @change="()=>{
                                    this.clearFieldHandle(['newWriteNotifyWx'])
                                    this.saveUserProjectSetting()
                                }"
                            />
                        </el-col>
                        <el-col :span="10">
                            <p class="project-setting-sub-label">
                                需要关注公众号
                                <el-link type="primary" @click="openSubNotifyWxDialogHandle">TDUCK</el-link>
                            </p>
                        </el-col>
                    </el-row>
                    <el-row v-if="userProjectSettingData.newWriteNotifyWx" align="middle" type="flex">
                        <el-col :offset="3" :span="5">
                            <p class="project-setting-sub-label">提醒人：</p>
                        </el-col>
                        <el-col :span="12">
                            <span v-for="(user,i) in subNotifyWxUserList" :key="i" class="sub-user-view">
                                <i class="el-icon-close sub-user-delete" @click="deleteSubNotifyUserHandle(i)" />
                                <el-avatar :src="user.headImgUrl" />
                            </span>
                        </el-col>
                    </el-row>
                </div>
                <el-dialog :visible.sync="dialogSubNotifyVisible"
                           title="微信扫描二维码订阅"
                           width="400px"
                >
                    <el-image
                        :src="subNotifyWxQrCode"
                        fit="fill"
                        style="width: 150px; height: 150px;"
                    />
                </el-dialog>
                <el-row align="middle" type="flex">
                    <el-col :span="12">
                        <p class="project-setting-label">记录微信用户个人信息</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            v-model="userProjectSettingData.recordWxUser"
                            @change="()=>{
                                this.userProjectSettingData.wxWrite=true
                                this.saveUserProjectSetting()
                            }"
                        />
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
                <el-row align="middle" type="flex">
                    <el-col :span="12">
                        <p class="project-setting-label">自定义分享图标</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            v-model="projectSetting.customizeShareIcon"
                            @change="clearFieldHandle(['userProjectSettingData.shareImg'])"
                        />
                    </el-col>
                </el-row>
                <el-row v-if="projectSetting.customizeShareIcon" align="middle" type="flex">
                    <el-col :span="10">
                        <p class="project-setting-label">
                            请上传分享图片 *
                            建议尺寸500px*500px
                        </p>
                    </el-col>
                    <el-col :span="12">
                        <el-upload
                            ref="logoUpload"
                            :action="getUploadUrl"
                            :headers="getUploadHeader"
                            :on-success="uploadShareImgHandle"
                            :show-file-list="false"
                            accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                        >
                            <div class="block">
                                <el-image
                                    :src="userProjectSettingData.shareImg"
                                    class="share-img"
                                    fit="cover "
                                >
                                    <div slot="error" class="image-slot">
                                        <i class="el-icon-picture-outline" />
                                    </div>
                                </el-image>
                            </div>
                        </el-upload>
                    </el-col>
                </el-row>
                <el-row align="middle" type="flex">
                    <el-col :span="12">
                        <p class="project-setting-label">自定义分享标题</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            v-model="projectSetting.customizeShareTitle"
                            @change="clearFieldHandle(['userProjectSettingData.shareTitle'])"
                        />
                    </el-col>
                </el-row>
                <el-row v-if="projectSetting.customizeShareTitle" align="middle"
                        type="flex"
                >
                    <el-col :span="8">
                        <p class="project-setting-sub-label">请输入标题：</p>
                    </el-col>
                    <el-col :span="15">
                        <el-input
                            v-model="userProjectSettingData.shareTitle"
                            :maxlength="50"
                            :show-word-limit="true"
                            class="setting-input" style="width: 80%;" @change="saveUserProjectSetting"
                        />
                    </el-col>
                </el-row>
                <el-row align="middle" type="flex">
                    <el-col :span="12">
                        <p class="project-setting-label">自定义分享描述</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch v-model="projectSetting.customizeShareDesc" />
                    </el-col>
                </el-row>
                <el-row v-if="projectSetting.customizeShareDesc" align="middle"
                        type="flex"
                >
                    <el-col :span="8">
                        <p class="project-setting-sub-label">请输入描述：</p>
                    </el-col>
                    <el-col :span="15">
                        <el-input
                            v-model="userProjectSettingData.shareDesc"
                            :maxlength="50"
                            :show-word-limit="true"
                            class="setting-input" style="width: 80%;" @change="saveUserProjectSetting"
                        />
                    </el-col>
                </el-row>
                <div
                    v-if="userProjectSettingData.shareDesc||userProjectSettingData.shareTitle||userProjectSettingData.shareImg"
                >
                    <p>通知卡片预览</p>
                    <div class="share-preview">
                        <div style="flex: 1" />
                        <div class="share-preview-msg">
                            <div class="share-preview-msg-box">
                                <p class="share-preview-msg-title">
                                    {{ userProjectSettingData.shareTitle }}
                                </p>
                                <div class="share-preview-info">
                                    <p class="share-preview-msg-desc">
                                        {{ userProjectSettingData.shareDesc }}
                                    </p>
                                    <div class="share-preview-img-box">
                                        <img v-if="userProjectSettingData.shareImg" :src="userProjectSettingData.shareImg" class="share-preview-img">
                                    </div>
                                </div>
                            </div>
                            <div class="share-preview-msg-angle" />
                        </div>
                        <div class="share-preview-avatar">
                            <img :src="getUserInfo.avatar" class="share-user-avatar">
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>

export default {
    name: 'ProjectSetting',
    data() {
        return {
            projectKey: null,
            settingRules: {
                newWriteNotifyEmail: [
                    {
                        trigger: 'blur',
                        pattern: /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/,
                        message: '请输入正确发送的邮箱'
                    }
                ]
            },
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
                wxWriteOnce: false,
                submitPromptText: '提交成功 !',
                submitJumpUrl: '',
                wxWrite: false,
                publicResult: false,
                timedNotEnabledPromptText: '填写尚未启用',
                timedDeactivatePromptText: '填写尚已经停用',
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
            },
            dialogSubNotifyVisible: false,
            subNotifyWxQrCode: '',
            subNotifyWxUserList: [],
            subNotifyUserTimer: null
        }
    },
    computed: {
        getUploadHeader() {
            return {
                'token': this.$store.getters['user/isLogin']
            }
        },
        getUploadUrl() {
            return `${process.env.VUE_APP_API_ROOT}/user/file/upload`
        },
        getUserInfo() {
            return JSON.parse(this.$store.getters['user/userInfo'])
        }
    },
    mounted() {
        this.projectKey = this.$route.query.key
        this.queryUserProjectSetting()
        this.getSubNotifyWxQrCode()
    },
    destroyed() {
        clearInterval(this.subNotifyUserTimer)
    },
    methods: {
        uploadSubmitPromptHandle(response) {
            this.userProjectSettingData.submitPromptImg = response.data
            this.saveUserProjectSetting()
        },
        uploadShareImgHandle(response) {
            this.userProjectSettingData.shareImg = response.data
            this.saveUserProjectSetting()
        },
        queryUserProjectSetting() {
            this.userProjectSettingData.projectKey = this.projectKey
            this.$api.get(`/user/project/setting/${this.projectKey}`).then(res => {
                if (res.data) {
                    this.userProjectSettingData = res.data
                    let {
                        submitPromptImg, submitPromptText, submitJumpUrl, timedCollectionBeginTime,
                        timedQuantitativeQuantity, newWriteNotifyEmail, newWriteNotifyWx,
                        shareImg, shareTitle, shareDesc
                    } = res.data
                    if (newWriteNotifyWx) {
                        this.querySubNotifyWxUser(newWriteNotifyWx)
                    }
                    this.projectSetting = {
                        showPromptImg: !!submitPromptImg,
                        showPromptText: !!submitPromptText,
                        showSubmitJumpUrl: !!submitJumpUrl,
                        timingCollectForm: !!timedCollectionBeginTime && !!timedQuantitativeQuantity,
                        timingCollectTimeRange: !!timedQuantitativeQuantity,
                        newFeedbackRemind: !!newWriteNotifyEmail || !!newWriteNotifyWx,
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
            this.$api.post('/user/project/setting/save', this.userProjectSettingData).then(() => {

            })
        },
        openSubNotifyWxDialogHandle() {
            this.dialogSubNotifyVisible = true
            this.projectSetting.newFeedbackRemindWx = true
            this.subNotifyUserTimer = setInterval(() => {
                this.querySubNotifyWxUser()
            }, 5 * 1000)
        },
        querySubNotifyWxUser(openIdStr) {
            this.$api.get('/user/project/wx/notify-user', {
                params: {
                    key: this.projectKey,
                    openIdStr: openIdStr
                }
            }).then(res => {
                this.subNotifyWxUserList = res.data
                if (this.subNotifyWxUserList) {
                    let changeNewWriteNotifyWx = this.subNotifyWxUserList.map(item => item.openId).join(';')
                    if (!openIdStr && changeNewWriteNotifyWx != this.userProjectSettingData.newWriteNotifyWx) {
                        this.userProjectSettingData.newWriteNotifyWx = changeNewWriteNotifyWx
                        this.saveUserProjectSetting()
                    }
                }
            })
        },
        getSubNotifyWxQrCode() {
            this.$api.get('user/project/wx/notify-qrcode', {params: {key: this.projectKey}}).then(res => {
                this.subNotifyWxQrCode = res.data
            })
        },
        deleteSubNotifyUserHandle(i) {
            if (this.subNotifyWxUserList) {
                let openId = this.subNotifyWxUserList[i].openId
                let key = this.projectKey
                this.$api.post(`/user/project/wx/delete/notify-user?key=${key}&openId=${openId}`).then(() => {
                    this.subNotifyWxUserList.splice(i)
                    this.userProjectSettingData.newWriteNotifyWx = this.subNotifyWxUserList.map(item => item.openId).join(';')
                    this.saveUserProjectSetting()
                })
            }
        },
        clearFieldHandle(fields) {
            fields.forEach(field => {
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
  padding-top: 30px;
  margin: 0;
  background-color: #f7f7f7;
}

.project-setting-view {
  height: 100%;
  line-height: 20px;
  border-radius: 7px;
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
  text-align: center;
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

.sub-user-view {
  position: relative;
  width: 60px;
  cursor: pointer;
}

.sub-user-view:hover .sub-user-delete {
  display: block;
}

.sub-user-delete {
  position: absolute;
  right: -6px;
  background-color: red;
  color: white;
  border-radius: 50px;
  padding: 2px;
  font-size: 12px;
  height: 16px;
  width: 16px;
  font-weight: 500;
  line-height: 18px;
  display: none;
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

.share-preview {
  height: 162px;
  margin: 0 auto;
  border-radius: 5px;
  background-color: #0001;
  border: 1px solid rgba(255, 255, 255, 100);
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-around;
}

.share-preview-msg {
  width: 210px;
  margin-right: 25px;
  border-radius: 5px;
  background-color: white;
  color: rgba(16, 16, 16, 100);
  box-shadow: 0 0 3px 0 rgba(157, 158, 162, 100);
  padding: 7px 10px 10px;
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.share-preview-msg-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.share-preview-msg::after,.share-preview-msg-angle {
  content: '';
  border: 8px solid transparent;
  border-style: solid;
  border-left-color: rgba(157, 158, 162, 0.397);
  position: absolute;
  right: -15px;
  top: 16px;
  width: 0;
  z-index: -1;
}

.share-preview-msg-angle {
  border: 7px solid transparent;
  border-left-color: #ffffff;
  right: -13px;
  top: 17px;
  z-index: 1;
}

.share-preview-msg-title {
  line-height: 22px;
  margin: 0;
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
  text-align: left;

  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.share-preview-info {
  flex: 1;
  display: flex;
  margin-top: 5px;
}

.share-preview-msg-desc {
  flex: 1;
  height: 100%;
  margin: 0;
  color: rgba(144, 147, 153, 100);
  font-size: 12px;
  line-height: 20px;
  text-align: left;

  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.share-preview-img-box {
  display: flex;
  align-items: flex-end;
  margin-left: 5px;
}
.share-preview-img {
  width: 49px;
  height: 46px;
}

.share-preview-avatar {
  margin-right: 30px;
  margin-top: -35px;
}

.share-user-avatar {
  width: 49px;
  height: 49px;
  border-radius: 6px;
}

::v-deep .setting-input input {
  border: none;
  border-bottom: 1px solid rgba(187, 187, 187, 100);
  border-radius: 0;
  line-height: 20px;
  height: 20px;
}

::v-deep .collection-date-picker input {
  border: none;
  border-bottom: 1px solid rgba(187, 187, 187, 100);
  border-radius: 0;
}

::v-deep .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin: 0;
}
</style>
