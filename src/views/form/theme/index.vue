<template>
    <div class="theme-container">
        <div class="left-container">
            <el-scrollbar class="left-scrollbar-container">
                <p class="theme-title">
                    外观主题
                </p>
                <el-row>
                    <el-col :span="3">
                        <span class="theme-prompt-text">风格</span>
                    </el-col>
                    <el-col
                        v-for="item in styleList"
                        :key="item.key" :span="3"
                    >
                        <span
                            :class="{'style-btn-active':activeStyle==item.key}"
                            class="style-btn" @click="activeStyleHandle(item)"
                        >{{ item.label }}
                        </span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="3">
                        <span class="theme-prompt-text">颜色</span>
                    </el-col>
                    <el-col :span="3">
                        <span
                            :class="{'style-btn-active':activeColor==''}"
                            class="style-btn" @click="activeColorHandle('')"
                        >全部</span>
                    </el-col>
                    <el-col
                        v-for="c in colorList"
                        :key="c" :class="{'style-btn-active':activeColor==c}"
                        :span="3"
                        :style="{backgroundColor: c}"
                        class="color-btn" @click.native="activeColorHandle(c)"
                    />
                </el-row>
                <el-row>
                    <el-col
                        v-for="t in themeList"
                        :key="t.id"
                        :span="8" class="theme-img-view"
                        @click.native="activeThemeHandle(t)"
                    >
                        <p :class="{'head-list-view-select':activeTheme.id==t.id}">
                            <el-image
                                :class="{'head-list-img-active':activeTheme.id==t.id}"
                                :src="t.headImgUrl"
                                class="head-list-img"
                                fit="cover"
                                style="width: 100px; height: 100px;"
                            />
                        </p>
                    </el-col>
                </el-row>
            </el-scrollbar>
        </div>
        <pre-view :key="projectFormKey" :form-key="formKey" />
        <div class="right-container">
            <p class="right-title">
                外观设置
            </p>
            <el-row align="middle" class="option-line-view" type="flex">
                <el-col :span="8">
                    <span class="option-line-title">添加logo</span>
                </el-col>
                <el-col :offset="8" :span="8">
                    <el-switch
                        v-model="showSettings.logoSetting"
                        @change="cleanFormSave('logoImg')"
                    />
                </el-col>
            </el-row>
            <el-row v-if="showSettings.logoSetting" align="middle" type="flex">
                <el-col :span="6">
                    <span class="option-line-sub-title">logo设置</span>
                </el-col>
                <el-col :span="4">
                    <img
                        v-if="userFormTheme.logoImg"
                        :src="userFormTheme.logoImg"
                        style="width: 30px; height: 30px;"
                    >
                </el-col>
                <el-col :offset="6" :span="8">
                    <el-upload
                        ref="logoUpload"
                        :action="getUploadUrl"
                        :headers="getUploadHeader"
                        :on-success="uploadLogoHandle"
                        :show-file-list="false"
                        accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                    >
                        <el-button slot="trigger" size="small" type="text">
                            上传Logo
                        </el-button>
                    </el-upload>
                </el-col>
            </el-row>
            <el-row v-if="showSettings.logoSetting" align="middle" type="flex">
                <el-col :span="6">
                    <span class="option-line-sub-title">logo位置</span>
                </el-col>
                <el-col :span="18">
                    <el-radio-group
                        v-model="userFormTheme.logoPosition"
                        size="mini" @change="saveUserTheme"
                    >
                        <el-radio-button label="left">
                            左对齐
                        </el-radio-button>
                        <el-radio-button label="center">
                            居中
                        </el-radio-button>
                        <el-radio-button label="right">
                            右对齐
                        </el-radio-button>
                    </el-radio-group>
                </el-col>
            </el-row>
            <el-row align="middle" class="option-line-view" type="flex">
                <el-col :span="8">
                    <span class="option-line-title">头图设置</span>
                </el-col>
                <el-col :offset="8" :span="8">
                    <el-switch
                        v-model="showSettings.headImgSetting"
                        @change="()=>cleanFormSave('headImgUrl')"
                    />
                </el-col>
            </el-row>
            <el-row v-if="showSettings.headImgSetting" align="middle" type="flex">
                <el-col :span="6">
                    <span class="option-line-sub-title">上传图片</span>
                </el-col>
                <el-col :span="4">
                    <img
                        v-if="userFormTheme.headImgUrl"
                        :src="userFormTheme.headImgUrl"
                        style="width: 30px; height: 30px;"
                    >
                </el-col>
                <el-col :offset="6" :span="8">
                    <el-upload
                        ref="logoUpload"
                        :action="getUploadUrl"
                        :headers="getUploadHeader"
                        :on-success="uploadHeadImgHandle"
                        :show-file-list="false"
                        accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                    >
                        <el-button slot="trigger" size="small" type="text">
                            上传
                        </el-button>
                    </el-upload>
                </el-col>
            </el-row>

            <el-row align="middle" class="option-line-view" type="flex">
                <el-col :span="8">
                    <span class="option-line-title">背景设置</span>
                </el-col>
                <el-col :offset="8" :span="8">
                    <el-switch
                        v-model="showSettings.backgroundSetting"
                        @change="()=>{
                            userFormTheme.backgroundImg=''
                            userFormTheme.backgroundColor=''
                            saveUserTheme()
                        }"
                    />
                </el-col>
            </el-row>
            <el-row v-if="showSettings.backgroundSetting">
                <el-row align="middle" type="flex">
                    <el-col :span="8">
                        <span class="option-line-sub-title">背景类型</span>
                    </el-col>
                    <el-col :spvan="18">
                        <el-radio-group
                            v-model="showSettings.backgroundType"
                            size="mini" @change="()=>{
                                userFormTheme.backgroundImg=''
                                userFormTheme.backgroundColor=''
                            }"
                        >
                            <el-radio-button label="color">
                                颜色
                            </el-radio-button>
                            <el-radio-button label="img">
                                图片
                            </el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-row>
            </el-row>
            <el-row v-if="showSettings.backgroundSetting&&showSettings.backgroundType=='color'">
                <el-row align="middle" type="flex">
                    <el-col :span="8">
                        <span class="option-line-sub-title">选择颜色</span>
                    </el-col>
                    <el-col :spvan="18">
                        <el-color-picker
                            v-model=" userFormTheme.backgroundColor"
                            size="mini"
                            @change="saveUserTheme"
                        />
                    </el-col>
                </el-row>
            </el-row>
            <el-row v-if="showSettings.backgroundType=='img'">
                <el-row align="middle" type="flex">
                    <el-col :span="8">
                        <span class="option-line-sub-title">选择图片</span>
                    </el-col>
                    <el-col :spvan="18">
                        <el-upload
                            ref="upload"
                            :action="getUploadUrl"
                            :headers="getUploadHeader"
                            :on-success="uploadBackgroundHandle"
                            :show-file-list="false"
                            accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                            class="upload-demo"
                        >
                            <el-button slot="trigger" size="small" type="text">
                                上传背景
                            </el-button>
                        </el-upload>
                    </el-col>
                </el-row>
            </el-row>
            <el-row align="middle" class="option-line-view" type="flex">
                <el-col :span="8">
                    <span class="option-line-title">按钮设置</span>
                </el-col>
                <el-col :offset="8" :span="8">
                    <el-switch
                        v-model="showSettings.btnSetting"
                    />
                </el-col>
            </el-row>
            <el-row v-if="showSettings.btnSetting">
                <el-row align="middle" type="flex">
                    <el-col :span="12">
                        <span class="option-line-sub-title">按钮提示文字</span>
                    </el-col>
                    <el-col :spvan="10">
                        <el-input v-model="userFormTheme.submitBtnText"
                                  placeholder="请输入内容"
                                  size="mini"
                                  style="width: 80%;" @change="saveUserTheme"
                        />
                    </el-col>
                </el-row>
            </el-row>
            <el-row align="middle" class="option-line-view" type="flex">
                <el-col :span="8">
                    <span class="option-line-title">显示标题</span>
                </el-col>
                <el-col :offset="8" :span="8">
                    <el-switch
                        v-model="userFormTheme.showTitle"
                        @change="saveUserTheme"
                    />
                </el-col>
            </el-row>
            <el-row align="middle" class="option-line-view" type="flex">
                <el-col :span="8">
                    <span class="option-line-title">显示描述</span>
                </el-col>
                <el-col :offset="8" :span="8">
                    <el-switch
                        v-model="userFormTheme.showDescribe"
                        @change="saveUserTheme"
                    />
                </el-col>
            </el-row>
            <el-row align="middle" class="option-line-view" type="flex">
                <el-col :span="8">
                    <span class="option-line-title">显示序号</span>
                </el-col>
                <el-col :offset="8" :span="8">
                    <el-switch
                        v-model="userFormTheme.showNumber"
                        @change="saveUserTheme"
                    />
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import PreView from '../preview'
import {getUserThemeRequest, listThemeRequest, saveUserThemeRequest} from '@/api/project/form'
import {listCategory} from '../../../api/project/theme'
import {getToken} from '../../../utils/auth'

export default {
    name: 'Theme',
    components: {
        PreView
    },
    data() {
        return {
            // 外观设置
            showSettings: {
                logoSetting: false, // 打开logo
                headImgSetting: false, // 打开logo
                backgroundSetting: false,
                btnSetting: false,
                backgroundType: 'color'
            },
            // 用户主题设置
            userFormTheme: {
                formKey: '',
                themeId: '',
                showTitle: true,
                showDescribe: true,
                showNumber: false,
                backgroundColor: '',
                backgroundImg: '',
                headImgUrl: '',
                logoPosition: 'left',
                submitBtnText: '提交'
            },
            projectFormKey: +new Date(),
            formKey: '',
            styleList: [],
            colorList: [
                '#FF6D56',
                '#F8E71C',
                '#00BF6F',
                '#2672FF ',
                '#7464FF',
                '#484848',
                '#EAEAEA',
                '#804000'
            ],
            activeColor: '',
            activeStyle: '',
            activeTheme: '',
            themeList: []
        }
    },
    computed: {
        getUploadHeader() {
            return {
                Authorization: 'Bearer ' + getToken()
            }
        },
        getUploadUrl() {
            return `${process.env.VUE_APP_API_ROOT}/user/file/upload`
        }
    },
    mounted() {
        this.formKey = this.$route.query.key
        this.queryFormThemeStyle()
        this.queryFormTheme()
        this.projectFormKey = +new Date()
        this.queryUserFormTheme()
    },
    methods: {
        uploadBackgroundHandle(response) {
            this.userFormTheme.backgroundImg = response.data
            this.userFormTheme.backgroundColor = ''
            this.saveUserTheme()
        },
        uploadLogoHandle(response) {
            this.userFormTheme.logoImg = response.data
            this.saveUserTheme()
        },
        uploadHeadImgHandle(response) {
            this.userFormTheme.headImgUrl = response.data
            this.saveUserTheme()
        },
        activeStyleHandle(item) {
            this.activeStyle = item.key
            this.queryFormTheme()
        },
        cleanFormSave(key) {
            this.userFormTheme[key] = ''
            this.saveUserTheme()
        },
        saveUserTheme(item) {
            this.userFormTheme.formKey = this.formKey
            if (item) {
                this.userFormTheme.headImgUrl = item.headImgUrl
                this.userFormTheme.btnsColor = item.btnsColor
            }
            saveUserThemeRequest(this.userFormTheme).then(() => {
                this.projectFormKey = +new Date()
            })
        },
        queryFormThemeStyle() {
            listCategory(this.queryParams).then(response => {
                if (response.data) {
                    this.styleList = response.data.map(item => {
                        return {key: item.id, label: item.name}
                    })
                }
            })
        },
        queryUserFormTheme() {
            getUserThemeRequest(this.formKey).then(res => {
                if (!res.data) {
                    return
                }
                this.userFormTheme = res.data
                let {themeId, logoImg, backgroundImg, headImgUrl, backgroundColor, submitBtnText} = res.data
                this.activeTheme = {
                    'id': themeId
                }
                this.showSettings.logoSetting = !!logoImg
                this.showSettings.headImgSetting = !!headImgUrl
                this.showSettings.btnSetting = !!submitBtnText
                if (backgroundImg || backgroundColor) {
                    this.showSettings.backgroundSetting = true
                    this.showSettings.backgroundType = backgroundImg ? 'img' : 'color'
                }

            })
        },
        activeThemeHandle(item) {
            if (item) {
                this.$confirm('切换主题，系统将不会保存您在上一主题所做的修改，请知悉。', '切换主题提醒', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消操作',
                    type: 'info'
                }).then(() => {
                    this.activeTheme = item
                    this.saveUserTheme(item)
                }).catch(() => {

                })
            }
        },
        activeColorHandle(item) {
            this.activeColor = item
            this.queryFormTheme()
        },
        queryFormTheme() {
            listThemeRequest({
                'color': this.activeColor,
                'style': this.activeStyle
            }).then(res => {
                this.themeList = res.data
            })
        }
    }
}
</script>

<style scoped>
.theme-container {
  width: 100%;
  background-color: #f7f7f7;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  justify-content: center;
}

.left-container {
  line-height: 20px;
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 100);
  background-color: white;
  width: 20%;
  height: calc(100vh - 60px);
}

.left-scrollbar-container {
  height: 100%;
  margin: 20px;
}

::v-deep .el-scrollbar__wrap {
  overflow-x: hidden !important;
}

.style-btn {
  line-height: 30px;
  border-radius: 4px;
  padding: 3px;
  color: #707070;
  font-size: 14px;
  text-align: center;
  border: 1px solid #eaeaea;
}

.preview-container {
  width: 70%;
}

.theme-title {
  color: rgba(16, 16, 16, 100);
  font-size: 24px;
  text-align: left;
}

.theme-prompt-text {
  color: rgba(16, 16, 16, 100);
  font-size: 16px;
  line-height: 30px;
  text-align: left;
}

.color-btn {
  width: 40px;
  height: 22px;
  line-height: 20px;
  border-radius: 4px;
  background-color: rgba(11, 141, 213, 100);
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
  text-align: center;
  margin: 3px;
  border: 1px solid rgba(255, 255, 255, 100);
}

.color-btn:hover,
.style-btn:hover {
  cursor: pointer;
  border: 1px solid rgba(11, 141, 213, 100);
}

.style-btn-active {
  border: 1px solid rgba(11, 141, 213, 100);
}

.head-list-img {
  border: 2px solid transparent;
}

.head-list-img:hover {
  cursor: pointer;
  border: 2px solid rgba(11, 141, 213, 100);
}

.head-list-img-active {
  border: 2px solid rgba(11, 141, 213, 100);
}

.theme-img-view .head-list-view-select ::after {
  content: "";
  background: url('~@/assets/images/mobile_theme_active.png');
  background-size: 18px;
  width: 18px;
  height: 18px;
  position: absolute;
  top: 4px;
  right: 4px;
}

.right-container {
  width: 310px;
  height: calc(100vh - 60px);
  line-height: 20px;
  text-align: center;
  padding: 22px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 100);
  background-color: white;
  margin-right: 5px;
}

.right-title {
  color: rgba(16, 16, 16, 100);
  font-size: 24px;
  text-align: left;
  margin: 0 0 30px 0;
}

.right-container .option-line-view {
  padding: 0;
  width: 280px;
  height: 42px;
  line-height: 20px;
  border-radius: 5px;
  text-align: center;
  margin-bottom: 10px;
  border: 1px solid rgba(187, 187, 187, 100);
}

.right-container .option-line-title {
  color: rgba(16, 16, 16, 100);
  line-height: 40px;
  font-size: 14px;
  text-align: left;
}

.option-line-sub-title {
  color: rgb(82, 81, 81);
  line-height: 40px;
  font-size: 13px;
  text-align: left;
}
</style>
