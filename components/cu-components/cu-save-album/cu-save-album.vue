<template>
  <cu-layer v-model="isShow" mode="center">
    <view class="cu-save-album">
      <!-- 图片预览区域 -->
      <view class="preview-section">
        <!-- 标题 -->
        <view class="title" :style="titleBoxStyle">
          {{ title }}
        </view>
        
        <!-- 图片预览 -->
        <view class="image-box">
          <image 
            class="preview-image" 
            :src="imageUrl" 
            mode="aspectFit"
            :style="imageBoxStyle"
          />
        </view>
      </view>
      
      <!-- 按钮区域 -->
      <view class="footer bg-white">
        <button 
          class="cancel-btn" 
          :style="cancelButtonBoxStyle"
          @click="handleCancel"
        >
          {{ cancelText }}
        </button>
        
        <button 
          class="save-btn" 
          :style="buttonBoxStyle"
          @click="toSave"
        >
          {{ confirmText }}
        </button>
      </view>
    </view>
  </cu-layer>
	<yk-authpup ref="authPupRef" type="top" @changeAuth="changeAuth(permissionFromType)" :permissionID="permissionID"></yk-authpup>
</template>

<script setup>
/**
 * 保存相册弹窗组件
 * @description 用于预览和保存图片到相册的弹窗组件
 * @property {String} imageUrl - 图片地址
 * @property {String} title - 弹窗标题
 * @property {String} confirmText - 确认按钮文字
 * @property {String} cancelText - 取消按钮文字
 * @property {Object} imageStyle - 图片样式
 * @property {Object} titleStyle - 标题样式
 * @property {Object} buttonStyle - 按钮样式
 * @property {Object} cancelButtonStyle - 取消按钮样式
 * @event {Function} success - 保存成功时触发
 * @event {Function} fail - 保存失败时触发
 */

import { ref, computed } from 'vue';
import { convertStyles } from '@/common/utils/styleHandleUtil.js';
import { DfColor } from '@/common/style/variables.js';


import { useAuth } from '@/hooks/useAuth.js';
const { authPupRef, permissionID,
	permissionFromType, openAuth } = useAuth();

// 定义props
const props = defineProps({
  // 图片地址
  imageUrl: {
    type: String,
    required: true
  },
  // 弹窗标题
  title: {
    type: String,
    default: '保存图片到相册'
  },
  // 确认按钮文字
  confirmText: {
    type: String,
    default: '保存'
  },
  // 取消按钮文字
  cancelText: {
    type: String,
    default: '取消'
  },
  // 图片样式
  imageStyle: {
    type: Object,
    default: () => ({})
  },
  // 标题样式
  titleStyle: {
    type: Object,
    default: () => ({})
  },
  // 按钮样式
  buttonStyle: {
    type: Object,
    default: () => ({})
  },
  // 取消按钮样式
  cancelButtonStyle: {
    type: Object,
    default: () => ({})
  }
});

// 定义emits
const emits = defineEmits(['success', 'fail']);

// 是否显示弹窗
const isShow = ref(false);

// 标题样式
const titleBoxStyle = computed(() => {
  return convertStyles({
    textAlign: 'center',
    fontSize: '32rpx',
    fontWeight: 'bold',
    padding: '30rpx',
    ...props.titleStyle
  });
});

// 图片容器样式
const imageBoxStyle = computed(() => {
  return convertStyles({
    width: '500rpx',
    height: '500rpx',
    ...props.imageStyle
  });
});

// 按钮样式
const buttonBoxStyle = computed(() => {
  return convertStyles({
    width: '400rpx',
    height: '80rpx',
    lineHeight: '80rpx',
    background: DfColor,
    color: '#fff',
    fontSize: '32rpx',
    borderRadius: '40rpx',
    margin: '30rpx auto',
    ...props.buttonStyle
  });
});

// 取消按钮样式
const cancelButtonBoxStyle = computed(() => {
  return convertStyles({
    width: '400rpx',
    height: '80rpx',
    lineHeight: '80rpx',
    background: '#F5F5F5',
    color: '#666',
    fontSize: '32rpx',
    borderRadius: '40rpx',
    margin: '0 auto 20rpx',
    ...props.cancelButtonStyle
  });
});

/**
 * @description 显示弹窗
 */
function show() {
  isShow.value = true;
}

/**
 * @description 隐藏弹窗
 */
function hide() {
  isShow.value = false;
}

/**
 * @description 处理保存图片
 */
async function handleSave() {
  try {
    // 检查权限
    // await checkPermission();
    
    // 保存图片
    await saveImage();
    
    // 保存成功
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    });
    
    // 关闭弹窗
    hide();
    
    // 触发成功事件
    emits('success');
    
  } catch (error) {
    console.error('保存失败:', error);
    uni.showToast({
      title: '保存失败',
      icon: 'none'
    });
    emits('fail', error);
  }
}

/**
 * @description 去保存图片
 */
function toSave(){
	openAuth('WRITE_EXTERNAL_STORAGE', 'album');
}


/**
 * @description 权限获取成功
 * @param {Object} e
 */
function changeAuth(e){
	console.log(e);
	handleSave();
}


/**
 * @description 检查相册权限
 */
function checkPermission() {
  return new Promise((resolve, reject) => {
    // // #ifdef MP
    // uni.authorize({
    //   scope: 'scope.writePhotosAlbum',
    //   success: resolve,
    //   fail: reject
    // });
    // // #endif
		openAuth('WRITE_EXTERNAL_STORAGE', 'album');
  });
}

/**
 * @description 保存图片到相册
 */
function saveImage() {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src: props.imageUrl,
      success: (image) => {
        uni.saveImageToPhotosAlbum({
          filePath: image.path,
          success: resolve,
          fail: reject
        });
      },
      fail: reject
    });
  });
}

/**
 * @description 处理取消
 */
function handleCancel() {
  hide();
}

// 暴露方法
defineExpose({
  show,
  hide
});
</script>

<style lang="scss">
.cu-save-album {
  width: 600rpx;
  border-radius: 20rpx;
  overflow: hidden;
  
  // 预览区域
  .preview-section {
    margin-bottom: 30rpx;
    
    .title {
      text-align: center;
      padding: 30rpx;
      background: #fff;
    }
    
    .image-box {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20rpx;
      min-height: 500rpx;
      
      .preview-image {
        display: block;
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
  
  // 按钮区域
  .footer {
    padding: 30rpx;
    border-radius: 20rpx;
    
    .cancel-btn,
    .save-btn {
      display: block;
      text-align: center;
      
      &::after {
        border: none;
      }
    }
  }
}
</style> 