<template>
    <div>
        <p>这是一个非全局组件，需要在页面上引用该组件才能使用</p>
        <ExampleList :list="list" />
    </div>
</template>

<script>
import ExampleList from '@/components/ExampleList'

export default {
    components: {
        ExampleList
    },
    data() {
        return {
            list: ['张三', '李四', '王五']
        }
    }
}
</script>
