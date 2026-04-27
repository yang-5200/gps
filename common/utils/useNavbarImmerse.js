import { debounce } from './util.js';
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { onPageScroll, onLoad } from '@dcloudio/uni-app'

export function useNavbarImmerse( ops = {} , pageScrollExtend){
	const navbarImmerse = reactive({
		navBar:{
		  backgroundColor:'',
		  h: 100,
		  rgb:'255, 255, 255',
		  a:0,
		},
		scrollTop:0 ,
		debounceFun:null,
		debounceTime: 1000 / 60,
		changeInterval:{
			start: 0.5,
			end: 1
		}
	})
	
	if(ops.rgb){
		navbarImmerse.navBar.rgb = ops.rgb;
	}
	
	if(ops.height){
		navbarImmerse.navBar.h = ops.height;
	}
	
	navbarImmerse.debounceFun = debounce(()=>{
		pageScrollExtend && pageScrollExtend();
	}, navbarImmerse.debounceTime)
	
	onPageScroll(e => {
		handelPageScroll(e);
	})
	
	/**
	 * @description 处理页面滚动
	 * @param {Object} e
	 */
	function handelPageScroll(e){
		// //console.log(e,'处理页面滚动');
		navbarImmerse.scrollTop = e.scrollTop;
		let top = navbarImmerse.scrollTop;
		let a = 0;
		let h = navbarImmerse.navBar.h;
		if (h >= top) {
			a = top / h;
		} else {
			a = navbarImmerse.changeInterval.end;
		}
		navbarImmerse.navBar.a = a;
		// //console.log(a);
		navbarImmerse.navBar.backgroundColor = `rgba(${navbarImmerse.navBar.rgb},${a})`;
		navbarImmerse.debounceFun();
	}
	
	// 初始化滚动
	handelPageScroll({scrollTop: 0})
	
	return{
		navbarImmerse
	}
}