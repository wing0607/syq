import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css'
import '@/css/css.css'
import axios from './axios/axios'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import "echarts/lib/component/markPoint"
import "echarts/lib/component/markLine"
import "echarts/lib/chart/line"
import "echarts/lib/component/tooltip"

Vue.prototype.$echarts = echarts
Vue.prototype.axios = axios;

import { Grid, GridItem, Tabbar, TabbarItem } from 'vant'
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Tabbar)
Vue.use(TabbarItem)



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
