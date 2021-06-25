<template>
    <div id="app">
        <RouterView v-if="isRouterAlive" />
    </div>
</template>

<script>
export default {
    provide() {
        return {
            reload: this.reload
        }
    },
    data() {
        return {
            isRouterAlive: true
        }
    },
    watch: {
        $route: 'routeChange'
    },
    methods: {
        reload() {
            this.isRouterAlive = false
            this.$nextTick(() => (this.isRouterAlive = true))
        },
        routeChange(newVal, oldVal) {
            if (newVal.name == oldVal.name) {
                this.reload()
            }
        }
    },
    metaInfo: {
        titleTemplate: title => {
            return title
                ? `${title} - ${process.env.VUE_APP_TITLE}`
                : process.env.VUE_APP_TITLE
        }
    }
}
</script>
<style lang="scss">
.github-btn {
  a {
    font-weight: bold;
    color: #303133;
    padding: 4px 12px;
    border: solid 1px #DCDFE6;
    margin-left: 8px;
    position: relative;
    border-radius: 4px;
  }
  a:hover{
    color: #2C67E3;
  }
  a:last-child:before {
      position: absolute;
      display: inline-block;
      border-width: 7px;
      border-style: solid;
      border-color: transparent rgba(255, 255, 255, 0.4) transparent transparent;
      left: -15px;
      top: 25%;
      content: '';
  }
  /* 小角的背景填充*/
  a:last-child:after {
      position: absolute;
      display: inline-block;
      border-width: 6px;/*与before的三角形重叠差1px，和元素边框是边框宽度一致*/
      border-style: solid;
      border-color: transparent #eee transparent transparent;/*边框颜色（小角的填充色）要与整体元素背景一致*/
      left: -12px;
      top: 25%;
      content: '';
  }
}
</style>
