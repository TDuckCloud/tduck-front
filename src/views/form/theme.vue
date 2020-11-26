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
                            <el-col :span="3" v-for="item in styleList">
                            <span
                                :class="{'style-btn-active':activeStyle==item.key}"
                                class="style-btn" @click="activeStyleHandler(item)">{{item.label}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="3">
                                <span class="theme-prompt-text">颜色</span>
                            </el-col>
                            <el-col :span="3">
                            <span
                                :class="{'style-btn-active':activeColor=''}"
                                class="style-btn" @click="activeColorHandler('')">全部</span>
                            </el-col>
                            <el-col
                                :class="{'style-btn-active':activeColor==c}"
                                @click.native="activeColorHandler(c)" v-bind:style="{backgroundColor: c}"
                                class="color-btn"
                                :span="3" v-for="c in colorList">
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col
                                class="theme-img-view"
                                :span="8" v-for="t in themeList"
                                @click.native="activeThemeHandler(t)">
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
            <el-col :offset="0" :span="12">
                <pre-view :key="projectFormKey" :project-key="projectKey"/>
            </el-col>
            <el-col :span="6">
                <div class="right-container">
                    <el-menu
                        default-active="2"
                        class="el-menu-vertical-demo">
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>背景</span>
                            </template>
                            <el-menu-item-group>
                                <template slot="title">分组一</template>
                                <el-menu-item index="1-1">选项1</el-menu-item>
                                <el-menu-item index="1-2">选项2</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group title="分组2">
                                <el-menu-item index="1-3">选项3</el-menu-item>
                            </el-menu-item-group>
                            <el-submenu index="1-4">
                                <template slot="title">选项4</template>
                                <el-menu-item index="1-4-1">选项1</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                    </el-menu>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import PreView from './PreView'

export default {
    name: 'theme',
    components: {
        PreView
    },
    data() {
        return {
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
    },
    methods: {
        activeStyleHandler(item) {
            this.activeStyle = item.key
            this.queryProjectTheme()
        },
        saveUserTheme() {
            let params = {'projectKey': this.projectKey, 'themeId': this.activeTheme.id}
            this.$api.post('/user/project/theme/save', params).then(res => {
                this.projectFormKey = +new Date()
            })
        },
        activeThemeHandler(item) {
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
        activeColorHandler(item) {
            this.activeColor = item
            this.queryProjectTheme()
        },
        queryProjectTheme() {
            this.$api.get('/project/theme/query', {
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
    width: 341px;
    height: 70vh;
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
    margin: 0 2px 4px 0;
//margin: 5px 9px; text-align: center; border: 1px solid #EAEAEA;
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
    width: 256px;
    height: 600px;
    line-height: 20px;
    text-align: center;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 100);
}
</style>
