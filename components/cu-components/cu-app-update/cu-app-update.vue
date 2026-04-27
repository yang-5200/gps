<template>
	<view class="updateapp">
		<cu-popup ref="updateapp" mode="updateapp"></cu-popup>
		<cu-popup ref="cu-popup" mode="modal2"></cu-popup>
	</view>
</template>

<script>
	import { AppUpdate } from './app-update.js'
	import {APP_UPDATE_URL } from '@/common/config.js'
	export default {
		name: 'cu-app-update',
		data(){
			return {
				appUpdate: {}
			}
		},
		mounted() {
			this.appUpdate = new AppUpdate({
				that: this,
				popModalRef: this.$refs['cu-popup'],
				popUpdateAppRef: this.$refs['updateapp'],
				httpUrl: APP_UPDATE_URL,
			})
		},
		methods:{
			/**
			 * @description 
			 */
			async testUpdate(data = {type: 'passive'}){
				try{
					return await this.appUpdate.testUpdate(data);
				}catch(err){
					//TODO handle the exception
					return err;
				}
			}
		}
	}
</script>

<style lang="scss">
</style>