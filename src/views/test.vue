<template>
    <div>
        <el-radio-group v-model="radio">
            <el-radio :label="3">备选项</el-radio>
            <el-radio :label="6">备选项</el-radio>
            <el-radio :label="9">备选项</el-radio>
            <el-radio :label="0">其他<input/>
            </el-radio>
        </el-radio-group>
    </div>
</template>

<script>
// 引入组件
// import Verify from '@/components/verifition/Verify'
export default {
    name: 'App',
    components: {
    },
    data() {
        return {
            radio: 3
        }
    },
    created() {
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
