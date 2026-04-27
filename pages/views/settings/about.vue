<template>
    <!-- 顶部导航栏 -->
    <cu-nav-bar title-text="关于我们" :background="navbarImmerse.navBar.backgroundColor"></cu-nav-bar>

    <view class="page-wrap">
        <view class="page-content padding-lg">
            <!-- Logo区域 -->
            <view class="logo-section flex-column align-center margin-top-xl margin-bottom-xl">
                <!-- Logo占位 -->
                <!-- <image class="logo box-size-lg-50 radius round margin-bottom" src="/static/logo.png" mode="aspectFit"></image> -->
                <view
                    class="logo-placeholder box-size-lg-50 radius round margin-bottom flex align-center justify-center">
                    <text class="cuIcon-locationfill text-white text-xxxl"></text>
                </view>
                <text class="text-xxl text-bold text-df-color margin-bottom-xs">智购互联</text>
                <text class="text-sm text-gray">版本 1.0.0</text>
            </view>

            <!-- 信息列表 -->
            <view class="info-section bg-white radius-df">
                <view class="info-item flex-row-between padding border-bottom">
                    <text class="text-df text-gray">官方网站</text>
                    <text class="text-df">www.zhigou.com</text>
                </view>
                <view class="info-item flex-row-between padding border-bottom">
                    <text class="text-df text-gray">客服电话</text>
                    <text class="text-df">400-888-8888</text>
                </view>
                <view class="info-item flex-row-between padding">
                    <text class="text-df text-gray">公司地址</text>
                    <text class="text-df">北京市朝阳区xxx大厦</text>
                </view>
            </view>

            <!-- 版权信息 -->
            <view class="copyright margin-top-xl text-center">
                <text class="text-xs text-gray">© 2024 智购互联 版权所有</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app';
import { useNavbarImmerse } from '@/common/utils/useNavbarImmerse.js';

const { navbarImmerse } = useNavbarImmerse();

onLoad((options) => {
    console.log('关于我们页面加载', options);
});
</script>

<style lang="scss">
.page-wrap {
    .page-content {
        .logo-section {
            .logo-placeholder {
                background-color: #5D4037;
            }
        }

        .info-section {
            .info-item {
                &:active {
                    background-color: #f8f8f8;
                }
            }
        }
    }
}
</style>
