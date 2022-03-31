<template>
    <!-- 添加或修改单模板对话框 -->
    <el-dialog class="t-dialog t-dialog--top" title="保存模板" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="封面图" prop="coverImg">
                <imageUpload v-model="form.coverImg" />
            </el-form-item>
            <el-form-item label="模板名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入模板名称" />
            </el-form-item>
            <el-form-item label="模板描述" prop="description">
                <el-input v-model="form.description" type="textarea" placeholder="请输入模板描述" />
            </el-form-item>
            <el-form-item label="模板类型" prop="categoryId">
                <el-select v-model="form.categoryId" placeholder="请选择项目类型">
                    <el-option v-for="temp in templateTypeList" :key="temp.id" :label="temp.name" :value="temp.id" />
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">
                确 定
            </el-button>
            <el-button @click="cancel">
                取 消
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import {getFormTemplateTypeListRequest, createTemplateRequest} from '@/api/project/template'

export default {
    name: 'CreateTemplate',
    props: {
        formKey: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {},
            templateTypeList: [],
            // 表单校验
            rules: {
                coverImg: [
                    {required: true, message: '请上传封面图', trigger: 'blur'}
                ],
                name: [
                    {required: true, message: '项目名称不能为空', trigger: 'blur'}
                ],
                categoryId: [
                    {required: true, message: '项目类型不能为空', trigger: 'change'}
                ]
            }
        }
    },
    mounted() {
        getFormTemplateTypeListRequest().then(res => {
            this.templateTypeList = res.data
        })
    },
    methods: {
        handleOpen() {
            this.open = true
        },
        // 取消按钮
        cancel() {
            this.open = false
            this.reset()
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                key: null,
                coverImg: null,
                name: null,
                description: null,
                categoryId: null,
                scheme: null,
                status: 0,
                updateTime: null,
                createTime: null
            }
            this.resetForm('form')
        },
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.form.key = this.formKey
                    createTemplateRequest(this.form).then(res => {
                        this.msgSuccess('保存成功')
                        this.$router.push('/project/template')
                    })
                }
            })
        }
    }
}
</script>

<style scoped>

</style>
