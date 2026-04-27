<template>
	<view class="cu-image-preview">
		<view class="preview-list flex flex-wrap">
			<view class="preview" 
				v-for="(item, index) in imageList" 
				:key="index"
				@click="handlePreview(item, index)"
				:style="previewBoxStyle(index)"
			>
				<!-- <image ></image> -->
				
				<cu-img className="img" :src="handleFilePath(item)" :mode="previewMode" :styles="previewStyle"></cu-img>
				
				<!-- 删除按钮 -->
				<view class="cu-tag" v-if="showDelete" @click.stop="handleDelete(item, index)" :style="deleteButtonBoxStyle">
					<text class="cuIcon-close text-white"></text>
				</view>
				<!-- 自定义内容插槽 -->
				<slot :src="item" :index="index"></slot>
			</view>
		</view>
	</view>
</template>

<script setup>
/**
 * 图片预览组件
 * @description 支持自定义样式的图片预览组件
 * @property {Array|String} modelValue - 图片地址数组或单个图片地址
 * @property {Object} previewStyle - 预览容器样式配置
 * @property {String} previewMode - 图片显示模式
 * @property {Boolean} showDelete - 是否显示删除按钮
 * @property {Object} deleteButtonStyle - 删除按钮样式
 * @property {Object} columnStyles - 列样式配置，key为列索引(从1开始)，value为样式对象
 * @event {Function} update:modelValue - 更新图片列表
 * @event {Function} delete - 删除图片时触发
 * @event {Function} preview - 预览图片时触发
 * @slot default - 自定义内容插槽，提供 src 和 index 参数
 */

import { computed, ref, watch } from 'vue';
import { convertStyles } from '@/common/utils/styleHandleUtil.js';
import { DfColor } from '@/common/style/variables.js'
import {handleFilePath} from '@/common/utils/util.js';

// 默认预览容器样式
const defaultPreviewStyle = {
	width: '220rpx',
	height: '220rpx',
	margin: '0 16rpx 16rpx 0',
	borderRadius: '8rpx'
}

// 默认删除按钮样式
const defaultDeleteButtonStyle = {
	width: '50rpx',
	height: '50rpx',
	background: 'rgba(0, 0, 0, 0.5)',
	borderRadius: '0'
}

// 定义 props
const props = defineProps({
	// 图片数据
	modelValue: {
		type: [Array, String],
		default: () => []
	},
	// 预览容器样式配置
	previewStyle: {
		type: Object,
		default: () => ({})
	},
	// 图片显示模式
	previewMode: {
		type: String,
		default: 'aspectFill'
	},
	// 是否显示删除按钮
	showDelete: {
		type: Boolean,
		default: false
	},
	// 删除按钮样式
	deleteButtonStyle: {
		type: Object,
		default: () => ({})
	},
	// 列样式配置
	columnStyles: {
		type: Object,
		default: () => ({})
	}
});

// 定义 emits
const emits = defineEmits(['update:modelValue', 'delete', 'preview']);

// 图片列表
const imageList = ref([]);

// 获取指定索引的样式
function getColumnStyle(index) {
	// 列索引从1开始
	const columnIndex = index + 1;
	const columnStyle = props.columnStyles[columnIndex] || {};
	return columnStyle;
}

// 预览容器样式
const previewBoxStyle = computed(() => {
	return (index) => {
		const columnStyle = getColumnStyle(index % 3);
		return convertStyles({
			...defaultPreviewStyle,
			...props.previewStyle,
			...columnStyle
		});
	}
});

// 删除按钮样式
const deleteButtonBoxStyle = computed(() => {
	return convertStyles({
		...defaultDeleteButtonStyle,
		...props.deleteButtonStyle
	});
});

/**
 * @description 处理预览
 */
function handlePreview(url, index) {
	emits('preview', { url, index });
	uni.previewImage({
		urls: imageList.value,
		current: url
	});
}

/**
 * @description 处理删除
 */
function handleDelete(url, index) {
	uni.showModal({
		title: '提示',
		content: '确定要删除这张图片吗？',
		confirmColor: DfColor,
		success: (res) => {
			if (res.confirm) {
				const newList = [...imageList.value];
				newList.splice(index, 1);
				emits('update:modelValue', newList);
				emits('delete', { url, index });
			}
		}
	});
}

// 监听数据变化
watch(() => props.modelValue, (newVal) => {
	if (newVal) {
		imageList.value = Array.isArray(newVal) ? newVal : [newVal];
		imageList.value = imageList.value.map( i => handleFilePath(i))
	} else {
		imageList.value = [];
	}
}, { immediate: true });
</script>

<style lang="scss">
.cu-image-preview {
	.preview-list {
		.preview {
			position: relative;
			overflow: hidden;
			
			.img {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
			}
			
			.cu-tag {
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				top: 0;
				right: 0;
			}
		}
	}
}
</style> 
