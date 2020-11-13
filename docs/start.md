# 使用

使用前确保本地环境已安装 [Vue CLI](https://cli.vuejs.org/zh/) 。

## 方法 1

> 适用于初学者快速上手，项目里包含演示文件，方便学习

```bash
git clone https://gitee.com/eoner/vue-automation.git
cd vue-automation
yarn install
```

拉取该项目到本地，安装依赖包后即可运行。

运行后，可以看到功能演示，同时项目目录里带有 `example` 的均为演示代码。

## 方法 2

> 适用于已熟练使用的老手，项目里无演代码，方便快速开展工作

安装并使用 [1one-project](https://www.npmjs.com/package/1one-project) 进行项目初始化。

## 注意事项

~~值得一提的是，如果安装过程出现 sass 相关的安装错误，请在安装 [mirror-config-china](https://www.npmjs.com/package/mirror-config-china) 后重试。~~

~~```yarn global add mirror-config-china```~~

大部分安装报错都是因为 `node-sass` 依赖导致，尤其是 Windows 用户，它会强制安装 `python2` 和 `Visual Studio` 才能编译成功。

目前本模版已将 `node-sass` 替换为 `sass` ，简化用户安装成本，同时 Sass 官方也已经将 `dart-sass` 作为未来主要的的开发方向了。

参考《[Node Sass to Dart Sass](https://panjiachen.gitee.io/vue-element-admin-site/zh/guide/advanced/sass.html)》
