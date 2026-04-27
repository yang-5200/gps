import {
	LOGIN_PAGE_PATH,
	FILE_BASE_URL,
	FILE_STATIC_BASE_URL
} from '@/common/config.js'

import {
	useUserStore
} from '@/stores/user.js';



/**
 * @description 页面跳转
 * @param {Object} e e.type 
 */
export function toPath(e, hasTestlogin) {
	// 载用户Store
	// const userStore = useUserStore();
	// if (hasTestlogin && !userStore.isLogin) {
	// 	return uni.navigateTo({
	// 		url: LOGIN_PAGE_PATH
	// 	})
	// }
	
	if(hasTestlogin && !testLogin()) return ;
	
	let ops, queryArr = [];
	if (typeof(e) == 'string') {
		ops = {
			path: e,
			type: 'navigateTo'
		}
	} else {
		ops = Object.assign({}, {
			type: 'navigateTo'
		}, e);
		for (let key in ops.query) {
			queryArr.push(key + '=' + ops.query[key]);
		}
		if (queryArr.length > 0) {
			ops.path += ops.path.indexOf('?') == -1 ? '?' : '&';
			ops.path += queryArr.join('&');
		}
	}
	// return //console.log(ops);
	const eventObj = {
		reLaunch: uni.reLaunch,
		redirectTo: uni.redirectTo,
		switchTab: uni.switchTab,
		navigateTo: uni.navigateTo
	}
	eventObj[ops.type]({
		url: ops.path
	})
}


/**
 * @description 返回上一页
 * @param {delta}  返回的页面数，如果 delta 大于现有页面数，则返回到首页
 */
export function back(delta) {
	// //console.log('返回上一页',delta);
	uni.navigateBack({
		delta: delta || 1
	})
}

/**
 * @description  判断内容是否显示
 * @param {String} arr 要判端数组
 * @param {String | Number} val 要判的值
 */
export function isContentShow(arr, val) {
	return arr.includes(val);
}


/**
 * @description 处理文件资源路径
 * @param {Object} src
 */
export function handleFilePath(src) {
	// //console.log(src);
	src = src || ''
	return src.indexOf('http://') != -1 ||
		src.indexOf('https://') != -1 ||
		/^data:image\/(jpeg|png|gif|svg\+xml);base64,/.test(src) ||
		/^\/static/.test(src) 
		? src : FILE_BASE_URL + src;
}


/**
 * @description 处理静态文件资源路径
 * @param {Object} src
 */
export function handleStaticFilePath(src) {
	// //console.log(src);
	src = src || ''
	return src.indexOf('http://') != -1 ||
		src.indexOf('https://') != -1 ||
		/^data:image\/(jpeg|png|gif|svg\+xml);base64,/.test(src)
		? src : FILE_STATIC_BASE_URL + src;
}

/**
 * @description 会消失的提示框
 */
export const toast = function(ops, type) {
	if (typeof(ops) == 'string') {
		ops = {
			title: ops,
			icon: type || 'none',
			mask: true,
			duration: 1500
		};
	} else {
		ops = Object.assign({}, {
			icon: 'none',
			mask: true,
			duration: 1500
		}, ops);
	}
	uni.showToast(ops);
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(ops), ops.duration)
	})
}

/**
 * @description 加载中提示框
 * @param {Object} ops
 */
export const loading = function(ops) {
	if (typeof(ops) == 'string') {
		ops = {
			title: ops,
			mask: true
		};
	} else {
		ops = Object.assign({}, {
			mask: true
		}, ops);
	}

	uni.showLoading(ops);
}


/**
 * @description 打开文档
 * @param {Object} path
 */
export function openDocument(path) {
	// #ifndef H5
	loading('打开中...')
	uni.downloadFile({
		url: handleFilePath(path),
		success: function(res) {
			var filePath = res.tempFilePath;
			uni.hideLoading()
			uni.openDocument({
				filePath: filePath,
				showMenu: true,
				success: function(res) {
					//console.log('打开文档成功');
				}
			});
		},
		fail: (err) => {
			uni.hideLoading()
			toast('打开失败' + JSON.stringify(err))
		}
	});
	// #endif
}

/**
 * @description 防抖函数
 */
export const debounce = (func, delay, immediate) => {
	// result表示返回值
	let timeout, result;

	let debounced = function() {
		// 存储触发当前事件的this
		let _this = this;
		// 存储event对象
		let args = arguments;
		clearTimeout(timeout);
		// 判断是否立即执行，如果不传默认不立即执行
		if (immediate) {
			// 立即执行
			let callNow = !timeout;
			timeout = setTimeout(() => {
				timeout = null;
			}, delay);
			if (callNow) result = func.apply(_this, args);
		} else {
			timeout = setTimeout(function() {
				func.apply(_this, args);
			}, delay);
		}
		return result;
	};
	debounced.cancel = function() {
		clearTimeout(timeout);
		timeout = null;
	};
	return debounced;
}

/**
 * @description 节流函数
 */
export const throttle = (func, delay, options) => {
	// 使用定时器和时间戳完成的第三版（第一次会触发，最后一次会触发）
	let context, args, timeout;
	// 之前的时间戳
	let oldTime = 0
	if (!options) options = {}
	let later = function() {
		oldTime = new Date().valueOf()
		timeout = null
		func.apply(context, args)
	}
	return function() {
		context = this
		args = arguments

		// 获取当前时间戳
		let now = new Date().valueOf()

		// 判断第一次是否执行
		if (options.leading === false) {
			// 不执行
			oldTime = now
		}

		// 第一次会触发
		if (now - oldTime > delay) {
			if (timeout) {
				// 清空定时器
				clearTimeout(timeout)
				timeout = null
			}
			// 立即执行
			func.apply(context, args)
			// 每隔delay秒执行一次
			oldTime = now
		} else if (!timeout && options.trailing !== false) {
			timeout = setTimeout(later, delay)
		}
	}
}

/**
 * @description 获取当前数据类型
 * @param {Object} value 要获取类型的数据
 * @returns {String} 返回当前数据类型
 */
export function getDataType(value) {
  // 明确处理 null 的情况，因为 typeof null 返回 "object"
  if (value === null) return 'null';

  // 使用 Object.prototype.toString.call 获取对象更具体的数据类型
  // slice(8, -1) 是为了去掉返回字符串中的 "[object " 和 "]", 只保留类型名称
  const type = Object.prototype.toString.call(value).slice(8, -1);

  // 处理各种函数类型（普通函数、异步函数、生成器函数等）
  if (type === 'Function' || type === 'AsyncFunction' || type === 'GeneratorFunction' || type === 'Generator') {
    return 'function';
  }

  // 对于其他所有情况，我们可以简单地返回小写类型字符串
  return type.toLowerCase();
}

/**
 * @description 打开地图
 * @param {Object} ops
 */
export function openLocation(ops) {
	uni.openLocation({
		...ops
	})
}

/**
 * @description 拨打电话
 * @param {Object} phone 
 */
export function makePhoneCall(phone){
	 uni.makePhoneCall({
		phoneNumber: phone + '', // 替换为你想要拨打的电话号码
		success: () => {
			//console.log('拨打成功');
		},
		fail: (err) => {
			console.error('拨打失败', err);
		}
	});
}


/**
 * @description 手机号脱敏 (可自定义保留位数和掩码符号)
 * @param {String|Number} phone - 手机号
 * @param {Object} options - 配置项
 * @param {Number} options.start - 开始保留位数
 * @param {Number} options.end - 结束保留位数
 * @param {String} options.symbol - 掩码符号
 * @returns {String} 处理后的手机号
 * @example
 * desensitizePhoneCustom('13812345678', { start: 4, end: 3 }) // '1381***678'
 */
export const desensitizePhoneCustom = (phone, options = {}) => {
  const { 
    start = 3, 
    end = 4, 
    symbol = '*' 
  } = options
  
  if (!phone) return ''
  
  const phoneStr = String(phone)
  if (!/^\d{11}$/.test(phoneStr)) return phoneStr
  
  const maskLen = phoneStr.length - start - end
  const mask = symbol.repeat(maskLen)
  
  return phoneStr.slice(0, start) + mask + phoneStr.slice(-end)
}


/**
 * @description 去除字符串中指定字符
 * @param {String} str - 原始字符串
 * @param {String|Array} chars - 要去除的字符或字符数组
 * @returns {String} 处理后的字符串
 * @example
 * removeChars('Hello World!', ['l', 'o']) // 'He Wrd!'
 * removeChars('Hello World!', 'l') // 'Heo Word!'
 */
export const removeChars = (str, chars) => {
  if (!str) return ''
  if (!chars) return str
  
  // 将 chars 转换为数组
  const charsArray = Array.isArray(chars) ? chars : [chars]
  
  // 方法1: 使用正则表达式
  const pattern = new RegExp(`[${charsArray.join('')}]`, 'g')
  return str.replace(pattern, '')
}


/**
 * @description 复制文本到剪贴板
 * @param {String} text - 要复制的文本
 * @returns {Promise} 返回一个Promise，表示复制操作的结果
 */
export const copyTextToClipboard = (text) => {
	if(!text) return toast('请选择要复制的内容');
  return new Promise((resolve, reject) => {
    // 使用uniapp的API设置剪贴板内容
    uni.setClipboardData({
      data: text,
      success: () => {
				toast('复制成功', 'success')
        resolve()
      },
      fail: (err) => {
        // 失败回调
				toast('复制失败')
        reject(err)
      }
    })
  })
}

/**
 * @description 检测登录
 */
export function testLogin(toLogin = true){
	const userStore = useUserStore();
	!userStore.isLogin && uni.navigateTo({
		url: LOGIN_PAGE_PATH
	})
	return userStore.isLogin;
}