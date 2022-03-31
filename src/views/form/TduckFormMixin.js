import TduckForm from 'tduck-form-generator'
import store from '@/store/index'
import {getCurrentDomain} from '@/utils'

export default {
    data() {
        return {
            formKey: null
        }
    },
    created() {
    // 写入值到localStorage 给组件使用
        if (store.state.user.token) {
            localStorage.setItem(TduckForm.constant.ACCESS_TOKEN,  store.state.user.token)
        }
        localStorage.setItem('FORM-SUPPORT', process.env['VUE_APP_TITLE'])
        localStorage.setItem(TduckForm.constant.ACCESS_TOKEN_NAME, 'token')
        if (process.env['VUE_APP_API_ROOT']) {
            localStorage.setItem(TduckForm.constant.BASE_URL, process.env['VUE_APP_API_ROOT'])
        } else {
            localStorage.setItem(TduckForm.constant.BASE_URL, getCurrentDomain())
        }

    }
}
