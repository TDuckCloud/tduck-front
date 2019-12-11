<template>
    <div class="sprites">
        <div class="address" />
        <div class="feedback" />
        <div class="payment" />
        <div class="info">
            在 vue.config.js 里配置精灵图路径等信息，如果要新增一个精灵图目录，则先复制一份 new SpritesmithPlugin() ，修改目录名和文件名，然后重新运行 serve 任务即可。
        </div>
        <img :src="logo" class="logo">
    </div>
</template>

<script>
export default {
    data() {
        return {
            logo: ''
        }
    },
    created() {
        // 在 js 里引用图片，需要用 require 的方式
        this.logo = require('../../assets/images/example.png')
    }
}
</script>

<style lang="scss" scoped>
.sprites {
    padding: 10px;
    .address,
    .feedback,
    .payment {
        display: inline-block;
        margin-right: 10px;
    }
    .address {
        @include example-sprite(address);
    }
    .feedback {
        @include example-sprite(feedback);
    }
    .payment {
        @include example-sprite(payment);
    }
}
.logo {
    width: 200px;
    height: 200px;
}
</style>
