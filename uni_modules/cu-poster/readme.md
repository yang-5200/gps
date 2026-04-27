### 组件
#### cu-poster-body 海报内容组件
>描述：海报布局的最外层组件
* tips：每个海报只能有一个cu-poster-body组件
```html
<cu-poster-body></cu-poster-body>
```
##### 属性说明
|  属性名			| 类型 | 默认值 |  说明 |
| :-----			| ----| ---- | ---- |
| class-name 	| String | 无 | 	布局需要用到的类名，同html元素的class |


#### cu-poster-view 海报视图容器组件
>描述：它类似于传统html中的div，用于包裹各种元素内容。
```html
<cu-poster-view></cu-poster-view>
```
##### 属性说明
|  属性名			| 类型 | 默认值 |  说明 |
| :-----			| ----| ---- | ---- |
| class-name 	| String | 无 | 	布局需要用到的类名，同html元素的class |
| zIndex 	| Number | 0 | 	用于调整绘制顺序，值越小越先绘制 |
| isDraw 	| Boolean | false | 用设置当前组件是否绘制，默认false（不绘制，大部分cu-poster-view只是为了布局，因此不需要绘制）  |

#### cu-poster-img 海报图片组件
>描述：海报布局放置图片的
```html
<cu-poster-body></cu-poster-body>
```
##### 属性说明
|  属性名			| 类型 | 默认值 |  说明 |
| :-----			| ----| ---- | ---- |
| class-name 	| String | 无 | 	布局需要用到的类名，同html元素的class |
| zIndex 	| Number | 1 | 	用于调整绘制顺序，值越小越先绘制 |
| src 	| String | 无 | 	图片资源地址 |
| mode 	| String | ’scaleToFill‘ | 	图片裁剪、缩放的模式，同<image>的mode属性 |

#### cu-poster-text 海报文本组件
>描述：海报布局放置图片的
```html
<cu-poster-text></cu-poster-text>
```
##### 属性说明
|  属性名			| 类型 | 默认值 |  说明 |
| :-----			| ----| ---- | ---- |
| class-name 	| String | 无 | 	布局需要用到的类名，同html元素的class |
| zIndex 	| Number | 2 | 	用于调整绘制顺序，值越小越先绘制 |
| text 	| String | 无 | 	文本内容 |

### 特别说明
目前各个组件参与绘制计算的样式属性有
```js
const computedStyle = {
	'text': [ //文本组件
		'font-size', // 字体大小
		'color', // 字体颜色
		'line-height'//行高
	],
	'view':[ //容器组件
		'background-color',//背景色
		'border-radius'//圆角
	],
	'image':[//图片组件
		'border-radius'//圆角
	]
}
```


### 基本用法演示
#### html
```html
	<template>
		<view class="page-wrap">
			<cu-poster-body class-name="my-poster" ref="my-poster">
				<cu-poster-view class-name="poster-wrap" :is-draw="true">
					<cu-poster-img class-name="cover-img" src="/static/404_a.jpg" mode="aspectFill"></cu-poster-img>
					<cu-poster-view class-name="poster-footer">
						<cu-poster-img class-name="avatar round" src="/static/404_a.jpg" mode="aspectFill"></cu-poster-img>
						<cu-poster-view class-name="user-info">
							<cu-poster-text class-name="name" text="呵呵哒"></cu-poster-text>
							<cu-poster-text class-name="phone" text="183****6512"></cu-poster-text>
						</cu-poster-view>
						<cu-poster-img class-name="qr-code" src="/static/404_a.jpg" mode="aspectFill"></cu-poster-img>
					</cu-poster-view>
				</cu-poster-view>
			</cu-poster-body>
			<button class="margin-top margin-lr-df" type="default" @click="getPoster">获取海报</button>
			<uni-popup ref="popup">
				<view class="img-pop">
					<image class="img-box" :src="posterUrl" mode="scaleToFill"></image>
				</view>
			</uni-popup>
		</view>
	</template>
```

#### css
```html
	<style lang="scss">
		.page-wrap{
			// my-poster start
			.my-poster{
				width: 546rpx;
				margin: 0 auto;
				padding-bottom: 20px;
				padding-top: 20px;
				// background-color: white;
				.poster-wrap{
					background-color: #fe6f0c;
					width: 546rpx;
					padding: 10rpx;
					border-radius: 10rpx;
					.cover-img{
						width: 100%;
						height: 600rpx;
						margin-bottom: 30px;
						border-radius:	20rpx;
					}
					.poster-footer{
						display: flex;
						align-items: center;
						position: relative;
						.qr-code{
							width: 80rpx;
							height: 80rpx;
							position: absolute;
							top: 50%;
							right: 0;
							transform: translateY(-50%);
							// border-radius: 10rpx;
						}
						.user-info{
							display: flex;
							flex-direction: column;
							color: white;
						}
						.avatar{
							width: 88rpx;
							height: 88rpx;
							margin-right: 10rpx;
							border-radius: 88rpx;
						}
					}
				}
			}
			// my-poster end
			.img-pop{
				.img-box{
					width: 546rpx;
					height: 768rpx;
				}
			}
		}
	</style>
```

#### js
```html
	<script>
		export default {
			data(){
				return{
					isShow: false,
					posterUrl: ''
				}
			},
			methods:{
				/**
				 * @description 获取海报
				 */
				getPoster(){
					this.$refs['my-poster'].getPoster().then(res => {
						//console.log(res);
						this.posterUrl = res;
						this.$refs.popup.open('center');
					})
				}
			}
		}
	</script>
```

