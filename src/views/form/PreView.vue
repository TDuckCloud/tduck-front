<template>
    <div class="preview-form">
        <div class="" v-if="!formState">
            <el-row type="flex" justify="center" align="middle">
                <el-col :sm="{span:20}" :xs="{span:24,offset:0}" style="text-align: center">
                    <h4 class="form-name-text">
                        {{formConf.title}}</h4>
                </el-col>
            </el-row>
            <el-row type="flex" justify="center" align="middle">
                <el-col :sm="{span:20}" :xs="{span:24,offset:0}" style="text-align: center">
                    <p class="form-name-text">
                        {{formConf.description}}
                    </p>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <parser v-if="formConf.fields.length" :form-conf="formConf" @submit="sumbitForm1"/>
        </div>
        <div v-if="formState">
            <p style="text-align: center">您已完成本次问卷，感谢您的帮助与支持</p>
        </div>
    </div>
</template>

<script>
import Parser from '@/components/parser/Parser'
import {dbDataConvertForItemJson} from '@/utils/convert'
// 若parser是通过安装npm方式集成到项目中的，使用此行引入
// import Parser from 'form-gen-parser'
window.onload = function() {
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault()
        }
    })
    document.addEventListener('gesturestart', function(event) {
        event.preventDefault()
    })
}
export default {
    components: {
        Parser
    },
    props: {},
    data() {
        return {
            key2: +new Date(),
            formState: false,//是否填写
            formConf: {
                fields: [],
                __methods__: {
                    clickTestButton1() {
                        console.log(
                            `%c【测试按钮1】点击事件里可以访问当前表单：
                1) formModel='formData', 所以this.formData可以拿到当前表单的model
                2) formRef='elForm', 所以this.$refs.elForm可以拿到当前表单的ref(vue组件)
              `,
                            'color:#409EFF;font-size: 15px'
                        )
                        console.log('表单的Model：', this.formData)
                        console.log('表单的ref：', this.$refs.elForm)
                    }
                },
                formRef: 'elForm',
                formModel: 'formData',
                size: 'small',
                labelPosition: 'top',
                labelWidth: 100,
                formRules: 'rules',
                gutter: 15,
                disabled: false,
                span: 24,
                formBtns: true,
                unFocusedComponentBorder: true
            }
        }
    },
    computed: {},
    watch: {},
    created() {
        this.formConf.size = window.innerWidth < 480 ? 'medium' : 'small'
    },
    mounted() {
        this.$api.get(`/project/query/details/${this.$route.query.key}`).then(res => {
            if (res.data) {
                let fields = res.data.projectItems.map(item => {
                    return dbDataConvertForItemJson(item)
                })
                this.formConf.fields = fields
                this.formConf.title = res.data.project.name
                this.formConf.description = res.data.project.describe
            }
        })
    },
    methods: {
        fillFormData(form, data) {
            form.fields.forEach(item => {
                const val = data[item.__vModel__]
                if (val) {
                    item.__config__.defaultValue = val
                }
            })
        },
        change() {
            this.key2 = +new Date()
            const t = this.formConf
            this.formConf = this.formConf2
            this.formConf2 = t
        },
        sumbitForm1(data) {
            console.log('sumbitForm1提交数据：', data)
            this.formState = true
        },
        sumbitForm2(data) {
            console.log('sumbitForm2提交数据：', data)
        }
    }
}
</script>

<style lang="scss" scoped>
.preview-form {
    margin: 15px auto;
    width: 800px;
    padding: 15px;
    background-repeat: repeat;
    background-color: rgba(229, 239, 247, 0.87);
}

@media screen and (max-width: 750px) {
    .preview-form {
        margin: 0px;
        width: 93% !important;
        background-color: white;
    }
}
</style>
