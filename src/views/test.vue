<template>
    <div>
        <sign-pad />
        <pagination />
        <province-city />
        <input-map />
    </div>
</template>

<script>
import SignPad from '../components/form/SignPad'
import pagination from '../components/form/pagination'
import ProvinceCity from '@/components/form/ProvinceCity'

import InputMap from '@/components/form/InputMap/index'
export default {
    name: 'App',
    components: {
        ProvinceCity,
        SignPad,
        pagination,
        InputMap
    },
    data() {
        return {
        }
    },
    mounted() {
    },
    methods: {

    }
}
</script>
