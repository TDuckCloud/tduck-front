export default [
    {
        path: '/',
        meta: {
            requireLogin: false
        },
        component: () => import(/* webpackChunkName: 'root' */ '@/views/Home.vue')
    },
    {
        path: '/login',
        component: () => import(/* webpackChunkName: 'root' */ '@/views/design/login.vue')
    }
]
