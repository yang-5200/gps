---
title: UniApp Vue3 页面生成规范
category: uniapp-vue3
tags: [uniapp, vue3, page, template]
created: 2026-04-26
---

# UniApp Vue3 页面生成规范

## 问题/场景

在基于 uni-app + Vue3 的项目中生成新页面时，需要遵循统一的代码结构和规范，确保代码风格一致、可维护性高。

## 核心要点

### 1. 文件结构

每个页面必须包含：

```
pages/xxx/xxx/index.vue
```

### 2. 模板结构

```vue
<template>
  <view class="page-wrap">
    <!-- 顶部导航栏 -->
    <cu-nav-bar
      title-text="页面标题"
      :background="navbarImmerse.navBar.backgroundColor"
    ></cu-nav-bar>
    <view class="page-content">
      <!-- 页面内容 -->
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { http, urls } from "@/common/api/index.js";
import { toPath, back, toast, loading } from "@/common/utils/util.js";

// 沉浸式导航栏（TabBar页面需要）
// import { useNavbarImmerse } from '@/common/utils/useNavbarImmerse.js';
// const { navbarImmerse } = useNavbarImmerse();

// 页面数据
const pageData = reactive({
  // ...
});

onLoad((options) => {
  // 页面加载逻辑
});
</script>

<style lang="scss">
.page-wrap {
  .page-content {
    // 内容样式
  }
}
</style>
```

### 3. 导航栏规范

- **全局使用自定义导航栏**，`pages.json` 已配置 `"navigationStyle": "custom"`
- **普通页面**（非TabBar）：
  ```vue
  <cu-nav-bar title-text="页面标题"></cu-nav-bar>
  ```
- **TabBar页面/需要沉浸式**：
  ```vue
  <cu-nav-bar
    :isBack="false"
    title-text="工具"
    :background="navbarImmerse.navBar.backgroundColor"
  ></cu-nav-bar>
  ```
  并引入 `useNavbarImmerse`
- **无返回按钮**：添加 `:isBack="false"`

### 4. 样式书写规范

- **必须使用 `lang="scss"`**
- **最外层类名必须是 `.page-wrap`**
- **导航栏下方内容区域使用 `.page-content`**
- **优先使用原子化类**，减少自定义样式
- **优先使用 padding/margin 控制尺寸**，避免直接写死 width/height
- **响应式布局**，尽量不给单独项设置固定宽高

```scss
<style lang="scss">
.page-wrap {
  .page-content {
    .card-box {
      // 内部样式
    }
  }
}
</style>
```

## 示例代码

### 完整页面示例

```vue
<template>
  <cu-nav-bar
    :isBack="false"
    title-text="首页"
    :background="navbarImmerse.navBar.backgroundColor"
  ></cu-nav-bar>

  <view class="page-wrap">
    <view class="page-content">
      <!-- 公告栏 -->
      <cu-notice-bar :noticeList="noticeList" @click="handleNoticeClick" />

      <!-- 功能卡片 -->
      <view class="card-box margin-lg padding-lg bg-white radius-df">
        <view class="card-header flex-row-between margin-bottom-sm">
          <text class="text-lg text-bold">功能标题</text>
          <text class="text-sm text-gray" @click="toPath('/pages/more/index')"
            >更多</text
          >
        </view>
      </view>

      <!-- 空状态 -->
      <cu-not-data v-if="listData.length === 0" />

      <!-- 加载更多 -->
      <cu-load-more :status="loadStatus" />
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";
import { onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
import { http, urls } from "@/common/api/index.js";
import { toPath, back, toast, loading } from "@/common/utils/util.js";
import { useNavbarImmerse } from "@/common/utils/useNavbarImmerse.js";

const { navbarImmerse } = useNavbarImmerse();

const noticeList = ref([]);
const loadStatus = ref("more");

onLoad(() => {
  // 初始化逻辑
});
</script>

<style lang="scss">
.page-wrap {
  .page-content {
    padding-bottom: 40rpx;
  }
}
</style>
```

## 注意事项/踩坑记录

1. **导航栏背景色**：TabBar 页面需要使用 `navbarImmerse.navBar.backgroundColor` 实现沉浸式效果
2. **页面路径**：必须以 `pages/` 开头，以 `/index.vue` 结尾
3. **SCSS 必须**：所有样式块必须声明 `lang="scss"`
4. **类名规范**：`.page-wrap` 和 `.page-content` 是强制约定的类名

## 相关 skill

- [原子化 CSS 使用规范](./atomic-css.md)
- [cu-components 自定义组件使用规范](./cu-components.md)
- [pages.json 配置规范](./pages-json-config.md)
