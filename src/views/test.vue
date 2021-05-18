<template>
    <div>
        <sign-pad />
        <pagination />
    </div>
</template>

<script>
import SignPad from '../components/form/SignPad'
import pagination from '../components/form/pagination'
export default {
    name: 'App',
    components: {
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
