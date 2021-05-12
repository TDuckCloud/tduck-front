<template>
    <div>
        <image-select v-model="radio" :options="options" :multiple="true" />
    </div>
</template>

<script>

export default {
    name: 'App',
    components: {
    },
    data() {
        return {
            options: [{
                'label': '选项一',
                'value': 1,
                'image': 'https://freebrio.oss-cn-shanghai.aliyuncs.com/05f1fb3e58764a48a5094f0bc9351bd3.png'
            }, {
                'label': '选项二',
                'value': 2,
                'image': 'https://freebrio.oss-cn-shanghai.aliyuncs.com/062cf61ad5724ac3bc99f0341b3770da.png'
            }],
            radio: [1]
        }
    },
    mounted() {

    },
    methods: {
        success(params) {
            // eslint-disable-next-line no-debugger
            debugger
            // params 返回的二次验证参数, 和登录参数一起回传给登录接口，方便后台进行二次验证
            console.log(params)
        },
        useVerify() {
            this.$refs.verify.show()
        }
    }
}
</script>
