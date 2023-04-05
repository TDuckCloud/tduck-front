const DRAWING_ITEMS = 'drawingItems'
const DRAWING_ITEMS_VERSION = '1.2'
const DRAWING_ITEMS_VERSION_KEY = 'DRAWING_ITEMS_VERSION'
const DRAWING_ID = 'idGlobal'
const TREE_NODE_ID = 'treeNodeId'
const FORM_CONF = 'formConf'
const FORM_DATA = 'formData'
const FORM_SAVE_DATA = 'formSaveData'

export function getDrawingList(key) {
  // 加入缓存版本的概念，保证缓存数据与程序匹配
  const version = localStorage.getItem(DRAWING_ITEMS_VERSION_KEY)
  if (version !== DRAWING_ITEMS_VERSION) {
    localStorage.setItem(DRAWING_ITEMS_VERSION_KEY, DRAWING_ITEMS_VERSION)
    saveDrawingList([])
    return null
  }

  const str = localStorage.getItem(`${DRAWING_ITEMS}:${key}`)
  if (str) return JSON.parse(str)
  return null
}

export function saveDrawingList(list, key) {
  if (key) localStorage.setItem(`${DRAWING_ITEMS}:${key}`, JSON.stringify(list))
}

export function getIdGlobal(key) {
  const str = localStorage.getItem(`${DRAWING_ID}:${key}`)
  if (str) return parseInt(str, 10)
  return 100
}

export function saveIdGlobal(id, key) {
  if (key) localStorage.setItem(`${DRAWING_ID}:${key}`, `${id}`)
}

export function getTreeNodeId() {
  const str = localStorage.getItem(TREE_NODE_ID)
  if (str) return parseInt(str, 10)
  return 100
}

export function saveTreeNodeId(id) {
  localStorage.setItem(TREE_NODE_ID, `${id}`)
}

export function getFormConf(key) {
  const str = localStorage.getItem(`${FORM_CONF}:${key}${key}`)
  if (str) return JSON.parse(str)
  return null
}

export function saveFormConf(obj, key) {
  if (key) localStorage.setItem(`${FORM_CONF}:${key}`, JSON.stringify(obj))
}

export function getFormData(key) {
  const str = localStorage.getItem(`${FORM_DATA}:${key}`)
  if (str) return JSON.parse(str)
  return null
}

export function saveFormData(obj, key) {
  if (key) localStorage.setItem(`${FORM_DATA}:${key}`, JSON.stringify(obj))
}

export function removeFormData(key) {
  if (key) localStorage.removeItem(`${FORM_DATA}:${key}`)
}

export function getFormSaveData(key) {
  const str = localStorage.getItem(`${FORM_SAVE_DATA}:${key}`)
  if (str) return JSON.parse(str)
  return null
}

export function saveFormSaveData(obj, key) {
  if (key) localStorage.setItem(`${FORM_SAVE_DATA}:${key}`, JSON.stringify(obj))
}
