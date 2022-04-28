<template>
    <div v-loading="createProjectLoading" class="template-preview-container">
        <div class="header">
            <el-page-header content="模板详情" @back="$router.back(-1)" />
        </div>
        <div class="template-preview-content">
            <el-scrollbar class="template-scrollbar">
                <biz-project-form
                    v-if="formConfig.formKey"
                    :form-config="formConfig"
                    @submit="submitForm"
                />
            </el-scrollbar>
            <div class="use-btn">
                <el-button type="primary" @click="createProjectByTemplate">
                    使用该模板
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { BizProjectForm } from 'tduck-form-generator'
import { useTemplateCreateFormRequest } from '@/api/project/template'
import mixin from '../../form/TduckFormMixin'

export default {
    name: 'TemplatePreview',
    components: {
        BizProjectForm
    },
    mixins: [mixin],
    props: {},
    data() {
        return {
            createProjectLoading: false,
            formConfig: {
                formKey: '',
                preview: false,
                formKind: 2,
                showBtns: true
            }
        }
    },
    mounted() {
        this.formConfig.formKey = this.$route.query.key
    },
    methods: {
        createProjectByTemplate() {
            this.createProjectLoading = true
            useTemplateCreateFormRequest({ key: this.formConfig.formKey })
                .then(res => {
                    this.createProjectLoading = false
                    if (res.data) {
                        this.$router.push({
                            path: '/project/form',
                            query: { key: res.data, active: 1 }
                        })
                    }
                })
                .catch(() => {
                    this.createProjectLoading = false
                })
        },
        submitForm() {}
    }
}
</script>

<style lang="scss" scoped>
.template-preview-container {
    width: 100%;
    height: 100%;
}

.header {
    padding: 20px;
}

.template-scrollbar {
    height: calc(100% - 64px);
}
.template-preview-content {
    position: relative;

    .use-btn {
        position: absolute;
        top: 50px;
        right: 180px;
    }
}
</style>
