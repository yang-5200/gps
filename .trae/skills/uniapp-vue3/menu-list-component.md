---
title: 数值排列菜单组件设计模式
category: uniapp-vue3
tags: [uniapp, vue3, component, menu, list]
created: 2026-04-26
---

# 数值排列菜单组件设计模式

## 问题/场景
在个人中心等页面，经常需要展示一组功能入口菜单（如"项目进度"、"支付记录"、"设置"等）。需要一种结构清晰、易于维护的菜单列表组件设计模式。

## 核心要点

### 1. 数据结构优先
将菜单配置抽离为数据数组，而非在模板中硬编码：

```javascript
const menuList = [
  { name: '项目进度', id: '1', iconPath: '/static/icon/my/mine-timeline.png' },
  { name: '支付记录', id: '2', iconPath: '/static/icon/my/mine-payment.png' },
  // ...
];
```

### 2. 函数与数据分离
每个菜单项的点击处理单独定义函数，通过 `handleClick` 关联：

```javascript
function goProjectProgress() {
  toPath({ path: '/pages/tabs/mine/projectProgress/index' });
}

const menuList = [
  {
    name: '项目进度',
    id: '1',
    iconPath: '/static/icon/my/mine-timeline.png',
    handleClick: goProjectProgress,
  },
];
```

### 3. 使用 computed 支持动态过滤
通过 `computed` 包裹菜单数据，支持基于状态的动态显示控制：

```javascript
const menuList = computed(() =>
  [
    { name: '项目进度', id: '1', handleClick: goProjectProgress },
    { name: '支付记录', id: '2', handleClick: goPaymentRecords },
    // 支持条件显示
    {
      name: '管理员入口',
      id: 'admin',
      handleClick: goAdmin,
      isShow: () => userStore.isAdmin,
    },
  ].filter((item) => !item.isShow || item.isShow())
);
```

### 4. 统一的点击处理入口
通过统一的 `handleItemClick` 函数处理所有菜单点击：

```javascript
function handleItemClick(item) {
  if (item.handleClick) {
    item.handleClick(item);
  }
}
```

## 示例代码

### 完整组件示例

```vue
<template>
  <view class="row-menu-list bg-white margin-top-sm radius-16">
    <view
      class="row-item"
      v-for="item in menuList"
      :key="item.id"
      @click="handleItemClick(item)"
    >
      <image class="item-icon box-size-20" :src="item.iconPath" mode="aspectFit" />
      <view class="item-body flex-grow-1">
        <view class="item-name">{{ item.name }}</view>
      </view>
      <view class="cuIcon-right"></view>
    </view>
  </view>
</template>

<script setup>
import { toPath } from '@/common/utils/util.js';
import { computed } from 'vue';
import { useUserStore } from '@/stores/user.js';

const userStore = useUserStore();

// ─── 菜单点击处理函数 ───
function goProjectProgress() {
  toPath({ path: '/pages/tabs/mine/projectProgress/index' });
}

function goPaymentRecords() {
  toPath({ path: '/pages/tabs/mine/paymentRecords/index' });
}

function goSettings() {
  toPath({ path: '/pages/tabs/mine/settings/index' });
}

// ─── 菜单数据 ───
const menuList = computed(() =>
  [
    {
      name: '项目进度',
      id: '1',
      iconPath: '/static/icon/my/mine-timeline.png',
      handleClick: goProjectProgress,
    },
    {
      name: '支付记录',
      id: '2',
      iconPath: '/static/icon/my/mine-payment.png',
      handleClick: goPaymentRecords,
    },
    {
      name: '设置',
      id: '3',
      iconPath: '/static/icon/my/mine-settings.png',
      handleClick: goSettings,
    },
  ].filter((item) => !item.isShow || item.isShow())
);

// ─── 菜单项点击 ───
function handleItemClick(item) {
  if (item.handleClick) {
    item.handleClick(item);
  }
}
</script>

<style scoped>
.row-menu-list {
  padding: 20rpx;
}

.row-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 110rpx;
  padding: 0 20rpx;
  background: #fff;
}

.item-body {
  flex: 1;
  padding: 0 20rpx;
}

.item-name {
  font-size: 32rpx;
  color: #1c1c1c;
}
</style>
```

## 注意事项

### 1. ID 命名建议
虽然可以使用数字字符串（`'1'`, `'2'`），但建议使用语义化 ID：

```javascript
// 不推荐
id: '1'
id: '2'

// 推荐
id: 'project-progress'
id: 'payment-records'
```

### 2. 避免过度拆分函数
如果菜单项只是简单的页面跳转，可以考虑简化：

```javascript
// 简化版本：直接在数据中配置 path
const menuList = computed(() => [
  { name: '项目进度', id: '1', iconPath: '...', path: '/pages/tabs/mine/projectProgress/index' },
  { name: '支付记录', id: '2', iconPath: '...', path: '/pages/tabs/mine/paymentRecords/index' },
]);

function handleItemClick(item) {
  if (item.path) {
    toPath({ path: item.path });
  }
}
```

### 3. 样式细节
- 菜单项之间建议添加底部分隔线（`:not(:last-child)`）
- 最后一个菜单项不需要底边框
- 图标和文字对齐使用 `align-items: center`

### 4. 清理未使用代码
及时移除未使用的导入和变量：

```javascript
// 如果未使用，应移除
import { toast } from '@/common/utils/util.js';  // 未使用
const userStore = useUserStore();  // 未使用
const cuPopupRef = ref(null);  // 未使用
```

## 相关 skill

- [cu-components 自定义组件使用规范](./cu-components.md)
- [工具函数使用规范](./utils.md)
- [原子化 CSS 使用规范](./atomic-css.md)
