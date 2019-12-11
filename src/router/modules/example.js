import ExampleLayout from '@/layout/example'

export default {
    path: '/example',
    redirect: '/example/sprite',
    component: ExampleLayout,
    children: [
        {
            path: 'sprite',
            component: () =>
                import(/* webpackChunkName: 'example' */ '@/views/example/sprite.vue')
        },
        {
            path: 'svgicon',
            component: () =>
                import(/* webpackChunkName: 'example' */ '@/views/example/svgicon.vue')
        },
        {
            path: 'globalComponent',
            component: () =>
                import(/* webpackChunkName: 'example' */ '@/views/example/global.component.vue')
        },
        {
            path: 'axios',
            component: () =>
                import(/* webpackChunkName: 'example' */ '@/views/example/axios.vue')
        },
        {
            path: 'cookie',
            component: () =>
                import(/* webpackChunkName: 'example' */ '@/views/example/cookie.vue')
        },
        {
            path: 'meta',
            component: () =>
                import(/* webpackChunkName: 'example' */ '@/views/example/meta.vue')
        },
        {
            path: 'vuex',
            component: () =>
                import(/* webpackChunkName: 'example' */ '@/views/example/vuex.vue')
        },
        {
            path: 'component',
            component: () =>
                import(/* webpackChunkName: 'example' */ '@/views/example/component.vue')
        },
        {
            path: 'params/:test',
            name: 'exampleParams', // 设置路由的name时，建议加上模块名，避免name和其他模块重名
            component: () =>
                import(/* webpackChunkName: 'example' */ '@/views/example/params.vue')
        },
        {
            path: 'query',
            component: () =>
                import(/* webpackChunkName: 'example' */ '@/views/example/query.vue')
        },
        {
            path: 'reload',
            component: () =>
                import(/* webpackChunkName: 'example' */ '@/views/example/reload.vue')
        },
        {
            path: 'permission/router',
            component: () =>
                import(/* webpackChunkName: 'example' */ '@/views/example/permission.router.vue'),
            meta: {
                requireLogin: true // 鉴权
            }
        },
        {
            path: 'permission/js',
            component: () =>
                import(/* webpackChunkName: 'example' */ '@/views/example/permission.js.vue')
        },
        {
            path: 'user',
            component: () =>
                import(/* webpackChunkName: 'example' */ '@/views/example/user.vue')
        }

    ]
}
