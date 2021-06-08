<template>
    <el-row>
        <!--      轮播·1-->
        <!--        <el-row>-->
        <!--            <el-col :span="24">-->
        <!--                <el-carousel height="55px">-->
        <!--                    <el-carousel-item v-for="item in 2" :key="item">-->
        <!--                        <img style="height: 55px; width: 100%;"-->
        <!--                             src="https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c4aj.png"-->
        <!--                        >-->
        <!--                    </el-carousel-item>-->
        <!--                </el-carousel>-->
        <!--            </el-col>-->
        <!--        </el-row>-->
        <Dashboard />
        <HomeFunction />
    </el-row>
</template>

<script>
import HomeFunction from './HomButton'
import Dashboard from '../form/statistics/chart'

export default {
    name: 'HomeView',
    components: {HomeFunction, Dashboard}
}
</script>
