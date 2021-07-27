<template>
    <div class="form-edit-container">
        <div class="left-board">
            <el-scrollbar class="left-scrollbar">
                <div class="components-list">
                    <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
                        <div class="components-title">
                            <svg-icon name="component" />
                            {{ item.title }}
                        </div>
                        <draggable
                            :clone="cloneComponent"
                            :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                            :list="item.list"
                            :sort="false"
                            class="components-draggable"
                            draggable=".components-item"
                            @end="onEnd"
                        >
                            <div
                                v-for="(element, index) in item.list"
                                :key="index"
                                class="components-item"
                                @click="addComponent(element)"
                            >
                                <div class="components-body">
                                    <svg-icon :name="element.__config__.tagIcon" />
                                    {{ element.__config__.label }}
                                </div>
                            </div>
                        </draggable>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <div class="center-board">
            <el-scrollbar class="center-scrollbar">
                <el-row v-if="formConf" :gutter="formConf.gutter" class="center-board-row">
                    <el-row align="middle" justify="center" type="flex">
                        <el-col class="form-head-title">
                            <h4 class="form-name-text" contenteditable="true"
                                @blur="(event)=>{
                                    this.formConf.title=event.target.innerText;
                                    this.saveProjectInfo()}"
                            >
                                {{ formConf.title }}
                            </h4>
                        </el-col>
                    </el-row>
                    <el-row align="middle" justify="center" type="flex">
                        <el-col class="form-head-desc">
                            <Tinymce v-if="editDescription" v-model="formConf.description"
                                     placeholder="请输入表单描述"
                                     @blur="editDescription=false" @input="saveProjectInfo"
                            />
                            <div v-else class="form-name-text"
                                 @click="editDescription=true" v-html="formConf.description"
                            />
                            <!--                            <p class="form-name-text" contenteditable="true"-->
                            <!--                               @blur="(event)=>{-->
                            <!--                                   formConf.description=event.target.innerText;-->
                            <!--                                   this.saveProjectInfo()}">-->
                            <!--                                {{ formConf.description }}-->
                            <!--                            </p>-->
                        </el-col>
                    </el-row>
                    <el-divider class="form-head-divider" />
                    <el-form
                        :disabled="formConf.disabled"
                        :label-position="formConf.labelPosition"
                        :label-width="formConf.labelWidth + 'px'"
                        :size="formConf.size"
                    >
                        <draggable :animation="340" :list="drawingList" class="drawing-board" group="componentsGroup"
                                   @end="onItemEnd"
                        >
                            <draggable-item
                                v-for="(item, index) in drawingList"
                                :key="item.renderKey"
                                :active-id="activeId"
                                :current-item="item"
                                :drawing-list="drawingList"
                                :form-conf="formConf"
                                :index="index"
                                @activeItem="activeFormItem"
                                @changeLabel="changeLabel"
                                @copyItem="drawingItemCopy"
                                @deleteItem="drawingItemDelete"
                            />
                        </draggable>
                        <div v-show="!drawingList.length" class="empty-info">
                            <img style="width: 20%" src="@/assets/images/form-bg.png">
                            <p>从左侧拖入或点选组件进行表单设计</p>
                        </div>
                    </el-form>
                </el-row>
            </el-scrollbar>
        </div>
        <right-panel
            v-if="activeData"
            :active-data="activeData"
            :form-conf="formConf"
            :show-field="!!drawingList.length"
            @tag-change="tagChange"
            @data-change="updateProjectItemInfo"
        />
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import {debounce} from 'throttle-debounce'
import RightPanel from './RightPanel'

import {
    assistComponents,
    formConf,
    imageComponents,
    inputComponents,
    personalInfoComponents,
    selectComponents
} from '@/components/generator/config'
import {deepClone} from '@/utils'
import {dbDataConvertForItemJson, formItemConvertData} from '@/utils/convert'
import drawingDefalut from '@/components/generator/drawingDefalut'
import DraggableItem from './DraggableItem'
import {saveDrawingList, saveIdGlobal} from '@/utils/db'

let oldActiveId
let tempActiveData
let idGlobal

export default {
    components: {
        draggable,
        RightPanel,
        DraggableItem
    },
    data() {
        return {
            idGlobal,
            formConf: null,
            editDescription: true,
            inputComponents,
            selectComponents,
            labelWidth: 100,
            drawingList: drawingDefalut,
            drawingData: {},
            activeId: drawingDefalut.length != 0 ? drawingDefalut[0].formId : 0,
            formData: {},
            dialogVisible: false,
            generateConf: null,
            showFileName: false,
            activeData: drawingDefalut ? drawingDefalut[0] : null,
            saveDrawingListDebounce: debounce(340, saveDrawingList),
            saveIdGlobalDebounce: debounce(340, saveIdGlobal),
            projectKey: null,
            leftComponents: [
                {
                    title: '联系人组件',
                    list: personalInfoComponents
                },
                {
                    title: '输入型组件',
                    list: inputComponents
                },
                {
                    title: '图片型组件',
                    list: imageComponents
                },
                {
                    title: '辅助型组件',
                    list: assistComponents
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
        // 复制对象 避免修改改变原始对象
        this.formConf = JSON.parse(JSON.stringify(formConf))
        // 项目key
        this.projectKey = this.$route.query.key
        // 从服务端获取
        this.queryProjectItems()
        // 获取表单配置
        this.$api.get(`/user/project/${this.projectKey}`).then(res => {
            this.formConf.title = res.data.name
            this.formConf.description = res.data.describe
        })
        // 全局组件Id
        this.$api.get('/user/project/item/max-form-id', {params: {key: this.projectKey}}).then(res => {
            this.idGlobal = res.data ? res.data : 100
        })
    },
    methods: {
        saveProjectInfo: debounce(430, true, function() {
            this.$api.post('/user/project/update', {
                'key': this.projectKey,
                'name': this.formConf.title,
                'describe': this.formConf.description
            }).then(() => {

            })
        }),
        updateProjectItemInfo(val) {
            let data = formItemConvertData(val, this.projectKey)
            this.$api.post('/user/project/item/update', data).then(() => {

            })
        },
        deleteProjectItemInfo(val) {
            let data = formItemConvertData(val, this.projectKey)
            this.$api.post('/user/project/item/delete', data).then(() => {

            })
        },
        async saveProjectItemInfo(item) {
            let isSuccess = false
            let params = formItemConvertData(item, this.projectKey)
            let pItem = item
            await this.$api.post('/user/project/item/create', params).then(res => {
                pItem.sort = res.data.sort
                isSuccess = true
            })
            // 如果是分页组件 刷新所有分页的页码
            if (item.typeId === 'PAGINATION') {
                this.updatePaginationList()
            }
            return isSuccess
        },
        updatePaginationList() {
            // 页总数
            const length = this.drawingList.filter(item => item.typeId === 'PAGINATION').length
            let curr = 1
            this.drawingList.forEach((item, index) => {
                if (item.typeId === 'PAGINATION') {
                    item.totalPageNum = length
                    item.currPageNum = curr++
                    this.$set(this.drawingList, index, item)
                }
            })
        },
        queryProjectItems() {
            this.$api.get('/user/project/item/list', {params: {key: this.projectKey}}).then(res => {
                this.drawingList = res.data.map(item => dbDataConvertForItemJson(item))
                // 更新分页
                this.updatePaginationList()
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
                this.saveProjectItemInfo(tempActiveData).then(() => {
                    this.onItemEnd(obj)
                })
            }
        },
        onItemEnd(obj) {
            let params = {'projectKey': this.projectKey}
            if (this.drawingList[obj.newIndex - 1]) {
                let sort1 = this.drawingList[obj.newIndex - 1].sort
                params.beforePosition = sort1
            }
            if (this.drawingList[obj.newIndex + 1]) {
                let sort2 = this.drawingList[obj.newIndex + 1].sort
                params.afterPosition = sort2
            }
            params.formItemId = this.drawingList[obj.newIndex].__config__.formId
            if (params.beforePosition || params.afterPosition) {
                this.$api.post('/user/project/item/sort', params).then(res => {
                    this.drawingList[obj.newIndex].sort = res.data.sort
                })
            }
        },
        addComponent(item) {
            const clone = this.cloneComponent(item)
            this.saveProjectItemInfo(clone)
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
            let item = list[index]
            list.splice(index, 1)
            this.$nextTick(() => {
                const len = this.drawingList.length
                if (len) {
                    this.activeFormItem(this.drawingList[len - 1])
                }
            })
            this.deleteProjectItemInfo(item)
        },
        tagChange(newTag) {
            newTag = this.cloneComponent(newTag)
            const config = newTag.__config__
            newTag.__vModel__ = this.activeData.__vModel__
            newTag.sort = this.activeData.sort
            config.formId = this.activeId
            config.span = this.activeData.__config__.span
            this.activeData.__config__.tag = config.tag
            this.activeData.__config__.tagIcon = config.tagIcon
            this.activeData.__config__.document = config.document
            this.activeData.typeId = newTag.typeId
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
            this.updateProjectItemInfo(newTag)
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
        }
    }
}
</script>

<style lang='scss'>
@import '@/assets/styles/form/home';
@import '@/assets/styles/form/index';
</style>
<style lang="scss" scoped>

.center-board {

  .center-board-row {
    margin-right: 10px;
  }

  .form-head-title {
    padding: 0 10px;
    text-align: center;

    .form-name-text:hover{
      border: 1px dashed #7b7b7b;
      min-height: 100px;
    }

  }

  .form-head-desc {
    padding: 0 10px;
  }

  .form-head-divider {
    margin-right: 10px;
    margin-left: 10px;
    width: auto;
  }
}

</style>
