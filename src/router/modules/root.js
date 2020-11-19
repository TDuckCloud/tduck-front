export default [
    {
        path: '/',
        meta: {requireLogin: false},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/welcome.vue'),
        children: [
            {
                path: '/login',
                meta: {requireLogin: false},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/account/login.vue')
            },
            {
                path: '/enterprise',
                meta: {requireLogin: false},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/common/enterprise/index.vue')
            },
            {
                path: '/sources',
                meta: {requireLogin: false},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/common/sources/index.vue')
            },
            {
                path: '/proposal',
                meta: {requireLogin: false},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/common/proposal/index.vue')
            },
            {
                path: '/console',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/account/console/index.vue')
            }
        ]
    }, {
        path: '/home',
        meta: {requireLogin: true},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/home/index.vue'),
        children: [
            {
                path: '/',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/home/HomeView')
            }
        ]
    }, {
        path: '/project',
        meta: {requireLogin: true},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/home/index.vue'),
        children: [
            {
                path: 'create',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/project/create.vue')
            },
            {
                path: 'form',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/index.vue')
            }
        ]
    }, {
        path: '/form',
        meta: {requireLogin: true},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/home/index.vue'),
        children: [
            {
                path: 'create',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/project/create.vue')
            }
        ]
    }
]
