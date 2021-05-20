<template>
    <div>
        <sign-pad />
        <pagination />
        <province-city />
    </div>
</template>

<script>
import SignPad from '../components/form/SignPad'
import pagination from '../components/form/pagination'
import ProvinceCity from '@/components/form/ProvinceCity'
export default {
    name: 'App',
    components: {
        ProvinceCity,
        SignPad,
        pagination
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
