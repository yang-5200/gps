<template>
  <view class="page-wrap">
    <cu-nav-bar title-text="开机关机" :isBack="true" />
    <view class="page-content padding">
      <text>远程开关机控制页面</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const deviceId = ref('');

onLoad((options) => {
  deviceId.value = options.id;
});
</script>
