<template>
    <div id="home">
        <div class="headerDiv">
            <el-row>
                <el-col class="headerCol" :span="3"></el-col>
                <el-col class="headerCol" :span="18">
                    <el-menu :default-active="menuIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" text-color="#767677" active-text-color="#1d499e">
                        <div class="headerLogoDiv">
                            <img src="favicon.ico" class="headerLogo"/>
                            <span class="headerLogoTitle">TDUCK CLOUD</span>
                        </div>
                        <el-menu-item  v-for="(item, index) in menuRouters" :key="index" :index="item.routerPath" :route="item.routerPath" class="menuItem">{{item.title}}</el-menu-item>
                        <el-button class="consoleBtn" @click="$router.push({path:'/console'})">控 制 台</el-button>
                    </el-menu>
                </el-col>
                <el-col class="headerCol" :span="3"></el-col>
            </el-row>
        </div>
        <div class="headerBody">
            <div class="indexBody">
                <el-row>
                    <el-col class="bodyCol" :span="3"></el-col>
                    <el-col class="bodyCol" :span="18">
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
export default {
    data() {
        return {
            menuIndex: null,
            menuRouters: [
                {
                    routerPath: 'enterprise',
                    title: '企业部署'
                },
                {
                    routerPath: 'sources',
                    title: '开源版本'
                },
                {
                    routerPath: 'proposal',
                    title: '提出建议'
                }
            ]
        }
    },
    methods: {
        handleSelect(index, indexPath) {
            this.$router.push({ path: '/' + indexPath });
        }
    },
    mounted() {
        this.menuIndex = this.$route.path.substring(1);
    },
    watch: {
        $route(to,from) {
            this.menuIndex = to.path.substring(1);
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
    border-bottom: solid thin #E6E6E6;
}
.headerDiv .headerCol .el-menu--horizontal {
    border: none;
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
    color: #1d499e;
}
.headerBody {
    padding-top: 113px;
}
.footerDiv {
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
