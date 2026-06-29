<template>
	<view class="pg">
		<!-- Header -->
		<view class="hdr">
			<view class="hdr-inner">
				<view class="hdr-btn" @tap="goBack">
					<svg class="s20 gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
				</view>
				<text class="hdr-text">{{ userName }}</text>
				<view class="hdr-btn"></view>
			</view>
		</view>

		<!-- Stats -->
		<view class="stats-row">
			<view class="stat-card">
				<text class="stat-num">{{ totalCycles }}</text>
				<text class="stat-lbl">总周期</text>
			</view>
			<view class="stat-card">
				<text class="stat-num num-green">{{ passedTimes }}</text>
				<text class="stat-lbl">已达标</text>
			</view>
			<view class="stat-card">
				<text class="stat-num num-red">{{ failedTimes }}</text>
				<text class="stat-lbl">不达标</text>
			</view>
		</view>

		<!-- 不达标汇总提示 -->
		<view v-if="failedTimes >= 5" class="warn-banner">
			<svg class="s16 white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
			</svg>
			<text class="warn-text">该人员已累计 {{ failedTimes }} 次不达标，建议考虑劝退处理</text>
		</view>

		<!-- 考核周期列表 -->
		<view class="list-title">考核周期记录</view>
		<view class="cycle-list">
			<view v-for="(r, i) in records" :key="i" class="cycle-card" :class="r.is_passed ? 'cycle-passed' : 'cycle-failed'">
				<view class="cycle-left">
					<view class="cycle-badge" :class="r.is_passed ? 'badge-pass' : 'badge-fail'">
						<text>{{ r.is_passed ? '达标' : '不达标' }}</text>
					</view>
				</view>
				<view class="cycle-mid">
					<text class="cycle-period">{{ r.assess_cycle }}</text>
					<text class="cycle-dept">部门ID: {{ r.dept_id }}</text>
				</view>
				<view class="cycle-right">
					<text class="cycle-score" :class="r.is_passed ? 'score-pass' : 'score-fail'">{{ r.score ?? '-' }} 分</text>
				</view>
			</view>
		</view>

		<view v-if="!loading && records.length === 0" class="empty-tip">
			<text>暂无考核记录</text>
		</view>

		<view class="pg-spacer"></view>
	</view>
</template>

<script>
	import { api } from '@/utils/api.js'

	export default {
		data() {
			return {
				userId: 0,
				userName: '',
				totalCycles: 0,
				passedTimes: 0,
				failedTimes: 0,
				records: [],
				loading: false,
			}
		},
		onLoad(options) {
			this.userId = parseInt(options.userId) || 0
			this.userName = decodeURIComponent(options.userName || '人员详情')
			if (this.userId) {
				this.fetchMemberHistory()
			}
		},
		onShow() {
			this.$checkAuth && this.$checkAuth()
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			async fetchMemberHistory() {
				this.loading = true
				try {
					const res = await api.get('/api/admin/hr/kpi/member-history/' + this.userId, null, { silent: true })
					if (res.code === 200 && res.data) {
						const d = res.data
						this.totalCycles = d.totalCycles || 0
						this.passedTimes = d.passedTimes || 0
						this.failedTimes = d.failedTimes || 0
						this.records = d.records || []
					}
				} catch (e) {
					console.error('[考核详情] 获取失败:', e)
				} finally {
					this.loading = false
				}
			},
		},
	}
</script>

<style scoped>
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #f0f2f5;
		font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased;
		padding-bottom: 60rpx;
	}
	.s16 { width: 32rpx; height: 32rpx; flex-shrink: 0 }
	.s20 { width: 40rpx; height: 40rpx; flex-shrink: 0 }

	/* Header */
	.hdr {
		background: #fff;
		padding: 0 32rpx;
		padding-top: env(safe-area-inset-top, 44rpx);
		box-shadow: 0 1px 4px rgba(0,0,0,0.04);
	}
	.hdr-inner {
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.hdr-btn {
		width: 64rpx; height: 64rpx;
		display: flex; align-items: center; justify-content: center;
	}
	.hdr-text {
		font-size: 34rpx; font-weight: 600; color: #1e293b;
	}

	/* Stats */
	.stats-row {
		display: flex;
		padding: 24rpx 24rpx 0;
		gap: 16rpx;
	}
	.stat-card {
		flex: 1;
		background: #fff;
		border-radius: 16rpx;
		padding: 24rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.stat-num {
		font-size: 44rpx; font-weight: 700; color: #334155;
	}
	.num-green { color: #16a34a }
	.num-red { color: #ef4444 }
	.stat-lbl {
		font-size: 24rpx; color: #94a3b8; margin-top: 8rpx;
	}

	/* Warn */
	.warn-banner {
		margin: 24rpx 24rpx 0;
		background: #fef2f2;
		border: 1px solid #fecaca;
		border-radius: 12rpx;
		padding: 20rpx 24rpx;
		display: flex;
		align-items: center;
		gap: 12rpx;
	}
	.warn-banner .s16 {
		color: #ef4444; width: 32rpx; height: 32rpx;
	}
	.white { color: #ef4444 !important }
	.warn-text {
		font-size: 26rpx; color: #dc2626; flex: 1;
	}

	/* List */
	.list-title {
		font-size: 28rpx; font-weight: 600; color: #64748b;
		padding: 32rpx 32rpx 16rpx;
	}
	.cycle-list {
		padding: 0 24rpx;
	}
	.cycle-card {
		background: #fff;
		border-radius: 14rpx;
		padding: 24rpx;
		margin-bottom: 16rpx;
		display: flex;
		align-items: center;
	}
	.cycle-passed {
		border-left: 6rpx solid #16a34a;
	}
	.cycle-failed {
		border-left: 6rpx solid #ef4444;
	}
	.cycle-badge {
		padding: 6rpx 16rpx;
		border-radius: 8rpx;
		font-size: 22rpx; font-weight: 600;
	}
	.badge-pass { background: #dcfce7; color: #166534 }
	.badge-fail { background: #fee2e2; color: #991b1b }
	.cycle-mid {
		flex: 1; margin-left: 20rpx;
	}
	.cycle-period {
		font-size: 28rpx; font-weight: 600; color: #1e293b; display: block;
	}
	.cycle-dept {
		font-size: 22rpx; color: #94a3b8; margin-top: 4rpx; display: block;
	}
	.cycle-score {
		font-size: 32rpx; font-weight: 700;
	}
	.score-pass { color: #16a34a }
	.score-fail { color: #ef4444 }

	.empty-tip {
		text-align: center; padding: 80rpx 0; font-size: 28rpx; color: #94a3b8;
	}
	.pg-spacer { height: 120rpx }
</style>
