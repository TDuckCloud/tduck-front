<template>
    <div>
        <Verify
            ref="verify"
            :mode="'pop'"
            :captcha-type="'blockPuzzle'"
            :img-size="{ width: '330px', height: '155px' }"
            @success="'success'"
        />
        <button @click="useVerify">调用验证组件</button>
    </div>
</template>

<script>
// 引入组件
import Verify from '@/components/verifition/Verify'

export default {
    name: 'App',
    components: {
        Verify
    },
    methods: {
        success(params) {
            // params 返回的二次验证参数, 和登录参数一起回传给登录接口，方便后台进行二次验证
            console.log(params)
        },
        useVerify() {
            this.$refs.verify.show()
        }
    }
}
</script>
