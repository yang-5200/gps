<template>
  <view class="page-wrap">
    <!-- 顶部导航栏 -->
   <cu-nav-bar :isBack="false" alignMode="left"  title-text="智购互联" color="#4E1200"
      :background="navbarImmerse.navBar.backgroundColor">
      <template #left>
        <view class="flex align-center  margin-left margin-right-sm">
          <image style="width: 52rpx; height: 52rpx;" src="/static/images/logo/logo.png" mode="aspectFit"></image>
          
        </view>
      </template>
    </cu-nav-bar>
		
		
	
		

    <view class="page-content">
      <!-- 用户信息区域 -->
      <view class="user-info-section">
        <image class="avatar" src="/static/images/profile.png" mode="aspectFill" />
        <text class="nickname">名字</text>
        <text class="phone">16585785487</text>
      </view>

      <!-- 功能菜单 -->
      <view class="menu-card bg-white padding">
        <view class="menu-item flex justify-between align-center padding-tb-25" v-for="item in menuList" :key="item.id"
          @tap="handleItemClick(item)">
          <view class="menu-item-left  flex align-center">
            <view class="box-size-w-18 flex align-center  margin-right-xs">
              <image class="menu-icon box-size-w-13 box-size-h-14" :src="item.iconPath" mode="aspectFill" />
            </view>
            <text class="menu-text text-30">{{ item.name }}</text>
          </view>
          <text class="cuIcon-right menu-arrow"></text>
        </view>
      </view>
    </view>

    <!-- 底部导航栏 -->
    <cu-popup ref="logoutPopupRef" mode="modal"></cu-popup>
    <CustomTabBar current-name="mine" />
  </view>
</template>

<script setup>
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { toPath } from '@/common/utils/util.js';
import { useNavbarImmerse } from '@/common/utils/useNavbarImmerse.js';
import { useTabBar } from '../components/useTabBar.js';
import CustomTabBar from '../components/custom-tab-bar/custom-tab-bar.vue';

// 隐藏原生 TabBar
useTabBar();

const { navbarImmerse } = useNavbarImmerse();
const logoutPopupRef = ref(null);

onLoad((options) => {
  console.log('我的页面加载', options);
});

// ─── 菜单点击处理函数 ───

function goProfile() {
  toPath({ path: '/pages/views/profile/index' });
}

function goAbout() {
  toPath({ path: '/pages/views/settings/about/index' });
}

function goLogout() {
  logoutPopupRef.value.show({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        console.log('用户点击确定');
      }
    }
  });
}

// ─── 菜单数据 ───

const menuList = computed(() =>
  [
    {
      name: '个人资料',
      id: '1',
      iconPath: '/static/images/personal-details.png',
      handleClick: goProfile,
    },
    {
      name: '关于我们',
      id: '2',
      iconPath: '/static/images/about.png',
      handleClick: goAbout,
    },
    {
      name: '退出登录',
      id: '3',
      iconPath: '/static/images/exit.png',
      handleClick: goLogout,
    },
  ].filter((item) => {
    return !item.isShow || item.isShow();
  })
);

// ─── 菜单项点击 ───

function handleItemClick(item) {
  if (item.handleClick) {
    item.handleClick(item);
  }
}
</script>

<style lang="scss">
	.padding-tb-25{
		padding-top: 25rpx;
		padding-bottom: 25rpx;
	}
	
	
.page-wrap {
  .page-content {
    padding: 0 30rpx;
    padding-bottom: calc(176rpx + env(safe-area-inset-bottom));
  }

  .user-info-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40rpx;
    padding-bottom: 60rpx;

    .avatar {
      width: 156rpx;
      height: 156rpx;
      border-radius: 50%;
      background-color: #f0f0f0;
    }

    .nickname {
      margin-top: 24rpx;
      font-size: 36rpx;
      font-weight: 500;
      color: #333333;
    }

    .phone {
      margin-top: 12rpx;
      font-size: 28rpx;
      color: #666666;
    }
  }

  .menu-card {
    background: #ffffff;
    border-radius: 30rpx;

    .menu-item {
      &:last-child {
        border-bottom: none;
      }

      .menu-text {
        color: #0F172A;
        line-height: 1;
      }

      .menu-arrow {
        font-size: 30rpx;
        color: #999999;
      }
    }
  }
}
</style>
