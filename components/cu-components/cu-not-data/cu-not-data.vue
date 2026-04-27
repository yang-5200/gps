<template>
	<view class="not-data" :class="{'full-screen':fullScreen}" :style="{
		color:color,
		zIndex:zIndex,
		paddingTop:paddingTop
	}">
		<!-- 默认为空展示 -->
		<view class="item type-1" v-if="ndType == 1">
			<image class="item-image" :style="{width: '100%', height: imgSize + 'rpx'}" :src="imgUrl" mode="aspectFit"></image>
			<!-- <image class="item-image" :style="{width: '100%', height: imgSize + 'rpx'}" src="/static/not-data-1.png" mode="aspectFit"></image> -->
			<view class="text" v-if="ndText">
				{{ndText}}
			</view>
			
			<slot name="footer"></slot>
		</view>
		<!-- not-data2.png -->
	</view>
</template>

<script setup>

	const props = defineProps({
			ndType:{//为空展示类型 1:默认为空 2:搜索结果为空
				type:[Number,String],
				default(){
					return 1
				}
			},
			ndText:{//提示文本内容
				type:String,
				default(){
					return ''
				}
			},
			color:{//字体颜色
				type:String,
				default(){
					return '#333'
				}
			},
		  // 图片路径
		  src:{
		    type:String,
		    default(){
		      return ''
		    }
		  },
		  // 是否全屏显示
		  fullScreen:{
		    type:Boolean,
		    default(){
		      return false
		    }
		  },
			zIndex:{
				type:[String,Number],
				default(){
					return 98
				}
			},
			paddingTop:{
				type:[String],
				default(){
					return '300rpx'
				}
			},
			imgUrl:{
				type: String,
				default: '/static/not-data-1.png'
			},
			imgSize:{
				type: [Number],
				default: 162
			}
		
	})
</script>

<style scoped lang="scss">
	.not-data{
		padding-top: 300rpx;
		text-align: center;
    &.full-screen{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      padding-top: calc(388rpx + var(--status-bar-height)) !important;
      background-color: white;
    }
		.item-image{
			width: 262rpx;
			height: 262rpx;
			margin-bottom: 40rpx;
		}
		.text{
			height:45rpx;
			font-family:PingFang SC;
			font-weight:400;
			line-height:45rpx;
		}
    .type-2{
      .item-image{
        width: 520rpx;
        height: 423rpx;
      }
			.not-data-addbtn{
			  width: 300rpx;
			  line-height: 72rpx;
			  margin: 32rpx auto 0;
			}
    }
		.type-3{
			.item-image{
			  height: 262rpx;
			}
		}
	}
</style>
