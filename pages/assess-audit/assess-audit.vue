<template>
	<view class="pg">
		<!-- 顶部导航 -->
		<view class="header">
			<view class="hdr-row">
				<view class="back-btn" @tap="goBack">
					<svg class="s16 ink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
					</svg>
				</view>
				<view>
					<text class="hdr-title">考核达标审核</text>
					<text class="hdr-sub">员工考核结果审定</text>
				</view>
			</view>

			<!-- Tab 切换 -->
			<view class="tabs">
				<view class="tab" :class="tab==='pending' ? 'tab-on' : 'tab-off'" @tap="tab='pending'">
					<text>待审核</text>
					<text class="tab-badge" v-if="pendingCount">{{ pendingCount }}</text>
				</view>
				<view class="tab" :class="tab==='passed' ? 'tab-on' : 'tab-off'" @tap="tab='passed'">
					<text>已达标</text>
				</view>
				<view class="tab" :class="tab==='failed' ? 'tab-on' : 'tab-off'" @tap="tab='failed'">
					<text>不达标</text>
				</view>
			</view>
		</view>

		<view class="main">

			<!-- 统计 -->
			<view class="stats-row">
				<view class="stat-item stat-blue">
					<text class="stat-num">{{ pendingCount }}</text>
					<text class="stat-label">待审核</text>
				</view>
				<view class="stat-item stat-green">
					<text class="stat-num">{{ passedCount }}</text>
					<text class="stat-label">已达标</text>
				</view>
				<view class="stat-item stat-red">
					<text class="stat-num">{{ failedCount }}</text>
					<text class="stat-label">不达标</text>
				</view>
			</view>

			<!-- === 待审核 === -->
			<view v-if="tab==='pending'">
				<view class="empty-state" v-if="list.length === 0">
					<text class="empty-text">暂无待审核的考核</text>
				</view>
				<view class="review-card" v-for="(item, idx) in list" :key="item.id" :style="{animationDelay: (idx*0.06)+'s'}" @tap="goDetail(item.id)">
					<view class="rc-hd">
						<view class="rc-dept">
							<view class="rc-avatar">{{ (item.real_name || '?').charAt(0) }}</view>
							<view>
								<text class="rc-name">{{ item.real_name || item.username }}</text>
								<text class="rc-dept-name">{{ item.dept_name || '未知部门' }}</text>
							</view>
						</view>
						<view class="rc-cycle-tag">{{ item.assess_cycle }}</view>
					</view>

					<view class="rc-requirement" v-if="item.target_remark">
						<text class="rc-label">考核要求：</text>
						<text class="rc-text">{{ item.target_remark }}</text>
					</view>

					<view class="rc-submit-content">
						<text class="rc-label">提交内容：</text>
						<text class="rc-text">{{ item.remark || '暂无内容' }}</text>
					</view>

					<!-- 图片凭证 -->
					<view class="rc-images" v-if="item.images && item.images.length > 0">
						<text class="rc-label">提交凭证：</text>
						<view class="images-grid">
							<image v-for="(img, i2) in item.images" :key="i2" :src="imgFullUrl(img)" class="thumb-img" mode="aspectFill" @tap.stop="previewImage(item.images, i2)" />
						</view>
					</view>

					<view class="rc-time">
						<text>提交时间：{{ item.create_time || '-' }}</text>
					</view>

					<view class="rc-actions">
						<view class="abtn abtn-pass" @tap.stop="onPass(item)">
							<text>达标</text>
						</view>
						<view class="abtn abtn-fail" @tap.stop="onFail(item)">
							<text>不达标</text>
						</view>
					</view>
				</view>
			</view>

			<!-- === 已达标 === -->
			<view v-if="tab==='passed'">
				<view class="empty-state" v-if="list.length === 0">
					<text class="empty-text">暂无达标记录</text>
				</view>
				<view class="review-card done-card" v-for="item in list" :key="item.id" @tap="goDetail(item.id)">
					<view class="rc-hd">
						<view class="rc-dept">
							<view class="rc-avatar rc-avatar-pass">{{ (item.real_name || '?').charAt(0) }}</view>
							<view>
								<text class="rc-name">{{ item.real_name || item.username }}</text>
								<text class="rc-dept-name">{{ item.dept_name || '未知部门' }}</text>
							</view>
						</view>
						<view class="status-tag status-pass">达标</view>
					</view>
					<view class="rc-requirement" v-if="item.target_remark">
						<text class="rc-label">考核要求：</text>
						<text class="rc-text">{{ item.target_remark }}</text>
					</view>
					<view class="rc-submit-content">
						<text class="rc-label">提交内容：</text>
						<text class="rc-text">{{ item.remark || '-' }}</text>
					</view>
					<!-- 图片凭证 -->
					<view class="rc-images" v-if="item.images && item.images.length > 0">
						<text class="rc-label">提交凭证：</text>
						<view class="images-grid">
							<image v-for="(img, i2) in item.images" :key="i2" :src="imgFullUrl(img)" class="thumb-img" mode="aspectFill" @tap.stop="previewImage(item.images, i2)" />
						</view>
					</view>
					<view class="rc-time">
						<text>周期：{{ item.assess_cycle }}</text>
					</view>
				</view>
			</view>

			<!-- === 不达标 === -->
			<view v-if="tab==='failed'">
				<view class="empty-state" v-if="list.length === 0">
					<text class="empty-text">暂无记录</text>
				</view>
				<view class="review-card done-card" v-for="item in list" :key="item.id" @tap="goDetail(item.id)">
					<view class="rc-hd">
						<view class="rc-dept">
							<view class="rc-avatar rc-avatar-fail">{{ (item.real_name || '?').charAt(0) }}</view>
							<view>
								<text class="rc-name">{{ item.real_name || item.username }}</text>
								<text class="rc-dept-name">{{ item.dept_name || '未知部门' }}</text>
							</view>
						</view>
						<view class="status-tag status-fail">不达标</view>
					</view>
					<view class="rc-requirement" v-if="item.target_remark">
						<text class="rc-label">考核要求：</text>
						<text class="rc-text">{{ item.target_remark }}</text>
					</view>
					<view class="rc-submit-content">
						<text class="rc-label">提交内容：</text>
						<text class="rc-text">{{ item.remark || '-' }}</text>
					</view>
					<!-- 图片凭证 -->
					<view class="rc-images" v-if="item.images && item.images.length > 0">
						<text class="rc-label">提交凭证：</text>
						<view class="images-grid">
							<image v-for="(img, i2) in item.images" :key="i2" :src="imgFullUrl(img)" class="thumb-img" mode="aspectFill" @tap.stop="previewImage(item.images, i2)" />
						</view>
					</view>
					<view class="rc-time">
						<text>周期：{{ item.assess_cycle }}</text>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import { api, BASE_URL } from '@/utils/api.js'

	export default {
		data() {
			return {
				tab: 'pending',
				list: [],
				pendingCount: 0,
				passedCount: 0,
				failedCount: 0,
			}
		},

		onShow() {
			this.fetchList()
		},

		watch: {
			tab() {
				this.fetchList()
			}
		},

		methods: {
			goBack() {
				uni.navigateBack()
			},

			goDetail(id) {
				uni.navigateTo({ url: `/pages/assess-audit/detail?id=${id}` })
			},

			async fetchList() {
				try {
					const res = await api.get('/api/admin/oversight/assess-results', { status: this.tab })
					if (res.data) {
						this.list = res.data.list || []
						this.pendingCount = res.data.pendingCount || 0
						this.passedCount = res.data.passedCount || 0
						this.failedCount = res.data.failedCount || 0
					}
				} catch (e) {
					console.error('[assess-audit]', e)
				}
			},

			async onPass(item) {
				uni.showModal({
					title: '确认操作',
					content: `确定将 ${item.real_name || item.username} 标记为【达标】吗？`,
					success: async (res) => {
						if (!res.confirm) return
						try {
							await api.post(`/api/admin/oversight/assess-results/${item.id}/pass`)
							uni.showToast({ title: '已标记为达标', icon: 'success' })
							this.fetchList()
						} catch (e) { /* error shown by api.js */ }
					}
				})
			},

			async onFail(item) {
				uni.showModal({
					title: '确认操作',
					content: `确定将 ${item.real_name || item.username} 标记为【不达标】吗？`,
					success: async (res) => {
						if (!res.confirm) return
						try {
							await api.post(`/api/admin/oversight/assess-results/${item.id}/fail`)
							uni.showToast({ title: '已标记为不达标', icon: 'none' })
							this.fetchList()
						} catch (e) { /* error shown by api.js */ }
					}
				})
			},
			imgFullUrl(path) {
				if (!path) return ''
				if (path.startsWith('http')) return path
				return BASE_URL + '/' + path
			},
			previewImage(paths, index) {
				const urls = paths.map(p => this.imgFullUrl(p))
				uni.previewImage({ current: urls[index] || '', urls })
			},
		}
	}
</script>

<style>
	.pg {
		min-height: 100vh;
		background: #f8fafc;
		font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
	}

	/* Header */
	.header {
		background: #fff;
		padding: 88rpx 32rpx 0;
		border-bottom: 1rpx solid #f1f5f9;
		position: sticky;
		top: 0;
		z-index: 50;
	}
	.hdr-row {
		display: flex;
		align-items: center;
		gap: 16rpx;
		padding: 16rpx 0;
	}
	.back-btn {
		width: 64rpx;
		height: 64rpx;
		border-radius: 16rpx;
		background: #f1f5f9;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.hdr-title { font-size: 30rpx; font-weight: 700; color: #0f172a; display: block }
	.hdr-sub { font-size: 22rpx; color: #94a3b8; margin-top: 2rpx; display: block }

	/* Tabs */
	.tabs {
		display: flex;
		gap: 0;
		padding: 0 0 0;
	}
	.tab {
		flex: 1;
		text-align: center;
		padding: 20rpx 0;
		font-size: 26rpx;
		font-weight: 500;
		position: relative;
	}
	.tab-on {
		color: #2563eb;
		border-bottom: 4rpx solid #2563eb;
	}
	.tab-off { color: #94a3b8 }
	.tab-badge {
		background: #fee2e2;
		color: #dc2626;
		font-size: 20rpx;
		padding: 2rpx 10rpx;
		border-radius: 20rpx;
		margin-left: 8rpx;
		font-weight: 600;
	}

	/* Stats */
	.main { padding: 20rpx 24rpx 40rpx }
	.stats-row {
		display: flex;
		gap: 16rpx;
		margin-bottom: 24rpx;
	}
	.stat-item {
		flex: 1;
		background: #fff;
		border-radius: 16rpx;
		padding: 24rpx 16rpx;
		text-align: center;
		box-shadow: 0 2rpx 12rpx rgba(0,0,0,.03);
	}
	.stat-num { font-size: 44rpx; font-weight: 700; display: block }
	.stat-label { font-size: 22rpx; color: #94a3b8; margin-top: 6rpx; display: block }
	.stat-blue .stat-num { color: #2563eb }
	.stat-green .stat-num { color: #10b981 }
	.stat-red .stat-num { color: #ef4444 }

	/* Cards */
	.empty-state { padding: 80rpx 0; text-align: center }
	.empty-text { font-size: 26rpx; color: #94a3b8 }

	.review-card {
		background: #fff;
		border-radius: 20rpx;
		padding: 24rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0,0,0,.04);
		animation: fadeInUp 0.4s ease both;
	}
	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(16rpx) }
		to { opacity: 1; transform: translateY(0) }
	}
	.done-card { opacity: 0.7 }

	.rc-hd {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16rpx;
	}
	.rc-dept { display: flex; align-items: center; gap: 12rpx }
	.rc-avatar {
		width: 72rpx;
		height: 72rpx;
		border-radius: 18rpx;
		background: #eff6ff;
		color: #2563eb;
		font-size: 28rpx;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.rc-avatar-pass { background: #ecfdf5; color: #10b981 }
	.rc-avatar-fail { background: #fef2f2; color: #ef4444 }
	.rc-name { font-size: 28rpx; font-weight: 600; color: #1e293b; display: block }
	.rc-dept-name { font-size: 22rpx; color: #94a3b8 }
	.rc-cycle-tag {
		font-size: 22rpx;
		color: #64748b;
		background: #f1f5f9;
		padding: 6rpx 16rpx;
		border-radius: 8rpx;
	}
	.status-tag {
		font-size: 22rpx;
		font-weight: 600;
		padding: 6rpx 16rpx;
		border-radius: 8rpx;
	}
	.status-pass { background: #ecfdf5; color: #10b981 }
	.status-fail { background: #fef2f2; color: #ef4444 }

	.rc-requirement, .rc-submit-content {
		background: #f8fafc;
		border-radius: 12rpx;
		padding: 16rpx;
		margin-bottom: 12rpx;
	}
	.rc-label { font-size: 22rpx; color: #64748b; font-weight: 500; display: block; margin-bottom: 6rpx }
	.rc-text { font-size: 26rpx; color: #1e293b; line-height: 1.7 }

	.rc-time {
		font-size: 22rpx;
		color: #94a3b8;
		margin-bottom: 16rpx;
	}

	.rc-actions {
		display: flex;
		gap: 16rpx;
	}
	.abtn {
		flex: 1;
		text-align: center;
		padding: 20rpx 0;
		border-radius: 14rpx;
		font-size: 26rpx;
		font-weight: 600;
		transition: transform .15s;
	}
	.abtn:active { transform: scale(0.97) }
	.abtn-pass { background: #10b981; color: #fff }
	.abtn-fail { background: #f1f5f9; color: #ef4444; border: 2rpx solid #fee2e2 }

	.s16 { width: 32rpx; height: 32rpx; flex-shrink: 0 }
	.ink-600 { color: #475569 }

	/* 图片凭证 */
	.rc-images {
		margin-bottom: 12rpx;
	}
	.images-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 12rpx;
		margin-top: 8rpx;
	}
	.thumb-img {
		width: 160rpx;
		height: 160rpx;
		border-radius: 12rpx;
		background: #f1f5f9;
	}
</style>
