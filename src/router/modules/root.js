export default [
    {
        path: '/',
        meta: {
            requireLogin: true
        },
        component: () => import(/* webpackChunkName: 'root' */ '@/layout/design-layout.vue')
    },
    {
        path: '/login',
        component: () => import(/* webpackChunkName: 'root' */ '@/views/design/login.vue')
    }
]
