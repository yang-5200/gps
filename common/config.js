import devConfig from './env.development.js';
import testConfig from './env.test.js';
import prodConfig from './env.production.js';

// 环境类型
const ENV_TYPE = {
  DEVELOPMENT: 'development',
  TEST: 'test',
  PRODUCTION: 'production'
};

// 获取当前环境
// 优先级：1. 手动设置的变量 2. uni-app 编译环境判断
const getCurrentEnv = () => {
  // #ifdef H5
  // H5 开发环境
  return ENV_TYPE.DEVELOPMENT;
  // #endif

  // #ifdef APP-PLUS
  // App 根据打包方式判断
  // 可以通过 manifest.json 或打包时的环境变量来区分
  // 这里默认使用生产环境，实际项目中可以通过其他方式判断
  return ENV_TYPE.PRODUCTION;
  // #endif

  // #ifdef MP-WEIXIN
  // 微信小程序
  // 开发版/体验版/正式版可以通过 wx.getAccountInfoSync 判断
  const accountInfo = wx.getAccountInfoSync();
  const envVersion = accountInfo.miniProgram.envVersion;

  if (envVersion === 'develop') {
    return ENV_TYPE.DEVELOPMENT;
  } else if (envVersion === 'trial') {
    return ENV_TYPE.TEST;
  } else {
    return ENV_TYPE.PRODUCTION;
  }
  // #endif

  // 默认返回开发环境
  return ENV_TYPE.DEVELOPMENT;
};

// 手动设置环境（用于调试或特殊场景）
// 可以在代码中设置：uni.setStorageSync('APP_ENV', 'test')
const getManualEnv = () => {
  try {
    return uni.getStorageSync('APP_ENV');
  } catch (e) {
    return null;
  }
};

// 获取环境配置
const getEnvConfig = () => {
  const manualEnv = getManualEnv();
  const currentEnv = manualEnv || getCurrentEnv();

  switch (currentEnv) {
    case ENV_TYPE.DEVELOPMENT:
      return { ...devConfig, ENV: ENV_TYPE.DEVELOPMENT };
    case ENV_TYPE.TEST:
      return { ...testConfig, ENV: ENV_TYPE.TEST };
    case ENV_TYPE.PRODUCTION:
      return { ...prodConfig, ENV: ENV_TYPE.PRODUCTION };
    default:
      return { ...devConfig, ENV: ENV_TYPE.DEVELOPMENT };
  }
};

// 当前环境配置
const envConfig = getEnvConfig();

// 导出环境变量
export const ENV = envConfig.ENV;
export const DEBUG = envConfig.DEBUG;
export const SHOW_LOG = envConfig.SHOW_LOG;
export const REQUEST_TIMEOUT = envConfig.REQUEST_TIMEOUT;

// 导出接口相关配置
export const HOST = envConfig.HOST;
export const API_BASE_URL = envConfig.API_BASE_URL;
export const FILE_BASE_URL = envConfig.FILE_BASE_URL;
export const UPLOAD_FILE_URL = envConfig.UPLOAD_FILE_URL;
export const FILE_STATIC_BASE_URL = envConfig.FILE_STATIC_BASE_URL;

// 登录页路径
export const LOGIN_PAGE_PATH = '/pages/views/login/wxLogin/index';

// 应用首页
export const HOME_PAGE_PATH = '/pages/tabs/home/home';

// app更新API_URL
export const APP_UPDATE_URL = '';

// 切换环境的方法（用于调试）
export const switchEnv = (env) => {
  if (!Object.values(ENV_TYPE).includes(env)) {
    console.error('无效的环境类型:', env);
    return false;
  }
  uni.setStorageSync('APP_ENV', env);
  console.log(`环境已切换为: ${env}，请重新启动应用`);
  return true;
};

// 清除手动设置的环境
export const clearManualEnv = () => {
  uni.removeStorageSync('APP_ENV');
  console.log('手动环境设置已清除，请重新启动应用');
};

// 默认导出
export default {
  ENV,
  DEBUG,
  SHOW_LOG,
  REQUEST_TIMEOUT,
  HOST,
  API_BASE_URL,
  FILE_BASE_URL,
  UPLOAD_FILE_URL,
  FILE_STATIC_BASE_URL,
  LOGIN_PAGE_PATH,
  HOME_PAGE_PATH,
  APP_UPDATE_URL,
  switchEnv,
  clearManualEnv
};
