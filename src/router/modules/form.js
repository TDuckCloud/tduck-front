export default [
    {
        path: '/form1',
        meta: {requireLogin: false},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/form/newIndex.vue'),
        children: [
            {
                path: '',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/editor')
            },
            {
                path: 'logic',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/logic')
            },
            {
                path: 'statistics',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/statistics')
            }
        ]
    }
]
