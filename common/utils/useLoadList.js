import { ref, reactive, computed, watch } from 'vue'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { object } from 'uview-plus/libs/function/test';

export function useLoadList({listData, getList, isOnReachBottom, isOnPullDownRefresh}){
	const pagination = reactive({
		// 页码
		pageNo: 1,
		// 每页条数
		pageSize: 10,
		// 总条数
		total: 0,
		// 加载状态
		loadStatus: 'loading',
		// 加载栏文字配置
		loadTextObj: {
			contentdown: '上拉加载更多', // more
			contentrefresh: '加载中...', // loading
			contentnomore: '没有更多了' // noMore
		},
		testList: [...new Array(10)].map(i => ({}))
	})
	
	/**
	 * @description 初始化
	 */
	function init(){
		pagination.pageNo = 1;
		listData.value = [];
		pagination.total = 0;
	}
	
	/**
	 * @description 主动触发下拉刷新
	 */
	function scrolltolower(){
		console.log(pagination.loadStatus, pagination.loadStatus != 'noMore');
		if (pagination.loadStatus != 'noMore') {
			pagination.pageNo++;
			getList();
		}
	}
	
	// 开始刷新
	!(isOnPullDownRefresh === false) && onPullDownRefresh(() => {
		init();
		getList();
	})
	
	// 上拉触底
	!(isOnReachBottom === false) && onReachBottom(() => {
		// //console.log('上拉触底');
		scrolltolower();
	})
	
	// 当前加载的条数
	const len = computed(() => {
		return listData.value.length;
	})
	
	// 监听列表数据的变化
	watch(listData, (nVal, oVal) => {
		// //console.log(nVal.length);
		if(nVal.length){
			pagination.loadTextObj.contentnomore = '没有更多了';
		}else{
			pagination.loadTextObj.contentnomore = '';
		}
	}, {
		immediate: true
	})
	
	return {
		pagination,
		len,
		init,
		scrolltolower
	}
}