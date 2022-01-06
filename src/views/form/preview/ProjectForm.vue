<template>
    <biz-project-form
        v-if="formConfig.formKey"
        :form-config="formConfig"
        @submit="submitForm"
    />
</template>

<script>
import {BizProjectForm} from 'tduck-form-generator'
import mixin from '../TduckFormMixin'

export default {
    components: {
        BizProjectForm
    },
    mixins: [mixin],
    data() {
        return {
            formConfig: {
                formKey: '',
                preview: true,
                showBtns: true
            }
        }
    },
    created() {
        this.formConfig.formKey = this.$route.query.key
    },
    methods: {
        submitForm() {

        }
    }
}
</script>

