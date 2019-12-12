<template>
    <el-container>
        <el-header>
            <design-header/>
        </el-header>
        <el-main>
            <router-view/>
        </el-main>
        <el-footer>Footer</el-footer>
    </el-container>
</template>
<script>
    import DesignHeader from './design-header'

    export default {
        name: 'DesignLayout',
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
