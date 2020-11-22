<template>
    <div id="welcome">
        <div class="header-container">
            <el-row type="flex" align="middle">
                <el-col class="header-col" :span="3" :offset="2">
                    <div>
                        <img src="../assets/images/indexLogo.png" class="header-logo"
                             @click="$router.push({path:'/home'})"
                        >
                    </div>
                </el-col>
                <el-col class="header-col" :span="10" :offset="3">
                    <el-menu :default-active="menuIndex" mode="horizontal" :router="true" text-color="#205BB5"
                             active-text-color="#205BB5"
                    >
                        <el-menu-item v-for="(item, index) in menuRouters" :key="index" :index="item.routerPath"
                                      :route="item.routerPath" class="menu-item"
                        >
                            {{ item.title }}
                        </el-menu-item>
                    </el-menu>
                </el-col>
                <el-col class="header-col" :span="3">
                    <el-button v-if="isLogin" class="header-btn" @click="$router.push({path:'/home'})">控 制 台</el-button>
                    <el-button v-if="!isLogin" class="header-btn" @click="$router.push({path:'/login'})">登 录</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="welcome-body">
            <div class="view_container"
                 :style="menuIndex!=='/'?'border:solid thin #205BB5;border-left:none;border-right:none;':'border:none;'"
            >
                <el-row>
                    <el-col class="body-col" :span="3" />
                    <el-col class="body-col" :span="18">
                        <div v-if="menuIndex==='/'">
                            <el-row>
                                <el-col :span="14">
                                    <div class="view_container_content">
                                        <p class="body-title">TDuck - 填鸭表单</p>
                                        <p class="body-slogan">有你所想，有你所得。</p>
                                        <p class="body-sloganEn">TDuck - Have what you want, get you income.</p>
                                        <p class="body-detail">TDuck填鸭，是一款在线制作表单的应用工具，通过填鸭表单可以收集任何你想得到的信息。</p>
                                        <p class="body-detail">简单易用，灵活的反馈数据筛选；统计图表一目了然</p>
                                        <div>
                                            <el-button class="body-btn primary" type="primary"
                                                       @click="$router.push({path:'/console'})"
                                            >
                                                免费使用
                                            </el-button>
                                            <el-button class="body-btn">在线体验</el-button>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="10">
                                    <div class="bodyRight">
                                        <img class="body-right-img"
                                             src="https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2woer.png"
                                        >
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                    <el-col class="body-col" :span="3" />
                </el-row>
            </div>
            <el-divider />
            <div class="view_container"
                 :style="menuIndex!=='/'?'border:solid thin #205BB5;border-left:none;border-right:none;':'border:none;'"
            >
                <el-row>
                    <el-col class="body-col" :span="24">
                        <div v-if="menuIndex==='/'">
                            <el-row>
                                <el-col :span="5" :offset="1">
                                    <div class="bodyRight">
                                        <img class="body-right-img"
                                             src="https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2wstp.png"
                                        >
                                    </div>
                                </el-col>
                                <el-col :offset="5" :span="13">
                                    <div class="view_container_content">
                                        <p style="font-size: 28px;">杂乱的工作界面也会影响心情鸭！</p>
                                        <p class="body-title">TDuck，化繁为简，给你最好的体验。</p>
                                        <p class="body-sloganEn">TDuck -So Easy。</p>
                                        <p class="body-detail">·超多表单组件供您选择</p>
                                        <p class="body-detail">·逻辑设置，让您的表单更灵活</p>
                                        <p class="body-detail"> ·Element UI，饿了么同款UI组建，表单也要美美哒</p>
                                        <p class="body-detail"> ·多样化数据统计；懂你，胜过另一半</p>
                                        <div style="width: 42px;" class="title-divider-line" />
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <el-divider />
                    </el-col>
                    <el-col class="body-col" :span="3" />
                </el-row>
            </div>
            <div class="view_container">
                <div class="view_container_content" style="padding: 100px 0;">
                    <el-row type="flex" align="middle">
                        <el-col :span="10" offset="5">
                            <p style="font-size: 28px;">TDuck - 填鸭表单</p>
                            <p class="body-title">社区版 / 开源版 / 企业部署 </p>
                            <p class="body-detail">Technology changes the world ——用技术改变世界</p>
                        </el-col>
                        <el-col :span="8">
                            <p class="body-detail"> ·人人都是我们的用户 </p>
                            <p class="body-detail">·基于Apache开源协议，开发者的福音</p>
                            <p class="body-detail">·成熟的技术支持，企业表单问卷系统解决方案</p>
                            <p class="body-detail">·更新速度快，总为您奉上不一样的惊喜</p>
                            <div style="width: 112px;" class="title-divider-line" />
                            <p style="font-size: 20px; font-weight: 550;">联系我们</p>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10" :offset="5">
                            <img style="height: 478px;"
                                 src="https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2wxu6.gif"
                            >
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="welcome-footer">
                <el-row>
                    <el-col :span="3" :offset="2">
                        <p class="title">关于我们</p>
                        <p class="subtitle" style="width: 182px;">
                            TDuck — 是一款能够帮助
                            你进行信息收集、市场开拓、
                            客户挖掘并展开持续营销活
                            动的管理平台。
                        </p>
                    </el-col>
                    <el-col :span="3">
                        <p class="title"> 项目地址</p>
                        <p class="subtitle">
                            码云
                        </p>
                        <p class="subtitle">
                            Gitee
                        </p>
                    </el-col>
                    <el-col :span="3">
                        <p class="title">  联系方式</p>
                        <p class="subtitle">
                            TDuckServer@tduckcloud.com
                        </p>
                        <p class="subtitle">
                            +86  15080929435
                        </p>
                    </el-col>
                    <el-col :span="3">
                        <p class="title">  友情地址</p>
                        <p class="subtitle">
                            Element UI
                        </p>
                    </el-col>
                    <el-col span="3" :offset="3">
                        <img style="width: 130px; height: 130px;" src="https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2x0aj.png">
                        <p class="title">微信公众号/关注我们</p>
                    </el-col>
                </el-row>
                <el-divider />
                <p class="subtitle" style="text-align: center;">
                    Copyright © 2020 TDuckCloud. All Rights Reserved.   湘ICP备19005498号-1    湖南省众达数蔚信息技术有限公司 版权所有
                </p>
            </div>
            <router-view />
        </div>
    </div>
</template>
<script>
import store from '@/store/index.js'

export default {
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
    computed: {
        getStore() {
            return store
        },
        isLogin() {
            return this.getStore.getters['token/isLogin']
        }
    },
    watch: {
        $route(to) {
            this.menuIndex = to.path
        }
    },
    mounted() {
        this.menuIndex = this.$route.path
    }
}
</script>
<style scoped>
.header-col,
.body-col {
    border: solid thin white;
}
.header-container {
    background-color: white;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 100;
}
.header-container .header-col .el-menu--horizontal {
    border: none;
}
.header-logo {
    float: left;
    cursor: pointer;
    height: 60px;
    padding: 25px 0 20px 0;
}
.menu-item {
    line-height: 110px;
    height: 110px;
    font-size: 18px;
    font-weight: 900;
    float: right;
}
.header-btn {
    margin: 35px 0 35px 20px;
    float: right;
}
.body-btn {
    margin: 30px 20px 0 0;
    font-size: 20px;
    padding-left: 20px;
    padding-right: 20px;
}
.header-btn,
.body-btn {
    color: #205bb5;
    border-color: #205bb5;
}
.primary {
    color: #fff;
    background-color: #205bb5;
}
.header-btn:focus,
.header-btn:hover,
.body-btn:focus,
.body-btn:hover {
    border-color: #205bb5;
    color: #205bb5;
}
.primary:focus,
.primary:hover {
    border-color: #205bb5;
    color: #fff;
}
.welcome-body {
    padding-top: 112px;
}
.view_container {
    margin: 0;
}
.view_container_content {
    padding: 200px 110px;
}
.view_container_content p {
    color: #205bb5;
}
.body-title {
    font-size: 35px;
    font-weight: 900;
    line-height: 25px;
    margin: 0 0 30px 0;
}
.body-slogan {
    font-size: 45px;
    font-weight: 900;
    line-height: 45px;
    margin: 0 0 5px 0;
}
.body-sloganEn {
    line-height: 15px;
    margin: 0 0 25px 0;
}
.body-detail {
    line-height: 15px;
    margin: 0 0 10px 0;
}
.body-sloganEn,
.body-detail {
    font-size: 15px;
}
.body-right-img {
    height: 665px;
    display: block;
}
.title-divider-line {
    height: 3px;
    line-height: 20px;
    background-color: rgba(32, 91, 181, 100);
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 100);
}
.welcome-footer {
    height: 300px;
    line-height: 20px;
    background-color: rgba(32, 91, 181, 100);
    text-align: center;
    border: 1px solid rgba(187, 187, 187, 100);
    padding: 69px 0 0 0;
}
.welcome-footer .title {
    color: rgba(255, 255, 255, 100);
    font-size: 20px;
    text-align: left;
}
.welcome-footer .subtitle {
    color: rgba(255, 255, 255, 100);
    font-size: 14px;
    text-align: left;
}
</style>
