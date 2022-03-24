module.exports = {
    presets: [
        // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
          '@vue/cli-plugin-babel/preset'
    ],
    "plugins": [
      [
        "import",
        {
          "libraryName": "vxe-table",
          "style": true // 样式是否也按需加载
        }
      ]
    ],
    'env': {
        'development': {
            // babel-plugin-dynamic-import-node plugin only does one thing by converting all import() to require().
            // This plugin can significantly increase the speed of hot updates, when you have a large number of pages.
            'plugins': ['dynamic-import-node']
        }
    }
}
