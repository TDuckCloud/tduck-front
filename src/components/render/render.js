import {deepClone} from '@/utils/index'

const componentChild = {}
/**
 * 将./slots中的文件挂载到对象componentChild上
 * 文件名为key，对应JSON配置中的__config__.tag
 * 文件内容为value，解析JSON配置中的__slot__
 */
const slotsFiles = require.context('./slots', false, /\.js$/)
const keys = slotsFiles.keys() || []
keys.forEach(key => {
    const tag = key.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = slotsFiles(key).default
    componentChild[tag] = value
})

function vModel(dataObject, defaultValue) {
    let config = dataObject.attrs.__config__
    //表单组件特殊处理
    if (config.tag === 'el-upload') {
        //增加上传回调事件
        dataObject.attrs['on-success'] = (response, file, fileList) => {
            this.$emit('upload', response, file, fileList)
        }
        dataObject.attrs['on-remove'] = (file, fileList) => {
            this.$emit('deleteUpload', file, fileList)
        }
        dataObject.attrs['on-exceed'] = (files, fileList) => {
            this.$message.error(`最多上传${config.limit}个文件`)
        },
            dataObject.attrs['before-upload'] = (file) => {
                let sizeUnitNum = 1
                //文件大小判断
                switch (config.sizeUnit) {
                    case 'KB':
                        sizeUnitNum = 1024
                        break
                    case 'MB':
                        sizeUnitNum = 1024 * 1024
                        break
                    case 'GB':
                        sizeUnitNum = 1024 * 1024 * 1024
                        break
                }
                let totalSize = config.fileSize * sizeUnitNum
                if (file.size > totalSize) {
                    this.$message.error(`上传图片大小不能超过${config.fileSize}${config.sizeUnit}`)
                    return false
                }
            }
    } else {
        dataObject.props.value = defaultValue

        dataObject.on.input = val => {
            this.$emit('input', val)
        }
    }

}

function mountSlotFlies(h, confClone, children) {
    const childObjs = componentChild[confClone.__config__.tag]
    if (childObjs) {
        Object.keys(childObjs).forEach(key => {
            const childFunc = childObjs[key]
            if (confClone.__slot__ && confClone.__slot__[key]) {
                children.push(childFunc(h, confClone, key, this))
            }
        })
    }
}

function emitEvents(confClone) {
    ['on', 'nativeOn'].forEach(attr => {
        const eventKeyList = Object.keys(confClone[attr] || {})
        eventKeyList.forEach(key => {
            const val = confClone[attr][key]
            if (typeof val === 'string') {
                confClone[attr][key] = event => this.$emit(val, event)
            }
        })
    })
}

function buildDataObject(confClone, dataObject) {
    Object.keys(confClone).forEach(key => {
        const val = confClone[key]
        if (key === '__vModel__') {
            vModel.call(this, dataObject, confClone.__config__.defaultValue)
        } else if (dataObject[key]) {
            dataObject[key] = {...dataObject[key], ...val}
        } else {
            dataObject.attrs[key] = val
        }
    })

    // 清理属性
    clearAttrs(dataObject)
}

function clearAttrs(dataObject) {
    delete dataObject.attrs.__config__
    delete dataObject.attrs.__slot__
    delete dataObject.attrs.__methods__
}

function makeDataObject() {
    return {
        attrs: {},
        props: {},
        nativeOn: {},
        on: {},
        style: {}
    }
}

export default {
    props: {
        conf: {
            type: Object,
            required: true
        }
    },
    render(h) {
        const dataObject = makeDataObject()
        const confClone = deepClone(this.conf)
        const children = this.$slots.default || []

        // 如果slots文件夹存在与当前tag同名的文件，则执行文件中的代码
        mountSlotFlies.call(this, h, confClone, children)

        // 将字符串类型的事件，发送为消息
        emitEvents.call(this, confClone)

        // 将json表单配置转化为vue render可以识别的 “数据对象（dataObject）”
        buildDataObject.call(this, confClone, dataObject)

        return h(this.conf.__config__.tag, dataObject, children)
    }
}
