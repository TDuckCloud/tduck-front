/* eslint-disable */
<template>
  <textarea :id="tinymceId" style="visibility: hidden" />
</template>

<script>
import loadTinymce from '@/utils/loadTinymce'
import { plugins, toolbar } from './config'
import { debounce } from 'throttle-debounce'
import constants from '@/utils/constants'

let num = 1

export default {
  name: 'Tinymce',
  props: {
    id: {
      type: String,
      default: () => {
        num === 10000 && (num = 1)
        return `tinymce${+new Date()}${num++}`
      }
    },
    value: {
      default: ''
    }
  },
  data() {
    return {
      tinymceId: this.id
    }
  },
  mounted() {
    loadTinymce((tinymce) => {
      let token = this.getUserToken()
      let uploadUrl = constants.userUploadUrl
      // eslint-disable-next-line global-require
      require('./zh_CN')
      let conf = {
        selector: `#${this.tinymceId}`,
        language: 'zh_CN',
        menubar: 'false',
        skin_url: '/tinymce/skins/ui/tduck',
        content_css: '/tinymce/skins/content/tduck',
        cache_suffix: '?v=0.0.1',
        plugins,
        toolbar,
        toolbar_drawer: 'sliding',
        toolbar_mode: 'sliding',
        height: 200,
        // fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
        branding: false,
        object_resizing: false,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        default_link_target: '_blank',
        link_title: false,
        statusbar: false,
        nonbreaking_force_tab: true,
        images_upload_handler: function (blobInfo, succFun, failFun) {
          var xhr, formData
          var file = blobInfo.blob() // 转化为易于理解的file对象
          xhr = new XMLHttpRequest()
          xhr.withCredentials = false
          xhr.open('POST', uploadUrl)
          xhr.setRequestHeader('token', token)
          xhr.onload = function () {
            var json
            if (xhr.status != 200) {
              failFun('HTTP Error: ' + xhr.status)
              return
            }
            json = JSON.parse(xhr.responseText)
            if (!json || typeof json.data != 'string') {
              failFun('Invalid JSON: ' + xhr.responseText)
              return
            }
            succFun(json.data)
          }
          formData = new FormData()
          formData.append('file', file, file.name) // 此处与源文档不一样
          xhr.send(formData)
        }
      }
      conf = Object.assign(conf, this.$attrs)
      conf.init_instance_callback = (editor) => {
        if (this.value) editor.setContent(this.value)
        this.vModel(editor)
      }
      tinymce.init(conf)
    })
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    vModel(editor) {
      // 控制连续写入时setContent的触发频率
      const debounceSetContent = debounce(250, editor.setContent)
      this.$watch('value', (val, prevVal) => {
        if (editor && val !== prevVal && val !== editor.getContent()) {
          if (typeof val !== 'string') val = val.toString()
          debounceSetContent.call(editor, val)
        }
      })

      editor.on('change keyup undo redo', () => {
        this.$emit('input', editor.getContent())
      })
      editor.on('blur', () => {
        this.$emit('blur')
      })
    },
    getUserToken() {
      return this.$store.getters['user/isLogin']
    },
    destroyTinymce() {
      if (!window.tinymce) return
      const tinymce = window.tinymce.get(this.tinymceId)
      if (tinymce) {
        tinymce.destroy()
      }
    }
  }
}
</script>
