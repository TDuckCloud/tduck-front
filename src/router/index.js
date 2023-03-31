import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style

Vue.use(Router)

/**
 * 因为路由有优先级的概念，先定义的会先匹配，而自动注册是依据文件名的排序来遍历的
 * 所以下面这种情况，如果访问 /news/edit ，会指向到 info.vue 页面上
 * a.js   /news/:id   info.vue
 * b.js   /news/edit   edit.vue
 * 为避免这种情况发生，同一模块下的路由必须放在一个路由配置文件里
 * 按上面的例子，news 模块的路由，应该放到一个类似于 news.js 的文件里
 * 至于模块里的路由优先级，可以把 /news/edit 放在 /news/:id 前面，或者把 /news/:id 改成 /news/info/:id 均可
 */
const routes = []
const require_module = require.context('./modules', false, /.js$/)
require_module.keys().forEach((file_name) => {
  routes.push(require_module(file_name).default)
})

routes.push({
  path: '*',
  component: () => import('@/views/404'),
  meta: {
    title: '找不到页面'
  }
})

const router = new Router({
  mode: 'history',
  routes: routes.flat()
})

// 解决路由在 push/replace 了相同地址报错的问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
const originalReplace = Router.prototype.replace
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err)
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.meta.requireLogin) {
    if (store.getters['user/isLogin']) {
      next()
      NProgress.done()
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
      NProgress.done()
    }
  } else {
    next()
    NProgress.done()
  }
})

export default router
