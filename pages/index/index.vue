<template>
	<view class="page-content">
		<cu-nav-bar title-text="首页"></cu-nav-bar>
		<!-- <image class="logo" src="/static/logo.png" @click="toEditAvatar"></image> -->
		<cu-img class-name="logo" :src="logoUrl" @click="toEditAvatar"></cu-img>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>

		<form @submit="subFrom">
			<view class="flex align-center">
				<label>姓名：</label>
				<view>{{userInfo.userName}}</view>
			</view>
			<view style="border: 1px solid #eee; margin: 10px 0;padding: 10rpx 20rpx;">
				<input v-model="formData.userName" placeholder="请输入" type="text">
			</view>
			<up-button text="提交修改" form-type="submit"></up-button>
		</form>
	</view>
</template>

<script setup>
	import {onLoad, onUnload} from '@dcloudio/uni-app';
	import {useUserStore} from '@/stores/user.js';
	import {
		ref,
		reactive
	} from 'vue';

	const {
		userInfo,
		setUserName
	} = useUserStore();

	const title = ref('hello uni-app');
	// 表单数据
	const formData = reactive({
		userName: ''
	})
	
	// logo
	const logoUrl = ref('/static/logo.png')
	
	
	onLoad(() => {
		uni.$on('uAvatarCropper', (data) => {
			// console.log(data);
			logoUrl.value = data
		})
		
		// setTimeout(() => {
		// 	// logoUrl.value = '/static/logo1.png'
		// 	logoUrl.value = ''
		// },2000)
	})
	
	onUnload(() => {
		uni.$off('uAvatarCropper')
	})

	/**
	 * @description 提交表单
	 */
	const subFrom = () => {
		console.log(formData.userName);
		setUserName(formData.userName);
	}
	/**
	 * @description 去编辑头像
	 */
	const toEditAvatar = () => {
		uni.chooseImage({
			count: 1,
			success: res => {
				// uni.navigateTo({
				// 	url:'/pages/avatarCropper/avatarCropper'
				// })
				uni.$u.route({
					// 关于此路径，请见下方"注意事项"
					url: '/pages/avatarCropper/avatarCropper',
					// 内部已设置以下默认参数值，可不传这些参数
					params: {
						// 输出图片宽度，高等于宽，单位px
						destWidth: 300,
						// 裁剪框宽度，高等于宽，单位px
						rectWidth: 200,
						// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
						fileType: 'jpg',
						src: res.tempFilePaths[0]
					}
				})
			}
		})
	}
</script>

<style>
	.page-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>