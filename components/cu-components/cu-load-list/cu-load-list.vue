<template>
	<view class="cu-load-list" :cu-load-list-class="loadListClass">
		<slot></slot>
		
		<block v-if="!len && loadStatus == 'noMore' && needNotData">
			<slot name="not-data" v-if="$slots['not-data']"></slot>
			<cu-not-data
				v-else
				:paddingTop="ndTop" 
				:fullScreen="false"  
				:ndType="ndType" 
				:ndText="ndText"
				:imgUrl="ndImgUrl"
				:imgSize="ndImgSize"
			>
				<template #footer>
					<slot name="not-data-footer"></slot>
				</template>
			</cu-not-data>
		</block>
		
		<cu-load-more v-if="loadStatus =='loading' || isNoMore" :status="loadStatus" :contentText="loadTextObj"></cu-load-more>
	</view>
</template>

<script setup>	
	const props = defineProps({
		// 列表长度
		len:{
			type:[Number,String],
			default(){
				return ''
			}
		},
		// 加载状态
		loadStatus:{
			type:[String],
			default(){
				return 'loading'
			}
		},
		loadTextObj:{
			type:Object,
			default(){
				return {
					contentdown: '上拉加载更多', // more
					contentrefresh: '加载中...', // loading
					contentnomore: '没有更多数据了' // noMore
				}
			}
		},
		// 列表自定义类名
		loadListClass:{
			type:String,
			default (){
				return ''
			}
		},
		ndType:{
			type:Number,
			default:1
		},
		ndTop:{
			type:[String],
			default:'180rpx'
		},
		ndText:{
			type:String,
			default:'暂无相关内容'
		},
		isNoMore:{
			type:Boolean,
			default: true
		},
		needNotData:{
			type: Boolean,
			default: true
		},
		ndImgUrl:{
			type: String,
			default: '/static/not-data-1.png'
		},
		ndImgSize:{
			type: [Number],
			default: 262
		}
	})
	
</script>

<style lang="scss" >
	.cu-load-list{
		
	}
</style>
