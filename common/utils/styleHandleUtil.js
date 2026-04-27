import { getDataType } from "@/common/utils/util.js"

/**
 * @description 转换对象样式为行间样式字符串
 * @param {Object} stylesObj
 */
export function convertStyles(stylesObj) {
	
	if(getDataType(stylesObj)!=='object') return '';
	
	// 定义一个正则表达式，用于匹配大写字母以转换为小写并添加连字符
	const camelCaseToDash = /([a-z])([A-Z])/g;

	// 转换样式对象为字符串
	return Object.keys(stylesObj).reduce((stylesStr, key) => {
		let value = stylesObj[key];

		// 如果值是null或者undefined，跳过该项
		if (value == null) {
			return stylesStr;
		}

		// 将驼峰命名转换为连字符分隔的小写形式
		const cssKey = key.replace(camelCaseToDash, '$1-$2').toLowerCase();

		// 拼接样式字符串
		return `${stylesStr}${cssKey}: ${value}; `;
	}, '').trim();
}