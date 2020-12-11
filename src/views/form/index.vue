<template>
    <div class="container">
        <el-row type="flex" align="middle" justify="justify">
            <el-col :offset="1" :span="4">
                <el-button size="mini" round @click="$router.back(-1)">
                    <i class="el-icon-arrow-left"/>
                    返回
                </el-button>
            </el-col>
            <el-col :span="10" :offset="3">
                <el-menu :default-active="activeIndex" @select="handleSelect" style="background-color: transparent"
                         mode="horizontal">
                    <el-menu-item index="1">编辑</el-menu-item>
                    <el-menu-item index="2">外观</el-menu-item>
                    <el-menu-item index="3">设置</el-menu-item>
                    <el-menu-item index="4">发布</el-menu-item>
                    <el-menu-item index="5">统计</el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
        <div v-if="projectKey">
            <editor :projectKey="projectKey" :is-edit="isEdit" v-if="activeIndex==1"/>
            <theme :projectKey="projectKey" v-if="activeIndex==2"/>
            <setting :projectKey="projectKey" v-if="activeIndex==3"/>
            <publish :projectKey="projectKey" v-if="activeIndex==4"/>
            <statistics :projectKey="projectKey" v-if="activeIndex==5"/>
        </div>
    </div>
</template>

<script>
import editor from './editor'
import theme from './theme'
import setting from './setting'
import publish from './publish'
import statistics from './statistics'

export default {
    components: {
        editor,
        theme,
        setting,
        publish,
        statistics
    },
    data() {
        return {
            activeIndex: '5',
            isEdit: false,
            projectKey:''
        }
    },
    computed: {},
    watch: {},
    mounted() {
        this.projectKey = this.$route.query.key
        this.isEdit = !!this.$route.query.active
        this.activeIndex=this.$route.query.active
    },
    methods: {
        handleSelect(key, keyPath) {
            if (key) {
                this.activeIndex = key
            }
        }
    }
}
</script>

<style lang='scss'>
</style>
