<template>
    <div class="my-project-container">
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
                    <el-radio-group v-model="queryParams.status" size="small" @change="queryProjectPage">
                        <el-radio-button v-for="status in projectStatusList" :key="status.code" :label="status.code">
                            {{ status.name }}
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <div v-if="dataShowType=='gird'" class="project-grid-container">
            <div
                class="project-grid-view"
            >
                <div v-for="p in projectList" :key="p.id" class="project-grid-item-view" :span="4">
                    <span v-for="status in projectStatusList" :key="status.code">
                        <span
                            v-if="status.code==p.status"
                            :style="{backgroundColor:status.color,borderColor:status.color}"
                            class="project-grid-view-status"
                        />
                    </span>
                    <p>
                        {{ p.name }}
                    </p>
                    <img class="project-grid-view-preimg"
                         src="https://freebrio.oss-cn-shanghai.aliyuncs.com/t/pic%20(1).png"
                    >
                    <p class="project-grid-view-time">创建时间：2020/12/8</p>
                </div>
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
                                 @click="$router.push({path: '/project/form', query: {key: scope.row.key,active:1}})"
                        >
                            编辑
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
                layout="prev, pager, next"
                :total="total"
                @current-change="queryProjectPage"
            />
        </div>
    </div>
</template>
<script>
let projectStatusList = [
    {code: 1, name: '未发布', color: '#006EFF'},
    {code: 2, name: '收集中', color: '#34C82A'},
    {code: 4, name: '已结束', color: '#955A45'}
]

export default {
    name: 'MyProject',
    components: {},
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
            projectList: []
        }
    },
    computed: {},
    created() {
        this.queryProjectPage()
    },

    methods: {
        switchDataShowTypeHandle(type) {
            this.dataShowType = type
        },
        getStatusColorClass(code) {
            let color = this.projectStatusList.find(item => item.code = code).color
            return {
                backgroundColor: color,
                borderColor: color
            }

        },
        queryProjectPage() {
            this.$api.get('/user/project/page', {
                params: this.queryParams
            }).then(res => {
                let {records, total, size} = res.data
                this.projectList = records
                this.total = total
                this.queryParams.size = size
            })
        }
    }
}
</script>

<style scoped>
.my-project-container {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: center;
}
.filter-view {
    margin-top: 40px;
    display: flex;
    flex-direction: row;
}
.title {
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    text-align: left;
    line-height: 20px;
}
.show-view-type-icon {
    width: 17px;
    height: 17px;
    color: #a8a8a8;
    font-size: 20px;
    margin: 5px;
    cursor: pointer;
}
.show-view-type-icon-active {
    color: rgba(92, 155, 249, 100);
}
.project-grid-container {
    margin-top: 20px;
    display: flex;
    width: 100%;
    justify-content: center;
}
.project-grid-view {
    display: flex;
    width: 60%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
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
    border: 1px solid rgba(255, 255, 255, 100);
    margin: 10px;
    position: relative;
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
    position: absolute;
    left: 10px;
    top: 20px;
}
.project-grid-view-preimg {
    width: 143px;
    height: 121px;
}
.project-grid-view-time {
    color: rgba(144, 147, 153, 100);
    font-size: 12px;
    line-height: 20px;
    text-align: left;
    margin: 0;
}
.project-page-view {
    margin-top: 30px;
}
</style>
