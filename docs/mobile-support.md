# 移动端支持

移动端各司都有自己的解决方案，以下为我司为例，做为参考：

我司统一使用 vw/vh 做为移动端的布局单位，单位转换通过 [postcss-px-to-viewport](https://www.npmjs.com/package/postcss-px-to-viewport) 进行处理。

首先安装依赖：

`yarn add -D postcss-px-to-viewport`

然后在 `vue.config.js` 里进行配置，具体配置信息可根据项目实际调整：

```js
module.exports = {
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require('postcss-px-to-viewport')({
                        'unitToConvert': 'px',
                        'viewportWidth': 750,
                        'unitPrecision': 3,
                        'viewportUnit': 'vw',
                        'selectorBlackList': [
                            'ignore',
                            'van',
                            'mescroll'
                        ],
                        'minPixelValue': 1,
                        'mediaQuery': false
                    })
                ]
            }
        }
    }
}
```

最后在开发中就可以直接使用 px 了，最终输出就是 vw 。