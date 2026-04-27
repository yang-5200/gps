<template>
	<view class="cu-scroll-bar" :style="cuScrollBarStyle">
		<scroll-view 
			:class="{fixed:fixed}" 
			:style="scrollBarStyle" 
			scroll-with-animation :scroll-left="scrollLeft" class="scroll-list scroll-box-x" :scroll-x="isScrollX" >
			<slot name="before"></slot>
			<view @click="changes(index)" class="item display-ib" :style="active == index ? newItemActiveStyle : newItemStyle" v-for="(item,index) in lists" :key="index">
				<view class="item-wrap">
					<image class="item-icon" :style="newItemIconStyle" v-if="isIcon" :src="active == index ? item.activeIcon : item.icon" mode="aspectFit"></image>
					<text class="item-txt text-hidden" space="emsp">{{item.name}}</text>
					<view v-if="active == index && isTag" class="item-tag" :style="newItemTagStyle"></view>
				</view>
			</view>
			<slot name="after"></slot>
		</scroll-view>
		<view v-if="fixed" :style="{height:scrollBarHeight+'rpx'}" class="fixed-after"></view>
	</view>
</template>

<script setup>
	import {ref, reactive, computed, watch, getCurrentInstance} from 'vue'
	
	import useSystemUtil from '@/common/utils/useSystemUtil.js';
	const { systemInfo, statusBarHeight } = useSystemUtil();
	
	import { DfColor} from '@/common/style/variables.js';
	
	// 样式转换
	import { convertStyles } from '@/common/utils/styleHandleUtil.js'
	
	// 定义props
	const props = defineProps({
		fixed:{//是否开启固定定位
			type:Boolean,
			default:true
		},
		
		fixedTop:{//开启固定定位后距离页面顶部的距离
			type:[String,Number],
			default: 0
		},
		
		scrollBarHeight:{//滚动切换栏高度
			type:Number,
			default:88
		},
		
		bgColor:{//切换栏背景色
		  type:String,
		  default(){
		    return 'white'
		  }
		},
		
		lists:{//切换栏列表
			type:[Array],
			default(){
				return []
			}
		},
		
		current:{//当前是第几项
			type:[String,Number],
			default(){
				return 0
			}
		},
		
		itemStyle:{//item样式
			type:[Object,String],
			default(){
				return {}
			}
		},
		itemActiveStyle:{//item选中样式
			type:[Object,String],
			default(){
				return {}
			}
		},
		itemTagStyle:{//item tag样式
			type:[Object,String],
			default(){
				return {}
			}
		},
		itemIconStyle:{
			type:[Object,String],
			default(){
				return {}
			}
		},
		isTag:{//是否需要 tag
			type:Boolean,
			default:true
		},
		
		isIcon:{ // 是否需要图标
			type:Boolean,
			default: false
		},
		
		zIndex:{//切换栏
			type:Number,
			default:99
		},
		
		isScrollX: {
			type: Boolean,
			default: true
		},
		
		// 滚动样式
		scrollBarStyle:{
			type: Object,
			default:()=>({})
		}
	})
	
	// 当前选择第几项
	const active = ref(props.current);
	
	// scrollLeft
	const scrollLeft = ref(0)
	
	//instance
	const instance = getCurrentInstance();
	
	// $emit
	const $emit = defineEmits();
	
	// 滚动栏样式
	const cuScrollBarStyle = computed(() => {
		const styles = [
			`--fixed-top:${props.fixedTop || (statusBarHeight + uni.upx2px(props.scrollBarHeight)) }px;`
		];
		return `${styles.join('')}`;
	})
	// 滚动栏自定义样式
	const scrollBarStyle = computed(() => {
		return convertStyles(Object.assign({
			height:props.scrollBarHeight+'rpx',
			background:props.bgColor,
			zIndex:props.zIndex
		}, props.scrollBarStyle))
	})
	
	// item样式
	const newItemStyle = computed(() =>{
		return convertStyles(Object.assign({},{
			padding:'0 20rpx',
			color:'#999',
			fontSize: '28rpx'
		}, props.itemStyle))
	})
	
	// item选中样式
	const newItemActiveStyle = computed(() => {
		return convertStyles(Object.assign({
			padding:'0 20rpx',
			fontWeight: 'bold',
			fontSize: '28rpx'
		},props.itemStyle,{color:'#333'},props.itemActiveStyle))
	})
	
	// item tag 样式
	const newItemTagStyle = computed(() => {
		return convertStyles(Object.assign({},{
				width:'40rpx',
				height:'6rpx',
				background: DfColor,
				bottom:'6rpx',
			},props.itemTagStyle))
	})
	
	// item tag 选中 样式
	const newItemIconStyle = computed(() => {
		return convertStyles(Object.assign({},{
				width:'48rpx',
				height:'48rpx',
				marginRight: '6rpx'
			},props.itemIconStyle))
	})
	
	/**
	 * @description 滚动条切换事件
	 * @param {Number} index
	 */
	function changes(index) {
			if (active.value == index) {
				return false;
			}
			active.value = index;
			let views = uni
				.createSelectorQuery()
				.in(instance.proxy)
				.selectAll('.cu-scroll-bar .item');
			views.fields(
				{
					size: true,
					scrollOffset: true
				},
				res => {
					if (!res) {
						return false
					}
					// ////console.log(res);
					let scrollX = 0;
					if(res){
						for (var i = 0; i < index-1; i++) {
							scrollX += res[i].width;
						}
						scrollLeft.value = scrollX;
						// ////console.log(scrollX,this.scrollLeft);
						$emit('change',{...props.lists[index],index});
					}
				}
			).exec();
		}
		
		watch(()=>props.current, (nVal) => {
			//console.log('nVal', nVal);
			active.value = nVal
		},{
			immediate: true
		})
</script>

<style lang="scss">
	.cu-scroll-bar{
		.scroll-list{
			white-space: nowrap;
			::-webkit-scrollbar {  
					display: none;  
					width: 0 !important;  
					height: 0 !important;  
					-webkit-appearance: none;  
					background: transparent;  
			}
			&.fixed{
				position: fixed;
				left: 0;
				width: 100%;
				top: var(--fixed-top);
			}
			.item{
				// width: 50%;
				height: 100%;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				// justify-content: flex-start;
				.item-wrap{
					position: relative;
					height: 100%;
					line-height: 100%;
					display: inline-flex;
					align-items: center;
					.item-txt{
						z-index: 1;
					}
				}

				.item-tag{
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					border-radius: 100rpx;
				}
			}
		}
	}
</style>
