const dialog = (editor) => {
  return {
    title: '上传文件',
    body: {
      type: 'panel',
      items: [
        {
          type: 'urlinput', // component type
          name: 'upload', // identifier
          filetype: 'file', // allow any file types
          label: 'Url', // text for component label
        }
      ]
    },
    buttons: [
      {
        type: 'cancel',
        text: '取消'
      },
      {
        type: 'submit',
        text: '插入',
        primary: true
      }
    ],
    onChange(api) {
      // api.block('上传中……')
      // console.log(api.getData())
    },
    onSubmit: function (api) {
      let data = api.getData()
      console.log(data)
      let url= data.upload.meta.text
      // 截取文件名
      let filename = url.substring(url.lastIndexOf('/') + 1)
      // 将输入框内容插入到内容区光标位置
      editor.insertContent(`<a href="${url}" download="${filename}" target="_blank">下载链接</a>`)
      api.close()
    }
  }
}

tinymce.PluginManager.add('download', function (editor, url) {
  // 注册一个工具栏按钮名称
  editor.ui.registry.addButton('download', {
    text: '',
    icon: 'download',
    tooltip: '下载',
    onAction: function () {
      const dialogConfig = dialog(editor)
      editor.windowManager.open(dialogConfig)
    }
  })

  return {
    getMetadata: function () {
      return {
        //插件名和链接会显示在“帮助”→“插件”→“已安装的插件”中
        name: '下载', //插件名称
        url: 'doc.tduckcloud.com' //作者网址
      }
    }
  }
})
