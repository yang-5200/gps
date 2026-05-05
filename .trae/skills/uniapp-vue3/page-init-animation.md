---
title: 移动端页面初始化动画（淡入效果）
category: uniapp-vue3
tags: [animation, page, loading, opacity, fade-in]
created: 2026-04-26
---

# 移动端页面初始化动画（淡入效果）

## 问题/场景
在移动端页面（尤其是登录页、启动页）加载时，如果页面直接显示，用户可能会看到：
- 数据加载过程中的空白或闪烁
- 导航栏、内容的突兀出现
- App 更新检查时的页面抖动

通过**初始隐藏 + 数据就绪后淡入**的方式，可以提升用户体验。

## 核心要点

### 1. 实现原理
- 页面初始 `opacity: 0`（完全透明）
- 数据加载完成后，设置 `opacity: 1`（淡入显示）
- 配合 CSS `transition` 实现平滑过渡

### 2. 使用场景判断

| 建议使用 | 不建议使用 |
|----------|------------|
| 登录页（需要检查登录状态） | 普通列表页（直接加载数据即可） |
| 启动页（需要初始化配置） | 简单展示页（无初始化逻辑） |
| 需要等待 App 更新检查 | 数据缓存充足的页面 |
| 有复杂初始化逻辑的页面 | 静态页面 |

### 3. 代码实现

```vue
<template>
  <view 
    class="page-wrap"
    :style="{ opacity: opacityPage }"
  >
    <!-- 页面内容 -->
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onReady } from '@dcloudio/uni-app';
import { loading } from '@/common/utils/util.js';

// 页面透明度控制
const opacityPage = ref(0);

/**
 * 展示页面（淡入效果）
 */
function handleShowPage() {
  opacityPage.value = 1;
  uni.hideLoading();
}

/**
 * 页面初始化
 */
async function pageInit() {
  try {
    loading('加载中...');
    
    // 1. 检查 App 更新（如需要）
    const upAppRes = await cuAppUpdateRef.value.testUpdate();
    if (upAppRes.code === 1) {
      // App 正在更新，显示页面让用户看到更新提示
      return handleShowPage();
    }
    
    // 2. 检查登录状态
    const userInfoRes = await userStore.getUserInfo();
    if (userInfoRes.success) {
      // 已登录，跳转到首页
      redirectToHome();
      return;
    }
    
    // 3. 其他初始化逻辑...
    
    // 所有初始化完成，显示页面
    handleShowPage();
  } catch (error) {
    console.log(error);
    // 出错也要显示页面，避免卡死
    handleShowPage();
  }
}

onReady(() => {
  pageInit();
});
</script>

<style>
/* 可选：添加过渡动画让淡入更平滑 */
.page-wrap {
  transition: opacity 0.3s ease;
}
</style>
```

### 4. 关键流程

```
页面加载
    │
    ▼
opacity = 0 (隐藏)
    │
    ▼
显示 loading
    │
    ▼
执行初始化逻辑
    │
    ├── App 更新检查
    ├── 登录状态检查
    └── 其他数据加载
    │
    ▼
初始化完成
    │
    ▼
opacity = 1 (淡入显示)
    │
    ▼
隐藏 loading
```

## 注意事项/踩坑记录

1. **必须在 onReady 中执行**：确保 DOM 已就绪
2. **错误处理**：try-catch 中也要调用 `handleShowPage`，避免页面一直隐藏
3. **跳转场景**：如果初始化后需要跳转其他页面，也要先显示页面再跳转，避免白屏
4. **过渡动画**：建议添加 CSS `transition` 让效果更平滑
5. **loading 时机**：在 `pageInit` 开始显示，在 `handleShowPage` 中隐藏

## 变体方案

### 方案 A：简单版（无 loading）
```javascript
const opacityPage = ref(0);

onReady(async () => {
  await initData();
  opacityPage.value = 1;
});
```

### 方案 B：带骨架屏
```vue
<template>
  <view :style="{ opacity: opacityPage }">
    <!-- 真实内容 -->
  </view>
  <view v-if="!opacityPage">
    <!-- 骨架屏 -->
  </view>
</template>
```

## 相关 skill

- [页面生成规范](./page-generation.md)
- [cu-components 自定义组件使用规范](./cu-components.md)
