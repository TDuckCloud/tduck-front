# Vue-router

路由也实现了自动注册，但因为有优先级的概念，先定义的会先匹配，所以同一模块下的路由需要放在一个路由配置文件里。

开发者只需关心 `router/modules/` 目录下的文件，一个模块对应一个 `.js` 文件，可参考 `router/modules/example.js` 文件。