<template>
    <el-container>
        <el-header height="107px" class="homeHeaderView">
            <el-row type="flex" align="middle">
                <el-col :span="3" :offset="2">
                    <img src="@/assets/images/indexLogo.png" class="headerLogoImg"
                         @click="$router.push({path:'/project/create'})"
                    >
                </el-col>
                <el-col :span="5">
                    <el-menu :default-active="menuIndex" mode="horizontal" :router="true" text-color="#205BB5"
                             active-text-color="#205BB5"
                    >
                        <el-menu-item v-for="(item, index) in menuRouters" :key="index" :index="item.routerPath"
                                      :route="item.routerPath" class="menuItem"
                        >
                            {{ item.title }}
                        </el-menu-item>
                    </el-menu>
                </el-col>
                <el-col :offset="8" :span="1">
                    <el-button round>升级</el-button>
                </el-col>
                <el-col :span="1">
                    <svg-icon name="loginWx" style="width: 24px; height: 24px;" />
                </el-col>
                <el-col :span="1">
                    <el-link href="https://element.eleme.io" target="_blank">帮助</el-link>
                </el-col>
                <el-col :span="3">
                    <img :src="getUserInfo.avatar" style="width: 68px; height: 68px; border-radius: 100px;">
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <!--      轮播·1-->
            <el-row>
                <el-col :span="24">
                    <el-carousel height="55px">
                        <el-carousel-item v-for="item in 2" :key="item">
                            <img style="height: 55px; width: 100%;"
                                 src="https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c4aj.png"
                            >
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
            <router-view />
        </el-main>
    </el-container>
</template>
<script>
import store from '@/store/index.js'

export default {
    name: 'Home',
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
                    title: '开源项目'
                },
                {
                    routerPath: '/enterprise',
                    title: '提出建议'
                }
            ]
        }
    },
    computed: {
        getStore() {
            return store
        },
        getUserInfo() {
            return JSON.parse(this.getStore.getters['user/userInfo'])
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
.menuItem {
    line-height: 110px;
    height: 110px;
    font-size: 20px;
    text-align: left;
    font-weight: 550;
    float: right;
}
.el-menu.el-menu--horizontal {
    border-bottom: none;
}
.homeHeaderView {
    height: 117px;
    line-height: 20px;
    background-color: rgba(255, 255, 255, 100);
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    text-align: center;
}
.headerLogoImg {
    width: 245px;
    height: 72px;
}

</style>
