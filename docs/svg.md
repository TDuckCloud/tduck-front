# SVG图标

现在越来越多项目开始使用 SVG 图标做为精灵图的替代品，本框架也提供了 SVG 图标支持，方便使用。推荐去[阿里巴巴矢量图标库](https://www.iconfont.cn/)下载高质量 SVG 图标

首先将 svg 文件放到 `src/assets/icons/` 目录下，然后在页面中就可以使用了，`name` 就是 svg 文件名

```html
<svg-icon name="example" />
```

> `<svg-icon />` 组件为全局组件，所以无需注册即可使用