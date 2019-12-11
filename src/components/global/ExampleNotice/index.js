import Vue from 'vue'

const constructor = Vue.extend(require('./main.vue').default)

let instance

const exampleNotice = options => {
    options = options || {}
    instance = new constructor({
        data: options
    })
    instance.vm = instance.$mount()
    instance.dom = instance.vm.$el
    document.body.appendChild(instance.dom)
    return instance.vm
}

export default exampleNotice
