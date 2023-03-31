<template>
  <el-dialog
    :class="fullscreen ? 't-dialog--fullscreen' : 't-dialog'"
    :fullscreen="fullscreen"
    :visible.sync="dialogVisible"
    custom-class="view-dialog"
    width="65%"
  >
    <div slot="title" class="t__dialog__header">
      <span class="el-dialog__title">{{ dialogTitle }}</span>
      <div class="t__dialog__menu">
        <i
          :class="fullscreen ? 'el-icon-news' : 'el-icon-full-screen'"
          class="el-dialog__close"
          @click="handleFullScreen"
        />
      </div>
    </div>

    <el-row class="dialog-form" :style="{ height: `${dialogHeight}px` }">
      <el-col :span="18" :xs="24" class="left" :style="{ height: `${dialogHeight}px` }">
        <el-scrollbar>
          <generate-form
            v-if="formConf.fields.length && formModel && isEditMode"
            :key="formParseKey"
            ref="generateForm"
            :form-conf="formConf"
            :page-form-model="formModel"
            style="margin-bottom: 40px"
          />
          <view-data v-else id="printForm" :fields="fields" :page-form-model="formModel" :is-print.sync="isPrint" />
        </el-scrollbar>
      </el-col>
      <el-col :span="6" :xs="24" class="right">
        <el-descriptions :column="1" title="基础信息">
          <el-descriptions-item v-for="field in fixedFields" :key="field.value" :label="field.label">
            <span v-if="field.value === 'submitUaOs'">
              {{ formModel.submitUa ? formModel.submitUa.os.name : '' }}
              {{ formModel.submitUa ? formModel.submitUa.os.version : '' }}
            </span>
            <span v-if="field.value === 'submitBrowser'">
              {{ formModel.submitUa ? formModel.submitUa.browser.name : '' }}
              {{ formModel.submitUa ? formModel.submitUa.browser.version : '' }}
            </span>
            <span v-if="field.value === 'submitUaDevice'">
              {{ formModel.submitUa ? formModel.submitUa.device : '' }}
            </span>
            <span v-if="field.value === 'wxUserInfo'">
              {{ formModel.wxUserInfo ? formModel.wxUserInfo.nickname : '' }}
              <div>{{ formModel.wxUserInfo ? formModel.wxUserInfo.openid : '' }}</div>
            </span>
            <span v-else>
              {{ formModel[field.value] }}
            </span>
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>

    <span slot="footer" class="t-dialog__footer">
      <el-button v-if="isEditMode" type="primary" @click="handleUpdate"> 确 定 </el-button>
      <el-button v-if="!isEditMode && canUpdate" icon="el-icon-edit" type="primary" @click="handleEditMode">
        修 改
      </el-button>
      <el-button v-if="checkBtnPerms('delete')" type="danger" plain @click="handleDelete"> 删 除 </el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { GenerateForm } from 'tduck-form-generator'
import 'tduck-form-generator/dist/TduckForm.css'
import ViewData from './ViewData'
import { deleteFormDataRequest, updateFormDataRequest } from '@/api/project/data'
import { jsonSimpleClone } from '@/utils'
import { getSettingRequest } from '@/api/project/setting'
import { removeHtmlTag } from '@/utils'

export default {
  name: 'ViewOrUpdate',
  components: {
    GenerateForm,
    ViewData
  },
  directives: {
    print
  },
  props: ['fields', 'fixedFields', 'formModel', 'formKey', 'canUpdate'],
  data() {
    return {
      activeName: 'info',
      isEditMode: false,
      formParseKey: new Date().getTime(),
      formConf: {
        fields: [],
        formKey: '',
        disabled: true,
        span: 24,
        size: 'small',
        labelPosition: 'top',
        labelWidth: 100,
        formRules: 'rules',
        gutter: 15,
        formBtns: false,
        resetBtn: false,
        theme: {
          backgroundImg: '',
          showTitle: true,
          showDescribe: true,
          showNumber: false,
          btnsColor: null
        }
      },
      dialogVisible: false,
      dialogTitle: '查看',
      fullscreen: false,
      openReply: false,
      isPrint: false,
      dialogHeight: 700
    }
  },
  watch: {
    fields: {
      handler: function (val, oldVal) {
        this.formConf.fields = val
          .filter((item) => {
            return item.scheme
          })
          .map((item) => {
            if (item.scheme) {
              item.scheme.viewMode = true
              // 去除标签中富文本
              item.scheme.config.label = removeHtmlTag(item.scheme.config.label)
            }
            return item.scheme
          })
      },
      immediate: true
    }
  },
  created() {
    this.queryUserProjectSetting()
  },
  methods: {
    checkBtnPerms(btn) {
      return this.$parent.checkBtnPerms(btn)
    },
    showDialog() {
      this.formConf.disabled = true
      this.dialogTitle = '查看'
      this.formParseKey = new Date().getTime()
      this.isEditMode = false
      this.dialogVisible = true
      this.remarkEditDisable = true
      this.remarkButton = '编辑'
      this.activeName = 'info'
    },
    handleCancel() {
      if (this.isEditMode) {
        this.isEditMode = false
        this.formConf.disabled = true
        return
      }
      this.dialogVisible = false
      this.$emit('reload')
    },
    handleEditMode() {
      this.isEditMode = true
      this.dialogTitle = '编辑'
      this.formConf.disabled = false
    },
    handleFullScreen() {
      this.fullscreen = !this.fullscreen
    },
    // 查询操作按钮
    queryUserProjectSetting() {
      getSettingRequest(this.formKey).then((res) => {
        if (res.data) {
          this.openReply = res.data.openReply
        }
      })
    },
    handleDelete() {
      this.$alert('删除后不可恢复，是否确认删除该数据？', '删除表单数据', {
        confirmButtonText: '确定',
        callback: (action) => {
          if (action === 'confirm')
            deleteFormDataRequest([this.formModel.id], this.formKey).then((res) => {
              this.msgSuccess('删除成功')
              this.dialogVisible = false
              this.$emit('reload')
            })
        }
      })
    },
    handleUpdate() {
      let formModel = jsonSimpleClone(this.$refs.generateForm.formModel)
      // 表单中字段名规则为字段类型时间戳 移除不符合规则的数据 不然会有其他的比如提交时间等数据
      let tempFormModel = {}
      // 保留formModel中包含数字的属性
      for (let key in formModel) {
        let bool = /.*\d+.*/g.test(key)
        if (bool) {
          tempFormModel[key] = formModel[key]
        }
      }
      updateFormDataRequest({
        id: this.formModel.id,
        completeTime: null,
        formKey: this.formKey,
        submitOs: '',
        submitBrowser: '',
        submitUa: null,
        wxUserInfo: null,
        wxOpenId: '',
        originalData: tempFormModel
      }).then((res) => {
        this.msgSuccess('修改成功')
        this.dialogVisible = false
        setTimeout(() => {
          this.$emit('reload')
        }, 1000)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-form {
  overflow: hidden;
  height: 563px;

  .left {
    overflow: auto;
    height: 100%;
    border-right: var(--color-bg) solid 1px;
    padding: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .right {
    height: 100%;
    padding: 10px;
  }
}

.operate-btns {
  border-bottom: 1px solid #f0f0f0;
}

::v-deep .el-dialog__body {
  padding: 0 !important;
  margin-bottom: 0 !important;
  overflow-y: hidden !important;
}

.t-dialog .left {
  //height: 700px !important;
}

.t-dialog--fullscreen .left {
  padding: 50px;
  height: 80vh !important;
}

.view-dialog {
  height: 500px;
}
</style>
