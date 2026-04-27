<template>
	<view class="cu-radio" :class="'mode-' + mode" @click.stop="handleRadio">
		<view class="radio-btn" :class="[
			{
				'active': checked
			},
			checked ? 'cuIcon-roundcheckfill' : 'cuIcon-round'
		]" :style="{
				color: checked ? activeColor : inactiveColor,
				fontSize: size
			}"></view>
		<view class="cu-radio-body" v-if="slots.default">
			<slot></slot>
		</view>
	</view>
</template>

<script setup>
/**
 * radio 单选框
 * @description 单选框组件，支持不同的显示模式和数据类型
 * @property {Boolean|Number} modelValue - 绑定的值
 * @property {String} mode - 显示模式，可选值：df/1
 * @property {String} isDataType - 数据类型，可选值：boo/num
 * @property {String} activeColor - 选中状态的颜色
 * @property {String} inactiveColor - 未选中状态的颜色
 * @event {Function} update:modelValue - 值更新时触发
 * @event {Function} change - 值变化时触发
 */

import { ref, watch } from 'vue';

// 定义 props
const props = defineProps({
	modelValue: {
		type: [Boolean, Number],
		default: false
	},
	mode: {
		type: String,
		default: 'df'
	},
	isDataType: {
		type: String,
		default: 'boo'
	},
	// 新增：选中状态的颜色
	activeColor: {
		type: String,
		default: ''  // 默认使用CSS变量
	},
	// 新增：未选中状态的颜色
	inactiveColor: {
		type: String,
		default: '#999'
	},
	size: {
		type: String,
		default: '38rpx'
	}
});

// 定义 emits
const emits = defineEmits(['update:modelValue', 'change']);

const slots = defineSlots();

// 响应式数据
const checked = ref(false);

/**
 * @description 类型转换
 * @param {Boolean|Number} data - 需要转换的数据
 * @param {String} type - 转换类型，in-输入转换，out-输出转换
 */
function typeConversion(data, type = 'in') {
	if (props.isDataType === 'boo') {
		return data;
	} else {
		if (type === 'in') {
			return !!data;
		} else {
			return data ? 1 : 0;
		}
	}
}

/**
 * @description 设置选中状态
 * @param {Boolean} value - 选中状态
 */
function setChecked(value) {
	checked.value = value;
	emits('update:modelValue', typeConversion(checked.value, 'out'));
}

/**
 * @description 处理点击事件
 */
function handleRadio() {
	checked.value = !checked.value;
	emits('update:modelValue', typeConversion(checked.value, 'out'));
}

// 监听数据变化
watch(() => props.modelValue, (newVal) => {
	checked.value = typeConversion(newVal);
});

watch(checked, (newVal) => {
	emits('change', newVal);
});

// 初始化
checked.value = typeConversion(props.modelValue);

// 暴露方法给外部使用
defineExpose({
	setChecked
});
</script>

<style lang="scss">
.cu-radio {
	display: inline-flex;
	align-items: center;

	&.mode-1 {
		.radio-btn {
			background-color: white;
		}
	}

	.radio-btn {
		width: 36rpx;
		height: 36rpx;
		line-height: 36rpx;
		font-size: 38rpx;
		display: flex;
		color: #999;
		box-sizing: border-box;
		align-items: center;
		justify-content: center;
		// margin-right: 10rpx;
		border-radius: 50%;

		&.active {
			color: var(--df-color, $df-color);
		}
	}

	.cu-radio-body {
		padding-left: 10rpx;
	}
}
</style>