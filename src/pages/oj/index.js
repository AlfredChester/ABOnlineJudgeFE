// import 'amfe-flexible'
// import 'lib-flexible'
import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import i18n from '@/i18n'
import VueClipboard from 'vue-clipboard2'
import VueFullscreen from 'vue-fullscreen'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import VueAnalytics from 'vue-analytics'
import { GOOGLE_ANALYTICS_ID } from '@/utils/constants'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

import Panel from '@oj/components/Panel.vue'
import VerticalMenu from '@oj/components/verticalMenu/verticalMenu.vue'
import VerticalMenuItem from '@oj/components/verticalMenu/verticalMenu-item.vue'
import '@/styles/index.less'

import highlight from '@/plugins/highlight'
import katex from '@/plugins/katex'
import filters from '@/utils/filters.js'

import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/markPoint'

// document.documentElement.style.fontSize = window.screen.width / 10 + 'px'

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.config.debug = process.env.NODE_ENV !== 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(VueFullscreen)
Vue.use(PerfectScrollbar)

Vue.use(VueClipboard)
Vue.use(highlight)
Vue.use(katex)
Vue.use(VueAnalytics, {
  id: GOOGLE_ANALYTICS_ID,
  router
})

Vue.component('ECharts', ECharts)
Vue.component(VerticalMenu.name, VerticalMenu)
Vue.component(VerticalMenuItem.name, VerticalMenuItem)
Vue.component(Panel.name, Panel)

// 注册全局消息提示
Vue.prototype.$Message.config({
  duration: 2
})
Vue.prototype.$error = (s) => Vue.prototype.$Message.error(s)
Vue.prototype.$info = (s) => Vue.prototype.$Message.info(s)
Vue.prototype.$success = (s) => Vue.prototype.$Message.success(s)

console.log(
  '%c%s%c%s', 'color:red;font-size:24px;', `   Welcome to`,
  'color:blue;font-weight:bold;', `
     ___      .______     ______          __  
    /   \\     |   _  \\   /  __  \\        |  | 
   /  ^  \\    |  |_)  | |  |  |  |       |  | 
  /  /_\\  \\   |   _  <  |  |  |  | .--.  |  | 
 /  _____  \\  |  |_)  | |  \`--'  | |  \`--'  | 
/__/     \\__\\ |______/   \\______/   \\______/  
 `)

new Vue(Vue.util.extend({ router, store, i18n }, App)).$mount('#app')
