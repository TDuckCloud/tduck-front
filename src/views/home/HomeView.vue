<template>
    <el-row>
        <Dashboard />
        <HomeFunction />
    </el-row>
</template>

<script>
import HomeFunction from './HomButton'
import Dashboard from './dashboard'

export default {
    name: 'HomeView',
    components: {HomeFunction, Dashboard}
}
</script>
