<template>
    <div>
        <span>筛选出符合以下</span>
        <el-select v-model="filterParams.rel" placeholder="请选择">
            <el-option
                v-for="item in relList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>
        <span>条件的数据</span>
        <div>
            <el-link :underline="false"
                     type="primary"
                     @click="addConditionHandle"
            >
                <i class="el-icon-plus " />添加过滤条件
            </el-link>
        </div>
        <div v-if="filterParams.conditionList.length">
            <el-row
                v-for="(item,index) in filterParams.conditionList"

                :key="index"
                :gutter="10"
                align="middle" class="mt5" justify="center" type="flex"
            >
                <el-col :span="7">
                    <el-select v-model="item.formItemId" filterable placeholder="请选择"
                               @change="((val)=>{handleConditionChange(val,item)})"
                    >
                        <el-option
                            v-for="field in fields"
                            :key="field.value"
                            :label="field.label"
                            :value="field.value"
                        />
                    </el-select>
                </el-col>
                <el-col :span="7">
                    <el-select v-model="item.method" placeholder="请选择条件">
                        <el-option
                            v-for="c in getConditionRuleList(item)"
                            :key="c.value"
                            :label="c.label"
                            :value="c.value"
                        />
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <el-select
                        v-if="item.field&&['SELECT','CHECKBOX','RADIO'].includes(item.field.type)&&['INCLUDE','NOT_INCLUDE','EQ','NE'].includes(item.method)"
                        v-model="item.value"
                        :multiple="['INCLUDE','NOT_INCLUDE'].includes(item.method)"
                        allow-create
                        clearable
                        default-first-option
                        filterable
                        placeholder="请选择选项"
                    >
                        <el-option
                            v-for="option in item.field.scheme.config.options"
                            :key="option.value"
                            :label="option.label"
                            :value="option.label"
                        />
                    </el-select>
                    <el-date-picker
                        v-else-if="item.field&&['DATE'].includes(item.field.type)"
                        v-model="item.value"
                        :disabled="['IS_NULL','NOT_NULL'].includes(item.method)"
                        :format="getObjValue(item.field.scheme,'format',defaultDateTimeFormat)"
                        :type="getObjValue(item.field.scheme,'type','datetime')"
                        :value-format="getObjValue(item.field.scheme,'value-format',defaultDateTimeFormat)"
                        placeholder="请选择选择日期"
                    />
                    <el-input v-else v-model="item.value" :disabled="['IS_NULL','NOT_NULL'].includes(item.method)"
                              placeholder="请输入条件值"
                    />
                </el-col>
                <el-col :span="3">
                    <i class="el-icon-delete" @click="removeConditionHandle(index)" />
                </el-col>
            </el-row>
        </div>
        <el-empty v-else description="暂无条件" />
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    name: 'DataFilter',
    props: {
        fields: {
            type: Array,
            default: null
        },
        formDataFilter: {
            type: Object,
            default: () => {
            }
        }
    },
    data() {
        return {
            relList: [
                {
                    label: '所有',
                    value: 'AND'
                },
                {
                    label: '任一',
                    value: 'OR'
                }
            ],
            // 每个组件类型包含的筛选方法
            typeIncludeMethods: {
                'INPUT': ['EQ', 'NE', 'GT', 'LT', 'GE', 'LE', 'INCLUDE', 'NOT_INCLUDE', 'IS_NULL', 'NOT_NULL'],
                'SELECT': ['EQ', 'NE', 'INCLUDE', 'NOT_INCLUDE', 'IS_NULL', 'NOT_NULL'],
                'RADIO': ['EQ', 'NE', 'INCLUDE', 'NOT_INCLUDE', 'IS_NULL', 'NOT_NULL'],
                'CHECKBOX': ['EQ', 'NE', 'INCLUDE', 'NOT_INCLUDE', 'IS_NULL', 'NOT_NULL'],
                'DATE': ['EQ', 'NE', 'GT', 'LT', 'GE', 'LE', 'IS_NULL', 'NOT_NULL']
            },
            // 全部类型
            conditionRuleOptions: [
                {
                    label: '等于',
                    value: 'EQ'
                },
                {
                    label: '不等于',
                    value: 'NE'
                },
                {
                    label: '大于',
                    value: 'GT'
                },
                {
                    label: '小于',
                    value: 'LT'
                },
                {
                    label: '大于等于',
                    value: 'GE'
                },
                {
                    label: '小于等于',
                    value: 'LE'
                },
                {
                    label: '包含',
                    value: 'INCLUDE'
                },
                {
                    label: '不包含',
                    value: 'NOT_INCLUDE'
                }, {
                    label: '为空',
                    value: 'IS_NULL'
                },
                {
                    label: '不为空',
                    value: 'NOT_NULL'
                }
            ],
            filterParams: {
                rel: 'AND',
                conditionList: []
            },
            // 可选择用户列表
            userList: [],
            defaultDateTimeFormat: 'yyyy-MM-dd HH:mm:ss'
        }
    },
    watch: {
        formDataFilter: {
            handler: function(val) {
                if (val) {
                    this.filterParams = val
                }
            },
            immediate: true
        },
        filterParams: {
            handler: function(val) {
                this.$emit('filter', val)
            },
            immediate: true
        }
    },
    methods: {
        /**
         * 从obj获取值 如果是undefined返回defaultValue
         * @param obj
         * @param key
         * @param defaultValue
         */
        getObjValue(obj, key, defaultValue) {
            return _.get(obj, key, defaultValue)
        },
        handleConditionChange(value, item) {
            let field = this.fields.find(field => field.value === value)
            this.$set(item, 'field', field)
            // 获取默认值
            if (field && field.scheme && field.scheme.config && field.scheme.config.defaultValue) {
                this.$set(item, 'defaultValueType', Array.isArray(field.scheme.config.defaultValue) ? 'ARRAY' : 'STRING')
            } else {
                this.$set(item, 'defaultValueType', 'USER' == field.type ? 'ARRAY' : 'STRING')
            }
        },
        getConditionRuleList(item) {
            if (!item && !item.formItemId) {
                return []
            }
            let field = this.fields.find(field => field.value === item.formItemId)
            let type = field && field.type
            let typeIncludeMethod = this.typeIncludeMethods[type]
            if (!type || !typeIncludeMethod) {
                typeIncludeMethod = ['IS_NULL', 'NOT_NULL']
            }
            return this.conditionRuleOptions.filter(item => typeIncludeMethod.includes(item.value))
        },
        removeConditionHandle(index) {
            this.filterParams.conditionList.splice(index, 1)
        },
        addConditionHandle() {
            if (!this.filterParams.conditionList) {
                this.filterParams.conditionList = []
            }
            this.filterParams.conditionList.push({
                formItemId: '',
                method: '',
                value: ''
            })
        }
    }
}
</script>

<style scoped>

</style>
