<template>
    <div class="project-logic-container">
        <el-scrollbar class="scrollbar-container">
            <el-row align="middle" class="header-row" justify="center" type="flex">
                <el-col :span="12">
                    <p class="logic_title">
                        显示逻辑
                    </p>
                </el-col>
                <el-col :span="12">
                    <el-tooltip placement="top" popper-class="question-popper">
                        <div slot="content">
                            符合某项条件，则显示某道题<br>点击查看帮助
                        </div>
                        <i class="el-icon-question" />
                    </el-tooltip>
                </el-col>
            </el-row>
            <div class="show-logic-container">
                <div v-if="!logicList.length" class="not-logic-container">
                    <el-row>
                        <el-col :offset="10" :span="5">
                            <el-button type="text" @click="addLogicHandle">
                                <i class="el-icon-circle-plus-outline" />
                                <span class="label">添加逻辑</span>
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
                <div v-else class="logic-item-container">
                    <el-row align="middle" justify="center" type="flex">
                        <el-col :offset="1" :span="10">
                            <p>共 {{ logicList.length }}. 条显示逻辑</p>
                        </el-col>
                        <el-col :offset="6" :span="6">
                            <el-button size="mini" type="primary" @click="addLogicHandle">
                                <i class="el-icon-plus" />
                                <span class="label">添加逻辑</span>
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-divider />
                    <div v-for="(logicItem,index) in logicList"
                         :key="index"
                    >
                        <el-row align="middle" justify="center" type="flex">
                            <el-col :offset="1" :span="7">
                                <span class="mr-10">{{ index + 1 }}.</span>
                                <el-select
                                    v-model="logicItem.formItemId"
                                    :disabled="!!logicItem.formItemId" placeholder="请选择问题"
                                >
                                    <el-option
                                        v-for="item in getProjectItemList(logicItem.formItemId) "
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.formItemId"
                                    />
                                </el-select>
                            </el-col>
                            <el-col :span="2">
                                <span>符合以下</span>
                            </el-col>
                            <el-col :span="4">
                                <el-select v-model="logicItem.expression" placeholder="请选择">
                                    <el-option
                                        v-for="item in questionOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </el-col>
                            <el-col :offset="1" :span="9">
                                <span>条件时显示此问题：</span>
                            </el-col>
                        </el-row>
                        <el-row
                            v-for="(cItem,cIndex) in logicItem.conditionList"
                            :key="cIndex"
                            :gutter="20"
                            align="middle" class="mt-5" justify="center" type="flex"
                        >
                            <el-col :offset="1" :span="6">
                                <el-select v-model="cItem.formItemId" placeholder="请选择题目">
                                    <el-option
                                        v-for="item in getConditionProjectItemList(logicItem)"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.formItemId"
                                    />
                                </el-select>
                            </el-col>
                            <el-col :span="5">
                                <el-select v-model="cItem.expression" placeholder="请选择条件">
                                    <el-option
                                        v-for="item in conditionOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </el-col>
                            <el-col :span="6">
                                <el-select v-model="cItem.optionValue" placeholder="请选择选项">
                                    <el-option
                                        v-for="item in getFormItemOptions(cItem.formItemId)"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </el-col>
                            <el-col :span="9">
                                <el-button type="text" @click="addConditionHandle(logicItem)">
                                    <i class="el-icon-circle-plus-outline" />
                                </el-button>
                                <el-button class="remove"
                                           type="text"
                                           @click="removeConditionHandle(logicItem,index,cIndex)"
                                >
                                    <i class="el-icon-remove-outline" />
                                </el-button>
                            </el-col>
                        </el-row>
                        <el-divider />
                    </div>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import _ from 'lodash'
import {jsonSimpleClone} from '@/utils'
import {getFormLogicRequest, listProjectItemRequest, saveFormLogicRequest} from '@/api/project/form'
import {debounce} from 'throttle-debounce'

export default {
    name: 'ProjectLogic',
    components: {},
    data() {
        return {
            formKey: '',
            // 默认逻辑项
            defaultLogicItem: {
                formItemId: null,
                expression: 1,
                conditionList: [
                    {
                        formItemId: null,
                        expression: null,
                        optionValue: null
                    }
                ]
            },
            conditionOptions: [{
                value: 'eq',
                label: '选中'
            }, {
                value: 'ne',
                label: '未选中'
            }],
            questionOptions: [{
                value: 1,
                label: '全部'
            }, {
                value: 2,
                label: '任意'
            }],
            allProjectItemList: [],
            logicList: []
        }
    },
    watch: {
        logicList: {
            handler(val) {
                if (val) {
                    this.saveProjectLogic(val)
                }
            },
            deep: true
        }
    },
    mounted() {
        this.formKey = this.$route.query.key
        this.queryProjectItems()
        this.queryProjectLogic()
    },
    methods: {
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
            let newLogicItem = jsonSimpleClone(this.defaultLogicItem)
            this.logicList.push(newLogicItem)
        },
        getConditionProjectItemList(logicItem) {
            let showFormItemId = logicItem.formItemId
            if (!showFormItemId) {
                return
            }
            // 控制显示的条件只能使用在显示问题的前面
            let conditionProjectItemList = jsonSimpleClone(this.allProjectItemList)
            let index = conditionProjectItemList.findIndex(item => item.formItemId == showFormItemId)
            conditionProjectItemList = _.slice(conditionProjectItemList, 0, index)
            conditionProjectItemList = conditionProjectItemList.filter(item => {
                return ['RADIO', 'CHECKBOX', 'SELECT', 'IMAGE_SELECT'].includes(item.type)
            })
            return conditionProjectItemList
        },
        getProjectItemList(formItemId) {
            // 每个问题只能有一个逻辑设置项 已经设置不允许选择
            let selectedFormItemList = this.logicList.map(item => item.formItemId)
            let projectItemList = jsonSimpleClone(this.allProjectItemList)
            // 第一个问题不允许隐藏
            projectItemList.shift()
            return projectItemList.filter(item => {
                return !selectedFormItemList.includes(item.id) || item.formItemId == formItemId
            })
        },
        getFormItemOptions(formItemId) {
            let formItem = this.allProjectItemList.find(item => item.formItemId == formItemId)
            if (formItem) {
                return formItem.scheme.config.options
            }
            return []
        },
        queryProjectLogic() {
            getFormLogicRequest({formKey: this.formKey}).then(res => {
                if (res.data) {
                    this.logicList = res.data.scheme ? res.data.scheme : []
                }
            })
        },
        queryProjectItems() {
            listProjectItemRequest({key: this.formKey}).then(res => {
                this.allProjectItemList = res.data
            })
        },
        saveProjectLogic: debounce(430, true, function(logicList) {
            let data = {formKey: this.formKey, scheme: logicList}
            saveFormLogicRequest(data).then(res => {

            })
        })
    }

}
</script>

<style lang="scss" scoped>
.project-logic-container {
  width: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
  position: relative;
  overflow: hidden;

  .scrollbar-container {
    height: 100%;
  }

  .header-row {
    width: 230px;
  }

  .logic_title {
    font-size: 18px;
    height: 45px;
    line-height: 45px;
    color: #484848;
    text-indent: 20px;
    padding-top: 20px;
  }
}

::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}

.not-logic-container {
  .el-icon-circle-plus-outline {
    font-size: 20px;
  }

  .label {
    font-size: 18px;
  }
}

.logic-item-container {
  .tips {
    font-size: 14px;
    color: #aaa;
  }

  .label {
    font-size: 15px;
  }

  .remove {
    color: #ff4949;
  }
}

.el-icon-question {
  font-size: 23px;
  height: 50px;
  line-height: 50px;
  text-indent: 20px;
  padding-top: 23px;
  color: #d8d8d8;
}

.show-logic-container {
  padding: 10px;
  min-width: 950px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.el-icon-circle-plus-outline,
.el-icon-remove-outline {
  font-size: 24px;
}
</style>
<style>
.question-popper.el-tooltip__popper[x-placement^="top"] .popper__arrow {
  /* border-top-color: #205bb5 !important; */
}

.question-popper.el-tooltip__popper[x-placement^="top"] .popper__arrow::after {
  /* border-top-color: #205bb5 !important; */
}

.question-popper {
  padding: 10px;
  color: #000 !important;
  border-color: #205bb5 !important;
  background: #fff !important;
}

</style>
