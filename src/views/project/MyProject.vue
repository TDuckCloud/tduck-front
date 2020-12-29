<template>
    <div class="my-project-container">
        <div class="back-view">
            <el-button size="mini" round @click="$router.back(-1)">
                <i class="el-icon-arrow-left" />
                返回
            </el-button>
        </div>
        <div class="filter-view">
            <div>
                <span @click="switchDataShowTypeHandle('gird')">
                    <font-icon
                        class="fas fa-th-large show-view-type-icon "
                        :class="{'show-view-type-icon-active':dataShowType=='gird'}"
                    />
                </span>
                <span @click="switchDataShowTypeHandle('table')">
                    <font-icon
                        class="fas  fa-th-list show-view-type-icon"
                        :class="{'show-view-type-icon-active':dataShowType=='table'}"
                    />
                </span>
            </div>
            <el-form ref="form" label-width="100px">
                <el-form-item label="项目更新时间">
                    <el-date-picker
                        v-model="queryParams.beginDateTime"
                        style="width: 20%;"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择开始时间"
                    />
                    至
                    <el-date-picker
                        v-model="queryParams.endDateTime"
                        style="width: 20%;"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="'23:59:59'"
                        placeholder="选择结束时间"
                    />
                    <el-input
                        v-model="queryParams.name"
                        style="width: 20%; margin-left: 20px;" type="text" placeholder="请输入项目名称"
                    />
                    <el-button style="margin-left: 20px;" type="primary" @click="queryProjectPage">查询</el-button>
                    <el-button style="margin-left: 20px;">
                        <font-icon class="fas fa-plus-square" />
                        新建文件夹
                    </el-button>
                    <el-button style="margin-left: 10px;">
                        <font-icon class="fas fa-recycle" />
                        回收站
                    </el-button>
                </el-form-item>
                <el-form-item label="项目状态">
                    <el-radio-group v-model="queryParams.status" size="small" @change="()=>{
                        this.queryParams.current=0
                        this.queryProjectPage()
                    }"
                    >
                        <el-radio-button v-for="status in projectStatusList" :key="status.code" :label="status.code">
                            {{ status.name }}
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <div v-if="dataShowType=='gird'" class="project-grid-container">
            <div
                v-if="projectList.length"
                v-loading="projectListLoading"
                class="project-grid-view"
            >
                <div v-for="p in projectList" :key="p.id" class="project-grid-item-view pointer" :span="4">
                    <el-row type="flex" align="middle" justify="center">
                        <el-col :span="5">
                            <span
                                :style="getStatusColorStyle(p.status)"
                                class="project-grid-view-status"
                            />
                        </el-col>
                        <el-col :span="19">
                            <el-tooltip :content="p.name" placement="top">
                                <p class="project-title">
                                    {{ p.name }}
                                </p>
                            </el-tooltip>
                        </el-col>
                    </el-row>
                    <img class="project-grid-view-preimg"
                         src="https://freebrio.oss-cn-shanghai.aliyuncs.com/t/pic%20(1).png"
                    >
                    <p class="project-grid-view-time">创建时间：2020/12/8</p>
                    <div class="gird-operating-btns">
                        <el-button type="text" @click="toProjectHandle(p.key,1)">
                            <i class="el-icon-edit" />
                            编辑
                        </el-button>
                        <el-button
                            v-if="p.status!=1"
                            type="text" @click="toProjectHandle(p.key,5)"
                        >
                            <i class="el-icon-data-analysis" />
                            统计
                        </el-button>
                    </div>
                </div>
            </div>
            <div v-else v-loading="projectListLoading">
                <data-empty />
            </div>
        </div>
        <div v-if="dataShowType=='table'" class="project-table-view">
            <el-table
                :data="projectList"
                stripe
                border
                highlight-current-row

                style="width: 100%;"
                empty-text="暂无数据"
            >
                <el-table-column
                    prop="name"
                    show-overflow-tooltip
                    align="center"
                    label="标题"
                />
                <el-table-column
                    show-overflow-tooltip
                    prop="describe"
                    align="center"
                    label="描述"
                />
                <el-table-column
                    align="center"
                    label="状态"
                >
                    <template slot-scope="scope">
                        <span v-for="status in projectStatusList" :key="status.code">
                            <span
                                v-if="status.code==scope.row.status"
                            >
                                {{ status.name }}
                            </span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="createTime"
                    label="创建时间"
                />
                <el-table-column
                    align="center"
                    prop="updateTime"
                    label="更新时间"
                />
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-link type="primary"
                                 style="margin: 2px;"
                                 @click="toProjectHandle(scope.row.key,1)"
                        >
                            编辑
                        </el-link>
                        <el-link
                            v-if="scope.row.status!=1"
                            type="success"
                            style="margin: 2px;"
                            @click="toProjectHandle(scope.row.key,5)"
                        >
                            统计
                        </el-link>
                        <el-link type="danger" style="margin: 2px;">
                            删除
                        </el-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="project-page-view">
            <el-pagination
                v-if="total>10"
                background
                :page-size.sync="queryParams.size"
                :current-page.sync="queryParams.current"
                layout="total, prev, pager, next"
                :total="total"
                @current-change="queryProjectPage"
            />
        </div>
    </div>
</template>
<script>
import DataEmpty from '@/components/DataEmpty'

let projectStatusList = [
    {code: 1, name: '未发布', color: '#006EFF'},
    {code: 2, name: '收集中', color: '#34C82A'},
    {code: 4, name: '已结束', color: '#955A45'}
]

export default {
    name: 'MyProject',
    components: {DataEmpty},
    data() {
        return {
            dataShowType: 'gird',
            total: 0,
            queryParams: {
                current: 1,
                size: 10,
                name: '',
                beginDateTime: null,
                endDateTime: null,
                status: null
            },
            projectStatusList: projectStatusList,
            projectList: [],
            projectListLoading: true
        }
    },
    computed: {
        getStatusColorStyle() {
            return function(code) {
                let color = this.projectStatusList.find(item => item.code == code).color
                return {
                    backgroundColor: color,
                    borderColor: color
                }
            }
        }
    },
    created() {
        this.queryProjectPage()
    },
    methods: {
        switchDataShowTypeHandle(type) {
            this.dataShowType = type
        },
        toProjectHandle(key, type) {
            this.$router.push({path: '/project/form', query: {key: key, active: type}})
        },
        queryProjectPage() {

            this.$api.get('/user/project/page', {
                params: this.queryParams
            }).then(res => {
                let {records, total, size} = res.data
                this.projectList = records
                this.total = total
                this.queryParams.size = size
                this.projectListLoading = false
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.my-project-container {
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
.filter-view {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
}
.show-view-type-icon {
    color: white;
    font-size: 18px;
    -webkit-text-stroke: 0.5px #a8a8a8;
    margin: 5px;
    cursor: pointer;
}
.show-view-type-icon-active {
    color: rgba(92, 155, 249, 100);
    -webkit-text-stroke: 0.5px rgba(92, 155, 249, 100);
}
.project-grid-container {
    margin-top: 20px;
    display: flex;
    width: 100%;
    justify-content: center;
}
.project-grid-view {
    display: flex;
    width: 950px;
    flex-direction: row;
    flex-wrap: wrap;
}
.project-table-view {
    margin-top: 20px;
    width: 80%;
}
.project-grid-item-view {
    width: 169px;
    height: 199px;
    line-height: 20px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 100);
    text-align: center;
    box-shadow: 0 3px 6px 3px rgba(0, 0, 0, 0.12);
    margin: 10px;
    position: relative;
    .project-title {
        color: rgba(16, 16, 16, 100);
        font-size: 14px;
        text-align: left;
        line-height: 20px;
        max-height: 20px;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .project-grid-view-status {
        display: inline-block;
        width: 7px;
        height: 7px;
        line-height: 20px;
        background-color: rgba(0, 110, 255, 100);
        text-align: center;
        border: 1px solid rgba(0, 110, 255, 100);
        border-radius: 20px;
    }
}
.gird-operating-btns {
    position: absolute;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: #f0f0f0;
    bottom: 0;
    display: none;
    border: none;
}
.project-grid-item-view:hover .gird-operating-btns {
    display: block;
}
.project-grid-view-preimg {
    width: 143px;
    height: 121px;
}
.project-grid-view-time {
    color: rgba(144, 147, 153, 100);
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    margin: 0;
}
.project-page-view {
    margin-top: 30px;
}
</style>
