import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
// 存储
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// uview
import uviewPlus, { setConfig } from 'uview-plus'
// 接口请求
import api from '@/common/api/index.js'


export function createApp() {
  const app = createSSRApp(App)
	const pinia = createPinia()
	
	// 载入pinia插件
	pinia.use(piniaPluginPersistedstate)
	app.use(pinia)
	// 载入uviewPlus
	app.use(uviewPlus)
	// 载入接口请求
	app.use(api)
	
  return {
    app
  }
}
// #endif