<template>
    <el-container>
        <el-header height="80" class="home-header-view">
            <el-row type="flex" align="middle">
                <el-col :span="4" :offset="1">
                    <img src="@/assets/images/indexLogo.png" class="header-logo-img"
                         @click="$router.push({path:'/project/create'})"
                    >
                </el-col>
                <el-col :span="10">
                    <el-menu :default-active="menuIndex" mode="horizontal" :router="true" text-color="#205BB5"
                             active-text-color="#205BB5"
                    >
                        <el-menu-item v-for="(item, index) in menuRouters" :key="index" :index="item.routerPath"
                                      :route="item.routerPath" class="menu-item"
                        >
                            {{ item.title }}
                        </el-menu-item>
                    </el-menu>
                    <!--                    <span v-for="(item, index) in menuRouters" :key="index"-->
                    <!--                          class="menu-item"-->
                    <!--                          @click="activeMenuHandle(item.routerPath)"-->
                    <!--                    >-->
                    <!--                        {{ item.title }}-->
                    <!--                    </span>-->
                </el-col>
                <el-col :span="1">
                    <el-button round>升级</el-button>
                </el-col>
                <el-col :span="1">
                    <div style="display: flex; align-items: center; justify-content: center;">
                        <svg-icon name="loginWx" style="width: 24px; height: 24px;" />
                    </div>
                </el-col>
                <el-col :span="1">
                    <el-link href="https://element.eleme.io" target="_blank">帮助</el-link>
                </el-col>
                <el-col :span="3">
                    <div style="display: flex; align-items: center; justify-content: center;">
                        <img :src="getUserInfo.avatar" style="width: 50px; height: 50px; border-radius: 100px;">
                    </div>
                </el-col>
            </el-row>
        </el-header>
        <el-main style="padding: 2px;">
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
                    title: '免费模板'
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
    },
    methods: {
        activeMenuHandle(routerPath) {
            this.menuIndex = routerPath
        }
    }
}
</script>
<style lang="scss" scoped>
.menu-item {
    line-height: 80px;
    height: 80px;
    text-align: left;
    font-weight: 550;
    color: rgba(32, 91, 181, 100);
    font-size: 20px;
    &:hover {
        cursor: pointer;
    }
}
.el-menu.el-menu--horizontal {
    border-bottom: none;
}
.home-header-view {
    line-height: 90px;
    height: 80px;
    background-color: rgba(255, 255, 255, 100);
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    text-align: center;
    .header-logo-img {
        width: 225px;
        height: 62px;
        float: left;
    }
}

</style>
