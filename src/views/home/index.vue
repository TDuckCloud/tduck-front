<template>
    <div>
        <el-container class="home-container">
            <el-header class="header-container" height="38">
                <div>
                    <img
                        class="header-logo-img"
                        src="https://demo.tduckapp.com/img/indexLogo.efc52fa3.svg"
                        @click="$router.push({ path: '/' })"
                    >
                </div>
                <div class="right-header">
                    <!--                    <el-link href="https://www.tduckcloud.com" target="_blank">
                        了解TDUCK企业版
                    </el-link>-->
                    <el-popover
                        placement="bottom-end"
                        trigger="click"
                        width="150"
                    >
                        <div class="user-person-menu">
                            <div>
                                <p v-if="getUserInfo" class="nick-name">
                                    {{ getUserInfo.name }}
                                </p>
                            </div>
                            <el-divider />
                            <div>
                                <p
                                    class="person-menu-item"
                                    @click="
                                        $router.push({ path: '/home/member' })
                                    "
                                >
                                    <font-icon class="fab fa-get-pocket" />
                                    我的账户
                                </p>
                                <el-divider />
                                <p
                                    class="person-menu-item"
                                    @click="logoutHandle"
                                >
                                    <font-icon class="fas fa-sign-out" />
                                    退出登录
                                </p>
                            </div>
                        </div>
                        <div slot="reference">
                            <img
                                v-if="getUserInfo"
                                :src="getUserInfo.avatar"
                                class="user-avatar"
                            >
                        </div>
                    </el-popover>
                </div>
            </el-header>
            <el-container class="content-container">
                <el-aside width="280px">
                    <el-card class="menu-box">
                        <el-button type="primary" @click="createBlankTemplate">
                            新建项目
                        </el-button>
                        <div class="menu-view">
                            <div
                                v-for="menu in menuList"
                                :key="menu.route"
                                :class="
                                    defaultActiveMenu == menu.route
                                        ? 'menu-item-active menu-item'
                                        : 'menu-item'
                                "
                                @click="menuClickHandle(menu)"
                            >
                                <font-icon :class="menu.icon" />
                                <span>{{ menu.name }}</span>
                            </div>
                        </div>
                    </el-card>
                </el-aside>
                <el-container class="scroll-container">
                    <el-container class="view-container">
                        <el-main>
                            <router-view />
                            <el-footer>
                                <div class="about-container">
                                    <span class="desc-text"><a
                                        href="https://www.tduckcloud.com"
                                        target="view_window"
                                    >TDUCK官网</a></span>
                                </div>
                            </el-footer>
                        </el-main>
                    </el-container>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import store from '@/store'
import router from '@/router'
import { createFormRequest } from '@/api/project/form'

export default {
    name: 'NewIndex',
    components: {},
    data() {
        return {
            defaultActiveMenu: '/home',
            menuList: [
                {
                    route: '/home',
                    name: '我的项目',
                    icon: 'fa-pencil-square'
                },
                {
                    route: '/project/template',
                    name: '模板中心',
                    icon: 'fa-caret-square-o-up'
                },
                {
                    route: '/project/recycle',
                    name: '回收站',
                    icon: 'fa-trash'
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
            return user
        }
    },
    created() {
        if (!this.getStore.getters['user/userInfo']) {
            this.$router.push({
                path: '/login',
                query: {
                    redirect: router.currentRoute.fullPath
                }
            })
        } else if (this.$route.path == '/') {
            // 将主路由 / 重定向到首页
            this.$router.push({ path: this.menuList[0].route })
        }

        if (this.$route.path) {
            this.defaultActiveMenu = this.$route.path
        }
    },
    methods: {
        menuClickHandle(menu) {
            this.$router.replace({ path: menu.route })
        },
        createBlankTemplate() {
            createFormRequest({
                description: '快来填写你的问卷描述吧',
                name: '问卷名称'
            }).then(res => {
                this.$router.push({
                    path: '/project/form',
                    query: { key: res.data }
                })
            })
        },
        logoutHandle() {
            this.$confirm('您确定要退出登录吗？', '退出确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$store.dispatch('user/logout').then(() => {
                        router.push({
                            path: '/login',
                            query: {
                                redirect: router.currentRoute.fullPath
                            }
                        })
                    })
                })
                .catch(() => {})
        }
    }
}
</script>

<style lang="scss" scoped>
$menuActiveText: #409eff;

.home-container {
    background-color: rgba(247, 247, 247, 90);
    display: flex;
    height: 100vh;
    width: 100%;
    flex-direction: column;
}

.content-container {
    height: calc(100vh - 38px);
    overflow: hidden;

    .view-container {
        flex-direction: column;
    }
}

.header-container {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    line-height: 38px;
    min-width: 1024px;
    .header-logo-img {
        width: 120px;
        height: 45px;
        float: left;
        margin-left: 55px;
    }
    .right-header {
        display: flex;
        flex-direction: row;
        > * {
            margin: 0 20px;
        }
    }
    .user-avatar {
        width: 35px;
        height: 35px;
        border-radius: 100px;
        cursor: pointer;
        vertical-align: middle;
    }
}

.menu-view {
    flex: 1;
    margin-top: 20px;
    background-color: rgba(255, 255, 255, 100);
    padding: 20px;
    text-align: center;

    .menu-item-active {
        color: $menuActiveText !important;
    }
    .menu-item {
        color: #333;
        font-size: 16px;
        text-align: left;
        line-height: 35px;
        &:hover {
            cursor: pointer;
            color: $menuActiveText;
        }
        & .fas:hover {
            color: $menuActiveText;
        }
        .fas {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin: 5px;
        }
        span {
            margin-left: 10px;
        }
    }
}
.banner-container {
    height: 60px;
}
.el-aside {
    padding: 0;
    margin: 0;
    .el-card {
        height: 100%;
        ::v-deep .el-card__body {
            height: 100%;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
        }
        .el-button {
            width: 80%;
            margin-top: 20px;
        }
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
        &:hover {
            cursor: pointer;
            color: $menuActiveText;
        }
    }
    .el-divider {
        margin: 5px 0;
    }
    .person-menu-divider {
        background-color: rgba(210, 210, 210, 78);
        border: 1px solid rgba(210, 210, 210, 78);
    }
}
.about-container {
    text-align: center;
    .fa-user {
        font-size: 19px;
        color: rgba(172, 172, 172, 100);
        margin: 1px;
    }
}
</style>
