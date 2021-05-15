const ImageSelect = require('./ImageSelect/index').default
const DescText = require('./DescText/index').default
export default {
    install: Vue => {
        Vue.component(ImageSelect.name, ImageSelect)
        Vue.component(DescText.name, DescText)
    }
}
