<template>
    <el-container>
        <el-header
            v-if="style.header.isShow"
            :style="style.header"
            data-aos="fade-down"
        >
            <div class="header-page">
                <div
                    class="header-logo"
                    style="transform: translate(0px, 0px)"
                    data-aos="fade-right"
                    @click="$router.push({path:'/'})"
                >
                    <img
                        src="@/assets/images/official/TDUCK@2x.png"
                        alt="img"
                    >
                </div>
                <div class="header-menu" :class="{ 'header-menu-open': isMenuShow }">
                    <a @click="$router.push({path:'/'})">首页</a>
                    <a href="https://gitee.com/TDuckApp/tduck-platform" target="_blank">开源项目</a>
                    <a class="menu-item" href="https://doc.tduckapp.com/" target="_blank">开发文档</a>
                    <a @click="$router.push({path:'/payService'})">付费服务</a>
                    <a class="add-contact-me">
                        加入社群
                        <div>
                            <img src="@/assets/images/official/contact_me_qr.png">
                        </div>
                    </a>
                </div>

                <div class="header-btn">
                    <el-button v-if="isLogin" @click="$router.push({path:'/home'})">控 制 台</el-button>
                    <el-button v-if="!isLogin" @click="$router.push({path:'/login'})">登 录</el-button>
                    <div
                        class="header-mobile-menu"
                        :class="{ 'header-mobile-menu-open': isMenuShow }"
                        @click="onShowMenu"
                    >
                        <em /><em /><em />
                    </div>
                </div>
            </div>
        </el-header>
        <el-main :style="style.content">
            <div id="back-box" class="back-box" />
            <div id="content-page" class="content-page">
                <div class="content-explain">
                    <h1 data-aos="fade-up" data-aos-duration="1000">让企业轻松拥有问卷系统</h1>
                    <h1 data-aos="fade-up" data-aos-duration="1100">TDuck - Have what you want, get you income.</h1>
                    <div data-aos="fade-up" data-aos-duration="1200">
                        <el-button class="banner-button-start" @click="onStart">开始使用</el-button>
                        <el-button class="banner-button-preview" @click="$router.push({path:'/home'})">在线预览</el-button>
                    </div>
                </div>
                <div id="image" data-aos="fade-up" class="image">
                    <img :src="require('@/assets/images/official/banner02.svg')">
                </div>
            </div>
            <div class="content-wrapper">
                <div class="en-title" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="1000">OUR STRENGTHS</div>
                <el-row :gutter="2" class="content-wrapper-features">
                    <el-col :xs="24" :md="8" data-aos="fade-right">
                        <p class="title">无保留，全开源</p>
                        <p>遵循《阿里巴巴Java开发手册》编码规范，代码全量开源</p>
                    </el-col>
                    <el-col :xs="24" :md="8" data-aos="fade-up">
                        <p class="title">简洁，不失强大</p>
                        <p>基于 Element + VUE 前端框架，界面简洁，独特美感</p>
                    </el-col>
                    <el-col :xs="24" :md="8" data-aos="fade-left">
                        <p class="title">所见，即所得</p>
                        <p>无需编程，拖拽可视化模板或组件，即可生成精美问卷</p>
                    </el-col>
                </el-row>
                <div data-aos="zoom-in" data-aos-duration="1000" class="content-wrapper-image">
                    <img src="@/assets/images/official/desc1.png">
                </div>
                <div class="content-wrapper-solutions">
                    <p class="title">我们的解决方案</p>
                    <el-row>
                        <el-col :xs="24" :md="8">
                            <div class="solution-item" data-aos="zoom-out-up" data-aos-duration="1000">
                                <p class="title">客户体验</p>
                                <img src="@/assets/images/official/solution1.png">
                                <p class="desc">客户满意度 宾馆服务满意度</p>
                                <p class="desc">餐厅满意度调查 公共服务满意度</p>
                                <p class="desc">旅游服务满意度 经销商满意度</p>
                                <p @click="$router.push({ path: '/home' })">前往体验 ></p>
                            </div>
                        </el-col>
                        <el-col :xs="24" :md="8" data-aos="zoom-out-up">
                            <div class="solution-item" data-aos-duration="1000">
                                <p class="title">市场调研</p>
                                <img src="@/assets/images/official/solution2.png">
                                <p class="desc">餐饮市场调查 手机市场调查</p>
                                <p class="desc">培训市场调查 消费者调查</p>
                                <p class="desc">APP市场调查 女性消费者偏好调查</p>
                                <p @click="$router.push({ path: '/home' })">前往体验 ></p>
                            </div>
                        </el-col>
                        <el-col :xs="24" :md="8" data-aos="zoom-out-up">
                            <div class="solution-item" data-aos-duration="1000">
                                <p class="title">报名登记</p>
                                <img src="@/assets/images/official/solution3.png">
                                <p class="desc">才艺比赛报名 粉丝活动报名</p>
                                <p class="desc">聚餐出游报名 活动/会务微信报名</p>
                                <p class="desc">讲座公开课报名 商品订单</p>
                                <p @click="$router.push({ path: '/home' })">前往体验 ></p>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="content-wrapper-company">
                    <p class="title">他们都在使用</p>
                    <img data-aos="zoom-in" src="@/assets/images/official/use-commony.png">
                </div>
            </div>
        </el-main>
        <el-footer :style="style.footer">
            <div class="footer-page">
                <el-row :gutter="20" class="footer-content">
                    <el-col :xs="24" :md="6" data-aos="fade-up" data-aos-delay="100">
                        <h1>关于我们</h1>
                        <p>
                            TDuck — 是一款能够帮助
                            你进行信息收集、市场开拓、
                            客户挖掘并展开持续营销活 动的管理平台。
                        </p>
                    </el-col>
                    <el-col :xs="24" :md="4" :offset="1" class="project-url" data-aos="fade-up" data-aos-delay="200">
                        <h1>项目地址</h1>
                        <a href="https://gitee.com/TDuckApp/tduck-platform" target="_blank">Gitee码云</a>
                        <a href="https://github.com/TDuckCloud/tduck-platform" target="_blank">Github</a>
                    </el-col>
                    <el-col :xs="24" :md="5" data-aos="fade-up" data-aos-delay="300">
                        <h1>联系方式</h1>
                        <span>pr@tduckapp.com</span>
                        <span>+86 15080929435</span>
                        <span> 加入团队 mama@tduckapp.com</span>
                    </el-col>
                    <el-col :xs="24" :md="4" data-aos="fade-up" data-aos-delay="400">
                        <h1>友情地址</h1>
                        <a href="https://element.eleme.cn/#/zh-CN/" target="_blank">ElementUI</a>
                        <a href="https://gitee.com/mrhj/form-generator" target="_blank"> form-generator</a>
                    </el-col>
                    <el-col :xs="24" :md="4" data-aos="fade-up" data-aos-delay="500">
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
                    </el-col>
                </el-row>
                <div class="footer-copyright" data-aos="fade-down" data-aos-anchor-placement="top-bottom">
                    <p>本站由 ucloud 提供云服务器</p>
                    <p>本站由 又拍云 提供CDN加速/云储存服务</p>
                    <p>Copyright © 2021 TDuckApp. All Rights Reserved. 湘ICP备18023961号-2 版权所有</p>
                </div>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
import store from '@/store'

export default {
    name: 'AppIndex',
    data() {
        return {
            // 是否展开菜单  只在屏幕宽度小于767时有效
            isMenuShow: false,
            // 滚动条到顶部的距离
            scrollTop: 0,
            // 屏幕宽度
            screenWidth: document.body.clientWidth,
            style: {
                header: {
                    isShow: true,
                    isFixed: false,
                    // background: "linear-gradient(-67deg, #2054f1, #33c9fd, #2356f4)",
                    height: 'unset',
                    lineHeight: '64px',
                    background: 'rgba(255,255,255,0)',
                    position: 'absolute',
                    width: '100%',
                    top: 0,
                    zIndex: 100,
                    padding: 0
                    // overflow: "hidden",
                    // transition:'height 0.5s'
                },
                content: {
                    overflow: 'hidden',
                    position: 'relative'
                },
                footer: {
                    height: 'auto',
                    background:
                        'linear-gradient( 163deg, rgba(32, 84, 241, 0.67), rgba(34, 78, 243, 0.67), rgba(56, 234, 255, 0.67))',
                    marginTop: '100px'
                }
            }
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
    watch: {
        /* 监听屏幕宽度变化 */
        screenWidth(val) {
            this.screenWidth = val
            if (val > 751) {
                this.isMenuShow = false
            }
            console.log('this.screenWidth', this.screenWidth)
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll, true)
        const that = this
        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientWidth
                that.screenWidth = window.screenWidth
            })()
        }
        this.msgCard()
    },
    methods: {
        // 屏幕滚动方法
        handleScroll() {
            // 滚动时收起菜单栏
            this.isMenuShow = false
            this.scrollTop =
                document.documentElement.scrollTop || document.body.scrollTop
            // 屏幕滚动大于64  设置背景色
            if (this.scrollTop > 64) {
                this.style.header.background =
                    'linear-gradient(-67deg, #2054f1, #33c9fd, #2356f4)'
                this.style.header.position = 'fixed'
                // 动画
                if (!this.style.header.isFixed) {
                    this.style.header.isShow = false
                    setTimeout(() => {
                        this.style.header.isShow = true
                    }, 10)
                }
                this.style.header.isFixed = true
                // this.style.header.height = '0'
                // this.transition ='height 0.5s'
                // this.style.header.header = '64px'
            } else {
                this.style.header.isFixed = false

                this.style.header.background = 'rgba(255,255,255,0)'
                // 小于64   判断当前菜单栏是否处于展开状态
                // if (this.isMenuShow) {
                //   this.style.header.background =
                //     "linear-gradient(-67deg, #2054f1, #33c9fd, #2356f4)";
                // } else {
                //   this.style.header.background = "rgba(255,255,255,0)";
                // }
                this.style.header.position = 'absolute'
            }
        },
        // 屏幕变窄时展开和关闭menu的方法
        onShowMenu() {
            this.isMenuShow = !this.isMenuShow
            if (this.isMenuShow) {
                // 如果展开  设置背景
                this.style.header.background =
                    'linear-gradient(-67deg, #2054f1, #33c9fd, #2356f4)'
            } else {
                // 如果是关闭 则在动画完成之后根据当前是否在顶部修改背景   当前屏幕滚动小于64px：设置透明  否则  显示背景
                setTimeout(() => {
                    if (this.scrollTop > 64) {
                        this.style.header.background =
                            'linear-gradient(-67deg, #2054f1, #33c9fd, #2356f4)'
                    } else {
                        this.style.header.background = 'rgba(255,255,255,0)'
                    }
                }, 300)
            }
        },
        onStart() {
            // window.location.href = 'https://gitee.com/TDuckApp/tduck-platform'
            window.open('https://gitee.com/TDuckApp/tduck-platform', '_blank')
        },
        msgCard() {
            // <a href="https://gitee.com/TDuckApp/tduck-platform" target="_blank">3798</a>
            this.$notify({
                title: '关注下 Star 数',
                duration: 0,
                position: 'bottom-left',
                customClass: 'notify-success',
                dangerouslyUseHTMLString: true,
                message: '<div style="line-height: 30px">我们需要您的支持，请点击按钮帮助我们增加 gitee star。<span class="github-btn"><a href="https://gitee.com/TDuckApp/tduck-platform" target="_blank">Start</a></span></div>'
            })
        }
    }
}
</script>

<style lang="scss" scoped>

.header-page {
  max-width: 1280px;
  // box-shadow: rgb(0 0 0 / 5%) 0px 4px 6px;
  margin: auto;
  display: flex;
  padding: 0 24px;
  justify-content: space-between;
  flex-wrap: wrap;

  .header-logo {
    display: inline-block;
    position: relative;
    width: 150px;
    min-width: 150px;
    line-height: 64px;

    img {
      width: 100%;
      vertical-align: middle;
      display: inline-block;
    }
  }

  .header-btn {
    position: relative;
    text-align: right;

    button {
      font-size: 12px;
      font-weight: 400;
      background-color: #fff;
      color: #2667f5;
      height: 30px;
      line-height: 30px;
      padding: 0 15px;
      border: none;
      border-radius: 4px;
    }

    .header-mobile-menu-open {
      em:nth-child(1) {
        transform: translateY(6px) rotate(45deg);
      }

      em:nth-child(2) {
        opacity: 0;
      }

      em:nth-child(3) {
        transform: translateY(-6px) rotate(-45deg);
      }
    }
  }

  .header-menu {
    a {
      font-weight: 400;
      color: #fff;
      padding: 0 20px;
    }

    a:first-child {
      padding-left: 0;
    }

    a:last-child {
      padding-right: 0;
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

    :hover {
      div {
        visibility: visible;
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  .header-menu-open {
    height: calc(48px * 5);
  }
}

.back-box {
  color: #fff;
  position: absolute;
  top: -100vh;
  left: -100px;
  width: 150vw;
  // height: 50vw;
  height: 150vh;
  border-radius: 0 280px;
  transform: rotate(-22deg);
  background: linear-gradient(60deg,#1E53F4,#1E53F4,#30cffd,#30cffd,#30cffd);
}

.content-page {
  height: calc(100vh - 64px);
  color: #fff;
  // mix-blend-mode: difference;
  margin-top: 64px;
  max-width: 1280px;
  margin: auto;
  padding: 24px;
  display: flex;
  // align-items:center;
  // text-align: center;
  position: relative;

  .content-explain {
    z-index: 1;
    position: absolute;
    top: 20%;
    padding: 0 40px;
    // min-width: 650px;

    h1:first-child {
      font-size: 50px;
    }

    > div {
      width: 100% !important;
      margin-top: 40px;
      text-align: center;

      .banner-button {
        &-start {
          min-width: 140px;
          color: #2667f5;
          // background-image: linear-gradient(to right bottom, #82b5ff 0%, #3c89f6 0%);
          box-shadow: 0 8px 24px fade(#ffffff, 35);
          border-radius: 20px;
          border: none;
          padding: 0 42px;
          line-height: 40px;
          height: 40px;
          transition: transform .3s, box-shadow .3s;

          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 13px 24px fade(#ffffff, 45);
            // background-image: linear-gradient(to right bottom, #82b5ff 0%, #3c89f6 0%);
          }
        }

        &-preview {
          box-shadow: 0 8px 24px fade(#ffffff, 35);
          border-radius: 20px;
          padding: 0 42px;
          border: 1px solid #fff;
          color: #fff;
          line-height: 40px;
          height: 40px;
          background-color: rgba($color: #000000, $alpha: 0);
          transition: transform .3s, box-shadow .3s;

          &:hover {
            color: #2667f5;
            background-color: #FFF;
            transform: translateY(-5px);
            transition: all 0.4s ease 0s;
            box-shadow: 0 13px 24px fade(#ffffff, 45);
            // background-image: linear-gradient(to right bottom, #82b5ff 0%, #3c89f6 0%);
          }
        }
      }
    }
  }

  .image {
    position: absolute;
    top: 20%;
    right: 0;
    width: 50%;

    img {
      width: 100%;
    }
  }
}

.content-wrapper {
  .title {
    text-align: center;
    font-size: 23px;
    font-weight: bold;
    color: #232323;
    line-height: 76px;
  }

  max-width: 1280px;
  margin: auto;
  margin-top: 200px;
  text-align: center;

  .en-title {
    width: 100%;
    white-space: nowrap;
    margin: auto;
    margin: 100px 0;
    background: linear-gradient(
        -32deg,
        rgba(32, 84, 241, 0.51) 0%,
        rgba(34, 78, 243, 0.51) 0%,
        rgba(56, 234, 255, 0.51) 100%
    );
    line-height: 7vw;
    font-size: 6vw;
    font-weight: bold;
    letter-spacing: 10%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &-features {
    > div {
      p:first-child {
        font-size: 25px;
        font-weight: bold;
        color: #222;
        line-height: 68px;
      }

      p:last-child {
        font-size: 10px;
        font-weight: 300;
        color: #222;
        line-height: 22px;
      }
    }
  }

  &-image {
    width: 100%;

    img {
      width: 100%;
    }
  }

  &-solutions {
    p {
      text-align: center;
      font-size: 23px;
      font-weight: bold;
      color: #232323;
      line-height: 76px;
    }

    .solution-item {
      margin: auto;
      width: 250px;
      height: 390px;
      background: linear-gradient(
          -12deg,
          rgba(32, 84, 241, 0.08),
          rgba(34, 78, 243, 0.08),
          rgba(56, 234, 255, 0.08)
      );
      border-radius: 15px;
      text-align: center;
      cursor: pointer;
      transition: transform .3s, box-shadow .3s;

      &:hover {
        transform: translateY(-5px);
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

  &-company {
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    justify-content: flex-start;
    margin-top: 200px;

    img {
      width: 80%;
    }
  }
}

.footer-page {
  max-width: 1280px;
  margin: auto;

  .footer-content {
    padding: 64px 24px 32px 24px;
    color: #FFF;

    h1 {
      font-size: 20px;
      margin-bottom: 24px;
    }

    a, span, p {
      display: block;
      margin-bottom: 12px;
      font-size: 12px;
      font-weight: 400;
    }

    .qrcode {
      width: 100%;
      display: flex;
      align-content: center;

      div {
        margin: 10px;
      }

      img {
        width: 50%;
        margin-top: 30px;
        min-width: 115px;
        min-height: 114px;
      }
    }
  }

  .footer-copyright {
    padding-bottom: 12px;
    text-align: center;
    color: #FFF;
    font-weight: 300;

    p {
      margin-top: 0;
      margin-bottom: 8px;
    }
  }
}

// @media screen and (max-width: 576px) {
@media screen and (max-width: 600px) {
  #back-box {
    min-width: 450px;
    min-height: 450px;
    position: absolute;
    top: -3%;
    left: -50%;
    right: -50%;
    width: 200vw;
    // height: 50vw;
    height: 200vw;
    border-radius: 50%;
    transform: rotate(-22deg);
    background: linear-gradient(-67deg, #30cffd, #1e53f4);
  }
  #content-page {
    padding: 24px 0;

    h1:first-child {
      font-size: 30px;
    }

    h1:last-child {
      font-size: 24px;
    }

    #image {
      top: 53% !important;
      right: 0 !important;
      width: 100% !important;
    }
  }
}

@media screen and (max-width: 767px) {
  .el-header {
    overflow: hidden;
  }
  .header-menu {
    transition: all 0.3s;
    width: 100%;
    height: 0;
    order: 5;

    a {
      padding: 0 20px !important;
      display: block;
      height: 48px;
      line-height: 48px;
    }
  }
  .header-btn {
    button {
      margin-right: 48px;
    }

    .header-mobile-menu {
      width: 16px;
      height: 14px;
      position: absolute;
      top: 27px;
      right: 0;
      cursor: pointer;
      float: right;
      z-index: 100;

      em {
        display: block;
        width: 100%;
        height: 2px;
        background: #fff;
        margin-top: 4px;
        transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), opacity;
      }

      :first-child {
        margin-top: 0;
      }
    }
  }
  #content-page {
    text-align: center;

    > div:first-child {
      width: 100%;
      position: unset !important;
      margin-top: 50px;

      padding: 0;
      // top: 10% !important;
    }

    #image {
      top: 40%;
      right: 10%;
      width: 80%;
    }
  }
  .content-wrapper-company {
    margin-top: 80px !important;
    img {
      width: 100% !important;
    }
  }
  .footer-page {
    text-align: center;

    .project-url {
      margin-left: 0;
    }
  }
}

@media screen and (min-width: 950px) {
  .header-btn {
    width: 150px;
  }
}

@media screen and (max-width: 1000px) {
  #content-page {
    div:last-child {
      top: 40%;
      right: 25%;
      width: 60%;
    }
  }
}
</style>
<style lang="scss">
.github-btn {
  a {
    font-weight: bold;
    color: #303133;
    padding: 4px 12px;
    border: solid 1px #DCDFE6;
    margin-left: 8px;
    position: relative;
    border-radius: 4px;
  }

  a:hover {
    color: #2C67E3;
  }

  a:last-child:before {
    position: absolute;
    display: inline-block;
    border-width: 7px;
    border-style: solid;
    border-color: transparent rgba(255, 255, 255, 0.4) transparent transparent;
    left: -15px;
    top: 25%;
    content: '';
  }

  /* 小角的背景填充*/
  a:last-child:after {
    position: absolute;
    display: inline-block;
    border-width: 6px; /*与before的三角形重叠差1px，和元素边框是边框宽度一致*/
    border-style: solid;
    border-color: transparent #eee transparent transparent; /*边框颜色（小角的填充色）要与整体元素背景一致*/
    left: -12px;
    top: 25%;
    content: '';
  }
}
</style>
