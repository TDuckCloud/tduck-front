<template>
    <div>注意 title 的变化</div>
</template>

<script>
export default {
    data() {
        return {
            title: '我是这个页面的title噢'
        }
    },
    metaInfo() {
        return {
            title: this.title
        }
    }
}
</script>
