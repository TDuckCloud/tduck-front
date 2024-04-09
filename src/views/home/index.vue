<template>
  <div class="home-container">
    <div class="header-container">
      <div>
        <img class="header-logo-img" src="~@/assets/images/logo-blue.png" @click="$router.push({ path: '/' })" />
      </div>
      <div class="right-header">
        <el-popover placement="bottom-end" trigger="click" width="150">
          <div class="user-person-menu">
            <div>
              <p v-if="getUserInfo" class="nick-name">
                {{ getUserInfo.name }}
              </p>
            </div>
            <el-divider />
            <div>
              <p class="person-menu-item" @click="$router.push({ path: '/home/member' })">
                <font-icon class="fab fa-get-pocket" />
                我的账户
              </p>
              <el-divider />
              <p class="person-menu-item" @click="logoutHandle">
                <font-icon class="fas fa-sign-out" />
                退出登录
              </p>
            </div>
          </div>
          <div slot="reference">
            <img v-if="getUserInfo" :src="getUserInfo.avatar" class="user-avatar" />
          </div>
        </el-popover>
      </div>
    </div>
    <div class="content-container">
      <div class="menu-box">
        <div class="menu-view">
          <div
            v-for="menu in menuList"
            v-show="!menu.admin || (menu.admin && getUserInfo && getUserInfo.admin)"
            :key="menu.route"
            :class="defaultActiveMenu === menu.route ? 'menu-item-active menu-item' : 'menu-item'"
            @click="menuClickHandle(menu)"
          >
            <font-icon :class="menu.icon" />
            <span>{{ menu.name }}</span>
          </div>
        </div>
      </div>
      <div class="view-container">
        <router-view />
        <el-footer>
          <div class="about-container">
            <span class="desc-text"><a href="https://www.tduckcloud.com" target="view_window">TDUCK官网</a></span>
          </div>
        </el-footer>
      </div>
    </div>
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
          name: '共享模板',
          icon: 'fa-caret-square-o-up'
        },
        {
          route: '/manage/user',
          name: '用户管理',
          icon: 'fa-user',
          admin: true
        },
        {
          route: '/manage/system',
          name: '系统配置',
          icon: 'el-icon-s-tools',
          admin: true
        },
        {
          route: '/project/template/category',
          name: '模板分类',
          icon: 'el-icon-bank-card',
          admin: true
        },
        {
          route: '/project/theme/index',
          name: '主题列表',
          icon: 'el-icon-view',
          admin: true
        },
        {
          route: '/project/theme/category',
          name: '主题分类',
          icon: 'el-icon-edit',
          admin: true
        },
        {
          route: '/project/recycle',
          name: '回收中心',
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
      try {
        return JSON.parse(this.getStore.getters['user/userInfo'])
      } catch (e) {
        return {}
      }
    }
  },
  created() {
    let user = this.getStore.getters['user/userInfo'] || {}
    const isAdmin = user.admin
    if (isAdmin) {
      this.menuList.push(
        {
          route: '/manage/user',
          name: '用户管理',
          icon: 'fa-user'
        },
        {
          route: '/manage/system',
          name: '系统配置',
          icon: 'fa-arrow-circle-up'
        }
      )
    }
    if (!user) {
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
    console.log(user)
  },
  methods: {
    menuClickHandle(menu) {
      this.$router.replace({ path: menu.route })
    },
    createBlankTemplate() {
      createFormRequest({
        description: '快来填写你的问卷描述吧',
        type: 'ORDINARY',
        name: '问卷名称'
      }).then((res) => {
        this.$router.push({
          path: '/project/form',
          query: { key: res.data.formKey }
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
              path: '/login'
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
  height: 100%;
  width: 100%;
  flex-direction: column;
}

.content-container {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;

  .view-container {
    flex-direction: column;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}

.header-container {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  height: 45px;
  line-height: 45px;
  border-bottom: 1px solid #dcdfe6;
  min-width: 1024px;

  .header-logo-img {
    width: 100px;
    float: left;
    margin-top: 5px;
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

.menu-box {
  min-width: 12%;
  display: flex;
  padding: 5px;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 100);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .menu-view {
    flex: 1;
    padding: 20px;
    text-align: center;

    .menu-item-active {
      color: #ffffff !important;
      background-color: $menuActiveText;
    }

    .menu-item {
      color: #333;
      font-size: 16px;
      line-height: 20px;
      padding: 5px 15px;
      margin-top: 15px;
      border-radius: 5px;
      text-align: center;

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
