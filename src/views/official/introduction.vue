<template>
    <div class="introduction">
        <div class="introduction-body">
            <div class="view-container">
                <div class="view-container-content">
                    <el-row type="flex" justify="center" align="middle">
                        <el-col :span="10" :offset="1">
                            <div class="view-container-content">
                                <p class="body-title">TDuck - 填鸭表单</p>
                                <p class="body-slogan">有你所想，有你所得。</p>
                                <p class="body-sloganEn">TDuck - Have what you want, get you income.</p>
                                <p class="body-detail">TDuck填鸭，是一款在线制作表单的应用工具，通过填鸭表单可以收集任何你想得到的信息。</p>
                                <p class="body-detail">简单易用，灵活的反馈数据筛选；统计图表一目了然</p>
                                <div>
                                    <el-button class="body-btn primary" type="primary"
                                               @click="$router.push({path:'/login'})"
                                    >
                                        免费使用
                                    </el-button>
                                    <el-button class="body-btn">在线体验</el-button>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div>
                                <img class="body-right-img"
                                     src="@/assets/images/official/v2_q2woer.png"
                                >
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <el-divider />
            <div class="view-container">
                <div class="view-container-content">
                    <el-row type="flex" justify="center" align="middle">
                        <el-col :span="10" :offset="1">
                            <div>
                                <img class="body-right-img"
                                     src="@/assets/images/official/v2_q2wstp.png"
                                >
                            </div>
                        </el-col>
                        <el-col :offset="1" :span="12">
                            <div>
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
            </div>
            <el-divider />
            <div class="view-container">
                <div class="view-container-content" style="width: 80%;">
                    <el-row type="flex" align="middle">
                        <el-col :span="10" :offset="5">
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
                </div>
                <div>
                    <img style="height: 478px;"
                         src="@/assets/images/official/v2_q2wxu6.gif"
                    >
                </div>
            </div>
            <div class="introduction-footer">
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
                            <svg-icon name="gitee" style="width: 14px; height: 14px;" />
                            码云
                        </p>
                        <p class="subtitle">
                            <svg-icon name="github" style="width: 12px; height: 12px;" />
                            Gitee
                        </p>
                    </el-col>
                    <el-col :span="4">
                        <p class="title"> 联系方式</p>
                        <p class="subtitle">
                            <i class="el-icon-message" />
                            TDuckServer@tduckcloud.com
                        </p>
                        <p class="subtitle">
                            <i class="el-icon-phone" /> +86 15080929435
                        </p>
                    </el-col>
                    <el-col :span="3">
                        <p class="title"> 友情地址</p>
                        <p class="subtitle">
                            <a href="https://element.eleme.cn/#/zh-CN/" target="_blank">Element UI</a>
                        </p>
                        <p class="subtitle">
                            <a href="https://gitee.com/mrhj/form-generator" target="_blank"> form-generator</a>
                        </p>
                    </el-col>
                    <el-col :span="3" :offset="3">
                        <img style="width: 130px; height: 130px;"
                             src="https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2x0aj.png"
                        >
                        <p class="title">微信公众号/关注我们</p>
                    </el-col>
                </el-row>
                <el-divider />
                <div class="copyright">
                    <a target="_blank" href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral">
                        <img
                            style="height: 30px;"
                            src="http://tduck.test.upcdn.net/%E5%8F%88%E6%8B%8D%E4%BA%91_logo2.png"
                        >
                    </a>
                    <p class="subtitle" style="text-align: center;">
                        本站由 又拍云 提供CDN加速/云储存服务
                    </p>
                    <p class="subtitle" style="text-align: center;">
                        Copyright © 2021 TDuckCloud. All Rights Reserved. 湘ICP备19005498号-1  版权所有
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    data() {
        return {}
    },
    computed: {},
    watch: {},
    mounted() {
    }
}
</script>
<style scoped>
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
.introduction {
    background: url('~@/assets/images/official/offcial-bg01.png') repeat-x;
}
.introduction-body {
    /* padding-top: 112px; */
}
.view-container {
    height: 800px;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    justify-items: center;
    flex-direction: column;
}
.view-container-content {
    background-color: transparent;
}
.view-container-content p {
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
    /* height: 665px; */
    width: 100%;
    height: 100%;
}
.title-divider-line {
    height: 3px;
    line-height: 20px;
    background-color: rgba(32, 91, 181, 100);
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 100);
}
.introduction-footer {
    height: 420px;
    line-height: 20px;
    background-color: rgba(32, 91, 181, 100);
    text-align: center;
    border: 1px solid rgba(187, 187, 187, 100);
    padding: 69px 0 0 0;
}
.introduction-footer .title {
    color: rgba(255, 255, 255, 100);
    font-size: 20px;
    text-align: left;
}
.introduction-footer .subtitle {
    color: rgba(255, 255, 255, 100);
    font-size: 14px;
    text-align: left;
}
.copyright {
    height: 95px;
}
</style>
