import TduckForm from 'tduck-form-generator'
import store from '@/store/index'

export default {
  data() {
    return {
      formKey: null
    }
  },
  created() {
    // 写入值到localStorage 给组件使用
    if (store.state.user.token) {
      localStorage.setItem(TduckForm.constant.ACCESS_TOKEN, store.state.user.token)
    }
  }
}
