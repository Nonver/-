<template>
	<view class="pg">
		<!-- 顶栏 -->
		<view class="topbar">
			<view class="topbar-inner">
				<view class="tbl">
					<view class="tbl-back" @tap="goBack">
						<svg class="s16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<polyline points="15 18 9 12 15 6" />
						</svg>
					</view>
					<text class="tbl-title">考核状态</text>
				</view>
			</view>
			<!-- 状态筛选tab -->
			<view class="tab-bar">
				<view v-for="(t, i) in tabs" :key="i" :class="'tab-item ' + (tabIndex === i ? 'tab-on' : '')" @tap="onTab(i)">
					{{ t }}
				</view>
			</view>
		</view>

		<!-- 列表 -->
		<view class="main">
			<view v-if="loading" class="loading-wrap"><text class="loading-text">加载中...</text></view>

			<view v-else-if="list.length === 0" class="empty-wrap">
				<view class="empty-icon">
					<svg class="s40" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="1.5">
						<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
						<polyline points="14 2 14 8 20 8"/>
						<line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
					</svg>
				</view>
				<text class="empty-text">暂无考核记录</text>
			</view>

			<view v-else class="list-wrap">
				<view v-for="(item, idx) in list" :key="item.id" class="card anim-fade" :style="'animation-delay:' + (idx * 0.06) + 's'">
					<view class="card-top">
						<view class="card-dept">
							<view class="dept-dot" :class="deptDotCls(item.dept_id)"></view>
							<text class="dept-name">{{ item.dept_name }}</text>
						</view>
						<view class="card-status" :class="statusCls(item.show_status)">{{ item.show_status }}</view>
					</view>
					<view class="card-body">
						<view class="card-row">
							<text class="card-label">考核周期</text>
							<text class="card-val">{{ item.assess_cycle }}</text>
						</view>
						<view class="card-row" v-if="item.target_remark">
							<text class="card-label">考核目标</text>
							<text class="card-val">{{ item.target_remark }}</text>
						</view>
						<view class="card-row">
							<text class="card-label">发布时间</text>
							<text class="card-val">{{ fmtDate(item.publish_time) }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { api } from '@/utils/api.js'

	const COLORS = ['#2E75B6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444', '#6366F1']

	export default {
		data() {
			return {
				tabs: ['全部', '待初审', '待终审', '已通过', '驳回'],
				tabIndex: 0,
				list: [],
				loading: false,
			}
		},
		onShow() {
			this.$checkAuth()
			this.fetchList()
		},
		methods: {
			goBack() { this.$smartBack ? this.$smartBack() : uni.navigateBack() },
			onTab(i) { this.tabIndex = i; this.fetchList() },
			deptDotCls(deptId) {
				return 'dd-' + ((deptId || 1) % 7)
			},
			statusCls(s) {
				const m = { '待初审': 's-pending', '待终审': 's-review', '已通过': 's-pass', '已驳回': 's-reject', '完结': 's-done' }
				return m[s] || 's-pending'
			},
			fmtDate(dt) {
				if (!dt) return '-'
				return dt.slice(0, 10)
			},
			async fetchList() {
				this.loading = true
				try {
					const params = {}
					if (this.tabIndex > 0) params.status = this.tabIndex // 1=待初审,2=待终审,3=已通过,4=驳回
					const res = await api.get('/api/admin/hr/assessments/my-publish', params)
					this.list = res.data || []
				} catch (e) {
					console.error(e)
				} finally {
					this.loading = false
				}
			}
		},
	}
</script>

<style scoped>
	.pg{width:100%;min-height:100vh;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;-webkit-font-smoothing:antialiased}
	.s16{width:32rpx;height:32rpx;flex-shrink:0}
	.s40{width:80rpx;height:80rpx;flex-shrink:0}

	.topbar{background:#fff;border-bottom:1rpx solid #E4E7EC;position:sticky;top:0;z-index:50}
	.topbar-inner{display:flex;align-items:center;padding:24rpx 32rpx}
	.tbl{display:flex;align-items:center;gap:16rpx}
	.tbl-back{width:60rpx;height:60rpx;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#F1F5F9}
	.tbl-title{font-size:32rpx;font-weight:700;color:#1a1a1a}

	.tab-bar{display:flex;padding:0 32rpx 20rpx;gap:12rpx}
	.tab-item{font-size:24rpx;font-weight:500;color:#868E96;padding:12rpx 28rpx;border-radius:20rpx;background:#F8FAFC;transition:all .2s}
	.tab-on{background:#2E75B6;color:#fff;font-weight:600}

	.main{padding:24rpx 32rpx}
	.loading-wrap{text-align:center;padding:120rpx 0}
	.loading-text{font-size:26rpx;color:#94A3B8}

	.empty-wrap{display:flex;flex-direction:column;align-items:center;padding:120rpx 32rpx;background:#fff;border-radius:24rpx;border:1rpx solid #E4E7EC}
	.empty-icon{margin-bottom:24rpx}
	.empty-text{font-size:26rpx;color:#94A3B8}

	.card{background:#fff;border-radius:24rpx;border:1rpx solid #E4E7EC;padding:28rpx;margin-bottom:20rpx}
	.card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:20rpx}
	.card-dept{display:flex;align-items:center;gap:12rpx}
	.dept-dot{width:16rpx;height:16rpx;border-radius:50%}
	.dd-0{background:#2E75B6}.dd-1{background:#10B981}.dd-2{background:#F59E0B}.dd-3{background:#8B5CF6}.dd-4{background:#EC4899}.dd-5{background:#EF4444}.dd-6{background:#6366F1}
	.dept-name{font-size:26rpx;font-weight:600;color:#1a1a1a}
	.card-status{font-size:22rpx;font-weight:600;padding:6rpx 20rpx;border-radius:12rpx}
	.s-pending{background:#FEF3C7;color:#92400E}
	.s-review{background:#DBEAFE;color:#1E40AF}
	.s-pass{background:#D1FAE5;color:#065F46}
	.s-done{background:#F1F5F9;color:#475569}
	.s-reject{background:#FEE2E2;color:#991B1B}

	.card-body{display:flex;flex-direction:column;gap:12rpx}
	.card-row{display:flex;justify-content:space-between;align-items:center}
	.card-label{font-size:24rpx;color:#94A3B8}
	.card-val{font-size:24rpx;font-weight:500;color:#334155}

	@keyframes fadeIn{from{opacity:0;transform:translateY(16rpx)}to{opacity:1;transform:translateY(0)}}
	.anim-fade{animation:fadeIn .35s cubic-bezier(.16,1,.3,1) forwards;opacity:0}
</style>
