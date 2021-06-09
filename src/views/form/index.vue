<template>
    <div class="form-index-container">
        <el-card class="header-container">
            <el-row align="middle" type="flex">
                <el-col :span="2">
                    <i class="el-icon-back" @click="$router.back(-1)" />
                </el-col>
                <el-col :span="3">
                    <img class="header-logo" src="@/assets/images/indexLogo.png" @click="$router.push({path:'/home'})">
                </el-col>
                <el-col :span="1">
                    <el-button type="primary">编辑</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="success">保存为模板</el-button>
                </el-col>
            </el-row>
        </el-card>
        <div class="main-container">
            <div class="left-menu-container">
                <el-menu :collapse="isCollapse" class="el-menu-vertical"
                         :default-active="defaultActiveMenu"
                         @select="menuSelectHandle"
                >
                    <el-menu-item v-for="menuItem in menuItemList" :key="menuItem.route" :index="menuItem.route">
                        <i :class="menuItem.icon" />
                        <span slot="title">{{ menuItem.title }}</span>
                    </el-menu-item>
                </el-menu>
                <i v-if="!isCollapse" class="el-icon-d-arrow-left" @click="collapseHandle" />
                <i v-else class="el-icon-d-arrow-right" @click="collapseHandle" />
            </div>
            <div class="right-content-container">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NewIndex',
    components: {},
    data() {
        return {
            defaultActiveMenu: 'editor',
            projectKey: null,
            isCollapse: false,
            menuItemList: [
                {
                    title: '编辑',
                    icon: 'el-icon-edit',
                    route: '/project/form/editor'
                },
                {
                    title: '逻辑',
                    icon: 'el-icon-menu',
                    route: '/project/form/logic'
                }, {
                    title: '外观',
                    icon: 'el-icon-view',
                    route: '/project/form/theme'
                },
                {
                    title: '设置',
                    icon: 'el-icon-setting',
                    route: '/project/form/setting'
                },
                {
                    title: '发布',
                    icon: 'el-icon-video-play',
                    route: '/project/form/publish'
                }, {
                    title: '统计',
                    icon: 'el-icon-data-line',
                    route: '/project/form/statistics'
                }
            ]
        }
    },
    created() {
        this.projectKey = this.$route.query.key
        this.defaultActiveMenu = this.$route.path
        this.isCollapse = this.$store.state.form.isCollapse
    },
    methods: {
        menuSelectHandle(index) {
            this.$router.replace({path: index, query: {key: this.projectKey}})
        },
        collapseHandle() {
            let isCollapse = !this.isCollapse
            this.$store.dispatch('form/setIsCollapse', isCollapse).then(() => {
                this.isCollapse = isCollapse
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.form-index-container {
  height: 100%;
  width: 100%;
}

::v-deep .el-card__body {
  padding: 0;
}

::v-deep .el-menu {
  border: none;
  background-color: transparent;
}

.header-container {
  width: 100%;
  height: 60px;

  .el-icon-back {
    font-size: 22px;
    font-weight: 550;
    cursor: pointer;
    color: #000;
    margin-left: 40px;

    &:hover {
      color: rgb(32, 160, 255);
    }
  }

  .header-logo {
    height: 60px;
    width: 200px;
  }
}

.main-container {
  width: 100vw;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: row;

  .right-content-container {
    width: calc(100vw - 100px);
    height: calc(100vh - 60px);
    overflow-x: hidden;
  }
}

.left-menu-container {
  max-width: 100px;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: solid 1px #e6e6e6;

  .el-menu-vertical:not(.el-menu--collapse) {
    width: 100px;
    min-height: 400px;
  }

  .el-icon-d-arrow-left,
  .el-icon-d-arrow-right {
    font-size: 19px;
    cursor: pointer;
    font-weight: 550;
    color: #000;
    margin-bottom: 100px;

    &:hover {
      color: rgb(32, 160, 255);
    }
  }
}

</style>
