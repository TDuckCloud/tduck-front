<template>
    <div>
        <div class="header-container">
            <el-row type="flex" align="middle">
                <el-col class="header-col" :span="3" :offset="3">
                    <div>
                        <img src="@/assets/images/indexLogo.png" class="header-logo"
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
                    <el-button v-if="!isLogin&&this.$route.path!='/login' " class="header-btn" @click="$router.push({path:'/login'})">登 录</el-button>
                </el-col>
            </el-row>
        </div>
        <el-row>
            <router-view />
        </el-row>
    </div>
</template>
<script>
import store from '@/store/index.js'

export default {
    name: 'Official',
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
    }
}
</script>
<style scoped>
.header-container {
    background-color: white;
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
}
.menu-item {
    line-height: 90px;
    height: 90px;
    font-size: 18px;
    font-weight: 900;
    float: right;
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
