# 全局 SASS 资源

> 全局 SASS 资源并不是全局样式，是变量、@mixin 、@function 这些东西

在 `assets/styles/resources/` 目录下存放全局的 SASS 资源，也就是说在这个目录里的文件，无需在页面上引用即可生效并使用。

项目中默认存放了 `utils.scss` 文件，里面有几个 `@mixin` 和 `%` ，你可以尝试在页面中使用它们看看效果。

同样，[精灵图](sprite)目录下生成的 SASS 资源也是全局可调用的。
