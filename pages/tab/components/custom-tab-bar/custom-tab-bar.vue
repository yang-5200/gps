<template>
    <view class="tab-bar" :style="tabBarStyle">
        <view class="tab-bar-content">
            <view class="tab-bar-item" v-for="(item, index) in tabList" :key="index" @tap="onItemClick(item)">
                <image class="tab-icon" :src="currentName === item.name ? item.selectedIconPath : item.iconPath" mode="aspectFill" />
                <text class="tab-text" :style="{ color: currentName === item.name ? activeColor : inactiveColor }">{{ item.text }}</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { toPath } from '@/common/utils/util.js'

const props = defineProps({
    currentName: {
        type: String,
        default: ''
    }
})

// 主题色
const activeColor = '#4E1200'
const inactiveColor = '#868686'
const tabBarOffsetPx = ref(0)

const tabBarStyle = computed(() => ({
    '--tabbar-bottom-offset': `${tabBarOffsetPx.value}px`
}))

// Tab 配置列表
const tabList = reactive([
    {
        pagePath: '/pages/tab/device/index',
        iconPath: '/static/images/tabbar/facility.png',
        selectedIconPath: '/static/images/tabbar/facility-selected.png',
        text: '设备',
        name: 'device'
    },
    {
        pagePath: '/pages/tab/map/index',
        iconPath: '/static/images/tabbar/map.png',
        selectedIconPath: '/static/images/tabbar/map-selected.png',
        text: '地图',
        name: 'map'
    },
    {
        pagePath: '/pages/tab/mine/index',
        iconPath: '/static/images/tabbar/mine.png',
        selectedIconPath: '/static/images/tabbar/mine-selected.png',
        text: '我的',
        name: 'mine'
    }
])

/**
 * @description Tab 点击事件
 * @param {Object} item - Tab 项配置
 */
function onItemClick(item) {
    toPath({
        path: item.pagePath,
        type: 'switchTab'
    })
}

function updateTabBarOffset() {
    const systemInfo = uni.getSystemInfoSync()
    const safeAreaBottom = systemInfo.safeAreaInsets?.bottom
        ?? (systemInfo.screenHeight && systemInfo.safeArea
            ? Math.max(0, systemInfo.screenHeight - systemInfo.safeArea.bottom)
            : 0)
    const visualGapPx = uni.upx2px(44)
    tabBarOffsetPx.value = Math.max(0, safeAreaBottom) + visualGapPx
}

// 立即执行以防止初始渲染时偏移为 0 导致从底部弹出的视觉闪烁
updateTabBarOffset()

onMounted(() => {
    // onMounted 里的调用可以保留或者删除，这里因为已经在 setup 中执行了，可以不需要再调用
    // 或者仅为了保险起见重新计算
})
</script>

<style lang="scss">
.tab-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    pointer-events: none;

    .tab-bar-content {
        pointer-events: auto;
        margin-left: 30rpx;
        margin-right: 30rpx;
        margin-bottom: var(--tabbar-bottom-offset, 0px);
        height: 132rpx;
        border-radius: 180rpx;
        border: 2rpx solid #FFFFFF;
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: space-around;
        box-sizing: border-box;
        padding-top: 10rpx;
    }

    .tab-bar-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .tab-text {
        font-size: 22rpx;
        line-height: 1.2;
    }
}

.tab-icon {
    width: 48rpx;
    height: 48rpx;
    margin-top: 8rpx;
}
</style>
