<template>
    <div>
        <el-radio-group
            v-if="!multiple"
            v-model="selectValue"
        >
            <div v-for="option in options" :key="option.value" class="img-radio-item">
                <el-image
                    :preview-src-list="[option.image]"
                    :src="option.image"
                    class="image"
                    fit="scale-down"
                >
                    <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline" />
                    </div>
                </el-image>
                <el-radio :label="option.value">{{ option.label }}</el-radio>
            </div>
        </el-radio-group>
        <el-checkbox-group
            v-else
            v-model="selectValue"
        >
            <div v-for="option in options" :key="option.value" class="img-radio-item">
                <el-image
                    :preview-src-list="[option.image]"
                    :src="option.image"
                    class="image"
                    fit="scale-down"
                >
                    <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline" />
                    </div>
                </el-image>
                <el-checkbox :label="option.value">{{ option.label }}</el-checkbox>
            </div>
        </el-checkbox-group>
    </div>
</template>

<script>
export default {
    name: 'ImageSelect',
    props: {
        value: {
            type: Number,
            default: 1
        },
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
    data() {
        return {
            selectValue: this.value
        }
    },
    watch: {
        selectValue(val) {
            this.$emit('input', val)
        },
        value(val) {
            this.selectValue = val
        }
    },
    methods: {

    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-radio-button__inner,
.el-radio-group,
.el-checkbox-group {
    display: flex !important;
    flex-wrap: wrap;
}
.img-radio-item {
    display: flex;
    flex-direction: column !important;
    align-content: center !important;
    align-items: center !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
    margin: 3px !important;
    background-color: #fff;
    .image {
        width: 100px;
        height: 100px;
        margin: 2px 15px 4px 15px;
    }
    .el-radio {
        margin: 4px;
    }
}
::v-deep .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    //background: #f5f7fa;
    color: #909399;
    font-size: 30px;
}
</style>
