
<p align="center">
    <a href="https://www.tduckcloud.com" target="_blank" rel="noopener noreferrer">
        <img style="margin-bottom: 0px;" width="100px" src="https://oss.tduckcloud.com/lading-image/ICO-icon.png" alt="TDUCK logo" />
    </a>
</p>

<p align="center">数据收集，如此简单。</p>

<p align="center">
    <img src='https://gitee.com/TDuckApp/tduck-platform/badge/star.svg?theme=dark' alt='star'></img>
    <img src='https://gitee.com/TDuckApp/tduck-platform/badge/fork.svg?theme=dark' alt='fork'></img>
    <img src='https://img.shields.io/github/stars/tduckcloud/tduck-platform?style=social' alt='star'></img>
    <img src='https://img.shields.io/github/forks/tduckcloud/tduck-platform?style=social' alt='fork'></img>
    <br />
    <br />   
    <a href="https://www.tduckcloud.com/" target="_blank">官方网站</a>&nbsp;
    <a href="https://www.yuque.com/tduck/home"  target="_blank" >部署文档</a>&nbsp;
    <a href="https://pro.tduckcloud.com/s/QUiDSKq8" target="_blank">微信社区</a>&nbsp;
    <a href="https://space.bilibili.com/409825300" target="_blank">bilibili频道</a>
</p>

<br />
目前市面上的表单平台虽然功能强大，但是部分业务组件或者额外收取存储等费用，且费用较高，在数据隐私性较强且有特殊表单需求的场景下无法满足业务需求，国内的开源表单系统比较少，tduck表单应运而生。愿景能够让企业低成本拥有独立自定义表单问卷，快速赋能业务。

------------------------------

### 提示
💥表单设计模块暂未开源，项目通过npm引用，不影响使用、二开其他功能。
<br />
💥作者说：把<a href="https://github.com/TDuckCloud/tduck-platform" target="_blank"> <b>github托管的这个项目 点到1.5k star！</b> </a>💥就全部开源！
<br />
💥如果您想提前获得该源码 请贡献20个star（gitee/github都行），联系作者获取源码！

------------------------------


###  开源版
- 在线体验：<a href="http://www.tduckcloud.com" target="_blank">演示地址</a>
- 默认账号：test@tduckapp.com
- 默认密码：12345678



###  PRO版
- 在线体验：<a href="http://www.tduckcloud.com" target="_blank">演示地址</a>
- 账号：test
- 密码：12345678


##  快速启动

- 部署文档：<a href="https://www.yuque.com/tduck/home/vl7y79" target="_blank">点击查看部署文档</a>

#### 配置最小开发环境：

   * [MySQL5.7或以上](https://dev.mysql.com/downloads/mysql/)
   * [JDK1.8或以上](http://www.oracle.com/technetwork/java/javase/overview/index.html)
   * [Maven](https://maven.apache.org/download.cgi)
   * [Nodejs](https://nodejs.org/en/download/)

#### 创建一个tduck的数据库  **版本选择mysql5.7**  ，并执行项目目录下doc/tduck.sql文件

#### 启动后端服务

   打开命令行，输入以下命令

   ```bash
   mvn clean install -DskipTests
   cd tduck-platform/tduck-api
   mvn clean package -DskipTests
   java -Dfile.encoding=UTF-8 -jar target/tduck-api.jar
   ```

#### 启动管理后台前端

   打开命令行，输入以下命令

   ```bash
   npm install -g cnpm --registry=https://registry.npm.taobao.org
   cd tduck-front
   cnpm install
   cnpm run serve
   ```
   浏览器打开，输入网址`http://localhost:8888`, 进入页面。


### 项目源码

|   后端源码  |   前端源码  |
|--- | --- |
|  https://gitee.com/TDuckApp/tduck-platform   |  https://gitee.com/TDuckApp/tduck-front   |
|  https://github.com/TDuckCloud/tduck-platform   |  https://github.com/TDuckCloud/tduck-front   |



#### 项目源码

|   后端源码  |   前端源码  |
|--- | --- |
|  https://gitee.com/TDuckApp/tduck-platform   |  https://gitee.com/TDuckApp/tduck-front   |
|  https://github.com/TDuckCloud/tduck-platform   |  https://github.com/TDuckCloud/tduck-platform   |


#### Build Setup
``` bash
# 配置镜像加速
https://www.ydyno.com/archives/1219.html
或者镜像全家桶(常用的全部加速了)
npm i -g mirror-config-china --registry=https://registry.npm.taobao.org

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



### “新特性”

- 【表单逻辑】支持对单选，多选框，下拉框等组件进行逻辑设置，目前仅支持选中 未选中等逻辑关系
- 【表单分页】支持对问卷问题较多时，进行分页
- 【手写签名】支持手写签名保存上传
- 【位置选择】支持高德地图进行地理位置选择
- 【手机验证】支持对输入手机号进行短信验证 验证通过则能保存
- 【省市联动】支持省市县联动选择输入
- 【图形选择】图片选择组件，支持单选多选
- 【图片展示】图片展示组件，展示二维码引流等
- 【图片轮播】图片轮播组件，图片和文字轮播显示
- 【文字描述】文件描述组件，支持颜色，位置设置
- 【分割线】 内容分割线
- 【联系人】 手机号，邮箱，身份证输入 格式校验
- 【公开反馈结果】 公开反馈结果设置，开启后填写完成将看到他人填写结果
- 【附件导出】填写完成后可对收集的附件进行导出zip下载
- 【统计筛选】可对填写完的结果进行筛选查询 支持模糊等
- 【表单预览】添加预览按钮，实时预览内容，预览二维码
- 【另存为模板】添加另存为模板按钮，保存项目为模板
- 【UI重构】项目整体UI全面重构，更美观，更简洁
- 【验证码】验证逻辑重构，支持验证码开关
- 【微信功能】 微信功能增加开关配置，可配置关闭微信功能
- 【代码优化】对前后端代码进行部分优化，结构调整

### 特别鸣谢 :heart: 

感谢 (https://gitee.com/eoner/vue-automation) 前端脚手架
感谢 (https://gitee.com/mrhj/form-generator) 表单生成器

