<template>
  <div>
    <vxe-grid
      ref="xGrid"
      v-bind="gridOptions"
      @cell-click="
        ($event) => {
          $emit('cell-click', $event)
        }
      "
      @cell-menu="
        ($event) => {
          $emit('cell-menu', $event)
        }
      "
      @menu-click="
        ($event) => {
          $emit('menu-click', $event)
        }
      "
    >
      <template #toolbar_buttons>
        <slot name="toolbar" />
      </template>
      <template #toolbar_tools>
        <slot name="tools" />
      </template>
      <template #operate="{ row }">
        <slot name="operate" :row="row" />
      </template>

      <!--自定义空数据模板-->
      <template #empty>
        <el-empty slot="empty" description="暂无数据" />
      </template>
      <!--      图片上传自定义列显示-->
      <template #img_default="{ row, column }">
        <div @click.stop>
          <el-image
            v-for="img in row[column.property]"
            :key="img.url"
            style="width: 45px; height: 45px"
            :src="img.url"
            fit="contain"
            :preview-src-list="getImgPreviewList(row[column.property])"
          />
        </div>
      </template>
      <!--  文件上传自定义列显示  -->
      <template #file_default="{ row, column }">
        <a v-for="file in row[column.property]" :key="file.url" :href="file.url" target="_blank">
          <el-tooltip class="item" effect="dark" :content="file.name" placement="top-start">
            <i class="el-icon-paperclip" style="font-size: 20px" />
          </el-tooltip>
        </a>
      </template>
      <!--      手写签名-->
      <template #signpad_default="{ row, column }">
        <el-image
          v-if="row[column.property]"
          style="width: 45px; height: 45px"
          :src="row[column.property]"
          fit="contain"
        />
      </template>
    </vxe-grid>
  </div>
</template>

<script>
import Vue from 'vue'
import XEUtils from 'xe-utils'

import {
  Button,
  Export,
  Filter,
  Footer,
  Grid,
  Header,
  Icon,
  Input,
  Keyboard,
  Menu,
  Modal,
  Optgroup,
  Option,
  Pager,
  Select,
  Table,
  Toolbar,
  Tooltip,
  VXETable
} from 'vxe-table'
import zhCN from 'vxe-table/lib/locale/lang/zh-CN'

// 按需加载的方式默认是不带国际化的，自定义国际化需要自行解析占位符 '{0}'，例如：
VXETable.setup({
  i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args)
})
// 表格功能
// 表格功能
Vue.use(Header)
  .use(Footer)
  .use(Icon)
  .use(Filter)
  // .use(Edit)
  .use(Menu)
  .use(Export)
  .use(Keyboard)
  // .use(Validator)

  // 可选组件
  // .use(Column)
  // .use(Colgroup)
  .use(Grid)
  .use(Toolbar)
  .use(Pager)
  // .use(Checkbox)
  // .use(CheckboxGroup)
  // .use(Radio)
  // .use(RadioGroup)
  // .use(RadioButton)
  .use(Input)
  // .use(Textarea)
  .use(Button)
  .use(Modal)
  .use(Tooltip)
  // .use(Form)
  // .use(FormItem)
  // .use(FormGather)
  .use(Select)
  .use(Optgroup)
  .use(Option)
  // .use(Switch)
  // .use(List)
  // .use(Pulldown)
  // 安装表格
  .use(Table)
export default {
  name: 'BaseTable',
  props: {
    gridOptions: {
      type: Object,
      default: () => {}
    }
  },
  created() {},
  methods: {
    getXGrid() {
      return this.$refs.xGrid
    },
    exportMsg() {
      VXETable.modal.message({
        content: '文件导出中',
        status: 'loading',
        duration: -1,
        id: 'export-loading'
      })
    },
    endExportMsg() {
      VXETable.modal.close('export-loading')
      VXETable.modal.message({ content: '导出完成', status: 'success' })
    },
    getImgPreviewList(arr) {
      return arr.map((e) => {
        return e.url
      })
    }
  }
}
</script>

<style scoped></style>
