<template>
	<view class="pg">
		<!-- Header -->
		<view class="hdr">
			<view class="hdr-top">
				<view class="hdr-back" @tap="goBack">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
				</view>
				<view class="hdr-titles">
					<text class="hdr-title">我的考核</text>
					<text class="hdr-sub">{{ deptName || '加载中...' }}</text>
				</view>
				<view class="hdr-role-tag">{{ roleLabel }}</view>
			</view>
		</view>

		<!-- 状态筛选 -->
		<view class="filter-bar">
			<view class="filter-scroll">
				<view v-for="f in filters" :key="f.key" class="filter-btn" :class="currentFilter===f.key ? 'filter-on' : 'filter-off'" @tap="filterStatus(f.key)">
					<text>{{ f.label }}</text>
				</view>
			</view>
		</view>

		<!-- 考核卡片列表 -->
		<view v-if="filteredList.length > 0" class="main">
			<view v-for="item in filteredList" :key="item.id" class="card card-press" @tap="goDetail(item.id)">
				<view class="card-top">
					<view class="card-top-l">
						<text class="card-name">{{ item.name }}</text>
						<text class="card-period">{{ item.period }}</text>
					</view>
					<view class="status-tag" :class="statusCfg(item.status).cls">
						<view class="status-dot" :class="statusCfg(item.status).dot"></view>
						<text>{{ statusCfg(item.status).label }}</text>
					</view>
				</view>

				<view class="card-target">
					<text class="target-tag">{{ item.target }}</text>
					<text class="target-time" v-if="item.publish_time">{{ fmtTime(item.publish_time) }}</text>
				</view>

				<view class="card-progress">
					<view class="progress-hd">
						<text class="progress-label">部门进度</text>
						<text class="progress-val" :class="progressCls(item.progress)">{{ item.progress }}%</text>
					</view>
					<view class="bar"><view class="bar-fill" :class="progressBarCls(item.progress)" :style="'width:'+item.progress+'%'"></view></view>
				</view>

				<view class="card-btn">
					<text>查看详情</text>
					<svg class="s14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view v-else class="empty">
			<view class="empty-icon">
				<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
				</svg>
			</view>
			<text class="empty-title">暂无考核记录</text>
			<text class="empty-desc">当前筛选条件下没有找到相关考核</text>
		</view>

		<view class="safe-btm"></view>
	</view>
</template>

<script>
	import { api } from '@/utils/api.js'
	import { useAuth } from '@/stores/auth.js'

	const statusConfig = {
		pending:  { label: '待审核', cls: 'tag-amber', dot: 'dot-amber' },
		rejected: { label: '不达标', cls: 'tag-red', dot: 'dot-red' },
		progress: { label: '进行中', cls: 'tag-blue', dot: 'dot-blue' },
		completed:{ label: '已完结', cls: 'tag-green', dot: 'dot-green' },
	}

	export default {
		data() {
			return {
				currentFilter: 'all',
				allAssessments: [],
				deptName: '',
				userRole: 3,
				loading: false,
			}
		},
		computed: {
			roleLabel() {
				const map = { 1: '总监', 2: '纪检组长', 3: '员工' }
				return map[this.userRole] || '员工'
			},
			filters() {
				const base = [
					{ key: 'all', label: '全部' },
					{ key: 'progress', label: '进行中' },
					{ key: 'completed', label: '已完结' },
				]
				return base
			},
			filteredList() {
				if (this.currentFilter === 'all') return this.allAssessments
				return this.allAssessments.filter(a => a.status === this.currentFilter)
			}
		},
		onShow() {
			this.$checkAuth()
			const auth = useAuth()
			this.userRole = auth.state.role || 3
			this.fetchList()
		},
		methods: {
			async fetchList() {
				this.loading = true
				try {
					const res = await api.get('/api/admin/assessments', null, { silent: true })
					if (res.data) {
						this.deptName = res.data.dept_name || ''
						this.allAssessments = (res.data.list || []).map(it => ({
							...it,
						}))
					}
				} catch (e) {
					console.error('[assessment-list]', e)
				}
				this.loading = false
			},
			fmtTime(t) {
				if (!t) return ''
				return t.substring(0, 10)
			},
			goBack() {
				const pages = getCurrentPages()
				if (pages.length > 1) {
					uni.navigateBack()
				} else {
					const auth = useAuth()
					uni.navigateTo({ url: auth.getHomePage() })
				}
			},
			statusCfg(s) { return statusConfig[s] || statusConfig.pending },
			progressCls(p) {
				if (p >= 80) return 'emerald'
				if (p >= 50) return 'primary'
				return 'slate-500'
			},
			progressBarCls(p) {
				if (p >= 80) return 'bar-emerald'
				if (p >= 50) return 'bar-primary'
				return 'bar-slate'
			},
			filterStatus(key) {
				this.currentFilter = key
			},
			goDetail(id) {
				uni.navigateTo({ url: '/pages/assessment-detail/assessment-detail?publish_id=' + id })
			},
		}
	}
</script>

<style>
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #f8fafc;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased;
	}

	.s14 { width: 28rpx; height: 28rpx; flex-shrink: 0 }

	/* Header */
	.hdr {
		background: rgba(255,255,255,0.92);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1rpx solid #f1f5f9;
		padding: 0 40rpx;
		padding-top: 20rpx;
		position: sticky;
		top: 0;
		z-index: 50;
	}
	.hdr-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 0;
	}
	.hdr-back {
		width: 72rpx; height: 72rpx; border-radius: 20rpx;
		background: #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
	}
	.hdr-back:active { background: #e2e8f0 }
	.hdr-titles { flex: 1; min-width: 0; margin: 0 24rpx; text-align: center }
	.hdr-title { font-size: 34rpx; font-weight: 700; color: #0f172a; display: block; letter-spacing: -0.02em }
	.hdr-sub { font-size: 22rpx; color: #94a3b8; font-weight: 500; margin-top: 4rpx; display: block }
	.hdr-role-tag {
		font-size: 22rpx; font-weight: 600; color: #475569; background: #f1f5f9;
		padding: 10rpx 24rpx; border-radius: 9999rpx; flex-shrink: 0;
	}

	/* Filter */
	.filter-bar { background: #fff; border-bottom: 1rpx solid #f1f5f9; padding: 20rpx 32rpx }
	.filter-scroll { display: flex; gap: 16rpx; overflow-x: auto; white-space: nowrap; padding-bottom: 4rpx }
	.filter-scroll::-webkit-scrollbar { display: none }
	.filter-btn { flex-shrink: 0; padding: 16rpx 32rpx; border-radius: 9999rpx; font-size: 22rpx; font-weight: 600; transition: all 0.2s }
	.filter-on { background: #6370f0; color: #fff; box-shadow: 0 4rpx 12rpx rgba(99,112,240,0.3) }
	.filter-off { background: #f1f5f9; color: #64748b }
	.filter-off:active { background: #e2e8f0 }

	/* Main */
	.main { padding: 32rpx 40rpx 120rpx }
	.card { background: #fff; border-radius: 28rpx; padding: 40rpx; margin-bottom: 32rpx; border: 1rpx solid #f1f5f9 }
	.card-press:active { transform: scale(0.985) }

	.card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20rpx }
	.card-top-l { flex: 1; min-width: 0; margin-right: 20rpx }
	.card-name { font-size: 28rpx; font-weight: 700; color: #1e293b; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap }
	.card-period { font-size: 22rpx; color: #94a3b8; font-weight: 500; margin-top: 6rpx; display: block }
	.card-target { display: flex; align-items: center; gap: 16rpx; margin-bottom: 24rpx }
	.target-tag { font-size: 20rpx; font-weight: 500; color: #64748b; background: #f8fafc; padding: 8rpx 16rpx; border-radius: 8rpx }
	.target-time { font-size: 20rpx; color: #cbd5e1 }

	/* Status */
	.status-tag { display: flex; align-items: center; gap: 8rpx; padding: 8rpx 20rpx; border-radius: 9999rpx; font-size: 20rpx; font-weight: 600; flex-shrink: 0 }
	.status-dot { width: 10rpx; height: 10rpx; border-radius: 50%; flex-shrink: 0 }
	.dot-amber { background: #f59e0b }
	.dot-red { background: #ef4444 }
	.dot-blue { background: #3b82f6 }
	.dot-slate { background: #94a3b8 }
	.dot-green { background: #10b981 }
	.tag-amber { background: #fffbeb; color: #d97706 }
	.tag-red { background: #fef2f2; color: #ef4444 }
	.tag-blue { background: #eff6ff; color: #2563eb }
	.tag-slate { background: #f1f5f9; color: #64748b }
	.tag-green { background: #ecfdf5; color: #059669 }

	/* Progress */
	.card-progress { margin-bottom: 24rpx }
	.progress-hd { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12rpx }
	.progress-label { font-size: 20rpx; color: #94a3b8; font-weight: 500 }
	.progress-val { font-size: 24rpx; font-weight: 700 }
	.bar { height: 8rpx; background: #f1f5f9; border-radius: 9999rpx; overflow: hidden }
	.bar-fill { height: 8rpx; border-radius: 9999rpx; transition: width 0.5s ease }
	.bar-primary { background: #6370f0 }
	.bar-emerald { background: #10b981 }
	.bar-slate { background: #94a3b8 }
	.primary { color: #6370f0 }
	.emerald { color: #10b981 }
	.slate-500 { color: #64748b }

	/* Card btn */
	.card-btn { display: flex; align-items: center; justify-content: center; gap: 8rpx; background: #f8fafc; border-radius: 20rpx; padding: 20rpx 0; font-size: 22rpx; font-weight: 600; color: #475569 }
	.card-btn:active { background: #f1f5f9 }

	/* Empty */
	.empty { display: flex; flex-direction: column; align-items: center; padding: 160rpx 80rpx 200rpx }
	.empty-icon { width: 224rpx; height: 224rpx; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; margin-bottom: 40rpx }
	.empty-title { font-size: 28rpx; font-weight: 600; color: #475569; margin-bottom: 12rpx }
	.empty-desc { font-size: 24rpx; color: #94a3b8; text-align: center; line-height: 1.6 }

	.safe-btm { height: 64rpx }
</style>
