<template>
    <p>
        {{ value }}
    </p>
</template>

<script>
export default {
    name: 'DescText',
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    methods: {

    }
}
</script>
