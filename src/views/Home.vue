<template>
    <div id="home">
        <div class="headerDiv">
            <el-row>
                <el-col class="headerCol" :span="3"></el-col>
                <el-col class="headerCol" :span="18">
                    <el-menu :default-active="menuIndex" mode="horizontal" :router="true" text-color="#205BB5" active-text-color="#205BB5">
                        <div class="headerLogoDiv">
                            <img src="../assets/images/indexLogo.png" class="headerLogo" @click="$router.push({path:'/'})"/>
                        </div>
                        <el-button v-if="isLogin" class="headerBtn" @click="$router.push({path:'/console'})">控 制 台</el-button>
                        <el-button v-if="!isLogin" class="headerBtn" @click="$router.push({path:'/login'})">登 录</el-button>
                        <el-menu-item v-for="(item, index) in menuRouters" :key="index" :index="item.routerPath" :route="item.routerPath" class="menuItem">{{item.title}}</el-menu-item>
                    </el-menu>
                </el-col>
                <el-col class="headerCol" :span="3"></el-col>
            </el-row>
        </div>
        <div class="headerBody">
            <div class="indexBody" :style="menuIndex!=='/'?'border:solid thin #205BB5;border-left:none;border-right:none;':'border:none;'">
                <el-row>
                    <el-col class="bodyCol" :span="3"></el-col>
                    <el-col class="bodyCol" :span="18">
                        <div v-if="menuIndex==='/'">
                            <el-row>
                                <el-col :span=14>
                                    <div class="bodyLeft">
                                        <p class="bodyTitle">TDuck - 填鸭表单</p>
                                        <p class="bodySlogan">有你所想，有你所得。</p>
                                        <p class="bodySloganEn">TDuck - Have what you want, get you income.</p>
                                        <p class="bodyDetail">TDuck填鸭，是一款在线制作表单的应用工具，通过填鸭表单可以收集任何你想得到的信息。</p>
                                        <p class="bodyDetail">简单易用，灵活的反馈数据筛选；统计图表一目了然</p>
                                        <div class="bodyBtnDiv">
                                            <el-button class="bodyBtn primary" type="primary" @click="$router.push({path:'/console'})">免费使用</el-button>
                                            <el-button class="bodyBtn">在线体验</el-button>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span=10>
                                    <div class="bodyRight">
                                        <img class="bodyRightImg" src="../assets/images/bodyRight.png"/>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <router-view></router-view>
                    </el-col>
                    <el-col class="bodyCol" :span="3"></el-col>
                </el-row>
            </div>
            <div class="footerDiv">
                关于我们
            </div>
        </div>
    </div>
</template>
<script>
import store from '@/store/index.js';
export default {
    computed: {
        getStore() {
            return store;
        },
        isLogin() {
            return this.getStore.getters['token/isLogin'];
        }
    },
    data() {
        return {
            menuIndex: null,
            menuRouters: [
                {
                    routerPath: '/proposal',
                    title: '提出建议'
                },
                {
                    routerPath: '/sources',
                    title: '开源版本'
                },
                {
                    routerPath: '/enterprise',
                    title: '企业部署'
                },
                {
                    routerPath: '/',
                    title: '首页'
                }
            ]
        }
    },
    mounted() {
        this.menuIndex = this.$route.path;
    },
    watch: {
        $route(to,from) {
            this.menuIndex = to.path;
        }
    }
}
</script>
<style scoped>
.headerCol, .bodyCol {
    border: solid thin white;
}
.headerDiv {
    background-color: white;
    position: fixed;
    width: 100%;
    top: 0px;
    z-index: 100;
}
.headerDiv .headerCol .el-menu--horizontal {
    border: none;
}
.headerLogo {
    float: left;
    cursor: pointer;
}
.headerLogo {
    height: 60px;
    padding: 25px 0px 20px 0px;
}
.menuItem {
    line-height: 110px;
    height: 110px;
    font-size: 18px;
    font-weight: 900;
    float: right;
}
.headerBtn {
    margin: 35px 0px 35px 20px;
    float: right;
}
.bodyBtn {
    margin: 30px 20px 0px 0px;
    font-size: 20px;
    padding-left: 20px;
    padding-right: 20px;
}
.headerBtn, .bodyBtn {
    color: #205BB5;
    border-color: #205BB5;
}
.primary {
    color: #ffffff;
    background-color: #205BB5;
}
.headerBtn:focus, .headerBtn:hover, .bodyBtn:focus, .bodyBtn:hover {
    border-color: #205BB5;
    color: #205BB5;
}
.primary:focus, .primary:hover {
    border-color: #205BB5;
    color: #ffffff;
}
.headerBody {
    padding-top: 112px;
}
.footerDiv {
    font-size: 14px;
    color: #205BB5;
    text-align: center;
    line-height: 110px;
}
.indexBody {
    margin: 0px;
}
.bodyLeft {
    padding: 200px 110px;
}
.bodyLeft p {
    color: #205BB5;
}
.bodyTitle {
    font-size: 35px;
    font-weight: 900;
    line-height: 25px;
    margin: 0px 0px 30px 0px;
}
.bodySlogan {
    font-size: 45px;
    font-weight: 900;
    line-height: 45px;
    margin: 0px 0px 5px 0px;
}
.bodySloganEn {
    line-height: 15px;
    margin: 0px 0px 25px 0px;
}
.bodyDetail {
    line-height: 15px;
    margin: 0px 0px 10px 0px;
}
.bodySloganEn, .bodyDetail {
    font-size: 15px;
}
.bodyRightImg {
    height: 665px;
    margin: 0 auto;
    display: block;
}
</style>
