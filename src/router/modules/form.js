export default [
    {
        path: '/project/form',
        meta: {requireLogin: false},
        component: () => import(/* webpackChunkName: 'root' */ '@/views/form/newIndex.vue'),
        children: [
            {
                path: '',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/editor')
            },
            {
                path: 'editor',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/editor')
            },
            {
                path: 'logic',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/logic')
            },
            {
                path: 'preview',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/PreView')
            },
            {
                path: 'setting',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/setting')
            },
            {
                path: 'publish',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/publish')
            },
            {
                path: 'theme',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/theme')
            },
            {
                path: 'statistics',
                meta: {requireLogin: true},
                component: () => import(/* webpackChunkName: 'root' */ '@/views/form/statistics')
            }
        ]
    }
]
