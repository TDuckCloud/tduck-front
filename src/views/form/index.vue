<template>
    <div class="container">
        <div class="left-board">
            <el-row>
                <el-col :offset="1" :span="2">
                    <el-button size="mini" round @click="$router.back(-1)">
                        <i class="el-icon-arrow-left"/>
                        返回
                    </el-button>
                </el-col>
            </el-row>
            <el-scrollbar class="left-scrollbar">
                <div class="components-list">
                    <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
                        <div class="components-title">
                            <svg-icon name="component"/>
                            {{ item.title }}
                        </div>
                        <draggable
                            class="components-draggable"
                            :list="item.list"
                            :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                            :clone="cloneComponent"
                            draggable=".components-item"
                            :sort="false"
                            @end="onEnd"
                        >
                            <div
                                v-for="(element, index) in item.list"
                                :key="index"
                                class="components-item"
                                @click="addComponent(element)"
                            >
                                <div class="components-body">
                                    <svg-icon :name="element.__config__.tagIcon"/>
                                    {{ element.__config__.label }}
                                </div>
                            </div>
                        </draggable>
                    </div>
                </div>
            </el-scrollbar>
        </div>

        <div class="center-board">
<!--            <div class="action-bar">-->
<!--                <el-button icon="el-icon-video-play" type="text" @click="run">-->
<!--                    运行-->
<!--                </el-button>-->
<!--                <el-button icon="el-icon-view" type="text" @click="showJson">-->
<!--                    查看json-->
<!--                </el-button>-->
<!--                <el-button icon="el-icon-download" type="text" @click="download">-->
<!--                    导出vue文件-->
<!--                </el-button>-->
<!--                <el-button class="copy-btn-main" icon="el-icon-document-copy" type="text" @click="copy">-->
<!--                    复制代码-->
<!--                </el-button>-->
<!--                <el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">-->
<!--                    清空-->
<!--                </el-button>-->
<!--            </div>-->
            <el-row type="flex" align="middle" justify="justify">
                <el-col :span="18" :offset="6">
                    <el-menu default-active="1" style="background-color: transparent" mode="horizontal">
                        <el-menu-item index="1">编辑</el-menu-item>
                        <el-menu-item index="2">外观</el-menu-item>
                        <el-menu-item index="3">设置</el-menu-item>
                        <el-menu-item index="4">发布</el-menu-item>
                        <el-menu-item index="5">统计</el-menu-item>
                    </el-menu>
                </el-col>
            </el-row>
            <el-row class="center-scrollbar">
                <el-row class="center-board-row" :gutter="formConf.gutter">
                    <el-row type="flex" justify="center" align="middle">
                        <el-col :span="20" style="text-align: center">
                            <h4 class="form-name-text" contenteditable="true"
                                @blur="(event)=>{
                                    formConf.title=event.target.innerText;
                                    this.saveProjectInfo()}">
                                {{formConf.title}}</h4>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="center" align="middle">
                        <el-col :span="20" style="text-align: center">
                            <p class="form-name-text" contenteditable="true"
                               @blur="(event)=>{
                                   formConf.description=event.target.innerText;
                                   this.saveProjectInfo()}">
                                {{formConf.description}}
                            </p>
                        </el-col>
                    </el-row>
                    <el-divider></el-divider>
                    <el-form
                        :size="formConf.size"
                        :label-position="formConf.labelPosition"
                        :disabled="formConf.disabled"
                        :label-width="formConf.labelWidth + 'px'"
                    >
                        <draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup">
                            <draggable-item
                                v-for="(item, index) in drawingList"
                                :key="item.renderKey"
                                :drawing-list="drawingList"
                                :current-item="item"
                                :index="index"
                                :active-id="activeId"
                                :form-conf="formConf"
                                @activeItem="activeFormItem"
                                @changeLabel="changeLabel"
                                @copyItem="drawingItemCopy"
                                @deleteItem="drawingItemDelete"
                            />
                        </draggable>
                        <div v-show="!drawingList.length" class="empty-info">
                            从左侧拖入或点选组件进行表单设计
                        </div>
                    </el-form>
                </el-row>
            </el-row>
        </div>
        <el-row>
            <el-col :span="3" :offset="10">
                <el-button  type="primary">发布</el-button>
            </el-col>
        </el-row>
        <right-panel
            v-if="activeData"
            :active-data="activeData"
            :form-conf="formConf"
            :show-field="!!drawingList.length"
            @tag-change="tagChange"
            @data-change="updateProjectItemInfo"
        />

        <form-drawer
            :visible.sync="drawerVisible"
            :form-data="formData"
            size="100%"
            :generate-conf="generateConf"
        />
        <json-drawer
            size="60%"
            :visible.sync="jsonDrawerVisible"
            :json-str="JSON.stringify(formData)"
            @refresh="refreshJson"
        />
        <code-type-dialog
            :visible.sync="dialogVisible"
            title="选择生成类型"
            :show-file-name="showFileName"
            @confirm="generate"
        />
        <input id="copyNode" type="hidden">
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import {debounce} from 'throttle-debounce'
import {saveAs} from 'file-saver'
import ClipboardJS from 'clipboard'
import render from '@/components/render/render'
import FormDrawer from './FormDrawer'
import JsonDrawer from './JsonDrawer'
import RightPanel from './RightPanel'

import {
    inputComponents, selectComponents, formConf
} from '@/components/generator/config'
import {
    exportDefault, beautifierConf, isNumberStr, titleCase, deepClone
} from '@/utils/index'
import {formItemConvertData} from '@/utils/formDataConvert'
import {
    makeUpHtml, vueTemplate, vueScript, cssStyle
} from '@/components/generator/html'
import {makeUpJs} from '@/components/generator/js'
import {makeUpCss} from '@/components/generator/css'
import drawingDefalut from '@/components/generator/drawingDefalut'
import CodeTypeDialog from './CodeTypeDialog'
import DraggableItem from './DraggableItem'
import {
    getDrawingList, saveDrawingList, getIdGlobal, saveIdGlobal, getFormConf
} from '@/utils/db'
import loadBeautifier from '@/utils/loadBeautifier'

let beautifier
const emptyActiveData = {
    style: {},
    autosize: {}
}
let oldActiveId
let tempActiveData
let drawingListInDB
let formConfInDB
let idGlobal

export default {
    components: {
        draggable,
        render,
        FormDrawer,
        JsonDrawer,
        RightPanel,
        CodeTypeDialog,
        DraggableItem
    },
    data() {
        return {
            idGlobal,
            formConf,
            inputComponents,
            selectComponents,
            labelWidth: 100,
            drawingList: drawingDefalut,
            drawingData: {},
            activeId: drawingDefalut.length!=0?drawingDefalut[0].formId:0,
            drawerVisible: false,
            formData: {},
            dialogVisible: false,
            jsonDrawerVisible: false,
            generateConf: null,
            showFileName: false,
            activeData: drawingDefalut?drawingDefalut[0]:null,
            saveDrawingListDebounce: debounce(340, saveDrawingList),
            saveIdGlobalDebounce: debounce(340, saveIdGlobal),
            projectKey: '',
            leftComponents: [
                {
                    title: '输入型组件',
                    list: inputComponents
                },
                {
                    title: '选择型组件',
                    list: selectComponents
                }
            ]
        }
    },
    computed: {},
    watch: {
        // eslint-disable-next-line func-names
        'activeData.__config__.label': function(val, oldVal) {
            if (
                this.activeData.placeholder === undefined
                || !this.activeData.__config__.tag
                || oldActiveId !== this.activeId
            ) {
                return
            }
            this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, '') + val
        },
        activeId: {
            handler(val) {
                oldActiveId = val
            },
            immediate: true
        },
        drawingList: {
            handler(val) {
                this.saveDrawingListDebounce(val, this.projectKey)
                if (val.length === 0) this.idGlobal = 100
            },
            deep: true
        },
        idGlobal: {
            handler(val) {
                if (val) {
                    this.saveIdGlobalDebounce(val, this.projectKey)
                }
            },
            immediate: true
        }
    },
    mounted() {
        //项目key
        let projectKey = this.$route.query.key
        //表单内容 如果表单为空 使用默认表单
        drawingListInDB = getDrawingList(projectKey)
        if (Array.isArray(drawingListInDB) && drawingListInDB.length > 0) {
            this.drawingList = drawingListInDB
        } else {
            this.drawingList = drawingDefalut
        }
        if(this.drawingList.length){
            this.activeFormItem(this.drawingList[0])
        }
        //获取表单配置
        // formConfInDB = getFormConf(projectKey)
        // if (formConfInDB) {
        //     this.formConf = formConfInDB
        // }
        //获取后台数据
        this.$api.get(`/project/query/${projectKey}`).then(res => {
            this.formConf.title = res.data.name
            this.formConf.description = res.data.describe
        })
        //全局组件Id
        if (getIdGlobal(projectKey)) {
            this.idGlobal = getIdGlobal(projectKey)
        }
        loadBeautifier(btf => {
            beautifier = btf
        })
        this.projectKey = projectKey
        const clipboard = new ClipboardJS('#copyNode', {
            text: trigger => {
                const codeStr = this.generateCode()
                this.$notify({
                    title: '成功',
                    message: '代码已复制到剪切板，可粘贴。',
                    type: 'success'
                })
                return codeStr
            }
        })
        clipboard.on('error', e => {
            this.$message.error('代码复制失败')
        })

    },
    methods: {
        saveProjectInfo: debounce(430, true, function() {
            this.$api.post('/project/update', {
                'key': this.projectKey,
                'name': this.formConf.title,
                'describe': this.formConf.description
            }).then((res) => {

            })
        }),
        updateProjectItemInfo(val) {
            let data= formItemConvertData(val,this.projectKey)
            this.$api.post('/project/item/update',data).then((res) => {

            })
        },
        deleteProjectItemInfo(val) {
            console.log(val)
            let data= formItemConvertData(val,this.projectKey)
            this.$api.post('/project/item/delete', data ).then((res) => {

            })
        },
        saveProjectItemInfo(val){
            this.$api.post('/project/item/create', val).then(res => {

            })
        },
        activeFormItem(currentItem) {
            this.activeData = currentItem
            this.activeId = currentItem.__config__.formId
        },
        changeLabel(currentItem, value) {
            console.log(currentItem)
            console.log(value)
        },
        onEnd(obj) {
            if (obj.from !== obj.to) {
                this.activeData = tempActiveData
                this.activeId = this.idGlobal
            }
        },
        addComponent(item) {
            const clone = this.cloneComponent(item)
            this.drawingList.push(clone)
            this.activeFormItem(clone)
        },
        cloneComponent(origin) {
            const clone = deepClone(origin)
            const config = clone.__config__
            config.span = this.formConf.span // 生成代码时，会根据span做精简判断
            this.createIdAndKey(clone)
            clone.placeholder !== undefined && (clone.placeholder += config.label)
            tempActiveData = clone
            let data = formItemConvertData(clone, this.projectKey)
            console.log(data)
            this.saveProjectItemInfo(data)
            return tempActiveData
        },
        createIdAndKey(item) {
            const config = item.__config__
            config.formId = ++this.idGlobal
            config.renderKey = `${config.formId}${+new Date()}` // 改变renderKey后可以实现强制更新组件
            if (config.layout === 'colFormItem') {
                item.__vModel__ = `field${this.idGlobal}`
            } else if (config.layout === 'rowFormItem') {
                config.componentName = `row${this.idGlobal}`
                !Array.isArray(config.children) && (config.children = [])
                delete config.label // rowFormItem无需配置label属性
            }
            if (Array.isArray(config.children)) {
                config.children = config.children.map(childItem => this.createIdAndKey(childItem))
            }
            return item
        },
        AssembleFormData() {
            this.formData = {
                fields: deepClone(this.drawingList),
                ...this.formConf
            }
        },
        generate(data) {
            const func = this[`exec${titleCase(this.operationType)}`]
            this.generateConf = data
            func && func(data)
        },
        execRun(data) {
            this.AssembleFormData()
            this.drawerVisible = true
        },
        execDownload(data) {
            const codeStr = this.generateCode()
            const blob = new Blob([codeStr], {type: 'text/plain;charset=utf-8'})
            saveAs(blob, data.fileName)
        },
        execCopy(data) {
            document.getElementById('copyNode')
                .click()
        },
        empty() {
            this.$confirm('确定要清空所有组件吗？', '提示', {type: 'warning'})
                .then(
                    () => {
                        this.drawingList = []
                        this.idGlobal = 100
                    }
                )
        },
        drawingItemCopy(item, list) {
            let clone = deepClone(item)
            clone = this.createIdAndKey(clone)
            list.push(clone)
            this.activeFormItem(clone)
            this.saveProjectItemInfo(clone)
        },
        drawingItemDelete(index, list) {
            let item= list[index]
            list.splice(index, 1)
            this.$nextTick(() => {
                const len = this.drawingList.length
                if (len) {
                    this.activeFormItem(this.drawingList[len - 1])
                }
            })
            this.deleteProjectItemInfo(item)
        },
        generateCode() {
            const {type} = this.generateConf
            this.AssembleFormData()
            const script = vueScript(makeUpJs(this.formData, type))
            const html = vueTemplate(makeUpHtml(this.formData, type))
            const css = cssStyle(makeUpCss(this.formData))
            return beautifier.html(html + script + css, beautifierConf.html)
        },
        showJson() {
            this.AssembleFormData()
            this.jsonDrawerVisible = true
        },
        download() {
            this.dialogVisible = true
            this.showFileName = true
            this.operationType = 'download'
        },
        run() {
            this.dialogVisible = true
            this.showFileName = false
            this.operationType = 'run'
        },
        copy() {
            this.dialogVisible = true
            this.showFileName = false
            this.operationType = 'copy'
        },
        tagChange(newTag) {
            newTag = this.cloneComponent(newTag)
            const config = newTag.__config__
            newTag.__vModel__ = this.activeData.__vModel__
            config.formId = this.activeId
            config.span = this.activeData.__config__.span
            this.activeData.__config__.tag = config.tag
            this.activeData.__config__.tagIcon = config.tagIcon
            this.activeData.__config__.document = config.document
            if (typeof this.activeData.__config__.defaultValue === typeof config.defaultValue) {
                config.defaultValue = this.activeData.__config__.defaultValue
            }
            Object.keys(newTag)
                .forEach(key => {
                    if (this.activeData[key] !== undefined) {
                        newTag[key] = this.activeData[key]
                    }
                })
            this.activeData = newTag
            this.updateDrawingList(newTag, this.drawingList)
        },
        updateDrawingList(newTag, list) {
            const index = list.findIndex(item => item.__config__.formId === this.activeId)
            if (index > -1) {
                list.splice(index, 1, newTag)
            } else {
                list.forEach(item => {
                    if (Array.isArray(item.__config__.children)) this.updateDrawingList(newTag, item.__config__.children)
                })
            }
        },
        refreshJson(data) {
            this.drawingList = deepClone(data.fields)
            delete data.fields
            this.formConf = data
        }
    }
}
</script>

<style lang='scss'>
@import '@/assets/styles/home';
@import '@/assets/styles/index';
</style>
