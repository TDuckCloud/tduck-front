<template>
    <div>
        <div id="nav">
            <RouterLink to="/example/sprite">sprite精灵图</RouterLink>
            <RouterLink to="/example/svgicon">svg icon</RouterLink>
            <RouterLink to="/example/globalComponent">全局组件</RouterLink>
            <RouterLink to="/example/axios">axios</RouterLink>
            <RouterLink to="/example/cookie">cookie</RouterLink>
            <RouterLink to="/example/meta">meta</RouterLink>
            <RouterLink to="/example/vuex">vuex</RouterLink>
            <RouterLink to="/example/component">组件</RouterLink>
            <RouterLink :to="{name:'exampleParams',params:{test:'123'}}">路由params</RouterLink>
            <RouterLink :to="{path:'/example/query',query:{test:'123'}}">路由query</RouterLink>
            <RouterLink to="/example/reload">刷新当前页面</RouterLink>
            <RouterLink to="/example/permission/router">router鉴权</RouterLink>
            <RouterLink to="/example/permission/js">js鉴权</RouterLink>
        </div>
        <RouterView />
    </div>
</template>

<style lang="scss" scoped>
#nav {
    margin-bottom: 10px;
    a {
        text-decoration: none;
        font-size: 14px;
        &::after {
            content: '|';
            margin: 0 10px;
            font-weight: normal;
            font-size: 14px;
        }
        &:last-child::after {
            content: none;
        }
        &.router-link-active {
            font-weight: bold;
            font-size: 18px;
        }
    }
}
</style>
