<template>
    <div class="official-container">
        <div class="header-container">
            <div class="background" />
            <img src="@/assets/images/official/TDUCK@2x.png">
            <div>
                <span>首页</span>
                <span>开源项目</span>
                <span>开发文档</span>
                <span>付费服务</span>
                <span>加入社群</span>
            </div>
            <div>
                <span>登录</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Official'
}
</script>

<style lang="scss" scoped>
.official-container {
    min-width: 960px;
    height: 100%;
    background-size: contain;
}
.header-container {
    position: relative;
}
.background {
    position: absolute;
    bottom: -375px;
    width: 1920px;
    height: 847px;
    transform: rotate(337deg);
    background: linear-gradient(90deg, #2054f1, #224ef3, #38eaff);
    border-radius: 0 5px 5px 267px;
}
</style>
