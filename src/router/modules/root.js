export default [
    {
        path: '/test',
        meta: {requireLogin: false},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/test')
    },
    {
        path: '/',
        meta: {requireLogin: false},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/official/index.vue'),
        children: [
            {
                path: '/',
                meta: {requireLogin: false},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/official/introduction.vue')
            },
            {
                path: '/login',
                meta: {requireLogin: false},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/account/login.vue')
            },
            {
                path: '/enterprise',
                meta: {requireLogin: false},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/official/enterprise')
            },
            {
                path: '/sources',
                meta: {requireLogin: false},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/official/sources')
            },
            {
                path: '/proposal',
                meta: {requireLogin: false},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/official/proposal')
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
        path: '/project/preview',
        meta: {requireLogin: false},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/form/PreView.vue')
    }, {
        path: '/project/view',
        meta: {requireLogin: false},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/form/ProjectForm.vue')
    }
]
