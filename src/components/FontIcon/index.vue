<template>
  <i class="fa" :class="`${name}`" aria-hidden="true"></i>
</template>

<script>
import './font-awesome-4.7.0/css/font-awesome.min.css'
export default {
  name: 'FontIcon',
  props: {
    name: {
      type: String,
      required: false,
      default: 'font-awesome'
    }
  }
}
</script>
<style>
i::before{
    background:transparent;
}
</style>
