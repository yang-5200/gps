<template>
  <view 
    class="gps-panel" 
    :class="{ 'is-expand': isExpand }"
    :style="[panelStyle]"
  >
    <!-- 面板头部/拉手 -->
    <view class="panel-header" @tap="toggleExpand">
      <view class="handle-bar"></view>
      <slot name="header">
        <view class="default-header">
          <text class="title">{{ title }}</text>
          <text class="u-icon" :class="isExpand ? 'cuIcon-down' : 'cuIcon-up'"></text>
        </view>
      </slot>
    </view>

    <!-- 面板内容区 -->
    <scroll-view scroll-y class="panel-content">
      <slot></slot>
    </scroll-view>
  </view>
</template>

<script setup>
/**
 * gps-panel 底部浮窗面板组件
 * 
 * @description 常用于地图页面底部的信息展示，支持展开（上弹）和收起（下沉）
 * @property {Boolean} modelValue 是否展开状态 (v-model)
 * @property {String} title 默认头部的标题
 * @property {String} height 展开后的高度 (默认 60vh)
 * @property {String} minHeight 收起后的高度 (默认 120rpx)
 * 
 * @event {Function} update:modelValue 状态改变时触发
 */
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '详情信息'
  },
  height: {
    type: String,
    default: '60vh'
  },
  minHeight: {
    type: String,
    default: '120rpx'
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const isExpand = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const panelStyle = computed(() => {
  return {
    height: isExpand.value ? props.height : props.minHeight
  };
});

const toggleExpand = () => {
  isExpand.value = !isExpand.value;
  emit('change', isExpand.value);
};

// 暴露切换方法
defineExpose({
  toggle: toggleExpand,
  expand: () => (isExpand.value = true),
  collapse: () => (isExpand.value = false)
});
</script>

<style lang="scss" scoped>
.gps-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-radius: 30rpx 30rpx 0 0;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
  transition: height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .panel-header {
    padding: 20rpx 30rpx;
    display: flex;
    flex-direction: column;
    align-center: center;
    cursor: pointer;

    .handle-bar {
      width: 60rpx;
      height: 8rpx;
      background-color: #e0e0e0;
      border-radius: 4rpx;
      align-self: center;
      margin-bottom: 10rpx;
    }

    .default-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }

      .u-icon {
        font-size: 36rpx;
        color: #999;
      }
    }
  }

  .panel-content {
    flex: 1;
    padding: 0 30rpx 30rpx;
    box-sizing: border-box;
  }
}
</style>
