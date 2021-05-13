<template>
    <div>
        <el-radio-group
            v-if="!multiple"
            v-bind="$attrs" v-on="$listeners" @change="onChange"
        >
            <div v-for="option in options" :key="option.value" class="img-radio-item">
                <el-image
                    class="image"
                    :src="option.image"
                    fit="scale-down"
                    :preview-src-list="[option.image]"
                />
                <el-radio :label="option.value">{{ option.label }}</el-radio>
            </div>
        </el-radio-group>
        <el-checkbox-group
            v-else
            v-bind="$attrs" v-on="$listeners"
            @change="onChange"
        >
            <div v-for="option in options" :key="option.value" class="img-radio-item">
                <el-image
                    class="image"
                    :src="option.image"
                    fit="scale-down"
                    :preview-src-list="[option.image]"
                />

                <el-checkbox :label="option.value">{{ option.label }}</el-checkbox>
            </div>
        </el-checkbox-group>
    </div>
</template>

<script>
export default {
    name: 'ImageSelect',
    props: {
        options: {
            type: Array,
            default: function() {
                return []
            },
            required: true
        },
        multiple: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onChange(e) {
            console.log(e)
            console.log(JSON.stringify(this.options))
            this.$emit('change', e)
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-radio-button__inner,
.el-radio-group,
.el-checkbox-group {
    display: flex !important;
}
.img-radio-item {
    display: flex;
    flex-direction: column !important;
    align-content: center !important;
    align-items: center !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
    margin: 3px !important;
    .image {
        width: 100px;
        height: 100px;
        margin: 2px 15px 4px 15px;
    }
    .el-radio {
        margin: 4px;
    }
}
</style>
