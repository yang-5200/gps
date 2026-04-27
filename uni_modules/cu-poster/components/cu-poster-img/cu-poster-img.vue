<template>
	<!-- <image src="" mode="aspectFill"></image> -->
	<image class="cu-poster-img" :src="src" :class="className" :mode="mode" :data-mode="mode" :data-content="src" :data-zIndex="zIndex" data-type="image"></image>
</template>

<script>
	// import crypto from 'crypto'
	import { computedStyle } from '../../config.js';
	import { nanoid } from 'nanoid/non-secure'
	
	export default {
		name: 'cu-poster-img',
		props:{
			src:{ // 图片资源路径
				type: String,
				default: ''
			},
			zIndex:{ // 层级
				type: Number,
				default: 1,
			},
			mode:{
				type:String,
				default: 'scaleToFill'
			},
			className:{
				type: [String],
				default: ''
			}
		},
		data(){
			return {}
		},
		created() {
			this.init();
		},
		methods:{
			/**
			 * @description 初始化
			 */
			init(){
				// this.content = this.$slots.default[0].text;
				// //console.log(this.content);
				this.id = this.getHash('img-id');
				uni.$cuPosterSet.add({id:this.id, getElInfo: this.getElInfo })
			},
			
			/**
			 * @description 获取标签信息
			 */
			getElInfo(){
				return new Promise((resolve, reject) => {
					try{
						this.query = uni.createSelectorQuery();
						this.query.in(this).select(`.cu-poster-img`).fields({
							size: true,
							rect: true,
							dataset: true,
							computedStyle: computedStyle.image
						}, async res => {
							// //console.log(res);
							if(!res) return reject({mssage:'没有查询到节点信息'})
							resolve(res);
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
	
</style>