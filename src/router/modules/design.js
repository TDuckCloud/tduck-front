import DesignLayout from '@/layout/design-layout'

export default {
    path: '/design',
    meta: {
        requireLogin: true
    },
    redirect: '/design/test1',
    component: DesignLayout,
    children: [
        {
            path: 'test1',
            component: () =>
                import(/* webpackChunkName: 'example' */ '@/views/design/test1.vue')
        },
        {
            path: 'test2',
            component: () =>
                import(/* webpackChunkName: 'example' */ '@/views/design/test2.vue')
        }
    ]
}
