<template>
    <div class="official-container">
        <div class="header-container">
            <el-row type="flex" align="middle">
                <el-col class="header-col" :span="3" :offset="2">
                    <div>
                        <img src="@/assets/images/indexLogo.png" class="header-logo"
                             @click="$router.push({path:'/home'})"
                        >
                    </div>
                </el-col>
                <el-col class="header-col" :span="12" :offset="2">
                    <el-menu :default-active="menuIndex" mode="horizontal"
                             style="width: 100%;"
                             text-color="#205BB5"
                             active-text-color="#205BB5"
                             @select="activeMenuHandle"
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
                    <el-button v-if="!isLogin&&this.$route.path!='/login' " class="header-btn"
                               @click="$router.push({path:'/login'})"
                    >
                        登 录
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <div class="main-container">
            <router-view />
        </div>
    </div>
</template>
<script>
import store from '@/store/index.js'
import {checkIsUrl, openUrl} from '@/utils'

export default {
    name: 'Official',
    data() {
        return {
            menuIndex: null,
            menuRouters: [
                {
                    routerPath: '/',
                    title: '首页'
                },
                {
                    routerPath: 'https://gitee.com/TDuckApp/tduck-platform/issues',
                    title: '提出建议'
                },
                {
                    routerPath: 'https://gitee.com/TDuckApp/tduck-platform?time=2',
                    title: '开源版本'
                }
            ]
        }
    },
    computed: {
        getStore() {
            return store
        },
        isLogin() {
            return this.getStore.getters['user/isLogin']
        }
    },
    watch: {
        $route(to) {
            this.menuIndex = to.path
        }
    },
    mounted() {
        this.menuIndex = this.$route.path
    }, methods: {
        activeMenuHandle(routerPath) {
            if (checkIsUrl(routerPath)) {
                openUrl(routerPath)
            } else {
                this.menuIndex = routerPath
            }
        }
    }
}
</script>
<style scoped>
.official-container {
    height: 100%;
    width: 100%;
    margin: 0;
}
.header-container {
    background-color: white;
    width: 100%;
    min-width: 960px;
    top: 0;
    z-index: 100;
}
.main-container {
    height: calc(100vh - 102px);
}
.header-container .header-col .el-menu--horizontal {
    border: none;
}
.header-logo {
    cursor: pointer;
    height: 60px;
    float: left;
}
.menu-item {
    line-height: 90px;
    height: 90px;
    font-size: 18px;
    font-weight: 900;
}
.header-btn {
    margin: 35px 0 35px 20px;
    float: right;
    color: #205bb5;
    border-color: #205bb5;
}
.header-btn:focus,
.header-btn:hover {
    border-color: #205bb5;
    color: #205bb5;
}
.view_container_content p {
    color: #205bb5;
}
</style>
