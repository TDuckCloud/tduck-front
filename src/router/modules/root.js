export default [
    {
        path: '/test',
        meta: {requireLogin: false},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/test')
    },
    {
        path: '/redirect/:type',
        meta: {requireLogin: false},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/redirect')
    },
    {
        path: '/account/validate',
        meta: {requireLogin: false},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/account/validate')
    },
    {
        path: '/',
        meta: {requireLogin: false},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/official/oldIndex.vue'),
        children: [
            {
                path: '',
                meta: {requireLogin: false},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/official/introduction.vue')
            },
            {
                path: 'login',
                meta: {requireLogin: false},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/account/login.vue')
            },
            {
                path: 'forget/password',
                meta: {requireLogin: false},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/account/ForgetPwd')
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
    },
    {
        path: '/home',
        meta: {requireLogin: true},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/home'),
        children: [
            {
                path: '/',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/project/my/index')
            },
            {
                path: 'member',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/account/member')
            }
        ]
    }

]
