<template>
    <div class="project-form"
         :style="{backgroundColor:projectTheme.backgroundColor,
          background:projectTheme.backgroundImg?'url('+projectTheme.backgroundImg+')  no-repeat center':''}">
        <div class="">
            <div :style="{textAlign:projectTheme.logoPosition}">
                <img
                    :src="projectTheme.logoImg" class="logo-img">
            </div>
            <el-image
                v-if="projectTheme.headImgUrl"
                :src="projectTheme.headImgUrl"
                fit="scale-down"></el-image>
            <el-row v-if="projectTheme.showTitle" type="flex" justify="center" align="middle">
                <el-col  style="text-align: center">
                    <h4 class="form-name-text">
                        {{ formConf.title }}</h4>
                </el-col>
            </el-row>
            <el-row v-if="projectTheme.showDescribe" type="flex" justify="center" align="middle">
                <el-col style="text-align: center">
                    <p class="form-name-text">
                        {{ formConf.description }}
                    </p>
                </el-col>
            </el-row>
            <el-divider>
            </el-divider>
            <parser v-if="formConf.fields.length" :form-conf="formConf" @submit="submitForm"/>
        </div>
    </div>
</template>

<script>
import Parser from '@/components/parser/Parser'
import {dbDataConvertForItemJson} from '@/utils/convert'

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
    props: {
        projectConfig: {
            projectKey: '',
            showBtns: true
        }
    },
    data() {
        return {
            projectKey: '',
            projectTheme: {
                headImgUrl: '',
                logoImg: '',
                showTitle: true,
                showDescribe: true
            },
            formConf: {
                fields: [],
                __methods__: {},
                formRef: 'elForm',
                formModel: 'formData',
                labelFormModel: 'labelFormData',
                size: 'small',
                labelPosition: 'top',
                labelWidth: 100,
                formRules: 'rules',
                gutter: 15,
                disabled: false,
                span: 24,
                formBtns: true,
                resetBtn: false,
                submitBtnText: '提交',
                submitBtnColor: '#205bb5',
                showNumber: false,
                unFocusedComponentBorder: true
            }
        }
    },
    computed: {},
    watch: {},
    beforeCreate() {
        document.querySelector('body').className = 'project-body'
    },
    created() {
        if (this.projectConfig && this.projectConfig.projectKey) {
            this.projectKey = this.projectConfig.projectKey
            // this.formConf.formBtns = this.projectConfig.showBtns
            //不存去路由中尝试获取 ifreme
        } else if (this.$route.query.key) {
            this.projectKey = this.$route.query.key
            this.formConf.formBtns = true
        }
        this.formConf.size = window.innerWidth < 480 ? 'medium' : 'small'
    },
    mounted() {
        this.$api.get(`/user/project/details/${this.projectKey}`).then(res => {
            if (res.data) {
                let fields = res.data.projectItems.map(item => {
                    return dbDataConvertForItemJson(item)
                })
                this.formConf.fields = fields
                this.formConf.title = res.data.project.name
                this.formConf.description = res.data.project.describe
                this.formConf.description = res.data.project.describe
                if (res.data.userProjectTheme) {
                    this.projectTheme = res.data.userProjectTheme
                    let {submitBtnText, showNumber, btnsColor} = res.data.userProjectTheme
                    if (submitBtnText) {
                        this.formConf.submitBtnText = submitBtnText
                    }
                    if (showNumber) {
                        this.formConf.showNumber = showNumber
                    }
                    if (btnsColor) {
                        this.formConf.submitBtnColor = btnsColor
                    }
                }

            }
        })
    },
    methods: {
        submitForm(data) {
            this.$emit('submit', data)
        }
    }
}
</script>

<style lang="scss">

.project-form {
    margin: 15px auto;
    width: 800px;
    padding: 15px;
    background-repeat: repeat;
    background-color: rgba(229, 239, 247, 0.87);
    overflow: hidden;
}

.project-body::-webkit-scrollbar {
    width: 0 !important;
    background: transparent;
}

.project-body {
    -ms-overflow-style: none;
}

.project-body {
    overflow: -moz-scrollbars-none;
}

.logo-img {
    max-height: 120px;
}

.submit-btn-form-item {
    text-align: left;
}

.submit-btn-form-item button {
    width: 20%;
}

@media screen and (max-width: 750px) {
    .project-form {
        margin: 0px;
        width: 93% !important;
        background-color: white;
    }

    .project-form {
        height: 100%;
        width: 60vw;
    }
    .logo-img {
        max-height: 2.94rem;
    }
    .submit-btn-form-item {
        text-align: center;
    }
    .submit-btn-form-item button {
        width: 80%;
    }
}
</style>
