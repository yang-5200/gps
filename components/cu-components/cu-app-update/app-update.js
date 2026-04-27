import { handleFilePath, loading, toast, back  } from '@/common/utils/util.js';
import useSystemUtil from '@/common/utils/useSystemUtil.js'


export class AppUpdate {

  constructor(option) {
    let {
      that,
      type,
			popModalRef,
			popUpdateAppRef,
			httpUrl
    } = option;

    this.that = that; // 页面this指向
    this.type = type || 'passive'; // 检测类型 ，passive 被动检测、active 主动检测
		this.popModalRef = popModalRef; // modal 弹框 ref 对象
		this.popUpdateAppRef = popUpdateAppRef;// updateApp 弹框 ref 对象
		this.httpUrl = httpUrl; //获取app版本和更新信息的url
    this.ov = 0; //旧版本号
    this.nv = 0; //新版本号
		
		const {systemInfo} = useSystemUtil()
		// this.platform = that.systemInfo.platform; //app 系统
    this.platform = systemInfo.platform; //app 系统
    this.init();
  }

  /**
   * @description 初始化
   */
  init() {
    // #ifndef APP-PLUS
		this.ov = '1.0.0';
    return console.log('h5不支持增量更新');
    // #endif
    plus.runtime.getProperty(plus.runtime.appid, res => {
      console.log(res);
      this.ov = res.version;
			// setUserState({
			// 	key: 'appVersion',
			// 	data: this.ov
			// })
    })
  }

  /**
   * @description 检测更新
   */
  testUpdate({type}) {
		// #ifndef APP-PLUS
		// console.log('当前环境不支持app更新');
		return {msg: '当前环境不支持app更新', code: 0}
		// #endif
		this.type = type || 'passive';
    let that = this.that,
      data;
    return new Promise((resolve, reject) => {
			uni.request({
				url: this.httpUrl,
				method:'POST',
				header:{
					'content-type': 'application/json'
				},
				success: (res) => {
					res = res.data;
					let data =  res.data;
					if(res.code === 200){
						// console.log(data);
						// console.log(data.versionName , this.ov);
						// console.log(data.versionName > this.ov);
						// 比较线上app版本和本机app包版本
						if(data.versionName > this.ov){ //
							// if(data.isForce){
							// }
							resolve({
								code: 1,
								msg: '增量更新中'
							});
							this.popModalRef.show({
								type: 'alert',
								title:'发现新版本',
								content:data.content || '',
								contentStyle:{
									padding:'0 34rpx 20rpx 34rpx'
								},
								confirmText:'立即更新',
								isBack: false,//是可以使用物理键关闭
								showCancel:!data.isForce,
								data:{
									versionName:data.versionName
								},
								success: modalRes => {
									if(modalRes.confirm){ // 用户点击确认
										if(data.isComplete && this.platform == 'ios'){
											plus.runtime.openURL(data.url);
										}else{
											data.downloadRrl = data.isComplete ? data.aAppUrl : data.wgtUrl;
											this.downloadUpdate(data);
										}
									}
									if(modalRes.cancel){
										resolve({
											code: 0,
											msg: '取消更新'
										});
									}
								}
							})
						}else{
							if(this.type === 'active') this.popModalRef.show({
								title:'当前已是最新版本',
								content:data.content || '',
								contentStyle:{
									padding:'0 34rpx 20rpx 34rpx'
								},
								confirmText:'知道了',
								isBack: false,//是可以使用物理键关闭
								showCancel: false,
								data:{
									versionName:data.versionName
								},
								type: 'update-app',
								success: modalRes => {
									if(modalRes.confirm){}
								}
							})
							resolve({
								code: 0,
								msg: '已是最新版，无需更新！'
							});
						}
					}else{
						resolve({
							code: 0,
							msg: 'app版本信息获取失败, 取消更新'
						});
					}
				},
				fail: (err) => {
					reject(err)
				}
			})
    })
  }
	
	/**
	 * 功能：关闭启动页
	 */
	closeSplashscreen() {
		// #ifdef  APP-PLUS
		setTimeout(() => {
			plus.navigator.closeSplashscreen();
		}, 1000)
		// #endif
	}
	
  /**
   * @description 下载并更新app
   */
  downloadUpdate(data){
    let that = this.that;
    uni.renewInfo = {
      version: data.versionName,
      size: data.size || '10M'
    }
		
		setTimeout(() => {
			// console.log('资源包下载地址', data.downloadRrl)
			uni.downloadTask = uni.downloadFile({
			  url:handleFilePath(data.downloadRrl),//data.downloadRrl
			  success(res) {
			    setTimeout(() => {
			      loading('安装中...');
			      plus.runtime.install(res.tempFilePath, {}, () => {
			        uni.hideLoading();
			        //资源包安装成功后重启应用
			        plus.runtime.restart();
			      }, (e) => {
			        uni.hideLoading();
			        toast('资源包安装失败' + '[' + e.code + ']:' + e.message);
			      });
			    }, 500);
			  },
			  fail() {
			    uni.hideLoading();
			    toast('资源包下载失败');
			    back();
			  }
			})
			// console.log('下载task对象', uni.downloadTask)
			this.popUpdateAppRef.show({
				title: 'APP升级提醒',
				isBack: false,//是可以使用物理键关闭
			})
		}, 500)
    
  }

  /**
   * @description 展示用户协议
   */
  showAgreement(){
    if (this.platform == 'ios') return false;
    let that = this.that;
    that.$refs.cPopup.show({
      type: 3,
      isbackbutton: true,
      title: '用户协议及隐私政策',
      titleStyle: {
        textAlign: 'center'
      },
      cancelText: '拒绝',
      confirmText: '同意',
      success: res => {
        if (res.confirm) {
          uni.setStorageSync('privacyAgreement', true);
        }
        if (res.cancel) {
          plus.runtime.quit();
        }
      }
    })
  }
}
