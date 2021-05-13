<script>
import Emitter from 'element-ui/src/mixins/emitter'

export default {
    name: 'ImageSelect1',

    componentName: 'ImageSelect1',

    mixins: [Emitter],

    inject: {
        elFormItem: {
            default: ''
        }
    },

    props: {
        value: {},
        options: Array,
        disabled: Boolean,
        min: Number,
        max: Number,
        size: String,
        fill: String,
        textColor: String
    },

    computed: {
        _elFormItemSize() {
            return (this.elFormItem || {}).elFormItemSize
        },
        checkboxGroupSize() {
            return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size
        }
    },

    watch: {
        value(value) {
            this.dispatch('ElFormItem', 'el.form.change', [value])
        }
    }
}
</script>

<template>
    <div class="el-checkbox-group" role="group" aria-label="checkbox-group">
        <div v-for="option in options" :key="option.value" class="img-radio-item">
            <el-image
                class="image"
                :src="option.image"
                fit="scale-down"
                :preview-src-list="[option.image]"
            />
            <el-radio :label="option.value">{{ option.label }}</el-radio>
        </div>
    </div>
</template>

