<template>
    <div>
        <ul>
            <li v-for="(item, index) in list" :key="index">{{ item }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'ExampleList',
    props: {
        list: Array
    }
}
</script>
