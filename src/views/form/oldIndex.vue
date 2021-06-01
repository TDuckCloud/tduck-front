<!--<template>-->
<!--    <div class="container" style="overflow-y: hidden !important;">-->
<!--        <el-row type="flex" align="middle" justify="justify">-->
<!--            <el-col :offset="1" :span="4">-->
<!--                <el-button size="mini" round @click="$router.back(-1)">-->
<!--                    <i class="el-icon-arrow-left" />-->
<!--                    返回-->
<!--                </el-button>-->
<!--            </el-col>-->
<!--            <el-col :span="10" :offset="3">-->
<!--                <el-menu :default-active="activeTab" style="background-color: transparent;" mode="horizontal"-->
<!--                         @select="handleSelect"-->
<!--                >-->
<!--                    <el-menu-item index="editor">编辑</el-menu-item>-->
<!--                    <el-menu-item index="logic">逻辑</el-menu-item>-->
<!--                    <el-menu-item index="theme">外观</el-menu-item>-->
<!--                    <el-menu-item index="setting">设置</el-menu-item>-->
<!--                    <el-menu-item index="publish">发布</el-menu-item>-->
<!--                    <el-menu-item index="statistics">统计</el-menu-item>-->
<!--                </el-menu>-->
<!--            </el-col>-->
<!--        </el-row>-->
<!--        <div v-if="projectKey">-->
<!--            <editor v-if="activeTab=='editor'" :project-key="projectKey" :is-edit="isEdit" />-->
<!--            <logic v-if="activeTab=='logic'" :project-key="projectKey" />-->
<!--            <theme v-if="activeTab=='theme'" :project-key="projectKey" />-->
<!--            <setting v-if="activeTab=='setting'" :project-key="projectKey" />-->
<!--            <publish v-if="activeTab=='publish'" :project-key="projectKey" />-->
<!--            <statistics v-if="activeTab=='statistics'" :project-key="projectKey" />-->
<!--        </div>-->
<!--    </div>-->
<!--</template>-->

<!--<script>-->
<!--import editor from './editor'-->
<!--import theme from './theme'-->
<!--import setting from './setting'-->
<!--import publish from './publish'-->
<!--import statistics from './statistics'-->
<!--import logic from './logic'-->

<!--export default {-->
<!--    components: {-->
<!--        editor,-->
<!--        theme,-->
<!--        setting,-->
<!--        publish,-->
<!--        statistics,-->
<!--        logic-->
<!--    },-->
<!--    data() {-->
<!--        return {-->
<!--            activeTab: 'editor',-->
<!--            isEdit: false,-->
<!--            projectKey: ''-->
<!--        }-->
<!--    },-->
<!--    computed: {},-->
<!--    watch: {},-->
<!--    mounted() {-->
<!--        this.projectKey = this.$route.query.key-->
<!--        this.isEdit = !!this.$route.query.active-->
<!--        if (this.$route.query.active) {-->
<!--            this.activeTab = this.$route.query.active-->
<!--        }-->
<!--    },-->
<!--    methods: {-->
<!--        handleSelect(type) {-->
<!--            if (type) {-->
<!--                this.activeTab = type-->
<!--                this.$router.replace({path: '/project/form', query: {key: this.projectKey, active: type}})-->
<!--            }-->
<!--        }-->
<!--    }-->
<!--}-->
<!--</script>-->

<!--<style lang='scss'>-->
<!--.container {-->
<!--    position: relative;-->
<!--    width: 100%;-->
<!--    height: 100%;-->
<!--    //overflow-y: hidden;-->
<!--}-->
<!--</style>-->
