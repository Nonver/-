<template>
	<view class="pg">
		<!-- ═══════════════════════════════ -->
		<!-- PAGE 1: 考核列表 -->
		<!-- ═══════════════════════════════ -->
		<view class="page-list">

			<!-- Header -->
			<view class="hdr">
				<view class="hdr-top">
					<view class="hdr-back" @tap="goBack"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg></view>
					<view style="text-align: center;">
						<text class="hdr-title">我的考核</text>
						<text class="hdr-sub">{{ deptName || '加载中...' }}</text>
					</view>
					<!-- 角色切换 -->
					<view class="role-wrap" @tap="toggleRoleMenu">
						<text class="role-label">{{ roleLabel }}</text>
						<svg class="s12 slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</view>
				</view>

				<!-- 角色下拉菜单 -->
				<view v-show="roleMenuOpen" class="role-dropdown">
					<view class="role-item" :class="{'role-item-on': currentRole==='employee'}" @tap="switchRole('employee')">
						<view class="role-dot role-dot-slate"></view>
						<text>员工</text>
					</view>
					<view class="role-item" :class="{'role-item-on': currentRole==='manager'}" @tap="switchRole('manager')">
						<view class="role-dot role-dot-primary"></view>
						<text>主管</text>
					</view>
					<view class="role-item" :class="{'role-item-on': currentRole==='director'}" @tap="switchRole('director')">
						<view class="role-dot role-dot-amber"></view>
						<text>总监</text>
					</view>
				</view>

				<!-- Tab Bar (仅总监) -->
				<view v-show="currentRole==='director'" class="tab-bar">
					<view class="tab-inner">
						<view class="tab" :class="currentTab==='my' ? 'tab-on' : 'tab-off'" @tap="switchTab('my')">
							<text>我的考核</text>
						</view>
						<view class="tab" :class="currentTab==='dept' ? 'tab-on' : 'tab-off'" @tap="switchTab('dept')">
							<text>部门考核</text>
						</view>
					</view>
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
				<view v-for="(item, idx) in filteredList" :key="item.id" class="card card-press" @tap="goDetail(item.id)">
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
					</view>

					<!-- 锚金部特色指标 -->
					<view v-if="item.dept_id === 3 && item.metrics" class="anchor-metrics">
						<view class="metric-row" v-if="item.metrics.month_stream_days">
							<text class="metric-label">月度开播天数</text>
							<text class="metric-val">{{ item.metrics.month_stream_days }}<text class="metric-unit">天</text></text>
						</view>
						<view class="metric-row" v-if="item.metrics.daily_live_hours > 0">
							<text class="metric-label">日均直播时长</text>
							<text class="metric-val">{{ item.metrics.daily_live_hours }}<text class="metric-unit">小时</text></text>
						</view>
						<view class="metric-row" v-if="item.metrics.month_fans_target">
							<text class="metric-label">月度粉丝新增目标</text>
							<text class="metric-val">{{ item.metrics.month_fans_target }}<text class="metric-unit">人</text></text>
						</view>
						<view class="metric-row" v-if="item.metrics.month_gift_target > 0">
							<text class="metric-label">月礼物收益目标</text>
							<text class="metric-val">{{ fmtMoney(item.metrics.month_gift_target) }}<text class="metric-unit">元</text></text>
						</view>
						<view class="metric-row" v-if="item.metrics.avg_watch_time > 0">
							<text class="metric-label">人均观看时长</text>
							<text class="metric-val">{{ item.metrics.avg_watch_time }}<text class="metric-unit">分钟</text></text>
						</view>
						<view class="metric-row" v-if="item.metrics.fan_club_target">
							<text class="metric-label">粉丝团新增</text>
							<text class="metric-val">{{ item.metrics.fan_club_target }}<text class="metric-unit">人</text></text>
						</view>
						<view class="metric-row" v-if="item.metrics.churn_rate_limit > 0">
							<text class="metric-label">流失率上限</text>
							<text class="metric-val">{{ item.metrics.churn_rate_limit }}<text class="metric-unit">%</text></text>
						</view>
					</view>

					<view class="card-progress">
						<view class="progress-hd">
							<text class="progress-label">当前进度</text>
							<text class="progress-val" :class="progressCls(item.progress)">{{ item.progress }}%</text>
						</view>
						<view class="bar"><view class="bar-fill" :class="progressBarCls(item.progress)" :style="'width:'+item.progress+'%'"></view></view>
					</view>

					<view class="card-btn" @click="goDetail(item.id)">
						<text>查看详情</text>
						<svg class="s14 slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view v-else class="empty">
				<view class="empty-icon">
					<svg class="s56 slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
					</svg>
				</view>
				<text class="empty-title">暂无考核记录</text>
				<text class="empty-desc">当前筛选条件下没有找到相关考核，请尝试切换其他状态</text>
			</view>

		</view>

		<!-- Toast -->
		<view class="toast" :class="toastVisible ? 'toast-show' : ''">
			<svg class="s16 emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
			<text class="toast-text">{{ toastMsg }}</text>
		</view>
	</view>
</template>

<script>
	import { api } from '@/utils/api.js'
	import { useAuth } from '@/stores/auth.js'
	const auth = useAuth()
	
	const statusConfig = {
		pending: { label: '待审核', cls: 'tag-amber', dot: 'dot-amber' },
		rejected: { label: '审核驳回', cls: 'tag-red', dot: 'dot-red' },
		progress: { label: '进行中', cls: 'tag-blue', dot: 'dot-blue' },
		completed: { label: '已完结', cls: 'tag-slate', dot: 'dot-slate' },
		passed: { label: '达标', cls: 'tag-emerald', dot: 'dot-emerald' },
		failed: { label: '不达标', cls: 'tag-rose', dot: 'dot-rose' }
	}

	export default {
		data() {
			return {
				// 列表页
				roleMenuOpen: false,
				currentRole: 'employee',
				currentTab: 'my',
				currentFilter: 'all',
				// API 数据
				allAssessments: [],
				deptName: '',
				loading: false,
				// Toast
				toastVisible: false,
				toastMsg: ''
			}
		},

		computed: {
			roleLabel() {
				const roleNumMap = { 1: '总监', 2: '主管', 3: '员工' }
				return roleNumMap[auth.state.role] || '员工'
			},
			roleKey() {
				const map = { 1: 'director', 2: 'manager', 3: 'employee' }
				return map[auth.state.role] || 'employee'
			},
			// 员工(3)和组长(2)只能看到审核通过的考核，隐藏待审核/审核驳回筛选项
			filters() {
				const all = [
					{ key: 'all', label: '全部' },
					{ key: 'pending', label: '待审核' },
					{ key: 'rejected', label: '审核驳回' },
					{ key: 'progress', label: '进行中' },
					{ key: 'completed', label: '已完结' },
				]
				const userRole = auth.state.role
				if (userRole === 2 || userRole === 3) {
					return all.filter(f => f.key === 'all' || f.key === 'progress' || f.key === 'completed')
				}
				return all
			},
			filteredList() {
				let list = this.allAssessments
				// 总监"部门考核"tab：只展示部门级别考核
				if (this.currentRole === 'director' && this.currentTab === 'dept') {
					list = list.filter(a => a.target === this.deptName)
				}
				if (this.currentFilter !== 'all') {
					list = list.filter(a => a.status === this.currentFilter)
				}
				return list
			}
		},

		onShow() {
			this.$checkAuth()
			this.currentRole = this.roleKey
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
							target: res.data.dept_name || '部门',
						}))
					}
				} catch (e) {
					console.error('[Assessment]', e)
				}
				this.loading = false
			},
			goBack() {
				const pages = getCurrentPages()
				if (pages.length > 1) {
					uni.navigateBack()
				} else {
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
			toggleRoleMenu() {
				this.roleMenuOpen = !this.roleMenuOpen
			},
			switchRole(role) {
				this.currentRole = role
				this.currentTab = 'my'
				this.roleMenuOpen = false
			},
			switchTab(tab) {
				this.currentTab = tab
			},
			filterStatus(key) {
				this.currentFilter = key
			},

			// Navigation
			goDetail(id) {
				uni.navigateTo({ url: '/pages/assessment-detail/assessment-detail?publish_id=' + id })
			},

				// 金额格式化
			fmtMoney(val) {
				const n = parseFloat(val) || 0
				return n.toLocaleString('zh-CN')
			},

			// Toast
			showToast(msg) {
				this.toastMsg = msg
				this.toastVisible = true
				setTimeout(() => { this.toastVisible = false }, 2500)
			}
		},

		// 点击空白关闭角色菜单
		onPageTap(e) {
			// uni-app doesn't have document click, handled via custom approach
		}
	}
</script>

<style>
	/* ═══════════════════════════════ */
	/* Base */
	/* ═══════════════════════════════ */
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #f8fafc;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased;
		position: relative;
		overflow: hidden;
	}

	/* ═══════════════════════════════ */
	/* Utility */
	/* ═══════════════════════════════ */
	.s12 { width: 24rpx; height: 24rpx; flex-shrink: 0 }
	.s14 { width: 28rpx; height: 28rpx; flex-shrink: 0 }
	.s16 { width: 32rpx; height: 32rpx; flex-shrink: 0 }
	.s18 { width: 36rpx; height: 36rpx; flex-shrink: 0 }
	.s20 { width: 40rpx; height: 40rpx; flex-shrink: 0 }
	.s24 { width: 48rpx; height: 48rpx; flex-shrink: 0 }
	.s32 { width: 64rpx; height: 64rpx; flex-shrink: 0 }
	.s56 { width: 112rpx; height: 112rpx; flex-shrink: 0 }
	.slate-300 { color: #cbd5e1 }
	.slate-400 { color: #94a3b8 }
	.slate-500 { color: #64748b }
	.slate-600 { color: #475569 }
	.primary { color: #6370f0 }
	.emerald { color: #10b981 }
	.amber { color: #f59e0b }
	.violet { color: #8b5cf6 }

	/* ═══════════════════════════════ */
	/* Header / 列表页 */
	/* ═══════════════════════════════ */
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
	.hdr-title {
		font-size: 38rpx;
		font-weight: 700;
		color: #0f172a;
		display: block;
		letter-spacing: -0.02em;
	}
	.hdr-sub {
		font-size: 22rpx;
		color: #94a3b8;
		font-weight: 500;
		margin-top: 4rpx;
		display: block;
	}
	.hdr-title>view{
		
	}

	/* 角色切换 */
	.role-wrap {
		display: flex;
		align-items: center;
		gap: 8rpx;
		background: #f1f5f9;
		border-radius: 9999rpx;
		padding: 12rpx 20rpx 12rpx 28rpx;
		transition: background 0.2s;
	}
	.role-wrap:active { background: #e2e8f0 }
	.role-label {
		font-size: 22rpx;
		font-weight: 600;
		color: #475569;
	}

	/* 角色下拉 */
	.role-dropdown {
		position: absolute;
		right: 40rpx;
		top: 150rpx;
		background: #fff;
		border-radius: 28rpx;
		box-shadow: 0 10rpx 80rpx rgba(0,0,0,0.12);
		border: 1rpx solid #f1f5f9;
		padding: 16rpx 0;
		width: 280rpx;
		z-index: 60;
	}
	.role-item {
		display: flex;
		align-items: center;
		gap: 16rpx;
		padding: 20rpx 32rpx;
		font-size: 24rpx;
		color: #64748b;
		font-weight: 500;
		transition: background 0.15s;
	}
	.role-item:active { background: #f8fafc }
	.role-item-on { color: #1e293b; font-weight: 600 }
	.role-dot {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		flex-shrink: 0;
	}
	.role-dot-slate { background: #94a3b8 }
	.role-dot-primary { background: #6370f0 }
	.role-dot-amber { background: #f59e0b }

	/* Tab */
	.tab-bar {
		padding-bottom: 0;
	}
	.tab-inner {
		display: flex;
		gap: 48rpx;
		border-bottom: 1rpx solid #f1f5f9;
	}
	.tab {
		padding-bottom: 20rpx;
		font-size: 26rpx;
		transition: all 0.2s;
	}
	.tab-on {
		color: #6370f0;
		font-weight: 600;
		border-bottom: 4rpx solid #6370f0;
	}
	.tab-off {
		color: #94a3b8;
		font-weight: 500;
		border-bottom: 4rpx solid transparent;
	}

	/* ═══════════════════════════════ */
	/* Filter */
	/* ═══════════════════════════════ */
	.filter-bar {
		background: #fff;
		border-bottom: 1rpx solid #f1f5f9;
		padding: 20rpx 32rpx;
	}
	.filter-scroll {
		display: flex;
		gap: 16rpx;
		overflow-x: auto;
		white-space: nowrap;
		padding-bottom: 4rpx;
	}
	.filter-scroll::-webkit-scrollbar { display: none }
	.filter-btn {
		flex-shrink: 0;
		padding: 16rpx 32rpx;
		border-radius: 9999rpx;
		font-size: 22rpx;
		font-weight: 600;
		transition: all 0.2s;
	}
	.filter-on {
		background: #6370f0;
		color: #fff;
		box-shadow: 0 4rpx 12rpx rgba(99,112,240,0.3);
	}
	.filter-off {
		background: #f1f5f9;
		color: #64748b;
	}
	.filter-off:active { background: #e2e8f0 }

	/* ═══════════════════════════════ */
	/* Card (通用) */
	/* ═══════════════════════════════ */
	.main {
		padding: 32rpx 40rpx 120rpx;
	}
	.card {
		background: #fff;
		border-radius: 28rpx;
		padding: 40rpx;
		margin-bottom: 32rpx;
		border: 1rpx solid #f1f5f9;
	}
	.card-press:active { transform: scale(0.985); transition: transform 0.1s }

	/* 考核卡片 */
	.card-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 20rpx;
	}
	.card-top-l { flex: 1; min-width: 0; margin-right: 20rpx }
	.card-name {
		font-size: 28rpx;
		font-weight: 700;
		color: #1e293b;
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.card-period {
		font-size: 22rpx;
		color: #94a3b8;
		font-weight: 500;
		margin-top: 6rpx;
		display: block;
	}
	.card-target {
		margin-bottom: 24rpx;
	}
	.target-tag {
		font-size: 20rpx;
		font-weight: 500;
		color: #64748b;
		background: #f8fafc;
		padding: 8rpx 16rpx;
		border-radius: 8rpx;
	}

	/* 锚金部特色指标 */
	.anchor-metrics {
		margin-bottom: 24rpx;
		padding: 20rpx 24rpx;
		background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
		border-radius: 16rpx;
		border: 1rpx solid #fde047;
	}
	.metric-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12rpx 0;
	}
	.metric-row+.metric-row {
		border-top: 1rpx solid rgba(250, 204, 21, 0.3);
	}
	.metric-label {
		font-size: 22rpx;
		color: #854d0e;
		font-weight: 500;
	}
	.metric-val {
		font-size: 24rpx;
		font-weight: 700;
		color: #713f12;
	}
	.metric-unit {
		font-size: 20rpx;
		font-weight: 500;
		color: #a16207;
		margin-left: 4rpx;
	}

	/* 状态标签 */
	.status-tag {
		display: flex;
		align-items: center;
		gap: 8rpx;
		padding: 8rpx 20rpx;
		border-radius: 9999rpx;
		font-size: 20rpx;
		font-weight: 600;
		flex-shrink: 0;
	}
	.status-dot { width: 10rpx; height: 10rpx; border-radius: 50%; flex-shrink: 0 }
	.dot-amber { background: #f59e0b }
	.dot-red { background: #ef4444 }
	.dot-blue { background: #3b82f6 }
	.dot-slate { background: #94a3b8 }
	.dot-emerald { background: #10b981 }
	.dot-rose { background: #f43f5e }
	.tag-amber { background: #fffbeb; color: #d97706 }
	.tag-red { background: #fef2f2; color: #ef4444 }
	.tag-blue { background: #eff6ff; color: #2563eb }
	.tag-slate { background: #f1f5f9; color: #64748b }
	.tag-emerald { background: #ecfdf5; color: #059669 }
	.tag-rose { background: #fff1f2; color: #e11d48 }

	/* 进度条 */
	.card-progress { margin-bottom: 24rpx }
	.progress-hd {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12rpx;
	}
	.progress-label { font-size: 20rpx; color: #94a3b8; font-weight: 500 }
	.progress-val { font-size: 24rpx; font-weight: 700 }
	.bar { height: 8rpx; background: #f1f5f9; border-radius: 9999rpx; overflow: hidden }
	.bar-fill { height: 8rpx; border-radius: 9999rpx; transition: width 0.5s ease }
	.bar-primary { background: #6370f0 }
	.bar-emerald { background: #10b981 }
	.bar-slate { background: #94a3b8 }
	.bar-tl { height: 6rpx }

	/* 卡片按钮 */
	.card-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8rpx;
		background: #f8fafc;
		border-radius: 20rpx;
		padding: 20rpx 0;
		font-size: 22rpx;
		font-weight: 600;
		color: #475569;
		transition: background 0.15s;
	}
	.card-btn:active { background: #f1f5f9 }

	/* ═══════════════════════════════ */
	/* Empty */
	/* ═══════════════════════════════ */
	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 160rpx 80rpx 200rpx;
	}
	.empty-icon {
		width: 224rpx;
		height: 224rpx;
		border-radius: 50%;
		background: #f1f5f9;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 40rpx;
	}
	.empty-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #475569;
		margin-bottom: 12rpx;
	}
	.empty-desc {
		font-size: 24rpx;
		color: #94a3b8;
		text-align: center;
		line-height: 1.6;
	}

	/* Toast */
	.toast {
		position: fixed;
		bottom: 120rpx;
		left: 50%;
		transform: translateX(-50%) translateY(40rpx);
		background: #1e293b;
		color: #fff;
		padding: 20rpx 40rpx;
		border-radius: 9999rpx;
		display: flex;
		align-items: center;
		gap: 12rpx;
		font-size: 24rpx;
		font-weight: 500;
		opacity: 0;
		transition: all 0.3s ease;
		z-index: 999;
		pointer-events: none;
	}
	.toast-show {
		opacity: 1;
		transform: translateX(-50%) translateY(0);
	}
</style>
