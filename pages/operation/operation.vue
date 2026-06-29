<template>
	<view class="pg">
		<!-- <view> -->
		<view class="container">
			<!-- Header -->
			<view class="hdr">
				<view>
					<text class="h1">运营部总监看板</text>
					<text class="hsub">运营部专属管理数据概览</text>
				</view>
				<view class="bell-icon">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"
						stroke-linecap="round" stroke-linejoin="round">
						<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
						<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
					</svg>
				</view>
			</view>

			<!-- 快捷功能 -->
			<view class="sec">
				<view class="quick-row">
					<view class="qb" @tap="goToOverview">
						<view class="qb-icon">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
								<line x1="18" y1="20" x2="18" y2="10" />
								<line x1="12" y1="20" x2="12" y2="4" />
								<line x1="6" y1="20" x2="6" y2="14" />
							</svg>
						</view>
						<text class="qb-label">考核总览</text>
					</view>
				</view>
			</view>

			<!-- 数据概览 -->
			<view class="sec">
				<view class="sec-title">
					<view class="sec-bar"></view>
					<text class="sec-label">数据概览</text>
				</view>
				<view class="metrics">

					<!-- 待审核考核 -->
					<view class="mc">
						<view class="mc-row">
							<view class="mc-tag">
								<view class="micon micon-a">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706"
										stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<circle cx="12" cy="12" r="10" />
										<polyline points="12 6 12 12 16 14" />
									</svg>
								</view>
								<text class="mc-label">本部门待审核考核</text>
							</view>
							<view class="tag tag-a">
								<view class="sd sda pdot"></view>
								<text>待处理</text>
							</view>
						</view>
						<view class="mc-num"><text class="num">{{ stats.pendingAssessCount }}</text><text class="num-unit">项</text></view>
					</view>

					<!-- 已下发考核 -->
					<view class="mc">
						<view class="mc-row">
							<view class="mc-tag">
								<view class="micon micon-b">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb"
										stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
										<polyline points="14 2 14 8 20 8" />
										<line x1="16" y1="13" x2="8" y2="13" />
										<line x1="16" y1="17" x2="8" y2="17" />
										<polyline points="10 9 9 9 8 9" />
									</svg>
								</view>
								<text class="mc-label">已下发考核</text>
							</view>
							<view class="tag tag-b">进行中</view>
						</view>
						<view class="mc-num"><text class="num">{{ stats.publishedAssessCount }}</text><text class="num-unit">项</text></view>
					</view>

					<!-- 已完结考核 -->
					<view class="mc">
						<view class="mc-row">
							<view class="mc-tag">
								<view class="micon micon-g">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669"
										stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
										<polyline points="22 4 12 14.01 9 11.01" />
									</svg>
								</view>
								<text class="mc-label">已完结考核</text>
							</view>
							<view class="tag tag-g">已完成</view>
						</view>
						<view class="mc-num"><text class="num">{{ stats.completedAssessCount }}</text><text class="num-unit">项</text></view>
					</view>

					<!-- 部门在岗人数 -->
					<view class="mc">
						<view class="mc-row">
							<view class="mc-tag">
								<view class="micon micon-z">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569"
										stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
										<circle cx="9" cy="7" r="4" />
										<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
										<path d="M16 3.13a4 4 0 0 1 0 7.75" />
									</svg>
								</view>
								<text class="mc-label">部门在岗人数</text>
							</view>
							<view class="tag tag-z">实时</view>
						</view>
						<view class="mc-num"><text class="num">{{ stats.onDutyCount }}</text><text class="num-unit">人</text></view>
					</view>

					<!-- 部门总流水 -->
					<view class="mc">
						<view class="mc-row">
							<view class="mc-tag">
								<view class="micon micon-z">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569"
										stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<line x1="12" y1="1" x2="12" y2="23" />
										<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
									</svg>
								</view>
								<text class="mc-label">部门总流水</text>
							</view>
							<view class="tag tag-z">累计</view>
						</view>
						<view class="mc-num"><text class="num-sign">¥</text><text class="num">{{ stats.totalAmountText }}</text></view>
					</view>

					<!-- 当月有效流水 -->
					<view class="mc">
						<view class="mc-row">
							<view class="mc-tag">
								<view class="micon micon-g">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669"
										stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
										<polyline points="17 6 23 6 23 12" />
									</svg>
								</view>
								<text class="mc-label">当月流水</text>
							</view>
							<view class="tag tag-g">本月</view>
						</view>
						<view class="mc-num"><text class="num-sign">¥</text><text class="num">{{ stats.monthAmountText }}</text></view>
						<view class="mc-trend" v-if="stats.trendPercent > 0">
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" :stroke="stats.trendUp ? '#059669' : '#e11d48'"
								stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<polyline v-if="stats.trendUp" points="18 15 12 9 6 15" />
								<polyline v-else points="6 9 12 15 18 9" />
							</svg>
							<text :class="stats.trendUp ? 'trend-up' : 'trend-down'">较上月 {{ stats.trendUp ? '+' : '' }}{{ stats.trendPercent }}%</text>
						</view>
					</view>

					<!-- 待审核流水数量 -->
					<view class="mc">
						<view class="mc-row">
							<view class="mc-tag">
								<view class="micon micon-r">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e11d48"
										stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<circle cx="12" cy="12" r="10" />
										<line x1="12" y1="8" x2="12" y2="12" />
										<line x1="12" y1="16" x2="12.01" y2="16" />
									</svg>
								</view>
								<text class="mc-label">待审核流水数量</text>
							</view>
							<view class="tag tag-r">
								<view class="sd sdr pdot"></view>
								<text>需处理</text>
							</view>
						</view>
						<view class="mc-num"><text class="num">{{ stats.pendingFlowCount }}</text><text class="num-unit">笔</text></view>
					</view>
				</view>
			</view>

			<!-- 待提交考核列表 -->
			<view class="sec">
				<view class="sec-top">
					<view class="sec-title">
						<view class="sec-bar"></view>
						<text class="sec-label">待提交考核列表</text>
					</view>
					<text class="sec-count">共 {{ pendingAssessList.length }} 项</text>
				</view>
				<view class="list-card">
					<view v-if="pendingAssessList.length === 0" class="lr">
						<text class="lr-meta-item">暂无待提交考核</text>
					</view>
					<view v-for="(it,idx) in pendingAssessList" :key="it.id">
						<view v-if="idx>0" class="dv"></view>
						<view class="lr">
							<view class="lr-main">
								<text class="lr-title">{{ it.title }}</text>
								<view class="lr-meta">
									<text class="lr-meta-item">提交人：{{ it.person }}</text>
									<text class="lr-meta-item">{{ it.date }}</text>
								</view>
							</view>
							<view class="tag tag-a">待审核</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 我的考核 -->
			<view class="sec">
				<view class="sec-top">
					<view class="sec-title">
						<view class="sec-bar"></view>
						<text class="sec-label">我的考核</text>
					</view>
					<text class="sec-count">共 {{ userAssessList.length }} 项</text>
				</view>
				<view class="list-card">
					<view v-if="userAssessList.length === 0" class="lr">
						<text class="lr-meta-item">暂无考核</text>
					</view>
					<view v-for="(it,idx) in userAssessList" :key="it.publish_id" @tap="onUserAssess(it)">
						<view v-if="idx>0" class="dv"></view>
						<view class="lr">
							<view class="lr-main">
								<text class="lr-title">{{ it.title }}</text>
								<view class="lr-meta">
									<text class="lr-meta-item">{{ it.desc }}</text>
								</view>
							</view>
							<view class="tag" :class="it.status_cls">{{ it.status }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 待审核流水清单 -->
			<view class="sec" style="padding-bottom:0">
				<view class="sec-top">
					<view class="sec-title">
						<view class="sec-bar"></view>
						<text class="sec-label">待审核流水清单</text>
					</view>
					<text class="sec-count">共 {{ pendingFlowList.length }} 笔</text>
				</view>
				<view class="list-card">
					<view v-if="pendingFlowList.length === 0" class="lr">
						<text class="lr-meta-item">暂无待审核流水</text>
					</view>
					<view v-for="(it,idx) in pendingFlowList" :key="it.id">
						<view v-if="idx>0" class="dv"></view>
						<view class="lr">
							<view class="lr-main">
								<text class="lr-code">{{ it.code }}</text>
								<view class="lr-meta">
									<text class="lr-amount">{{ it.amount }}</text>
									<text class="lr-meta-item">{{ it.date }}</text>
								</view>
							</view>
							<view class="tag tag-r">
								<view class="sd sdr pdot"></view>
								<text>待审核</text>
							</view>
						</view>
					</view>
				</view>
			</view>

		</view>

		<!-- 底部操作 -->
		<!-- <view class="btmbar">
			<view class="btmbar-inner">
				<view class="bb bb-pri" @tap="onPublish">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
						stroke-linecap="round" stroke-linejoin="round">
						<line x1="12" y1="5" x2="12" y2="19" />
						<line x1="5" y1="12" x2="19" y2="12" />
					</svg>
					<text class="bb-txt">流水提交</text>
				</view>
				<view class="bb bb-sec" @tap="onLedger">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
						stroke-linecap="round" stroke-linejoin="round">
						<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
						<line x1="3" y1="9" x2="21" y2="9" />
						<line x1="9" y1="21" x2="9" y2="9" />
					</svg>
					<text class="bb-txt">流水管理台账</text>
				</view>
			</view>
			<view class="safe-btm"></view>
		</view> -->

		<bottom-nav :items="navItems" :current="currentView" @change="onNavChange" />
	</view>
</template>

<script>
	import BottomNav from '@/components/bottom-nav.vue'
	import { api } from '@/utils/api.js'

	export default {
		components: { BottomNav },
		data() {
			return {
				currentView: 'home',
				loading: false,
				navItems: [
					{ key:'home',       label:'首页',       page:'/pages/operation/operation' },
					{ key:'assess',     label:'考核发布',   page:'/pages/operation-assessment/operation-assessment' },
					{ key:'flow',       label:'流水提交',   page:'/pages/daily-flow/daily-flow' },
					{ key:'personnel',  label:'人员管理',   page:'/pages/personnel-manage/personnel-manage' },
					{ key:'profile',    label:'个人中心',   page:'/pages/my/my' },
				],
				stats: {
					pendingAssessCount: 0,
					publishedAssessCount: 0,
					completedAssessCount: 0,
					onDutyCount: 0,
					totalAmountText: '0',
					monthAmountText: '0',
					pendingFlowCount: 0,
					trendPercent: 0,
					trendUp: true,
				},
				pendingAssessList: [],
				userAssessList: [],
				pendingFlowList: [],
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
					const res = await api.get('/api/admin/operation/dashboard')
					if (res.code === 200 && res.data) {
						this.stats = res.data.stats
						this.pendingAssessList = res.data.pendingAssessList || []
						this.userAssessList = res.data.userAssessList || []
						this.pendingFlowList = res.data.pendingFlowList || []
					}
				} catch (e) {
					console.error('[operation] 获取看板数据失败:', e)
				} finally {
					this.loading = false
				}
			},
			onNavChange(key) { this.currentView = key },
			onPublish() {
				uni.navigateTo({
					url: '/'
				})
			},
			onLedger() {
				uni.navigateTo({
					url: '/pages/flow-ledger/flow-ledger'
				})
			},
			onUserAssess(item) {
				uni.navigateTo({
					url: '/pages/assessment-detail/assessment-detail?publish_id=' + item.publish_id
				})
			},
			goToOverview() {
				uni.navigateTo({ url: '/pages/anchor-kpi/anchor-kpi' })
			},
		}
	}
</script>

<style>
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #f8fafc;
		padding-bottom: 200rpx;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased
	}

	/* Header */
	.hdr {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		padding: 64rpx 40rpx 40rpx
	}

	.h1 {
		font-size: 44rpx;
		font-weight: 700;
		color: #0f172a;
		line-height: 1.2;
		display: block
	}

	.hsub {
		font-size: 26rpx;
		color: #94a3b8;
		display: block;
		margin-top: 4rpx
	}

	.bell-icon {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		background: #f1f5f9;
		display: flex;
		align-items: center;
		justify-content: center
	}

	/* Section */
	.sec {
		padding: 0 40rpx 32rpx
	}

	.sec-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx
	}

	.sec-title {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 16rpx
	}

	.sec-bar {
		width: 6rpx;
		height: 32rpx;
		background: #1e293b;
		border-radius: 9999rpx
	}

	.sec-label {
		font-size: 30rpx;
		font-weight: 600;
		color: #1e293b
	}

	.sec-count {
		font-size: 24rpx;
		color: #94a3b8;
		font-weight: 500
	}

	/* Metrics */
	.metrics {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
		margin-top: 24rpx;
	}

	.mc {
		background: #fff;
		border: 1rpx solid rgba(203, 213, 225, .7);
		border-radius: 24rpx;
		padding: 32rpx 40rpx
	}

	.mc-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center
	}

	.mc-tag {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 20rpx
	}

	.mc-label {
		font-size: 26rpx;
		color: #64748b;
		font-weight: 500
	}

	.micon {
		width: 64rpx;
		height: 64rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.micon-a {
		background: #fef3c7
	}

	.micon-b {
		background: #dbeafe
	}

	.micon-g {
		background: #d1fae5
	}

	.micon-z {
		background: #f1f5f9
	}

	.micon-r {
		background: #ffe4e6
	}

	.mc-num {
		margin-top: 24rpx
	}

	.num {
		font-size: 56rpx;
		font-weight: 700;
		color: #0f172a;
		line-height: 1
	}

	.num-unit {
		font-size: 24rpx;
		color: #94a3b8;
		margin-left: 8rpx
	}

	.num-sign {
		font-size: 26rpx;
		color: #94a3b8;
		font-weight: 500;
		margin-right: 4rpx
	}

	.mc-trend {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8rpx;
		margin-top: 16rpx
	}

	.trend-up {
		font-size: 22rpx;
		color: #059669;
		font-weight: 500
	}

	.trend-down {
		font-size: 22rpx;
		color: #e11d48;
		font-weight: 500
	}

	/* Tags */
	.tag {
		display: inline-flex;
		align-items: center;
		padding: 4rpx 16rpx;
		border-radius: 8rpx;
		font-size: 22rpx;
		font-weight: 500;
		white-space: nowrap;
		flex-shrink: 0
	}

	.tag-a {
		background: #fef3c7;
		color: #d97706
	}

	.tag-b {
		background: #dbeafe;
		color: #2563eb
	}

	.tag-g {
		background: #d1fae5;
		color: #059669
	}

	.tag-z {
		background: #f1f5f9;
		color: #475569
	}

	.tag-r {
		background: #ffe4e6;
		color: #e11d48
	}

	.sd {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%
	}

	.sda {
		background: #f59e0b
	}

	.sdr {
		background: #f43f5e
	}

	.pdot {
		margin-right: 12rpx;
		animation: pulse 2s ease-in-out infinite
	}

	@keyframes pulse {

		0%,
		100% {
			opacity: 1
		}

		50% {
			opacity: .4
		}
	}

	/* 列表 */
	.list-card {
		background: #fff;
		border: 1rpx solid rgba(203, 213, 225, .7);
		border-radius: 24rpx;
		overflow: hidden
	}

	.lr {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		padding: 32rpx 40rpx
	}

	.lr:active {
		background: #f8fafc
	}

	.lr-main {
		flex: 1;
		min-width: 0
	}

	.lr-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #1e293b;
		display: block
	}

	.lr-code {
		font-size: 26rpx;
		color: #64748b;
		display: block
	}

	.lr-meta {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx;
		margin-top: 16rpx
	}

	.lr-meta-item {
		font-size: 24rpx;
		color: #94a3b8
	}

	.lr-amount {
		font-size: 28rpx;
		font-weight: 700;
		color: #0f172a
	}

	.dv {
		height: 1rpx;
		background: #f1f5f9;
		margin: 0 40rpx
	}

	/* 底部 */
	.btmbar {
		/* 		position: fixed;
		bottom: 0;
		left: 0;
		right: 0; */
		background: rgba(255, 255, 255, .95);
		border-top: 0.03125rem solid rgba(203, 213, 225, .7);
		width: 90%;
		margin: auto;
		border-radius: 10px;
		margin-top: 20px;
		border: 3rpx solid rgba(203, 213, 225, .7);
	}

	.btmbar-inner {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
		padding: 32rpx 40rpx
	}

	.safe-btm {
		height: env(safe-area-inset-bottom, 0px)
	}

	.bb {
		width: 100%;
		height: 96rpx;
		border-radius: 24rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 16rpx
	}

	.bb:active {
		transform: scale(.98)
	}

	.bb-pri {
		background: #1e293b;
		color: #fff
	}

	.bb-pri:active {
		background: #334155
	}

	.bb-sec {
		background: #fff;
		color: #1e293b;
		border: 1rpx solid #e2e8f0
	}

	.bb-sec:active {
		background: #f8fafc
	}

	.bb-txt {
		font-size: 30rpx;
		font-weight: 600
	}

	/* 快捷功能 */
	.quick-row {
		display: flex;
		flex-direction: row;
		gap: 24rpx
	}
	.qb {
		flex: 1;
		background: #fff;
		border: 1rpx solid rgba(203, 213, 225, .7);
		border-radius: 20rpx;
		padding: 28rpx 32rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 20rpx
	}
	.qb:active {
		transform: scale(.97)
	}
	.qb-icon {
		width: 72rpx;
		height: 72rpx;
		border-radius: 18rpx;
		background: #eff6ff;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #3B82F6;
		flex-shrink: 0
	}
	.qb-label {
		font-size: 28rpx;
		font-weight: 600;
		color: #1e293b
	}
</style>