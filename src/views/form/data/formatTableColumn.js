import _ from 'lodash'
import { removeHtmlTag } from '@/utils'

export function formatTableColumn(item) {
  // 如果是个json对象 格式化成json字符串
  if (['SELECT', 'CASCADER', 'IMAGE_SELECT'].includes(item.type)) {
    return {
      field: item.value,
      title: item.label,
      minWidth: '150',
      slots: {
        // 使用 JSX 渲染
        default: ({ row }) => {
          if (_.isArray(row[item.value])) {
            return row[item.value].join(',')
          } else {
            return row[item.value]
          }
        }
      }
    }
  }
  if ('PROVINCE_CITY' === item.type) {
    return {
      field: item.value,
      title: item.label,
      minWidth: '150',
      slots: {
        // 使用 JSX 渲染
        default: ({ row }) => {
          if (_.isArray(row[item.value])) {
            return row[item.value].join(',')
          } else {
            return _.get(row[item.value], 'cascadeValue') + ' ' + _.get(row[item.value], 'detailAddr')
          }
        }
      }
    }
  } else if ('IMAGE_UPLOAD' === item.type) {
    return {
      field: item.value,
      title: item.label,
      minWidth: '150',
      slots: { default: 'img_default' }
    }
  } else if ('UPLOAD' === item.type) {
    return {
      field: item.value,
      title: item.label,
      minWidth: '150',
      slots: { default: 'file_default' }
    }
  } else if ('SIGN_PAD' === item.type) {
    return {
      field: item.value,
      title: item.label,
      minWidth: '150',
      slots: { default: 'signpad_default' }
    }
  } else if ('MATRIX_INPUT' === item.type) {
    return {
      field: item.value,
      title: item.label,
      minWidth: '150',
      formatter: (event) => formatMatrixInputData(event.row[item.value], item)
    }
  } else if (['MATRIX_SELECT', 'MATRIX_SCALE'].includes(item.type)) {
    return {
      field: item.value,
      title: item.label,
      minWidth: '150',
      formatter: (event) => formatMatrixSelectData(event.row[item.value], item)
    }
  } else if ('SUB_FORM' === item.type) {
    return {
      field: item.value,
      title: item.label,
      minWidth: '150',
      formatter: (event) => formatSubFormData(event.row[item.value], item)
    }
  } else if ('SORT' === item.type) {
    return {
      field: item.value,
      title: item.label,
      minWidth: '150',
      slots: {
        default: ({ row }) => {
          if (row[item.value]) {
            let v = row[item.value].map((item) => item.label).join(',')
            return [v]
          }
        }
      }
    }
  }
  return { field: item.value, minWidth: '200px', title: item.label }
}

/**
 * 格式化矩阵输入
 * @param value
 * @param item
 * @returns {string|null}
 */
export function formatMatrixInputData(value, item) {
  if (!value) {
    return null
  }
  let text = ''
  Object.keys(value).forEach((key) => {
    let row = item.scheme.table.rows.find((row) => row.id == key)
    if (row) {
      let rowText = ''
      let rowValue = value[key]
      Object.keys(rowValue).forEach((ckey) => {
        let col = item.scheme.table.columns.find((col) => col.id == ckey)
        if (col) {
          rowText += `${col.label}：${rowValue[ckey]}，`
        }
      })
      text += ` ${row.label}：( ${rowText} )`
    }
  })
  return text
}

/**
 * 格式化矩阵选择
 * @param value
 * @param item
 * @returns {string|null}
 */
export function formatMatrixSelectData(value, item) {
  if (!value) {
    return null
  }
  let text = ''
  Object.keys(value).forEach((key) => {
    let row = item.scheme.table.rows.find((row) => row.id == key)
    if (row) {
      text += ` ${row.label}：( ${value[key]} )`
    }
  })
  return text
}

/**
 * 格式化矩阵选择
 * @param value
 * @param item
 * @returns {string|null}
 */
export function formatSubFormData(value, item) {
  if (!value) {
    return null
  }
  let keyLabelObj = {}
  let childList = item.scheme.childList
  childList.forEach((c) => {
    keyLabelObj[c.vModel] = removeHtmlTag(c.config.label)
  })
  let subFormValue = value.map((subValue) => {
    let tempObj = {}
    Object.keys(subValue).forEach((sKey) => {
      tempObj[keyLabelObj[sKey]] = subValue[sKey]
    })
    return tempObj
  })
  return JSON.stringify(subFormValue)
}
