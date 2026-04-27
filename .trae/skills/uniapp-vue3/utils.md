---
title: UniApp Vue3 工具函数使用规范
category: uniapp-vue3
tags: [uniapp, vue3, utils, tools]
created: 2026-04-26
---

# UniApp Vue3 工具函数使用规范

## 问题/场景
在 uni-app + Vue3 项目中，需要使用统一的工具函数处理页面跳转、提示、数据处理等常见操作。

## 核心要点

### 1. 引入方式
```js
import {
  toPath,
  back,
  isContentShow,
  handleFilePath,
  handleStaticFilePath,
  toast,
  loading,
  openDocument,
  debounce,
  throttle,
  getDataType,
  openLocation,
  makePhoneCall,
  desensitizePhoneCustom,
  removeChars,
  copyTextToClipboard,
  testLogin
} from '@/common/utils/util.js';
```

### 2. 常用工具函数

| 函数 | 用途 | 示例 |
|------|------|------|
| `toPath(path, needLogin)` | 页面跳转 | `toPath('/pages/home/index')` |
| `back(delta)` | 返回上一页 | `back()` / `back(2)` |
| `toast(msg)` | 轻提示 | `toast('操作成功')` |
| `loading(msg)` | 加载中 | `loading('加载中...')` |
| `handleFilePath(src)` | 处理文件路径 | `handleFilePath('/upload/1.jpg')` |
| `debounce(fn, delay)` | 防抖 | `debounce(handleSearch, 500)` |
| `throttle(fn, delay)` | 节流 | `throttle(handleScroll, 200)` |
| `testLogin()` | 检测登录 | `testLogin()` |
| `copyTextToClipboard(text)` | 复制文本 | `copyTextToClipboard('内容')` |
| `makePhoneCall(phone)` | 拨打电话 | `makePhoneCall('13800138000')` |
| `openLocation(ops)` | 打开地图 | `openLocation({latitude, longitude})` |
| `desensitizePhoneCustom(phone)` | 手机号脱敏 | `desensitizePhoneCustom('13812345678')` |

## 示例代码

### 页面跳转 (toPath)

**必须使用 `toPath` 代替原生跳转：**

```vue
<script setup>
import { toPath } from '@/common/utils/util.js';

// 字符串路径
toPath('/pages/tabs/home/home');

// 对象配置
toPath({
  path: '/pages/detail/index',
  type: 'navigateTo', // navigateTo | redirectTo | reLaunch | switchTab
  query: { id: 123 }
});

// 需要登录校验
toPath('/pages/mine/index', true);
</script>
```

### 防抖与节流

```vue
<script setup>
import { debounce, throttle } from '@/common/utils/util.js';

// 搜索防抖
const handleSearch = debounce((keyword) => {
  console.log('搜索:', keyword);
  // 执行搜索请求
}, 500);

// 滚动节流
const handleScroll = throttle(() => {
  console.log('滚动事件');
  // 处理滚动逻辑
}, 200);
</script>
```

### 常用工具函数示例

```vue
<script setup>
import {
  back,
  toast,
  loading,
  handleFilePath,
  copyTextToClipboard,
  makePhoneCall,
  openLocation,
  desensitizePhoneCustom,
  testLogin
} from '@/common/utils/util.js';

// 返回上一页
function goBack() {
  back();
}

// 返回指定页数
function goBackTwo() {
  back(2);
}

// 轻提示
function showToast() {
  toast('操作成功');
}

// 加载提示
function showLoading() {
  loading('加载中...');
}

// 处理图片路径
function getImageUrl(src) {
  return handleFilePath(src);
}

// 复制文本
function copyText() {
  copyTextToClipboard('要复制的文本');
}

// 拨打电话
function callPhone() {
  makePhoneCall('13800138000');
}

// 打开地图
function openMap() {
  openLocation({
    latitude: 39.9042,
    longitude: 116.4074,
    name: '北京市',
    address: '天安门广场'
  });
}

// 手机号脱敏
function hidePhone(phone) {
  return desensitizePhoneCustom(phone); // 138****5678
}

// 检测登录
function checkLogin() {
  if (testLogin()) {
    toast('已登录');
  } else {
    toPath('/pages/login/index');
  }
}
</script>
```

## 注意事项/踩坑记录

1. **必须使用 toPath**: 不要使用 `uni.navigateTo` 等原生方法，统一使用 `toPath`
2. **登录校验**: 需要登录的页面跳转时，第二个参数传 `true`
3. **防抖节流**: 高频事件（搜索、滚动）必须使用防抖或节流
4. **路径处理**: 图片路径使用 `handleFilePath` 处理，确保兼容性
5. **类型检查**: 使用 `getDataType` 进行数据类型判断

## 相关 skill
- [接口调用规范](./api-request.md)
- [页面生成规范](./page-generation.md)
