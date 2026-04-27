<template>
  <!-- 顶部导航栏 -->
  <cu-nav-bar :isBack="false" title-text="我的" :background="navbarImmerse.navBar.backgroundColor"></cu-nav-bar>

  <view class="page-wrap">
    <view class="page-content">


      <!-- 功能菜单 -->
      
    </view>

    <!-- 底部导航栏 -->
    <CustomTabBar current-name="mine" />
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app';
import { toPath } from '@/common/utils/util.js';
import { useNavbarImmerse } from '@/common/utils/useNavbarImmerse.js';
import { useTabBar } from '../components/useTabBar.js';
import CustomTabBar from '../components/CustomTabBar.vue';

// 隐藏原生 TabBar
useTabBar();

const { navbarImmerse } = useNavbarImmerse();

onLoad((options) => {
  console.log('我的页面加载', options);
});
</script>

<style lang="scss">
.page-wrap {
  .page-content {
		
	}
}
</style>
