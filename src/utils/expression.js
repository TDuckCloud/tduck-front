import _ from 'lodash'

/**
 * 自定义表达式
 */
const expressionOperator = {
    eq: function(v1, v2) {
        console.log(v1)
        console.log(v2)
        return v1 == v2
    },
    ne: function(v1, v2) {
        return v1 != v2
    }
}

/**
 * 逻辑连接符
 * @type {{'1': string, '2': string}}
 */
const LogicConnector = {
    1: '||',
    2: '&&'
}

/**
 * 获取表达式
 *  @conditionList 条件列表
 *  @connector 连接符 ||或者 &&
 */
export function getExpression(conditionList, connector) {
    let exList = conditionList.map(item => {
        return `field${item.formItemId} ${item.expression} ${item.optionValue}`
    })
    return _.join(exList, LogicConnector[connector])
}

/**
 * 执行表达式是否成立
 */
export function evalExpression(context, expression) {
    let exArray = expression.split(/[|][&]/)
    //获取是& 还是|
    let and = exArray.indexOf('|') ? false : true
    let flag = false
    console.log(exArray)
    for (let i = 0; i < exArray.length; i++) {
        let itemExpArr = exArray[i].split(' ')
        console.log(itemExpArr)
        //截取字段名
        let varName = itemExpArr[0]
        //条件 等于 不等于
        let sp = itemExpArr[1]
        // 值
        let value = itemExpArr[2]
        //比较是否成立
        console.log(varName)
        let filedValue = _.get(context, varName)
        console.log(filedValue)
        flag = expressionOperator[sp](filedValue, value)
        console.log(flag)
        // & 一个不成立直接调出循环 返回成功
        if (and && !flag) {
            break
            // | 一个成立直接调出循环 返回成功
        } else if (!and && flag) {
            break
        }
    }
    return flag
}

