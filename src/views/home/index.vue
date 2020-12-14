<template>
    <div>
        <el-container>
            <el-header height="92" class="home-header-view">
                <el-row type="flex" align="middle">
                    <el-col :span="4" :offset="1">
                        <img src="@/assets/images/indexLogo.png" class="header-logo-img"
                             @click="$router.push({path:'/'})"
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
                        <el-popover
                            placement="bottom-end"
                            width="200"
                            trigger="click"
                        >
                            <div class="user-person-menu">
                                <div>
                                    <p v-if="getUserInfo" class="nick-name">{{ getUserInfo.name }}</p>
                                </div>
                                <div class="person-menu-divider" />
                                <div>
                                    <p class="person-menu-item">
                                        <font-icon class="fab fa-get-pocket" />
                                        我的账户
                                    </p>
                                    <p class="person-menu-item">
                                        <font-icon class="fas fa-envelope" />
                                        站内信
                                    </p>
                                    <p class="person-menu-item">
                                        <font-icon class="fas fa-user-circle" />
                                        联系人
                                    </p>
                                    <div class="person-menu-divider" />
                                    <p class="person-menu-item" @click="logoutHandle">
                                        <font-icon class="fas fa-sign-out" />
                                        退出登录
                                    </p>
                                </div>
                            </div>
                            <div slot="reference" style="display: flex; align-items: center; justify-content: center;">
                                <img v-if="getUserInfo" :src="getUserInfo.avatar" class="user-avatar">
                            </div>
                        </el-popover>
                    </el-col>
                </el-row>
            </el-header>
            <el-main class="home-main-view">
                <router-view />
            </el-main>
        </el-container>
    </div>
</template>
<script>
import store from '@/store/index.js'
import FontIcon from '@/components/FontIcon'
import router from '@/router'

export default {
    name: 'Home',
    components: {FontIcon},
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
            let user = JSON.parse(this.getStore.getters['user/userInfo'])
            if (!user) {
                this.logoutHandle()
            }
            return user
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
        },
        logoutHandle() {
            this.$store.dispatch('user/logout').then(() => {
                router.push({
                    path: '/login',
                    query: {
                        redirect: router.currentRoute.fullPath
                    }
                })
            })
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
    line-height: 92px;
    height: 92px;
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
.user-person-menu {
    .nick-name {
        height: 16px;
        color: rgba(70, 70, 70, 86);
        font-size: 14px;
        line-height: 16px;
        text-align: left;
    }
    .person-menu-item {
        color: rgba(70, 70, 70, 86);
        font-size: 14px;
        text-align: left;
    }
    .person-menu-item:hover {
        cursor: pointer;
    }
    .person-menu-divider {
        background-color: rgba(210, 210, 210, 78);
        border: 1px solid rgba(210, 210, 210, 78);
    }
}
.user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 100px;
    cursor: pointer;
}
.home-main-view {
    height: calc(100vh - 92px);
    background-color: #f7f7f7;
    padding: 0;
}
</style>
