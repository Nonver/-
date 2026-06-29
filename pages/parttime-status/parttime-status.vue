<template>
	<view class="pg">

		<!-- Header -->
		<view class="hdr">
			<view class="hdr-inner">
				<view class="hdr-btn" @tap="goBack">
					<svg class="s20 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg>
				</view>
				<text class="hdr-title">入职状态管理</text>
				<view class="hdr-btn-placeholder"></view>
			</view>
		</view>

		<!-- Main -->
		<view class="main">

			<!-- Stats -->
			<view class="stats-bar">
				<text class="stats-bar-text">待入职主播：<text class="stats-bar-num">{{ totalCount }}</text> 人</text>
			</view>

			<!-- Search -->
			<view class="search-box">
				<svg class="s16 search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<input class="search-input" type="text" v-model="keyword" placeholder="搜索主播ID/昵称/姓名/手机号"
					placeholder-class="input-placeholder" @confirm="onSearch" />
				<text class="search-clear" v-if="keyword" @tap="clearSearch">清除</text>
			</view>

			<!-- List -->
			<view v-if="loading" class="list-empty"><text class="le-text">加载中...</text></view>

			<view v-else-if="anchorList.length === 0" class="list-empty">
				<text class="le-text">{{ keyword ? '无匹配结果' : '暂无待入职主播' }}</text>
			</view>

			<view v-for="(a, i) in anchorList" :key="i" class="anchor-card card-shadow" @tap="openDetail(a)">
				<view class="ac-body">
					<view class="ac-avatar-box" v-if="a.photo">
						<image class="ac-avatar" :src="photoUrl(a.photo)" mode="aspectFill" />
					</view>
					<view class="ac-avatar-box ac-avatar-empty" v-else>
						<text class="ac-avatar-txt">{{ (a.real_name || a.nickname || '?').charAt(0) }}</text>
					</view>
					<view class="ac-left">
						<view class="ac-name-row">
							<text class="ac-name">{{ a.real_name || a.nickname }}</text>
							<view class="ac-tag tag-yellow">待入职</view>
						</view>
						<view class="ac-info">
							<text class="ac-info-text" v-if="a.nickname">昵称: {{ a.nickname }}</text>
							<text class="ac-info-text">ID: {{ a.anchor_id || '-' }}</text>
							<text class="ac-info-text">手机: {{ a.phone }}</text>
						</view>
						<text class="ac-time">添加时间: {{ fmtDate(a.create_time) }}</text>
					</view>
					<view class="ac-actions">
						<view class="ac-btn ac-btn-confirm" @tap.stop="confirmEnroll(a)">确认入职</view>
					</view>
				</view>
			</view>

			<view class="spacer"></view>
		</view>

		<!-- Toast -->
		<view class="toast" :class="toastVisible?'toast-show':''">
			<text class="toast-text">{{ toastMsg }}</text>
		</view>
	</view>
</template>

<script>
	import {
		useAuth
	} from '@/stores/auth.js'
	import {
		api, BASE_URL
	} from '@/utils/api.js'
	const auth = useAuth()

	function fmtDate(dt) {
		if (!dt) return ''
		return dt.slice(0, 10).replace(/-/g, '.')
	}

	export default {
		data() {
			return {
				totalCount: 0,
				anchorList: [],
				loading: false,
				keyword: '',
				toastVisible: false,
				toastMsg: '',
			}
		},
		onShow() {
			this.$checkAuth()
			this.fetchData()
		},
		methods: {
			async fetchData() {
				this.loading = true
				try {
					const params = {
						status: 2,
						per_page: 200
					}
					if (this.keyword) params.keyword = this.keyword
					const res = await api.get('/api/admin/parttime-anchor/list', params)
					this.anchorList = (res.data && res.data.list) || []
					this.totalCount = (res.data && res.data.total) || this.anchorList.length
				} catch (e) {
					console.error('[入职管理] list:', e)
				} finally {
					this.loading = false
				}
			},

			onSearch() {
				this.fetchData()
			},

			clearSearch() {
				this.keyword = ''
				this.fetchData()
			},

			confirmEnroll(a) {
				uni.showModal({
					title: '确认入职',
					content: '确定将 ' + (a.real_name || a.nickname) + ' 入职为在岗状态吗？',
					success: async (res) => {
						if (!res.confirm) return
						try {
							await api.put('/api/admin/parttime-anchor/' + a.id + '/status', {
								status: 1
							})
							this.showToast('已入职成功')
							this.fetchData()
						} catch (e) {
							/* api.js 已弹 toast */
						}
					},
				})
			},

			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},

			openDetail(a) {
				uni.navigateTo({ url: '/pages/parttime-detail/parttime-detail?id=' + a.id })
			},

			photoUrl(url) {
				if (!url) return ''
				if (url.startsWith('http') || url.startsWith('data:')) return url
				return BASE_URL + url
			},

			showToast(msg) {
				this.toastMsg = msg
				this.toastVisible = true
				clearTimeout(this._tt)
				this._tt = setTimeout(() => {
					this.toastVisible = false
				}, 2000)
			},

			fmtDate,
		},
	}
</script>

<style>
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #fff;
		font-family: -apple-system, BlinkMacSystemFont, 'Noto Sans SC', 'PingFang SC', sans-serif;
		-webkit-font-smoothing: antialiased
	}

	.s16 {
		width: 32rpx;
		height: 32rpx;
		flex-shrink: 0
	}

	.s20 {
		width: 40rpx;
		height: 40rpx;
		flex-shrink: 0
	}

	.text-secondary {
		color: #475569
	}

	/* Avatar */
	.ac-avatar-box {
		width: 88rpx; height: 88rpx; border-radius: 20rpx;
		overflow: hidden; flex-shrink: 0;
	}
	.ac-avatar-empty {
		background: linear-gradient(135deg, #EEF2FF, #E0E7FF);
		display: flex; align-items: center; justify-content: center;
	}
	.ac-avatar-txt { font-size: 36rpx; font-weight: 700; color: #6366F1 }
	.ac-avatar { width: 100%; height: 100% }

	/* Header */
	.hdr {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.08);
	}

	.hdr-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 112rpx;
		padding: 0 40rpx;
		padding-top: 48rpx;
	}

	.hdr-btn {
		width: 48rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 20rpx
	}

	.hdr-btn:active {
		background: #f9fafb
	}

	.hdr-btn-placeholder {
		width: 48rpx
	}

	.hdr-title {
		font-size: 32rpx;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: #0F172A
	}

	/* Main */
	.main {
		padding: 32rpx 40rpx 80rpx
	}

	.spacer {
		height: 64rpx
	}

	/* Stats bar */
	.stats-bar {
		background: #FFFBEB;
		border: 1rpx solid #FDE68A;
		border-radius: 20rpx;
		padding: 24rpx 28rpx;
		margin-bottom: 24rpx;
	}

	.stats-bar-text {
		font-size: 24rpx;
		color: #92400E;
		font-weight: 500
	}

	.stats-bar-num {
		font-size: 28rpx;
		font-weight: 700;
		color: #D97706
	}

	/* Search */
	.search-box {
		display: flex;
		align-items: center;
		background: #F7F8FA;
		border: 1rpx solid #E4E7EC;
		border-radius: 20rpx;
		padding: 0 20rpx;
		height: 80rpx;
		margin-bottom: 24rpx;
	}

	.search-icon {
		color: #ADB5BD;
		margin-right: 12rpx
	}

	.search-input {
		flex: 1;
		font-size: 26rpx;
		color: #1a1a1a;
		height: 100%
	}

	.input-placeholder {
		color: #ADB5BD
	}

	.search-clear {
		font-size: 22rpx;
		color: #2563EB;
		font-weight: 500;
		padding: 0 8rpx
	}

	/* Card shadow */
	.card-shadow {
		box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06), 0 0 2rpx rgba(0, 0, 0, 0.04);
	}

	/* List */
	.list-empty {
		padding: 60rpx 0;
		text-align: center
	}

	.le-text {
		font-size: 24rpx;
		color: #ADB5BD
	}

	.anchor-card {
		background: #fff;
		border-radius: 20rpx;
		padding: 24rpx 28rpx;
		margin-bottom: 16rpx;
		border: 1rpx solid #E4E7EC;
	}

	.ac-body {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16rpx
	}

	.ac-left {
		flex: 1;
		min-width: 0
	}

	.ac-name-row {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 10rpx;
		flex-wrap: wrap
	}

	.ac-name {
		font-size: 28rpx;
		font-weight: 700;
		color: #1a1a1a
	}

	.ac-tag {
		font-size: 18rpx;
		font-weight: 600;
		padding: 4rpx 14rpx;
		border-radius: 8rpx;
	}

	.tag-yellow {
		background: #FFFBEB;
		color: #D97706;
		border: 1rpx solid #FDE68A
	}

	.ac-info {
		display: flex;
		gap: 20rpx;
		margin-bottom: 8rpx;
		flex-wrap: wrap
	}

	.ac-info-text {
		font-size: 22rpx;
		color: #6C757D
	}

	.ac-time {
		font-size: 20rpx;
		color: #ADB5BD
	}

	.ac-actions {
		display: flex;
		gap: 12rpx;
		flex-shrink: 0;
		margin-top: 4rpx
	}

	.ac-btn {
		padding: 10rpx 24rpx;
		border-radius: 12rpx;
		font-size: 22rpx;
		font-weight: 500;
		background: #F0F5F9;
		color: #2D5A7B;
		border: 1rpx solid #D9E6F0;
	}

	.ac-btn:active {
		opacity: 0.7
	}

	.ac-btn-confirm {
		background: #ECFDF5;
		color: #059669;
		border: 1rpx solid #A7F3D0
	}

	/* Toast */
	.toast {
		position: fixed;
		top: 160rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 200;
		background: rgba(31, 41, 55, 0.92);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		padding: 18rpx 40rpx;
		border-radius: 9999rpx;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.toast-show {
		opacity: 1
	}

	.toast-text {
		color: #fff;
		font-size: 22rpx;
		font-weight: 500
	}
</style>