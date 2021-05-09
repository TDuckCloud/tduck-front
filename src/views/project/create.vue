<template>
    <div class="create-wrapper">
        <div class="back-view">
            <el-button size="mini" round @click="$router.back(-1)">
                <i class="el-icon-arrow-left" />
                返回
            </el-button>
        </div>
        <el-row>
            <el-row type="flex" justify="center">
                <el-col :span="20">
                    <el-form ref="form" :inline="true">
                        <el-form-item label="">
                            <el-input
                                v-model="queryParams.name"
                                class="search-template-input"
                                @keyup.enter="queryTemplatePage"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary"
                                       class="search-template-btn"
                                       @click="queryTemplatePage"
                            >
                                查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :offset="6" :span="10">
                    <el-menu :default-active="queryParams.type"
                             style="background-color: transparent;"
                             mode="horizontal" @select="(index)=>{
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
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3">
                    <span class="tagTitle">推荐模板</span>
                </el-col>
            </el-row>
            <div class="project-grid-container">
                <div
                    class="project-grid-view"
                >
                    <div class="project-template-view"
                         style="display: flex; align-items: center;"
                         @click="createBlankTemplate"
                    >
                        <div style="flex: 1;">
                            <i style="font-size: 40px; align-items: center;" class="el-icon-plus" />
                            <p style="font-size: 14px;">创建一个空白模板</p>
                        </div>
                    </div>
                    <div v-for="template in templateList" :key="template.title" class="project-template-view">
                        <img style="width: 144px; height: 133px;" :src="template.coverImg">
                        <p class="project-template-title">
                            {{ template.name }}
                        </p>
                        <p style="color: rgba(189, 188, 188, 100); font-size: 12px; margin: 0;">
                            {{ template.likeCount }}人喜欢
                            <svg-icon name="like" style="width: 12px; height: 12px;" />
                        </p>
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
        <el-row style="height: 20px;" />
        <div>
            <el-pagination
                v-if="total>10"
                background
                :page-size.sync="queryParams.size"
                :current-page.sync="queryParams.current"
                layout="total, prev, pager, next"
                :total="total"
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
.create-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    align-content: center;
}
.back-view {
    display: flex;
    width: 80%;
    align-content: flex-start;
    margin: 10px;
}
.project-grid-view {
    display: flex;
    width: 1200px;
    flex-direction: row;
    flex-wrap: wrap;
}
.tagTitle {
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
.search-template-btn {
    width: 132px;
    height: 50px;
    border-radius: 10px;
    background-color: rgba(25, 73, 157, 100);
    color: rgba(255, 255, 255, 100);
    font-size: 18px;
    text-align: center;
    border: 1px solid rgba(187, 187, 187, 100);
}
</style>
