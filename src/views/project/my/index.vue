<template>
    <div class="my-project-container">
        <div class="filter-view">
            <div>
                <span @click="switchDataShowTypeHandle('gird')">
                    <font-icon
                        :class="{'show-view-type-icon-active':dataShowType=='gird'}"
                        class="fas fa-th-large show-view-type-icon "
                    />
                </span>
                <span @click="switchDataShowTypeHandle('table')">
                    <font-icon
                        :class="{'show-view-type-icon-active':dataShowType=='table'}"
                        class="fas  fa-th-list show-view-type-icon"
                    />
                </span>
            </div>
            <el-form ref="form" label-width="100px">
                <el-form-item label="项目更新时间">
                    <el-date-picker
                        v-model="queryParams.beginDateTime"
                        placeholder="选择开始时间"
                        style="width: 20%;"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    />
                    至
                    <el-date-picker
                        v-model="queryParams.endDateTime"
                        :default-time="'23:59:59'"
                        placeholder="选择结束时间"
                        style="width: 20%;"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    />
                    <el-input
                        v-model="queryParams.name"
                        placeholder="请输入项目名称" style="width: 20%; margin-left: 20px;" type="text"
                    />
                    <el-button class="ml-20" type="primary" @click="queryProjectPage">查询</el-button>
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
                <div v-for="p in projectList" :key="p.id" class="project-grid-item-view pointer">
                    <el-row align="middle" justify="center" type="flex">
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
                         src="https://oss.smileyi.top/static/pic%20(1).png"
                    >
                    <p class="project-grid-view-time">创建时间：{{ p.createTime | formatDate }}</p>
                    <div class="gird-operating-btns">
                        <el-button type="text" @click="toProjectHandle(p.key,'editor')">
                            <i class="el-icon-edit" />
                            编辑
                        </el-button>
                        <span>
                            <el-button
                                v-if="p.status!=1" type="text" @click="toProjectHandle(p.key,'statistics')"
                            >
                                <i class="el-icon-data-analysis" />
                                统计
                            </el-button>
                        </span>
                        <el-popconfirm
                            v-if="p.status==2"
                            title="确定停止收集该项目吗？"
                            @confirm="stopProject(p.key)"
                        >
                            <el-button slot="reference"
                                       class="pink-text-btn"
                                       type="text"
                            >
                                <i class="el-icon-video-pause" />
                                停止
                            </el-button>
                        </el-popconfirm>
                        <el-popconfirm
                            v-if="p.status!=2"
                            title="确定删除该项目吗？"
                            @confirm="deleteProject(p.key)"
                        >
                            <el-button slot="reference"
                                       class="pink-text-btn"
                                       type="text"
                            >
                                <i class="el-icon-delete" />
                                删除
                            </el-button>
                        </el-popconfirm>
                    </div>
                </div>
            </div>
            <div v-if="!projectListLoading&&projectList.length==0">
                <data-empty />
            </div>
        </div>
        <div v-if="dataShowType=='table'" class="project-table-view">
            <el-table
                :data="projectList"
                border
                empty-text="暂无数据"
                highlight-current-row

                stripe
                style="width: 100%;"
            >
                <el-table-column
                    align="center"
                    label="标题"
                    prop="name"
                    show-overflow-tooltip
                />
                <el-table-column
                    align="center"
                    label="描述"
                    prop="describe"
                    show-overflow-tooltip
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
                    label="创建时间"
                    prop="createTime"
                />
                <el-table-column
                    align="center"
                    label="更新时间"
                    prop="updateTime"
                />
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   @click="toProjectHandle(scope.row.key,'editor')"
                        >
                            编辑
                        </el-button>
                        <span>
                            <el-button
                                v-if="scope.row.status!=1"
                                class="green-text-btn"
                                type="text"
                                @click="toProjectHandle(scope.row.key,'statistics')"
                            >
                                统计
                            </el-button>
                        </span>
                        <el-popconfirm
                            v-if="scope.row.status==2"
                            title="确定停止收集该项目吗？"
                            @confirm="stopProject(scope.row.key)"
                        >
                            <el-button slot="reference"
                                       class="pink-text-btn"
                                       type="text"
                            >
                                停止
                            </el-button>
                        </el-popconfirm>
                        <el-popconfirm
                            v-if="scope.row.status!=2"
                            title="确定删除该项目吗？"
                            @confirm="deleteProject(scope.row.key)"
                        >
                            <el-button slot="reference"
                                       class="pink-text-btn"
                                       type="text"
                            >
                                删除
                            </el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="project-page-view">
            <el-pagination
                v-if="total>10"
                :current-page.sync="queryParams.current"
                :page-size.sync="queryParams.size"
                :total="total"
                background
                layout="total, prev, pager, next"
                @current-change="queryProjectPage"
            />
        </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'

let projectStatusList = [
    {code: 1, name: '未发布', color: '#006EFF'},
    {code: 2, name: '收集中', color: '#34C82A'},
    {code: 3, name: '已结束', color: '#955A45'}
]

export default {
    name: 'MyProject',
    filters: {
        formatDate(time) {
            return dayjs(time).format('YYYY/MM/DD')
        }
    },
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
            this.$router.push({path: `/project/form/${type}`, query: {key: key, active: type}})
        },
        deleteProject(key) {
            this.$api.post('/user/project/delete', {'key': key}).then(res => {
                if (res.data) {
                    this.msgSuccess('刪除成功')
                    this.queryProjectPage()
                }
            })
        },
        stopProject(key) {
            this.$api.post('/user/project/stop', {'key': key}).then(res => {
                if (res.data) {
                    this.msgSuccess('停止成功')
                    this.queryProjectPage()
                }
            })
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
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 100);
    text-align: center;
    margin: 20px;
    position: relative;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
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
