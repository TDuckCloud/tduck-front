<template>
    <div id="login">
        <el-row class="loginBody">
            <el-col :span="12" style="border:solid thin black;">
                <img class="loginBackImg" src="http://q2fgufcw6.bkt.clouddn.com/login-banner"/>
            </el-col>
            <el-col :span="12" style="border:solid thin black;">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="微信扫码登录" name="wechat">
                        微信扫码登录主体
                    </el-tab-pane>
                    <el-tab-pane label="账号密码登录" name="account">
                        账号密码登录主体
                    </el-tab-pane>
                </el-tabs>
                <div style="height:70px;border:solid thin black;"></div><!-- 暂时用来撑下面的高度，等菜🐎把图片确定以后再把此div移除 -->
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    name: 'login',
    data() {
        return {
            activeName: 'wechat'
        }
    }
}
</script>
<style scoped>
.loginBody {
    border: solid thin black;
    margin: 70px 0px 0px 0px;
}
.loginBackImg {
    width: 100%;
}
</style>
