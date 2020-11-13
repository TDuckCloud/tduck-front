# 全局组件

全局组件存放在 `components/global/` 目录下，需要注意各个组件按文件夹区分。

每个组件的文件夹内至少保留一个文件名为 `index` 的组件入口，例如 `index.vue` 。

组件必须设置 `name` 并保证其唯一，自动注册会将组件的 `name` 设为组件名，可参考 SvgIcon 组件写法。

虽然文件夹名称和 `name` 无关联，但建议与 `name` 保持一致。

如果组件是通过 js 进行调用，则确保组件入口文件为 `index.js`，可参考 ExampleNotice 组件。