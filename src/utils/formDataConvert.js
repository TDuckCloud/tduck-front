import _ from 'lodash'

/**
 * 表单json转换为后台需要的对象
 * @param item
 */
export function formItemConvertData(item) {
    console.log(item)
    let data = {
        'type': item.typeId,
        'formItemId': item.__config__.formId,
        'label': item.__config__.label,
        'defaultValue': item.defaultValue,
        'required': item.__config__.required,
        'placeholder': item.placeholder,
        'regList': item.__config__.regList
    }
    let extend = {}
    let param = dataParams[item.typeId]
    if (param) {
        Object.keys(param).forEach(key => {
            let value = _.get(item, param[key])
            _.set(extend, key, value)
        })
        _.set(data, 'extend', extend)
    }
    console.log(data)
}

/**
 * 不同属性的存在json的位置不用 使用变量记录key 通过lodash表达式获取
 * @type {{'1': {maxlength: string, prepend: string, append: string}}}
 */
let dataParams = {
    1: {
        'prepend': '__slot__.prepend',
        'maxlength': 'maxlength',
        'append': '__slot__.append'
    }
}








