---
title: 富文本渲染（cu-parser 组件）
category: uniapp-vue3
tags: [rich-text, html, parser, content]
created: 2026-04-26
---

# 富文本渲染（cu-parser 组件）

## 问题/场景
在 uni-app 中需要渲染 HTML 格式的富文本内容（如用户协议、消息详情、公告等），使用 `cu-parser` 组件可以正确解析和显示 HTML。

## 核心要点

### 1. 组件基本使用
```vue
<template>
    <cu-parser :html="content"></cu-parser>
</template>

<script setup>
import { ref } from 'vue';

const content = ref('<p>这是富文本内容</p><img src="xxx.jpg" />');
</script>
```

### 2. 配合容器使用
通常需要配合容器设置样式：
```vue
<template>
    <view class="bg-card-color padding-sm flex-grow-1 radius-20">
        <cu-parser :html="content"></cu-parser>
    </view>
</template>
```

### 3. 数据加载后渲染
```vue
<script setup>
import { ref } from 'vue';
import { http, urls } from '@/common/api/index.js';

const content = ref('');

async function loadContent() {
    const res = await http.get(urls.common.agreement, { type: 'user_agreement' });
    if (res.code === 1) {
        content.value = res.data.content || '';
    }
}
</script>
```

## 示例代码

### 完整富文本页面
```vue
<template>
    <view class="padding-sm page-wrap flex flex-direction">
        <cu-nav-bar :title-text="title" align-mode="center"></cu-nav-bar>
        <view class="bg-card-color padding-sm flex-grow-1 radius-20">
            <cu-parser :html="content"></cu-parser>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue';
import { http, urls } from '@/common/api/index.js';
import { onLoad } from '@dcloudio/uni-app';

const title = ref('');
const content = ref('');

onLoad((query) => {
    title.value = query.title || '详情';
    loadContent(query.id);
});

async function loadContent(id) {
    try {
        const res = await http.post(urls.user.messageDetail, { message_id: id });
        if (res.code === 1) {
            content.value = res.data.content || '';
        }
    } catch (error) {
        console.error('加载失败', error);
    }
}
</script>

<style lang="scss" scoped>
.page-wrap {
    min-height: 100vh;
}
</style>
```

## 注意事项

1. **空值处理**：给 `content` 设置默认空字符串 `|| ''`，避免 undefined
2. **样式隔离**：富文本内容在 `cu-parser` 内部渲染，外部样式可能影响有限
3. **图片处理**：富文本中的图片路径需要是完整 URL 或正确处理过的相对路径
4. **安全考虑**：如果内容来自用户输入，需要做好 XSS 过滤
5. **性能优化**：大量富文本内容考虑分页或虚拟滚动

## 常见使用场景

| 场景 | 数据来源 | 示例 |
|------|----------|------|
| 用户协议 | 配置接口 | `configKey: 'user_agreement'` |
| 隐私政策 | 配置接口 | `configKey: 'privacy_policy'` |
| 系统消息 | 消息详情接口 | `message_id: xxx` |
| 帮助文档 | 内容管理接口 | `doc_id: xxx` |
| 公告通知 | 公告详情接口 | `notice_id: xxx` |

## 相关 skill
- [多数据源页面设计](./multi-source-page.md)
- [组件使用规范](./components.md)
