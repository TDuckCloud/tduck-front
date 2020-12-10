<template>
    <div class="my-project-container">
        <div class="filter-view">
            <el-row type="flex" align="middle" justify="center" style="height: 50px;">
                <el-col :span="3">
                    <font-icon class="fas fa-th-large show-view-type-icon show-view-type-icon-active" />
                    <font-icon class="fas  fa-th-list show-view-type-icon" />
                </el-col>
                <el-col :span="3">
                    <span class="title">项目更新时间</span>
                </el-col>
                <el-col :span="10">
                    <el-date-picker
                        style="width: 50%;"
                        type="datetime"
                        placeholder="选择开始时间"
                    />
                    <el-date-picker
                        style="width: 50%;"
                        type="datetime"
                        placeholder="选择结束时间"
                    />
                </el-col>
                <el-col :span="4" :offset="1">
                    <el-input v-model="queryParams.name" type="text" placeholder="请输入项目名称" />
                </el-col>
                <el-col :span="3" :offset="1">
                    <el-button type="primary" @click="queryProjectPage">查询</el-button>
                </el-col>
                <el-col :span="6">
                    <el-button>
                        <font-icon class="fas fa-plus-square" />
                        新建文件夹
                    </el-button>
                    <el-button>
                        <font-icon class="fas fa-recycle" />
                        回收站
                    </el-button>
                </el-col>
            </el-row>
            <el-row type="flex" align="middle" justify="center" style="height: 50px;">
                <el-col :span="2" :offset="3">
                    <span class="title">项目状态</span>
                </el-col>
                <el-col :span="6">
                    <el-radio-group v-model="queryParams.status" size="small" @change="queryProjectPage">
                        <el-radio-button v-for="status in projectStatusList" :key="status.code" :label="status.code">
                            {{ status.name }}
                        </el-radio-button>
                    </el-radio-group>
                </el-col>
                <el-col :span="13" />
            </el-row>
        </div>
        <div class="project-grid-view">
            <el-row>
                <el-col v-for="p in projectList" :key="p.id" class="project-grid-item-view" :span="4">
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
                </el-col>
            </el-row>
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
            total: 0,
            queryParams: {
                current: 1,
                size: 10,
                name: '',
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
    margin: 0;
    padding: 0;
    width: 100%;
    height: 80vh;
    overflow-x: hidden !important;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.filter-view {
    margin-top: 40px;
    width: 60%;
}
.title {
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    text-align: left;
    line-height: 20px;
}
.show-view-type-icon {
    width: 20px;
    height: 20px;
    color: #a8a8a8;
    font-size: 20px;
    margin: 5px;
}
.show-view-type-icon-active {
    color: rgba(92, 155, 249, 100);
}
.project-grid-view {
    margin-top: 20px;
    width: 60%;
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
    border-radius: 80px;
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
