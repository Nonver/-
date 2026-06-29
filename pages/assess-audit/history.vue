<template>
	<view class="pg">
		<!-- Header -->
		<view class="hdr">
			<view class="hdr-row">
				<view class="back-btn" @tap="goBack">
					<svg class="s16 ink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
					</svg>
				</view>
				<view>
					<text class="hdr-title">考核历史</text>
					<text class="hdr-sub">员工历史考核记录查询</text>
				</view>
			</view>
		</view>

		<!-- 搜索 & 筛选 -->
		<view class="filter-bar">
			<view class="search-row">
				<svg class="s14 search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
				</svg>
				<input class="search-input" v-model="keyword" placeholder="输入姓名或手机号搜索" placeholder-class="ph" @input="onSearchInput" />
				<text class="search-clear" v-if="keyword" @tap="keyword=''; fetchList(true)">✕</text>
			</view>

			<view class="filter-row">
				<picker :range="deptLabels" :value="deptIndex" @change="onDeptChange" class="filter-picker-wrap">
					<view class="filter-picker">
						<text :class="deptIndex >= 0 ? 'fp-selected' : 'fp-placeholder'">{{ deptIndex >= 0 ? deptLabels[deptIndex] : '全部部门' }}</text>
						<svg class="s12 gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
						</svg>
					</view>
				</picker>

				<picker mode="date" fields="month" :value="period" @change="onPeriodChange" class="filter-picker-wrap">
					<view class="filter-picker">
						<text :class="period ? 'fp-selected' : 'fp-placeholder'">{{ period || '全部月份' }}</text>
						<svg class="s12 gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
						</svg>
					</view>
				</picker>

				<view class="filter-reset" v-if="keyword || deptIndex >= 0 || period" @tap="resetFilters">
					<text>重置</text>
				</view>
			</view>
		</view>

		<view class="main">
			<!-- 结果统计 -->
			<view class="result-summary" v-if="list.length > 0">
				<text>共 <text class="rs-num">{{ total }}</text> 条记录</text>
			</view>

			<!-- 历史列表 -->
			<view class="history-list" v-if="list.length > 0">
				<view class="history-card" v-for="item in list" :key="item.id">
					<view class="hc-hd">
						<view class="hc-user">
							<view class="hc-avatar" :class="item.is_passed ? 'av-pass' : (item.audit_status === 0 ? 'av-fail' : '')">
								{{ (item.real_name || '?').charAt(0) }}
							</view>
							<view>
								<text class="hc-name">{{ item.real_name || item.username }}</text>
								<view class="hc-sub-row">
									<text class="hc-dept">{{ item.dept_name || '未知部门' }}</text>
									<text class="hc-phone">{{ item.username || '-' }}</text>
								</view>
							</view>
						</view>
						<view class="status-tag" :class="statusCls(item)">{{ statusLabel(item) }}</view>
					</view>

					<view class="hc-body">
						<view class="hc-info-row">
							<text class="hc-lbl">考核周期</text>
							<text class="hc-val">{{ item.assess_cycle || '-' }}</text>
						</view>
						<view class="hc-info-row" v-if="item.target_remark">
							<text class="hc-lbl">考核要求</text>
							<text class="hc-val">{{ item.target_remark }}</text>
						</view>
						<view class="hc-info-row" v-if="item.remark">
							<text class="hc-lbl">提交内容</text>
							<text class="hc-val hc-remark">{{ item.remark }}</text>
						</view>
						<view class="hc-info-row">
							<text class="hc-lbl">提交时间</text>
							<text class="hc-val">{{ item.create_time || '-' }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view class="empty-state" v-if="!loading && list.length === 0">
				<svg class="s56 empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
					<path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
				</svg>
				<text class="empty-text">暂无历史考核记录</text>
			</view>

			<!-- 加载更多 -->
			<view class="load-more" v-if="hasMore && !loadingMore">
				<text class="lm-btn" @tap="loadMore">加载更多</text>
			</view>
			<view class="load-more" v-if="loadingMore">
				<text class="lm-text">加载中...</text>
			</view>
			<view class="load-more" v-if="!hasMore && list.length > 0">
				<text class="lm-text">— 已加载全部 —</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { api } from '@/utils/api.js'

	export default {
		data() {
			return {
				keyword: '',
				deptLabels: [],
				deptValues: [],
				deptIndex: -1,
				period: '',
				list: [],
				total: 0,
				page: 1,
				perPage: 5,
				hasMore: true,
				loading: false,
				loadingMore: false,
				searchTimer: null,
			}
		},

		onShow() {
			this.$checkAuth()
			this.fetchList(true)
		},

		methods: {
			goBack() { uni.navigateBack() },

			async fetchList(reset = false) {
				if (this.loading && !reset) return
				if (reset) {
					this.page = 1
					this.hasMore = true
				}
				this.loading = !reset
				this.loadingMore = !reset

				try {
					const params = {
						page: this.page,
						keyword: this.keyword,
						dept_id: this.deptIndex >= 0 ? this.deptValues[this.deptIndex] : '',
						period: this.period,
					}
					const res = await api.get('/api/admin/oversight/assess-history', params)
					if (res.data) {
						if (reset) {
							this.list = res.data.list || []
							this.total = res.data.total || 0
							if (!this.deptLabels.length && res.data.departments) {
								this.deptLabels = res.data.departments.map(d => d.dept_name)
								this.deptValues = res.data.departments.map(d => d.id)
							}
						} else {
							this.list = [...this.list, ...(res.data.list || [])]
						}
						this.hasMore = this.list.length < (res.data.total || 0)
					}
				} catch (e) {
					console.error('[history]', e)
				}
				this.loading = false
				this.loadingMore = false
			},

			loadMore() {
				if (this.loadingMore || !this.hasMore) return
				this.page++
				this.fetchList(false)
			},

			onSearchInput() {
				clearTimeout(this.searchTimer)
				this.searchTimer = setTimeout(() => {
					this.fetchList(true)
				}, 400)
			},

			onDeptChange(e) {
				this.deptIndex = parseInt(e.detail.value)
				this.fetchList(true)
			},

			onPeriodChange(e) {
				this.period = e.detail.value
				this.fetchList(true)
			},

			resetFilters() {
				this.keyword = ''
				this.deptIndex = -1
				this.period = ''
				this.fetchList(true)
			},

			statusCls(item) {
				if (item.is_passed == 1) return 'tag-pass'
				if (item.audit_status == 0 && item.remark) return 'tag-fail'
				if (item.audit_status == 2) return 'tag-pending'
				return 'tag-none'
			},

			statusLabel(item) {
				if (item.is_passed == 1) return '达标'
				if (item.audit_status == 0 && item.remark) return '不达标'
				if (item.audit_status == 2) return '待审核'
				return '未提交'
			},
		}
	}
</script>

<style>
	.pg { min-height: 100vh; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif; }

	/* Header */
	.hdr { background: #fff; padding: 88rpx 32rpx 0; border-bottom: 1rpx solid #f1f5f9; position: sticky; top: 0; z-index: 50 }
	.hdr-row { display: flex; align-items: center; gap: 16rpx; padding: 16rpx 0 }
	.back-btn { width: 64rpx; height: 64rpx; border-radius: 16rpx; background: #f1f5f9; display: flex; align-items: center; justify-content: center }
	.hdr-title { font-size: 30rpx; font-weight: 700; color: #0f172a; display: block }
	.hdr-sub { font-size: 22rpx; color: #94a3b8; margin-top: 2rpx; display: block }
	.s16 { width: 32rpx; height: 32rpx; flex-shrink: 0 }
	.s14 { width: 28rpx; height: 28rpx; flex-shrink: 0 }
	.s12 { width: 24rpx; height: 24rpx; flex-shrink: 0 }
	.s56 { width: 112rpx; height: 112rpx; flex-shrink: 0 }
	.ink-600 { color: #475569 }
	.gray-400 { color: #94a3b8 }

	/* Filter Bar */
	.filter-bar { background: #fff; padding: 16rpx 24rpx; border-bottom: 1rpx solid #f1f5f9 }
	.search-row {
		display: flex; align-items: center;
		background: #f1f5f9; border-radius: 16rpx;
		padding: 0 16rpx; margin-bottom: 16rpx;
	}
	.search-icon { margin-right: 10rpx; color: #94a3b8 }
	.search-input {
		flex: 1; height: 72rpx; font-size: 26rpx; color: #1e293b;
		background: transparent;
	}
	.ph { color: #94a3b8; font-size: 26rpx }
	.search-clear {
		font-size: 24rpx; color: #94a3b8;
		padding: 8rpx; margin-left: 8rpx;
	}

	.filter-row { display: flex; align-items: center; gap: 16rpx }
	.filter-picker-wrap { flex: 1 }
	.filter-picker {
		display: flex; align-items: center; justify-content: space-between;
		height: 64rpx; background: #f1f5f9; border-radius: 12rpx;
		padding: 0 16rpx;
	}
	.fp-selected { font-size: 24rpx; color: #1e293b; font-weight: 500 }
	.fp-placeholder { font-size: 24rpx; color: #94a3b8 }
	.filter-reset {
		flex-shrink: 0; padding: 0 12rpx;
		font-size: 24rpx; color: #2563eb; font-weight: 500;
	}

	/* Main */
	.main { padding: 20rpx 24rpx 80rpx }

	/* Result */
	.result-summary { padding: 8rpx 0 16rpx; font-size: 22rpx; color: #94a3b8 }
	.rs-num { color: #475569; font-weight: 600 }

	/* History Cards */
	.history-card {
		background: #fff; border-radius: 20rpx;
		padding: 28rpx; margin-bottom: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0,0,0,.03);
	}
	.hc-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20rpx }
	.hc-user { display: flex; align-items: center; gap: 14rpx; flex: 1; min-width: 0 }
	.hc-avatar {
		width: 72rpx; height: 72rpx; border-radius: 18rpx;
		background: #eff6ff; color: #2563eb;
		font-size: 28rpx; font-weight: 700;
		display: flex; align-items: center; justify-content: center;
		flex-shrink: 0;
	}
	.av-pass { background: #ecfdf5; color: #10b981 }
	.av-fail { background: #fef2f2; color: #ef4444 }
	.hc-name { font-size: 28rpx; font-weight: 600; color: #1e293b; display: block }
	.hc-sub-row { display: flex; align-items: center; gap: 12rpx; margin-top: 4rpx }
	.hc-dept { font-size: 22rpx; color: #94a3b8 }
	.hc-phone { font-size: 22rpx; color: #64748b }

	.status-tag { font-size: 22rpx; font-weight: 600; padding: 6rpx 16rpx; border-radius: 8rpx; flex-shrink: 0 }
	.tag-pass { background: #ecfdf5; color: #10b981 }
	.tag-fail { background: #fef2f2; color: #ef4444 }
	.tag-pending { background: #eff6ff; color: #2563eb }
	.tag-none { background: #f1f5f9; color: #94a3b8 }

	.hc-body {}
	.hc-info-row { display: flex; align-items: flex-start; margin-bottom: 14rpx }
	.hc-info-row:last-child { margin-bottom: 0 }
	.hc-lbl { font-size: 24rpx; color: #94a3b8; width: 120rpx; flex-shrink: 0 }
	.hc-val { font-size: 26rpx; color: #1e293b; flex: 1; line-height: 1.5 }
	.hc-remark { color: #475569; white-space: pre-wrap }

	/* Empty */
	.empty-state { display: flex; flex-direction: column; align-items: center; padding-top: 200rpx }
	.empty-icon { color: #cbd5e1; margin-bottom: 24rpx }
	.empty-text { font-size: 26rpx; color: #94a3b8 }

	/* Load More */
	.load-more { text-align: center; padding: 32rpx 0 }
	.lm-btn {
		display: inline-block; font-size: 26rpx; color: #2563eb; font-weight: 500;
		padding: 16rpx 48rpx; background: #eff6ff; border-radius: 12rpx;
	}
	.lm-text { font-size: 24rpx; color: #94a3b8 }
</style>
