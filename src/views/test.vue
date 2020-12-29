<template>
    <div>
        <map-chart />
    </div>
</template>

<script>
// 引入组件
// import Verify from '@/components/verifition/Verify'
import MapChart from '@/components/echarts/MapChart'

export default {
    name: 'App',
    components: {
        MapChart
    },
    data() {
        return {
            radio: 3
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
<style scoped>
.el-radio {
    display: block;
}
</style>
