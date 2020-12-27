export default {
    options(h, conf, key, that) {
        const list = []
        conf.__slot__.options.forEach(item => {
            if (conf.__config__.optionType === 'button') {
                list.push(<el-radio-button label={item.value}>{item.label}</el-radio-button>)
            } else {
                if (item.value == 0) {
                    list.push(<el-radio label={item.value} border={conf.border} >
                        {item.label}<input class='item-other-input' onChange={event => {
                         that.$emit('selectOtherChange', event.target.value,conf)
                    }}/>
                    </el-radio>)
                } else {
                    list.push(<el-radio label={item.value} border={conf.border}>{item.label}</el-radio>)
                }
            }
        })
        return list
    }
}
