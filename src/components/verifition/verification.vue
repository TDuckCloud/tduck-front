<template>
    <Verify
        ref="verify"
        :captcha-type="'blockPuzzle'"
        :img-size="{ width: '330px', height: '155px' }"
        :mode="'pop'"
        @success="verifySuccessHandle"
    />
</template>

<script>
import Verify from './Verify'

export default {
    name: 'verification',
    components: {
        Verify
    },
    created() {
    },
    methods: {
        /**
         * @description: 移出
         */
        close() {
            this.visible = false
            setTimeout(() => {
                this.$el.parentNode.removeChild(this.$el)
            }, 300)
        },
        verifySuccessHandle(params) {
            let slideCode = params.captchaVerification
            this.close()
            this.callback('verifySuccess',slideCode)
        }
    }
}
</script>

<style scoped>

</style>
