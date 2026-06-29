<template>
	<view class="pg">

		<!-- ===== 首页视图 ===== -->
		<view v-show="currentView === 'home'">

			<!-- 顶栏 -->
			<view class="topbar">
				<view class="topbar-inner">
					<view class="tbl">
						<view class="tbl-icon">
							<svg class="s16 white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
								stroke-width="1.5">
								<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
							</svg>
						</view>
						<view>
							<text class="t15 fw6">全局监管工作台</text>
							<view class="tbl-tags">
								<text class="tbl-tag tbl-tag-b">总经办</text>
								<text class="tbl-tag tbl-tag-w">无考核监管岗</text>
							</view>
						</view>
					</view>
					<view class="bell-wrap">
						<svg class="s16 gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
							<path d="M13.73 21a2 2 0 0 1-3.46 0" />
						</svg>
						<view class="bell-dot"></view>
					</view>
				</view>
			</view>

			<view class="main">

			<!-- 日期 -->
			<view class="date-line"><text class="t13 mu">今日 {{ todayStr }}，全量考核数据概览</text></view>

				<!-- 全量考核审核 -->
				<view class="sec">
					<view class="sechd">
						<view class="sec-label">
							<view class="sec-bar sec-bar-b"></view><text class="t15 fw6">全量考核审核</text>
						</view>
						<text class="t11 mu">本月累计</text>
					</view>

					<view class="card card-glow" @tap="goToPage('/pages/oversight-final/oversight-final')">
						<view class="audit-top">
							<view><text class="mu-text">待审核总数</text><text class="big-num">{{ auditStats.pending }}</text></view>
							<view class="tag tag-r">
								<view class="pdot pdot-r"></view><text>待处理</text>
							</view>
						</view>
						<view class="audit-bar-row">
							<view class="audit-bar-hd"><text class="audit-label">审核进度</text><text
									class="audit-pct">{{ auditStats.progressPercent }}%</text></view>
							<view class="bar">
								<view class="bar-fill bar-brand" :style="{width: auditStats.progressPercent + '%'}"></view>
							</view>
						</view>
						<view class="audit-3col">
							<view class="ac ac-brand"><text class="ac-num">{{ auditStats.pending }}</text><text class="ac-label">待审核</text>
							</view>
							<view class="ac ac-sage"><text class="ac-num">{{ auditStats.reviewed }}</text><text class="ac-label">已审核</text>
							</view>
							<view class="ac ac-ink"><text class="ac-num">{{ auditStats.totalSubmitted }}</text><text class="ac-label">总提交</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 近7日审核趋势 -->
				<view class="sec">
					<view class="card">
						<view class="chart-hd">
							<text class="t13 fw6">近7日审核趋势</text>
							<view class="chart-legend">
								<view class="cl-item">
									<view class="cl-dot cl-dot-b"></view><text class="t10 mu">待审</text>
								</view>
								<view class="cl-item">
									<view class="cl-dot cl-dot-s"></view><text class="t10 mu">已审</text>
								</view>
							</view>
						</view>
						<view class="chart-bars">
							<view v-for="d in chartData" :key="d.d" class="cb-col">
								<view class="cb-bars">
									<view class="cb-bar cb-bar-b" :style="{height:d.p+'%'}"></view>
									<view class="cb-bar cb-bar-s" :style="{height:d.s+'%'}"></view>
								</view>
								<text class="cb-label" :class="{'cb-today':d.today}">{{ d.d }}</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 不达标人员 -->
				<view class="sec">
					<view class="sechd">
						<view class="sec-label">
							<view class="sec-bar sec-bar-r"></view><text class="t15 fw6">不达标人员</text>
						</view>
						<text class="t11 mu">本月统计</text>
					</view>

					<view class="card card-rose-glow">
						<view class="fail-top">
							<view class="fail-ring">
								<svg class="ring-svg" viewBox="0 0 72 72">
									<circle cx="36" cy="36" r="30" fill="none" stroke="#eceef2" stroke-width="6" />
									<circle cx="36" cy="36" r="30" fill="none" stroke="#f43f5e" stroke-width="6"
										stroke-linecap="round" stroke-dasharray="188.5" :stroke-dashoffset="ringDashoffset"
										transform="rotate(-90 36 36)" />
								</svg>
								<view class="ring-center"><text class="ring-big">{{ failStats.failPercent }}</text><text
										class="ring-small">%</text></view>
							</view>
							<view class="fail-info">
								<text class="mu-text" style="margin-bottom:4rpx;display:block">不达标人数 / 总人数</text>
								<text class="big-num red">{{ failStats.failCount }}</text><text class="fail-total">/ {{ failStats.totalCount }} 人</text>
								<view class="fail-trend"><text class="t11 red fw5">{{ failStats.failTrend || '' }}</text></view>
							</view>
						</view>
						<view class="divider-dashed"></view>
						<view class="fail-list">
							<view v-for="(cat, idx) in failStats.categories" :key="idx" class="fl-item">
								<view class="fl-l">
									<view :class="['fl-icon', 'fl-icon-' + failIconStyle(idx).cls]">
										<svg v-if="idx === 0" class="s12 red" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
											<line x1="12" y1="9" x2="12" y2="13" />
											<line x1="12" y1="17" x2="12.01" y2="17" />
										</svg>
										<svg v-else-if="idx === 1" class="s12 amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<circle cx="12" cy="12" r="10" />
											<polyline points="12 6 12 12 16 14" />
										</svg>
										<svg v-else class="s12 blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
										</svg>
									</view>
									<view><text class="fl-title">{{ cat.name }}</text><text class="fl-sub">{{ cat.sub }}</text></view>
								</view>
								<view class="fl-r"><text class="fl-num">{{ cat.count }}</text><text class="fl-pct">{{ cat.percent }}%</text></view>
							</view>
						</view>
					</view>
				</view>

				<!-- 监管台账 -->
				<view class="sec">
					<view class="sechd">
						<view class="sec-label">
							<view class="sec-bar sec-bar-z"></view><text class="t15 fw6">监管台账</text>
						</view>
					</view>
					<view class="ledger-list">
						<view class="lg" @tap="goToPage('/pages/assess-audit/assess-audit')">
							<view class="lg-icon lg-icon-g"><svg class="s18 green" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="1.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg></view>
							<view class="lg-main">
								<view class="lg-hd"><text class="lg-title">考核达标审核</text><text
										class="lg-badge lg-badge-g">员工审核</text></view>
								<text class="lg-sub">审核员工提交的考核，标记达标/不达标</text>
							</view>
							<svg class="s16 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M9 18l6-6-6-6" />
							</svg>
						</view>
						<view class="lg" @tap="goToPage('/pages/assess-audit/history')">
							<view class="lg-icon lg-icon-v"><svg class="s18 violet" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="1.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg></view>
							<view class="lg-main">
								<view class="lg-hd"><text class="lg-title">考核历史</text><text
										class="lg-badge lg-badge-v">查询</text></view>
								<text class="lg-sub">按姓名/手机号/部门/时间 查询历史考核</text>
							</view>
							<svg class="s16 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M9 18l6-6-6-6" />
							</svg>
						</view>
						<view class="lg" @tap="goToPage('/pages/dismiss-ledger/dismiss-ledger')">
							<view class="lg-icon lg-icon-r"><svg class="s18 red" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="1.5">
									<path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
									<circle cx="9" cy="7" r="4" />
									<line x1="17" y1="9" x2="23" y2="15" />
									<line x1="23" y1="9" x2="17" y2="15" />
								</svg></view>
							<view class="lg-main">
								<view class="lg-hd"><text class="lg-title">劝退记录</text><text
										class="lg-badge lg-badge-r">本月 {{ ledgerCounts.dismiss }} 条</text></view>
								<text class="lg-sub">人员劝退申请、审批与归档记录</text>
							</view>
							<svg class="s16 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M9 18l6-6-6-6" />
							</svg>
						</view>
						<view class="lg" @tap="goToPage('/pages/flow-ledger/flow-ledger')">
							<view class="lg-icon lg-icon-w"><svg class="s18 amber" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="1.5">
									<line x1="12" y1="1" x2="12" y2="23" />
									<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
								</svg></view>
							<view class="lg-main">
								<view class="lg-hd"><text class="lg-title">流水台账</text><text
										class="lg-badge lg-badge-w">本月 {{ ledgerCounts.flow }} 笔</text></view>
								<text class="lg-sub">财务收支流水明细与对账记录</text>
							</view>
							<svg class="s16 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M9 18l6-6-6-6" />
							</svg>
						</view>
						<view class="lg" @tap="goToPage('/pages/transfer-flow/transfer-flow')">
							<view class="lg-icon lg-icon-o"><svg class="s18 blue" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="1.5">
									<circle cx="12" cy="12" r="3" />
									<path
										d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
								</svg></view>
							<view class="lg-main">
								<view class="lg-hd"><text class="lg-title">主播流转台账</text><text
										class="lg-badge lg-badge-o">本月 {{ ledgerCounts.anchor }} 条</text></view>
								<text class="lg-sub">主播入离职、转岗、签约变更记录</text>
							</view>
							<svg class="s16 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M9 18l6-6-6-6" />
							</svg>
						</view>
					</view>
				</view>

				<!-- 底部 -->
				<view class="footer"><text class="t11 mu">数据更新时间：{{ updateTime }}</text><text class="t10 mu"
						style="display:block;margin-top:4rpx">总经办 · 全局监管系统 v2.4.1</text></view>

			</view>

		</view>



		<!-- 底部导航 -->
		<bottom-nav :items="navItems" :current="currentView" @change="onNavChange" />

	</view>
</template>

<script>
	import BottomNav from '@/components/bottom-nav.vue'
	import { api } from '../../utils/api.js'

	// ── 不达标类别的图标样式映射 ──
	const FAIL_ICON_STYLES = [
		{ cls: 'r', strokeCls: 'red', iconBgCls: 'fl-icon-r' },
		{ cls: 'w', strokeCls: 'amber', iconBgCls: 'fl-icon-w' },
		{ cls: 'o', strokeCls: 'blue', iconBgCls: 'fl-icon-o' },
	]

	export default {
		components: {
			BottomNav
		},
		data() {
			return {
				currentView: 'home',
				navItems: [
					{ key: 'home', label: '首页' },
					{ key: 'audit', label: '审核', page: '/pages/oversight-final/oversight-final' },
					{ key: 'personnel', label: '人员管理', page: '/pages/personnel-manage/personnel-manage' },
					{ key: 'user', label: '个人中心', page: '/pages/my/my' },
				],
				// 仪表盘数据
				auditStats:   { pending: 0, approved: 0, reviewed: 0, totalSubmitted: 0, progressPercent: 0 },
				chartData:    [],
				failStats:    { failCount: 0, totalCount: 0, failPercent: 0, categories: [], failTrend: '' },
				ledgerCounts: { dismiss: 0, flow: 0, anchor: 0 },
				updateTime:   '',
				loading:      false,
				ringDashoffset: 188.5,
			}
		},
		computed: {
			todayStr() {
				const now = new Date()
				return now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日'
			},
		},
		onShow() {
			this.$checkAuth()
			this.fetchDashboard()
		},
		methods: {
			async fetchDashboard() {
				this.loading = true
				try {
					const res = await api.get('/api/admin/oversight/dashboard', null, { silent: true })
					const d = res.data || {}
					this.auditStats   = d.auditStats   || { pending: 0, approved: 0, reviewed: 0, totalSubmitted: 0, progressPercent: 0 }
					this.failStats    = d.failStats    || { failCount: 0, totalCount: 0, failPercent: 0, categories: [], failTrend: '' }
					this.ledgerCounts = d.ledgerCounts || { dismiss: 0, flow: 0, anchor: 0 }
					this.updateTime   = d.updateTime   || ''
					// 趋势
					this.chartData = (d.trendData || []).map(t => ({
						d: t.date,
						p: t.p,
						s: t.s,
						today: t.today,
					}))
					// 环形图偏移
					const pct = Math.min(Number(this.failStats.failPercent) || 0, 100)
					this.ringDashoffset = 188.5 * (1 - pct / 100)
				} catch (e) {
					console.error('[总经办首页] 获取仪表盘失败:', e)
				} finally {
					this.loading = false
				}
			},
			failIconStyle(idx) {
				return FAIL_ICON_STYLES[idx % FAIL_ICON_STYLES.length]
			},
			onNavChange(key) {
				if (key === 'home') { this.currentView = 'home' }
			},
			goToPage(url) {
				uni.navigateTo({ url })
			},
		}
	}
</script>

<style>
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #f6f7f9;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased
	}

	.main {
		padding: 0 40rpx 48rpx
	}

	.t10 {
		font-size: 20rpx
	}

	.t11 {
		font-size: 22rpx
	}

	.t13 {
		font-size: 26rpx
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
		color: #8694ab
	}

	.red {
		color: #f43f5e
	}

	.amber {
		color: #ea8f1c
	}

	.blue {
		color: #38bdf8
	}
	.violet {
		color: #8b5cf6
	}

	.gray {
		color: #52607b
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

	.s18 {
		width: 36rpx;
		height: 36rpx;
		flex-shrink: 0
	}

	/* Header */
	.topbar {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(255, 255, 255, .92);
		border-bottom: 1rpx solid rgba(213, 218, 226, .6);
		padding: 0 40rpx
	}

	.topbar-inner {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 24rpx 0
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
		border-radius: 20rpx;
		background: #4f46e5;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.tbl-tags {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 12rpx;
		margin-top: 4rpx
	}

	.tbl-tag {
		font-size: 18rpx;
		padding: 2rpx 12rpx;
		border-radius: 6rpx;
		font-weight: 500
	}

	.tbl-tag-b {
		background: #f0f4ff;
		color: #4338ca;
		border: 1rpx solid rgba(199, 215, 254, .5)
	}

	.tbl-tag-w {
		background: #fefaf5;
		color: #af5b11;
		border: 1rpx solid rgba(250, 224, 184, .5)
	}

	.bell-wrap {
		position: relative;
		width: 72rpx;
		height: 72rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.bell-dot {
		position: absolute;
		top: 12rpx;
		right: 16rpx;
		width: 16rpx;
		height: 16rpx;
		background: #f43f5e;
		border-radius: 50%;
		border: 4rpx solid #fff
	}

	/* Section */
	.sec {
		margin-bottom: 24rpx
	}

	.sechd {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx
	}

	.sec-label {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 16rpx
	}

	.sec-bar {
		width: 8rpx;
		height: 32rpx;
		border-radius: 4rpx
	}

	.sec-bar-b {
		background: #6366f1
	}

	.sec-bar-r {
		background: #f43f5e
	}

	.sec-bar-z {
		background: #52607b
	}

	.date-line {
		padding: 40rpx 0 32rpx
	}

	.mu-text {
		font-size: 22rpx;
		color: #8694ab;
		display: block
	}

	.big-num {
		font-size: 64rpx;
		font-weight: 700;
		color: #1a1e26;
		display: block;
		line-height: 1;
		letter-spacing: -.03em
	}

	/* Card */
	.card {
		background: #fff;
		border-radius: 32rpx;
		padding: 40rpx;
		border: 1rpx solid rgba(236, 238, 242, .8)
	}

	.card-glow {
		box-shadow: 0 0 80rpx rgba(99, 102, 241, .06)
	}

	.card-rose-glow {
		box-shadow: 0 0 80rpx rgba(244, 63, 94, .06)
	}

	/* Audit */
	.audit-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx
	}

	.audit-bar-row {
		margin-bottom: 40rpx
	}

	.audit-bar-hd {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx
	}

	.audit-label {
		font-size: 24rpx;
		color: #52607b
	}

	.audit-pct {
		font-size: 24rpx;
		font-weight: 600;
		color: #4f46e5
	}

	.bar {
		height: 8rpx;
		background: #eceef2;
		border-radius: 9999rpx;
		overflow: hidden
	}

	.bar-fill {
		height: 8rpx;
		border-radius: 9999rpx
	}

	.bar-brand {
		background: linear-gradient(90deg, #6366f1, #8194f8)
	}

	.audit-3col {
		display: flex;
		flex-direction: row;
		gap: 24rpx
	}

	.ac {
		flex: 1;
		text-align: center;
		padding: 24rpx;
		border-radius: 24rpx
	}

	.ac-brand {
		background: rgba(99, 102, 241, .05);
		border: 1rpx solid rgba(199, 215, 254, .4)
	}

	.ac-sage {
		background: rgba(77, 122, 77, .05);
		border: 1rpx solid rgba(197, 216, 197, .4)
	}

	.ac-ink {
		background: rgba(236, 238, 242, .5);
		border: 1rpx solid rgba(213, 218, 226, .4)
	}

	.ac-num {
		font-size: 40rpx;
		font-weight: 700;
		color: #1a1e26;
		display: block;
		line-height: 1;
		letter-spacing: -.03em
	}

	.ac-label {
		font-size: 22rpx;
		color: rgba(134, 148, 171, .7);
		display: block;
		margin-top: 8rpx
	}

	.ac-brand .ac-num {
		color: #4338ca
	}

	.ac-sage .ac-num {
		color: #4d7a4d
	}

	.ac-ink .ac-num {
		color: #3a4354
	}

	/* Tags */
	.tag {
		display: inline-flex;
		align-items: center;
		padding: 4rpx 20rpx;
		border-radius: 9999rpx;
		font-size: 22rpx;
		font-weight: 500;
		white-space: nowrap
	}

	.tag-r {
		background: #fff1f2;
		color: #be123c;
		border: 1rpx solid rgba(254, 205, 211, .5)
	}

	.pdot {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		margin-right: 12rpx
	}

	.pdot-r {
		background: #f43f5e;
		animation: pulse2 2s ease-in-out infinite
	}

	@keyframes pulse2 {
		0%, 100% {
			box-shadow: 0 0 0 0 rgba(244, 63, 94, .3);
		}
		50% {
			box-shadow: 0 0 0 6px rgba(244, 63, 94, 0);
		}
	}

	/* Chart */
	.chart-hd {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx
	}

	.chart-legend {
		display: flex;
		flex-direction: row;
		gap: 24rpx
	}

	.cl-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8rpx
	}

	.cl-dot {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%
	}

	.cl-dot-b {
		background: #c7d7fe
	}

	.cl-dot-s {
		background: #9bb99b
	}

	.chart-bars {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-end;
		gap: 16rpx;
		height: 144rpx
	}

	.cb-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4rpx
	}

	.cb-bars {
		width: 100%;
		height: 104rpx;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		gap: 4rpx
	}

	.cb-bar {
		flex: 1;
		border-radius: 6rpx 6rpx 0 0
	}

	.cb-bar-b {
		background: #c7d7fe
	}

	.cb-bar-s {
		background: #9bb99b
	}

	.cb-label {
		font-size: 18rpx;
		color: #8694ab
	}

	.cb-today {
		color: #52607b;
		font-weight: 600
	}

	/* Fail */
	.fail-top {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 40rpx;
		margin-bottom: 32rpx
	}

	.fail-ring {
		position: relative;
		flex-shrink: 0
	}

	.ring-svg {
		width: 144rpx;
		height: 144rpx
	}

	.ring-center {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center
	}

	.ring-big {
		font-size: 32rpx;
		font-weight: 700;
		color: #f43f5e;
		line-height: 1
	}

	.ring-small {
		font-size: 18rpx;
		color: #8694ab
	}

	.fail-info {
		flex: 1
	}

	.fail-total {
		font-size: 26rpx;
		color: #8694ab;
		margin-left: 12rpx
	}

	.fail-trend {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 4rpx;
		margin-top: 8rpx
	}

	.divider-dashed {
		height: 1rpx;
		background-image: linear-gradient(to right, #d5dae2 50%, transparent 50%);
		background-size: 16rpx 1rpx;
		background-repeat: repeat-x;
		margin-bottom: 32rpx
	}

	.fail-list {
		display: flex;
		flex-direction: column;
		gap: 24rpx
	}

	.fl-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center
	}

	.fl-l {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 20rpx
	}

	.fl-icon {
		width: 56rpx;
		height: 56rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.fl-icon-r {
		background: #fff1f2
	}

	.fl-icon-w {
		background: #fefaf5
	}

	.fl-icon-o {
		background: #f0f9ff
	}

	.fl-title {
		font-size: 26rpx;
		font-weight: 500;
		color: #1a1e26
	}

	.fl-sub {
		font-size: 20rpx;
		color: #8694ab;
		display: block;
		margin-top: 2rpx
	}

	.fl-r {
		text-align: right
	}

	.fl-num {
		font-size: 36rpx;
		font-weight: 700;
		color: #1a1e26;
		display: block;
		line-height: 1
	}

	.fl-pct {
		font-size: 20rpx;
		color: #8694ab
	}

	/* Ledger */
	.ledger-list {
		display: flex;
		flex-direction: column;
		gap: 24rpx
	}

	.lg {
		background: #fff;
		border-radius: 32rpx;
		padding: 32rpx;
		border: 1rpx solid rgba(236, 238, 242, .8);
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 28rpx
	}

	.lg:active {
		transform: scale(.985)
	}

	.lg-icon {
		width: 88rpx;
		height: 88rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0
	}

	.lg-icon-r {
		background: #fff1f2;
		border: 1rpx solid rgba(254, 205, 211, .5)
	}

	.lg-icon-w {
		background: #fefaf5;
		border: 1rpx solid rgba(250, 224, 184, .5)
	}

	.lg-icon-o {
		background: #f0f9ff;
		border: 1rpx solid rgba(186, 230, 253, .5)
	}

	.lg-icon-g {
		background: #ecfdf5;
		border: 1rpx solid rgba(110, 231, 183, .5)
	}
	.lg-icon-v {
		background: #f5f3ff;
		border: 1rpx solid rgba(196, 181, 253, .5)
	}

	.lg-main {
		flex: 1;
		min-width: 0
	}

	.lg-hd {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 16rpx;
		margin-bottom: 4rpx
	}

	.lg-title {
		font-size: 30rpx;
		font-weight: 600;
		color: #1a1e26
	}

	.lg-sub {
		font-size: 24rpx;
		color: #8694ab
	}

	.lg-badge {
		font-size: 20rpx;
		padding: 2rpx 12rpx;
		border-radius: 6rpx;
		font-weight: 500;
		white-space: nowrap
	}

	.lg-badge-r {
		background: #fff1f2;
		color: #be123c;
		border: 1rpx solid rgba(254, 205, 211, .5)
	}

	.lg-badge-w {
		background: #fefaf5;
		color: #af5b11;
		border: 1rpx solid rgba(250, 224, 184, .5)
	}

	.lg-badge-o {
		background: #f0f9ff;
		color: #0369a1;
		border: 1rpx solid rgba(186, 230, 253, .5)
	}

	.lg-badge-g {
		background: #ecfdf5;
		color: #047857;
		border: 1rpx solid rgba(110, 231, 183, .5)
	}
	.lg-badge-v {
		background: #f5f3ff;
		color: #6d28d9;
		border: 1rpx solid rgba(196, 181, 253, .5)
	}

	.footer {
		text-align: center;
		padding-bottom: 100rpx;
	}
</style>