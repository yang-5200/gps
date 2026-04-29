<template>
  <view class="page-wrap">
    <!-- 顶部导航栏 -->
    <cu-nav-bar :isBack="true" title-text="个人资料" />

    <view class="page-content padding">
      <view class="profile-card padding-lr padding-bottom-xs bg-white">
        <!-- 头像 -->
        <view class="profile-item padding-tb flex justify-between align-center padding-top border-bottom"
          @tap="handleUpdateAvatar">
          <text class="item-label text-30">头像</text>
          <view class="item-right flex align-center">
            <image class="avatar box-size-w-35 box-size-h-35 round" src="/static/images/profile.png"
              mode="aspectFill" />
            <text class="cuIcon-right text-gray margin-left-xs"></text>
          </view>
        </view>

        <!-- 昵称 -->
        <view class="profile-item padding-tb flex justify-between align-center border-bottom"
          @tap="handleUpdateNickname">
          <text class="item-label text-30">昵称</text>
          <view class="item-right flex align-center">
            <text class="item-value text-30 text-gray">忍冬</text>
            <text class="cuIcon-right text-gray margin-left-xs"></text>
          </view>
        </view>

        <!-- 手机号 -->
        <view class="profile-item padding-tb flex justify-between align-center">
          <text class="item-label text-30">手机号</text>
          <view class="item-right flex align-center">
            <text class="item-value text-30 text-gray">16545823385</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app';

onLoad(() => {
  console.log('个人资料页面加载');
});

function handleUpdateAvatar() {
  console.log('点击更新头像');
  // TODO: 实现头像上传逻辑
}

function handleUpdateNickname() {
  console.log('点击更新昵称');
  // TODO: 实现修改昵称弹窗或跳转
}
</script>

<style lang="scss">
.page-wrap {
  min-height: 100vh;
  background-color: #f8f8f8;

  .page-content {
    padding-top: 30rpx;
  }

  .profile-card {
    border-radius: 32rpx;
    overflow: hidden;

    .profile-item {
      .item-label {
        color: #333333;
      }

      .item-value {
        color: #666666;
      }

      .avatar {
        background-color: #f0f0f0;
      }
    }
  }
}
</style>
