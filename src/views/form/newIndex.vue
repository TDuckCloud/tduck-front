<template>
    <div class="form-index-container">
        <el-card class="header-container">
            <el-row type="flex" align="middle">
                <el-col :span="1" :offset="1">
                    <i class="el-icon-back" />
                </el-col>
                <el-col :span="3">
                    <img src="@/assets/images/indexLogo.png" class="header-logo" @click="$router.push({path:'/home'})">
                </el-col>
                <el-col :span="1">
                    <el-button type="primary">编辑</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="success">保存为模板</el-button>
                </el-col>
                <el-col :span="1">
                    <el-button type="primary" plain>主题</el-button>
                </el-col>
                <el-col :span="1">
                    <el-button type="success" plain>设置</el-button>
                </el-col>
                <el-col :span="1">
                    <el-button type="info" plain>逻辑</el-button>
                </el-col>
                <el-col :span="1">
                    <el-button type="warning" plain>统计</el-button>
                </el-col>
            </el-row>
        </el-card>
        <div class="main-container">
            <router-view />
        </div>
    </div>
</template>

<script>
export default {
    name: 'NewIndex',
    components: {
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
.header-container {
    width: 100%;
    height: 60px;
    .el-icon-back {
        font-size: 22px;
        font-weight: 550;
        color: #000;
    }
    .header-logo {
        height: 60px;
        width: 200px;
    }
}
.main-container {
    width: 100vw;
    height: calc(100vh - 60px);
}
</style>
