<template>
    <el-container>
        <el-header>
            <design-header/>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
    </el-container>
    <!--        <RouterLink to="/example">演示Demo</RouterLink>-->
</template>
<script>
    import DesignHeader from '../../layout/design-header'

    export default {
        name: 'index',
        data() {
            return {}
        },
        components: {
            DesignHeader
        },
        methods: {}
    }
</script>

<style scoped>

</style>
