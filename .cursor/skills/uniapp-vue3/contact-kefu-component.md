---
title: 客服联系组件
category: uniapp-vue3
tags: [component, customer-service, phone, modal]
created: 2026-04-26
---

# 客服联系组件

## 问题/场景
在应用中提供客服联系方式，支持两种方式：
1. 传入固定手机号直接拨打
2. 从接口动态获取客服电话后拨打

需要展示确认弹窗，用户确认后再拨打电话。

## 核心要点

### 组件设计
- 使用 slot 自定义触发按钮，默认显示客服图标
- 支持 `phoneNumber` props 传入固定号码
- 无 props 时自动调用接口获取客服电话
- 使用 `cu-popup` 组件展示确认弹窗

### 优先级策略
手机号获取优先级：props > 接口缓存 > 空值提示

### 拨打电话
使用 `makePhoneCall` 工具函数，内部封装 `uni.makePhoneCall`

## 示例代码

```vue
<template>
	<view class="contact-kefu" @click.stop>
		<view class="btn" @click="showPop()">
			<slot>
				<view class="box-size-44 flex align-center justify-center">
					<image class="box-size-24" src="/static/icon/kefu-server.png" mode="aspectFit"></image>
				</view>
			</slot>
		</view>
		
		<cu-popup mode="modalIcon" ref="iconModalRef"></cu-popup>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { makePhoneCall, toast } from '@/common/utils/util.js';
	import { http, urls } from '@/common/api/index.js';

	const props = defineProps({
		phoneNumber: {
			type: [Number, String],
			default: ''
		}
	});

	const iconModalRef = ref(null);
	const apiPhone = ref('');

	async function fetchCustomerService() {
		try {
			const res = await http.get(urls.common.getCustomerService);
			if (res.code === 1 && res.data?.customer_service_phone) {
				apiPhone.value = res.data.customer_service_phone;
			}
		} catch (err) {
			console.error('[contact-kefu] 获取客服联系方式失败：', err);
		}
	}

	function getPhone() {
		if (props.phoneNumber) {
			return String(props.phoneNumber);
		}
		if (apiPhone.value) {
			return apiPhone.value;
		}
		return '';
	}

	async function showPop() {
		if (!props.phoneNumber && !apiPhone.value) {
			await fetchCustomerService();
		}

		const phone = getPhone();
		if (!phone) {
			toast('暂无客服联系方式');
			return;
		}

		iconModalRef.value.show({
			title: '联系客服',
			content: `<div style="font-size: 15px;padding: 10px 0;">${phone}</div>`,
			showCancel: true,
			cancelText: '取消',
			confirmText: '确定',
			success: (result) => {
				if (result.confirm) {
					makePhoneCall(phone);
				}
			}
		});
	}
</script>
```

## 使用方式

```vue
<!-- 方式1：使用默认图标 -->
<contact-kefu :phone-number="4001234567" />

<!-- 方式2：自定义触发内容 -->
<contact-kefu>
	<button>联系客服</button>
</contact-kefu>

<!-- 方式3：不传入手机号，自动从接口获取 -->
<contact-kefu />
```

## 注意事项

1. **点击事件冒泡**：组件根节点使用 `@click.stop` 防止事件冒泡
2. **类型转换**：props 可能传入 Number，拨打电话前用 `String()` 转换
3. **接口缓存**：获取后的电话号缓存在 `apiPhone` 中，避免重复请求
4. **错误处理**：接口失败时静默处理，不打断用户体验
5. **空值提示**：无可用电话时提示"暂无客服联系方式"

## 相关 skill

- [全局弹窗系统使用规范](./popup-system.md)
- [工具函数使用规范](./utils.md)
- [接口调用规范](./api-request.md)
