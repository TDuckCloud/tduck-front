<template>
    <el-dialog
        :class="fullscreen ? 't-dialog--fullscreen' : 't-dialog'"
        :fullscreen="fullscreen"
        :visible.sync="dialogVisible"
        width="50%"
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
        <el-row class="dialog-form">
            <el-col :span="18" class="left">
                <el-scrollbar>
                    <generate-form
                        v-if="formConf.fields.length && formModel"
                        :key="formParseKey"
                        ref="generateForm"
                        :form-conf="formConf"
                        :page-form-model="formModel"
                        style="margin-bottom: 40px"
                    />
                </el-scrollbar>
            </el-col>
            <el-col :span="6" class="right">
                <el-descriptions :column="1" title="基础信息">
                    <el-descriptions-item label="序号">
                        {{ formModel.serialNumber }}
                    </el-descriptions-item>
                    <el-descriptions-item label="提交人">
                        {{ formModel.createBy }}
                    </el-descriptions-item>
                    <el-descriptions-item label="提交时间">
                        {{ formModel.createTime }}
                    </el-descriptions-item>
                    <el-descriptions-item label="最后修改人">
                        {{ formModel.updateBy }}
                    </el-descriptions-item>
                    <el-descriptions-item label="最后修改时间">
                        {{ formModel.updateTime }}
                    </el-descriptions-item>
                    <el-descriptions-item label="操作系统">
                        {{
                            formModel.submitUa ? formModel.submitUa.os.name : ''
                        }}
                        {{
                            formModel.submitUa
                                ? formModel.submitUa.os.version
                                : ''
                        }}
                    </el-descriptions-item>
                    <el-descriptions-item label="设备">
                        {{
                            formModel.submitUa ? formModel.submitUa.device : ''
                        }}
                    </el-descriptions-item>
                    <el-descriptions-item label="浏览器">
                        {{
                            formModel.submitUa
                                ? formModel.submitUa.browser.name
                                : ''
                        }}
                        {{
                            formModel.submitUa
                                ? formModel.submitUa.browser.version
                                : ''
                        }}
                    </el-descriptions-item>
                    <el-descriptions-item label="地址">
                        {{ formModel.submitAddress }}
                    </el-descriptions-item>
                    <el-descriptions-item label="IP">
                        {{ formModel.submitRequestIp }}
                    </el-descriptions-item>
                </el-descriptions>
            </el-col>
        </el-row>
        <span slot="footer" class="t-dialog__footer">
            <el-button @click="handleCancel">取 消</el-button>
            <el-button
                v-if="!isEditMode && canUpdate"
                type="primary"
                @click="handleEditMode"
            >修 改</el-button>
            <el-button v-if="isEditMode" type="primary" @click="handleUpdate">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { GenerateForm } from 'tduck-form-generator'
import { updateFormDataRequest } from '../../../api/project/data'
import _ from 'lodash'
import { jsonSimpleClone } from '../../../utils'

export default {
    name: 'ViewOrUpdate',
    components: {
        GenerateForm
    },
    props: ['fields', 'formModel', 'formKey', 'canUpdate'],
    data() {
        return {
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
            fullscreen: false
        }
    },
    watch: {
        fields: {
            handler: function(val, oldVal) {
                this.formConf.fields = val
                    .filter(item => item.scheme)
                    .map(item => item.scheme)
            },
            immediate: true
        }
    },
    methods: {
        showDialog() {
            this.formConf.disabled = true
            this.dialogTitle = '查看'
            this.formParseKey = new Date().getTime()
            this.isEditMode = false
            this.dialogVisible = true
        },
        handleCancel() {
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
        handleUpdate() {
            let formModel = jsonSimpleClone(this.$refs.generateForm.formModel)
            _.keys(formModel).forEach(key => {
                if (key.indexOf('-') === -1) {
                    delete formModel[key]
                }
            })
            // 表单中字段名规则为type-xxx 移除不符合规则的数据 不然会有其他的比如提交时间等数据
            updateFormDataRequest({
                id: this.formModel.id,
                completeTime: null,
                formKey: this.formKey,
                submitOs: '',
                submitBrowser: '',
                submitUa: null,
                wxUserInfo: null,
                wxOpenId: '',
                originalData: formModel
            }).then(res => {
                this.msgSuccess('修改成功')
                this.dialogVisible = false
                this.$emit('reload')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.dialog-form {
    height: 100%;

    .left {
        border-right: var(--color-bg) solid 1px;
        padding: 10px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .right {
        padding: 10px;
    }
}

::v-deep .el-dialog__body {
    padding: 0px !important;
    margin-bottom: 0px !important;
    overflow-y: hidden !important;
}

.t-dialog .left {
    overflow: scroll;
    height: 700px !important;
}
.t__dialog__menu {
    float: right;
    margin-right: 23px;
}

.t-dialog--fullscreen .left {
    padding: 50px;
    height: 80vh !important;
}
::v-deep .t-dialog {
    margin-top: 5vh !important;
}
::v-deep .t-dialog--fullscreen {
    margin-top: 0vh !important;
}
</style>
