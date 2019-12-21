export default [
    {
        path: '/',
        meta: { requireLogin: false },
        component: () => import(/* webpackChunkName: 'root' */ '@/views/Home.vue'),
        children: [
            {
                path: '/login',
                meta: { requireLogin: false },
                component: () => import(/* webpackChunkName: 'root' */ '@/views/account/login.vue')
            },
            {
                path: '/enterprise',
                meta: { requireLogin: false },
                component: () => import(/* webpackChunkName: 'root' */ '@/views/common/enterprise/index.vue')
            },
            {
                path: '/sources',
                meta: { requireLogin: false },
                component: () => import(/* webpackChunkName: 'root' */ '@/views/common/sources/index.vue')
            },
            {
                path: '/proposal',
                meta: { requireLogin: false },
                component: () => import(/* webpackChunkName: 'root' */ '@/views/common/proposal/index.vue')
            },
            {
                path: '/console',
                meta: { requireLogin: true },
                component: () => import(/* webpackChunkName: 'root' */ '@/views/account/console/index.vue')
            }
        ]
    }
]
