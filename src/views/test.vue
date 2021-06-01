<template>
    <div>
        <sign-pad />
        <pagination />
        <province-city />
        <input-map />
        <phone-verification />
    </div>
</template>

<script>
import SignPad from '../components/form/SignPad'
import pagination from '../components/form/pagination'
import ProvinceCity from '@/components/form/ProvinceCity'

import InputMap from '@/components/form/InputMap/index'
import PhoneVerification from '@/components/form/PhoneVerification/index'

export default {
    name: 'App',
    components: {
        ProvinceCity,
        PhoneVerification,
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
