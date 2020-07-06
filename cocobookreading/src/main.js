import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/styles/icon.css'
import '@/assets/styles/global.scss'
import 'element-ui/lib/theme-chalk/index.css';
import '@u'
import install from './api/ajax'



Vue.use(install)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
