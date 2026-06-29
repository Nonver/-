<template>
	<view class="pg">
		<view>

			<!-- 顶部欢迎区 -->
			<view class="header">
				<view class="hdr-inner">
					<view class="hdr-l">
						<view class="hdr-avatar">
							<svg class="s20 white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
								stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
							</svg>
						</view>
						<view>
							<text class="hdr-greet">{{ userInfo.greeting }}</text>
							<text class="hdr-name">{{ userInfo.name }}</text>
						</view>
					</view>
					<view class="hdr-r">
						<text class="hdr-date">{{ userInfo.date }}</text>
						<text class="hdr-week">{{ userInfo.week }}</text>
					</view>
				</view>
			</view>

			<view class="main">

				<!-- 本月考核进度卡片 -->
				<view class="sec">
					<view class="card" @tap="goToDetail(assessData.publish_id, assessData.cycle)" v-if="assessData.publish_id">
						<view class="card-hd">
							<view class="card-hd-l">
								<view class="hd-icon hd-icon-blue">
									<svg class="s16 blue" viewBox="0 0 24 24" fill="none" stroke="currentColor"
										stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round"
											d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</view>
								<text class="t15 fw6 white">本月考核进度</text>
							</view>
							<text class="t11 slate-mono">{{ assessData.cycle_month }}</text>
						</view>

						<view class="kpi-body">
							<!-- 环形进度 -->
							<view class="kpi-ring-wrap">
								<svg class="kpi-ring" viewBox="0 0 120 120">
									<circle cx="60" cy="60" r="52" fill="none" stroke="#1E293B" stroke-width="8" />
									<circle cx="60" cy="60" r="52" fill="none" stroke="#2563EB" stroke-width="8"
										stroke-linecap="round" :stroke-dasharray="326.73"
										:stroke-dashoffset="326.73 * (1 - assessData.overall_progress / 100)"
										transform="rotate(-90 60 60)" />
								</svg>
								<view class="kpi-ring-text">
									<text class="kpi-ring-num">{{ assessData.overall_progress }}%</text>
									<text class="kpi-ring-sub">已完成</text>
								</view>
							</view>

							<!-- 考核指标 -->
							<view class="kpi-metrics">
								<view class="kpim" v-for="(item, i) in assessData.items" :key="i">
									<view class="kpim-row">
										<text class="t12 slate">{{ item.label }}</text>
										<text class="t12 fw6" :class="item.color + ' mono'">{{ item.actualText }} / {{ item.target }}</text>
									</view>
									<view class="bar">
										<view class="bar-fill" :class="item.bg" :style="'width:'+item.pct+'%'"></view>
									</view>
								</view>
							</view>
						</view>

						<view class="card-foot">
							<text class="t12 slate">距离考核截止还有 <text class="amber fw6">{{ assessData.days_remain }}</text> 天</text>
							<text class="t11 blue fw5">查看详情 →</text>
						</view>
					</view>
					<!-- 无考核时显示空状态 -->
					<view class="card" v-else>
						<view class="card-hd">
							<view class="card-hd-l">
								<view class="hd-icon hd-icon-blue">
									<svg class="s16 blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</view>
								<text class="t15 fw6 white">本月考核进度</text>
							</view>
						</view>
						<view class="empty-state">
							<text class="t13 slate">暂无进行中的考核</text>
						</view>
					</view>
				</view>

				<!-- 待审核流水卡片 -->
				<view class="sec">
					<view class="card">
						<view class="card-hd">
							<view class="card-hd-l">
								<view class="hd-icon hd-icon-amber">
									<svg class="s16 amber" viewBox="0 0 24 24" fill="none" stroke="currentColor"
										stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round"
											d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</view>
								<text class="t15 fw6 white">待审核流水</text>
							</view>
							<view class="pending-badge" v-if="pendingFlows.count > 0">
								<view class="pulse-dot-amber"></view>
								<text class="t12 amber fw6">{{ pendingFlows.count }} 条待处理</text>
							</view>
						</view>

						<!-- 待审核列表 -->
						<view class="pending-list" v-if="pendingFlows.list.length > 0">
							<view class="pending-item" v-for="(item, i) in pendingFlows.list" :key="i">
								<view class="pi-icon" :class="'bg-'+item.icon+'-light'">
									<svg class="s20" viewBox="0 0 24 24" fill="none" :stroke="item.icon === 'rose' ? '#FB7185' : (item.icon === 'blue' ? '#60A5FA' : '#34D399')"
										stroke-width="1.5">
										<path stroke-linecap="round" stroke-linejoin="round"
											d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
									</svg>
								</view>
								<view class="pi-main">
									<view class="pi-row">
										<text class="t13 white fw5 pi-name">{{ item.name }}</text>
										<text class="t15 rose mono fw7">{{ item.amount }}</text>
									</view>
									<view class="pi-row">
										<text class="t11 slate-deep">{{ item.date }}</text>
										<text class="pi-status">待审核</text>
									</view>
								</view>
							</view>
						</view>

						<!-- 无待审核 -->
						<view v-else class="empty-state">
							<text class="t13 slate">暂无待审核流水</text>
						</view>

						<view class="btn-outline" @tap="onViewAllPending" v-if="pendingFlows.list.length > 0">查看全部待审核流水</view>
					</view>
				</view>

				<!-- 已入账流水统计 -->
				<view class="sec">
					<view class="card">
						<view class="card-hd">
							<view class="card-hd-l">
								<view class="hd-icon hd-icon-emerald">
									<svg class="s16 emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor"
										stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round"
											d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
									</svg>
								</view>
								<text class="t15 fw6 white">已入账流水统计</text>
							</view>
							<view class="tab-switch">
								<view class="tab-on">本月</view>
							</view>
						</view>

						<!-- 金额统计 2x2 -->
						<view class="stat2">
							<view class="stat-item">
								<text class="t11 slate">本月已入账总额</text>
								<text class="stat-num emerald">¥{{ recordedStats.month_amount_text }}</text>
								<view class="stat-trend">
									<svg class="s12" :class="recordedStats.trend_up ? 'emerald' : 'rose'" viewBox="0 0 24 24" fill="none" stroke="currentColor"
										stroke-width="2.5">
										<path v-if="recordedStats.trend_up" stroke-linecap="round" stroke-linejoin="round"
											d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
										<path v-else stroke-linecap="round" stroke-linejoin="round"
											d="M4.5 4.5l15 15m0 0H8.25m11.25 0V8.25" />
									</svg>
									<text class="t11 fw5" :class="recordedStats.trend_up ? 'emerald' : 'rose'">{{ recordedStats.trend_up ? '+' : '' }}{{ recordedStats.trend_percent }}%</text>
									<text class="t10 slate-deep">环比</text>
								</view>
							</view>
							<view class="stat-item">
								<text class="t11 slate">入账笔数</text>
								<text class="stat-num blue">{{ recordedStats.month_count }} <text class="t13 slate fw4">笔</text></text>
								<view class="stat-trend">
									<text class="t11 slate fw5">本月</text>
								</view>
							</view>
						</view>

						<!-- 趋势图表 -->
						<view class="trend-chart" v-if="trendDays.length > 0">
							<view class="trend-chart-hd">
								<text class="t11 slate">近7天入账趋势</text>
								<text class="t10 slate-deep">单位：万元</text>
							</view>
							<view class="trend-bars">
								<view class="tb-col" v-for="(d, i) in trendDays" :key="i">
									<view class="tb-bar" :class="d.isToday ? 'tb-bar-active' : ''" :style="'height:'+d.height+'rpx'"></view>
									<text class="tb-label" :class="d.isToday ? 'tb-label-active' : ''">{{ d.isToday ? '今日' : d.date }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 快捷入口 2x2 -->
				<view class="sec">
					<view class="quick2">
						<view class="qbtn-big qbtn-blue" @tap="onFlowSubmit">
							<view class="qbtn-bg"></view>
							<view class="qbtn-content">
								<view class="qbtn-icon-wrap bg-white15">
									<svg class="s24 white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
										stroke-width="1.8">
										<path stroke-linecap="round" stroke-linejoin="round"
											d="M12 4.5v15m7.5-7.5h-15" />
									</svg>
								</view>
								<text class="qbtn-title white">流水提交</text>
								<text class="qbtn-sub blue-sub">新增流水记录</text>
							</view>
						</view>
						<view class="qbtn-big qbtn-dark" @tap="onFlowBooks">
							<view class="qbtn-bg-dark"></view>
							<view class="qbtn-content">
								<view class="qbtn-icon-wrap bg-slate-dark">
									<svg class="s24 slate-light" viewBox="0 0 24 24" fill="none" stroke="currentColor"
										stroke-width="1.8">
										<path stroke-linecap="round" stroke-linejoin="round"
											d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
									</svg>
								</view>
								<text class="qbtn-title white">流水台账</text>
								<text class="qbtn-sub slate">查询历史记录</text>
							</view>
						</view>
					</view>
				</view>

			</view>

			<!-- 底部导航 -->
			<view class="btmnav">
				<view class="btmnav-inner">
					<view class="btmnav-item on">
						<svg class="s20 blue" viewBox="0 0 24 24"
							fill="none" stroke="currentColor" stroke-width="1.8">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
						</svg>
						<text class="t10 fw5 blue fw6">首页</text>
					</view>
					<view class="btmnav-item" @tap="onNavTab(1)">
						<svg class="s20 slate-mono" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="1.8">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
						</svg>
						<text class="t10 fw5 slate-mono">考核</text>
					</view>
					<view class="btmnav-item" @tap="onNavTab(2)">
						<svg class="s20 slate-mono" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="1.8">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
						</svg>
						<text class="t10 fw5 slate-mono">统计</text>
					</view>
					<view class="btmnav-item" @tap="goMyPage">
						<svg class="s20 slate-mono" viewBox="0 0 24 24"
							fill="none" stroke="currentColor" stroke-width="1.8">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
						</svg>
						<text class="t10 fw5 slate-mono">我的</text>
					</view>
				</view>
				<view class="safe-btm"></view>
			</view>

		</view>


	</view>
</template>

<script>
	import { api } from '@/utils/api.js'

	export default {
		data() {
			return {
				loading: false,
				userInfo: {
					name: '运营员工',
					greeting: '下午好',
					date: '',
					week: ''
				},
				assessData: {
					publish_id: 0,
					cycle: '',
					cycle_month: '',
					overall_progress: 0,
					items: [],
					days_remain: 0,
					cards: []
				},
				pendingFlows: {
					count: 0,
					list: []
				},
				recordedStats: {
					month_amount: 0,
					month_amount_text: '0',
					month_count: 0,
					trend_percent: 0,
					trend_up: true
				},
				trendDays: []
			}
		},
		onShow() {
			this.$checkAuth()
			this.fetchDashboard()
		},
		methods: {
			async fetchDashboard() {
				this.loading = true
				try {
					const res = await api.get('/api/admin/operation-staff/dashboard')
					if (res.data) {
						const d = res.data
						this.userInfo = d.user || this.userInfo
						this.assessData = d.assess || this.assessData
						this.pendingFlows = d.pending_flows || this.pendingFlows
						this.recordedStats = d.recorded_stats || this.recordedStats
						this.trendDays = d.trend_days || []
					}
				} catch (e) {
					console.error('[operationStaff]', e)
				}
				this.loading = false
			},
			goToDetail(publishId, cycle) {
				if (!publishId) {
					uni.showToast({ title: '暂无考核数据', icon: 'none' })
					return
				}
				const name = encodeURIComponent(cycle + ' 运营部考核')
				uni.navigateTo({
					url: '/pages/assessment-detail/assessment-detail?publish_id=' + publishId + '&name=' + name
				})
			},
			onViewAllPending() {
				uni.navigateTo({
					url: '/pages/flow-review/flow-review'
				})
			},
			onFlowSubmit() {
				uni.navigateTo({
					url: '/pages/daily-flow/daily-flow'
				})
			},
			onFlowBooks() {
				uni.navigateTo({
					url: '/pages/flow-ledger/flow-ledger'
				})
			},
			navTo(url) {
				uni.navigateTo({
					url
				})
			},
			onNavTab(idx) {
				if (idx === 0) uni.showToast({
					title: '仅财务部可查看',
					icon: 'none'
				})
				else if (idx === 1) this.goToDetail(this.assessData.publish_id, this.assessData.cycle)
				else if (idx === 2) uni.showToast({
					title: '仅财务部可查看',
					icon: 'none'
				})
				else if (idx === 3) { uni.navigateTo({ url: '/pages/my/my' }) }
			},
			goMyPage() { uni.navigateTo({ url: '/pages/my/my' }) },
		}
	}
</script>

<style>
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #020617;
		font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased;
		padding-bottom: 160rpx
	}

	.main {
		padding: 0 36rpx
	}

	/* typo */
	.t10 {
		font-size: 20rpx
	}

	.t11 {
		font-size: 22rpx
	}

	.t12 {
		font-size: 24rpx
	}

	.t13 {
		font-size: 26rpx
	}

	.t15 {
		font-size: 30rpx
	}

	.fw4 {
		font-weight: 400
	}

	.fw5 {
		font-weight: 500
	}

	.fw6 {
		font-weight: 600
	}

	.fw7 {
		font-weight: 700
	}

	.mono {
		font-family: 'Space Mono', 'Courier New', monospace
	}

	.white {
		color: #F1F5F9
	}

	.blue {
		color: #60A5FA
	}

	.emerald {
		color: #34D399
	}

	.amber {
		color: #F59E0B
	}

	.rose {
		color: #FB7185
	}

	.slate {
		color: #64748B
	}

	.slate-light {
		color: #94A3B8
	}

	.slate-deep {
		color: #475569
	}

	.slate-mono {
		color: #94A3B8
	}

	.blue-sub {
		color: rgba(191, 219, 254, .7)
	}

	.s12 {
		width: 24rpx;
		height: 24rpx;
		flex-shrink: 0
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

	.s24 {
		width: 48rpx;
		height: 48rpx;
		flex-shrink: 0
	}

	/* header */
	.header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(15, 23, 42, .85);
		backdrop-filter: blur(48rpx);
		-webkit-backdrop-filter: blur(48rpx);
		border-bottom: 1rpx solid rgba(30, 41, 59, .6);
		padding: 56rpx 36rpx 36rpx
	}

	.hdr-inner {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center
	}

	.hdr-l {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx
	}

	.hdr-avatar {
		width: 88rpx;
		height: 88rpx;
		border-radius: 24rpx;
		background: #2563EB;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8rpx 32rpx rgba(37, 99, 235, .2)
	}

	.hdr-greet {
		font-size: 24rpx;
		color: #94A3B8;
		display: block
	}

	.hdr-name {
		font-size: 32rpx;
		font-weight: 600;
		color: #fff;
		display: block;
		margin-top: 2rpx
	}

	.hdr-r {
		text-align: right
	}

	.hdr-date {
		font-size: 24rpx;
		color: #94A3B8;
		font-family: 'Space Mono', 'Courier New', monospace;
		display: block
	}

	.hdr-week {
		font-size: 24rpx;
		color: #64748B;
		font-family: 'Space Mono', 'Courier New', monospace;
		display: block;
		margin-top: 2rpx
	}

	/* section */
	.sec {
		margin-bottom: 40rpx
	}

	/* card */
	.card {
		border-radius: 32rpx;
		background: rgba(15, 23, 42, .95);
		border: 1rpx solid rgba(30, 41, 59, .8);
		padding: 40rpx;
		box-shadow: 0 16rpx 64rpx rgba(0, 0, 0, .35)
	}

	.card-hd {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 36rpx
	}

	.card-hd-l {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 20rpx
	}

	.card-foot {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 32rpx;
		padding-top: 28rpx;
		border-top: 1rpx solid rgba(30, 41, 59, .6)
	}

	.hd-icon {
		width: 64rpx;
		height: 64rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.hd-icon-blue {
		background: rgba(59, 130, 246, .15)
	}

	.hd-icon-amber {
		background: rgba(245, 158, 11, .15)
	}

	.hd-icon-emerald {
		background: rgba(16, 185, 129, .15)
	}

	.pending-badge {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 12rpx
	}

	.pulse-dot-amber {
		width: 16rpx;
		height: 16rpx;
		background: #F59E0B;
		border-radius: 50%;
		animation: pulse-slow 3s ease-in-out infinite
	}

	@keyframes pulse-slow {

		0%,
		100% {
			opacity: 1
		}

		50% {
			opacity: .6
		}
	}

	/* KPI */
	.kpi-body {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 40rpx
	}

	.kpi-ring-wrap {
		position: relative;
		width: 220rpx;
		height: 220rpx;
		flex-shrink: 0
	}

	.kpi-ring {
		width: 220rpx;
		height: 220rpx
	}

	.kpi-ring-text {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center
	}

	.kpi-ring-num {
		font-size: 52rpx;
		font-weight: 700;
		font-family: 'Space Mono', 'Courier New', monospace;
		color: #fff;
		line-height: 1
	}

	.kpi-ring-sub {
		font-size: 20rpx;
		color: #94A3B8;
		margin-top: 4rpx
	}

	.kpi-metrics {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 24rpx
	}

	.kpim {}

	.kpim-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12rpx
	}

	.bar {
		height: 12rpx;
		background: #1E293B;
		border-radius: 9999rpx;
		overflow: hidden
	}

	.bar-fill {
		height: 100%;
		border-radius: 9999rpx
	}

	.bg-blue {
		background: #3B82F6
	}

	.bg-emerald {
		background: #10B981
	}

	.bg-amber {
		background: #F59E0B
	}

	.empty-state {
		padding: 40rpx 0;
		text-align: center;
	}

	/* pending list */
	.pending-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx
	}

	.pending-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx;
		padding: 28rpx;
		border-radius: 24rpx;
		background: rgba(30, 41, 59, .6);
		border: 1rpx solid rgba(51, 65, 85, .5)
	}

	.pi-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0
	}

	.bg-rose-light {
		background: rgba(244, 63, 94, .15)
	}

	.bg-blue-light {
		background: rgba(59, 130, 246, .15)
	}

	.bg-emerald-light {
		background: rgba(16, 185, 129, .15)
	}

	.pi-main {
		flex: 1;
		min-width: 0
	}

	.pi-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center
	}

	.pi-row+.pi-row {
		margin-top: 8rpx
	}

	.pi-name {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap
	}

	.pi-status {
		padding: 4rpx 16rpx;
		border-radius: 9999rpx;
		background: rgba(245, 158, 11, .15);
		font-size: 20rpx;
		font-weight: 500;
		color: #F59E0B;
		border: 1rpx solid rgba(245, 158, 11, .2)
	}

	.btn-outline {
		width: 100%;
		margin-top: 24rpx;
		padding: 20rpx 0;
		border-radius: 20rpx;
		background: rgba(30, 41, 59, .8);
		border: 1rpx solid rgba(51, 65, 85, .5);
		font-size: 24rpx;
		color: #94A3B8;
		font-weight: 500;
		text-align: center
	}

	.btn-outline:active {
		background: rgba(51, 65, 85, .8)
	}

	/* stat2 */
	.stat2 {
		display: flex;
		flex-direction: row;
		gap: 24rpx;
		margin-bottom: 40rpx
	}

	.stat-item {
		flex: 1;
		border-radius: 24rpx;
		background: rgba(30, 41, 59, .6);
		border: 1rpx solid rgba(51, 65, 85, .5);
		padding: 28rpx
	}

	.stat-num {
		font-size: 40rpx;
		font-weight: 700;
		font-family: 'Space Mono', 'Courier New', monospace;
		display: block;
		margin-top: 8rpx;
		line-height: 1.1
	}

	.stat-trend {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8rpx;
		margin-top: 12rpx
	}

	/* tab switch */
	.tab-switch {
		display: flex;
		flex-direction: row;
		background: rgba(30, 41, 59, .8);
		border-radius: 16rpx;
		padding: 4rpx
	}

	.tab-on {
		padding: 8rpx 24rpx;
		border-radius: 12rpx;
		background: #2563EB;
		font-size: 22rpx;
		font-weight: 500;
		color: #fff
	}

	.tab-off {
		padding: 8rpx 24rpx;
		border-radius: 12rpx;
		font-size: 22rpx;
		font-weight: 500;
		color: #94A3B8
	}

	/* trend chart */
	.trend-chart {
		border-radius: 24rpx;
		background: rgba(30, 41, 59, .4);
		border: 1rpx solid rgba(51, 65, 85, .3);
		padding: 28rpx
	}

	.trend-chart-hd {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 28rpx
	}

	.trend-bars {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		gap: 16rpx;
		height: 160rpx
	}

	.tb-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8rpx
	}

	.tb-bar {
		width: 100%;
		background: rgba(51, 65, 85, .5);
		border-radius: 8rpx 8rpx 0 0
	}

	.tb-bar-blue {
		background: rgba(59, 130, 246, .4)
	}

	.tb-bar-blue2 {
		background: rgba(59, 130, 246, .6)
	}

	.tb-bar-emerald {
		background: rgba(16, 185, 129, .5)
	}

	.tb-bar-active {
		background: #3B82F6
	}

	.tb-label {
		font-size: 18rpx;
		color: #475569
	}

	.tb-label-active {
		color: #60A5FA;
		font-weight: 500
	}

	/* quick2 */
	.quick2 {
		display: flex;
		flex-direction: row;
		gap: 24rpx
	}

	.qbtn-big {
		flex: 1;
		position: relative;
		overflow: hidden;
		border-radius: 32rpx;
		padding: 40rpx 32rpx;
		text-align: left
	}

	.qbtn-big:active {
		transform: scale(.97)
	}

	.qbtn-blue {
		background: #2563EB;
		box-shadow: 0 16rpx 64rpx rgba(37, 99, 235, .25);
		border: 1rpx solid rgba(96, 165, 250, .3)
	}

	.qbtn-dark {
		background: #1E293B;
		box-shadow: 0 16rpx 64rpx rgba(0, 0, 0, .25);
		border: 1rpx solid rgba(51, 65, 85, .5)
	}

	.qbtn-bg {
		position: absolute;
		top: 0;
		right: 0;
		width: 192rpx;
		height: 192rpx;
		background: rgba(96, 165, 250, .15);
		border-radius: 50%;
		transform: translate(64rpx, -64rpx)
	}

	.qbtn-bg-dark {
		position: absolute;
		top: 0;
		right: 0;
		width: 192rpx;
		height: 192rpx;
		background: rgba(51, 65, 85, .3);
		border-radius: 50%;
		transform: translate(64rpx, -64rpx)
	}

	.qbtn-content {
		position: relative
	}

	.qbtn-icon-wrap {
		width: 96rpx;
		height: 96rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 24rpx
	}

	.bg-white15 {
		background: rgba(255, 255, 255, .15)
	}

	.bg-slate-dark {
		background: rgba(51, 65, 85, .6)
	}

	.qbtn-title {
		font-size: 30rpx;
		font-weight: 600;
		display: block;
		margin-bottom: 4rpx
	}

	.qbtn-sub {
		font-size: 22rpx;
		display: block
	}

	/* btm nav */
	.btmnav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		background: #1b1628;
		backdrop-filter: blur(48rpx);
		-webkit-backdrop-filter: blur(48rpx);
		border-top: 1rpx solid rgba(30, 41, 59, .6)
	}

	.btmnav-inner {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		padding: 16rpx 0
	}

	.safe-btm {
		height: env(safe-area-inset-bottom, 0px)
	}

	/* 底部导航 */
	.btmnav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		background:rgb(27 37 55);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-top: 1rpx solid rgba(0, 0, 0, 0.06);
	}

	.btmnav-inner {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		padding: 8rpx 0;
	}

	.safe-btm {
		height: env(safe-area-inset-bottom, 0px)
	}

	.btmnav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4rpx;
		padding: 8rpx 24rpx;
		border-radius: 20rpx;
		transition: background 0.2s;
	}

	.btmnav-item.on {
		background: rgba(99, 112, 240, 0.1);
	}

	.btmnav-label {
		font-size: 20rpx;
		font-weight: 500;
		color: #94a3b8;
		transition: color 0.2s;
	}

	.btmnav-item.on .btmnav-label {
		color: #6370f0;
		font-weight: 600;
	}

	.btmnav-label {
		font-size: 22rpx;
		font-weight: 500;
		color: #94a3b8;
		transition: color 0.2s;
	}

	.btmnav-item.on .btmnav-label {
		color: #6370f0;
		font-weight: 600;
	}
</style>