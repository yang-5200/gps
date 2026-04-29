<template>
  <view class="page-wrap">
    <cu-nav-bar title-text="播放声音" :isBack="true" />
    <view class="page-content padding">
      <text>播放声音功能页面</text>
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
