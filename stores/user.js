import { ref, reactive, computed} from 'vue';
import {defineStore} from 'pinia';

import persistedstateConfig from './options/persistedstateConfig.js'

/**
 * @description 定义一个 user 存储（store）
 */
export const useUserStore = defineStore('user', {
	state:()=>{
		return {
			userInfo:{
				userName: '呵呵哒'
			},
			isLogin: false
		}
	},
	actions:{
		setUserName(userName){
			console.log('设置用户信息');
			this.userInfo.userName = userName;
		}
	},
	// 持久化相关配置
	persist:{
		...persistedstateConfig,
		// 选择需要持久化state属性
		pick: ['userInfo','isLogin']
	}
})



// export const useUserStore = defineStore('user', () =>{
// 	// 用户信息
// 	const userInfo = reactive({
// 		userName: '呵呵哒'
// 	});
// 	// 是否登录
// 	const isLogin = ref(false);
	
// 	// 用户昵称
// 	const userName = userInfo.userName;
	
// 	/**
// 	 * @description 设置用户名
// 	 * @param {Object} userName
// 	 */
// 	function setUserName (userName){
// 		// console.log(userInfo.userName);
// 		userInfo.userName = userName;
// 	}
	
// 	return {userInfo, userName, isLogin, setUserName}
// }, {
// 	// 持久化相关配置
// 	persist:{
// 		...persistedstateConfig,
// 		// 选择需要持久化state
// 		pick: ['userInfo','isLogin']
// 	}
// })
