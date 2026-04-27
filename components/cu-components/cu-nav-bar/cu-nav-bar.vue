<template>
	<view class="cu-nav-bar" :style="navStyle" :class="navClass" >
		<view class="nav-wrap" :style="navWrapStyle" :id="navWrapId" >
			<view v-if="bgMode === 'image'" class="nav-bg-img" :style="navBgImgStyle"></view>
			
			<view class="nav-box"
					:class="['align-mode-' + handleAlignMode]"
				>
				<!-- 导航栏左侧布局 start-->
				<view class="left-box">
					<view class="btns" v-if="isBack">
						<view class="btn-item back-btn" v-if="pagesLength > 1"
							@click="backBtnClick()"
							>
							<text class="cuIcon-back"></text>
						</view>
						<view class="btn-item home-btn" v-else
							@click="toHome">
							<text class="cu-icon-home text-xxl"></text>
						</view>
					</view>
					<slot name="left"></slot>
				</view>
				<!-- 导航栏左侧布局 end -->
				
				<!-- 导航栏内容布局 start-->
				<view class="center-box text-hidden flex-grow-1">
					<slot v-if="$slots['center']" name="center"></slot>
					<view v-else class="title-box text-bold text-hidden">
						{{titleText}}
					</view>
				</view>
				<!-- 导航栏内容布局 end -->
				
				<!-- 导航栏右侧布局 start-->
				<!-- #ifdef APP || H5 -->
				<view class="right-box">
					<slot name="right"></slot>
				</view>
				<!-- #endif -->
				<!-- 导航栏右侧布局 end -->
			</view>
			<view class="bottom-box"><slot name="bottom"></slot></view>
		</view>
	</view>
</template>
<script setup>
	import {ref, reactive, computed, onMounted, getCurrentInstance} from 'vue';
	import { DfColor, CuNavBarBackground, CuNavBarColor } from '@/common/style/variables.js';
	import {toPath, back, getDataType} from '@/common/utils/util.js';
	import { HOME_PAGE_PATH } from '@/common/config.js';
	import { nanoid } from 'nanoid/non-secure';
	import { convertStyles } from '@/common/utils/styleHandleUtil';
	import useSystemUtil from '@/common/utils/useSystemUtil.js';
	import { CuNavBarHeight } from '@/common/style/variables.js';
	const { systemInfo, statusBarHeight } = useSystemUtil();
		
	// 定义props
	const props = defineProps({
		// 导航栏标题
		titleText:{
			type: String,
			default: ''
		},
		// 导航栏内容高度 // rpx
		centerHeight:{
			type: Number,
			default: CuNavBarHeight
		},
		// 导航栏背景色、背景图片
		background:{
			type: String,
			default: CuNavBarBackground || DfColor
		},
		
		// 背景模式, 默认背景色
		bgMode:{
			type: String,
			default:'color'//image
		},
		
		// 背景自定义样式
		cuNavWrapStyle:{
			type: Object,
			default:{}
		},
		
		// 导航栏字体颜色
		color:{
			type: String,
			default: CuNavBarColor || 'white'
		},
		// 水平布局对齐方式
		alignMode:{
			type: String,
			default(){// center 居中、left 居右布局
				// #ifdef MP
				return 'center';
				// #endif
				// #ifndef MP
				return 'center'
				// #endif
			}
		},
		// 是否固定导航栏
		isFixed:{
			type: Boolean,
			default: true
		},
		
		// 是否需要占位
		isSize:{
			 type: Boolean,
			 default: true
		},
		
		// 水平布局对齐方式如果是center, 中间内容的宽度
		centerWdith:{
			type: [Number],
			default: uni.upx2px(750 - (88 * 2))
		},
		// 是否显示返回按钮
		isBack: {
			type: Boolean,
			default: true
		},
		// navWrap 随机id
		navWrapId:{
			type: String,
			default:`nav-wrap-${nanoid()}`
		},
		
		cuNavClass:{
			type: Array,
			default(){
				return []
			}
		},
		backBeforeFun:{
			type: [String, Function],
			default: ''
		}
	})
	
	// 水平布局对齐方式
	const handleAlignMode = computed(() => {
		return props.alignMode
	})
	
	// navWrap 高度
	const navWrapHeight = ref(0);
	
	//instance 
	const instance = getCurrentInstance();
	
	// 导航栏高度
	const navBarHeight = computed(() => {
		// statusBarHeight + uni.upx2px(props.centerHeight) + 
		return navWrapHeight.value;
	})
	
	
	// 导航栏样式
	const navStyle = computed(() => {
		const styles = [
			// 状态栏高度
			`--status-bar-height:${statusBarHeight}px;`,
			// 中间内容高度
			`--nav-center-height:${uni.upx2px(props.centerHeight)}px;`,
			// 导航栏高度
			`--nav-height:${navBarHeight.value}px;`,
			// 水平布局对齐方式如果是center, 中间内容的宽度
			`--nav-center-wdith:${props.centerWdith}px;`,
			// 微信菜单按钮的宽度
			`--menu-button-width:${menuButtonInfo.value.width}px;`
		];
		return `${styles.join('')}`;
	})
	
	// 导航栏样式
	const navWrapStyle = computed(() => {
		let styles = [
			`color:${props.color};`
		];
		if(props.bgMode === 'color'){
			styles.push(`background:${props.background};`)
		}
		// else{
		// 	styles = styles.concat([
		// 		// `background: url(~@/static/nav-bg.png) no-repeat;`,
		// 		// `background-size: 100% auto;`,
		// 		convertStyles(Object.assign({
		// 			background: `url(/static/bgs/nav-bg.png) no-repeat`,
		// 			backgroundSize: '100% auto',
		// 			// borderRadius: '0 0 20rpx 20rpx'
		// 		},props.cuNavWrapStyle))
		// 	])
		// }
		
		return `${styles.join('')}`;
	})
	
	// 导航栏背景图样式
	const navBgImgStyle = computed(() => {
		return convertStyles(Object.assign({
			background: `url(/static/nav-bg.png) no-repeat`,
			backgroundSize: '100% 100%',
			// borderRadius: '0 0 20rpx 20rpx'
		},props.cuNavWrapStyle))
	})
	
	
	
	// nav-wrap 样式类名
	const navClass = computed(() => {
		const classList = [].concat(props.cuNavClass);
		if(props.isFixed){
			classList.push('nav-wrap-fixed')
			props.isSize && classList.push('is-size')
		}
		return classList.join(' ');
	})
	
	// 菜单按钮相关信息
	const menuButtonInfo = ref({
		width: 0
	})
	
	// #ifdef MP-WEIXIN
	let menuButtonRectInfo = uni.getMenuButtonBoundingClientRect();
	menuButtonInfo.value = Object.assign({
		width: menuButtonRectInfo.width + uni.upx2px(60)
	})
	// #endif
	
	// 当前页面栈长度
	const pagesLength = computed(() => {
		const pages = getCurrentPages();
		return pages.length;
	})
	
	// 组件加载完成
	onMounted(() => {
		getNavWrapRect();
	})
	
	/**
	 * @description 获取导航NavWrap布局信息
	 */
	function getNavWrapRect(){
		// nav-bottom
		const views = uni
			.createSelectorQuery()
			.in(instance.proxy)
			.select(`#${props.navWrapId}`);
		views.fields(
			{ size: true },
			res => {
				// //console.log(res);
				if(!res) return;
				navWrapHeight.value = res.height;
			}
		).exec();
	}
	
	
	/**
	 * @description 返回首页
	 */
	function toHome(){
		toPath({
			path: HOME_PAGE_PATH,
			type:'reLaunch'
		})
	}
	
	/**
	 * @description 处理返回事件
	 */
	async function backBtnClick(){
		// props.backBeforeFun
		console.log(getDataType(props.backBeforeFun));
		
		if(getDataType(props.backBeforeFun) === 'function' && !await props.backBeforeFun()) return;
		back()
	}
	
</script>

<style lang="scss">
	@import './cu-nav-bar.scss';
</style>