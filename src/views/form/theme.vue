<template>
    <div class="theme-container">
        <el-row>
            <el-col :span="5" :offset="1">
                <el-scrollbar style="height: 77vh">
                    <div class="left-container">
                        <p class="theme-title">外观主题</p>
                        <el-row>
                            <el-col :span="3">
                                <span class="theme-prompt-text">风格</span>
                            </el-col>
                            <el-col
                                :key="item.key"
                                :span="3" v-for="item in styleList">
                            <span
                                :class="{'style-btn-active':activeStyle==item.key}"
                                class="style-btn" @click="activeStyleHandle(item)">{{item.label}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">
                                <span class="theme-prompt-text">颜色</span>
                            </el-col>
                            <el-col :span="3">
                            <span
                                :class="{'style-btn-active':activeColor==''}"
                                class="style-btn" @click="activeColorHandle('')">全部</span>
                            </el-col>
                            <el-col
                                :class="{'style-btn-active':activeColor==c}"
                                @click.native="activeColorHandle(c)" v-bind:style="{backgroundColor: c}"
                                class="color-btn"
                                :key="c"
                                :span="3" v-for="c in colorList">
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col
                                class="theme-img-view"
                                :key="t.id"
                                :span="8" v-for="t in themeList"
                                @click.native="activeThemeHandle(t)">
                                <p :class="{'head-list-view-select':activeTheme.id==t.id}">
                                    <el-image
                                        :class="{'head-list-img-active':activeTheme.id==t.id}"
                                        class="head-list-img"
                                        style="width: 100px; height: 100px"
                                        :src="t.headImgUrl"
                                        fit="cover"
                                    ></el-image>
                                </p>
                            </el-col>
                        </el-row>
                    </div>
                </el-scrollbar>
            </el-col>
            <el-col :offset="0" :span="14">
                <pre-view :key="projectFormKey" :project-key="projectKey"/>
            </el-col>
            <el-col :span="4">
                <div class="right-container">
                    <p class="right-title">外观设置</p>
                    <el-row class="option-line-view" type="flex" align="middle">
                        <el-col :span="8">
                            <span class="option-line-title">添加logo</span>
                        </el-col>
                        <el-col :span="8" :offset="8">
                            <el-switch
                                v-model="showSettings.logoSetting">
                            </el-switch>
                        </el-col>
                    </el-row>
                    <el-row v-if="showSettings.logoSetting" type="flex" align="middle">
                        <el-col :span="6">
                            <span class="option-line-sub-title">logo设置</span>
                        </el-col>
                        <el-col :span="4">
                            <img
                                v-if="userProjectTheme.logoImg"
                                style="width: 30px;height: 30px"
                                :src="userProjectTheme.logoImg"/>
                        </el-col>
                        <el-col :span="8" :offset="6">
                            <el-upload
                                ref="logoUpload"
                                accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                                :headers="getUploadHeader"
                                :on-success="uploadLogoHandle"
                                :action="getUploadUrl"
                                :show-file-list="false">
                                <el-link slot="trigger" size="small" type="primary">上传Logo</el-link>
                            </el-upload>
                        </el-col>
                    </el-row>
                    <el-row v-if="showSettings.logoSetting" type="flex" align="middle">
                        <el-col :span="6">
                            <span class="option-line-sub-title">logo位置</span>
                        </el-col>
                        <el-col :span="18">
                            <el-radio-group
                                @change="saveUserTheme"
                                v-model="userProjectTheme.logoPosition" size="mini">
                                <el-radio-button label="left">左对齐</el-radio-button>
                                <el-radio-button label="center">居中</el-radio-button>
                                <el-radio-button label="right">右对齐</el-radio-button>
                            </el-radio-group>
                        </el-col>
                    </el-row>
                    <el-row class="option-line-view" type="flex" align="middle">
                        <el-col :span="8">
                            <span class="option-line-title">背景设置</span>
                        </el-col>
                        <el-col :span="8" :offset="8">
                            <el-switch
                                @change="()=>{
                                        this.userProjectTheme.backgroundImg=''
                                        this.userProjectTheme.backgroundColor=''
                                        this.saveUserTheme()
                                    }"
                                v-model="showSettings.backgroundSetting">
                            </el-switch>
                        </el-col>
                    </el-row>
                    <el-row v-if="showSettings.backgroundSetting">
                        <el-row type="flex" align="middle">
                            <el-col :span="8">
                                <span class="option-line-sub-title">背景类型</span>
                            </el-col>
                            <el-col :spvan="18">
                                <el-radio-group
                                    @change="()=>{
                                        this.userProjectTheme.backgroundImg=''
                                        this.userProjectTheme.backgroundColor=''
                                    }"
                                    v-model="showSettings.backgroundType" size="mini">
                                    <el-radio-button label="color">颜色</el-radio-button>
                                    <el-radio-button label="img">图片</el-radio-button>
                                </el-radio-group>
                            </el-col>
                        </el-row>
                    </el-row>
                    <el-row v-if="showSettings.backgroundSetting&&showSettings.backgroundType=='color'">
                        <el-row type="flex" align="middle">
                            <el-col :span="8">
                                <span class="option-line-sub-title">选择颜色</span>
                            </el-col>
                            <el-col :spvan="18">
                                <el-color-picker
                                    @change="saveUserTheme"
                                    v-model=" userProjectTheme.backgroundColor"
                                    size="mini"></el-color-picker>
                            </el-col>
                        </el-row>
                    </el-row>
                    <el-row v-if="showSettings.backgroundType=='img'">
                        <el-row type="flex" align="middle">
                            <el-col :span="8">
                                <span class="option-line-sub-title">选择图片</span>
                            </el-col>
                            <el-col :spvan="18">
                                <el-upload
                                    class="upload-demo"
                                    ref="upload"
                                    accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                                    :headers="getUploadHeader"
                                    :on-success="uploadBackgroundHandle"
                                    :action="getUploadUrl"
                                    :show-file-list="false">
                                    <el-link slot="trigger" size="small" type="primary">上传背景</el-link>
                                </el-upload>
                            </el-col>
                        </el-row>
                    </el-row>
                    <el-row class="option-line-view" type="flex" align="middle">
                        <el-col :span="8">
                            <span class="option-line-title">按钮设置</span>
                        </el-col>
                        <el-col :span="8" :offset="8">
                            <el-switch
                                v-model="showSettings.btnSetting">
                            </el-switch>
                        </el-col>
                    </el-row>
                    <el-row v-if="showSettings.btnSetting">
                        <el-row type="flex" align="middle">
                            <el-col :span="12">
                                <span class="option-line-sub-title">按钮提示文字</span>
                            </el-col>
                            <el-col :spvan="10">
                                <el-input style="width: 80%"
                                          @change="saveUserTheme"
                                          v-model="userProjectTheme.submitBtnText"
                                          placeholder="请输入内容" size="mini"></el-input>
                            </el-col>
                        </el-row>
                    </el-row>
                    <el-row class="option-line-view" type="flex" align="middle">
                        <el-col :span="8">
                            <span class="option-line-title">显示标题</span>
                        </el-col>
                        <el-col :span="8" :offset="8">
                            <el-switch
                                @change="saveUserTheme"
                                v-model="userProjectTheme.showTitle">
                            </el-switch>
                        </el-col>
                    </el-row>
                    <el-row class="option-line-view" type="flex" align="middle">
                        <el-col :span="8">
                            <span class="option-line-title">显示描述</span>
                        </el-col>
                        <el-col :span="8" :offset="8">
                            <el-switch
                                @change="saveUserTheme"
                                v-model="userProjectTheme.showDescribe">
                            </el-switch>
                        </el-col>
                    </el-row>
                    <el-row class="option-line-view" type="flex" align="middle">
                        <el-col :span="8">
                            <span class="option-line-title">显示序号</span>
                        </el-col>
                        <el-col :span="8" :offset="8">
                            <el-switch
                                @change="saveUserTheme"
                                v-model="userProjectTheme.showNumber">
                            </el-switch>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import PreView from './PreView'
import store from '@/store'

export default {
    name: 'theme',
    components: {
        PreView
    },
    data() {
        return {
            //外观设置
            showSettings: {
                logoSetting: false,//打开logo
                backgroundSetting: false,
                btnSetting: false,
                backgroundType: 'color'
            },
            //用户主题设置
            userProjectTheme: {
                projectKey: '',
                themeId: '',
                showTitle: true,
                showDescribe: true,
                showNumber: false,
                backgroundColor: '',
                backgroundImg: '',
                logoImg: '',
                logoPosition: 'left',
                submitBtnText: '提交'
            },
            projectFormKey: +new Date(),
            projectKey: '',
            styleList: [
                {'label': '全部', 'key': ''},
                {'label': '节日', 'key': 'festival'},
                {'label': '亲子', 'key': 'parent_child'},
                {'label': '风景', 'key': 'scenery'},
                {'label': '职业', 'key': 'occupation'},
                {'label': '校园', 'key': 'school'},
                {'label': '商务', 'key': 'commerce'},
                {'label': '其他', 'key': 'others'},
                {'label': '餐饮', 'key': 'catering'},
                {'label': '防疫', 'key': 'fangyi'}
            ],
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
    mounted() {
        this.projectKey = this.$route.query.key
        this.queryProjectTheme()
        this.projectFormKey = +new Date()
        this.queryUserProjectTheme()
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
    },
    methods: {
        uploadBackgroundHandle(response, file, fileList) {
            this.userProjectTheme.backgroundImg = response.data
            this.userProjectTheme.backgroundColor = ''
            this.saveUserTheme()
        },
        uploadLogoHandle(response, file, fileList) {
            this.userProjectTheme.logoImg = response.data
            this.saveUserTheme()
        },
        activeStyleHandle(item) {
            this.activeStyle = item.key
            this.queryProjectTheme()
        },
        saveUserTheme() {
            this.userProjectTheme.projectKey = this.projectKey
            this.userProjectTheme.themeId = this.activeTheme ? this.activeTheme.id : ''
            this.$api.post('/user/project/theme/save', this.userProjectTheme).then(res => {
                this.projectFormKey = +new Date()
            })
        },
        queryUserProjectTheme() {
            this.$api.get(`/user/project/theme/${this.projectKey}`).then(res => {
                if(!res.data){
                    return
                }
                this.userProjectTheme = res.data
                let {themeId, logoImg, backgroundImg, backgroundColor, submitBtnText} = res.data
                this.activeTheme = {
                    'id': themeId
                }
                this.showSettings.logoSetting = logoImg ? true : false
                this.showSettings.btnSetting = submitBtnText ? true : false
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
                    this.saveUserTheme()
                }).catch(() => {

                })
            }
        },
        activeColorHandle(item) {
            console.log(item)
            this.activeColor = item
            this.queryProjectTheme()
        },
        queryProjectTheme() {
            this.$api.get('/project/theme/list', {
                params: {
                    'color': this.activeColor,
                    'style': this.activeStyle
                }
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
    height: 100%;
    background-color: #f7f7f7;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    overflow: hidden;
}

.left-container {
    line-height: 20px;
    border-radius: 7px;
    text-align: center;
    padding: 30px;
    border: 1px solid rgba(255, 255, 255, 100);
    background-color: white;
}


.style-btn {
    line-height: 30px;
    border-radius: 4px;
    padding: 3px;
    color: #707070;
    font-size: 14px;
    text-align: center;
    border: 1px solid #EAEAEA;
}

.theme-title {
    color: rgba(16, 16, 16, 100);
    font-size: 24px;
    text-align: left;
    font-family: SourceHanSansSC-regular;
}

.theme-prompt-text {
    color: rgba(16, 16, 16, 100);
    font-size: 16px;
    line-height: 30px;
    text-align: left;
    font-family: SourceHanSansSC-regular;
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
    font-family: Arial;
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
    height: 78vh;
    line-height: 20px;
    text-align: center;
    padding: 22px;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 100);
    background-color: white;
}

.right-title {
    color: rgba(16, 16, 16, 100);
    font-size: 24px;
    text-align: left;
    font-family: SourceHanSansSC-regular;
    margin: 0 0 30px 0;
}

.right-container .option-line-view {
    padding: 0px;
    margin: 0px;
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
    font-family: SourceHanSansSC-regular
}

.option-line-sub-title {
    color: rgb(82, 81, 81);
    line-height: 40px;
    font-size: 13px;
    text-align: left;
}
</style>
