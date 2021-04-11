<template>
    <div class="project-logic-container">
        <el-scrollbar style="height: 90vh;">
            <el-row type="flex" style="width: 230px" justify="center" align="middle">
                <el-col :span="12">
                    <p class="logic_title">显示逻辑</p>
                </el-col>
                <el-col :span="12">
                    <el-tooltip popper-class="question-popper" placement="top">
                        <div slot="content">符合某项条件，则显示某道题<br/>点击查看帮助</div>
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </el-col>
            </el-row>
            <div class="show-logic-container">
                <div v-if="!logicList.length">
                    <el-row>
                        <el-col :offset="10">
                            <el-button type="text" @click="addLogicHandle">
                                <i class="el-icon-circle-plus-outline" style="font-size: 20px"></i>
                                <span style="font-size: 18px">添加逻辑</span>
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
                <div v-else>
                    <el-row type="flex" align="middle" justify="center">
                        <el-col :span="11" :offset="1">
                            <p style="font-size: 14px;color: #aaa">共 {{ logicList.length + 1 }}. 条显示逻辑</p>
                        </el-col>
                        <el-col :span="6" :offset="6">
                            <el-button type="primary" size="mini" @click="addLogicHandle">
                                <i class="el-icon-plus"></i>
                                <span style="font-size: 15px">添加逻辑</span>
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-divider/>
                    <div v-for="(logicItem,index) in logicList"
                         :key="index">
                        <el-row type="flex" align="middle" justify="center">
                            <el-col :offset="1" :span="6">
                                <span style="margin-right: 8px">{{ index + 1 }}.</span>
                                <el-select
                                    :disabled="!!logicItem.showFormItemId"
                                    v-model="logicItem.showFormItemId" placeholder="请选择问题">
                                    <el-option
                                        v-for="item in getProjectItemList() "
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="2">
                                <span>符合以下</span>
                            </el-col>
                            <el-col :span="4">
                                <el-select v-model="logicItem.showExpression" placeholder="请选择">
                                    <el-option
                                        v-for="item in questionOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :offset="1" :span="10">
                                <span>条件时显示此问题：</span>
                            </el-col>
                        </el-row>
                        <el-row
                            v-for="(cItem,cIndex) in logicItem.conditionList"
                            :key="cIndex"
                            :gutter="20"
                            style="margin-top: 5px" type="flex" align="middle" justify="center">
                            <el-col :offset="1" :span="6">
                                <el-select v-model="cItem.formItemId" placeholder="请选择题目">
                                    <el-option
                                        v-for="item in getConditionProjectItemList(logicItem)"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="5">
                                <el-select v-model="cItem.expression" placeholder="请选择条件">
                                    <el-option
                                        v-for="item in conditionOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="6">
                                <el-select v-model="cItem.optionValue" placeholder="请选择选项">
                                    <el-option
                                        v-for="item in getFormItemOptions(cItem.formItemId)"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="9">
                                <el-button type="text" @click="addConditionHandle(logicItem)">
                                    <i class="el-icon-circle-plus-outline"
                                       style="font-size: 24px"/>
                                </el-button>
                                <el-button type="text"
                                           style="color: #ff4949"
                                           @click="removeConditionHandle(logicItem,index,cIndex)">
                                    <i class="el-icon-remove-outline"
                                       style="font-size: 24px"/>
                                </el-button>

                            </el-col>
                        </el-row>
                        <el-divider/>
                    </div>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import _ from 'lodash'
import {jsonSimpleClone} from '@/utils/index'

export default {
    name: 'ProjectLogic',
    components: {},
    props: {
        projectKey: ''
    },
    mounted() {
        this.queryProjectItems()
    },
    data() {
        return {
            //默认逻辑项
            defaultLogicItem: {
                showFormItemId: null,
                showExpression: 'all',
                conditionList: [
                    {
                        formItemId: null,
                        expression: null,
                        optionValue: null
                    }
                ]
            },
            conditionOptions: [{
                value: 'checked',
                label: '选中'
            }, {
                value: 'unchecked',
                label: '未选中'
            }],
            questionOptions: [{
                value: 'all',
                label: '全部'
            }, {
                value: 'any',
                label: '任意'
            }],
            allProjectItemList: [],
            logicList: []
        }
    }, methods: {
        addConditionHandle(logicItem) {
            logicItem.conditionList.push({})
        },
        removeConditionHandle(logicItem, logicIndex, index) {
            logicItem.conditionList.splice(index, 1)
            if (logicItem.conditionList.length == 0) {
                this.logicList.splice(logicIndex, 1)
            }
        },
        addLogicHandle() {
            this.logicList.push(jsonSimpleClone(this.defaultLogicItem))
        },
        getConditionProjectItemList(logicItem) {
            let showFormItemId = logicItem.showFormItemId
            if (!showFormItemId) {
                return
            }
            //控制显示的条件只能使用在显示问题的前面
            let conditionProjectItemList = jsonSimpleClone(this.allProjectItemList)
            let index = conditionProjectItemList.findIndex(item => item.id == showFormItemId)
            conditionProjectItemList = _.slice(conditionProjectItemList, 0, index)
            conditionProjectItemList = conditionProjectItemList.filter((item) => {
                return ['RADIO','CHECKBOX','SELECT'].includes(item.type)
            })
            return conditionProjectItemList
        },
        getProjectItemList() {
            //每个问题只能有一个逻辑设置项 已经设置不允许选择
            let selectedFormItemList = this.logicList.map(item => item.showFormItemId)
            let projectItemList = jsonSimpleClone(this.allProjectItemList)
            projectItemList.shift()
            return projectItemList.filter((item) => {
                return !selectedFormItemList.includes(item.id)
            })
        },
        getFormItemOptions(formItemId) {
            let formItem = this.allProjectItemList.find(item => item.id == formItemId)
            if (formItem) {
                return formItem.expand.options
            }
            return []
        },
        queryProjectItems() {
            this.$api.get(`/user/project/item/list`, {params: {key: this.projectKey}}).then(res => {
                this.allProjectItemList = res.data
                // //可以控制被隐藏的问题 除了第一个问题 都可以被隐藏
                // let projectItemList = res.data
                // projectItemList.shift()
                // this.projectItemList = projectItemList
            })
        }
    }

}
</script>

<style scoped>
.project-logic-container {
    width: 100%;
    padding: 0px;
    margin: 0;
    background-color: #F7F7F7;
    min-height: 84vh;
    min-width: 80vw;
    display: flex;
    justify-content: center;
}

.project-logic-container .logic_title {
    font-size: 18px;
    height: 45px;
    line-height: 45px;
    color: #484848;
    text-indent: 20px;
    padding-top: 20px;
}

.el-icon-question {
    font-size: 23px;
    height: 50px;
    line-height: 50px;
    text-indent: 20px;
    padding-top: 23px;
    color: #D8D8D8;
}

.show-logic-container {
    padding: 10px;
    min-width: 950px;
    background-color: #FFFFFF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}

</style>
<style>
.question-popper.el-tooltip__popper[x-placement^="top"] .popper__arrow {
    /*border-top-color: #205bb5 !important;*/
}

.question-popper.el-tooltip__popper[x-placement^="top"] .popper__arrow:after {
    /*border-top-color: #205bb5 !important;*/
}

.question-popper {
    padding: 10px;
    color: #000000 !important;
    border-color: #205bb5 !important;
    background: #FFFFFF !important;
}


</style>
