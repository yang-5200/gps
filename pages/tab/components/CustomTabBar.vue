<template>
    <view class="tab-bar">
        <up-tabbar :value="currentName" inactiveColor="#868686" :activeColor="activeColor" :border="false" z-index="99">
            <up-tabbar-item v-for="(item, index) in tabList" :key="index" :name="item.name" :text="item.text"
                @click="onItemClick(item)">
                <!-- 选中图标 -->
                <template #active-icon>
                    <image class="tab-icon" :src="item.selectedIconPath" mode="aspectFill" />
                </template>
                <!-- 未选中图标 -->
                <template #inactive-icon>
                    <image class="tab-icon" :src="item.iconPath" mode="aspectFill" />
                </template>
            </up-tabbar-item>
        </up-tabbar>
    </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { toPath } from '@/common/utils/util.js'

const props = defineProps({
    currentName: {
        type: String,
        default: ''
    }
})

// 主题色
const activeColor = ref('#4E1200')

// Tab 配置列表
const tabList = reactive([
    {
        pagePath: '/pages/tab/device/index',
        iconPath: '/static/images/tabbar/facility.png',
        selectedIconPath: '/static/images/tabbar/flacility-selected.png',
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
</script>

<style lang="scss">
.tab-bar {
    ::v-deep .u-tabbar {
        flex-grow: 0;

        .u-tabbar__content {
            overflow: hidden;
            background: rgba(255, 255, 255, 0.7) !important;
            border-radius: 180rpx !important;
            border: 2rpx solid #FFFFFF !important;
            backdrop-filter: blur(10px);
            
            // 使用 left 和 right 代替固定 width，实现响应式
            left: 30rpx !important;
            right: 30rpx !important;
            width: auto !important; // 确保宽度由 left/right 决定
            
            height: 132rpx !important;
            bottom: 44rpx !important;
            box-shadow: none !important;

            padding-top: 10rpx; // 如果想让内容整体下移，可以增加这个值
        }

        .u-tabbar-item__text {
            font-size: 22rpx;
        }
    }
}

.tab-icon {
    width: 48rpx;
    height: 48rpx;
    margin-top: 8rpx;
}
</style>
