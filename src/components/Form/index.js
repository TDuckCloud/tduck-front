const ImageSelect = require('./ImageSelect/index').default
const ImageSelect1 = require('./ImageSelect1/index').default
const DescText = require('./DescText/index').default
export default {
    install: Vue => {
        Vue.component(ImageSelect.name, ImageSelect)
        Vue.component(ImageSelect1.name, ImageSelect1)
        Vue.component(DescText.name, DescText)
    }
}
