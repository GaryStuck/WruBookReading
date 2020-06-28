const routes = [{
    path: '/',
    name: 'layer',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@v/login.vue'),
  },
  {
    path: '/ebook',
    name: 'ebook',
    component: () => import('@v/ebook/index.vue'),
    children: [{
      path: ':fileName',
      component: () => import('@/components/ebook/EbookReader.vue')
    }]
  }
]
export default routes
