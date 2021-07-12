<template>
    <div class="project-form"
         :style="{backgroundColor:projectTheme.backgroundColor,
                  background:projectTheme.backgroundImg?'url('+projectTheme.backgroundImg+')  no-repeat center':''}"
    >
        <div class="">
            <div :style="{textAlign:projectTheme.logoPosition}">
                <img
                    :src="projectTheme.logoImg" class="logo-img"
                >
            </div>
            <el-image
                v-if="projectTheme.headImgUrl"
                :src="projectTheme.headImgUrl"
                style="width: 100%;"
                fit="scale-down"
            />
            <h4 v-if="projectTheme.showTitle" class="form-name-text" style="text-align: center;">
                {{ formConf.title }}
            </h4>
            <div
                v-show="projectTheme.showDescribe"
                class="form-name-text describe-html" v-html="formConf.description"
            />
            <el-divider />
            <parser v-if="startParser"
                    :key="parserKey"
                    :form-model="formModel"
                    :label-form-model="labelFormModel"
                    :form-conf="formConf" @next="nextPage" @prev="prevPage" @submit="submitForm"
            />
        </div>
    </div>
</template>

<script>
import Parser from '@/components/parser/Parser'
import {dbDataConvertForItemJson} from '@/utils/convert'
import {getExpression} from '@/utils/expression'
import _ from 'lodash'

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
            showBtns: true,
            // 项目种类  1 普通  2模板
            projectKind: 1
        }
    },
    metaInfo: {
        meta: [
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            }
        ]
    },
    data() {
        return {
            logicShowTriggerRule: {},
            startParser: false,
            formModel: {},
            labelFormModel: {},
            projectTheme: {
                headImgUrl: '',
                logoImg: '',
                showTitle: true,
                showDescribe: true
            },
            parserKey: +new Date(),
            // 每页数据
            perPageFields: {},
            formConf: {
                fields: [],
                logicShowRule: {},
                projectKey: '',
                projectKind: 1,
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
                submitBtnColor: '#409EFF',
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
            this.formConf.projectKey = this.projectConfig.projectKey
            if (this.projectConfig.projectKind) {
                this.formConf.projectKind = this.projectConfig.projectKind
            }
        } else if (this.$route.query.key) {
            // 不存去路由中尝试获取 iframe
            this.formConf.projectKey = this.$route.query.key
            if (this.$route.query.kind) {
                this.formConf.projectKind = this.$route.query.kind
            }
            this.formConf.formBtns = true
        }
        this.formConf.size = window.innerWidth < 480 ? 'medium' : 'small'
    },
    async mounted() {
        let url = `/user/project/details/${this.formConf.projectKey}`
        if (this.formConf.projectKind == 2) {
            url = `/project/template/details/${this.formConf.projectKey}`
        }
        let logicItemList = []
        // 处理逻辑表单
        if (this.formConf.projectKind == 1) {
            let res = await this.queryLogicItemList()
            logicItemList = res.data
        }
        let logicItemMap = new Map()
        logicItemList.forEach(item => {
            logicItemMap.set(item.formItemId, item)
            this.logicShowTriggerHandle(item)
        })
        this.$api.get(url).then(res => {
            if (res.data) {
                let serialNumber = 1
                let fields = res.data.projectItems.map(item => {
                    let projectItem = dbDataConvertForItemJson(item)
                    projectItem.serialNumber = serialNumber
                    projectItem.logicShow = !logicItemMap.get(projectItem.formItemId)
                    serialNumber++
                    return projectItem
                })
                this.pageShowHandle(fields)
                if (_.keys(this.perPageFields).length != 0) {
                    this.formConf.fields = _.get(this.perPageFields, 1)
                    this.formConf.formBtns = false
                } else {
                    this.formConf.fields = fields
                }
                if (res.data.project) {
                    this.formConf.title = res.data.project.name
                    document.title = res.data.project.name
                    this.formConf.description = res.data.project.describe
                }
                this.formConf.logicShowRule = this.logicShowTriggerRule
                // 主题数据
                if (res.data.userProjectTheme) {
                    this.projectTheme = res.data.userProjectTheme
                    let {submitBtnText, showNumber, btnsColor} = res.data.userProjectTheme
                    if (submitBtnText) this.formConf.submitBtnText = submitBtnText
                    if (showNumber) this.formConf.showNumber = showNumber
                    if (btnsColor) this.formConf.submitBtnColor = btnsColor
                }
                this.startParser = true

            }
        })
    },
    methods: {
        // 分页显示数据处理
        pageShowHandle(allFields) {
            // 判断是否存在分页
            let index = allFields.findIndex(item => {
                return item.typeId === 'PAGINATION'
            })
            if (index < 0) {
                return
            }
            let curr = 1
            // 每页字段
            let perPageFields = {}
            // 分页字段数据
            let pageFields = {}
            allFields.forEach(item => {
                let fields = _.get(perPageFields, curr)
                if (item.typeId === 'PAGINATION') {
                    _.set(pageFields, curr, item)
                    if (fields) {
                        item.currPageNum = curr++
                    }
                } else {
                    if (!fields || fields == undefined) {
                        fields = new Array()
                    }
                    fields.push(item)
                    _.set(perPageFields, curr, fields)
                }
            })
            let len = _.keys(perPageFields).length
            // 计算页数 添加分页
            _.keys(perPageFields).forEach(key => {
                let pageItem = _.get(pageFields, key)
                if (pageItem) {
                    let fields = _.get(perPageFields, key)
                    pageItem.totalPageNum = len
                    fields.push(pageItem)
                    _.set(perPageFields, key, fields)
                }

            })
            this.perPageFields = perPageFields
        },
        /**
       * 处理逻辑显示数据
       */
        logicShowTriggerHandle(logicItem) {
            if (!logicItem) {
                return
            }
            // 建立触发关系 该字段值发生变化时 哪些问题需要进行逻辑判断 确定是否显示
            logicItem.conditionList.forEach(item => {
                if (Object.keys(item).length === 0) {
                    return
                }
                let rules = this.logicShowTriggerRule[item.formItemId]
                if (!rules) {
                    rules = new Array()
                }
                rules.push({
                    // 触发的字段
                    triggerFormItemId: logicItem.formItemId,
                    logicExpression: getExpression(logicItem.conditionList, logicItem.expression)
                })
                this.logicShowTriggerRule[item.formItemId] = rules
            })
        },
        // 统一处理axios请求
        queryLogicItemList() {
            return new Promise((resolve, reject) => {
                this.$api.get('/user/project/logic/list', {params: {projectKey: this.formConf.projectKey}})
                    .then(res => {
                        resolve(res)
                    }).catch(err => {
                        reject(err)
                    })
            })
        },
        prevPage(params) {
            this.switchPage(params.page - 1, params)
        },
        nextPage(params) {
            this.switchPage(params.page + 1, params)
        },
        switchPage(page, params) {
            let {labelFormModel, formModel} = params
            this.formModel = formModel
            this.labelFormModel = labelFormModel
            this.formConf.formBtns = _.keys(this.perPageFields).length == page
            this.formConf.fields = _.get(this.perPageFields, page)
            this.parserKey = +new Date()
        },
        submitForm(data) {
            this.$emit('submit', data)
        }
    }
}
</script>

<style lang="scss">
@import '@/assets/styles/elementui-mobile.scss';
.project-form {
  margin: 15px auto;
  width: 800px;
  padding: 15px;
  background-repeat: repeat;
  background-color: rgba(229, 239, 247, 0.87);
}
.project-form .describe-html img{
  max-width: 780px;
  margin: 0px;
}

.project-body::-webkit-scrollbar {
  width: 0 !important;
  background: transparent;
}

.project-body {
  -ms-overflow-style: none;
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
    margin: 0;
    width: 100% !important;
    background-color: white;
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
  .project-form .describe-html img{
    width: 95vw!important;
  }
}
</style>
