<template>
	<text class="cu-poster-text" :class="className" :data-content="content || text" :data-zIndex="zIndex" data-type="text">
		<template v-if="text">{{text}}</template>
		<slot v-else></slot>
	</text>
</template>

<script>
	// import crypto from 'crypto'
	import { computedStyle } from '../../config.js';
	import { nanoid } from 'nanoid/non-secure'
	export default {
		name:'cu-poster-text',
		props:{
			zIndex:{
				type: Number,
				default: 2,
			},
			text:{
				type: String,
				default: ''
			},
			className:{
				type: [String],
				default: ''
			}
		},
		data(){
			return {
				content: '',
				id:''
			}
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
				this.id = this.getHash('text-id');
				uni.$cuPosterSet.add({id:this.id, getElInfo: this.getElInfo })
			},
			
			/**
			 * @description 获取标签信息
			 */
			getElInfo(){
				return new Promise((resolve, reject) => {
					try{
						this.query = uni.createSelectorQuery();
						this.query.in(this).select(`.cu-poster-text`).fields({
							size: true,
							rect: true,
							dataset: true,
							computedStyle: computedStyle.text
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
			/**
			 * @description 获取uuid
			 */
			generateUUID(str) {
			  // return `${str}-${crypto.randomUUID()}`;
			}
		}
	}
</script>

<style lang="scss">
	.cu-poster-text{
		
	}
</style>