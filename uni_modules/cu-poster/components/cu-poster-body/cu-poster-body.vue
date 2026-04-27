<template>
	<view class="cu-poster-wrap" :class="className" >
		<view class="cu-poster-body"  :id="bodyId" data-type="body">
			<slot></slot>
			<canvas v-if="toolCanvasId" class="cu-poster-canvas cu-poster-canvas-tool" :canvas-id="toolCanvasId"></canvas>
			<canvas v-if="canvasId" class="cu-poster-canvas" :canvas-id="canvasId"></canvas>
		</view>
	</view>
</template>

<script>
	// import crypto from 'crypto'
	import QSCanvas from '../../js_sdk/QuShe-SharerPoster/index.js';
	import { computedStyle } from '../../config.js';
	import { nanoid } from 'nanoid/non-secure'
import { object } from 'uview-plus/libs/function/test.js';

	export default {
		name: 'cu-poster-body',
		props:{
			className:{
				type: [String],
				default: ''
			}
		},
		data(){
			return {
				canvasId: '',
				toolCanvasId:'', // 工具画布id
				bodyId:'',
				qsc: {},
				toolQsc:{},// 工具画布对象
				bgObj:{
					height: 10,
					width: 10
				},
				query: {},
				bodyItem:{}
			}
		},
		created() {
			this.canvasId = this.getHash('canvasId');
			this.toolCanvasId = 'tool-'+this.canvasId;
			this.bodyId = this.getHash('bodyId');
			uni.$cuPosterSet = new Set();
		},
		mounted() {
			// this.$nextTick(()=>{
			// 	this.init()
			// })
		},
		
		methods:{
			/**
			 * @description 获取海报
			 */
			async getPoster(){
				try{
					uni.showLoading({
						title:'生成中'
					})
					let poster = await this.init();
					uni.hideLoading();
					return poster;
				}catch(err){
					//TODO handle the exception
					//console.log(err);
					uni.hideLoading();
					return err;
				}
			},
			
			/**
			 * @description 初始化
			 */
			async init(){
				this.qsc = new QSCanvas({
					canvasId: this.canvasId,
					setCanvasWH: bg => {
						this.bgObj = bg
					}
				}, this)
				
				this.toolQsc = new QSCanvas({
					canvasId: this.toolCanvasId,
					setCanvasWH: bg => {
						this.bgObj = bg
					}
				}, this)
				
				
				// //console.log(this.qsc);
				let drawList = await this.getElInfo();
				
				// #ifdef MP-WEIXIN
				let wxList = await this.wxGetElInfo();
				drawList = drawList.concat(wxList)
				// #endif
				
				drawList = drawList.map(item => ({
					...item.dataset,
					...item
				})).filter(item => item.isdraw === false ? false : true).sort((a, b) => {
					return a.zindex - b.zindex
				})
				
				return await this.handeldRawList(drawList);
			},
			
			/**
			 * @description 处理绘制数据
			 */
			async handeldRawList(list){
				//console.log(list);
				try{
					let bodyItem = list.find(i => i.type === 'body');
					this.bodyItem = bodyItem;
					// //console.log(bodyItem);
					this.qsc.clearRect(0,0, bodyItem.width, bodyItem.height)
					// await this.qsc.draw();
					
					list = list.map(item => ({
						...item,
						dx: item.left - bodyItem.left,
						dy: item.top - bodyItem.top
					}))
					
					for (var i = 0; i < list.length; i++) {
						let item = list[i];
						// //console.log(item.type);
						//console.log(item);
						switch (item.type){
							case 'text':
								// 设置画笔属性
								this.qsc.setPaintbrush({
									fillStyle: item.color,
									font:{
										fontSize: this.getCssSizeNum(item['font-size']) 
									}
								})
								await this.qsc.drawText({
									val: item.content,
									x: item.dx,
									y: item.dy,
									// y: item.dy + 2,
									color: item.color
								})
								break;
							case 'image':
								let r = this.getCssSizeNum(item['border-radius']);
								// 绘制圆角
								// this.drawFillet(item);
								// await this.qsc.drawImg({
								// 	val: item.dataset.content,
								// 	x: item.dx,
								// 	y: item.dy,
								// 	width: item.width,
								// 	height: item.height,
								// 	mode: item.mode
								// })
								// r > 0 && this.qsc.restore()
								
								let path = await this.drawFillet(item);
								// //console.log(path)
								await this.qsc.drawImg({
									val: path,
									x: item.dx,
									y: item.dy,
									width: item.width,
									height: item.height,
									mode: item.mode
								})
								
								break;
							case 'view':
								if(item['background-image'] != 'none'){
									//console.log(item['background-image'])
									
									let path = await this.drawFillet(Object.assign(item, {
										dataset:{
											content: this.extractImageUrl(item['background-image'])
										}
									}));
									// //console.log(path)
									await this.qsc.drawImg({
										val: path,
										x: item.dx,
										y: item.dy,
										width: item.width,
										height: item.height,
										mode: item.mode
									})
									
								}else{
									// 设置画笔属性
									this.qsc.setPaintbrush({
										fillStyle: item['background-color']
									})
									await this.qsc.setRect({
										x: item.dx,
										y: item.dy,
										width: item.width,
										height: item.height,
										r: this.getCssSizeNum(item['border-radius'])
									})
									this.qsc.fill()
								}
								// await this.qsc.draw();
								break;
							default:
								break;
						}
					}
					await this.qsc.draw();
					return await this.canvasToImg();
				}catch(err){
					//TODO handle the exception
					//console.log(err)
					return err
				}
			},
			
			/**
			 * @description  提取imageUrl
			 * @param {Object} imageString
			 */
			extractImageUrl(imageString) {
			    // 使用正则表达式匹配双引号或单引号之间的内容
					const regex = /url\(['"]*([^'"]+)['"]*\)/
					const match = imageString.match(regex)
					return match ? match[1] : ''
			},
			
			/**
			 * @description 
			 */
			async canvasToImg(){
				try{
					let imgPath = await this.qsc.toImage({
						fileType: 'png',
						quality: 1,
						x: this.bodyItem.dx,
						y: this.bodyItem.dy,
						width: this.bodyItem.width,
						height: this.bodyItem.height
					})
					
					return imgPath
				}catch(err){
					//TODO handle the exception
					//console.log(err);
				}
			},
			
			
			/**
			 * @description 绘制圆角
			 * @param {Object} item 节点信息
			 */
			async drawFillet(item){
				let r = this.getCssSizeNum(item['border-radius']);
				// let r = 10;
				if(r > 0){
					
					let size = item.width > item.heigh ? item.heigh : item.width;
					let maxR = size / 2;
					r = r > maxR ? maxR : r;
					// //console.log(r, '绘制圆角', item);
					let x = 0;
					let y = 0;
					
					let width = item.width;
					let height = item.height;
					
					// this.toolQsc.clearRect(0,0, width * 2, height * 2)
					
					this.toolQsc.save()
					
					 // 开始绘制路径
					this.toolQsc.beginPath();
					
					// 绘制圆角矩形的四个角
					this.toolQsc.moveTo(x + r, y); // 左上角
					this.toolQsc.lineTo(x + width - r, y); // 右上角
					this.toolQsc.arcTo(x + width, y, x + width, y + r, r); // 右上角圆弧
					this.toolQsc.lineTo(x + width, y + height - r); // 右下角
					this.toolQsc.arcTo(x + width, y + height, x + width - r, y + height, r); // 右下角圆弧
					this.toolQsc.lineTo(x + r, y + height); // 左下角
					this.toolQsc.arcTo(x, y + height, x, y + height - r, r); // 左下角圆弧
					this.toolQsc.lineTo(x, y + r); // 左上角
					this.toolQsc.arcTo(x, y, x + r, y, r); // 左上角圆弧
					
					// 关闭路径
					this.toolQsc.closePath();
					
					// 裁剪
					this.toolQsc.clip();
					
					await this.toolQsc.drawImg({
						val: item.dataset.content,
						x: 0,
						y: 0,
						width: item.width,
						height: item.height,
						mode: item.mode
					})
					this.toolQsc.restore()
					
					await this.toolQsc.draw();
					
					return await this.toolQsc.toImage({
						fileType: 'png',
						quality: 1,
						x: 0,
						y: 0,
						width: width,
						height: height
					})
					
				}else{
					return item.dataset.content
				}
			},
			
			
			/**
			 * @description 获取css尺寸数值
			 * @param {Object} val css尺寸值
			 * @return {Number} css尺寸数值
			 */
			getCssSizeNum(val){
				// //console.log(val);
				if(!val) return 0
				return Number(val.replace('px', ''));
			},
			
			/**
			 * @description 微信小程序获取节点信息
			 */
			wxGetElInfo(){
				let promises = [];
				for(let item of uni.$cuPosterSet){
					promises.push(item.getElInfo());
				}
				return new Promise((resolve, reject) => {
					Promise.allSettled(promises).then(res => {
						// //console.log(res);
						resolve(res.filter(item =>item.status === 'fulfilled').map(i => i.value));
					}).catch(err => {
						//console.log(err);
						reject(err);
					})
				})
			},
			
			/**
			 * @description 获取标签信息
			 */
			getElInfo(){
				return new Promise((resolve, reject) => {
					try{
						this.query = uni.createSelectorQuery();
						this.query.in(this).selectAll(`.cu-poster-text, #${this.bodyId}, .cu-poster-view, .cu-poster-img`).fields({
							size: true,
							rect: true,
							dataset: true,
							computedStyle: [
								...computedStyle.text,
								...computedStyle.view,
								...computedStyle.image
							]
						}, async res => {
							// //console.log(res);
							// //console.log(this.qsc);
							if(!res || !res.length) return reject({mssage:'没有查询到节点信息'})
							let list = res;
							resolve(list);
						}).exec();
					}catch(err){
						//TODO handle the exception
						//console.log(err, '获取标签信息');
						reject(err)
					}
				});
			},
			
			/**
			 * @description 获取字符串哈希值
			 * @param {Object} str
			 */
			getHash(str){
				let time = new Date().getTime();
				// const hash = crypto.createHash('md5');
				const hash = nanoid();
				// hash.update(time.toString())
				// return `${str}-${hash.digest('hex')}`;
				
				return `${str}-${hash}`;
				
			},
		}
	}
</script>

<style lang="scss">
	@import './cu-poster-body.scss';
</style>