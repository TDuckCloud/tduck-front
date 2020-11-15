<template>
    <el-row>
        <Dashboard />
        <HomeFunction />
    </el-row>
</template>

<script>
import HomeFunction from './home-button'
import Dashboard from './dashboard'

export default {
    name: 'HomeView',
    components: {HomeFunction, Dashboard}
}
</script>
