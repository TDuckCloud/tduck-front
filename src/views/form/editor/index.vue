<template>
    <FormDesign :question-mode="true" />
</template>
<script>
import TduckForm, {FormDesign} from 'tduck-form-generator'
import 'tduck-form-generator/dist/TduckForm.css'
import mixin from '../TduckFormMixin.js'

export default {
    name: 'FormEditor',
    components: {
        FormDesign
    },
    mixins: [mixin],
    data() {
        return {
        }
    },
    computed: {},
    methods: {

    }
}
</script>

<style lang='scss'>
</style>
