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
                         src="data:image/png;base64,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TKsoGiIiIiLy9HM+RaNP/K//Wap3NKa7CulEvy8MHw93DdJ1HL6zcVwZ2L+LEQpN+dzw2NEFoXI8h/Tbu795l6TusqVHRERERCTmrIrGmEOT7qVIpMVknNjfXy8bH9soCeNXmnbuAEx3MX72afihuFsw3X0Zn1uSlpcL39WoFqsxYV3ltsoM52E47ovcBRERERERuVjOoGgkxaJWBjYn3v2kv399uItxaPK9nXHb7753gTKQfn3q0GQ+vDYc01RINmXrGY9rXYrCvu5/JWosImMZ+uBS50VEREREZD/nc0djmpR/EP+L/J7+deFrQ6EczP+Vv/j9iWWSHSbola9khQzLhMl7caeimvCacd1jKZl+rpaCkPD8xnb7hDsPW0Wg+tzOnY6QcB7G5+Ox7By3iIiIiMglc3ZFY5i0b02qk8fnrwjFyf+9j+blY/kYJ+zbE+7w/KGvOA0T+GEbsYiMd0HSbafy0nNa0VgKUMx+aVlKRkgsGvHPyoaIiIiItM/5Fo1iAj8rCkgsFcvkfnSwaFQn8+nPZZKCUSlBQ/FJStBewQnZLRp9lvIwbrf+2mmfsv0pjyP87BfBRURERKRtnts7GjHzHYd+Un/8HY365D2/M7BkKBFTeVlnayJ/uaIREo9tqySEdQzPFSUrM5yT8XiVDRERERFplbMrGsMvd987fEcjTv6DYcJ+gTsaw7K1InPkhDzd9va/WHXJojHd1Ynn4viScOjOjIiIiIjI5XNeRSNM3EMBuOAdjbloFHc0xqQT/rFIbP8Cd8j+V42WknFoMr9XNLafm9dfHOfW4+soGiIiIiLy9HM2RSOUg3lyXxSK9A5CWQDKohH/1ap4R2Ncbpx4Dz8fnKiHjIVk2FblTslxWZeJ+FWodJ/GTAXomPVPdzr2/7UrRUNEREREnm7O546GiIiIiIicTRQNERERERFpHkVDRERERESaR9EQEREREZHmUTRERERERKR5FA0REREREWkeRUNERERERJpH0RARERERkeZRNEREREREpHkUDRERERERaR5FQ0REREREmkfREBERERGR5lE0RERERESkeRQNERERERFpHkVDRERERESaR9EQEREREZHmUTRERERERKR5FA0REREREWkeRUNERERERJpH0RARERERkeZRNEREREREpHkUDRERERERaR5FQ0REREREmkfREBERERGR5lE0RERERESkeRQNERERERFpHkVDRERERESaR9EQEREREZHmUTRERERERKR5FA0REREREWkeRUNERERERJpH0RARERERkeZRNEREREREpHkUDRERERERaR5FQ0REREREmkfREBERERGR5lE0RERERESkeRQNERERERFpHkVDRERERESaR9EQEREREZHmUTRERERERKR5FA0REREREWkeRUNERERERJpH0RARERERkeZRNEREREREpHkUDRERERERaR5FQ0REREREmkfREBERERGR5lE0RERERESkeRQNERERERFpHkVDRERERESaR9EQEREREZHmUTRERERERKR5FA0REREREWkeRUNERERERJpH0RARERERkeZRNEREREREpFleeeWV4X8VDRERERERaZJYMkIUDRERERERuXTSkhGiaIiIiIiIyKVSlowQRUNERERERE5OWTL8joaIiIiIiFwqWyUj5EqKxmcPH3Xff/+HaZMiIiIiInLu2SsZYe4fOkCtG2w5qWj86suvuse//WbarIiIiIiInHP2SkbI4yffdJ8/elLtBltOKhpfPPld9/DzL4cNurMhIiIiIvJ8Jsz1w5w/zP1DB6h1gy0nFY0gbCi0mnALJXxfCwAAeL6EuX6Y81+0ZAQnFw0AAIAtigYAANCcogEAADSnaAAAAM0pGgAAQHOKBgAA0JyiAQAANKdoAAAAzSkaAABAc4oGAADQnKIBAAA0p2gAAADNKRoAAEBzigYAANCcogEAADSnaAAAAM0pGgAAQHOKBgAA0JyiAQAANKdoAAAAzSkaAABAc4oGAADQnKIBAAA0p2gAAADNKRoAAEBzigYAANCcogEAADSnaAAAAM1dQdF40L31+ivdSzffXz9391b30sv9c6+/031YPPfh7TfGZe6/073Wv+a12w/G10+vHZ7vH79xN19uXmfmVnfn6/e7G6vHK8sDAACXdqmi8fjtH3bfvfpm91XluVky8R/KQu25StG4czMs80b31t1YNN4fC0t47P5UXoYCkS8X1xkLxLiepGjEwlO8DgAAaOe0ovHJT7pvf/CT7vF7b3bf9f/7VV84vn37Yf21wXBX4lZfGt7PC8VO0RiWeb0vCEXRGIrBdJdjWDYxPJcUm4U7GgAAcJVOKhrjnYxXc6F4VF67a7No1EvBqC8sw9emwp2N5LW1r2ZN4tes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"
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
                    prop="description"
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
import {createFormRequest, deleteFormRequest, pageFormRequest, stopFormRequest} from '@/api/project/form'

export default {
    name: 'MyProject',
    filters: {
        formatDate(time) {
            return dayjs(time).format('YYYY/MM/DD')
        }
    },
    data() {
        return {
            dialogVisible: false,
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
            formData: {
                description: '',
                name: '问卷名称'
            },
            projectStatusList: [
                {code: 1, name: '未发布', color: '#006EFF'},
                {code: 2, name: '收集中', color: '#34C82A'},
                {code: 3, name: '已结束', color: '#955A45'}
            ],
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
        createFormHandle() {
            this.$refs['createForm'].validate(valid => {
                if (valid) {
                    createFormRequest(this.formData).then(res => {
                        this.$router.push({path: '/project/form', query: {key: res.data}})
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })

        },
        switchDataShowTypeHandle(type) {
            this.dataShowType = type
        },
        toProjectHandle(key, type) {
            this.$router.push({path: `/project/form/${type}`, query: {key: key, active: type}})
        },
        deleteProject(key) {
            deleteFormRequest({'key': key}).then(res => {
                if (res.data) {
                    this.msgSuccess('刪除成功')
                    this.queryProjectPage()
                }
            })
        },
        stopProject(key) {
            stopFormRequest({'key': key}).then(res => {
                if (res.data) {
                    this.msgSuccess('停止成功')
                    this.queryProjectPage()
                }
            })
        },
        queryProjectPage() {
            pageFormRequest(
                this.queryParams
            ).then(res => {
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
  width: 1045px;
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
