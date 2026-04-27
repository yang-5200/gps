---
title: UniApp Vue3 自定义 TabBar 实现与定制规范
category: uniapp-vue3
tags: [tabbar, custom, navigation]
created: 2026-04-26
---

# UniApp Vue3 自定义 TabBar 实现与定制规范

## 问题/场景

UniApp 原生的 TabBar 样式固定，难以满足个性化设计需求，如：
- 需要中间凸起的大按钮（发布按钮）
- 自定义图标大小、颜色、动画效果
- 添加消息红点/数字角标
- 完全自定义布局（非等分排列）
- 动态控制 Tab 显示/隐藏

## 核心要点

### 1. 实现原理

```
配置原生 TabBar（占位） → 隐藏原生 TabBar → 创建自定义组件 → 在每个 Tab 页面引入
```

**为什么需要这样？**
- `pages.json` 中必须配置原生 `tabBar`，否则无法使用 `switchTab` 跳转
- 原生 TabBar 通过 `uni.hideTabBar()` 隐藏
- 自定义 TabBar 组件覆盖在页面底部

### 2. 文件结构

```
pages/tabs/components/tab-bar/
├── tab-bar.vue      # 导航栏 UI 组件（可定制化）
└── useTabBar.js     # 隐藏原生 TabBar 的 Hook
```

### 3. 核心代码

#### useTabBar.js - 隐藏原生导航栏

```javascript
import { onLoad } from '@dcloudio/uni-app'

/**
 * @description 隐藏原生 TabBar 的 Hook
 * 每个 Tab 页面都必须在 script setup 中调用
 */
export function useTabBar() {
  onLoad(() => {
    uni.hideTabBar()
  })
}
```

#### tab-bar.vue - 基础版自定义导航栏

```vue
<template>
  <view class="tab-bar">
    <up-tabbar
      :value="currentName"
      inactiveColor="#999999"
      :activeColor="activeColor"
      :border="false"
      z-index="99"
    >
      <up-tabbar-item
        v-for="(item, index) in tabList"
        :name="item.name"
        :text="item.text"
        @click="onItemClick(item, index)"
        :key="index"
      >
        <!-- 选中图标 -->
        <template #active-icon>
          <image
            class="tab-icon"
            :src="item.selectedIconPath"
            mode="aspectFill"
          />
        </template>
        <!-- 未选中图标 -->
        <template #inactive-icon>
          <image
            class="tab-icon"
            :src="item.iconPath"
            mode="aspectFill"
          />
        </template>
      </up-tabbar-item>
    </up-tabbar>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { toPath } from '@/common/utils/util.js';
import { useTabBar } from './useTabBar.js';

// 隐藏原生 TabBar（必须）
useTabBar();

const props = defineProps({
  currentName: {
    type: String,
    default: '',
  },
});

// 主题色
const activeColor = ref('#007AFF');

// Tab 配置列表
const tabList = reactive([
  {
    pagePath: '/pages/tabs/home/index',
    iconPath: '/static/tab/home.png',
    selectedIconPath: '/static/tab/home-active.png',
    text: '首页',
    name: 'home',
  },
  {
    pagePath: '/pages/tabs/message/index',
    iconPath: '/static/tab/message.png',
    selectedIconPath: '/static/tab/message-active.png',
    text: '消息',
    name: 'message',
  },
  {
    pagePath: '/pages/tabs/order/index',
    iconPath: '/static/tab/order.png',
    selectedIconPath: '/static/tab/order-active.png',
    text: '订单',
    name: 'order',
  },
  {
    pagePath: '/pages/tabs/tool/index',
    iconPath: '/static/tab/tool.png',
    selectedIconPath: '/static/tab/tool-active.png',
    text: '工具',
    name: 'tool',
  },
  {
    pagePath: '/pages/tabs/mine/index',
    iconPath: '/static/tab/mine.png',
    selectedIconPath: '/static/tab/mine-active.png',
    text: '我的',
    name: 'mine',
  },
]);

/**
 * @description Tab 点击事件
 */
const onItemClick = (item, index) => {
  toPath({
    path: item.pagePath,
    type: 'switchTab',
  });
};
</script>

<style lang="scss">
.tab-bar {
  ::v-deep .u-tabbar {
    flex-grow: 0;
    .u-tabbar__content {
      overflow: hidden;
      box-shadow: 0rpx -2rpx 2rpx 0rpx rgba(102, 102, 102, 0.1);
      border-radius: 0;
    }
    .u-tabbar-item__text {
      font-size: 20rpx;
    }
  }
}

.tab-icon {
  width: 50rpx;
  height: 50rpx;
  margin-top: 8rpx;
}
</style>
```

### 4. 进阶定制：现代悬浮毛玻璃风格

如果需要实现当前项目中的“悬浮胶囊”样式，可以使用以下 CSS 定制：

```scss
.tab-bar {
  ::v-deep .u-tabbar {
    flex-grow: 0;
    .u-tabbar__content {
      overflow: hidden;
      // 1. 半透明背景 + 毛玻璃效果
      background: rgba(255, 255, 255, 0.7) !important;
      backdrop-filter: blur(10px); 
      
      // 2. 悬浮胶囊形状
      border-radius: 180rpx !important;
      border: 2rpx solid #FFFFFF !important;
      
      // 3. 响应式宽度布局
      left: 30rpx !important;
      right: 30rpx !important;
      width: auto !important;
      
      // 4. 定位与高度
      height: 132rpx !important;
      bottom: 44rpx !important;
      box-shadow: none !important;
    }
    .u-tabbar-item__text {
      font-size: 22rpx;
    }
  }
}
```

**关键点总结**：
- **响应式**：通过同时设置 `left` 和 `right` 而不设置 `width`，实现导航栏在不同屏幕下的自适应。
- **质感**：`rgba` 背景配合 `backdrop-filter` 能产生高级的毛玻璃视觉效果。
- **穿透**：必须使用 `::v-deep` 穿透 `uview-plus` 的内部类名 `.u-tabbar__content`。

### 5. 页面使用方式

每个 Tab 页面都需要：
1. 引入 `tab-bar` 组件
2. 传入 `current-name` 标识当前页

```vue
<template>
  <view class="page-wrap page-df-bg">
    <!-- 顶部导航栏 -->
    <cu-nav-bar title-text="页面标题" :isBack="false"></cu-nav-bar>

    <!-- 页面内容 -->
    <view class="page-content">
      <!-- 内容区域 -->
    </view>

    <!-- 底部导航栏 -->
    <tab-bar current-name="home"></tab-bar>
  </view>
</template>

<script setup>
import tabBar from '../components/tab-bar/tab-bar.vue';
// ... 其他逻辑
</script>
```

### 5. pages.json 配置

必须保留原生 `tabBar` 配置，否则 `switchTab` 无法使用：

```json
{
  "tabBar": {
    "backgroundColor": "#FFFFFF",
    "selectedColor": "#007AFF",
    "borderStyle": "black",
    "color": "#999999",
    "list": [
      {
        "pagePath": "pages/tabs/home/index",
        "text": "首页",
        "iconPath": "/static/tab/home.png",
        "selectedIconPath": "/static/tab/home-active.png"
      },
      {
        "pagePath": "pages/tabs/message/index",
        "text": "消息",
        "iconPath": "/static/tab/message.png",
        "selectedIconPath": "/static/tab/message-active.png"
      },
      {
        "pagePath": "pages/tabs/order/index",
        "text": "订单",
        "iconPath": "/static/tab/order.png",
        "selectedIconPath": "/static/tab/order-active.png"
      },
      {
        "pagePath": "pages/tabs/tool/index",
        "text": "工具",
        "iconPath": "/static/tab/tool.png",
        "selectedIconPath": "/static/tab/tool-active.png"
      },
      {
        "pagePath": "pages/tabs/mine/index",
        "text": "我的",
        "iconPath": "/static/tab/mine.png",
        "selectedIconPath": "/static/tab/mine-active.png"
      }
    ]
  }
}
```

## 定制化方案

### 方案一：中间凸起按钮（发布按钮）

在 `tabList` 中间插入一个特殊的"发布"项，通过样式控制凸起效果：

```vue
<template>
  <view class="tab-bar">
    <up-tabbar :value="currentName" :activeColor="activeColor" :border="false">
      <!-- 左侧 Tab -->
      <up-tabbar-item
        v-for="(item, index) in leftTabs"
        :key="index"
        :name="item.name"
        :text="item.text"
        @click="onItemClick(item)"
      >
        <template #active-icon>
          <image class="tab-icon" :src="item.selectedIconPath" />
        </template>
        <template #inactive-icon>
          <image class="tab-icon" :src="item.iconPath" />
        </template>
      </up-tabbar-item>

      <!-- 中间凸起按钮 -->
      <view class="center-btn" @click="onCenterClick">
        <view class="center-btn-inner">
          <image class="center-icon" src="/static/tab/publish.png" />
        </view>
        <text class="center-text">发布</text>
      </view>

      <!-- 右侧 Tab -->
      <up-tabbar-item
        v-for="(item, index) in rightTabs"
        :key="index"
        :name="item.name"
        :text="item.text"
        @click="onItemClick(item)"
      >
        <template #active-icon>
          <image class="tab-icon" :src="item.selectedIconPath" />
        </template>
        <template #inactive-icon>
          <image class="tab-icon" :src="item.iconPath" />
        </template>
      </up-tabbar-item>
    </up-tabbar>
  </view>
</template>

<script setup>
// ... 省略基础代码

// 拆分左右两侧 Tab
const leftTabs = computed(() => tabList.filter((_, i) => i < 2));
const rightTabs = computed(() => tabList.filter((_, i) => i >= 2));

// 中间按钮点击
const onCenterClick = () => {
  toPath('/pages/publish/index');
};
</script>

<style lang="scss">
.center-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  top: -30rpx;

  .center-btn-inner {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #007AFF, #00C6FF);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.4);
  }

  .center-icon {
    width: 48rpx;
    height: 48rpx;
  }

  .center-text {
    font-size: 20rpx;
    color: #007AFF;
    margin-top: 4rpx;
  }
}
</style>
```

### 方案二：消息红点/数字角标

通过 `badge` 属性或自定义插槽实现：

```vue
<template>
  <up-tabbar-item
    v-for="(item, index) in tabList"
    :key="index"
    :name="item.name"
    :text="item.text"
    :badge="item.badge > 0 ? item.badge : null"
    @click="onItemClick(item)"
  >
    <!-- 或者自定义红点 -->
    <template #active-icon>
      <view class="icon-wrap">
        <image class="tab-icon" :src="item.selectedIconPath" />
        <view v-if="item.hasBadge" class="dot"></view>
      </view>
    </template>
  </up-tabbar-item>
</template>

<script setup>
// 动态控制红点
const tabList = reactive([
  {
    pagePath: '/pages/tabs/message/index',
    iconPath: '/static/tab/message.png',
    selectedIconPath: '/static/tab/message-active.png',
    text: '消息',
    name: 'message',
    badge: 5,        // 数字角标
    hasBadge: true,  // 红点标记
  },
  // ...
]);
</script>

<style lang="scss">
.icon-wrap {
  position: relative;

  .dot {
    position: absolute;
    top: 0;
    right: -4rpx;
    width: 16rpx;
    height: 16rpx;
    background: #FF4D4F;
    border-radius: 50%;
    border: 2rpx solid #fff;
  }
}
</style>
```

### 方案三：动态显示/隐藏 Tab

根据用户权限或业务逻辑动态控制：

```vue
<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user.js';

const userStore = useUserStore();

// 完整 Tab 列表
const allTabs = [
  { name: 'home', text: '首页', pagePath: '/pages/tabs/home/index', ... },
  { name: 'message', text: '消息', pagePath: '/pages/tabs/message/index', ... },
  { name: 'order', text: '订单', pagePath: '/pages/tabs/order/index', ... },
  { name: 'mine', text: '我的', pagePath: '/pages/tabs/mine/index', ... },
];

// 根据权限过滤
const tabList = computed(() => {
  // 普通用户不显示"消息"Tab
  if (userStore.userInfo.role === 'user') {
    return allTabs.filter(tab => tab.name !== 'message');
  }
  return allTabs;
});
</script>
```

## 注意事项

1. **必须使用 `switchTab`** - 跳转到 Tab 页面时，`toPath` 的 `type` 必须是 `'switchTab'`
2. **pages.json 必须配置** - 即使使用自定义 TabBar，也要保留原生 `tabBar` 配置
3. **每个 Tab 页面都要引入** - 不要忘记在页面中引入 `<tab-bar>` 组件
4. **图标尺寸建议** - 图标建议 48-56rpx，保持视觉统一
5. **安全区适配** - uview-plus 的 `up-tabbar` 已自动处理 iPhone 底部安全区

## 相关 Skill

- [pages.json 配置规范](./pages-json-config.md)
- [页面生成规范](./page-generation.md)
