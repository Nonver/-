<template>
	<view class="pg">
		<!-- <view> -->

			<!-- 顶部欢迎区 -->
			<view class="header">
				<view class="hdr-top">
					<view class="hdr-user">
						<view class="hdr-avatar">
							<svg class="s20 white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
								stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</view>
						<view>
							<text class="hdr-greet">{{ userInfo.greeting }}</text>
							<text class="hdr-name">{{ userInfo.name }}</text>
						</view>
					</view>
					<view class="hdr-bell" @tap="onNotify">
						<svg class="s20 white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
						</svg>
						<view class="bell-dot"></view>
					</view>
				</view>
				<view class="hdr-tags">
					<view class="hdr-tag">
						<svg class="s12" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd" />
						</svg>
						<text>{{ userInfo.role }}</text>
					</view>
					<text v-if="userInfo.usercode" class="hdr-code">工号: {{ userInfo.usercode }}</text>
				</view>
			</view>

			<view class="main">

				<!-- 今日数据概览 -->
				<view class="sec">
					<view class="card">
						<view class="card-hd">
							<text class="t14 fw6 ink">今日数据概览</text>
							<text class="t12 mu">{{ userInfo.date }}</text>
						</view>
						<view class="overview-grid">
							<view class="ov-item ov-green">
								<view class="ov-hd">
									<view class="ov-icon ov-icon-g">
										<svg class="s14 green" viewBox="0 0 24 24" fill="none" stroke="currentColor"
											stroke-width="2.5">
											<path stroke-linecap="round" stroke-linejoin="round"
												d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
										</svg>
									</view>
									<text class="ov-label">在职兼职</text>
								</view>
								<text class="ov-num">{{ overview.on_duty }}</text>
								<view class="ov-sub">
									<svg class="s12" :class="overview.on_duty_trend_up ? 'green' : 'red'" viewBox="0 0 24 24" fill="none" stroke="currentColor"
										stroke-width="2.5">
										<path v-if="overview.on_duty_trend_up" stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
										<path v-else stroke-linecap="round" stroke-linejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
									</svg>
									<text class="fw6" :class="overview.on_duty_trend_up ? 'green' : 'red'">{{ overview.on_duty_trend >= 0 ? '+' : '' }}{{ overview.on_duty_trend }}%</text>
									<text class="mu">较昨日</text>
								</view>
							</view>
							<view class="ov-item ov-rose" @tap="onFlowPending">
								<view class="ov-hd">
									<view class="ov-icon ov-icon-r">
										<svg class="s14 red" viewBox="0 0 24 24" fill="none" stroke="currentColor"
											stroke-width="2.5">
											<circle cx="12" cy="12" r="10" />
											<polyline points="12 6 12 12 16 14" />
										</svg>
									</view>
									<text class="ov-label">流转中</text>
								</view>
								<text class="ov-num">{{ overview.pending_total }}</text>
								<view class="ov-sub">
									<text class="red fw6" v-if="overview.urgent_count > 0">紧急 {{ overview.urgent_count }}</text>
									<text class="mu">待中转部审核</text>
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 核心数据卡片 -->
				<view class="sec">

					<!-- 在职兼职人数 -->
					<view class="card card-mb">
						<view class="card-top">
							<view class="card-top-l">
								<view class="cicon cicon-green">
									<svg class="s20 white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
										stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round"
											d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
									</svg>
								</view>
								<view>
									<text class="t12 mu">在职兼职人数</text>
									<text class="big-num">{{ overview.on_duty }}</text>
								</view>
							</view>
							<view class="badge badge-green">
								<svg class="s14 green" viewBox="0 0 24 24" fill="none" stroke="currentColor"
									stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round"
										d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
								</svg>
								<text class="green fw6">{{ overview.on_duty_trend >= 0 ? '+' : '' }}{{ overview.on_duty_trend }}%</text>
							</view>
						</view>
						<!-- 迷你趋势图 -->
						<view class="trend">
							<view class="tr-bar" style="height:32rpx"></view>
							<view class="tr-bar" style="height:44rpx"></view>
							<view class="tr-bar" style="height:36rpx"></view>
							<view class="tr-bar" style="height:56rpx"></view>
							<view class="tr-bar" style="height:48rpx"></view>
							<view class="tr-bar" style="height:64rpx"></view>
							<view class="tr-bar tr-bar-active" style="height:80rpx"></view>
						</view>
						<view class="card-btm">
							<text class="t12 mu">本周新增 <text class="ink fw6">{{ overview.week_new }}</text> 人</text>
							<text class="t12 green fw5">查看详情 →</text>
						</view>
					</view>

					</view>

				<!-- 快捷操作 -->
				<view class="sec">
					<text class="t14 fw6 ink sec-ttl">快捷操作</text>
					<view class="card qa-card">
						<view class="qa-main-btn" @tap="onManager">
							<view class="qa-main-icon">
								<svg class="s24 white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
									stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round"
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
								</svg>
							</view>
							<view class="qa-main-text">
								<text class="qa-main-title">兼职主播管理</text>
								<text class="qa-main-sub">查看、编辑、流转主播信息</text>
							</view>
							<svg class="s20 white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor"
								stroke-width="2.5">
								<polyline points="9 5 15 12 9 19" />
							</svg>
						</view>
					</view>
				</view>

				<!-- 最近动态 -->
				<view class="sec">
					<text class="t14 fw6 ink sec-ttl">最近动态</text>
					<view class="card">
						<!-- 动态列表 -->
						<block v-if="feeds.length === 0">
							<view style="text-align:center;padding:40rpx 0">
								<text class="t12 mu">暂无最近动态</text>
							</view>
						</block>
						<block v-for="(feed, i) in feeds" :key="i">
							<view class="feed-item">
								<view class="feed-avatar" :class="feed.color==='green'?'feed-av-green':(feed.color==='amber'?'feed-av-amber':(feed.color==='red'?'feed-av-red':'feed-av-blue'))">
									<svg class="s16" :class="feed.color" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path v-if="feed.type==='recruit'" stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
										<path v-else-if="feed.color==='amber'" stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										<path v-else stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</view>
								<view class="feed-main">
									<text class="feed-text">{{ feed.text }}</text>
									<text class="feed-time">{{ feed.time }} · {{ feed.sub }}</text>
								</view>
								<view class="feed-dot" v-if="feed.color==='red'"></view>
							</view>
							<view class="feed-div" v-if="i < feeds.length - 1"></view>
						</block>
					</view>
				</view>

			</view>

			<!-- 底部导航 -->
			<view class="btmnav">
				<view class="btmnav-inner">
					<view class="btmnav-item on">
						<svg class="s22 green" fill="currentColor"
							viewBox="0 0 24 24">
							<path
								d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
						</svg>
						<text class="t10 fw6 green">首页</text>
					</view>
					<view class="btmnav-item" @tap="navigateTo('/pages/parttime-anchor/parttime-anchor')">
						<svg class="s22 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
						<text class="t10 mu">主播</text>
					</view>
					<view class="btmnav-item" @tap="navigateTo('/pages/broker-assessment-list/broker-assessment-list')">
						<svg class="s22 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
						</svg>
						<text class="t10 mu">考核</text>
					</view>
					<view class="btmnav-item" @tap="goMyPage">
						<svg class="s22 mu" viewBox="0 0 24 24" fill="none"
							stroke="currentColor" stroke-width="1.8">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						<text class="t10 mu">我的</text>
					</view>
				</view>
				<view class="safe-btm"></view>
			</view>

		</view>




</template>

<script>
	import { api } from '@/utils/api.js'
	import { useAuth } from '@/stores/auth.js'

	export default {
		data() {
			const auth = useAuth()
			const deptName = auth.state.departmentName || '经纪部'
			const roleMap = { 1: deptName + '总监', 2: deptName + '组长', 3: deptName + '员工' }
			return {
				loading: false,
				userInfo: {
					name: auth.state.userName || '员工',
					dept_name: deptName,
					greeting: '下午好',
					date: '',
					week: '',
					role: roleMap[auth.state.role] || deptName + '员工',
					code: auth.state.code || '',
				},
				overview: { on_duty: 0, on_duty_trend: 0, on_duty_trend_up: false, week_new: 0, pending_total: 0, urgent_count: 0 },
				flow: { pending_review: 0, pending_sign: 0, pending_train: 0, total: 1, avg_days: 0 },
				feeds: [],
			}
		},
		onShow() { this.$checkAuth(); this.fetchDashboard() },
		methods: {
			async fetchDashboard() {
				this.loading = true
				try {
					const res = await api.get('/api/admin/broker-staff/dashboard')
					if (res.data) {
						const d = res.data
						this.userInfo = d.user
						this.overview = d.overview
						this.flow = d.flow
						this.feeds = d.feeds || []
					}
				} catch (e) {}
				this.loading = false
			},
			onNotify() { uni.showToast({ title: '暂无新消息', icon: 'none' }) },
			onManager() { uni.navigateTo({ url: '/pages/parttime-anchor/parttime-anchor' }) },
			onFlowPending() { uni.showToast({ title: '待中转部审核', icon: 'none' }) },
			navigateTo(url) { uni.navigateTo({ url }) },
			goMyPage() { uni.navigateTo({ url: '/pages/my/my' }) },
		}
	}
</script>

<style>
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #F8FAFC;
		padding-bottom: 180rpx;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased
	}

	.main {
		padding: 0 32rpx
	}

	/* text */
	.t10 {
		font-size: 20rpx
	}

	.t12 {
		font-size: 24rpx
	}

	.t14 {
		font-size: 28rpx
	}

	.t16 {
		font-size: 32rpx
	}

	.fw5 {
		font-weight: 500
	}

	.fw6 {
		font-weight: 600
	}

	.mu {
		color: #94A3B8
	}

	.red {
		color: #F43F5E
	}

	.amber {
		color: #F59E0B
	}

	.blue {
		color: #3B82F6
	}

	.green {
		color: #16A34A
	}

	.purple {
		color: #8B5CF6
	}

	.ink {
		color: #0F172A
	}

	.s10 {
		width: 20rpx;
		height: 20rpx;
		flex-shrink: 0
	}

	.s12 {
		width: 24rpx;
		height: 24rpx;
		flex-shrink: 0
	}

	.s14 {
		width: 28rpx;
		height: 28rpx;
		flex-shrink: 0
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

	.s22 {
		width: 44rpx;
		height: 44rpx;
		flex-shrink: 0
	}

	.s24 {
		width: 48rpx;
		height: 48rpx;
		flex-shrink: 0
	}

	.white {
		color: #fff
	}

	/* Header */
	.header {
		background: linear-gradient(135deg, #16A34A, #15803D);
		padding: 40rpx 40rpx 64rpx;
		border-radius: 0 0 48rpx 48rpx
	}

	.hdr-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx
	}

	.hdr-user {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx
	}

	.hdr-avatar {
		width: 88rpx;
		height: 88rpx;
		border-radius: 50%;
		background: rgba(255, 255, 255, .2);
		display: flex;
		align-items: center;
		justify-content: center
	}

	.hdr-greet {
		font-size: 24rpx;
		color: rgba(255, 255, 255, .7);
		font-weight: 500;
		display: block
	}

	.hdr-name {
		font-size: 32rpx;
		color: #fff;
		font-weight: 700;
		display: block;
		margin-top: 2rpx
	}

	.hdr-bell {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background: rgba(255, 255, 255, .1);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative
	}

	.bell-dot {
		position: absolute;
		top: 16rpx;
		right: 20rpx;
		width: 16rpx;
		height: 16rpx;
		background: #F43F5E;
		border-radius: 50%;
		border: 4rpx solid #16A34A
	}

	.hdr-tags {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 16rpx
	}

	.hdr-tag {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8rpx;
		padding: 8rpx 20rpx;
		background: rgba(255, 255, 255, .15);
		border-radius: 9999rpx;
		font-size: 24rpx;
		color: rgba(255, 255, 255, .9);
		font-weight: 500
	}

	.hdr-code {
		font-size: 24rpx;
		color: rgba(255, 255, 255, .5)
	}

	/* Section */
	.sec {
		margin-bottom: 32rpx
	}

	.sec-ttl {
		display: block;
		margin-bottom: 24rpx;
		padding-left: 8rpx
	}

	/* Card */
	.card {
		background: #fff;
		border-radius: 40rpx;
		padding: 40rpx;
		box-shadow: 0 4rpx 40rpx rgba(0, 0, 0, .05)
	}

	.card-mb {
		margin-bottom: 24rpx
	}

	.card-hd {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx
	}

	.card-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 24rpx
	}

	.card-top-l {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		gap: 24rpx
	}

	.card-btm {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center
	}

	/* Icon circles */
	.cicon {
		width: 88rpx;
		height: 88rpx;
		border-radius: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.cicon-green {
		background: #22C55E;
		box-shadow: 0 8rpx 24rpx rgba(34, 197, 94, .3)
	}

	.cicon-amber {
		background: #F59E0B;
		box-shadow: 0 8rpx 24rpx rgba(245, 158, 11, .3)
	}

	.big-num {
		font-size: 56rpx;
		font-weight: 700;
		color: #0F172A;
		line-height: 1.1;
		display: block;
		margin-top: 4rpx
	}

	/* Badge */
	.badge {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8rpx;
		padding: 8rpx 20rpx;
		border-radius: 16rpx
	}

	.badge-green {
		background: #F0FDF4
	}

	.badge-rose {
		background: #FFE4E6
	}

	.pulse-dot {
		width: 12rpx;
		height: 12rpx;
		background: #F43F5E;
		border-radius: 50%;
		animation: pulse 1.5s ease-in-out infinite
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

	/* Overview grid */
	.overview-grid {
		display: flex;
		flex-direction: row;
		gap: 24rpx
	}

	.ov-item {
		flex: 1;
		border-radius: 32rpx;
		padding: 32rpx
	}

	.ov-green {
		background: #F0FDF4
	}

	.ov-rose {
		background: #FFE4E6
	}

	.ov-hd {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 16rpx
	}

	.ov-icon {
		width: 48rpx;
		height: 48rpx;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.ov-icon-g {
		background: rgba(22, 163, 74, .1)
	}

	.ov-icon-r {
		background: rgba(244, 63, 94, .1)
	}

	.ov-label {
		font-size: 24rpx;
		color: #64748B;
		font-weight: 500
	}

	.ov-num {
		font-size: 48rpx;
		font-weight: 700;
		color: #0F172A;
		line-height: 1;
		display: block
	}

	.ov-sub {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8rpx;
		margin-top: 12rpx;
		font-size: 20rpx
	}

	/* Trend chart */
	.trend {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		gap: 6rpx;
		height: 80rpx;
		margin-bottom: 24rpx;
		padding: 0 4rpx
	}

	.tr-bar {
		flex: 1;
		background: #DCFCE7;
		border-radius: 8rpx 8rpx 0 0
	}

	.tr-bar-active {
		background: #22C55E;
		box-shadow: 0 0 16rpx rgba(34, 197, 94, .4)
	}

	/* Flow list */
	.flow-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		margin-bottom: 24rpx
	}

	.flow-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx
	}

	.flow-label {
		font-size: 24rpx;
		color: #94A3B8;
		width: 112rpx
	}

	.flow-bar {
		flex: 1;
		height: 16rpx;
		background: #F1F5F9;
		border-radius: 9999rpx;
		overflow: hidden
	}

	.flow-fill {
		height: 100%;
		border-radius: 9999rpx
	}

	.flow-num {
		font-size: 24rpx;
		color: #334155;
		font-weight: 600;
		width: 48rpx;
		text-align: right
	}

	/* Quick actions */
	.qa-card {
		padding: 32rpx
	}

	.qa-main-btn {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 32rpx;
		padding: 32rpx;
		background: #22C55E;
		border-radius: 32rpx;
		box-shadow: 0 8rpx 32rpx rgba(34, 197, 94, .35);
		margin-bottom: 24rpx
	}

	.qa-main-btn:active {
		transform: scale(.98);
		opacity: .95
	}

	.qa-main-icon {
		width: 96rpx;
		height: 96rpx;
		border-radius: 28rpx;
		background: rgba(255, 255, 255, .2);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0
	}

	.qa-main-text {
		flex: 1;
		min-width: 0
	}

	.qa-main-title {
		font-size: 32rpx;
		font-weight: 700;
		color: #fff;
		display: block
	}

	.qa-main-sub {
		font-size: 24rpx;
		color: rgba(255, 255, 255, .7);
		display: block;
		margin-top: 4rpx
	}

	.qa-grid {
		display: flex;
		flex-direction: row;
		gap: 24rpx
	}

	.qa-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16rpx;
		padding: 24rpx;
		background: #F8FAFC;
		border-radius: 28rpx
	}

	.qa-item:active {
		background: #F1F5F9
	}

	.qa-icon-wrap {
		width: 80rpx;
		height: 80rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.qa-iw-blue {
		background: #DBEAFE
	}

	.qa-iw-amber {
		background: #FEF3C7
	}

	.qa-iw-green {
		background: #DCFCE7
	}

	.qa-label {
		font-size: 24rpx;
		color: #334155;
		font-weight: 500
	}

	/* Feed */
	.feed-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx;
		padding: 32rpx 0
	}

	.feed-div {
		height: 1rpx;
		background: #F1F5F9
	}

	.feed-avatar {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0
	}

	.feed-av-green {
		background: #DCFCE7
	}

	.feed-av-amber {
		background: #FEF3C7
	}

	.feed-av-blue {
		background: #DBEAFE
	}

	.feed-av-red {
		background: #FFE4E6
	}

	.feed-main {
		flex: 1;
		min-width: 0
	}

	.feed-text {
		font-size: 28rpx;
		color: #0F172A;
		font-weight: 500
	}

	.feed-time {
		font-size: 24rpx;
		color: #94A3B8;
		display: block;
		margin-top: 4rpx
	}

	.feed-dot {
		width: 16rpx;
		height: 16rpx;
		background: #F43F5E;
		border-radius: 50%;
		flex-shrink: 0
	}

	/* Bottom nav */
	.btmnav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		background: rgba(255, 255, 255, .95);
		border-top: 1rpx solid #F1F5F9
	}

	.btmnav-inner {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		padding: 8rpx 0
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