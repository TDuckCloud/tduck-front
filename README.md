# tduck-front

## 说明

该仓库是为统一 Vue 项目初期配置而设立，方便快速进行业务开发，基于 Vue CLI 3 。

## 使用

### 方法 1

> 适用于初学者快速上手，项目里包含演示文件，方便学习

拉取该项目到本地，安装依赖包后运行即可。

运行后，可以看到功能演示，同时项目目录里带有 `example` 的目录均为演示代码。


## 依赖

- vue-router
- vuex
- axios
- lodash
- dayjs
- vue-cookies
- vue-meta
- node-sass
- sass-loader
- sass-resources-loader
- svg-sprite-loader
- webpack-spritesmith

## 全局 SCSS 资源

> 全局 SCSS 资源通过 [sass-resources-loader](https://www.npmjs.com/package/sass-resources-loader) 实现
> 
> 注意！并不是全局样式，而是 SCSS 资源，是变量、@mixin 、@function 这些东西

在 `assets/styles/resources/` 目录下存放全局的 scss 资源，也就是说在这个目录里的文件，无需在页面上引用即可生效并使用。

例子中默认存放了 `utils.scss` 文件，里面有几个 `@mixin` 和 `%` ，你可以尝试在页面中使用它们看看效果。

同样， `assets/sprites/` 目录下生成的 scss 文件也是默认全局。

## 全局组件

> 全局组件会自动注册，可直接使用。

在 `components/global/` 目录下存放全局组件，需要注意各个组件按文件夹区分，文件夹名称与组件名无关联。

每个组件的文件夹内至少保留一个文件名为 index 的组件入口，例如 index.vue 。

普通组件必须设置 name 并保证其唯一，自动注册会将组件的 name 设为组件名，可参考 SvgIcon 组件写法。

如果组件是通过 js 进行调用，则确保组件入口文件为 index.js，可参考 ExampleNotice 组件。


## 路由

路由也实现自动注册，但因为有优先级的概念，先定义的会先匹配，所以同一模块下的路由必须放在一个路由配置文件里，具体可参考 `router/modules/example.js` 文件。

## Vuex

Vuex 同样实现了自动注册，开发只需关注 `store/modules/` 文件夹里的文件即可，同样也按照模块区分文件。

