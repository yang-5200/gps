export default {
	// 缓存相关配置
	storage: {
		getItem: (key) => {
			// //console.log(key);
			return uni.getStorageSync(key)
		},
		setItem: (key, data) => {
			return uni.setStorageSync(key, data)
		},
		removeItem(key) {
			return uni.removeStorageSync(key);
		},
		clear(){
			return uni.clearStorage();
		}
	}
}