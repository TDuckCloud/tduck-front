<template>
    <div>
        我真的尽力了，但还是找不到页面
    </div>
</template>
<script>
import loadScript from '@/utils/loadScript'

export default {
    name: '404',
    data() {
        return {}
    },
    mounted() {
        loadScript('http://qzonestyle.gtimg.cn/qzone/hybrid/app/404/search_children.js', () => {

        })
    },
    methods: {}
}
</script>
