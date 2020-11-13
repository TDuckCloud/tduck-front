# 精灵图

> 又称雪碧图，原理是将多张小图合并到一张大图上，以便减少 HTTP 请求，提高网站访问速度。

精灵图原始图片的存放位置位于 `assets/sprites/` 目录下，注意按文件夹区分。

项目运行前会根据文件夹生成对应的精灵图文件（精灵图图片和 `.scss` 文件），多个文件夹则会生成多个精灵图文件。需要注意的是，在项目运行时，修改文件夹里的图片，会重新生成相关精灵图文件，但如果新建文件夹，则需要重新运行项目才会生成对应精灵图文件。

在 `.vue` 文件中可通过 `@include` 直接使用精灵图，无需手动引入 `.scss` 文件：

```scss
// 方法 1
// @include [文件夹名称]-sprite([文件名称]);
.icon {
    @include example-sprite(address);
}

// 方法 2
// @include all-[文件夹名称]-sprites;
@include all-example-sprites;
```

最终输出如下：

```css
/* 方法 1 */
.icon {
    background-image: url(img/example.326b35aec20837b9c08563c654422fe6.326b35ae.png);
    background-position: 0px 0px;
    background-size: 210px 210px;
    width: 100px;
    height: 100px;
}

/* 方法 2 */
.example-address-sprites {
  background-image: url(img/example.326b35aec20837b9c08563c654422fe6.326b35ae.png);
  background-position: 0 0;
  background-size: 210px 210px;
  width: 100px;
  height: 100px;
}
.example-feedback-sprites {
  background-image: url(img/example.326b35aec20837b9c08563c654422fe6.326b35ae.png);
  background-position: -110px 0;
  background-size: 210px 210px;
  width: 100px;
  height: 100px;
}
.example-payment-sprites {
  background-image: url(img/example.326b35aec20837b9c08563c654422fe6.326b35ae.png);
  background-position: 0 -110px;
  background-size: 210px 210px;
  width: 100px;
  height: 100px;
}
```

如果是小型项目，静态图标不多，可全部放在一个文件夹内；如果是中大型项目，文件夹可按模块来划分，这样不同的模块最终会生成各自的精灵图文件。