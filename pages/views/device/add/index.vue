<template>
    <!-- 顶部导航栏 -->
    <cu-nav-bar title-text="添加设备" :background="navbarImmerse.navBar.backgroundColor" color="#404348"></cu-nav-bar>

    <view class="page-wrap">
        <view class="page-content padding-lg">
            <!-- 表单区域 -->
            <!-- 输入框 + 添加按钮（水平排列） -->
            <view class="input-with-btn flex align-center margin-bottom-lg">
                <view class="input-box flex-grow-1 flex align-center ">
                    <input class="text-xl flex-grow-1" v-model="formData.imei" placeholder="请输入设备序列号"
                        placeholder-class="text-xulie-black" maxlength="20" />
                </view>
                <button class="add-btn text-white text-xl" @click="submit">
                    添加
                </button>
            </view>

            <!-- 扫一扫添加 -->
            <view class="scan-box flex align-center " @click="handleScan">
                <text class="cuIcon-scan text-xxl margin-right-sm"></text>
                <text class="text-xl text-scan-black">扫一扫添加</text>
            </view>


        </view>
    </view>
</template>

<script setup>
import { reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { toast, loading, toPath } from '@/common/utils/util.js';
import { useNavbarImmerse } from '@/common/utils/useNavbarImmerse.js';

const { navbarImmerse } = useNavbarImmerse();

const formData = reactive({
    imei: '',
    deviceName: ''
});

onLoad((options) => {
    console.log('添加设备页面加载', options);
});

/**
 * @description 提交表单
 */
function submit() {
    if (!formData.imei.trim()) {
        toast('请输入设备序列号');
        return;
    }

    loading('查询中...');

    // 模拟查询设备是否存在（使用假数据）
    setTimeout(() => {
        uni.hideLoading();

        // 只要输入了内容就允许通过（实际项目中应该调用真实API验证IMEI）
        // 跳转到确认页面
        toPath(`/pages/views/device/confirm/index?imei=${formData.imei.trim()}`);
    }, 800);
}

/**
 * @description 扫一扫添加设备
 */
function handleScan() {
    uni.scanCode({
        success: (res) => {
            console.log('扫码结果：', res);
            formData.imei = res.result;
            // 扫码成功后自动提交
            submit();
        },
        fail: (err) => {
            console.log('扫码失败：', err);
            toast('扫码失败，请重试');
        }
    });
}
</script>


<style lang="scss">
.page-wrap {
    .page-content {
        .input-with-btn {
            background: rgba(255, 255, 255, 0.7);
            border-radius: 30rpx;
            border: 2rpx solid #FFFFFF;
            height: 112rpx;
            padding: 12rpx;
            padding-left: 30rpx;

            .input-box {
                background: transparent;
                border: none;
            }

            .add-btn {
                width: 172rpx;
                height: 88rpx;
                background-color: #5D4037;
                padding: 0;
                line-height: 88rpx;
                border-radius: 20rpx;
                margin: 0;

                &::after {
                    border: none;
                }
            }
        }

        .scan-box {
            background: rgba(255, 255, 255, 0.7);
            border-radius: 30rpx;
            border: 2rpx solid #FFFFFF;
            height: 112rpx;
            padding: 0 30rpx;
            margin-top: 20rpx;

            .cuIcon-scan {
                color: #5D4037;
            }
        }
    }
}
</style>
