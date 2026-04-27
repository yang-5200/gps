import {reactive} from 'vue';
import { CuNavBarHeight } from '../style/variables';
export default function useSystemUtil(){
	const systemInfo = reactive(uni.getSystemInfoSync());
	// //console.log(systemInfo);
	
	let statusBarHeight = 0;
	// #ifdef H5
	statusBarHeight = 0
	// #endif
	// #ifndef H5
	statusBarHeight = systemInfo.statusBarHeight
	// #endif
	
	const narBarHeight = uni.upx2px(88) + statusBarHeight;
	
	return {
		systemInfo,
		statusBarHeight,
		tabbarPageContentHeight: `--tabbar-page-content-height:calc( 100vh - ${uni.upx2px(CuNavBarHeight)}px - 50px - ${systemInfo.statusBarHeight}px - ${systemInfo.safeAreaInsets.bottom}px);`,
		// 状态栏高度
		narBarHeight
	}
}