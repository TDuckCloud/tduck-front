# Tduck-WEB

![s8sdOO.png](https://s3.ax1x.com/2021/01/11/s8sdOO.png)
TDuck 前端源码

#### 项目源码

|   后端源码  |   前端源码  |
|--- | --- |
|  https://gitee.com/TDuckApp/tduck-platform   |  https://gitee.com/TDuckApp/tduck-front   |


#### Build Setup
``` bash
# 配置镜像加速
https://www.ydyno.com/archives/1219.html

# 安装依赖
npm install

# 启动服务 localhost:8013
npm run serve

# 构建生产环境
npm run build
```

#### 常见问题

1、linux 系统在安装依赖的时候会出现 node-sass 无法安装的问题

解决方案：
```
1. 单独安装：npm install --unsafe-perm node-sass 
2. 直接使用：npm install --unsafe-perm
```

2、加速node-sass安装

https://www.ydyno.com/archives/1219.html


####  目录简介
- api axios 封装
- assets 静态资源
- components 公共组件
- router 路由
- store vuex
- theme elementui主题
- util 工具类
- views 页面


#### 特别鸣谢


- 感谢 (https://gitee.com/eoner/vue-automation) 前端脚手架

- 感谢 (https://gitee.com/TDuckApp/form-generator) 表单生成器





