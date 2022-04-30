
## _TDUCK_  填鸭表单收集器  
Tduck 填鸭：是基于B/S架构的一款开源的表单在线收集系统，为企业构建自己的信息反馈系统的综合解决方案，助力企业提高反馈收集客户服务效率。



###  :star:  提示
表单设计器模块暂时没有开源，项目通过Npm方式引用，不影响正常使用以及二开其他功能，后续根据情况开源，如果你想获得该部分源码，可以与我们一起开发，提交5个Pr，我们将与你分享该源码。或拉取v2分支的表单源码进行二开使用！


###  :fire:   开源版演示地址
- 演示地址：https://www.tduckcloud.com
- 演示账号/密码：扫码登录即可
- 部署默认账号： test@tduckapp.com/12345678
![输入图片说明](https://oss.tduckcloud.com/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20220224113836.png)



###  :fire:   PRO版演示地址
- 演示地址：https://www.tduckcloud.com
- 演示账号/密码：test/12345678
![输入图片说明](https://s1.ax1x.com/2022/04/08/LptAVP.png)
![输入图片说明](https://s1.ax1x.com/2022/04/08/LptV58.png)
![输入图片说明](https://s1.ax1x.com/2022/04/08/Lpt6PO.png)
![输入图片说明](https://s1.ax1x.com/2022/04/08/LptUxJ.png)


###  :star: 功能特性
##### 界面美观，全新element-ui支持，使用流畅
- 以一种全新的设计体验，告别繁琐的设计流程
- 通过简单有趣的方式，轻轻松松完成表单设计
- 支持表单样式模板选择，只为显现更精美的表单

##### 三大模块助力企业能力升级：
- 新建表单：自定义可拖拽式表单设计
- 表单设置：支持多种收集方式设置
- 反馈统计：多维度统计收集的反馈数据



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


### 加入社群
  <img alt="logo" src="https://images.gitee.com/uploads/images/2021/0706/174654_31b12d64_1674451.png" style="margin-bottom: 0px;" width="80px">



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

