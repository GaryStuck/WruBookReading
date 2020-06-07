import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    redirect: '/ebook'
  },
  {
    path: '/ebook',
    name: 'ebook',
    component: () => import('../views/ebook/index.vue'),
    children:[
      {
        path: ':fileName',
        component:()=>import('@/components/ebook/EbookReader.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes,
})

export default router
