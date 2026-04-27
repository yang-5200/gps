
# 某某项目某端（小程序）
> 开发使用HbuilderX版本4.15
## 项目目录结构

```
├── common                                    公共模块
    ├── api                                           请求模块
    ├── css                                           公共样式
			├── tokens 																			预制css变量配置 
			├── animation.css  															公共关键帧动画
			├── base.scss 																	常用公共样式
			├── icon.css 																		字体图标（iconfont）
			├── icon.css 																		字体图标（iconfont）
			├── public.scss 																预制样式scss文件
			├── public.css 																	预制样式scss文件生成的css文件
			├── variables.css 															生成的预制css变量css文件
			├── variables.scss 															生成的预制css变量scss文件
			└── variables.js 																生成的预制css变量js文件												
    ├── utils                                         公共方法
        ├── upload.image.js                           上传图片至服务器
        └── validate.js                               验证
    └── config.js                                     配置文件
├── components                                内置公共组件
├── pages                                     项目页面
		├── avatarCropper                                 头像裁剪页       
    ├── tab                                           底部栏目
    └── global-pop                                    压窗屏及公共弹出组件
├── static                                    公共静态资源
├── stores                                    pinia
├── .gitignore                                git忽略文件
└── pages.json                                页面配置
```

# 预制css变量生成

```
npx style-dictionary build -c style.dictionary.config.json
```
- 关于 `style-dictionary`更多请查看[style-dictionary npm 文档](https://www.npmjs.com/package/style-dictionary)


# 接口请求案例
### 表单
```
loading('操作中');
http.post(urls.resetpwd, toRaw(formData)).then(res => {
	uni.hideLoading();
	// //console.log(res);
	if(res.code === 1){
		toast(res.msg, 'success')
	}
}).catch(err => {
	uni.hideLoading();
	//console.log(err);
	toast('请求错误:'+ (err.msg || err.message))
})
```
### 列表
```
pagination.loadStatus = 'loading';
http.post(urls., {
	page_size: pagination.pageSize,
	page: pagination.pageNo,
}).then(res => {
	//console.log(res);
	if(res.code === 1){
		listData.value = listData.value.concat(res.data.data);
		pagination.total = res.data.total;
		pagination.loadStatus = listData.value.length < pagination.total ? 'more' : 'noMore';
	}else{
		pagination.loadStatus = 'noMore';
	}
}).catch(err => {
	pagination.loadStatus = 'noMore';
	//console.log(err);
})
```
### 详情
```
http.post(urls., {}).then(res => {
	//console.log(res);
	if(res.code === 1){
		
	}
}).catch(err=>{0
  //console.log('请求错误', err);
})
```

