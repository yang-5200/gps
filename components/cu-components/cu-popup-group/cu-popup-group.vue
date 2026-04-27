<template>
  <view class="cu-popup-group">
    <pop-modal
      ref="modal"
      v-if="mode == 'modal'"
      @success="handleSuccess"
    ></pop-modal>
    <pop-modal2
      ref="modal2"
      v-if="mode == 'modal2'"
      @success="handleSuccess"
    ></pop-modal2>
    <pop-updateapp
      ref="updateapp"
      v-if="mode == 'updateapp'"
      @success="handleSuccess"
    ></pop-updateapp>
    <pop-modal-icon
      ref="modalIcon"
      v-if="mode == 'modalIcon'"
      @success="handleSuccess"
    ></pop-modal-icon>
    <pop-input-surname
      ref="inputSurname"
      v-if="mode == 'inputSurname'"
      @success="handleSuccess"
    ></pop-input-surname>
    <pop-video
      ref="video"
      v-if="mode == 'video'"
      @success="handleSuccess"
    ></pop-video>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { convertStyles } from '@/common/utils/styleHandleUtil.js';

// 组件
import popModal from './pop-modal/index.vue';
// 组件2
import popModal2 from './pop-modal2/index.vue';
// 增量更新
import popUpdateapp from './pop-updateapp/index.vue';
// 带图标的弹窗组件
import popModalIcon from './pop-modal-icon/index.vue';
// 输入名字的第一个字
import popInputSurname from './pop-input-surname/index.vue';
// 视频播放弹窗组件
import popVideo from './pop-video/index.vue';

// 定义 props
const props = defineProps({
  // 弹窗类型
  mode: {
    type: String,
    default: '',
  },
});

// 定义 emits
const emits = defineEmits(['success']);

// 组件引用
const modal = ref(null);
const modal2 = ref(null);
const updateapp = ref(null);
const modalIcon = ref(null);
const inputSurname = ref(null);
const video = ref(null);

// 响应式数据
const popData = reactive({});

/**
 * @description 处理子组件成功回调
 */
function handleSuccess(result) {
  //console.log('直接传递结果给父组件', result);
  // 直接传递结果给父组件
  emits('success', result);
}

/**
 * @description 展示组件
 */
function show() {
  Object.assign(popData, uni.popInfo || {});
  const data = popData.data;

  let refComponent;
  switch (props.mode) {
    case 'modalIcon':
      refComponent = modalIcon;
      break;
    case 'updateapp':
      refComponent = updateapp;
      break;
    case 'modal2':
      refComponent = modal2;
      break;
    case 'inputSurname':
      refComponent = inputSurname;
      break;
    case 'video':
      refComponent = video;
      break;
    default:
      refComponent = modal;
      break;
  }
  refComponent.value?.show({
    ...data,
  });
}

// 暴露方法给外部使用
defineExpose({
  show,
});
</script>

<style></style>
