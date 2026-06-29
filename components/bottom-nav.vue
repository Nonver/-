<template>
	<view class="bn-wrap">
		<view class="bn-bar" :class="dark ? 'bn-dark' : 'bn-light'">
			<view v-for="(item, idx) in items" :key="idx" class="bn-item" :class="current === item.key ? 'bn-on' : ''"
				@tap="navigateTo(item)">
				<view class="bn-icon" v-html="getIcon(item.key)"></view>
				<text class="bn-label">{{ item.label }}</text>
			</view>
		</view>
		<view class="bn-safe"></view>
	</view>
</template>

<script>
	import {
		useAuth
	} from '@/stores/auth.js'

	const ICONS = {
		home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
		assess: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>',
		data: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>',
		profile: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
		review: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
		recruit: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
		flow: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25"/></svg>',
		back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>',
		logout: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>',
		personnel: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 017-7h4a7 7 0 017 7v2"/></svg>',
		people: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 017-7h4a7 7 0 017 7v2"/></svg>',
		audit: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
	}

	export default {
		name: 'BottomNav',
		props: {
			items: {
				type: Array,
				default: () => []
			},
			current: {
				type: String,
				default: 'home'
			},
			dark: {
				type: Boolean,
				default: false
			},
		},
		methods: {
			getIcon(key) {
				return ICONS[key] || ICONS.home
			},
			navigateTo(item) {
				if (item.key === 'logout') {
					const auth = useAuth()
					auth.logout()
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				if (item.key === 'back') {
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
					return
				}
				if (item.page) {
					uni.navigateTo({
						url: item.page
					})
				}
				this.$emit('change', item.key)
			},
		},
	}
</script>

<style>
	.bn-wrap {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 200;
		padding-bottom: env(safe-area-inset-bottom)
	}

	.bn-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		padding: 12rpx 0 8rpx
	}

	.bn-light {
		background: rgba(255, 255, 255, .95);
		backdrop-filter: blur(20rpx);
		border-top: 1rpx solid #e2e8f0
	}

	.bn-dark {
		background: rgba(15, 23, 42, .92);
		backdrop-filter: blur(20rpx);
		border-top: 1rpx solid rgba(255, 255, 255, .06)
	}

	.bn-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4rpx;
		padding: 4rpx 28rpx;
		transition: all .15s
	}

	.bn-item:active {
		transform: scale(.95)
	}

	.bn-icon {
		width: 44rpx;
		height: 44rpx;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.bn-light .bn-icon {
		color: #94a3b8
	}

	.bn-dark .bn-icon {
		color: #475569
	}

	.bn-on .bn-icon {
		color: #2563eb
	}

	.bn-dark .bn-on .bn-icon {
		color: #60a5fa
	}

	.bn-on .bn-icon :deep(svg) {
		filter: drop-shadow(0 2rpx 4rpx rgba(37, 99, 235, .3))
	}

	.bn-label {
		font-size: 20rpx;
		font-weight: 500;
		color: #94a3b8
	}

	.bn-dark .bn-label {
		color: #64748b
	}

	.bn-on .bn-label {
		color: #0f172a;
		font-weight: 600
	}

	.bn-dark .bn-on .bn-label {
		color: #e2e8f0
	}
</style>