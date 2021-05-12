<script>
import {deepClone} from '@/utils/index'
import {evalExpression} from '@/utils/expression'
import render from '@/components/render/render.js'
import _ from 'lodash'

const ruleTrigger = {
    'el-input': 'blur',
    'el-input-number': 'blur',
    'el-select': 'change',
    'el-radio-group': 'change',
    'el-checkbox-group': 'change',
    'el-cascader': 'change',
    'el-time-picker': 'change',
    'el-date-picker': 'change',
    'el-rate': 'change'
}

const processType = {
    'el-select': '__slot__.options',
    'el-cascader': 'options',
    'el-radio-group': '__slot__.options',
    'el-checkbox-group': '__slot__.options'
}

const layouts = {
    colFormItem(h, scheme) {
        const config = scheme.__config__
        const listeners = buildListeners.call(this, scheme)
        const {formConfCopy} = this
        let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
        if (config.showLabel === false) labelWidth = '0'
        let label = config.label
        if (formConfCopy.showNumber) {
            label = scheme.serialNumber + ': ' + label
        }
        this.$set(this[this.formConf.formModel], scheme.__vModel__, [])
        let colStyle = scheme.logicShow ? '' : 'display:none'
        let cidAttr = config.formId
        return (
            <el-col span={config.span} style={colStyle} cid={cidAttr}>
                <el-form-item label-width={labelWidth} prop={scheme.__vModel__}
                    label={config.showLabel ? label : ''}>
                    <render conf={scheme} {...{on: listeners}} />
                </el-form-item>
            </el-col>
        )
    },
    rowFormItem(h, scheme) {
        let child = renderChildren.apply(this, arguments)
        if (scheme.type === 'flex') {
            child = <el-row type={scheme.type} justify={scheme.justify} align={scheme.align}>
                {child}
            </el-row>
        }
        return (
            <el-col span={scheme.span}>
                <el-row gutter={scheme.gutter}>
                    {child}
                </el-row>
            </el-col>
        )
    }
}

function renderFrom(h) {
    const {formConfCopy} = this

    return (
        <el-row gutter={formConfCopy.gutter}>
            <el-form
                size={formConfCopy.size}
                label-position={formConfCopy.labelPosition}
                disabled={formConfCopy.disabled}
                label-width={`${formConfCopy.labelWidth}px`}
                ref={formConfCopy.formRef}
                // model不能直接赋值 https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
                props={{model: this[formConfCopy.formModel]}}
                rules={this[formConfCopy.formRules]}
            >
                {renderFormItem.call(this, h, formConfCopy.fields)}
                {formConfCopy.formBtns && formBtns.call(this, h)}
            </el-form>
        </el-row>
    )
}

function formBtns() {
    const {formConfCopy} = this
    let style = {
        'background-color': formConfCopy.submitBtnColor,
        'border-color': formConfCopy.submitBtnColor
    }
    let btnSpan = 24
    if (formConfCopy.resetBtn) {
        return <el-col>
            <el-form-item size="large" style="margin-top:30px">
                <el-row>
                    <el-col span="4" offset="6">
                        <el-button type="primary" onClick={this.submitForm}>提交</el-button>
                    </el-col>
                    <el-col span="9" offset="3">
                        <el-button onClick={this.resetForm}>重置</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-col>
    }
    return <el-col>
        <el-form-item size="large" class="submit-btn-form-item" style="margin-top:30px;">
            <el-row type="flex" justify="center">
                <el-col span={btnSpan}>
                    <el-button style={style} type="primary"
                        onClick={this.submitForm}>{this.formConfCopy.submitBtnText}</el-button>
                </el-col>
            </el-row>
        </el-form-item>
    </el-col>

}

function renderFormItem(h, elementList) {
    return elementList.map(scheme => {
        const config = scheme.__config__
        const layout = layouts[config.layout]

        if (layout) {
            return layout.call(this, h, scheme)
        }
        throw new Error(`没有与${config.layout}匹配的layout`)
    })
}

function renderChildren(h, scheme) {
    const config = scheme.__config__
    if (!Array.isArray(config.children)) return null
    return renderFormItem.call(this, h, config.children)
}

function setUpload(config, scheme, response, file, fileList) {
    console.log(fileList)
    let newValue = JSON.parse(this[this.formConf.formModel][scheme.__vModel__])
    if (!newValue) {
        newValue = []
    }
    newValue.push({fileName: file.name, url: response.data})
    this.$set(config, 'defaultValue', JSON.stringify(newValue))
    this.$set(this[this.formConf.formModel], scheme.__vModel__, JSON.stringify(newValue))
    setValueLabel.call(this, {type: 'file', files: JSON.stringify(newValue)}, config, scheme)
}

function deleteUpload(config, scheme, file, fileList) {
    let newValue = []
    fileList.forEach(element => {
        newValue.push({fileName: element.name, url: element.url})
    })
    this.$set(config, 'defaultValue', JSON.stringify(newValue))
    this.$set(this[this.formConf.formModel], scheme.__vModel__, JSON.stringify(newValue))
    setValueLabel.call(this, {type: 'file', files: JSON.stringify(newValue)}, config, scheme)
}

function setValue(event, config, scheme) {
    this.$set(config, 'defaultValue', event)
    this.$set(this[this.formConf.formModel], scheme.__vModel__, event)
    setValueLabel.call(this, event, config, scheme)
    let logicShowRule = this.formConfCopy.logicShowRule
    // 找到该问题需要触发显示的问题 判断逻辑是否成立
    let rules = _.get(logicShowRule, config.formId)
    if (rules && Array.isArray(rules)) {
        rules.forEach(r => {
            // 成立让该对应的问题显示出来
            let flag = evalExpression(this[this.formConf.formModel], r.logicExpression)
            if (flag) {
                document.querySelector(`div[cid="${r.triggerFormItemId}"]`).style.display = ''
            } else {
                document.querySelector(`div[cid="${r.triggerFormItemId}"]`).style.display = 'none'
            }
        })
    }
}

/**
 * radio checkbox 其他输入框值处理
 */
function setOtherValueLabel(event, config) {
    let value = this[this.formConf.formModel][config.__vModel__]
    this.$set(this[this.formConf.labelFormModel], `${config.__vModel__}other`, event)
    setValueLabel.call(this, value, config.__config__, config)
}

/**
 * 保存选项的label值
 * @param event
 * @param config
 * @param scheme
 */
function setValueLabel(event, config, scheme) {
    let tagOptionKey = processType[config.tag]
    if (tagOptionKey) {
        if (event instanceof Array) {
            let labelArr = new Array()
            event.forEach(item => {
                // 拼到头部 其他选项
                if (item === 0) {
                    labelArr.push(this[this.formConf.labelFormModel][`${scheme.__vModel__}other`])
                } else if (item) {
                    let {label} = getObject(_.get(scheme, tagOptionKey), 'value', item)
                    labelArr.push(label)
                }
            })
            this.$set(this[this.formConf.labelFormModel], scheme.__vModel__, labelArr.join(','))
        } else {
            // 多选 单选 其他自定义输入
            if (event == 0) {
                this.$set(this[this.formConf.labelFormModel], `${config.__vModel__}`, this[this.formConf.labelFormModel][`${config.__vModel__}other`])
            } else {
                let item = _.find(_.get(scheme, tagOptionKey), {'value': event})
                this.$set(this[this.formConf.labelFormModel], scheme.__vModel__, item.label)
            }
        }
    } else if (config.tag === 'el-upload') {
        this.$set(this[this.formConf.labelFormModel], scheme.__vModel__, event)
    } else {
        this.$set(this[this.formConf.labelFormModel], scheme.__vModel__, event)
    }
}

function getObject(array, key, value) {
    let o
    array.some(function iter(a) {
        if (a[key] === value) {
            o = a
            return true
        }
        return Array.isArray(a.children) && a.children.some(iter)
    })
    return o
}

function buildListeners(scheme) {
    const config = scheme.__config__
    const methods = this.formConf.__methods__ || {}
    const listeners = {}

    // 给__methods__中的方法绑定this和event
    Object.keys(methods).forEach(key => {
        listeners[key] = event => methods[key].call(this, event)
    })
    // 响应 render.js 中的 vModel $emit('input', val)
    listeners.input = event => setValue.call(this, event, config, scheme)
    listeners.upload = (response, file, fileList) => setUpload.call(this, config, scheme, response, file, fileList)
    listeners.deleteUpload = (file, fileList) => deleteUpload.call(this, config, scheme, file, fileList)
    listeners.selectOtherChange = (event, config) => setOtherValueLabel.call(this, event, config)
    return listeners
}

export default {
    components: {
        render
    },
    props: {
        formConf: {
            type: Object,
            required: true
        }
    },
    data() {
        const data = {
            formConfCopy: deepClone(this.formConf),
            [this.formConf.formModel]: {},
            [this.formConf.labelFormModel]: {},
            [this.formConf.formRules]: {}
        }
        this.initFormData(data.formConfCopy.fields, data[this.formConf.formModel])
        this.initLabelFormData(data.formConfCopy.fields, data[this.formConf.labelFormModel])
        this.buildRules(data.formConfCopy.fields, data[this.formConf.formRules])
        return data
    },
    watch: {
        formConf: {
            handler(val) {
                this.formConfCopy = val
                this.initFormData(this.data.formConfCopy.fields, this.data[this.formConf.formModel])
                this.initLabelFormData(this.data.formConfCopy.fields, this.data[this.formConf.labelFormModel])
                this.buildRules(this.data.formConfCopy.fields, this.data[this.formConf.formRules])
            },
            deep: true
        }
    },
    methods: {
        initLabelFormData(componentList, formData) {
            // 设置默认值
            componentList.forEach(cur => {
                let temConfig = cur.__config__
                if (cur.__vModel__) {
                    let tagOptionKey = processType[temConfig.tag]
                    let defaultValue = temConfig.defaultValue
                    let labelStr = ''
                    if (tagOptionKey && defaultValue) {
                        if (defaultValue instanceof Array) {
                            defaultValue.forEach(item => {
                                if (item) {
                                    let {label} = getObject(_.get(cur, tagOptionKey), 'value', item)
                                    labelStr += label + ','
                                }
                            })
                            formData[cur.__vModel__] = labelStr
                        } else {
                            let {label} = _.find(_.get(cur, tagOptionKey), {'value': defaultValue})
                            formData[cur.__vModel__] = label
                        }
                    }
                }
                if (temConfig.children) this.initLabelFormData(temConfig.children, formData)
            })
        },
        initFormData(componentList, formData) {
            // 设置默认值
            componentList.forEach(cur => {
                const config = cur.__config__
                if (cur.__vModel__) {
                    formData[cur.__vModel__] = config.defaultValue
                }
                if (config.children) this.initFormData(config.children, formData)
            })
        },
        buildRules(componentList, rules) {
            componentList.forEach(cur => {
                const config = cur.__config__
                if (cur.tag === 'el-upload') {
                    config.regList.push({
                        validator: () => {
                            console.log(cur.limit)
                        }, trigger: 'change'
                    })
                }
                if (Array.isArray(config.regList)) {
                    if (config.required) {
                        const required = {required: config.required, message: cur.placeholder}
                        if (Array.isArray(config.defaultValue)) {
                            required.type = 'array'
                            required.message = `请至少选择一个${config.label}`
                        }
                        required.message === undefined && (required.message = `${config.label}不能为空`)
                        config.regList.push(required)
                    }
                    rules[cur.__vModel__] = config.regList.map(item => {
                        item.pattern && (item.pattern = eval(item.pattern))
                        item.trigger = ruleTrigger && ruleTrigger[config.tag]
                        return item
                    })
                }
                if (config.children) this.buildRules(config.children, rules)
            })
        },
        resetForm() {
            this.formConfCopy = deepClone(this.formConf)
            this.$refs[this.formConf.formRef].resetFields()
        },
        submitForm() {
            this.$refs[this.formConf.formRef].validate(valid => {
                if (!valid) {
                    // 未选中自动高亮
                    // if (document.getElementsByClassName('el-form-item__error').length > 0) {
                    //
                    // }
                    setTimeout(() => {
                        let isError = document.getElementsByClassName('is-error')
                        isError[0].querySelector('input').focus()
                    }, 100)
                    return false
                }
                // 触发sumit事件
                this.$emit('submit', {
                    formModel: this[this.formConf.formModel],
                    labelFormModel: this[this.formConf.labelFormModel]
                })
                return true
            })
        }
    },
    render(h) {
        return renderFrom.call(this, h)
    }
}
</script>
<style scoped>
/deep/ .el-radio-group,
/deep/ .el-checkbox-group {
    margin-left: 10px;
}
/deep/ .el-radio,
/deep/ .el-checkbox {
    display: block;
    min-height: 23px;
    line-height: 23px;
}
/deep/ .el-radio__label,
/deep/ .el-checkbox__label {
    font-size: 14px;
    padding-left: 10px;
    text-overflow: ellipsis;
    white-space: normal;
    min-height: 18px;
    vertical-align: middle;
    display: inline-block;
}
/deep/ .item-other-input {
    margin-left: 20px;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}
/deep/ .item-other-input:focus {
    outline: none;
}
</style>
