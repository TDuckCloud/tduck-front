<template>
    <div class="official-container">
        <div class="header-container">
            <div class="background">
                <img src="@/assets/images/official/background.svg">
            </div>
            <div id="headerNav" :class="{'is-fixed' : isFixed}" class="top-header">
                <img class="logo" src="@/assets/images/official/TDUCK@2x.png" @click="$router.push({path:'/'})">
                <div>
                    <span class="menu-item" @click="$router.push({path:'/'})">首页</span>
                    <a class="menu-item" href="https://gitee.com/TDuckApp/tduck-platform" target="_blank">开源项目</a>
                    <a class="menu-item" href="https://doc.tduckapp.com/" target="_blank">开发文档</a>
                    <span class="menu-item" @click="$router.push({path:'/payService'})">付费服务</span>
                    <span class="menu-item add-contact-me">加入社群
                        <div>
                            <img src="@/assets/images/official/contact_me_qr.png">
                        </div>
                    </span>
                </div>
                <div>
                    <el-button v-if="isLogin" @click="$router.push({path:'/home'})">控 制 台</el-button>
                    <el-button v-if="!isLogin" @click="$router.push({path:'/login'})">
                        登 录
                    </el-button>
                </div>
            </div>
            <div class="content-header">
                <div class="left">
                    <p class="slogan animate__animated animate__fadeInLeftBig">
                        让企业轻松拥有问卷系统
                    </p>
                    <p class="slogan-desc animate__animated animate__fadeInLeftBig">
                        TDuck - Have what you want,
                        get you income.
                    </p>
                    <el-button @click="$router.push({path:'/home'})">立即体验</el-button>
                </div>
                <div class="right">
                    <img
                        class="image"
                        :src="require('@/assets/images/official/banner02.svg')"
                        fit="scale-down"
                    >
                </div>
            </div>
        </div>
        <div class="introduction">
            <p class="en-title">OUR STRENGTHS</p>
            <div class="features">
                <div>
                    <p> 无保留，全开源</p>
                    <p> 遵循《阿里巴巴Java开发手册》编码规范，代码全量开源</p>
                </div>
                <div>
                    <p> 简洁，不失强大</p>
                    <p> 基于 Element + VUE 前端框架，界面简洁，独特美感</p>
                </div>
                <div>
                    <p> 所见，即所得</p>
                    <p> 无需编程，拖拽可视化模板或组件，即可生成精美问卷</p>
                </div>
            </div>
            <img class="img1" src="@/assets/images/official/desc1.png">
        </div>
        <p class="title">我们的解决方案</p>
        <div class="solutions">
            <div class="solution-item">
                <p class="title">客户体验</p>
                <img src="@/assets/images/official/solution1.png">
                <p class="desc">客户满意度 宾馆服务满意度 </p>
                <p class="desc"> 餐厅满意度调查 公共服务满意度</p>
                <p class="desc">旅游服务满意度 经销商满意度 </p>
                <p @click="$router.push({path:'/home'})">前往体验 ></p>
            </div>
            <div class="solution-item">
                <p class="title">市场调研</p>
                <img src="@/assets/images/official/solution2.png">
                <p class="desc">餐饮市场调查 手机市场调查 </p>
                <p class="desc"> 培训市场调查 消费者调查 </p>
                <p class="desc">APP市场调查 女性消费者偏好调查 </p>
                <p @click="$router.push({path:'/home'})">前往体验 ></p>
            </div>
            <div class="solution-item">
                <p class="title">报名登记</p>
                <img src="@/assets/images/official/solution3.png">
                <p class="desc">才艺比赛报名 粉丝活动报名 </p>
                <p class="desc"> 聚餐出游报名 活动/会务微信报名 </p>
                <p class="desc"> 讲座公开课报名 商品订单 </p>
                <p @click="$router.push({path:'/home'})">前往体验 ></p>
            </div>
        </div>
        <div class="use-company">
            <p class="title">他们都在使用</p>
            <img src="@/assets/images/official/use-commony.png">
        </div>
        <div class="footer">
            <div class="top">
                <div>
                    <p class="title">关于我们</p>
                    <p class="desc">
                        TDuck — 是一款能够帮助
                        你进行信息收集、市场开拓、
                        客户挖掘并展开持续营销活 动的管理平台。
                    </p>
                </div>
                <div>
                    <p class="title">项目地址</p>
                    <a href="https://gitee.com/TDuckApp/tduck-platform" target="_blank">Gitee码云</a>
                    <a href="https://github.com/TDuckCloud/tduck-platform" target="_blank">Github</a>
                </div>
                <div>
                    <p class="title">联系方式</p>
                    <p class="desc">pr@tduckapp.com</p>
                    <p class="desc">+86 15080929435</p>
                    <p class="desc"> 加入团队 mama@tduckapp.com</p>
                </div>
                <div>
                    <p class="title">友情地址</p>
                    <a href="https://element.eleme.cn/#/zh-CN/" target="_blank">ElementUI</a>
                    <a href="https://gitee.com/mrhj/form-generator" target="_blank"> form-generator</a>
                </div>
                <div class="qrcode">
                    <div>
                        <img src="@/assets/images/official/wxmpqrcode.png">
                        <p class="desc">填鸭-公众号</p>
                    </div>
                    <div>
                        <img src="@/assets/images/official/contact_me_qr.png">
                        <p class="desc">官方社群</p>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <p>本站由 ucloud 提供云服务器</p>
                <p>本站由 又拍云 提供CDN加速/云储存服务</p>
                <p>Copyright © 2021 TDuckApp. All Rights Reserved. 湘ICP备18023961号-2 版权所有</p>
            </div>
        </div>
    </div>
</template>

<script>
import store from '@/store'

export default {
    name: 'Official',
    data() {
        return {
            isFixed: false,
            offsetTop: 0
        }
    },
    computed: {
        getStore() {
            return store
        },
        isLogin() {
            return this.getStore.getters['user/isLogin']
        }
    },
    mounted() {
        window.addEventListener('scroll', this.initHeight)
        let that = this
        this.$nextTick(() => {
            // 获取对象相对于版面或由 offsetTop 属性指定的父坐标的计算顶端位置
            that.offsetTop = document.querySelector('#headerNav').offsetTop
        })
    },
    // 回调中移除监听
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
        initHeight() {
            // 设置或获取位于对象最顶端和窗口中可见内容的最顶端之间的距离 (被卷曲的高度)
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            // 如果被卷曲的高度大于吸顶元素到顶端位置 的距离
            this.isFixed = scrollTop > this.offsetTop
        }
    }
}
</script>

<style lang="scss" scoped>
html,
body {
  height: 100%;
}
.official-container {
  min-width: 1280px;
  height: 100%;
  //overflow-x: hidden;
}
.header-container {
  position: relative;
  .background {
    position: absolute;
    z-index: 1;
    img {
      width: 100%;
    }
  }
  .top-header {
    width: 100%;
    height: 72px;
    line-height: 72px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-content: center;
    align-items: center;
    * {
      z-index: 20;
    }
    .logo {
      width: 182px;
      height: 28px;
    }
    .menu-item {
      font-size: 17px;
      font-weight: 300;
      cursor: pointer;
      color: #fff;
      margin-right: 73px;
      line-height: 72px;
    }
    .add-contact-me {
      position: relative;
      div {
        margin-top: 20px;
        position: absolute;
        right: 0%;
        top: 100%;
        visibility: hidden;
        opacity: 0;
        transform: translateY(100px);
        transition: 0.3s;
      }
      img {
        width: 100px;
        height: 100px;
      }
    }
    .add-contact-me:hover {
      div {
        visibility: visible;
        opacity: 1;
        transform: translateY(0);
      }
    }
    .login-btn {
      width: 95px;
      height: 37px;
      background: #fff;
      border-radius: 11px;
    }
  }
  .content-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    align-items: center;
    * {
      z-index: 20;
    }
    .slogan {
      font-size: 59px;
      font-weight: bold;
      color: #fff;
      line-height: 18px;
    }
    .slogan-desc {
      font-size: 37px;
      font-weight: bold;
      color: #fff;
      line-height: 43px;
    }
    .right{
      position: relative;
      height: 700px;
      width: 700px;
      .image {
        padding-top: 30px;
        height: 840px;
        width: 700px;
      }
    }
  }
}
.title {
  text-align: center;
  font-size: 23px;
  font-weight: bold;
  color: #232323;
  line-height: 76px;
}
.introduction {
  margin-top: 217px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .en-title {
    font-size: 101px;
    font-weight: bold;
    color: #fff;
    line-height: 97px;
    letter-spacing: 15px;
    background: linear-gradient(-32deg, rgba(32, 84, 241, 0.51) 0%, rgba(34, 78, 243, 0.51) 0%, rgba(56, 234, 255, 0.51) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: show 0.5s forwards;
  }
  .features {
    display: flex;
    div {
      margin: 0 20px;
      text-align: center;
    }
    :first-child {
      font-size: 25px;
      font-weight: bold;
      color: #222;
      line-height: 68px;
    }
    :last-child {
      font-size: 10px;
      font-weight: 300;
      color: #222;
      line-height: 22px;
    }
  }
  .img1 {
    min-width: 515px;
    height: 438px;
  }
}
.solutions {
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-evenly;
  .solution-item {
    width: 250px;
    height: 390px;
    background: linear-gradient(-12deg, rgba(32, 84, 241, 0.08), rgba(34, 78, 243, 0.08), rgba(56, 234, 255, 0.08));
    border-radius: 15px;
    text-align: center;
    cursor: pointer;
    &:hover {
      box-shadow: 0 2px 49px 0 rgba(105, 119, 168, 0.54);
    }
    img {
      width: 197px;
      height: 147px;
    }
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #276ef6;
      line-height: 69px;
    }
    .desc {
      font-size: 9px;
      font-weight: 300;
      color: #222;
      line-height: 15px;
    }
    :last-child {
      font-size: 10px;
      font-weight: 300;
      color: #276ef6;
      line-height: 69px;
    }
  }
}
.use-company {
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: flex-start;
  margin-top: 200px;

}
.footer {
  margin-top: 227px;
  width: 100%;
  height: 464px;
  background: linear-gradient(163deg, rgba(32, 84, 241, 0.67), rgba(34, 78, 243, 0.67), rgba(56, 234, 255, 0.67));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .top {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    text-align: left;
    .title {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      line-height: 60px;
      text-align: left;
    }
    .desc {
      font-size: 12px;
      font-weight: 300;
      color: #fff;
      line-height: 20px;
      max-width: 292px;
    }
    a {
      font-size: 12px;
      font-weight: 300;
      color: #fff;
      cursor: pointer;
      line-height: 30px;
      display: block;
    }
    .qrcode {
      display: flex;
      div {
        margin: 10px;
      }
      img {
        margin-top: 30px;
        width: 115px;
        height: 114px;
      }
    }
  }
  .bottom {
    position: relative;
    bottom: 0;
    p {
      text-align: center;
      font-size: 16px;
      font-weight: 300;
      color: #fff;
      line-height: 20px;
    }
  }
}
.top-header {
  animation: stickyMenu1 0.4s ease-in-out;
}
.is-fixed {
  position: fixed;
  z-index: 999;
  animation: stickyMenu 0.5s ease-in-out;
  top: 0;
  background: linear-gradient(-67deg, rgba(32, 84, 241, 1), rgba(51, 201, 253, 1), rgba(35, 86, 244, 1));
}
@keyframes stickyMenu1 {
  0% {
    opacity: 0;
    background: rgba(32, 84, 241, 1);
  }
  50% {
    opacity: 0.5;
    background: rgba(32, 84, 241, 1);
  }
  100% {
    background-color: transparent;
    opacity: 1;
  }
}
@keyframes stickyMenu {
  0% {
    margin-top: -120px;
    opacity: 0;
  }
  50% {
    margin-top: -64px;
    opacity: 0;
  }
  100% {
    margin-top: 0;
    opacity: 1;
  }
}
@media only screen and (max-width: 1580px) {
  .content-header {
    .slogan-desc {
      font-size: 25px !important;
    }
  }
}
@media only screen and (max-width: 1280px) {
  .content-header {
    .slogan {
      font-size: 39px !important;
    }
    .slogan-desc {
      font-size: 20px !important;
    }
  }
}
::v-deep .el-button {
  border: none;
}
::v-deep .el-button span {
  font-weight: 400;
  color: #2667f5;
}
</style>
