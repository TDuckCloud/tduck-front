import _ from 'lodash'

/**
 * 自定义表达式
 */
const expressionOperator = {
    'eq': function(v1, v2) {
        return _.isEqual(v1, v2)
    },
    'ne': function(v1, v2) {
        return !_.isEqual(v1, v2)
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
        return `#id${item.formItemId} ${item.expression} ${item.optionValue}`
    })
    return _.join(exList, LogicConnector[connector])
}

/**
 * 执行表达式是否成立
 */
export function evalExpression(context, expression) {
    let exArray = expression.split(/[|][&]/)
    exArray.forEach(item => {
        let itemExpArr = item.split(' ')
        let varName = itemExpArr[0].replace('#id')
        let sp = itemExpArr[1]
        let value = itemExpArr[2]
        let flag = expressionOperator[sp](context[varName], value)
    })
    return flag
}

