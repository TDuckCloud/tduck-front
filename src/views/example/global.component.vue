<template>
    <div>
        <p>全局组件会自动注册</p>
        <p>使用方法：</p>
        <ol>
            <li>全局组件统一放在 ./src/components/global/ 目录下，需要注意各个组件按文件夹区分，文件夹名称与组件名无关联</li>
            <li>文件夹内至少保留一个文件名为 index 的组件入口，例如 index.vue</li>
            <li>普通组件必须设置 name 并保证其唯一，自动注册会将组件的 name 设为组件名，可参考 <RouterLink to="/example/svgicon">SvgIcon</RouterLink> 组件写法</li>
            <li>如果组件是通过 js 进行调用，则确保组件入口文件为 index.js，下面演示 ExampleNotice 组件，通过 js 调用并展示 Notice</li>
        </ol>
        <a href="javascript:;" @click="showNotice">显示Notice</a>
    </div>
</template>

<script>
export default {
    methods: {
        showNotice() {
            this.$exampleNotice({
                content: '我是Notice！'
            })
        }
    }
}
</script>
