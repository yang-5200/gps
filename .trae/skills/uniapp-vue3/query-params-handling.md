---
title: Query 参数解析与路由处理
category: uniapp-vue3
tags: [router, query, params, onLoad]
created: 2026-04-26
---

# Query 参数解析与路由处理

## 问题/场景
在 uni-app 中，页面间传递参数通过 URL query 实现，需要在 `onLoad` 生命周期中正确解析和使用这些参数。

## 核心要点

### 1. onLoad 接收参数
```javascript
import { onLoad } from '@dcloudio/uni-app';

onLoad((query) => {
    // query 是对象，包含所有 URL 参数
    console.log(query); // { id: '123', title: '标题', type: '1' }
});
```

### 2. 可选链操作符防御性编程
```javascript
onLoad((query) => {
    // 使用可选链防止 undefined 报错
    parameter.id = query?.id;
    parameter.source = query?.source;
    parameter.configKey = query?.configKey;
});
```

### 3. 参数类型转换
URL 参数都是字符串，需要时进行类型转换：
```javascript
onLoad((query) => {
    const id = Number(query?.id);        // 转为数字
    const isVip = query?.isVip === 'true'; // 转为布尔
    const tags = query?.tags?.split(',');  // 转为数组
});
```

### 4. 使用 reactive 统一管理参数
```javascript
const parameter = reactive({
    title: '',
    id: '',
    source: '',
    configKey: ''
});

onLoad((query) => {
    parameter.title = query.title || '默认标题';
    parameter.id = query?.id;
    parameter.source = query?.source;
    parameter.configKey = query?.configKey;
});
```

## 示例代码

### 页面跳转传参
```javascript
import { toPath } from '@/common/utils/util.js';

// 方式1：简单传参
toPath({
    path: '/pages/detail/index',
    query: {
        id: '123',
        title: '详情页'
    }
});

// 方式2：多个参数
toPath({
    path: '/pages/form/index',
    query: {
        type: 'edit',
        id: '456',
        from: 'list'
    }
});
```

### 页面接收参数
```vue
<script setup>
import { reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { http, urls } from '@/common/api/index.js';

const parameter = reactive({
    id: '',
    type: 'add',  // 默认值
    from: ''
});

const detail = reactive({});

onLoad((query) => {
    // 解析参数
    parameter.id = query?.id || '';
    parameter.type = query?.type || 'add';
    parameter.from = query?.from || '';
    
    // 根据参数加载数据
    if (parameter.id) {
        loadDetail(parameter.id);
    }
});

async function loadDetail(id) {
    const res = await http.get(urls.detail.get, { id });
    if (res.code === 1) {
        Object.assign(detail, res.data);
    }
}
</script>
```

## 注意事项

1. **参数长度限制**：URL 参数有长度限制，大数据量使用 storage 传递
2. **特殊字符编码**：中文和特殊字符会自动 URL 编码，接收后自动解码
3. **布尔值处理**：URL 中布尔值会变成字符串 `'true'`/`'false'`，需要手动转换
4. **空值判断**：使用 `||` 提供默认值，避免空字符串造成的问题
5. **数组传递**：数组需要转为字符串传递，如 `tags=a,b,c`，接收后 `split(',')`

## 参数校验示例
```javascript
onLoad((query) => {
    const id = query?.id;
    
    if (!id) {
        toast('缺少必要参数');
        setTimeout(() => back(), 1500);
        return;
    }
    
    // 继续加载数据
    loadData(id);
});
```

## 相关 skill
- [跨页面数据传递](./cross-page-data-transfer.md)
- [页面生成规范](./page-generation.md)
