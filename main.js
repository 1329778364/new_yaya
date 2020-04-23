import Vue from 'vue'
import App from './App'


// 引入 colorUI 的组件
import basics from './colorui/components/basics/home.vue'
Vue.component('basics',basics)

import components from './colorui/components/component/home.vue'
Vue.component('components',components)
 
import plugin from './colorui/components/plugin/home.vue'
Vue.component('plugin',plugin)

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

  
Vue.config.productionTip = false

App.mpType = 'app'
 
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()

const app = new Vue({
    ...App
})
app.$mount()
 