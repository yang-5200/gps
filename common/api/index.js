import {
	API_BASE_URL,
	LOGIN_PAGE_PATH
} from '@/common/config.js'
import {
	http} from 'uview-plus'
import urls from './urls.js';
import {toast} from '@/common/utils/util.js';

import { useUserStore } from '@/stores/user.js';

export default {
	install: app => {
		// //console.log(app);
		// //console.log(http);
		// 全局配置
		http.setConfig((config) => {
			config.baseURL = API_BASE_URL;
			config.header['content-type'] = 'application/x-www-form-urlencoded'; // application/json
			return config;
		})
		// 修改get请求传参方式 去除params
		http.get = function (url, options = {}) {
			let data = {
				params: options
			}
			return http.middleware({
			  url,
			  method: "GET",
			  ...data
			});
		}
		/**
		 * 请求拦截
		 * @param {Object} http
		 */
		http.interceptors.request.use((config) => { // 可使用async await 做异步操作
				// 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
				config.data = config.data || {}
				//console.log(config)
				const userStore = useUserStore();
				if(!config.header.token) {
					config.header.token = userStore.token;
				}
				// console.log(config.header, 'config.header');
				return config
			}, (config) => // 可使用async await 做异步操作
			Promise.reject(config));
		/**
		 * 响应拦截
		 * @param {Object} http 
		 */
		http.interceptors.response.use((response) => {
			uni.hideLoading();
			
			/* 对响应成功做点什么 可使用async await 做异步操作*/
			const data = response.data
			// //console.log('http', response)
			// 自定义参数
			const custom = response.config?.custom
			// //console.log(custom);
			
			if (data.code !== 1) { // 服务端返回的状态码不等于1，则reject()
				// console.log(data);
				// 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
				// 如果需要catch返回，则进行reject
				if (custom?.catch) {
					return Promise.reject(data)
				} 
				
				// if(custom.toast !== false){
				// 	toast(data.msg)
				// }
				
				return data;
			}
			
			return data || {}
		}, (response) => {
			console.log(response);
			
			// console.log(data.code === 401 && !uni.requestLoginOutTask);
			const data = response.data;
			if (data.code === 401 && !uni.requestLoginOutTask) {
				// console.count('requestLoginOutTask');
				handleNotLogin();
			} else {
				if(custom.toast !== false){
					toast(data.msg)
				}
			}
			uni.hideLoading();
			/*  对响应错误做点什么 （statusCode !== 200）*/
			return Promise.reject(response)
		})
	}
}


/**
	 * @description 处理未登录状态
	 */
function handleNotLogin(){
		uni.requestLoginOutTask = true;
		const userStore = useUserStore();
		
		toast({
			title: '登录失效 请重新登录',
			icon: 'none',
			position: 'bottom',
			duration: 1000
		}).then(() =>{
			userStore.setUserInfo({}, false);
			uni.reLaunch({
				url: LOGIN_PAGE_PATH
			})
			uni.requestLoginOutTask = false;
		})
	}


export {
	http,
	urls
}