<template>
    <div class="form-index-container">
        <el-card class="header-container">
            <el-row align="middle" type="flex">
                <el-col :offset="1" :span="1">
                    <i class="el-icon-back" />
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
                <el-col :span="1">
                    <el-button plain type="primary">主题</el-button>
                </el-col>
                <el-col :span="1">
                    <el-button plain type="success">设置</el-button>
                </el-col>
                <el-col :span="1">
                    <el-button plain type="info">逻辑</el-button>
                </el-col>
                <el-col :span="1">
                    <el-button plain type="warning">统计</el-button>
                </el-col>
            </el-row>
        </el-card>
        <div class="main-container">
            <div class="left-menu-container">
                <el-menu :collapse="isCollapse" class="el-menu-vertical" :router="true" default-active="editor">
                    <el-menu-item index="editor">
                        <i class="el-icon-edit" />
                        <span slot="title">编辑</span>
                    </el-menu-item>
                    <el-menu-item index="logic">
                        <i class="el-icon-menu" />
                        <span slot="title">逻辑</span>
                    </el-menu-item>
                    <el-menu-item index="preview">
                        <i class="el-icon-view" />
                        <span slot="title">预览</span>
                    </el-menu-item>
                    <el-menu-item index="setting">
                        <i class="el-icon-video-play" />
                        <span slot="title">发布</span>
                    </el-menu-item>
                    <el-menu-item index="setting">
                        <i class="el-icon-setting" />
                        <span slot="title">设置</span>
                    </el-menu-item>
                    <el-menu-item index="statistics">
                        <i class="el-icon-data-line" />
                        <span slot="title">统计</span>
                    </el-menu-item>
                </el-menu>
                <i v-if="!isCollapse" class="el-icon-d-arrow-left" @click="isCollapse=!isCollapse" />
                <i v-else class="el-icon-d-arrow-right" @click="isCollapse=!isCollapse" />
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
            isCollapse: false
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
