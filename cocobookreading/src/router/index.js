import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './route/index.js'
import NProgress from 'nprogress'


Vue.use(VueRouter)

const router = new VueRouter({
  routes:routes,
})
//push
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

//replace
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (to) {
  return VueRouterReplace.call(this, to).catch(err => err)
}
router.beforeEach((to,from,next) => {
  NProgress.start();
  // 若加载时间长且不定，担心进度条走完都没有加载完，可以调用
  NProgress.inc();//这会以随机数量递增，且永远达不到100%，也可以设指定增量
  next();
})

router.afterEach(() => {
  NProgress.done()
})

export default router
