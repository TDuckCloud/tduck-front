<template>
  <div class="project-logic-container">
    <el-scrollbar class="scrollbar-container">
      <p class="logic_title">逻辑设置</p>
      <p class="text-desc">
        你可以为选择字段（单项选择、多项选择、图片单选、图片多选、评分、下拉框、）设定一些规则：在填写者选择某选项后，触发显示其他显示字段
      </p>
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
              <el-tag class="message-tag" effect="plain" :type="isSave">{{ saveMessage }}</el-tag>
            </el-col>
            <el-col :offset="6" :span="6">
              <el-button size="mini" icon="el-icon-plus" :loading="isLoading" type="primary" @click="addLogicHandle">
                <i class="" />
                <span class="label">添加逻辑</span>
              </el-button>
            </el-col>
          </el-row>
          <el-divider />
          <div v-for="(logicItem, index) in logicList" :key="logicItem.id" class="logic-item">
            <div class="logic-item-delete" @click="handleRemoveLogicItem(index)">
              <i class="el-icon-delete" />
            </div>
            <el-row
              v-for="(cItem, cIndex) in logicItem.conditionList"
              :key="cIndex"
              :gutter="20"
              align="middle"
              class="mt5"
              justify="center"
              type="flex"
            >
              <el-col :span="3" class="text-center">
                <span v-if="cIndex === 0">如果：</span>
                <el-select
                  v-else
                  v-model="cItem.relation"
                  :disabled="cIndex !== 1"
                  @change="(val) => relationChangeHandle(val, logicItem)"
                >
                  <el-option label="并且" value="AND" />
                  <el-option label="或者" value="OR" />
                </el-select>
              </el-col>
              <el-col :span="7">
                <el-select
                  v-model="cItem.formItemId"
                  placeholder="请选择题目"
                  style="width: 80%"
                  @change="handleConditionChange(cItem)"
                >
                  <el-option
                    v-for="item in getConditionProjectItemList(logicItem)"
                    :key="item.id"
                    :label="item.textLabel"
                    :value="item.formItemId"
                  />
                </el-select>
              </el-col>
              <el-col :span="5">
                <el-select v-model="cItem.expression" placeholder="请选择条件">
                  <el-option
                    v-for="item in getConditionOptions(cItem.formItemId)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
              <el-col :span="6">
                <!--  下拉问题使用选项-->
                <el-select
                  v-if="getFormItemIdType(cItem.formItemId) !== 'RATE'"
                  v-model="cItem.optionValue"
                  placeholder="请选择选项"
                >
                  <el-option
                    v-for="item in getFormItemOptions(cItem.formItemId)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <!--  评分使用数字框-->
                <el-input-number v-else v-model="cItem.optionValue" :min="0" />
              </el-col>
              <el-col :span="6">
                <el-button type="text" @click="addConditionHandle(logicItem, cItem)">
                  <i class="el-icon-circle-plus-outline" />
                </el-button>
                <el-button
                  v-if="cIndex !== 0"
                  class="remove"
                  type="text"
                  @click="removeConditionHandle(logicItem, index, cIndex)"
                >
                  <i class="el-icon-remove-outline" />
                </el-button>
              </el-col>
            </el-row>
            <div class="mt20" />
            <el-row v-for="(trigger, tindex) in logicItem.triggerList" :key="`t1${tindex}`" align="middle" type="flex">
              <el-col :span="3" class="text-center">
                <span>则显示</span>
              </el-col>
              <el-col :span="14">
                <el-select v-model="trigger.formItemId" placeholder="请选择问题">
                  <el-option
                    v-for="item in getTriggerItemList(logicItem)"
                    :key="item.id"
                    :label="item.textLabel"
                    :value="item.formItemId"
                    :disabled="item.disabled"
                  />
                </el-select>
                <span class="ml20">否则不显示</span>
              </el-col>
              <el-col :span="6">
                <el-button type="text" @click="addTriggerItemHandle(logicItem)">
                  <i class="el-icon-circle-plus-outline" />
                </el-button>
                <el-button
                  v-if="tindex !== 0"
                  class="remove"
                  type="text"
                  @click="removeTriggerItemHandle(logicItem, index, tindex)"
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
import { jsonSimpleClone } from '@/utils'
import { getFormLogicRequest, listProjectItemRequest, saveFormLogicRequest } from '@/api/project/form'
import { debounce } from 'throttle-debounce'

export default {
  name: 'ProjectLogic',
  components: {},
  data() {
    return {
      saveMessage: '',
      isSave: 'info',
      isLoading: false,
      formKey: '',
      // 默认逻辑结构
      defaultLogicItem: {
        // 触发内容
        triggerList: [
          {
            formItemId: null,
            type: 'show'
          }
        ],
        // 逻辑条件
        conditionList: [
          {
            // 问题
            formItemId: null,
            // 条件 == > < >= <=
            expression: null,
            // 值
            optionValue: null,
            // 关系
            relation: 'AND'
          }
        ]
      },
      conditionOptions: [
        {
          value: 'eq',
          label: '选中'
        },
        {
          value: 'ne',
          label: '未选中'
        },
        {
          value: 'gt',
          label: '大于',
          types: ['RATE']
        },
        {
          value: 'ge',
          label: '大于等于',
          types: ['RATE']
        },
        {
          value: 'lt',
          label: '小于',
          types: ['RATE']
        },
        {
          value: 'le',
          label: '小于等于',
          types: ['RATE']
        }
      ],
      allProjectItemList: [],
      logicList: []
    }
  },
  watch: {
    logicList: {
      handler(val) {
        if (val) {
          this.saveProjectLogic(val)
          this.isSave = 'info'
          this.saveMessage = '正在处理'
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
    addConditionHandle(logicItem, cItem) {
      logicItem.conditionList.push({ relation: cItem.relation })
    },
    removeConditionHandle(logicItem, logicIndex, index) {
      logicItem.conditionList.splice(index, 1)
    },
    addTriggerItemHandle(logicItem) {
      logicItem.triggerList.push({})
    },
    removeTriggerItemHandle(logicItem, logicIndex, index) {
      logicItem.triggerList.splice(index, 1)
    },
    addLogicHandle() {
      this.isLoading = true
      let newLogicItem = jsonSimpleClone(this.defaultLogicItem)
      newLogicItem.id = new Date().getTime()
      this.logicList.push(newLogicItem)
    },
    getConditionOptions(formItemId) {
      if (!formItemId) return []
      // 截取第一个数字前面的字符串
      let type = formItemId.replace(/\d+/, '').toUpperCase()
      let conditionOptions = jsonSimpleClone(this.conditionOptions)
      if (type === 'RATE') {
        // 移除前两个选项
        conditionOptions.splice(0, 2)
      } else {
        conditionOptions.splice(2, 4)
      }
      return conditionOptions
    },
    // 处理逻辑连接 只允许同时and 或者同时OR 负责逻辑会冲突
    relationChangeHandle(val, logicItem) {
      logicItem.conditionList.forEach((item) => {
        item.relation = val
      })
    },
    // 获取条件可选择问题
    getConditionProjectItemList(logicItem) {
      return jsonSimpleClone(this.allProjectItemList).filter((item) => {
        return ['RADIO', 'CHECKBOX', 'SELECT', 'IMAGE_SELECT', 'RATE'].includes(item.type)
      })
    },
    // 获取显示问题可选择问题
    getTriggerItemList(logicItem) {
      // 作为逻辑条件的问题不能作为显示问题·
      let selectedFormItemList = logicItem.conditionList.map((item) => item.formItemId)
      let projectItemList = jsonSimpleClone(this.allProjectItemList)
      projectItemList.forEach((item) => {
        if (selectedFormItemList.includes(item.formItemId)) {
          item.disabled = true
        }
      })
      return projectItemList
    },
    /**
     * 获取选择问题的选项
     * @param formItemId
     * @returns {*[]|*}
     */
    getFormItemOptions(formItemId) {
      let formItem = this.allProjectItemList.find((item) => item.formItemId == formItemId)
      if (formItem) {
        return formItem.scheme.config.options
      }
      return []
    },
    handleConditionChange(cItem) {
      this.$set(cItem, 'optionValue', null)
    },
    handleRemoveLogicItem(index) {
      console.log(index)
      // console.log(this.logicList.splice(index, 1))
      this.logicList.splice(index, 1)
    },
    getFormItemIdType(formItemId) {
      if (!formItemId) return ''
      return formItemId.replace(/\d+/, '').toUpperCase()
    },
    // 查询项目逻辑数据
    queryProjectLogic() {
      getFormLogicRequest({ formKey: this.formKey }).then((res) => {
        if (res.data) {
          this.logicList = res.data.scheme ? res.data.scheme : []
        }
      })
    },
    //
    queryProjectItems() {
      listProjectItemRequest({ key: this.formKey }).then((res) => {
        this.allProjectItemList = res.data.filter((item) => {
          return item.type !== 'PAGINATION'
        })
      })
    },
    saveProjectLogic: debounce(430, true, function (logicList) {
      let data = { formKey: this.formKey, scheme: logicList }
      saveFormLogicRequest(data).then((res) => {
        this.isLoading = false
        this.isSave = ''
        this.saveMessage = '已保存'
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
    margin-bottom: 20px;
  }

  .logic_title {
    font-size: 18px;
    height: 45px;
    line-height: 45px;
    color: #484848;
    text-align: left;
    margin-top: 20px;
  }
}

.text-desc {
  font-size: 14px;
  line-height: 20px;
  color: #9b9b9b;
  margin-bottom: 10px;
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

.show-logic-container {
  padding: 10px;
  min-width: 950px;
  background-color: #fff;
  height: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.el-icon-circle-plus-outline,
.el-icon-remove-outline {
  font-size: 24px;
}

.logic-item {
  position: relative;

  .logic-item-delete {
    position: absolute;
    right: 20px;
    top: -15px;
    color: #ff4d4f;
    cursor: pointer;
  }
}
</style>
