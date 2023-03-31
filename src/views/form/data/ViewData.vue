<template>
  <el-form ref="form" label-width="80px" label-position="top" class="view-form">
    <div v-for="field in tempFields" :key="field.value">
      <el-form-item class="ml15">
        <template slot="label">
          <label class="field-label">{{ field.label }}</label>
        </template>
        <!--  滑动题-->
        <div v-if="field.type === 'SORT'">
          <div v-if="pageFormModel[field.value]">
            <text-copy v-for="sort in pageFormModel[field.value]" :key="sort.value" class="mb5" :text="sort.label" />
          </div>
        </div>
        <div v-else-if="field.type === 'UPLOAD'">
          <div v-if="pageFormModel[field.value]">
            <file-list :files="pageFormModel[field.value]" />
          </div>
        </div>
        <div v-else-if="field.type === 'IMAGE_UPLOAD'">
          <div v-if="pageFormModel[field.value]">
            <img-list :image-list="pageFormModel[field.value]" />
          </div>
        </div>
        <div v-else-if="field.type === 'SIGN_PAD'">
          <div v-if="pageFormModel[field.value]">
            <img-list :image-list="[{ url: pageFormModel[field.value] }]" />
          </div>
        </div>
        <div v-else-if="field.type === 'USER_SELECT' || field.type === 'DEPT_SELECT'">
          <div v-if="pageFormModel[field.value]">
            <text-copy :text="formatEmpValue(pageFormModel[field.value])" />
          </div>
        </div>
        <!--  矩阵-->
        <div
          v-else-if="field.type === 'MATRIX_INPUT' || field.type === 'MATRIX_SELECT' || field.type === 'MATRIX_SCALE'"
        >
          <div v-if="pageFormModel[field.value]">
            <matrix-view
              :is-print="isPrint"
              :matrix-layout="field.scheme.table"
              :value="pageFormModel[field.value]"
              :type="field.type"
            />
          </div>
        </div>
        <!--   商品-->
        <div v-else-if="field.type === 'GOODS_SELECT'">
          <div v-if="pageFormModel[field.value]">
            <text-copy :text="formatGoodsValue(pageFormModel[field.value], field.scheme)" />
          </div>
        </div>
        <!--   预约-->
        <div v-else-if="field.type === 'RESERVE_DAY'">
          <div v-if="pageFormModel[field.value]">
            <text-copy :text="formatReserveValue(pageFormModel[field.value], field.scheme)" />
          </div>
        </div>
        <div v-else-if="field.type === 'RESERVE_TIME_RANGE'">
          <div v-if="pageFormModel[field.value]">
            <text-copy :text="formatReserveTimeValue(pageFormModel[field.value], field.scheme)" />
          </div>
        </div>
        <div v-else-if="field.type === 'SUB_FORM'">
          <div v-if="pageFormModel[field.value]">
            <sub-form-view :model="pageFormModel[field.value]" :fields="field.scheme.childList" />
          </div>
        </div>
        <!-- 省市区-->
        <div v-else-if="field.type === 'PROVINCE_CITY'">
          <div v-if="pageFormModel[field.value]">
            <text-copy :text="formatProvinceValue(pageFormModel[field.value], field.scheme)" />
          </div>
        </div>
        <!-- 普通显示-->
        <div v-else class="form-item-content">
          <text-copy :text="formatValue(pageFormModel[field.value])" />
        </div>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import _ from 'lodash'
import TextCopy from './components/TextCopy'
import FileList from './components/FileList'
import ImgList from './components/ImgList'
import MatrixView from './components/MatrixView'
import SubFormView from './components/SubFormView'

export default {
  name: 'ViewData',
  components: { TextCopy, FileList, ImgList, MatrixView, SubFormView },
  props: {
    fields: {
      type: Array,
      default: () => []
    },
    pageFormModel: {
      type: Object,
      default: () => {}
    },
    isPrint: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tempFields: []
    }
  },
  watch: {
    fields: {
      handler: function (val, oldVal) {
        this.tempFields = val.filter((item) => {
          // 包含数字的为表单项
          let bool = /.*\d+.*/g.test(item.value)
          return item.scheme && bool
        })
      },
      immediate: true
    }
  },
  methods: {
    formatValue(value) {
      // 是否是数组
      let isArray = Array.isArray(value)
      if (isArray) {
        return value.join(',')
      }
      return value
    },
    formatEmpValue(value) {
      if (!value) {
        return null
      }
      return value.map((item) => item.name).join(',')
    },
    // 商品显示
    formatGoodsValue(value, field) {
      let text = ''
      Object.keys(value).forEach((key) => {
        let project = field.goodsList.find((row) => row.id == key)
        if (project) {
          text += `${project.goodsName}：${value[key]}个 `
        }
      })
      return text
    },
    // 省市区
    formatProvinceValue(value, field) {
      if (Array.isArray(value)) {
        return value.join(',')
      } else {
        return _.get(value, 'cascadeValue') + ' ' + _.get(value, 'detailAddr')
      }
    },
    // 预约显示
    formatReserveValue(value, field) {
      if (!value) {
        return null
      }
      let text = ''
      Object.keys(value).forEach((key) => {
        let project = field.reserveProjectList.find((row) => row.id == key)
        if (project) {
          text += `${project.name}：${value[key]} `
        }
      })
      return text
    },
    formatReserveTimeValue(value, field) {
      if (!value) {
        return null
      }
      let text = ''
      Object.keys(value).forEach((key) => {
        let project = field.reserveProjectList.find((row) => row.id == key)
        if (project) {
          text += `${project.name}：${value[key]} `
        }
      })
      return text
    }
  }
}
</script>

<style lang="scss" scoped>
.view-form {
  padding-bottom: 60px;
}

.field-label {
  font-size: 18px;
  font-weight: bold;
}
</style>
