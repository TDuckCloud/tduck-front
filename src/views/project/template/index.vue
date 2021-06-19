<template>
    <div class="create-container">
        <el-row>
            <div class="create-header-container">
                <div class="filter-container">
                    <el-form ref="form" :inline="true">
                        <el-form-item label="">
                            <el-input
                                v-model="queryParams.name"
                                class="width80"
                                placeholder="请输入模板名称"
                                @keyup.enter="queryTemplatePage"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button class="search-template-btn"
                                       type="primary"
                                       @click="queryTemplatePage"
                            >
                                查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <el-menu :default-active="queryParams.type"
                         mode="horizontal"
                         style="background-color: transparent;" @select="(index)=>{
                             this.queryParams.type=index
                             this.queryTemplatePage()}"
                >
                    <el-menu-item :`index`="null">全部</el-menu-item>
                    <el-menu-item v-for="(item, index) in templateTypeList" :key="index"
                                  :index="item.id.toString()"
                    >
                        {{ item.name }}
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="project-grid-container">
                <div
                    class="project-grid-view"
                >
                    <div class="project-template-view"
                         style="display: flex; align-items: center;"
                         @click="createBlankTemplate"
                    >
                        <div style="flex: 1;">
                            <i class="el-icon-plus" style="font-size: 40px; align-items: center;" />
                            <p style="font-size: 14px;">创建一个空白模板</p>
                        </div>
                    </div>
                    <div v-for="template in templateList" :key="template.id" class="project-template-view">
                        <img :src="template.coverImg?template.coverImg:'https://i.niupic.com/images/2021/01/08/99d0.png'" style="width: 144px; height: 133px;">
                        <p class="project-template-title">
                            {{ template.name }}
                        </p>
                        <!--                        <p style="color: rgba(189, 188, 188, 100); font-size: 12px; margin: 0;">-->
                        <!--                            {{ template.likeCount }}人喜欢-->
                        <!--                            <svg-icon name="like" style="width: 12px; height: 12px;" />-->
                        <!--                        </p>-->
                        <div class="project-template-use-view">
                            <div
                                class="project-template-use-view-btn"
                                @click="toProjectTemplate(template.key)"
                            >
                                <div>
                                    <font-icon class="fa fa-eye" style="font-size: 40px;" />
                                </div>
                                <el-button type="text">查看</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-row>
        <div>
            <el-pagination
                v-if="total>10"
                :current-page.sync="queryParams.current"
                :page-size.sync="queryParams.size"
                :total="total"
                background
                layout="total, prev, pager, next"
                @current-change="queryTemplatePage"
            />
        </div>
    </div>
</template>

<script>
import {formConf} from '@/components/generator/config'

export default {
    name: 'CreateProject',
    data() {
        return {
            queryParams: {
                current: 1,
                size: 11,
                name: '',
                type: null
            },
            total: 0,
            templateTypeList: [],
            templateList: []
        }
    },
    computed: {},
    created() {
        this.queryTemplateType()
        this.queryTemplatePage()
    },
    methods: {
        queryTemplateType() {
            this.$api.get('/project/template/type/list').then(res => {
                this.templateTypeList = res.data
            })
        },
        toProjectTemplate(key) {
            this.$router.push({path: '/project/template/preview', query: {key: key}})
        },
        queryTemplatePage() {
            this.$api.get('/project/template/page', {params: this.queryParams}).then(res => {
                let {records, total, size} = res.data
                this.templateList = records
                this.total = total
                this.queryParams.size = size
                this.projectListLoading = false
            })
        },
        createBlankTemplate() {
            this.$api.post('/user/project/create', {
                'describe': formConf.description,
                'name': formConf.title
            }).then(res => {
                console.log(res)
                this.$router.push({path: '/project/form', query: {key: res.data}})
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.create-container {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    align-content: center;
    .el-pagination {
        margin-top: 20px;
    }
}
.create-header-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}
.filter-container {
    display: flex;
    justify-content: flex-start;
    margin-top: 20px !important;
    .el-input {
        display: inline-block;
        width: 300px !important;
    }
}
.project-grid-view {
    display: flex;
    width: 1200px;
    flex-direction: row;
    flex-wrap: wrap;
}
.tag-title {
    font-size: 20px;
    border-bottom: 3px solid rgba(68, 68, 68, 100);
    line-height: 25px;
}
.project-template-view {
    width: 151px;
    height: 196px;
    line-height: 20px;
    border-radius: 3px;
    text-align: center;
    margin: 20px;
    //border: 1px solid rgba(187, 187, 187, 100);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    background: white;
    position: relative;
}
.project-template-view:hover .project-template-use-view {
    display: block;
    cursor: pointer;
}
.project-template-use-view {
    position: absolute;
    width: 100%;
    height: 196px;
    z-index: 100;
    margin: 0;
    padding: 0;
    background-color: #f0f0f0;
    bottom: 0;
    filter: alpha(opacity=60);
    -moz-opacity: 0.6;
    opacity: 0.6;
    display: none;
    border: none;
}
.project-template-title {
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    margin: 0 3px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.project-template-use-view-btn {
    margin-top: 50%;
}
.el-menu.el-menu--horizontal {
    border-bottom: none;
}
::v-deep .search-template-input input {
    width: 651px;
    height: 50px;
    line-height: 20px;
    border-radius: 10px;
    text-align: center;
    border: 1px solid rgba(187, 187, 187, 100);
}
</style>
