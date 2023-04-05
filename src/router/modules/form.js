export default [
  {
    path: '/project/form',
    meta: { requireLogin: false },
    component: () => import(/* webpackChunkName: 'root' */ '@/views/form'),
    children: [
      {
        path: '',
        meta: { requireLogin: true },
        component: () => import(/* webpackChunkName: 'root' */ '@/views/form/editor')
      },
      {
        path: 'editor',
        meta: { requireLogin: true },
        component: () => import(/* webpackChunkName: 'root' */ '@/views/form/editor')
      },
      {
        path: 'logic',
        meta: { requireLogin: true },
        component: () => import(/* webpackChunkName: 'root' */ '@/views/form/logic')
      },
      {
        path: 'preview',
        meta: { requireLogin: true },
        component: () => import(/* webpackChunkName: 'root' */ '@/views/form/preview')
      },
      {
        path: 'setting',
        meta: { requireLogin: true },
        component: () => import(/* webpackChunkName: 'root' */ '@/views/form/setting')
      },
      {
        path: 'publish',
        meta: { requireLogin: true },
        component: () => import(/* webpackChunkName: 'root' */ '@/views/form/publish')
      },
      {
        path: 'theme',
        meta: { requireLogin: true },
        component: () => import(/* webpackChunkName: 'root' */ '@/views/form/theme')
      },
      {
        path: 'data',
        meta: { requireLogin: true },
        component: (resolve) => require(['@/views/form/data'], resolve)
      },
      {
        path: 'statistics',
        meta: { requireLogin: true },
        component: (resolve) => require(['@/views/form/statistics'], resolve)
      }
    ]
  }
]
