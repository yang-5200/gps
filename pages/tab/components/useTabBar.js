import { onLoad } from '@dcloudio/uni-app'

/**
 * @description 隐藏原生 TabBar 的 Hook
 * 每个 Tab 页面都必须在 script setup 中调用
 */
export function useTabBar() {
  onLoad(() => {
    uni.hideTabBar()
  })
}
