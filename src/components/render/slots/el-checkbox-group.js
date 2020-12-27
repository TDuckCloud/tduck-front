export default {
    options(h, conf, key, that) {
        const list = []
        conf.__slot__.options.forEach(item => {
            if (conf.__config__.optionType === 'button') {
                list.push(<el-checkbox-button label={item.value}>{item.label}</el-checkbox-button>)
            } else {
                if (item.value == 0) {
                    list.push(<el-checkbox label={item.value}
                                           border={conf.border}>{item.label}
                        <input class='item-other-input' onChange={event => {
                            that.$emit('selectOtherChange', event.target.value, conf)
                        }}/></el-checkbox>)
                } else {
                    list.push(<el-checkbox label={item.value} border={conf.border}>{item.label}</el-checkbox>)
                }
            }
        })
        return list
    }
}
