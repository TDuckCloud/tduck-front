// /**
//  *  处理项目数据
//  *
//  */
// import _ from 'lodash'
// import {
//     assistComponents,
//     imageComponents,
//     inputComponents,
//     personalInfoComponents,
//     selectComponents
// } from '@/components/generator/config'
//
// /**
//  * 表单json转换为后台需要的对象
//  * @param item
//  */
// export function formItemConvertData(item, projectKey) {
//     let data = {
//         'type': item.typeId,
//         'formItemId': item.__config__.formId,
//         'label': item.__config__.label,
//         'defaultValue': item.__config__.defaultValue,
//         'required': item.__config__.required,
//         'placeholder': item.placeholder,
//         'regList': item.__config__.regList,
//         'showLabel': item.__config__.showLabel,
//         'span': item.__config__.span,
//         'displayType': item.__config__.displayType,
//         'projectKey': projectKey
//     }
//     let expand = {}
//     let param = dataParams[item.typeId]
//     if (param) {
//         Object.keys(param).forEach(key => {
//             let value = _.get(item, param[key])
//             _.set(expand, key, value)
//         })
//         _.set(data, 'expand', expand)
//     }
//     return data
// }
//
// // 类型关系map
// let typeMap = new Map()
//
// /**
//  * 后台存储的数据转换为elementui表单需要的Json
//  * @param data
//  */
// export function dbDataConvertForItemJson(data) {
//     let {required, placeholder} = data
//     if (required && !placeholder) { // 必填项目验证未填默认提示语
//         data.placeholder = '此题为必填项目'
//     }
//     if (!typeMap.size > 0) {
//         // 根据类型获取默认数据
//         _.concat(inputComponents, selectComponents, imageComponents, assistComponents, personalInfoComponents).forEach(item => {
//             typeMap.set(item.typeId, item)
//         })
//     }
//     const defaultJsonItem = typeMap.get(data.type)
//     let jsonItem = _.cloneDeep(defaultJsonItem)
//     let param = dataParams[data.type]
//     if (param) {
//         Object.keys(param).forEach(key => {
//             let value = _.get(data.expand, key)
//             _.set(jsonItem, param[key], value)
//         })
//     }
//     jsonItem.dId = data.id
//     jsonItem.sort = data.sort
//     jsonItem.typeId = data.type
//     jsonItem.displayType = data.displayType
//     jsonItem.__config__.span = data.span
//     jsonItem.__config__.formId = data.formItemId
//     jsonItem.__config__.label = data.label
//     jsonItem.__config__.required = data.required
//     jsonItem.__config__.regList = data.regList
//     jsonItem.__config__.showLabel = data.showLabel
//     if (data.defaultValue) {
//         if (data.defaultValue.json) {
//             jsonItem.__config__.defaultValue = JSON.parse(data.defaultValue.value)
//         } else {
//             jsonItem.__config__.defaultValue = data.defaultValue.value
//         }
//     }
//     // 不同项目地址区分 动态修改上传地址
//     if (jsonItem.action) {
//         jsonItem.action = jsonItem.action + data.projectKey
//     }
//     jsonItem.regList = data.regList
//     jsonItem.placeholder = data.placeholder
//     jsonItem.formItemId = data.formItemId
//     jsonItem.__vModel__ = 'field' + data.formItemId
//     return jsonItem
// }
//
// /**
//  *
//  * @type {{'1': {maxlength: string, prepend: string, append: string}}}
//  *
//  */
// const dataParams = {
//     // 单行文本
//     'INPUT': {
//         'prepend': '__slot__.prepend',
//         'prefixIcon': 'prefix-icon',
//         'maxlength': 'maxlength',
//         'showWordLimit': 'show-word-limit',
//         'append': '__slot__.append'
//     },
//     // 多行文本
//     'TEXTAREA': {
//         'minRows': 'autosize.minRows',
//         'maxRows': 'autosize.maxRows',
//         'maxlength': 'maxlength'
//     },
//     // 计数器
//     'NUMBER_INPUT': {
//         'min': 'min',
//         'max': 'max',
//         'maxlength': 'maxlength',
//         'step': 'step',
//         'step-strictly': 'step-strictly',
//         'precision': 'precision',
//         'controls-position': 'controls-position'
//     },
//     // 下拉选择
//     'SELECT': {
//         'options': '__slot__.options',
//         'filterable': 'filterable',
//         'multiple': 'multiple'
//     },
//     // 级联选择
//     'CASCADER': {
//         'options': 'options',
//         'filterable': 'filterable',
//         'show-all-levels': 'showAllLevels',
//         'multiple': 'props.props.multiple'
//     },
//     // 单选框组
//     'RADIO': {
//         'optionType': '__config__.optionType',
//         'border': '__config__.border',
//         'options': '__slot__.options',
//         'filterable': 'filterable',
//         'size': 'size',
//         'multiple': 'props.props.multiple'
//     },
//     // 多选框组
//     'CHECKBOX': {
//         'optionType': '__config__.optionType',
//         'size': 'size',
//         'options': '__slot__.options',
//         'max': 'max',
//         'min': 'min'
//     }, // 开关
//     'SWITCH': {},
//     // 滑块
//     'SLIDER': {
//         'min': 'min',
//         'max': 'max',
//         'step': 'step'
//     }, // 时间选择
//     'TIME': {},
//     'RATE': {
//         'max': 'max',
//         'allowHalf': 'allow-half',
//         'showText': 'show-text',
//         'showScore': 'show-score',
//         'disabled': 'disabled'
//     },
//     // 文件上传
//     'UPLOAD': {
//         'buttonText': '__config__.buttonText',
//         'showTip': '__config__.showTip',
//         'fileSize': '__config__.fileSize',
//         'sizeUnit': '__config__.sizeUnit',
//         'listType': 'list-type',
//         'limit': 'limit',
//         'multiple': 'multiple',
//         'accept': 'accept'
//     },
//     // 图片
//     'IMAGE': {
//         'src': 'src',
//         'alt': 'alt'
//     },
//     // 图片选择
//     'IMAGE_SELECT': {
//         'options': 'options',
//         'multiple': 'multiple'
//     },
//     // 图片轮播
//     'IMAGE_CAROUSEL': {
//         'options': '__slot__.options'
//     },
//     // 文字描述
//     'DESC_TEXT': {
//         'color': 'color',
//         'textAlign': 'textAlign'
//     },
//     // 手写签名
//     'SIGN_PAD': {
//         'color': 'color'
//     },
//     // 日期类型
//     'DATE': {
//         'type': 'type',
//         'format': 'format',
//         'valueFormat': 'value-format'
//     }
// }
//
