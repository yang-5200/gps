---
title: useLoadList 分页列表 Hook
category: uniapp-vue3
tags: [uniapp, vue3, hook, list, pagination, load-more]
created: 2026-04-26
---

# useLoadList 分页列表 Hook

## 问题/场景
在列表页面中，需要统一处理分页加载、下拉刷新、上拉加载更多等逻辑，避免重复代码。

## 核心要点

### 1. Hook 引入
```js
import { useLoadList } from '@/common/utils/useLoadList.js';
```

### 2. 基础用法
```vue
<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useLoadList } from '@/common/utils/useLoadList.js';
import { http, urls } from '@/common/api/index.js';

// 列表数据
const listData = ref([]);

/**
 * @description 获取列表数据
 */
async function getList() {
  pagination.loadStatus = 'loading';
  
  try {
    const params = {
      page: pagination.pageNo,
      limit: pagination.pageSize,
    };
    
    const res = await http.post(urls.module.apiName, params);
    
    if (res.code === 1) {
      const newList = res.data.list || [];
      
      // 第一页直接赋值，后续页追加
      if (pagination.pageNo === 1) {
        listData.value = newList;
      } else {
        listData.value = listData.value.concat(newList);
      }
      
      pagination.total = res.data.total || 0;
      
      // 判断是否还有更多
      pagination.loadStatus = len.value >= pagination.total ? 'noMore' : 'more';
    } else {
      pagination.loadStatus = 'noMore';
    }
  } catch (error) {
    console.error('列表请求失败：', error);
    pagination.loadStatus = 'noMore';
  }
}

// 使用分页 Hook
const { pagination, len, init } = useLoadList({
  listData: listData,
  getList
});

// 页面显示时加载数据
onShow(() => {
  init();
  getList();
});
</script>
```

### 3. 配合 cu-load-list 组件使用
```vue
<template>
  <view class="page-content">
    <!-- 空状态 -->
    <view v-if="listData.length === 0" class="empty-state">
      <image src="/static/not-data-1.png" class="empty-img" mode="aspectFit"></image>
      <text class="empty-text">暂无数据</text>
    </view>
    
    <!-- 列表 -->
    <cu-load-list v-else :len="len" :loadStatus="pagination.loadStatus">
      <view class="list">
        <view v-for="item in listData" :key="item.id" class="list-item">
          <!-- 列表项内容 -->
        </view>
      </view>
    </cu-load-list>
  </view>
</template>
```

### 4. Hook 返回值

| 属性/方法 | 类型 | 说明 |
|-----------|------|------|
| `pagination` | Object | 分页状态对象 |
| `pagination.pageNo` | Number | 当前页码 |
| `pagination.pageSize` | Number | 每页条数（默认10） |
| `pagination.total` | Number | 总条数 |
| `pagination.loadStatus` | String | 加载状态：`more`/`loading`/`noMore` |
| `len` | Computed | 当前列表长度 |
| `init()` | Function | 初始化，重置页码和列表 |
| `scrolltolower()` | Function | 手动触发加载更多 |

### 5. 配置选项

```js
const { pagination, len, init } = useLoadList({
  listData: listData,        // 必填：列表数据 ref
  getList: getList,          // 必填：获取列表的方法
  isOnReachBottom: false,    // 可选：禁用自动上拉加载
  isOnPullDownRefresh: false // 可选：禁用自动下拉刷新
});
```

## 完整示例

```vue
<template>
  <view class="page-wrap">
    <cu-nav-bar title-text="列表页面"></cu-nav-bar>
    
    <view class="page-content padding-sm">
      <!-- 空状态 -->
      <view v-if="listData.length === 0" class="empty-state">
        <image src="/static/not-data-1.png" class="empty-img" mode="aspectFit"></image>
        <text class="empty-text">暂无数据</text>
      </view>
      
      <!-- 列表 -->
      <cu-load-list v-else :len="len" :loadStatus="pagination.loadStatus">
        <view class="list">
          <view v-for="item in listData" :key="item.id" 
                class="list-item bg-white radius-df margin-bottom-sm padding">
            <text class="text-28">{{ item.name }}</text>
          </view>
        </view>
      </cu-load-list>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useLoadList } from '@/common/utils/useLoadList.js';
import { http, urls } from '@/common/api/index.js';
import { toast } from '@/common/utils/util';

const listData = ref([]);

async function getList() {
  pagination.loadStatus = 'loading';
  
  try {
    const res = await http.post(urls.module.list, {
      page: pagination.pageNo,
      limit: pagination.pageSize,
    });
    
    if (res.code === 1) {
      const newList = res.data.list || [];
      
      if (pagination.pageNo === 1) {
        listData.value = newList;
      } else {
        listData.value = listData.value.concat(newList);
      }
      
      pagination.total = res.data.total || 0;
      pagination.loadStatus = len.value >= pagination.total ? 'noMore' : 'more';
    } else {
      pagination.loadStatus = 'noMore';
    }
  } catch (error) {
    console.error('列表请求失败：', error);
    pagination.loadStatus = 'noMore';
    toast(error.msg || '网络异常');
  }
}

const { pagination, len, init } = useLoadList({
  listData: listData,
  getList
});

onShow(() => {
  init();
  getList();
});
</script>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  
  .empty-img {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
  }
  
  .empty-text {
    font-size: 32rpx;
    color: #999;
  }
}
</style>
```

### 6. 带搜索的分页列表

搜索框与分页列表联动是常见场景，实现要点：

```vue
<template>
  <view class="page-wrap">
    <cu-nav-bar title-text="发票列表"></cu-nav-bar>
    
    <!-- 搜索栏 -->
    <view class="search-section padding-sm bg-white">
      <view class="search-box flex align-center">
        <image class="search-icon" src="/static/icon/search.png" mode="aspectFill"></image>
        <input 
          class="search-input flex-sub" 
          v-model="searchKeyword" 
          placeholder="请输入搜索关键词"
          @confirm="handleSearch" 
        />
      </view>
    </view>
    
    <view class="page-content padding-sm">
      <!-- 空状态 -->
      <view v-if="listData.length === 0 && pagination.loadStatus !== 'loading'" class="empty-state">
        <image src="/static/not-data-1.png" class="empty-img" mode="aspectFit"></image>
        <text class="empty-text">暂无相关内容</text>
      </view>
      
      <!-- 列表 -->
      <cu-load-list v-else :len="len" :loadStatus="pagination.loadStatus">
        <view class="list">
          <view v-for="item in listData" :key="item.id" class="list-item">
            <text>{{ item.name }}</text>
          </view>
        </view>
      </cu-load-list>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { useLoadList } from '@/common/utils/useLoadList.js';
import { http, urls } from '@/common/api/index.js';

const listData = ref([]);
const searchKeyword = ref('');

async function getList() {
  pagination.loadStatus = 'loading';
  
  try {
    const res = await http.post(urls.module.list, {
      page: pagination.pageNo,
      limit: pagination.pageSize,
      keyword: searchKeyword.value.trim()  // 搜索参数
    });
    
    if (res.code === 1) {
      const newList = res.data.list || [];
      
      if (pagination.pageNo === 1) {
        listData.value = newList;
      } else {
        listData.value = listData.value.concat(newList);
      }
      
      pagination.total = res.data.total || 0;
      pagination.loadStatus = len.value >= pagination.total ? 'noMore' : 'more';
    } else {
      pagination.loadStatus = 'noMore';
    }
  } catch (error) {
    console.error('列表请求失败：', error);
    pagination.loadStatus = 'noMore';
  }
}

const { pagination, len, init } = useLoadList({
  listData: listData,
  getList
});

// 搜索处理：重置分页并重新加载
function handleSearch() {
  init();      // 重置 pageNo = 1，清空列表
  getList();   // 重新请求
}
</script>
```

**关键要点：**
- 搜索时先调用 `init()` 重置分页状态
- 搜索参数通过 `keyword` 传递给后端
- 空状态判断要排除 loading 状态，避免闪烁

### 7. API 数据字段映射

当后端返回蛇形命名（`snake_case`）而前端使用驼峰命名（`camelCase`）时，需要转换：

```javascript
async function getList() {
  pagination.loadStatus = 'loading';
  
  try {
    const res = await http.post(urls.order.invoiceList, {
      page: pagination.pageNo,
      limit: pagination.pageSize,
    });

    if (res.code === 1 && res.data) {
      const { list, total } = res.data;

      // 转换 API 返回的数据格式
      const formattedList = list.map(item => ({
        id: item.id,
        invoiceNo: item.invoice_no,      // 蛇形 → 驼峰
        orderId: item.order_id,
        orderNo: item.order_no,
        projectName: item.project_name,
        workPlace: item.address,
        invoiceTitle: item.invoice_title,
        status: item.status,
        statusText: item.status_text,
        invoiceImages: item.invoice_images
      }));

      if (pagination.pageNo === 1) {
        listData.value = formattedList;
      } else {
        listData.value = listData.value.concat(formattedList);
      }
      
      pagination.total = total || 0;
      pagination.loadStatus = pagination.total <= len.value ? 'noMore' : 'more';
    } else {
      pagination.loadStatus = 'noMore';
    }
  } catch (error) {
    console.error('获取列表失败:', error);
    pagination.loadStatus = 'more';
  }
}
```

**转换原则：**
- 在 `getList` 中统一转换，保持组件内数据规范一致
- 使用 `map()` 创建新数组，避免直接修改原始数据
- 字段映射表清晰展示前后端对应关系

## 注意事项

1. **数据追加逻辑**：第一页直接赋值，后续页使用 `concat` 追加
2. **状态判断**：通过 `len.value >= pagination.total` 判断是否加载完毕
3. **错误处理**：请求失败时设置 `loadStatus = 'noMore'` 避免无限加载
4. **页面切换**：在 `onShow` 中调用 `init()` 重置状态
5. **搜索场景**：搜索时必须先 `init()` 重置，再 `getList()` 请求
6. **字段映射**：在数据获取层统一转换，保持组件层命名规范

## 相关 skill

- [接口调用规范](./api-request.md)
- [cu-components 自定义组件使用规范](./cu-components.md)
