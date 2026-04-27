---
title: 多数据源页面设计
category: uniapp-vue3
tags: [page, data-source, conditional-rendering]
created: 2026-04-26
---

# 多数据源页面设计

## 问题/场景
当一个页面需要支持多种数据来源（如消息详情、协议内容、帮助文档等），通过不同参数决定加载哪种数据时，需要设计清晰的数据源区分逻辑。

## 核心要点

### 1. 参数设计
使用不同参数区分数据来源：
```javascript
const parameter = reactive({
    title: '',      // 页面标题
    id: '',         // 数据ID（如消息ID）
    source: '',     // 来源标识（如 'system'）
    configKey: ''   // 配置键（如协议类型）
});
```

### 2. 数据源判断逻辑
在 `onLoad` 中根据参数决定调用哪个接口：
```javascript
onLoad((query) => {
    parameter.title = query.title;
    parameter.id = query?.id;
    parameter.source = query?.source;
    parameter.configKey = query?.configKey;
    
    // 根据 source 和参数组合判断数据源
    if (parameter.source === 'system' && parameter.id) {
        getMessageDetail(parameter.id);
    } else if (parameter.configKey) {
        getAgreement();
    }
});
```

### 3. 独立的数据获取函数
为每种数据源编写独立的获取函数：
```javascript
// 获取消息详情
async function getMessageDetail(id) {
    try {
        const res = await http.post(urls.user.messageDetail, { message_id: id });
        if (res.code === 1) {
            content.value = res.data.content || '';
        } else {
            toast(res.msg);
        }
    } catch (error) {
        console.error('获取消息详情失败', error);
        toast(error.msg);
    }
}

// 获取协议内容
function getAgreement() {
    const configKey = parameter?.configKey;
    if (!configKey) {
        toast('缺少协议参数');
        return;
    }

    loading({ title: '加载中...' });
    http.get(urls.common.agreement, { type: configKey })
        .then((res) => {
            uni.hideLoading();
            if (res.code === 1) {
                content.value = res.data.content || '';
            } else {
                toast(res.msg);
            }
        })
        .catch((err) => {
            uni.hideLoading();
            toast(err.msg);
        });
}
```

## 示例代码

### 完整页面示例
```vue
<template>
    <view class="padding-sm page-wrap flex flex-direction">
        <cu-nav-bar :title-text="parameter.title" align-mode="center"></cu-nav-bar>
        <view class="bg-card-color padding-sm flex-grow-1 radius-20">
            <cu-parser :html="content"></cu-parser>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { http, urls } from '@/common/api/index.js';
import { toast, loading } from '@/common/utils/util';
import { onLoad } from '@dcloudio/uni-app';

const parameter = reactive({
    title: '',
    id: '',
    source: '',
    configKey: ''
});

const content = ref('');

async function getMessageDetail(id) {
    try {
        const res = await http.post(urls.user.messageDetail, { message_id: id });
        if (res.code === 1) {
            content.value = res.data.content || '';
        } else {
            toast(res.msg);
        }
    } catch (error) {
        console.error('获取消息详情失败', error);
        toast(error.msg);
    }
}

function getAgreement() {
    const configKey = parameter?.configKey;
    if (!configKey) {
        toast('缺少协议参数');
        return;
    }

    loading({ title: '加载中...' });
    http.get(urls.common.agreement, { type: configKey })
        .then((res) => {
            uni.hideLoading();
            if (res.code === 1) {
                content.value = res.data.content || '';
            } else {
                toast(res.msg);
            }
        })
        .catch((err) => {
            uni.hideLoading();
            toast(err.msg);
        });
}

onLoad((query) => {
    parameter.title = query.title;
    parameter.id = query?.id;
    parameter.source = query?.source;
    parameter.configKey = query?.configKey;
    
    if (parameter.source === 'system' && parameter.id) {
        getMessageDetail(parameter.id);
    } else if (parameter.configKey) {
        getAgreement();
    }
});
</script>
```

## 注意事项

1. **参数优先级**：明确参数优先级，如 `configKey` 优先于 `source`
2. **参数校验**：在获取数据前校验必要参数是否存在
3. **错误处理**：每种数据源都要有独立的错误处理
4. **加载状态**：使用 `loading` 提示用户数据正在加载
5. **默认值**：给 `content` 设置默认空字符串，避免 undefined

## 跳转示例

```javascript
// 跳转到消息详情
toPath({
    path: '/pages/richTextPage/index',
    query: {
        title: '系统消息',
        id: messageId,
        source: 'system'
    }
});

// 跳转到用户协议
toPath({
    path: '/pages/richTextPage/index',
    query: {
        title: '用户协议',
        configKey: 'user_agreement'
    }
});

// 跳转到隐私政策
toPath({
    path: '/pages/richTextPage/index',
    query: {
        title: '隐私政策',
        configKey: 'privacy_policy'
    }
});
```

## 相关 skill
- [页面生成规范](./page-generation.md)
- [接口调用规范](./api-request.md)
