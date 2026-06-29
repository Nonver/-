<template>
<view class="tb-wrap" :style="{background:bg, paddingTop:statusBarH + 'px'}">
  <view class="tb-bar" :style="{height:barH+'px'}">
    <view class="tb-left">
      <view v-if="back" class="tb-back" @tap="goBack">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
      </view>
      <slot name="left"></slot>
    </view>

    <text class="tb-title" :class="titleCls" :style="{color:textColor}">{{ title }}</text>

    <view class="tb-right">
      <slot name="right"></slot>
      <view v-if="showLogout" class="tb-btn" @tap="doLogout">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
      </view>
    </view>
  </view>
</view>
<view :style="{height: (statusBarH + barH) + 'px'}"></view>
</template>

<script>
import { useAuth } from '@/stores/auth.js'

export default {
  name: 'TopBar',
  props: {
    title: { type: String, default: '' },
    bg: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#0f172a' },
    back: { type: Boolean, default: false },
    showLogout: { type: Boolean, default: false },
    backUrl: { type: String, default: '' },
    barH: { type: Number, default: 44 },
  },
  data() {
    return {
      statusBarH: 0,
      titleCls: '',
    }
  },
  created() {
    this.initBar()
  },
  mounted() {
    this.initBar()
  },
  methods: {
    initBar() {
      if (this.statusBarH > 0) return
      try {
        const sys = uni.getSystemInfoSync()
        this.statusBarH = sys.statusBarHeight || 0
        this.titleCls = sys.platform === 'ios' ? 'tb-title-ios' : ''
      } catch(e) { this.statusBarH = 20 }
    },
    goBack() {
      if (this.backUrl) {
        uni.redirectTo({ url: this.backUrl })
        return
      }
      // 使用智能返回：页面栈正常则 navigateBack，刷新后栈丢失则从历史记录降级
      if (this.$smartBack) {
        this.$smartBack()
      } else {
        const pages = getCurrentPages()
        if (pages.length > 1) {
          uni.navigateBack({ delta: 1 })
        } else {
          uni.navigateTo({ url: '/pages/login/login' })
        }
      }
    },
    doLogout() {
      const auth = useAuth()
      auth.logout()
      uni.navigateTo({ url: '/pages/login/login' })
    },
  },
}
</script>

<style>
.tb-wrap { width:100%; position:fixed; top:0; left:0; z-index:100; border-bottom:0.5px solid rgba(0,0,0,.06) }
.tb-bar { display:flex; align-items:center; justify-content:space-between; padding:0 16rpx }
.tb-left, .tb-right { width:80rpx; display:flex; align-items:center }
.tb-right { justify-content:flex-end }
.tb-back { width:64rpx; height:64rpx; display:flex; align-items:center; justify-content:center; color:#64748b }
.tb-back:active { opacity:.5 }
.tb-btn { width:64rpx; height:64rpx; display:flex; align-items:center; justify-content:center; color:#94a3b8 }
.tb-btn:active { opacity:.5 }
.tb-title { flex:1; text-align:center; font-size:32rpx; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis }
.tb-title-ios { font-weight:600; letter-spacing:-0.3rpx }
</style>
