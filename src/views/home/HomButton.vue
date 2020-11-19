<template>
    <el-row>
        <el-col :offset="2" :span="5">
            <el-button class="home-fun-btn" @click="$router.push({path:'/project/create'})">
                新建项目 <i class="el-icon-plus" />
            </el-button>
        </el-col>
        <el-col :span="5">
            <el-button class="home-fun-btn">我的项目<i class="el-icon-s-custom" /></el-button>
        </el-col>
        <el-col :span="5">
            <el-button class="home-fun-btn">行业模板<i class="el-icon-s-management" /></el-button>
        </el-col>
        <el-col :span="5">
            <el-button class="home-fun-btn">回收站<i class="el-icon-delete-solid" /></el-button>
        </el-col>
    </el-row>
</template>

<script>
export default {
    name: 'HomeFunction'
}
</script>
<style scoped>
.home-fun-btn {
    width: 285px;
    height: 145px;
    line-height: 20px;
    border-radius: 15px;
    font-weight: 580;
    background-color: rgba(255, 255, 255, 100);
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    text-align: center;
    border: 1px solid rgba(187, 187, 187, 100);
}
</style>

