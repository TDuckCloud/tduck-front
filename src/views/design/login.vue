<template>
    <div>
        <el-container>
            <el-header>
                <el-menu  class="el-menu-demo" mode="horizontal" >
                    <el-menu-item route="1">
                        <el-image
                            style="width: 100px; height: 100px"
                            :src="url"
                            :fit="fit"></el-image>
                    </el-menu-item>
                    <el-menu-item route="1">企业部署</el-menu-item>
                    <el-menu-item route="3" >开源版本</el-menu-item>
                    <el-menu-item route="4">提出建议</el-menu-item>
                </el-menu>
            </el-header>
            <el-main>Main</el-main>
            <el-footer>Footer</el-footer>
        </el-container>
<!--        <button @click="login">模拟登录</button>-->
    </div>
</template>

<script>
export default {
    methods: {
        login() {
            this.$store.dispatch('token/login').then(() => {
                // 登录成功后路由跳回
                if (this.$route.query.redirect) {
                    this.$router.replace({
                        path: this.$route.query.redirect
                    })
                } else {
                    if (window.history.length <= 1) {
                        this.$router.push({ path: '/' })
                    } else {
                        this.$router.go(-1)
                    }
                }
            })
        }
    }
}
</script>
