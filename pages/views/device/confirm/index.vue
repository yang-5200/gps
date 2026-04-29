<template>
    <!-- 顶部导航栏 -->
    <cu-nav-bar title-text="确认添加" :background="navbarImmerse.navBar.backgroundColor" color="#404348"></cu-nav-bar>

    <view class="page-wrap">
        <view class="page-content padding-lg">
            <!-- 设备图片 -->
            <view class="device-image-wrap flex justify-center align-center margin-bottom-lg">
                <image class="device-image" src="/static/images/equip/equip.png" mode="aspectFit"></image>
            </view>

            <!-- 设备序列号 -->
            <view class="imei-wrap text-center margin-bottom-lg">
                <text class="text-xl text-gray">设备序列号：{{ imei }}</text>
            </view>

            <!-- 设备名称输入框 -->
            <view class="input-wrap margin-bottom-xl">
                <input class="device-name-input text-center text-xl" v-model="deviceName" placeholder="请输入设备名称"
                    placeholder-class="placeholder-style" maxlength="20" />
            </view>

            <!-- 确认添加按钮 -->
            <view class="confirm-btn-wrap">
                <button class="confirm-btn text-white text-xl" @click="handleConfirm">
                    确认添加
                </button>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { toast, loading, toPath } from '@/common/utils/util.js';
import { useNavbarImmerse } from '@/common/utils/useNavbarImmerse.js';

const { navbarImmerse } = useNavbarImmerse();

const imei = ref('');
const deviceName = ref('');

onLoad((options) => {
    console.log('确认添加页面加载', options);
    if (options.imei) {
        imei.value = options.imei;
    }
});

/**
 * @description 确认添加设备
 */
function handleConfirm() {
    if (!deviceName.value.trim()) {
        toast('请输入设备名称');
        return;
    }

    loading('添加中...');

    // 模拟添加设备（使用假数据）
    setTimeout(() => {
        // 获取已有设备列表
        let deviceList = uni.getStorageSync('deviceList') || [];

        // 添加新设备
        const newDevice = {
            id: Date.now(),
            imei: imei.value,
            name: deviceName.value.trim(),
            status: '在线',
            addTime: new Date().toLocaleString()
        };

        deviceList.push(newDevice);

        // 保存到本地存储
        uni.setStorageSync('deviceList', deviceList);

        uni.hideLoading();
        toast('添加成功', 'success');

        // 延迟后跳转到设备首页
        setTimeout(() => {
            uni.switchTab({
                url: '/pages/tab/device/index'
            });
        }, 1500);
    }, 1000);
}
</script>

<style lang="scss">
.page-wrap {
    .page-content {
        padding-top: 60rpx;

        .device-image-wrap {
            .device-image {
                width: 300rpx;
                height: 300rpx;
            }
        }

        .imei-wrap {
            .text-gray {
                color: #666;
            }
        }

        .input-wrap {
            .device-name-input {
                height: 112rpx;
                background: #FFFFFF;
                border-radius: 30rpx;
                padding: 0 30rpx;
            }

            .placeholder-style {
                color: #999;
            }
        }

        .confirm-btn-wrap {
            .confirm-btn {
                height: 100rpx;
                background-color: #5D4037;
                border-radius: 50rpx;
                line-height: 100rpx;
                margin: 0;
                padding: 0;

                &::after {
                    border: none;
                }
            }
        }
    }
}
</style>
