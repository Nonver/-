<template>
	<view class="pg">
		<!-- <view> -->

		<!-- 顶栏 -->
		<view class="topbar">
			<view class="topbar-inner">
				<view class="tbl">
					<view class="tbl-icon">
						<svg class="s18 white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
							<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
							<line x1="12" y1="19" x2="12" y2="23" />
							<line x1="8" y1="23" x2="16" y2="23" />
						</svg>
					</view>
					<view>
						<text class="t15 fw6">主播部总监</text>
						<text class="t11 mu sum">考核管理中心</text>
					</view>
				</view>
				<view class="bell-wrap">
					<view class="bell-icon">
						<svg class="s18 gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
							<path d="M13.73 21a2 2 0 0 1-3.46 0" />
						</svg>
					</view>
					<view class="bell-dot"></view>
				</view>
			</view>
		</view>

		<view class="main">

			<!-- 考核状态统计 -->
			<view class="sec">
				<view class="sechd">
					<view class="sec-label">
						<view class="sec-label-bar"></view><text class="t13 fw6">考核状态统计</text>
					</view>
					<text class="t11 mu">本月数据</text>
				</view>
				<view class="stats-v">
					<view class="sc sc-pending">
						<view class="sc-inner">
							<view class="sc-l">
								<view class="sicon sicon-a">
									<svg class="s18 amber" viewBox="0 0 24 24" fill="none" stroke="currentColor"
										stroke-width="1.5">
										<circle cx="12" cy="12" r="10" />
										<polyline points="12 6 12 12 16 14" />
									</svg>
								</view>
								<view><text class="t12 mu">待审核考核</text><text class="sn">{{ stats.pending }}</text></view>
							</view>
							<view class="sc-r">
								<text class="tag tag-a">待处理</text>
								<svg class="s16 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor"
									stroke-width="2">
									<path d="M9 18l6-6-6-6" />
								</svg>
							</view>
						</view>
					</view>
					<view class="sc sc-sent">
						<view class="sc-inner">
							<view class="sc-l">
								<view class="sicon sicon-b">
									<svg class="s18 blue" viewBox="0 0 24 24" fill="none" stroke="currentColor"
										stroke-width="1.5">
										<line x1="22" y1="2" x2="11" y2="13" />
										<polygon points="22 2 15 22 11 13 2 9 22 2" />
									</svg>
								</view>
								<view><text class="t12 mu">已下发考核</text><text class="sn">{{ stats.progress }}</text></view>
							</view>
							<view class="sc-r">
								<text class="tag tag-b">执行中</text>
								<svg class="s16 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor"
									stroke-width="2">
									<path d="M9 18l6-6-6-6" />
								</svg>
							</view>
						</view>
					</view>
					<view class="sc sc-done">
						<view class="sc-inner">
							<view class="sc-l">
								<view class="sicon sicon-g">
									<svg class="s18 green" viewBox="0 0 24 24" fill="none" stroke="currentColor"
										stroke-width="1.5">
										<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
										<polyline points="22 4 12 14.01 9 11.01" />
									</svg>
								</view>
								<view><text class="t12 mu">已完结考核</text><text class="sn">{{ stats.completed }}</text></view>
							</view>
							<view class="sc-r">
								<text class="tag tag-g">已完成</text>
								<svg class="s16 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor"
									stroke-width="2">
									<path d="M9 18l6-6-6-6" />
								</svg>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 主播在岗与达标 -->
			<view class="sec">
				<view class="sechd">
					<view class="sec-label">
						<view class="sec-label-bar"></view><text class="t13 fw6">主播在岗与达标</text>
					</view>
					<text class="t11 mu">实时数据</text>
				</view>
				<view class="stats-v">
					<view class="sc sc-online">
						<view class="sc-inner">
							<view class="sc-l">
								<view class="sicon sicon-p">
									<svg class="s18 purple" viewBox="0 0 24 24" fill="none" stroke="currentColor"
										stroke-width="1.5">
										<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
										<circle cx="9" cy="7" r="4" />
										<path d="M23 21v-2a4 4 0 00-3-3.87" />
										<path d="M16 3.13a4 4 0 010 7.75" />
									</svg>
								</view>
							<view><text class="t12 mu">部门在岗主播</text><text class="sn">{{ anchorStats.total_on_duty }}<text
										class="sn-unit">人</text></text></view>
							</view>
							</view>
					</view>

					<view class="sc sc-pass">
						<view class="sc-body">
							<view class="sc-inner">
								<view class="sc-l">
									<view class="sicon sicon-g">
										<svg class="s18 green" viewBox="0 0 24 24" fill="none" stroke="currentColor"
											stroke-width="1.5">
											<circle cx="12" cy="8" r="7" />
											<polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
										</svg>
									</view>
							<view><text class="t12 mu">月度直播达标</text><text class="sn">{{ anchorStats.passed }}<text
											class="sn-unit">人</text></text></view>
								</view>
								<view class="sc-r">
									<text class="t11 mu">达标率 {{ anchorStats.pass_rate }}%</text>
									<svg class="s16 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor"
										stroke-width="2">
										<path d="M9 18l6-6-6-6" />
									</svg>
								</view>
							</view>
							<view class="prog-bar">
								<view class="prog-fill prog-g" :style="'width:'+anchorStats.pass_rate+'%'"></view>
							</view>
						</view>
					</view>

					<view class="sc sc-fail">
						<view class="sc-body">
							<view class="sc-inner">
								<view class="sc-l">
									<view class="sicon sicon-r">
										<svg class="s18 red" viewBox="0 0 24 24" fill="none" stroke="currentColor"
											stroke-width="1.5">
											<path
												d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
											<line x1="12" y1="9" x2="12" y2="13" />
											<line x1="12" y1="17" x2="12.01" y2="17" />
										</svg>
									</view>
								<view><text class="t12 mu">未达标主播</text><text class="sn">{{ anchorStats.failed }}<text
											class="sn-unit">人</text></text></view>
								</view>
								<view class="sc-r">
									<text class="tag tag-r">需关注</text>
									<svg class="s16 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor"
										stroke-width="2">
										<path d="M9 18l6-6-6-6" />
									</svg>
								</view>
							</view>
							<view class="prog-bar">
								<view class="prog-fill prog-r" :style="'width:'+(anchorStats.total_on_duty>0?Math.round(anchorStats.failed/anchorStats.total_on_duty*100):0)+'%'"></view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 待提交考核列表 -->
			<view class="sec">
				<view class="sechd">
					<view class="sec-label">
						<view class="sec-label-bar"></view><text class="t13 fw6">待提交考核列表</text>
					</view>
				<text class="t12 blue fw6" @tap="goToPending">查看全部</text>
			</view>
			<view v-if="loading" class="empty-list">加载中...</view>
			<view v-else-if="pendingListStyled.length===0" class="empty-list">暂无待提交考核</view>
			<view v-else class="list-card">
					<view v-for="(it,idx) in pendingListStyled" :key="it.id">
						<view v-if="idx>0" class="dv"></view>
						<view class="lr" :class="{'lr-urgent':it.urgent}">
							<view class="ava-ring" :class="{'online':it.online}" :style="{background:it.avaBg}"></view>
							<view class="lr-main">
								<view class="lr-hd">
									<text class="lr-title">{{ it.name }}</text>
									<text class="tag" :class="it.badgeCls">{{ it.badge }}</text>
								</view>
								<text class="lr-sub" :class="{'lr-sub-urgent':it.urgent}">{{ it.desc }}</text>
							</view>
							<view class="lr-btn" :class="{'lr-btn-urgent':it.urgent}">
								<svg class="s16" :class="it.urgent?'red':'blue'" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="1.5">
									<path
										:d="it.urgent ? 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01' : 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z'" />
								</svg>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 考核进度清单 -->
			<view class="sec">
				<view class="sechd">
					<view class="sec-label">
						<view class="sec-label-bar"></view><text class="t13 fw6">考核进度清单</text>
					</view>
					<text class="t12 blue fw6">查看全部</text>
				</view>
				<view v-if="loading" class="empty-list">加载中...</view>
				<view v-else-if="progressListStyled.length===0" class="empty-list">暂无考核进度</view>
				<view v-else class="list-card">
					<view v-for="(it,idx) in progressListStyled" :key="it.id">
						<view v-if="idx>0" class="dv"></view>
						<view class="lr lr-prog">
							<view class="ava" :style="{background:it.avaBg}"></view>
							<view class="lr-main">
								<view
									style="display:flex;flex-direction:row;justify-content:space-between;align-items:center">
									<text class="lr-title">{{ it.name }}</text>
									<text class="t12 fw6" :class="it.pctCls">{{ it.pct }}%</text>
								</view>
								<view class="prog-bar" style="margin-top:12rpx">
									<view class="prog-fill" :class="it.progCls" :style="{width:it.pct+'%'}"></view>
								</view>
								<text class="t11 mu" style="margin-top:12rpx;display:block">{{ it.stage }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 快捷操作 -->
			<view class="sec">
				<view class="sechd">
					<view class="sec-label">
						<view class="sec-label-bar"></view><text class="t13 fw6">快捷操作</text>
					</view>
				</view>
				<view class="quick-row">
					
					<view class="qb qb-pri" @tap="goToAssessSubmit">
						<view class="qb-icon-wrap" style="background:rgba(255,255,255,.15)">
							<svg class="s20 white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
								<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
							</svg>
						</view>
						<text class="t14 fw6 white">考核提交</text>
						<text class="t11" style="color:rgba(255,255,255,.6)">直播指标录入</text>
					</view>
					<view class="qb qb-sec" @tap="onOverview">
						<view class="qb-icon-wrap qb-iw-sec">
							<svg class="s20 gray" viewBox="0 0 24 24" fill="none" stroke="currentColor"
								stroke-width="1.5">
								<line x1="18" y1="20" x2="18" y2="10" />
								<line x1="12" y1="20" x2="12" y2="4" />
								<line x1="6" y1="20" x2="6" y2="14" />
							</svg>
						</view>
						<text class="t14 fw6">部门考核总览</text>
						<text class="t11 mu">全局数据看板</text>
					</view>
				</view>
			</view>

		</view>

		<!-- 底部导航 -->
		<view class="btmnav">
			<view class="btmnav-inner">
			<view class="btmnav-item on">
					<svg class="s20 blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
					</svg>
					<text class="t10 fw6 btmnav-label blue">首页</text>
				</view>
				<view class="btmnav-item" @tap="goToAssessment">
					<svg class="s20 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
					</svg>
					<text class="t10 mu btmnav-label">考核</text>
				</view>
				<view class="btmnav-item" @tap="navTo('/pages/personnel-manage/personnel-manage')">
					<svg class="s20 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 017-7h4a7 7 0 017 7v2"/>
					</svg>
					<text class="t10 mu btmnav-label">人员管理</text>
				</view>
				<view class="btmnav-item" @tap="navTo('/pages/anchor-kpi/anchor-kpi')">
					<svg class="s20 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
					</svg>
					<text class="t10 mu btmnav-label">主播</text>
				</view>
				<view class="btmnav-item" @tap="goMyPage">
					<svg class="s20 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
					</svg>
					<text class="t10 btmnav-label mu">我的</text>
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
				// API数据
				assessCycle: '',
				stats: { pending: 0, progress: 0, completed: 0 },
				anchorStats: { total_on_duty: 0, passed: 0, failed: 0, pass_rate: 0 },
				pendingList: [],
				progressList: [],
			}
		},
		computed: {
			// 待提交列表带样式（只展示前5条，查看全部跳独立页）
			pendingListStyled() {
				return this.pendingList.slice(0, 5).map(it => ({
					...it,
					online: it.role == 2 ? false : it.online,
					avaBg: it.online ? '#f0fdf4' : '#f1f5f9',
					badgeCls: it.urgent ? 'tag-r' : 'tag-a',
				}))
			},
			// 进度列表带样式
			progressListStyled() {
				return this.progressList.map(it => ({
					...it,
					avaBg: it.is_passed ? '#f0fdf4' : (it.pct > 50 ? '#eff6ff' : '#fef2f2'),
					pctCls: it.is_passed ? 'green' : (it.pct > 50 ? 'blue' : 'red'),
					progCls: it.is_passed ? 'prog-g' : (it.pct > 50 ? 'prog-b' : 'prog-r'),
				}))
			},
		},
		onShow() {
			this.$checkAuth()
			this.fetchDashboard()
		},
		methods: {
			goMyPage() { uni.navigateTo({ url: '/pages/my/my' }) },
			navTo(url) { uni.navigateTo({url}) },
			goToAssessment() { uni.navigateTo({ url: '/pages/anchor-assess-submit/anchor-assess-submit' }) },
			goToPending() { uni.navigateTo({ url: '/pages/anchor-pending/anchor-pending' }) },
			onPublish() { uni.navigateTo({ url: '/pages/anchor-assessment/anchor-assessment' }) },
			onOverview() { uni.navigateTo({ url: '/pages/anchor-kpi/anchor-kpi' }) },
			goToAssessSubmit() { uni.navigateTo({ url: '/pages/anchor-assess-submit/anchor-assess-submit' }) },
			async fetchDashboard() {
				this.loading = true
				try {
					const res = await api.get('/api/admin/anchor/dashboard', null, { silent: true })
					if (res.data) {
						const d = res.data
						this.assessCycle = d.assess_cycle || ''
						this.stats = d.stats || { pending: 0, progress: 0, completed: 0 }
						this.anchorStats = d.anchor_stats || { total_on_duty: 0, passed: 0, failed: 0, pass_rate: 0 }
						this.pendingList = d.pending_list || []
						this.progressList = d.progress_list || []
					}
				} catch (e) {
					console.error('[anchorDashboard]', e)
				}
				this.loading = false
			},
		}
	}
</script>

<style>
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #F5F7FB;
		padding-bottom: 180rpx;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased
	}

	.main {
		padding: 0 32rpx;
		margin-top: 24rpx;
	}

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

	.t14 {
		font-size: 28rpx
	}

	.t15 {
		font-size: 30rpx
	}

	.fw5 {
		font-weight: 500
	}

	.fw6 {
		font-weight: 600
	}

	.mu {
		color: #7F9BBF
	}
	.sum{
		margin-left: 8rpx;
	}
	.white {
		color: #fff
	}

	.red {
		color: #EF4444
	}

	.amber {
		color: #F59E0B
	}

	.gray {
		color: #3D4F7A
	}

	.blue {
		color: #3B82F6
	}

	.green {
		color: #10B981
	}

	.purple {
		color: #8B5CF6
	}

	.s16 {
		width: 32rpx;
		height: 32rpx;
		flex-shrink: 0
	}

	.s18 {
		width: 36rpx;
		height: 36rpx;
		flex-shrink: 0
	}

	.s20 {
		width: 40rpx;
		height: 40rpx;
		flex-shrink: 0
	}

	/* Header */
	.topbar {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(255, 255, 255, .92);
		border-bottom: 1rpx solid rgba(168, 190, 217, .4)
	}

	.topbar-inner {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 24rpx 32rpx
	}

	.tbl {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx
	}

	.tbl-icon {
		width: 72rpx;
		height: 72rpx;
		border-radius: 24rpx;
		background: linear-gradient(135deg, #141B2D, #1E2640);
		display: flex;
		align-items: center;
		justify-content: center
	}

	.bell-wrap {
		position: relative
	}

	.bell-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 24rpx;
		background: #EDF2F9;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.bell-dot {
		position: absolute;
		top: 16rpx;
		right: 20rpx;
		width: 16rpx;
		height: 16rpx;
		background: #EF4444;
		border-radius: 50%;
		border: 4rpx solid #fff
	}

	/* Section */
	.sec {
		margin-bottom: 32rpx
	}

	.sechd {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 4rpx;
		margin-bottom: 24rpx
	}

	.sec-label {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx
	}

	.sec-label-bar {
		width: 6rpx;
		height: 32rpx;
		background: linear-gradient(180deg, #3B82F6, #60A5FA);
		border-radius: 4rpx
	}

	/* Stat Cards */
	.stats-v {
		display: flex;
		flex-direction: column;
		gap: 24rpx
	}

	.sc {
		background: #fff;
		border: 1rpx solid #E2E8F0;
		border-radius: 28rpx;
		overflow: hidden;
		position: relative
	}

	.sc::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 6rpx
	}

	.sc-pending::before {
		background: linear-gradient(90deg, #F59E0B, #FBBF24)
	}

	.sc-sent::before {
		background: linear-gradient(90deg, #3B82F6, #60A5FA)
	}

	.sc-done::before {
		background: linear-gradient(90deg, #10B981, #34D399)
	}

	.sc-online::before {
		background: linear-gradient(90deg, #8B5CF6, #A78BFA)
	}

	.sc-pass::before {
		background: linear-gradient(90deg, #10B981, #34D399)
	}

	.sc-fail::before {
		background: linear-gradient(90deg, #EF4444, #F87171)
	}

	.sc-inner {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 36rpx 32rpx 28rpx
	}

	.sc-body {
		padding: 0 0 28rpx
	}

	.sc-l {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx
	}

	.sc-r {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 12rpx
	}

	.sicon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0
	}

	.sicon-a {
		background: rgba(245, 158, 11, .1)
	}

	.sicon-b {
		background: rgba(59, 130, 246, .1)
	}

	.sicon-g {
		background: rgba(16, 185, 129, .1)
	}

	.sicon-p {
		background: rgba(139, 92, 246, .1)
	}

	.sicon-r {
		background: rgba(239, 68, 68, .1)
	}

	.sn {
		font-size: 44rpx;
		font-weight: 700;
		color: #0A0E1A;
		line-height: 1;
		display: block;
		margin-top: 4rpx;
		letter-spacing: -.02em
	}

	.sn-unit {
		font-size: 26rpx;
		color: #7F9BBF;
		font-weight: 500;
		margin-left: 8rpx
	}

	/* Progress */
	.prog-bar {
		height: 6rpx;
		background: #E2E8F0;
		border-radius: 9999rpx;
		overflow: hidden
	}

	.prog-fill {
		height: 6rpx;
		border-radius: 9999rpx
	}

	.prog-g {
		background: linear-gradient(90deg, #10B981, #34D399)
	}

	.prog-r {
		background: linear-gradient(90deg, #EF4444, #F87171)
	}

	.prog-b {
		background: linear-gradient(90deg, #3B82F6, #60A5FA)
	}

	.prog-z {
		background: linear-gradient(90deg, #5A7299, #7F9BBF)
	}

	/* Tags */
	.tag {
		display: inline-flex;
		align-items: center;
		padding: 4rpx 20rpx;
		border-radius: 12rpx;
		font-size: 22rpx;
		font-weight: 600;
		white-space: nowrap;
		flex-shrink: 0;
		letter-spacing: .02em
	}

	.tag-a {
		background: rgba(245, 158, 11, .1);
		color: #F59E0B
	}

	.tag-b {
		background: rgba(59, 130, 246, .1);
		color: #3B82F6
	}

	.tag-g {
		background: rgba(16, 185, 129, .1);
		color: #10B981
	}

	.tag-r {
		background: rgba(239, 68, 68, .1);
		color: #EF4444
	}

	/* Empty State */
	.empty-list { text-align:center;padding:60rpx 0;font-size:26rpx;color:#94A3B8 }

	/* List */
	.list-card {
		background: #fff;
		border: 1rpx solid #E2E8F0;
		border-radius: 28rpx;
		overflow: hidden
	}

	.lr {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 28rpx 32rpx;
		gap: 24rpx
	}

	.lr:active {
		background: #F8FAFC
	}

	.lr-urgent {
		background: rgba(239, 68, 68, .02)
	}

	.lr-prog {
		align-items: flex-start
	}

	.lr-main {
		flex: 1;
		min-width: 0
	}

	.lr-hd {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 16rpx;
		margin-bottom: 4rpx
	}

	.lr-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #0A0E1A
	}

	.lr-sub {
		font-size: 24rpx;
		color: #7F9BBF
	}

	.lr-sub-urgent {
		color: #F87171
	}

	.lr-btn {
		width: 64rpx;
		height: 64rpx;
		border-radius: 16rpx;
		background: rgba(59, 130, 246, .1);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0
	}

	.lr-btn-urgent {
		background: rgba(239, 68, 68, .1)
	}

	.ava-ring {
		width: 88rpx;
		height: 88rpx;
		border-radius: 50%;
		flex-shrink: 0;
		border: 4rpx solid transparent
	}

	.ava-ring.online {
		border-color: #10B981
	}

	.ava {
		width: 88rpx;
		height: 88rpx;
		border-radius: 50%;
		flex-shrink: 0;
		border: 1rpx solid #E2E8F0
	}

	.dv {
		height: 1rpx;
		background: rgba(168, 190, 217, .3);
		margin: 0 32rpx
	}

	/* Quick actions */
	.quick-row {
		display: flex;
		flex-direction: row;
		gap: 24rpx
	}

	.qb {
		flex: 1;
		border-radius: 28rpx;
		padding: 32rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20rpx
	}

	.qb:active {
		transform: scale(.97)
	}

	.qb-pri {
		background: linear-gradient(135deg, #1E2640, #2A3655)
	}

	.qb-sec {
		background: #fff;
		border: 1.5px solid #E2E8F0
	}

	.qb-icon-wrap {
		width: 88rpx;
		height: 88rpx;
		border-radius: 24rpx;
		background: rgba(255, 255, 255, .15);
		display: flex;
		align-items: center;
		justify-content: center
	}

	.qb-iw-sec {
		background: #EDF2F9
	}

	/* Bottom nav */





	/* 底部导航 */
	.btmnav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		background: rgba(255, 255, 255, 0.92);
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
	.safe-btm { height: env(safe-area-inset-bottom, 0px) }
	.btmnav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4rpx;
		padding: 8rpx 12rpx;
		border-radius: 20rpx;
		transition: background 0.2s;
	}
	.btmnav-item.on {
		background: rgba(99, 112, 240, 0.1);
	}
	.btmnav-label { font-size: 22rpx; font-weight: 500; color: #94a3b8; transition: color 0.2s; }
.btmnav-item.on .btmnav-label { color: #6370f0; font-weight: 600; }
</style>