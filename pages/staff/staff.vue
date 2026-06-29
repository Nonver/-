<template>
	<view class="pg">

		<!-- 问候区 -->
		<view class="hdr">
			<view class="hdr-main">
				<!-- <view class="hdr-back" @tap="goBack"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"
						stroke="#64748b" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg></view> -->
				<text class="greet">{{ greeting }}</text>
				<text class="name">{{ userName }}</text>
				<text class="date">{{ dateStr }}</text>
			</view>
			<view class="avatar">{{ initials }}</view>
		</view>

		<!-- 个人中心 -->
		<view v-show="currentTab==='profile'" class="main">
			<!-- 待办考核 -->
			<view class="card" style="margin-top: 20rpx;">
				<view class="card-hd">
					<view class="card-hd-l">
						<view class="icon icon-r"><svg class="s18 red" viewBox="0 0 24 24" fill="none"
								stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
							</svg></view>
						<text class="card-title">待办考核</text>
					</view>
					<view class="card-hd-r">
						<view class="dot dot-r"></view>
						<text class="card-num red">{{ pendingCount }}</text>
					</view>
				</view>
				<view v-if="pendingList.length===0" class="mu" style="padding:20rpx 0 10rpx;text-align:center">暂无待审核</view>
				<view v-else class="todo-list">
					<view v-for="p in pendingList" :key="p.id" class="todo" :class="p.urgent?'i-red-border':''" @tap="goToDetail(p.publish_id, p.name)">
						<text class="todo-dot" :class="p.urgent?'todo-dot-r':''"></text>
						<text class="todo-txt">{{ p.name }}</text>
						<text class="todo-tag amber">{{ p.deadline || '待审核' }}</text>
					</view>
				</view>
				<view class="card-ft"><text class="card-ft-txt">查看全部待办</text><svg class="s16 mu" viewBox="0 0 24 24"
						fill="none" stroke="currentColor" stroke-width="2">
						<path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
					</svg></view>
			</view>

			<!-- 进行中 -->
			<view class="card">
				<view class="card-hd">
					<view class="card-hd-l">
						<view class="icon icon-b"><svg class="s18 blue" viewBox="0 0 24 24" fill="none"
								stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
							</svg></view>
						<text class="card-title">进行中</text>
					</view>
					<text class="card-num blue">{{ progressCount }}</text>
				</view>
				<view v-if="progressList.length===0" class="mu" style="padding:20rpx 0 10rpx;text-align:center">暂无进行中考核</view>
				<view v-else class="prog-list">
					<view v-for="(p,idx) in progressList" :key="p.id" :class="idx>0?'prog-gap':''" @tap="goToDetail(p.publish_id, p.name)">
						<view class="prog-hd"><text class="prog-name">{{ p.name }}</text><text
								class="prog-pct blue">{{ p.pct }}%</text></view>
						<view class="bar">
							<view class="bar-fill bar-b" :style="'width:'+p.pct+'%'"></view>
						</view>
						<view class="prog-sub"><text class="mu-text">{{ p.stage }}</text></view>
					</view>
				</view>
			</view>

			<!-- 已完结 -->
			<view class="card">
				<view class="card-hd">
					<view class="card-hd-l">
						<view class="icon icon-g"><svg class="s18 green" viewBox="0 0 24 24" fill="none"
								stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg></view>
						<text class="card-title">已完结</text>
					</view>
					<text class="card-num green">{{ doneCount }}</text>
				</view>
				<view class="card-sub-hd"><text class="mu-text" style="margin-right:16rpx">本月</text>
					<view class="sub-line"></view>
				</view>
				<view v-if="doneList.length===0" class="mu" style="padding:20rpx 0 10rpx;text-align:center">暂无已完结考核</view>
				<view v-else class="done-list">
					<view v-for="d in doneList" :key="d.id" class="done-item" @tap="goToDetail(d.publish_id, d.name)">
						<svg class="s16" :class="d.is_passed?'green':'g2'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
						</svg>
						<text class="done-txt" :class="d.is_passed?'':'done-txt-dim'">{{ d.name }}</text>
						<text class="done-tag" :class="d.is_passed?'green fw5':'mu'">{{ d.is_passed?'达标':'未达标' }}</text>
					</view>
				</view>
			</view>

			<!-- 达标状态 -->
			<!-- <view class="card">
				<view class="card-hd" style="margin-bottom:40rpx">
					<view class="card-hd-l">
						<view class="icon icon-g"><svg class="s18 green" viewBox="0 0 24 24" fill="none"
								stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
							</svg></view>
						<text class="card-title">达标状态</text>
					</view>
				</view>
				<view class="ring-row">
					<view class="ring-wrap">
						<svg class="ring-svg" viewBox="0 0 100 100">
							<circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" stroke-width="8" />
							<circle cx="50" cy="50" r="42" fill="none" stroke="#10b981" stroke-width="8"
								stroke-linecap="round" stroke-dasharray="263.89" :stroke-dashoffset="ringDashoffset"
								transform="rotate(-90 50 50)" />
						</svg>
						<view class="ring-center"><text class="ring-num">{{ kpiRate }}</text><text class="ring-pct">%</text></view>
					</view>
					<view class="ring-right">
						<view v-for="ki in kpiItems" :key="ki.label" class="ri">
							<view class="ri-hd"><text class="ri-label">{{ ki.label }}</text><text
									class="ri-pct" :class="ki.color">{{ ki.pct }}%</text></view>
							<view class="bar bar-sm">
								<view class="bar-fill bar-sm" :class="mapKpiBarCls(ki)" :style="'width:'+ki.pct+'%'"></view>
							</view>
						</view>
					</view>
				</view>
				<view class="card-ft" style="border-top:none;margin-top:32rpx">
					<svg class="s14" :class="kpiRate>=80?'green':(kpiRate>=60?'amber':'red')" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd" />
					</svg>
					<text class="card-ft-txt" :class="kpiRate>=80?'green':(kpiRate>=60?'amber':'red')">{{ kpiRate>=80?'综合达标，继续保持':(kpiRate>=60?'部分达标，继续努力':'未达标，需改进') }}</text>
				</view>
			</view> -->

		</view>

		<view v-show="currentTab==='assess'" class="main">
			<!-- 考核管理 -->

			<!-- 历史考核列表 -->
			<view class="card">
				<view class="card-hd" style="margin-top: 20rpx;">
					<view class="card-hd-l">
						<view class="icon icon-b"><svg class="s18 blue" viewBox="0 0 24 24" fill="none"
								stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg></view>
						<text class="card-title">历史考核</text>
					</view>
					<text class="card-num blue">{{ myAssessments.length }}</text>
				</view>
				<view v-if="myAssessments.length===0" class="empty-tip">
					<text class="mu">暂无历史考核记录</text>
				</view>
				<view v-for="a in myAssessments" :key="a.id" class="assess-item" @tap="goToDetail(a.publish_id, a.name)">
					<view class="assess-item-left">
						<text class="assess-name">{{ a.name }}</text>
						<text class="assess-period">{{ a.period }}</text>
					</view>
					<text class="assess-status" :class="a.cls">{{ a.status }}</text>
				</view>
				<view class="card-ft" v-if="myAssessments.length > 0" @tap="goToHistoryAll">
					<text class="card-ft-txt">查看全部</text>
					<svg class="s16 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
					</svg>
				</view>
			</view>

		</view>

		<!-- 底部Tab导航 -->
		<view class="btmnav">
			<view class="btmnav-inner">
				<view class="btmnav-item" :class="currentTab==='profile'?'on':''" @tap="currentTab='profile'">
					<svg class="nav-icon" :class="currentTab==='profile'?'active':'mu'" viewBox="0 0 24 24" fill="none"
						stroke="currentColor" stroke-width="1.5">
						<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
						<circle cx="12" cy="7" r="4" />
					</svg>
					<text class="nav-label" :class="currentTab==='profile'?'active':''">首页</text>
				</view>
				<view class="btmnav-item" :class="currentTab==='assess'?'on':''" @tap="currentTab='assess'">
					<svg class="nav-icon" :class="currentTab==='assess'?'active':'mu'" viewBox="0 0 24 24" fill="none"
						stroke="currentColor" stroke-width="1.5">
						<path
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
					</svg>
					<text class="nav-label" :class="currentTab==='assess'?'active':''">考核管理</text>
				</view>
				<view class="btmnav-item" @tap="goMyPage">
					<svg class="nav-icon mu" viewBox="0 0 24 24" fill="none"
						stroke="currentColor" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
					</svg>
					<text class="nav-label mu">个人中心</text>
				</view>
			</view>
			<view class="safe-btm"></view>
		</view>

	</view>
</template>

<script>
	import { api } from '@/utils/api.js'
	import { useAuth } from '@/stores/auth.js'
	const auth = useAuth()

	export default {
		data() {
			const now = new Date()
			const h = now.getHours()
			let g = '早上好'
			if (h >= 11 && h < 14) g = '中午好'
			else if (h >= 14 && h < 18) g = '下午好'
			else if (h >= 18) g = '晚上好'
			const wd = ['日', '一', '二', '三', '四', '五', '六']
			const ds = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日 星期' + wd[now.getDay()]
			return {
				greeting: g,
				dateStr: ds,
				currentTab: 'profile',
				loading: false,
				// API数据
				assessCycle: '',
				pendingCount: 0,
				progressCount: 0,
				doneCount: 0,
				pendingList: [],
				progressList: [],
				doneList: [],
				kpiRate: 0,
				kpiItems: [],
				myAssessments: [],
			}
		},
		computed: {
			userName() { return auth.state.userName || '员工' },
			initials() {
				const n = this.userName
				return n.length >= 2 ? n.slice(0, 2) : (n.slice(0, 1) || '?')
			},
			// 达标率环状图参数
			ringDashoffset() {
				const circumference = 263.89
				return circumference * (1 - this.kpiRate / 100)
			},
		},
		onShow() {
			this.$checkAuth()
			this.fetchDashboard()
		},
		methods: {
			goBack() { uni.navigateTo({ url: auth.getHomePage() }) },
			goMyPage() { uni.navigateTo({ url: '/pages/my/my' }) },
		goToDetail(publishId, name) {
			if (!publishId) {
				uni.showToast({ title: '暂无考核详情', icon: 'none' })
				return
			}
			// 主播部员工/组长跳转主播专属考核提交页
			if (auth.state.departmentId === 7) {
				uni.navigateTo({ url: '/pages/anchor-assess-submit/anchor-assess-submit?publish_id=' + publishId })
				return
			}
			uni.navigateTo({ url: '/pages/assessment-detail/assessment-detail?publish_id=' + publishId + '&name=' + encodeURIComponent(name || '') })
			},
			mapKpiBarCls(ki) {
				const m = { green: 'bar-g', blue: 'bar-b', amber: 'bar-a', red: 'bar-r' }
				return m[ki.color] || 'bar-b'
			},
			goToHistoryAll() {
				uni.navigateTo({ url: '/pages/broker-assessment-list/broker-assessment-list' })
			},
			async fetchDashboard() {
				this.loading = true
				try {
					const res = await api.get('/api/admin/staff/dashboard', null, { silent: true })
					if (res.data) {
						const d = res.data
						this.assessCycle = d.assess_cycle || ''
						this.pendingCount = d.pending_count || 0
						this.progressCount = d.progress_count || 0
						this.doneCount = d.done_count || 0
						this.pendingList = d.pending_list || []
						this.progressList = d.progress_list || []
						this.doneList = d.done_list || []
						this.kpiRate = d.kpi_rate || 0
						this.kpiItems = d.kpi_items || []

				// 组装"我的考核"列表（全部记录）
				const all = []
				// 进行中（没提交）
				this.progressList.forEach(p => all.push({
					id: p.id, publish_id: p.publish_id, name: p.name, period: p.period,
					status: '进行中', cls: 'blue'
				}))
				// 待办（已提交等审核）
				this.pendingList.forEach(p => all.push({
					id: p.id, publish_id: p.publish_id, name: p.name, period: p.period,
					status: '待审核', cls: 'amber'
				}))
				// 已完结
				this.doneList.forEach(d => all.push({
					id: d.id, publish_id: d.publish_id, name: d.name, period: d.period,
					status: d.is_passed ? '已通过' : '未达标', cls: d.is_passed ? 'green' : 'red'
				}))
						this.myAssessments = all
					}
				} catch (e) {
					console.error('[staffDashboard]', e)
				}
				this.loading = false
			},
			},
	}
</script>

<style>
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #f8fafc;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased;
		padding-bottom: 160rpx
	}

	.main {
		padding: 0 40rpx 48rpx
	}

	.red {
		color: #ef4444
	}

	.blue {
		color: #2563eb
	}

	.green {
		color: #10b981
	}

	.amber {
		color: #d97706
	}

	.mu {
		color: #94a3b8
	}

	.g2 {
		color: #6ee7b7
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

	.fw5 {
		font-weight: 500
	}

	.fw6 {
		font-weight: 600
	}

	/* Header */
	.hdr {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		padding: 80rpx 40rpx 48rpx
	}

	.hdr-main {
		flex: 1
	}

	.greet {
		font-size: 28rpx;
		color: #94a3b8;
		font-weight: 500;
		display: block
	}

	.name {
		font-size: 44rpx;
		font-weight: 600;
		color: #0f172a;
		display: block;
		margin-top: 4rpx
	}

	.date {
		font-size: 24rpx;
		color: #94a3b8;
		font-weight: 500;
		margin-top: 12rpx;
		display: block
	}

	.avatar {
		width: 88rpx;
		height: 88rpx;
		border-radius: 50%;
		background: #dbeafe;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		font-weight: 600;
		color: #2563eb;
		flex-shrink: 0;
		margin-left: 24rpx
	}

	/* Card */
	.card {
		background: #fff;
		border-radius: 32rpx;
		padding: 40rpx;
		margin-bottom: 32rpx
	}

	.card:active {
		transform: scale(.98)
	}

	.card-hd {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx
	}

	.card-hd-l {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 20rpx
	}

	.card-title {
		font-size: 30rpx;
		font-weight: 600;
		color: #334155
	}

	.card-num {
		font-size: 36rpx;
		font-weight: 700
	}

	.card-hd-r {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 12rpx
	}

	.card-sub-hd {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 20rpx
	}

	.sub-line {
		flex: 1;
		height: 1rpx;
		background: #f1f5f9
	}

	.card-ft {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 24rpx;
		padding-top: 24rpx;
		border-top: 1rpx solid #f1f5f9
	}

	.card-ft-txt {
		font-size: 24rpx;
		color: #94a3b8
	}

	.icon {
		width: 72rpx;
		height: 72rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.icon-r {
		background: #fef2f2
	}

	.icon-b {
		background: #eff6ff
	}

	.icon-g {
		background: #ecfdf5
	}

	.dot {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%
	}

	.dot-r {
		background: #ef4444;
		animation: pulse 2s ease-in-out infinite
	}

	@keyframes pulse {

		0%,
		100% {
			opacity: 1
		}

		50% {
			opacity: .7
		}
	}

	/* Todo */
	.todo-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx
	}

	.todo {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 20rpx 24rpx;
		background: #f8fafc;
		border-radius: 20rpx
	}

	.todo.i-red {
		border: 1rpx solid #fee2e2
	}

	.todo.i-red-border {
		border: 1rpx solid #fee2e2
	}

	.todo-dot {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		background: #f87171;
		flex-shrink: 0;
		margin-right: 20rpx
	}

	.todo-dot-r {
		background: #ef4444
	}

	.todo-txt {
		font-size: 26rpx;
		color: #475569;
		flex: 1
	}

	.todo-tag {
		font-size: 22rpx;
		font-weight: 500;
		flex-shrink: 0;
		margin-left: 16rpx
	}

	/* Progress */
	.prog-list {
		display: flex;
		flex-direction: column
	}

	.prog-gap {
		padding-top: 24rpx;
		border-top: 1rpx solid #f1f5f9;
		margin-top: 28rpx
	}

	.prog-hd {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx
	}

	.prog-name {
		font-size: 26rpx;
		color: #475569
	}

	.prog-pct {
		font-size: 24rpx;
		font-weight: 600
	}

	.prog-sub {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 12rpx
	}

	.mu-text {
		font-size: 22rpx;
		color: #94a3b8
	}

	.bar {
		height: 8rpx;
		background: #f1f5f9;
		border-radius: 9999rpx;
		overflow: hidden
	}

	.bar-sm {
		height: 6rpx
	}

	.bar-fill {
		height: 8rpx;
		border-radius: 9999rpx
	}

	.bar-fill.bar-sm {
		height: 6rpx
	}

	.bar-b {
		background: #2563eb
	}

	.bar-bl {
		background: #60a5fa
	}

	.bar-g {
		background: #10b981
	}

	.bar-a {
		background: #f59e0b
	}

	/* Done */
	.done-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx
	}

	.done-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 16rpx 24rpx;
		background: rgba(16, 185, 129, .05);
		border-radius: 20rpx
	}

	.done-item:last-child {
		background: transparent
	}

	.done-txt {
		font-size: 26rpx;
		color: #475569;
		flex: 1;
		margin: 0 20rpx
	}

	.done-txt-dim {
		font-size: 26rpx;
		color: #64748b;
		flex: 1;
		margin: 0 20rpx
	}

	.done-tag {
		font-size: 22rpx;
		flex-shrink: 0
	}

	/* Ring */
	.ring-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 40rpx
	}

	.ring-wrap {
		position: relative;
		flex-shrink: 0
	}

	.ring-svg {
		width: 200rpx;
		height: 200rpx
	}

	.ring-center {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center
	}

	.ring-num {
		font-size: 48rpx;
		font-weight: 700;
		color: #10b981;
		line-height: 1
	}

	.ring-pct {
		font-size: 20rpx;
		color: #10b981;
		font-weight: 500;
		margin-top: 2rpx
	}

	.ring-right {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 24rpx
	}

	.ri {
		display: flex;
		flex-direction: column;
		gap: 12rpx
	}

	.ri-hd {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center
	}

	.ri-label {
		font-size: 24rpx;
		color: #64748b
	}

	.ri-pct {
		font-size: 24rpx;
		font-weight: 600
	}

	/* 底部导航 - 与系统风格一致 */
	.btmnav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		background: rgba(255, 255, 255, .85);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-top: 1rpx solid rgba(0, 0, 0, .06)
	}

	.btmnav-inner {
		display: flex;
		flex-direction: row;
		padding: 8rpx 24rpx 0
	}

	.btmnav-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rpx;
		padding: 8rpx 0 12rpx;
		border-radius: 16rpx 16rpx 0 0;
		transition: background .2s
	}

	.btmnav-item.on {
		/* background: rgba(99, 112, 240, .1) */
	}

	.nav-icon {
		width: 36rpx;
		height: 36rpx;
		flex-shrink: 0
	}

	.nav-icon.active {
		color: #6370f0
	}

	.nav-label {
		font-size: 20rpx;
		font-weight: 400;
		color: #94A3B8;
		transition: color .2s
	}

	.nav-label.active {
		color: #6370f0;
		font-weight: 600
	}

	.mu {
		color: #94A3B8
	}

	.safe-btm {
		height: env(safe-area-inset-bottom, 0px)
	}

	/* 考核管理表单 */
	.empty-tip {
		text-align: center;
		padding: 32rpx 0
	}

	.assess-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-top: 1rpx solid #F1F5F9
	}

	.assess-item:first-of-type {
		border-top: none
	}

	.assess-item-left {
		display: flex;
		flex-direction: column;
		gap: 4rpx
	}

	.assess-name {
		font-size: 26rpx;
		font-weight: 500;
		color: #334155
	}

	.assess-period {
		font-size: 22rpx;
		color: #94A3B8
	}

	.assess-status {
		font-size: 22rpx;
		font-weight: 600;
		padding: 6rpx 20rpx;
		border-radius: 20rpx
	}

	.assess-status.blue {
		background: #EFF6FF;
		color: #2563EB
	}

	.assess-status.green {
		background: #ECFDF5;
		color: #10B981
	}

	.assess-status.amber {
		background: #FFFBEB;
		color: #D97706
	}

	.assess-status.red {
		background: #FEF2F2;
		color: #EF4444
	}

	.hdr-back {
		width: 56rpx;
		height: 56rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		margin-bottom: 8rpx
	}

	.hdr-back:active {
		background: rgba(0, 0, 0, .06)
	}
</style>