<template>
    <div id="home">
        <div class="headerDiv">
            <el-row>
                <el-col class="headerCol" :span="3"></el-col>
                <el-col class="headerCol" :span="18">
                    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect()" text-color="#767677" active-text-color="#1d499e">
                        <div class="headerLogoDiv">
                            <img src="favicon.ico" class="headerLogo"/>
                            <span class="headerLogoTitle">TDUCK CLOUD</span>
                        </div>
                        <el-menu-item index="enterprise" class="menuItem">企业部署</el-menu-item>
                        <el-menu-item index="source" class="menuItem">开源版本</el-menu-item>
                        <el-menu-item index="proposal" class="menuItem">提出建议</el-menu-item>
                        <el-button class="consoleBtn">控 制 台</el-button>
                    </el-menu>
                </el-col>
                <el-col class="headerCol" :span="3"></el-col>
            </el-row>
        </div>
        <div class="headerBody">
            <div class="indexBody">
                <router-view></router-view>
            </div>
            <div class="footerDiv">
                关于我们
            </div>
        </div>
    </div>
</template>
<script>
import store from '@/store/index.js'
export default {
    computed: {
        getStore() {
            return store;
        }
    },
    data() {
        return {
            activeIndex: null
        }
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        }
    },
    mounted() {
        console.info(this.getStore);
    }
}
</script>
<style scoped>
.headerCol {
    border: solid thin white;
}
.headerDiv {
    background-color: white;
    position: fixed;
    width: 100%;
    top: 0px;
}
.headerLogo {
    float: left;
}
.headerLogoTitle {
    float: left;
    color: #1d499e;
    font-size: 25px;
    line-height: 110px;
    padding: 0px 15px 0px 15px;
}
.headerLogo {
    height: 60px;
    padding: 25px 0px 20px 0px;
}
.menuItem {
    line-height: 110px;
    height: 110px;
    font-size: 18px;
}
.consoleBtn {
    font-size: 16px;
    width: 130px;
    margin: 35px 0px 35px 0px;
    float: right;
    color: #767677;
}
.consoleBtn:focus, .consoleBtn:hover {
    border-color: #1d499e;
}
.headerBody {
    padding-top: 113px;
}
.footerDiv {
    border: solid thin black;
    font-size: 14px;
    color: white;
    text-align: center;
    line-height: 110px;
}
.indexBody {
    background-color: white;
    margin: 50px 0px 0px 0px;
}
</style>
