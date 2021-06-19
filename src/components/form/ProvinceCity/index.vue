<template>
    <div>
        <el-cascader
            v-model="value"
            :options="options"
            :props="props"
            clearable
            @change="changeHandle"
        />
    </div>
</template>

<script>
import city from './level.min.json'
export default {
    name: 'ProvinceCity',
    data() {
        return {
            options: city,
            props: {
                label: 'n',
                value: 'n',
                children: 'd'
            }
        }
    }, methods: {
        changeHandle(val) {
            this.$emit('input', val)
        }
    }
}
</script>

