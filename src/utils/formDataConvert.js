import _ from 'lodash'

/**
 * 表单json转换为后台需要的对象
 * @param item
 */
export function formItemConvertData(item, projectKey) {
    let data = {
        'type': item.typeId,
        'formItemId': item.__config__.formId,
        'label': item.__config__.label,
        'defaultValue': item.defaultValue,
        'required': item.__config__.required,
        'placeholder': item.placeholder,
        'regList': item.__config__.regList,
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
        'max': 'min',
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
    9: {

    },
    //滑块
    10:{
        'min': 'min',
        'max': 'max',
        'step': 'step',
    },//时间选择
    11:{

    }

}








