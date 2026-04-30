# Utils 工具函数库

项目通用工具函数封装，包含基础工具、样式处理、文件上传、表单校验及常用 Hooks。

## 📚 目录

- [基础工具 (util.js)](#基础工具-utiljs)
- [表单校验 (validate.js)](#表单校验-validatejs)
- [样式处理 (styleHandleUtil.js)](#样式处理-stylehandleutiljs)
- [文件上传 (uploadImage.js / uploadFile.js / uploadVideo.js)](#文件上传)
- [通用 Hooks](#通用-hooks)

---

## 基础工具 (util.js)

包含页面跳转、提示框、路径处理等基础功能。

### 1. 页面跳转 `toPath`

**用法**
```javascript
import { swallowed } from '@/common/utils/util.js';

// 简单跳转
toPath('/pages/index/index');

// 带参数跳转并指定跳转类型
toPath({
  path: '/pages/detail/index',
  query: { id: 123 },
  type: 'redirectTo' // 支持 navigateTo (默认), redirectTo, reLaunch, switchTab
});
```

### 2. 提示框 `toast` / `loading`

**用法**
```javascript
import { toast, loading } from '@/common/utils/util.js';

// 显示提示
toast('操作成功');
toast({ title: '警告', icon: 'error' });

// 显示加载中
loading('加载中...');
// 关闭加载中需调用 uni.hideLoading()
```

### 3. 资源路径处理 `handleFilePath` / `handleStaticFilePath`

根据环境配置自动补全图片或文件资源的基础路径。

---

## 表单校验 (validate.js)

统一的正则校验工具。

**用法**
```javascript
import { validate } from '@/common/utils/validate.js';

validate('13800138000', 'phone'); // true
validate('440101...', 'idcard'); // true
```

**支持类型**
| 类型 | 说明 |
|------|------|
| `require` | 必填校验 |
| `phone` | 手机号校验 |
| `email` | 邮箱校验 |
| `idcard` | 身份证校验 |
| `carno` | 车牌号校验（支持新能源） |
| `password` | 密码校验（6-12位字母数字组合） |
| `ismoney` | 金额校验 |

---

## 样式处理 (styleHandleUtil.js)

### `convertStyles`
将 Vue 风格的样式对象转换为行内样式字符串。

**用法**
```javascript
import { convertStyles } from '@/common/utils/styleHandleUtil.js';

const styleObj = { backgroundColor: 'red', marginTop: '20px' };
const styleStr = convertStyles(styleObj); 
// 输出: "background-color: red; margin-top: 20px;"
```

---

## 文件上传

包含 `UploadImg`, `UploadVideo`, `UploadFile` 类，支持单/多文件顺序上传。

**用法示例 (以图片为例)**
```javascript
import UploadImg from '@/common/utils/uploadImage.js';

new UploadImg(tempFilePaths, {
  success: (uploadedUrls) => {
    // 每上传成功一张的回调
    console.log('当前已上传:', uploadedUrls);
  },
  complete: (allUrls) => {
    // 全部上传完成的回调
    console.log('上传完成:', allUrls);
  }
});
```

---

## 通用 Hooks

### 1. 列表分页加载 `useLoadList`

封装了 `onPullDownRefresh` 和 `onReachBottom`，简化分页逻辑。

**用法**
```javascript
import { useLoadList } from '@/common/utils/useLoadList.js';

const listData = ref([]);
const { pagination, init, scrolltolower } = useLoadList({
  listData,
  getList: fetchApiData, // 获取数据的 API 函数
});
```

### 2. 验证码倒计时 `useCountDown`

**用法**
```javascript
import useCountDown from '@/common/utils/useCountDown.js';

const { sendCode, downTimeStr } = useCountDown(60);

// 点击发送
sendCode('13800138000').then(res => {
  // 发送成功后的逻辑
});
```

---

### 3. 系统信息 `useSystemUtil` / 沉浸式导航 `useNavbarImmerse`
用于获取状态栏高度、计算页面可用高度等适配工作。
