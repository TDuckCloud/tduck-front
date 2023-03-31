import { deleteFormRequest, stopFormRequest, logicDeleteFormRequest } from '@/api/project/form'
import dayjs from 'dayjs'

export default {
  props: [],
  data() {
    return {
      folderId: 0,
      projectStatusList: [
        { code: '', name: '全部', color: '#006EFF' },
        { code: 1, name: '待发布', color: '#909399' },
        { code: 2, name: '收集中', color: '#409EFF' },
        { code: 3, name: '已停止', color: '#F56C6C' }
      ],
      projectTypeList: [
        { code: '', name: '全部', color: '#006EFF' },
        { code: 1, name: '表单', color: '#5190DE' },
        { code: 2, name: '流程', color: '#FF770F' },
        { code: 4, name: '考试', color: '#59C075' }
      ]
    }
  },
  filters: {
    formatDate(time) {
      return dayjs(time).format('YYYY/MM/DD')
    }
  },
  computed: {},
  methods: {
    getType(key) {
      const item = this.projectTypeList.find((e) => e.code === key)
      return item || { name: '', color: '' }
    },
    logicDeleteForm(key) {
      logicDeleteFormRequest({ formKey: key }).then((res) => {
        if (res.data) {
          this.msgSuccess('刪除成功')
          this.$emit('refresh')
        }
      })
    },
    deleteForm(key) {
      deleteFormRequest({ formKey: key }).then((res) => {
        if (res.data) {
          this.msgSuccess('刪除成功')
          this.$emit('refresh')
        }
      })
    },
    stopProject(key) {
      stopFormRequest({ formKey: key }).then((res) => {
        if (res.data) {
          this.msgSuccess('停止成功')
          this.$emit('refresh')
        }
      })
    },
    toProjectHandle(form, type) {
      this.$router.push({
        path: `/project/form/${type}`,
        query: { key: form.formKey, active: type, type: form.type }
      })
    }
  }
}
