import _ from 'lodash'
import {inputComponents, selectComponents} from '@/components/generator/config'
import {jsonClone} from '@/utils/index'

/**
 * 表单json转换为后台需要的对象
 * @param item
 */
export function formItemConvertData(item, projectKey) {
    console.log(item)
    let data = {
        'type': item.typeId,
        'formItemId': item.__config__.formId,
        'label': item.__config__.label,
        'defaultValue': item.__config__.defaultValue,
        'required': item.__config__.required,
        'placeholder': item.placeholder,
        'regList': item.__config__.regList,
        'showLabel': item.__config__.showLabel,
        'projectKey': projectKey
    }
    let expand = {}
    let param = dataParams[item.typeId]
    if (param) {
        Object.keys(param).forEach(key => {
            let value = _.get(item, param[key])
            _.set(expand, key, value)
        })
        _.set(data, 'expand', expand)
    }
    return data
}

//类型关系map
let typeMap = new Map()

/**
 * 后台存储的数据转换为elementui表单需要的Json
 * @param data
 */
export function dbDataConvertForItemJson(data) {
    if (!typeMap.size > 0) {
        //根据类型获取默认数据
        _.concat(inputComponents, selectComponents).forEach(item => {
            typeMap.set(item.typeId, item)
        })
    }
    const defaultJsonItem = typeMap.get(data.type)
    let jsonItem = _.cloneDeep(defaultJsonItem)
    let param = dataParams[data.type]
    if (param) {
        Object.keys(param).forEach(key => {
            let value = _.get(data.expand, key)
            _.set(jsonItem, param[key], value)
        })
    }
    jsonItem.sort = data.sort
    jsonItem.typeId = data.type
    jsonItem.__config__.formId = data.formItemId
    jsonItem.__config__.label = data.label
    jsonItem.__config__.required = data.required
    jsonItem.__config__.regList = data.regList
    jsonItem.__config__.showLabel = data.showLabel
    if (data.defaultValue) {
        if (data.defaultValue.json) {
            jsonItem.__config__.defaultValue = JSON.parse(data.defaultValue.value)
        } else {
            jsonItem.__config__.defaultValue = data.defaultValue.value
        }
    }
    //不同项目地址区分
    if (jsonItem.tag === 'el-upload') {
        jsonItem.action = jsonItem.action + data.projectKey
    }
    jsonItem.regList = data.regList
    jsonItem.placeholder = data.placeholder
    jsonItem.__vModel__ = 'field' + data.formItemId
    return jsonItem
}

/**
 * 不同属性的存在json的位置不用 使用变量记录key 通过lodash表达式获取 1 2 3 4 为typeId
 * @type {{'1': {maxlength: string, prepend: string, append: string}}}
 */

let dataParams = {
    //单行文本
    1: {
        'prepend': '__slot__.prepend',
        'maxlength': 'maxlength',
        'append': '__slot__.append'
    },
    // 多行文本
    2: {
        'minRows': 'autosize.minRows',
        'maxRows': 'autosize.maxRows',
        'maxlength': 'maxlength'
    },
    //计数器
    4: {
        'min': 'min',
        'max': 'max',
        'maxlength': 'maxlength',
        'step': 'step',
        'step-strictly': 'step-strictly',
        'precision': 'precision',
        'controls-position': 'controls-position'
    },
    //下拉选择
    5: {
        'options': '__slot__.options',
        'filterable': 'filterable',
        'multiple': 'multiple'
    },
    //级联选择
    6: {
        'options': 'options',
        'filterable': 'filterable',
        'multiple': 'props.props.multiple'
    },
    //单选框组
    7: {
        'options': '__slot__.options',
        'filterable': 'filterable',
        'multiple': 'props.props.multiple'
    },
    //单选框组
    8: {
        'options': '__slot__.options',
        'max': 'max',
        'min': 'min'
    }, //开关
    9: {},
    //滑块
    10: {
        'min': 'min',
        'max': 'max',
        'step': 'step'
    },//时间选择
    11: {},
    15: {
        'max': 'max',
    },
    //文件上传
    17: {
        'buttonText': '__config__.buttonText',
        'showTip': '__config__.showTip',
        'fileSize': '__config__.fileSize',
        'sizeUnit': '__config__.sizeUnit',
        'listType': 'list-type',
        'limit': 'limit',
        'multiple': 'multiple'

    }
}








