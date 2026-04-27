<template>
	<!-- 顶部导航栏 -->
	<cu-nav-bar :title-text="pageTitle" :background="'#FFFFFF'"></cu-nav-bar>

	<view class="page-wrap">
		<view class="page-content padding-lg">
			<!-- 协议标题 -->
			<view class="protocol-header margin-bottom-lg">
				<text class="title text-xxl text-bold text-center block">{{ pageTitle }}</text>
				<text class="update-time text-sm text-gray text-center block margin-top-sm">更新日期：{{ updateTime }}</text>
			</view>

			<!-- 协议内容 -->
			<view class="protocol-content">
				<rich-text :nodes="protocolContent"></rich-text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { http, urls } from '@/common/api/index.js';
import { toast, loading } from '@/common/utils/util.js';

// 页面数据
const protocolType = ref('');
const protocolData = reactive({
	service: {
		title: '服务协议',
		updateTime: '2024-01-01',
		content: `
			<div class="protocol-section">
				<h3 class="section-title">一、服务条款</h3>
				<p class="section-text">欢迎使用我们的服务！在使用本服务前，请您仔细阅读本服务协议（以下简称"本协议"）。</p>
				<p class="section-text">1.1 您使用本服务即表示您同意本协议的所有条款和条件。</p>
				<p class="section-text">1.2 我们有权随时修改本协议，修改后的协议将在平台上公布。</p>
			</div>
			<div class="protocol-section">
				<h3 class="section-title">二、账号注册</h3>
				<p class="section-text">2.1 您需要注册账号才能使用我们的部分服务。</p>
				<p class="section-text">2.2 您应当提供真实、准确、完整的注册信息。</p>
				<p class="section-text">2.3 您有责任保管好您的账号和密码。</p>
			</div>
			<div class="protocol-section">
				<h3 class="section-title">三、服务使用</h3>
				<p class="section-text">3.1 您应当遵守法律法规，不得利用本服务从事违法活动。</p>
				<p class="section-text">3.2 您不得干扰或破坏本服务的正常运行。</p>
				<p class="section-text">3.3 我们有权根据业务发展需要调整服务内容。</p>
			</div>
			<div class="protocol-section">
				<h3 class="section-title">四、免责声明</h3>
				<p class="section-text">4.1 本服务按"现状"提供，我们不作任何明示或暗示的保证。</p>
				<p class="section-text">4.2 因不可抗力导致的服务中断，我们不承担责任。</p>
			</div>
		`
	},
	privacy: {
		title: '隐私协议',
		updateTime: '2024-01-01',
		content: `
			<div class="protocol-section">
				<h3 class="section-title">一、隐私保护原则</h3>
				<p class="section-text">我们非常重视您的隐私保护，致力于保护您的个人信息安全。</p>
				<p class="section-text">1.1 我们严格遵守相关法律法规保护用户隐私。</p>
				<p class="section-text">1.2 我们仅在必要范围内收集和使用您的个人信息。</p>
			</div>
			<div class="protocol-section">
				<h3 class="section-title">二、信息收集</h3>
				<p class="section-text">2.1 我们可能收集的信息包括：设备信息、位置信息、使用记录等。</p>
				<p class="section-text">2.2 我们收集信息的目的在于提供更好的服务体验。</p>
				<p class="section-text">2.3 未经您的同意，我们不会向第三方披露您的个人信息。</p>
			</div>
			<div class="protocol-section">
				<h3 class="section-title">三、信息使用</h3>
				<p class="section-text">3.1 我们使用您的信息来提供、维护和改进我们的服务。</p>
				<p class="section-text">3.2 我们可能使用您的信息进行服务相关的通知和沟通。</p>
				<p class="section-text">3.3 我们采取技术和管理措施保护您的信息安全。</p>
			</div>
			<div class="protocol-section">
				<h3 class="section-title">四、您的权利</h3>
				<p class="section-text">4.1 您有权访问、更正、删除您的个人信息。</p>
				<p class="section-text">4.2 您有权撤回对我们处理您个人信息的同意。</p>
				<p class="section-text">4.3 您有权就个人信息处理事宜向我们提出投诉。</p>
			</div>
		`
	}
});

// 计算属性
const pageTitle = computed(() => {
	return protocolData[protocolType.value]?.title || '协议';
});

const updateTime = computed(() => {
	return protocolData[protocolType.value]?.updateTime || '';
});

const protocolContent = computed(() => {
	return protocolData[protocolType.value]?.content || '';
});

/**
 * @description 页面加载
 */
onLoad((options) => {
	const { type } = options || {};
	protocolType.value = type === 'privacy' ? 'privacy' : 'service';
});
</script>

<style lang="scss">
.page-wrap {
	.page-content {
		.protocol-header {
			.title {
				display: block;
			}
		}

		.protocol-content {
			line-height: 1.8;

			::v-deep .protocol-section {
				margin-bottom: 40rpx;

				.section-title {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 20rpx;
				}

				.section-text {
					font-size: 28rpx;
					color: #666;
					margin-bottom: 16rpx;
					text-align: justify;
				}
			}
		}
	}
}
</style>
