<template>
    <el-form ref="setting" :model="userProjectSettingData" :rules="settingRules">
        <el-row class="project-setting-container" type="flex" justify="center" align="top">
            <el-col :span="5" :offset="3" class="project-setting-view">
                <p class="project-setting-title">
                    提交设置
                </p>
                <el-row type="flex" align="middle">
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
                            class="submit-prompt-img"
                            :src="userProjectSettingData.submitPromptImg"
                            fit="cover "
                        >
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline" />
                            </div>
                        </el-image>
                    </div>
                    <el-upload
                        ref="logoUpload"
                        accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                        :headers="getUploadHeader"
                        :on-success="uploadSubmitPromptHandle"
                        :action="getUploadUrl"
                        :show-file-list="false"
                    >
                        <el-button slot="trigger" size="small" type="text">请上传提示图片 *</el-button>
                    </el-upload>
                </div>
                <el-row type="flex" align="middle">
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
                                  :show-word-limit="true"
                                  :maxlength="50"
                                  @change="saveUserProjectSetting"
                        />
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
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
                            :maxlength="50"
                            @change="saveUserProjectSetting"
                        />
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
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
                <el-row type="flex" align="middle">
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
                <el-row type="flex" align="middle">
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
                    <el-row type="flex" align="middle">
                        <el-col :span="5">
                            <p class="project-setting-sub-label">收集时间：</p>
                        </el-col>
                        <el-col :span="8">
                            <el-date-picker
                                v-model="userProjectSettingData.timedCollectionBeginTime"
                                type="datetime"
                                style="width: 100%; border: none;"
                                align="center"
                                class="collection-date-picker"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择开始时间"
                                @change="saveUserProjectSetting"
                            />
                        </el-col>
                        <el-col :span="1"><span>  至</span></el-col>
                        <el-col :span="8">
                            <el-date-picker
                                v-model="userProjectSettingData.timedCollectionEndTime"
                                type="datetime"
                                align="center"
                                class="collection-date-picker"
                                style="width: 100%; border: none;"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="结束日期"
                                @change="saveUserProjectSetting"
                            />
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
                        <el-col :span="8">
                            <p class="project-setting-sub-label">未启用提示语：</p>
                        </el-col>
                        <el-col :span="15">
                            <el-input v-model="userProjectSettingData.timedNotEnabledPromptText" class="setting-input"
                                      style="width: 80%;"
                                      :show-word-limit="true"
                                      :maxlength="50"
                                      @change="saveUserProjectSetting"
                            />
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
                        <el-col :span="8">
                            <p class="project-setting-sub-label">停用后提示语：</p>
                        </el-col>
                        <el-col :span="15">
                            <el-input v-model="userProjectSettingData.timedDeactivatePromptText" class="setting-input"
                                      style="width: 80%;"
                                      :show-word-limit="true"
                                      :maxlength="50"
                                      @change="saveUserProjectSetting"
                            />
                        </el-col>
                    </el-row>
                </div>
                <el-row type="flex" align="middle">
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
                    <el-row type="flex" align="middle">
                        <el-col :span="5">
                            <p class="project-setting-sub-label">收集时间：</p>
                        </el-col>
                        <el-col :span="8">
                            <el-date-picker
                                v-model="userProjectSettingData.timedCollectionBeginTime"
                                type="datetime"
                                style="width: 100%; border: none;"
                                align="center"
                                class="collection-date-picker"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择开始时间"
                                @change="saveUserProjectSetting"
                            />
                        </el-col>
                        <el-col :span="1"><span>  至</span></el-col>
                        <el-col :span="8">
                            <el-date-picker
                                v-model="userProjectSettingData.timedCollectionEndTime"
                                type="datetime"
                                align="center"
                                class="collection-date-picker"
                                style="width: 100%; border: none;"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="结束日期"
                                @change="saveUserProjectSetting"
                            />
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
                        <el-col :span="8">
                            <p class="project-setting-sub-label">未启用提示语：</p>
                        </el-col>
                        <el-col :span="15">
                            <el-input v-model="userProjectSettingData.timedNotEnabledPromptText" class="setting-input"
                                      style="width: 80%;"
                                      :show-word-limit="true"
                                      :maxlength="50"
                                      @change="saveUserProjectSetting"
                            />
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
                        <el-col :span="8">
                            <p class="project-setting-sub-label">停用后提示语：</p>
                        </el-col>
                        <el-col :span="15">
                            <el-input v-model="userProjectSettingData.timedDeactivatePromptText" class="setting-input"
                                      style="width: 80%;"
                                      :show-word-limit="true"
                                      :maxlength="50"
                                      @change="saveUserProjectSetting"
                            />
                        </el-col>
                    </el-row>
                    <el-row v-if="projectSetting.timingQuantitativeForm" type="flex" align="middle">
                        <el-col :span="8">
                            <p class="project-setting-sub-label">定量表单填写数量：</p>
                        </el-col>
                        <el-col :span="15">
                            <el-input v-model="userProjectSettingData.timedQuantitativeQuantity" class="setting-input"
                                      style="width: 80%;"
                                      oninput="value=value.replace(/[^\d]/g,'')"
                                      @change="saveUserProjectSetting"
                            />
                        </el-col>
                    </el-row>
                </div>
                <div v-if="projectSetting.timingQuantitativeForm">
                    <el-row type="flex" align="middle">
                        <el-col :span="8">
                            <p class="project-setting-sub-label">收集完成后提示：</p>
                        </el-col>
                        <el-col :span="15">
                            <el-input v-model="userProjectSettingData.timedEndPromptText" class="setting-input"
                                      style="width: 80%;"
                                      :show-word-limit="true"
                                      :maxlength="50"
                                      @change="saveUserProjectSetting"
                            />
                        </el-col>
                    </el-row>
                </div>
                <el-row type="flex" align="middle">
                    <el-col :span="12">
                        <p class="project-setting-label">每人限制填写1次</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            v-model="userProjectSettingData.everyoneWriteOnce"
                            @change="saveUserProjectSetting"
                        />
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
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
                        type="flex"
                        align="middle"
                >
                    <el-col :span="8">
                        <p class="project-setting-sub-label">重复填写后提示：</p>
                    </el-col>
                    <el-col :span="15">
                        <el-input v-model="userProjectSettingData.writeOncePromptText" class="setting-input"
                                  style="width: 80%;"
                                  :show-word-limit="true"
                                  :maxlength="50"
                                  @change="saveUserProjectSetting"
                        />
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                    <el-col :span="12">
                        <p class="project-setting-label">新反馈提醒我</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch v-model="projectSetting.newFeedbackRemind" />
                    </el-col>
                </el-row>
                <div v-if="projectSetting.newFeedbackRemind">
                    <el-row type="flex" align="middle">
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
                    <el-row v-if="projectSetting.newFeedbackRemindEmail" type="flex" align="middle">
                        <el-col :span="5" :offset="3">
                            <p class="project-setting-sub-label">请填写邮箱：</p>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="newWriteNotifyEmail">
                                <el-input v-model="userProjectSettingData.newWriteNotifyEmail" class="setting-input"
                                          style="width: 80%;"
                                          placeholder="多个邮箱用 ; 隔开"
                                          @change="saveUserProjectSetting"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" align="middle">
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
                    <el-row v-if="userProjectSettingData.newWriteNotifyWx" type="flex" align="middle">
                        <el-col :span="5" :offset="3">
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
                <el-dialog title="微信扫描二维码订阅"
                           width="400px"
                           :visible.sync="dialogSubNotifyVisible"
                >
                    <el-image
                        style="width: 150px; height: 150px;"
                        :src="subNotifyWxQrCode"
                        fit="fill"
                    />
                </el-dialog>
                <el-row type="flex" align="middle">
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
                <el-row type="flex" align="middle">
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
                <el-row v-if="projectSetting.customizeShareIcon" type="flex" align="middle">
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
                            :action="getUploadUrl"
                            :show-file-list="false"
                        >
                            <div class="block">
                                <el-image
                                    class="share-img"
                                    :src="userProjectSettingData.shareImg"
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
                <el-row type="flex" align="middle">
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
                <el-row v-if="projectSetting.customizeShareTitle" type="flex"
                        align="middle"
                >
                    <el-col :span="8">
                        <p class="project-setting-sub-label">请输入标题：</p>
                    </el-col>
                    <el-col :span="15">
                        <el-input
                            v-model="userProjectSettingData.shareTitle"
                            :show-word-limit="true"
                            :maxlength="50"
                            class="setting-input" style="width: 80%;" @change="saveUserProjectSetting"
                        />
                    </el-col>
                </el-row>
                <el-row type="flex" align="middle">
                    <el-col :span="12">
                        <p class="project-setting-label">自定义分享描述</p>
                    </el-col>
                    <el-col :span="12">
                        <el-switch v-model="projectSetting.customizeShareDesc" />
                    </el-col>
                </el-row>
                <el-row v-if="projectSetting.customizeShareDesc" type="flex"
                        align="middle"
                >
                    <el-col :span="8">
                        <p class="project-setting-sub-label">请输入描述：</p>
                    </el-col>
                    <el-col :span="15">
                        <el-input
                            v-model="userProjectSettingData.shareDesc"
                            :show-word-limit="true"
                            :maxlength="50"
                            class="setting-input" style="width: 80%;" @change="saveUserProjectSetting"
                        />
                    </el-col>
                </el-row>
                <div
                    v-if="userProjectSettingData.shareDesc||userProjectSettingData.shareTitle||userProjectSettingData.shareImg"
                >
                    <div class="share-preview">
                        <div class="share-preview-msg">
                            <div>
                                <p class="share-preview-msg-title">
                                    {{ userProjectSettingData.shareTitle }}
                                </p>
                                <p class="share-preview-msg-desc">
                                    {{ userProjectSettingData.shareDesc }}
                                </p>
                            </div>
                            <div>
                                <img v-if="userProjectSettingData.shareImg" :src="userProjectSettingData.shareImg"
                                     class="share-preview-img"
                                >
                            </div>
                        </div>
                        <div>
                            <img class="share-user-avatar" :src="getUserInfo.avatar">
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

<style  scoped>
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
    width: 360px;
    height: 162px;
    margin: 0 auto;
    border-radius: 5px;
    background-color: rgba(210, 210, 210, 42);
    border: 1px solid rgba(255, 255, 255, 100);
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: space-around;
}
.share-preview-msg {
    width: 210px;
    height: 88px;
    border-radius: 5px;
    background-color: white;
    color: rgba(16, 16, 16, 100);
    box-shadow: 0 0 3px 0 rgba(157, 158, 162, 100);
    padding: 5px;
    display: flex;
    align-items: center;
    justify-items: center;
    justify-content: center;
    position: relative;
}
.share-preview-msg::after {
    content: '';
    border: 10px solid transparent;
    border-left-color: #fff;
    position: absolute;
    right: -18px;
    top: 5px;
    width: 0;
}
.share-preview-msg-title {
    line-height: 22px;
    height: 25px;
    margin: 3px;
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    text-align: left;
}
.share-preview-msg-desc {
    margin: 3px;
    color: rgba(144, 147, 153, 100);
    font-size: 12px;
    line-height: 20px;
    height: 60px;
    width: 155px;
    text-align: left;
}
.share-preview-img {
    width: 49px;
    height: 46px;
    margin-right: 5px;
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
