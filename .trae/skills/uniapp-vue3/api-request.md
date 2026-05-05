---
title: UniApp Vue3 接口调用规范
category: uniapp-vue3
tags: [uniapp, vue3, api, http, request]
created: 2026-04-26
updated: 2026-05-04
---

# UniApp Vue3 接口调用规范

## 问题/场景
在 uni-app + Vue3 项目中，需要统一接口调用方式，处理请求、响应、错误等逻辑。

## 源码参考
- HTTP 封装：`common/api/index.js`（基于 `uview-plus` 的 http 模块封装）
- 接口地址：`common/api/urls.js`（按模块拆分，位于 `common/api/modules/` 下）

## 核心要点

### 1. 引入方式
```js
import { http, urls } from '@/common/api/index.js';
```
> `http` 底层来自 `uview-plus`，`index.js` 中做了全局配置（baseURL、请求/响应拦截器等）并重新导出。

### 2. 请求方法

- `http.get(url, params)` - GET 请求（内部自动包装为 `{ params }` 传递）
- `http.post(url, data)` - POST 请求
- 文件上传使用 `UploadImg` 类，非 `http.upload`（详见下方说明）

### 3. 响应规范（重要）

**拦截器已自动处理错误，业务代码无需重复处理：**

```js
// common/api/index.js 中的响应拦截器逻辑：
// ✅ code === 1 → resolve(data)，返回数据
// ❌ code !== 1 → Promise.reject(data)，且自动 toast(data.msg)
// ❌ HTTP 非 200 → Promise.reject，且自动 toast(data.msg)
// ❌ 401 → 自动 toast + 清理用户信息 + 跳转登录页
```

因此业务代码中：
- `try` 块中拿到的 `res` **一定是 code === 1 的成功数据**，无需再判断
- `catch` 块中拦截器已 toast 过错误信息，**无需重复 toast**，仅做降级处理即可

### 4. 接口地址组织方式

```js
// common/api/modules/xxx.js
export default {
  apiName: '/api/xxx/apiName',
  detail: '/api/xxx/detail',
}

// common/api/urls.js 汇总导出
export default { user, home, order, tool, project, invoice, common }
```

使用时：`urls.moduleName.apiName`，如 `urls.home.list`、`urls.user.profile`

## 示例代码

### 基础请求示例
```vue
<script setup>
import { http, urls } from '@/common/api/index.js';

/**
 * @description 获取数据
 */
async function fetchData() {
  try {
    const res = await http.post(urls.module.apiName, { param: value });
    // code === 1 时才到这里，拦截器已自动处理非 1 的情况
    pageData.list = res.data || [];
  } catch (error) {
    // 拦截器已自动 toast，此处仅做降级处理
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
    listData.value = [...listData.value, ...res.data];
    loadStatus.value = res.data.length < 10 ? 'noMore' : 'more';
  } catch (error) {
    // 拦截器已自动 toast
    loadStatus.value = 'more';
    console.error('列表加载失败', error);
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
    // GET 方法内部会将 params 包装为 { params: { id } }
    return res.data;
  } catch (error) {
    console.error('获取详情失败', error);
    return null;
  }
}
```

### 文件上传示例（使用 UploadImg 类）
```vue
<script setup>
import { ref } from 'vue';
import UploadImg from '@/common/utils/uploadImage.js';

/**
 * @description 上传图片
 * @param {Array} filePaths - chooseImage 返回的 tempFilePaths 数组
 */
function uploadImages(filePaths) {
  return new Promise((resolve, reject) => {
    new UploadImg(filePaths, {
      success: (urls) => {
        // 每上传成功一张回调一次
      },
      complete: (urls) => {
        // 全部上传完成回调（不论成功失败）
        if (urls.length > 0) {
          resolve(urls);
        } else {
          reject(new Error('图片上传失败'));
        }
      }
    });
  });
}
</script>
```

> **注意**：`UploadImg` 内部已自动调用 `uni.showLoading()` 和 `uni.hideLoading()`，外部无需重复调用。

## 401 登录失效处理

响应拦截器已内置 401 处理逻辑：
1. 检测到 `code === 401` 时自动触发
2. 弹出"登录失效 请重新登录"提示
3. 清空用户信息（`userStore.setUserInfo({}, false)`）
4. 跳转到登录页（`LOGIN_PAGE_PATH`）
5. 通过 `uni.requestLoginOutTask` 标志防止重复触发

**业务代码无需额外处理 401 逻辑。**

## 注意事项

1. **无需重复 toast**：拦截器已自动处理错误提示，catch 块中仅做降级逻辑
2. **无需判断 code**：进入 try 块的 res 一定是 code === 1 的成功数据
3. **默认值**：数据赋值时提供默认值，如 `res.data || []`
4. **加载状态**：列表加载需维护 `loadStatus`，防止重复请求
5. **下拉刷新**：记得在 `finally` 中调用 `uni.stopPullDownRefresh()`
6. **文件上传**：使用 `UploadImg` 类而非 `http.upload`，该类内部已处理 loading 和 token

## 相关 skill
- [工具函数使用规范](./utils.md)
- [页面生成规范](./page-generation.md)
- [头像上传与裁剪](./avatar-upload-crop.md)