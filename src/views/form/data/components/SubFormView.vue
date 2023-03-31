<template>
  <div>
    <el-table class="form-table" :row-key="(record) => record.key" :data="model">
      <template>
        <el-table-column label="序号" align="center" type="index" width="50" />
        <template v-for="(option, index) in fields">
          <el-table-column :key="index" :label="getTableColumnLabel(option)" align="center">
            <template #default="scope">
              {{ showText(scope.row, option.vModel) }}
            </template>
          </el-table-column>
        </template>
        <el-table-column label="操作" align="center" width="300">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleViewData(scope.$index, scope.row)">
              <i class="el-icon-view" />查看
            </el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-dialog title="详情" :visible.sync="dialogVisible" width="40%" append-to-body>
      <ViewData :fields="viewFields" :page-form-model="pageFormModel" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { removeHtmlTag } from '@/utils/index'
import _ from 'lodash'

export default {
  name: 'SubFormView',
  components: {},
  props: {
    model: {
      type: Array,
      default: () => []
    },
    fields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      pageFormModel: {}
    }
  },
  computed: {
    viewFields() {
      return this.fields.map((item) => {
        const isLabel = this.isLabelTag(item.vModel)
        // 特殊处理单选多选等组件 不然会直接显示选中的id
        return {
          label: removeHtmlTag(item.config.label),
          value: isLabel ? `${item.vModel}label` : item.vModel,
          type: item.typeId,
          scheme: item
        }
      })
    }
  },
  beforeCreate() {
    this.$options.components.ViewData = require('../ViewData').default
  },
  methods: {
    getTableColumnLabel(option) {
      return removeHtmlTag(option.config.label)
    },
    showText(row, key) {
      if (this.isLabelTag(key)) {
        return row[`${key}label`]
      }
      return row[key]
    },
    handleViewData(index, row) {
      this.dialogVisible = true
      this.pageFormModel = row
    },
    isLabelTag(key) {
      if (
        _.startsWith(key, 'radio') ||
        _.startsWith(key, 'checkbox') ||
        _.startsWith(key, 'select') ||
        _.startsWith(key, 'image_select') ||
        _.startsWith(key, 'cascader')
      ) {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.matrix-table {
  font-family: verdana, arial, sans-serif;
  font-size: 11px;
  color: #303133;
  border-width: 1px;
  border-color: #dcdfe6;
  border-collapse: collapse;
  width: 90%;
  overflow: auto;
}

.matrix-table {
  display: block;
  overflow-y: scroll;
}

.matrix-table th {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #dcdfe6;
  background-color: #dedede;
}

.matrix-table td {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #dcdfe6;
  background-color: #ffffff;
  word-break: break-all;
  text-align: center;
}
</style>
