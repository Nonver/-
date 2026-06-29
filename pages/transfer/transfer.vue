<template>
	<!-- <view class="pg"> -->
	<view v-show="currentView === 'home'">

		<view class="topbar">
			<view class="topbar-inner">
				<view class="tbl">
					<view class="tbl-icon">
						<svg class="s16 white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
								d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
						</svg>
					</view>
					<text class="t16 fw6">中转部总监工作台</text>
				</view>
				<view class="tbr">
					<view class="bell">
						<svg class="s16 gray" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
								d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
						</svg>
					</view>
					<view class="ava-sm">
						<svg class="s12 gray" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</view>
				</view>
			</view>
		</view>

		<!-- 快捷功能 -->
		<view class="quick-actions">
			<view class="qa-item" @click="onAnchorFlowAudit">
				<view class="qa-icon qa-icon-blue">
					<svg class="s18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
							d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
					</svg>
				</view>
				<text class="qa-label">主播流转审核</text>
				<svg class="s12 mu qa-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</view>
		</view>

		<view class="main">

			<view class="sec">
				<view class="sechd">
					<text class="t14 fw6">数据概览</text>
					<text class="t12 mu">今日</text>
				</view>
				<view class="data-list">
					<view class="dr">
						<view class="dr-l">
							<view class="ic ic-r">
								<svg class="s14 red" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
								</svg>
							</view>
							<view>
								<text class="t12 mu">待审核考核</text>
								<text class="dn">{{ transferStats.pendingAssessCount }}</text>
							</view>
						</view>
						<text class="tag tag-red">紧急</text>
					</view>

					<view class="dr">
						<view class="dr-l">
							<view class="ic ic-b">
								<svg class="s14 blue" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
										d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
								</svg>
							</view>
							<view>
								<text class="t12 mu">已下发考核</text>
								<text class="dn">{{ transferStats.publishedAssessCount }}</text>
							</view>
						</view>
						<text class="tag tag-blue">进行中</text>
					</view>

					<view class="dr">
						<view class="dr-l">
							<view class="ic ic-g">
								<svg class="s14 green" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</view>
							<view>
								<text class="t12 mu">已完结考核</text>
								<text class="dn">{{ transferStats.completedAssessCount }}</text>
							</view>
						</view>
						<text class="tag tag-green">本月</text>
					</view>

					<view class="dr">
						<view class="dr-l">
							<view class="ic ic-z">
								<svg class="s14 gray" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
							</view>
							<view>
								<text class="t12 mu">部门在岗人数</text>
								<text class="dn">{{ transferStats.onDutyCount }}</text>
							</view>
						</view>
						<text class="tag tag-def">实时</text>
					</view>

					<view class="dr">
						<view class="dr-l">
							<view class="ic ic-p">
								<svg class="s14 purple" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
										d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
								</svg>
							</view>
							<view>
								<text class="t12 mu">当日新人承接数</text>
								<text class="dn">{{ transferStats.todayRecruit }}</text>
							</view>
						</view>
						<text class="tag tag-purple">今日</text>
					</view>

					<view class="dr dr-block">
						<view class="dr-l" style="width:100%;align-items:flex-start">
							<view class="ic ic-a">
								<svg class="s14 amber" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
										d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
										d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
								</svg>
							</view>
							<view style="flex:1">
								<text class="t12 mu" style="display:block;margin-bottom:24rpx">主播维护/流失统计</text>
								<view class="retain-row">
									<view>
										<text class="retain-num">{{ transferStats.maintainingCount }}</text>
										<view class="retain-sub">
											<view class="sd sdg"></view><text class="t12 mu">维护中</text>
										</view>
									</view>
									<view class="retain-line"></view>
									<view>
										<text class="retain-num">{{ transferStats.lostCount }}</text>
										<view class="retain-sub">
											<view class="sd sdr"></view><text class="t12 mu">已流失</text>
										</view>
									</view>
									<view style="margin-left:auto;text-align:right">
										<text class="retain-pct">{{ maintainRate }}%</text>
										<text class="t12 mu" style="display:block;margin-top:4rpx">维护率</text>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view class="dr">
						<view class="dr-l">
							<view class="ic ic-c">
								<svg class="s14 cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
										d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
								</svg>
							</view>
							<view>
								<text class="t12 mu">待流转主播数</text>
								<text class="dn">{{ transferStats.pendingTransfer }}</text>
							</view>
						</view>
						<text class="tag tag-amber">待处理</text>
					</view>
				</view>
			</view>

			<view class="sec">
				<view class="list-card">
					<view class="lc-hd">
						<text class="t14 fw6">本部门待提交考核</text>
						<text class="t12 mu">共 {{ pendingAssessList.length }} 条</text>
					</view>
					<view v-for="(it,idx) in pendingAssessList" :key="it.id">
						<view v-if="idx>0" class="lc-line"></view>
						<view class="lc-row" @tap="goToAssessDetail(it.id)">
							<view class="lc-ava" :style="{background:it.bg}">
								<text
									style="font-size:22rpx;font-weight:600;color:#52525b">{{ (it.name || '?').charAt(0) }}</text>
							</view>
							<view class="lc-mid">
								<text class="t14 fw5">{{ it.name }}</text>
								<text class="t12 mu" style="margin-top:2rpx">{{ it.type }}</text>
							</view>
							<view class="lc-right">
								<text class="t12" :class="it.deadCls">{{ it.dead }}</text>
								<text class="t12 mu" style="margin-top:2rpx">{{ it.date }}</text>
							</view>
						</view>
					</view>
					<view v-if="pendingAssessList.length === 0" class="lc-row">
						<text class="t12 mu" style="width:100%;text-align:center;padding:20rpx 0">暂无考核记录</text>
						<view class="lc-ft" @tap="goToAssessmentPage">
							<text class="t12 mu">查看全部</text>
							<svg class="s12 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M9 5l7 7-7 7" />
							</svg>
						</view>
					</view>
				</view>

				<view class="sec"  style="padding-bottom: 100rpx;">
					<view class="list-card">
						<view class="lc-hd">
							<text class="t14 fw6">主播流转动态</text>
							<text class="t12 mu">共 {{ transferRecentList.length }} 条</text>
						</view>
						<view v-for="(it,idx) in transferRecentList" :key="it.id">
							<view v-if="idx>0" class="lc-line"></view>
							<view class="lc-row">
								<view class="lc-ava" :style="{background:it.bg}">
									<text
										style="font-size:22rpx;font-weight:600;color:#52525b">{{ (it.name || '?').charAt(0) }}</text>
								</view>
								<view class="lc-mid">
									<text class="t14 fw5">{{ it.name || '-' }}</text>
									<view class="flow-row">
										<text class="flow-tag" :class="it.ftCls">{{ it.ftLabel }}</text>
										<text class="t12 mu">{{ it.ftInfo }}</text>
									</view>
								</view>
								<view class="lc-right">
									<text class="t12" :class="it.statusCls">{{ it.status }}</text>
									<text class="t12 mu" style="margin-top:2rpx">{{ it.time }}</text>
								</view>
							</view>
						</view>
						<view v-if="transferRecentList.length === 0" class="lc-row">
							<text class="t12 mu" style="width:100%;text-align:center;padding:20rpx 0">暂无流转记录</text>
						</view>
						<view class="lc-ft" @tap="onAnchorFlowAudit">
							<text class="t12 mu">查看全部</text>
							<svg class="s12 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M9 5l7 7-7 7" />
							</svg>
						</view>
					</view>
				</view>

			</view>

			<!-- <view class="btmbar">
				<view class="btmbar-inner">
					<view class="bb bb-pri" @tap="onPublish">
						<svg class="s14 white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<text class="t14 fw6 white">考核发布</text>
					</view>
					<view class="bb bb-sec" @tap="onAudit">
						<svg class="s14 gray" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
						</svg>
						<text class="t14 fw6">流转审核台账</text>
					</view>
				</view>
				<view class="safe-btm"></view>
			</view> -->

		</view>

		<!-- 流转数据看板 -->

		<view v-show="currentView === 'data'" class="data-main">
			<view class="topbar">
				<view class="topbar-inner">
					<view class="tbl">
						<view class="tbl-icon" style="background:linear-gradient(135deg,#7C3AED,#4F46E5)">
							<svg class="s16 white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
									d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
							</svg>
						</view>
						<text class="t16 fw6">流转数据看板</text>
					</view>
					<text class="t12 mu">中转部 · 主播流转统计</text>
				</view>
			</view>
			<view style="padding: 35rpx;">
				<!-- 统计卡片 -->
				<view class="sec">
					<view class="stat-grid-4">
						<view class="sg-item">
							<text class="sg-num" style="color:#2563EB">{{ flowBoard.monthIn }}</text>
							<text class="t12 mu">本月转入</text>
							<text class="sg-trend"
								:class="flowBoard.trendIn >= 0 ? 'up' : 'down'">{{ flowBoard.trendIn >= 0 ? '↑' : '↓' }}
								{{ Math.abs(flowBoard.trendIn) }}%</text>
						</view>
						<view class="sg-item">
							<text class="sg-num" style="color:#10B981">{{ flowBoard.monthOut }}</text>
							<text class="t12 mu">本月转出</text>
							<text class="sg-trend"
								:class="flowBoard.trendOut >= 0 ? 'up' : 'down'">{{ flowBoard.trendOut >= 0 ? '↑' : '↓' }}
								{{ Math.abs(flowBoard.trendOut) }}%</text>
						</view>
						<view class="sg-item">
							<text class="sg-num" style="color:#F59E0B">{{ flowBoard.monthPromote }}</text>
							<text class="t12 mu">晋升流转</text>
							<text class="sg-trend"
								:class="flowBoard.trendPromote >= 0 ? 'up' : 'down'">{{ flowBoard.trendPromote >= 0 ? '↑' : '↓' }}
								{{ Math.abs(flowBoard.trendPromote) }}%</text>
						</view>
						<view class="sg-item">
							<text class="sg-num" style="color:#EF4444">{{ flowBoard.monthPending }}</text>
							<text class="t12 mu">待处理</text>
							<text class="sg-trend warn">紧急</text>
						</view>
					</view>
				</view>

				<!-- 流转类型分布 -->
				<view class="sec">
					<view class="sechd">
						<text class="t14 fw6">流转类型分布</text>
						<text class="t12 mu">本月</text>
					</view>
					<view class="dist-bar" v-if="flowDistTotal > 0">
						<view class="dist-seg"
							:style="{width: flowDistInPct+'%', background:'#2563EB', borderRadius:'6rpx 0 0 6rpx'}">
						</view>
						<view v-if="flowDistOutPct>0" class="dist-seg"
							:style="{width: flowDistOutPct+'%', background:'#10B981'}"></view>
						<view v-if="flowDistPromotePct>0" class="dist-seg"
							:style="{width: flowDistPromotePct+'%', background:'#F59E0B', borderRadius: flowDistOutPct===0 ? '6rpx 6rpx 6rpx 6rpx' : '0 6rpx 6rpx 0'}">
						</view>
					</view>
					<view class="dist-bar" v-else>
						<view class="dist-seg" style="width:100%;background:#e5e7eb;border-radius:6rpx"></view>
					</view>
					<view class="dist-legend">
						<view class="dl-item">
							<view class="dl-dot" style="background:#2563EB"></view><text class="t12 mu">转入
								{{ flowDist.in }}人 · {{ flowDistInPct }}%</text>
						</view>
						<view class="dl-item">
							<view class="dl-dot" style="background:#10B981"></view><text class="t12 mu">转出
								{{ flowDist.out }}人 · {{ flowDistOutPct }}%</text>
						</view>
						<view class="dl-item">
							<view class="dl-dot" style="background:#F59E0B"></view><text class="t12 mu">晋升
								{{ flowDist.promote }}人 · {{ flowDistPromotePct }}%</text>
						</view>
					</view>
				</view>

				<!-- 筛选 -->
				<view class="sec">
					<view class="filter-row">
						<view class="f-item" :class="flowFilter==='all'?'f-on':''" @tap="onFlowFilter('all')">全部</view>
						<view class="f-item" :class="flowFilter==='in'?'f-on':''" @tap="onFlowFilter('in')">转入</view>
						<view class="f-item" :class="flowFilter==='out'?'f-on':''" @tap="onFlowFilter('out')">转出</view>
						<view class="f-item" :class="flowFilter==='promote'?'f-on':''" @tap="onFlowFilter('promote')">晋升
						</view>
					</view>
				</view>

				<!-- 流转列表 -->
				<view class="sec">
					<view class="list-card">
						<view class="lc-hd">
							<text class="t14 fw6">{{ flowFilterLabel }}</text>
							<text class="t12 mu">共 {{ filteredFlowData.length }} 条</text>
						</view>
						<view v-for="(it, idx) in filteredFlowData" :key="it.id">
							<view v-if="idx>0" class="lc-line"></view>
							<view class="lc-row">
								<view class="lc-ava" :style="{background:it.bg}">{{ it.name.charAt(0) }}</view>
								<view class="lc-mid">
									<text class="t14 fw5">{{ it.name }}</text>
									<view class="flow-row">
										<text class="flow-tag" :class="it.ftCls">{{ it.ftLabel }}</text>
										<text class="t12 mu">{{ it.ftInfo }}</text>
									</view>
								</view>
								<view class="lc-right">
									<text class="t12" :class="it.statusCls">{{ it.status }}</text>
									<text class="t12 mu" style="margin-top:2rpx">{{ it.time }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

		</view>

		<bottom-nav :items="navItems" :current="currentView" @change="onNavChange" />
	</view>
</template>

<script>
	import {
		api
	} from '@/utils/api.js'
	import BottomNav from '@/components/bottom-nav.vue'

	export default {
		components: {
			BottomNav
		},
		data() {
			return {
				currentView: 'home',
				transferStats: {
					todayRecruit: 0,
					pendingTransfer: 0,
					lostCount: 0,
					maintainingCount: 0,
					transferredCount: 0,
					totalRecruit: 0,
					onDutyCount: 0,
					pendingAssessCount: 0,
					publishedAssessCount: 0,
					completedAssessCount: 0
				},
				transferRecentList: [],
				pendingAssessList: [],
				flowBoard: {
					monthIn: 0,
					monthOut: 0,
					monthPromote: 0,
					monthPending: 0,
					trendIn: 0,
					trendOut: 0,
					trendPromote: 0
				},
				flowDist: {
					in: 0,
					out: 0,
					promote: 0,
					total: 0
				},
				rawFlowData: [], // 后台原始流转列表
			navItems: [{
					key: 'home',
					label: '首页',
					page: ''
				},
				{
					key: 'personnel',
					label: '人员管理',
					page: '/pages/personnel-manage/personnel-manage'
				},
				{
					key: 'data',
					label: '考核总览',
					page: '/pages/anchor-kpi/anchor-kpi'
				},
				{
					key: 'profile',
					label: '个人中心',
					page: '/pages/my/my'
				},
			],
				flowFilter: 'all',
			}
		},
		computed: {
			maintainRate() {
				const total = this.transferStats.maintainingCount + this.transferStats.lostCount
				if (total === 0) return 0
				return (this.transferStats.maintainingCount / total * 100).toFixed(1)
			},
			// 流转类型分布百分比
			flowDistInPct() {
				if (this.flowDist.total === 0) return 0
				return Math.round(this.flowDist.in / this.flowDist.total * 100)
			},
			flowDistOutPct() {
				if (this.flowDist.total === 0) return 0
				return Math.round(this.flowDist.out / this.flowDist.total * 100)
			},
			flowDistPromotePct() {
				if (this.flowDist.total === 0) return 0
				return Math.round(this.flowDist.promote / this.flowDist.total * 100)
			},
			flowDistTotal() {
				return this.flowDist.total
			},
			// 流转列表（带前端筛选）
			flowData() {
				return this.rawFlowData.map(it => ({
					...it,
					bg: it.lose_status == 1 ? '#fef2f2' : it.transfer_status == 1 ? '#f0fdf4' : (it
						.flow_type === 'promote' ? '#faf5ff' : '#eff6ff'),
					ftLabel: it.lose_status == 1 ? '流失' : it.transfer_status == 1 ? '已流转' : (it.flow_type ===
						'in' ? '转入' : it.flow_type === 'out' ? '转出' : it.flow_type === 'promote' ? '晋升' :
						'维护中'),
					ftCls: it.lose_status == 1 ? 'ft-red' : it.transfer_status == 1 ? 'ft-green' : (it
						.flow_type === 'promote' ? 'ft-purple' : it.flow_type === 'out' ? 'ft-green' :
						'ft-blue'),
					ftInfo: it.agent_name || (it.flow_type === 'in' ? '转入中转部' : it.flow_type === 'out' ?
						'转出中转部' : it.flow_type === 'promote' ? '主播晋升' : '-'),
					status: it.lose_status == 1 ? '已流失' : it.transfer_status == 1 ? '已完成' : '进行中',
					statusCls: it.lose_status == 1 ? 'red' : it.transfer_status == 1 ? 'green' : 'amber',
					time: (it.create_time || '').substring(5, 10),
					name: it.anchor_name || '-'
				}))
			},
			filteredFlowData() {
				if (this.flowFilter === 'all') return this.flowData
				const map = {
					in: '转入',
					out: '转出',
					promote: '晋升'
				}
				const label = map[this.flowFilter]
				if (!label) return this.flowData
				return this.flowData.filter(f => f.ftLabel === label)
			},
			flowFilterLabel() {
				const map = {
					all: '全部流转',
					in: '转入',
					out: '转出',
					promote: '晋升'
				}
				return (map[this.flowFilter] || '全部') + '记录'
			},
		},
		onShow() {
			// 从其他页面返回时，始终重置为首页视图
			this.currentView = 'home'
			this.$checkAuth()
			this.fetchTransferData()
		},
		methods: {
			async fetchTransferData() {
				try {
					const res = await api.get('/api/admin/transfer/transfer', null, {
						silent: true
					})
					if (res.data) {
						// 统计指标
						this.transferStats = res.data.stats || this.transferStats
						// 考核待提交列表
						this.pendingAssessList = res.data.pendingAssessList || []
						// 流转数据看板
						this.flowBoard = res.data.flowBoard || this.flowBoard
						// 首页流转动态
						this.transferRecentList = (res.data.recentList || []).map(it => ({
							...it,
							bg: it.lose_status == 1 ? '#fef2f2' : it.transfer_status == 1 ? '#f0fdf4' :
								'#eff6ff',
							ftLabel: it.lose_status == 1 ? '流失' : it.transfer_status == 1 ? '已流转' : '维护中',
							ftCls: it.lose_status == 1 ? 'ft-red' : it.transfer_status == 1 ? 'ft-green' :
								'ft-blue',
							ftInfo: it.agent_name || '-',
							status: it.lose_status == 1 ? '已流失' : it.transfer_status == 1 ? '已完成' : '进行中',
							statusCls: it.lose_status == 1 ? 'red' : it.transfer_status == 1 ? 'green' :
								'amber',
							time: (it.create_time || '').substring(5, 10),
							name: it.anchor_name || '-'
						}))
						// 同时拉流转列表备用
						await this.fetchFlowData()
					}
				} catch (e) {
					console.error('[Transfer]', e)
				}
			},
			async fetchFlowData(statusFilter) {
				try {
					const params = statusFilter ? {
						status: statusFilter
					} : {}
					const res = await api.get('/api/admin/transfer/flow-stats', params, {
						silent: true
					})
					if (res.data) {
						this.rawFlowData = res.data.flowList || []
						// 更新分布数据
						if (res.data.flowDist) {
							this.flowDist = res.data.flowDist
						}
					}
				} catch (e) {
					console.error('[FlowData]', e)
				}
			},
			onNavChange(key) {
				// 仅本页视图（home/data）切换；其他页签通过 page 属性跳转，不改变 currentView
				if (key !== 'home' && key !== 'data') return
				this.currentView = key
				// 切换到数据看板时刷新流转列表
				if (key === 'data') {
					this.fetchFlowData(this.flowFilter === 'all' ? '' : this.flowFilter)
				}
			},
			onFlowFilter(value) {
				this.flowFilter = value
				// 触发后台按类型筛选
				const statusParam = value === 'all' ? '' : value
				this.fetchFlowData(statusParam)
			},
			onPublish() {
				uni.navigateTo({
					url: '/pages/transfer-assessment/transfer-assessment'
				})
			},
			onAudit() {
				uni.showToast({
					title: '仅财务部可查看',
					icon: 'none'
				})
			},
			onAnchorFlowAudit() {
				uni.navigateTo({
					url: '/pages/transfer-flow/transfer-flow'
				})
			},
			goToAssessDetail(id) {
				if (!id) return
				uni.navigateTo({
					url: '/pages/assessment-detail/assessment-detail?publish_id=' + id
				})
			},
			goToAssessmentPage() {
				uni.navigateTo({
					url: '/pages/assessment/assessment'
				})
			},
		}
	}
</script>

<style>
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #f5f5f5;
		padding-bottom: 180rpx;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased
	}

	.main {
		padding: 0 32rpx
	}

	/* 文字 */
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
		color: #a1a1aa
	}

	.white {
		color: #fff
	}

	.red {
		color: #ef4444
	}

	.amber {
		color: #d97706
	}

	.gray {
		color: #52525b
	}

	.blue {
		color: #3b82f6
	}

	.green {
		color: #16a34a
	}

	.purple {
		color: #8b5cf6
	}

	.cyan {
		color: #06b6d4
	}

	/* 图标 */
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

	/* 顶栏 */
	.topbar {
		position: sticky;
		top: 0;
		z-index: 50;
		background: #fff;
		border-bottom: 1rpx solid #f4f4f5
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
		gap: 16rpx
	}

	.tbl-icon {
		width: 64rpx;
		height: 64rpx;
		border-radius: 16rpx;
		background: #18181b;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.tbr {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx
	}

	.bell {
		width: 64rpx;
		height: 64rpx;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.ava-sm {
		width: 56rpx;
		height: 56rpx;
		border-radius: 50%;
		background: #f4f4f5;
		display: flex;
		align-items: center;
		justify-content: center
	}

	/* 快捷功能 */
	.quick-actions {
		padding: 32rpx 32rpx 0rpx 32rpx
	}

	.qa-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 16rpx;
		padding: 24rpx 28rpx;
		background: #fff;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, .04)
	}

	.qa-icon {
		width: 72rpx;
		height: 72rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0
	}

	.qa-icon-blue {
		background: #eff6ff;
		color: #3b82f6
	}

	.qa-label {
		font-size: 28rpx;
		font-weight: 500;
		color: #18181b;
		flex: 1
	}

	.qa-arrow {
		flex-shrink: 0
	}

	.s18 {
		width: 36rpx;
		height: 36rpx;
		flex-shrink: 0
	}

	/* section */
	.sec {
		margin-bottom: 32rpx
	}

	.sechd {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 4rpx;
		margin-bottom: 24rpx;
		margin-top: 24rpx;
	}

	/* 数据行 */
	.data-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx
	}

	.dr {
		background: #fff;
		border: 1rpx solid #f4f4f5;
		border-radius: 24rpx;
		padding: 32rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between
	}

	.dr-block {
		flex-direction: column
	}

	.dr-l {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx
	}

	.dn {
		font-size: 40rpx;
		font-weight: 700;
		color: #18181b;
		line-height: 1;
		display: block;
		margin-top: 4rpx;
		letter-spacing: -.02em
	}

	.ic {
		width: 80rpx;
		height: 80rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0
	}

	.ic-r {
		background: #fef2f2
	}

	.ic-b {
		background: #eff6ff
	}

	.ic-g {
		background: #f0fdf4
	}

	.ic-z {
		background: #f4f4f5
	}

	.ic-p {
		background: #faf5ff
	}

	.ic-a {
		background: #fffbeb
	}

	.ic-c {
		background: #ecfeff
	}

	/* 留存流失 */
	.retain-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 48rpx
	}

	.retain-num {
		font-size: 56rpx;
		font-weight: 700;
		color: #18181b;
		line-height: 1;
		letter-spacing: -.02em
	}

	.retain-sub {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8rpx;
		margin-top: 4rpx
	}

	.retain-pct {
		font-size: 28rpx;
		font-weight: 600;
		color: #16a34a
	}

	.retain-line {
		width: 2rpx;
		height: 80rpx;
		background: #f4f4f5
	}

	.sd {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%
	}

	.sdg {
		background: #22c55e
	}

	.sdr {
		background: #ef4444
	}

	/* 列表 */
	.list-card {
		background: #fff;
		border: 1rpx solid #f4f4f5;
		border-radius: 24rpx;
		overflow: hidden;
		margin-bottom: 30rpx;
	}

	.liuz {
		padding-bottom: 50rpx;
	}

	.lc-hd {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 32rpx;
		border-bottom: 1rpx solid #f4f4f5
	}

	.lc-line {
		height: 1rpx;
		background: #fafafa;
		margin: 0 32rpx
	}

	.lc-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 28rpx 32rpx;
		gap: 24rpx
	}

	.lc-row:active {
		background: rgba(0, 0, 0, .02)
	}

	.lc-ava {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.lc-mid {
		flex: 1;
		min-width: 0
	}

	.lc-right {
		text-align: right
	}

	.lc-ft {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 8rpx;
		padding: 20rpx 32rpx;
		border-top: 1rpx solid #f4f4f5
	}

	/* 流转 */
	.flow-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8rpx;
		margin-top: 2rpx
	}

	.flow-tag {
		display: inline-flex;
		align-items: center;
		padding: 2rpx 12rpx;
		border-radius: 6rpx;
		font-size: 18rpx;
		white-space: nowrap
	}

	.ft-blue {
		background: #eff6ff;
		color: #2563eb
	}

	.ft-green {
		background: #f0fdf4;
		color: #16a34a
	}

	.ft-purple {
		background: #faf5ff;
		color: #8b5cf6
	}

	/* 标签 */
	.tag {
		display: inline-flex;
		align-items: center;
		padding: 4rpx 20rpx;
		border-radius: 9999rpx;
		font-size: 20rpx;
		font-weight: 500;
		white-space: nowrap;
		flex-shrink: 0
	}

	.tag-red {
		background: #fef2f2;
		color: #dc2626
	}

	.tag-blue {
		background: #eff6ff;
		color: #2563eb
	}

	.tag-green {
		background: #f0fdf4;
		color: #16a34a
	}

	.tag-amber {
		background: #fffbeb;
		color: #d97706
	}

	.tag-purple {
		background: #faf5ff;
		color: #8b5cf6
	}

	.tag-def {
		background: #f4f4f5;
		color: #71717a
	}

	/* 底部 */
	.btmbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		background: #fff;
		border-top: 1rpx solid #e4e4e7
	}

	.btmbar-inner {
		display: flex;
		flex-direction: row;
		padding: 24rpx 32rpx;
		gap: 24rpx
	}

	.safe-btm {
		height: env(safe-area-inset-bottom, 0px)
	}

	.bb {
		flex: 1;
		height: 84rpx;
		border-radius: 24rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 16rpx;
		font-weight: 600
	}

	.bb:active {
		transform: scale(.98)
	}

	.bb-pri {
		background: #1a1a2e;
		color: #fff
	}

	.bb-sec {
		background: #f0f0f5;
		color: #1a1a2e;
		border: 1rpx solid #e0e0e5
	}

	/* 流转数据看板 */
	.stat-grid-4 {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx
	}

	.sg-item {
		flex: 1;
		min-width: 150rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 24rpx 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6rpx;
		box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, .04)
	}

	.sg-num {
		font-size: 48rpx;
		font-weight: 700;
		line-height: 1.1
	}

	.sg-trend {
		font-size: 20rpx;
		font-weight: 600
	}

	.sg-trend.up {
		color: #10B981
	}

	.sg-trend.down {
		color: #EF4444
	}

	.sg-trend.warn {
		color: #F59E0B
	}

	.dist-bar {
		display: flex;
		height: 24rpx;
		border-radius: 6rpx;
		overflow: hidden;
		margin-top: 20rpx
	}

	.dist-legend {
		display: flex;
		justify-content: center;
		gap: 32rpx;
		margin-top: 16rpx
	}

	.dl-item {
		display: flex;
		align-items: center;
		gap: 8rpx
	}

	.dl-dot {
		width: 14rpx;
		height: 14rpx;
		border-radius: 50%
	}

	.filter-row {
		display: flex;
		gap: 16rpx
	}

	.f-item {
		padding: 12rpx 28rpx;
		border-radius: 24rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #64748B;
		background: #fff;
		transition: all .15s
	}

	.f-item:active {
		transform: scale(.96)
	}

	.f-on {
		background: #1a1a2e;
		color: #fff
	}

	.flow-tag {
		font-size: 20rpx;
		font-weight: 600;
		padding: 2rpx 12rpx;
		border-radius: 8rpx
	}

	.ft-blue {
		background: #EFF6FF;
		color: #2563EB
	}

	.ft-green {
		background: #ECFDF5;
		color: #10B981
	}

	.ft-purple {
		background: #F5F3FF;
		color: #7C3AED
	}

	.ft-red {
		background: #FEF2F2;
		color: #DC2626
	}

	.flow-row {
		display: flex;
		align-items: center;
		gap: 8rpx;
		margin-top: 4rpx
	}

	.green {
		color: #10B981
	}

	.amber {
		color: #F59E0B
	}

	.red {
		color: #EF4444
	}
</style>