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
                            <el-col :span="8" v-for="t in themeList">
                                <el-image
                                    class="head-list-img"
                                    style="width: 100px; height: 100px"
                                    :src="t.headImgUrl"
                                    fit="cover"
                                ></el-image>
                            </el-col>
                        </el-row>
                    </div>
                </el-scrollbar>
            </el-col>
            <el-col :offset="0" :span="12">
                <pre-view :projectKey="projectKey"/>
            </el-col>
            <el-col :span="6">
                <div class="right-container"></div>
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
            projectKey: '',
            themeList: []
        }
    },
    mounted() {
        this.projectKey = this.$route.query.key
        this.queryProjectTheme()
    },
    methods: {
        activeStyleHandler(item) {
            this.activeStyle = item.key
            this.queryProjectTheme()
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

.right-container {
    width: 456px;
    height: 600px;
    line-height: 20px;
    text-align: center;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 100);
}
</style>
