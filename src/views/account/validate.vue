<template>
    <div>
        <p v-if="bindEmailErr">
            绑定邮箱失败，可能是超出绑定时间或者是该邮箱已被绑定等，请稍后重试！
        </p>
    </div>
</template>

<script>

import {getQueryString} from '@/utils'

export default {
    name: 'Redirect',
    data() {
        return {
            bindEmailErr: ''
        }
    },
    created() {
        // 绑定邮件验证
        let type = getQueryString('type')
        if (type == 'updateEmail') {
            let code = this.$route.query.code
            let email = this.$route.query.email
            this.$api.post('/update/email', {email: email, key: code}).then(res => {
                if (res.data) {
                    this.bindEmailErr = true
                }
            })
        }
    },
    methods: {}

}
</script>
