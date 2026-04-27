---
title: UniApp Vue3 接口调用规范
category: uniapp-vue3
tags: [uniapp, vue3, api, http, request]
created: 2026-04-26
---

# UniApp Vue3 接口调用规范

## 问题/场景
在 uni-app + Vue3 项目中，需要统一接口调用方式，处理请求、响应、错误等逻辑。

## 核心要点

### 1. 引入方式
```js
import { http, urls } from '@/common/api/index.js';
```

### 2. 请求方法

- `http.get(url, params)` - GET请求
- `http.post(url, data)` - POST请求
- `http.upload(url, file)` - 文件上传

### 3. 响应规范

- `res.code === 1` 表示成功
- 其他 code 通过 `toast(res.msg)` 提示错误
- 使用 `try/catch` 捕获异常

## 示例代码

### 基础请求示例
```vue
<script setup>
import { http, urls } from '@/common/api/index.js';
import { toast } from '@/common/utils/util.js';

/**
 * @description 获取数据
 */
async function fetchData() {
  try {
    const res = await http.post(urls.module.apiName, { param: value });
    console.log('接口返回', res);
    if (res.code === 1) {
      // 成功处理
      pageData.list = res.data || [];
    } else {
      toast(res.msg);
    }
  } catch (error) {
    toast(error.msg || '请求失败');
    console.error('请求失败', error);
  }
}
</script>
```

### 列表加载示例
```vue
<script setup>
import { ref } from 'vue';
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import { http, urls } from '@/common/api/index.js';
import { toast } from '@/common/utils/util.js';

const listData = ref([]);
const loadStatus = ref('more'); // more | loading | noMore
let pageNum = 1;

/**
 * @description 获取列表
 */
async function getList() {
  if (loadStatus.value === 'loading') return;
  loadStatus.value = 'loading';

  try {
    const res = await http.post(urls.home.list, { page: pageNum, limit: 10 });
    if (res.code === 1) {
      listData.value = [...listData.value, ...res.data];
      loadStatus.value = res.data.length < 10 ? 'noMore' : 'more';
    } else {
      toast(res.msg);
      loadStatus.value = 'more';
    }
  } catch (error) {
    toast(error.msg || '请求失败');
    loadStatus.value = 'more';
  }
}

onLoad(() => {
  getList();
});

onPullDownRefresh(() => {
  listData.value = [];
  pageNum = 1;
  getList().finally(() => uni.stopPullDownRefresh());
});

onReachBottom(() => {
  if (loadStatus.value === 'more') {
    pageNum++;
    getList();
  }
});
</script>
```

### GET 请求示例
```js
/**
 * @description 获取详情
 * @param {number} id - 详情ID
 */
async function getDetail(id) {
  try {
    const res = await http.get(urls.detail.getInfo, { id });
    if (res.code === 1) {
      return res.data;
    } else {
      toast(res.msg);
      return null;
    }
  } catch (error) {
    toast(error.msg || '获取详情失败');
    return null;
  }
}
```

### 文件上传示例
```js
/**
 * @description 上传图片
 * @param {string} filePath - 文件路径
 */
async function uploadImage(filePath) {
  try {
    const res = await http.upload(urls.common.upload, filePath);
    if (res.code === 1) {
      return res.data.url;
    } else {
      toast(res.msg);
      return '';
    }
  } catch (error) {
    toast(error.msg || '上传失败');
    return '';
  }
}
```

## 注意事项/踩坑记录

1. **必须 try/catch**: 所有接口调用都要包裹 try/catch，防止未处理的异常
2. **code 判断**: 统一使用 `res.code === 1` 判断成功
3. **错误提示**: 失败时使用 `toast()` 提示用户
4. **默认值**: 数据赋值时提供默认值，如 `res.data || []`
5. **加载状态**: 列表加载需要维护 `loadStatus` 状态，防止重复请求
6. **下拉刷新**: 记得在 finally 中调用 `uni.stopPullDownRefresh()`

## 相关 skill
- [工具函数使用规范](./utils.md)
- [页面生成规范](./page-generation.md)
