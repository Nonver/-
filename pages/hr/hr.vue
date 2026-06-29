<template>
	<view class="pg">
		<view>
		<!-- 顶栏 -->
		<view class="topbar">
			<view class="topbar-inner">
				<view class="tbl">
					<view class="tbl-icon">
						<svg class="s16 white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<circle cx="12" cy="12" r="3" />
							<path
								d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
						</svg>
					</view>
					<view>
						<text class="t16 fw6">人事部工作台</text>
						<text class="t12 mu sum">员工视图</text>
					</view>
				</view>
				<view class="bell-btn">
					<svg class="s14 gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
						<path d="M13.73 21a2 2 0 0 1-3.46 0" />
					</svg>
					<view class="bell-dot"></view>
				</view>
			</view>
		</view>

		<view class="main">

			<!-- 账号审核概览 -->
			<view class="sec">
				<view class="sechd">
					<text class="t14 fw6">账号审核概览</text>
					<text class="t12 mu">今日数据</text>
				</view>
				<view class="stats4">
					<view class="st-item">
						<view class="st-item-inner">
							<view class="st-hd">
								<view class="st-icon st-icon-a"><svg class="s12 amber" viewBox="0 0 24 24" fill="none"
										stroke="currentColor" stroke-width="2">
										<circle cx="12" cy="12" r="10" />
										<polyline points="12 6 12 12 16 14" />
									</svg></view><text class="st-label">待审核</text>
							</view>
							<text class="st-num">{{ overview.pendingCount }}</text>
							<text class="st-sub">较昨日 <text :class="overview.pendingChange>0?'red':'green'">{{ overview.pendingChange>0?'+':'' }}{{ overview.pendingChange }}</text></text>
						</view>
					</view>
					<view class="st-item">
						<view class="st-item-inner">
							<view class="st-hd">
								<view class="st-icon st-icon-g"><svg class="s12 green" viewBox="0 0 24 24" fill="none"
										stroke="currentColor" stroke-width="2.5">
										<polyline points="20 6 9 17 4 12" />
									</svg></view><text class="st-label">已激活</text>
							</view>
							<text class="st-num">{{ fmtNum(overview.activeCount) }}</text>
							<text class="st-sub">较昨日 <text :class="overview.activeChange>0?'green':'red'">{{ overview.activeChange>0?'+':'' }}{{ overview.activeChange }}</text></text>
						</view>
					</view>
					<view class="st-item">
						<view class="st-item-inner">
							<view class="st-hd">
								<view class="st-icon st-icon-r"><svg class="s12 red" viewBox="0 0 24 24" fill="none"
										stroke="currentColor" stroke-width="2">
										<path
											d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
										<line x1="12" y1="9" x2="12" y2="13" />
										<line x1="12" y1="17" x2="12.01" y2="17" />
									</svg></view><text class="st-label">待劝退</text>
							</view>
							<text class="st-num">{{ overview.pendingDismissCount }}</text>
							<text class="st-sub">本周新增 <text :class="overview.dismissChange>0?'red':'green'">{{ overview.dismissChange>0?'+':'' }}{{ overview.dismissChange }}</text></text>
						</view>
					</view>
					<view class="st-item">
						<view class="st-item-inner">
							<view class="st-hd">
								<view class="st-icon st-icon-z"><svg class="s12 gray" viewBox="0 0 24 24" fill="none"
										stroke="currentColor" stroke-width="2">
										<path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
										<circle cx="9" cy="7" r="4" />
										<line x1="17" y1="9" x2="23" y2="15" />
										<line x1="23" y1="9" x2="17" y2="15" />
									</svg></view><text class="st-label">已劝退</text>
							</view>
							<text class="st-num">{{ fmtNum(overview.dismissedCount) }}</text>
							<text class="st-sub">本月累计</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 全员账号审核 -->
			<view class="sec">
				<view class="sechd">
					<text class="t14 fw6">全员账号审核</text>
					<text class="t12 blue fw5" @tap="navTo('/pages/hr-accounts/hr-accounts')">查看全部</text>
				</view>
				<view v-if="accountList.length > 0" class="list-card">
					<view v-for="(it,idx) in accountList" :key="it.id">
						<view v-if="idx>0" class="dv"></view>
						<view class="lr" :class="{'lr-hl':it.hl}">
							<view class="ava" :style="{background:it.avaBg}"></view>
							<view class="lr-main">
								<view class="lr-hd">
									<text class="lr-title">{{ it.name }}</text>
									<text class="dept-tag" :class="it.deptCls">{{ it.dept }}</text>
								</view>
								<text class="lr-sub">工号：{{ it.code }}</text>
							</view>
							<view class="lr-r">
								<view class="edit-btn" @tap="openEditModal(it)">
									<svg class="s12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
										<path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
									</svg>
									<text>编辑</text>
								</view>
								<text v-if="it.time" class="lr-time">{{ it.time }}</text>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="empty-state">
					<view class="empty-icon-wrap">
						<svg class="s32 slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
							<circle cx="9" cy="7" r="4"/>
							<path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
						</svg>
					</view>
					<text class="empty-text">暂无待审核账户</text>
				</view>
			</view>

			<!-- 部门不达标人员 -->
			<view class="sec">
				<view class="sechd">
					<view class="sechd-l">
						<text class="t14 fw6">部门不达标人员</text>
						<text class="t12 mu">KPI 连续两月未达标</text>
					</view>
				</view>

				<view v-if="deptList.length > 0">
					<view v-for="(dp, dpi) in deptList" :key="dp.id">
						<view class="dept-card" :style="{marginBottom: dpi < deptList.length-1 ? '24rpx' : '0'}">
							<view class="dept-hd" @tap="dp.open=!dp.open">
								<view class="dept-hd-l">
									<view class="dept-icon" :class="dp.iconCls">
										<svg class="s14" :class="dp.iconColor" viewBox="0 0 24 24" fill="none"
											stroke="currentColor" stroke-width="1.5">
											<path :d="dp.iconD" />
										</svg>
									</view>
									<view>
										<text class="dept-name">{{ dp.name }}</text>
										<text class="dept-count">{{ dp.count }} 人未达标</text>
									</view>
								</view>
								<svg class="s16 mu" :class="{'chevron-open':dp.open}" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="2">
									<polyline points="6 9 12 15 18 9" />
								</svg>
							</view>
							<view v-if="dp.open" class="dept-body">
								<view class="dept-items">
									<view v-for="p in dp.people" :key="p.name" class="dpi">
										<view class="ava-sm" :style="{background:p.avaBg}"></view>
										<view class="dpi-main">
											<text class="dpi-name">{{ p.name }}</text>
											<text class="dpi-desc">{{ p.desc }}</text>
										</view>
										<text class="dpi-tag" :class="p.tagCls">{{ p.tag }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="empty-state">
					<view class="empty-icon-wrap">
						<svg class="s32 slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<line x1="18" y1="20" x2="18" y2="10"/>
							<line x1="12" y1="20" x2="12" y2="4"/>
							<line x1="6" y1="20" x2="6" y2="14"/>
						</svg>
					</view>
					<text class="empty-text">暂无部门不达标数据</text>
				</view>
			</view>

			<!-- 快捷操作 -->
			<view class="sec">
				<text class="t14 fw6" style="display:block;margin-bottom:24rpx">快捷操作</text>
				<view class="quick4">
					<view class="qa" @tap="onAddAccount">
						<view class="qa-inner">
							<view class="qa-icon qa-icon-b"><svg class="s16 blue" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="1.5">
									<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
									<circle cx="9" cy="7" r="4" />
									<line x1="19" y1="8" x2="19" y2="14" />
									<line x1="22" y1="11" x2="16" y2="11" />
								</svg></view>
							<text class="qa-label">新增账号</text>
							<text class="qa-sub">录入新员工</text>
						</view>
					</view>
					<!-- <view class="qa" @tap="onAction">
						<view class="qa-inner">
							<view class="qa-icon qa-icon-g"><svg class="s16 green" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="1.5">
									<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
									<polyline points="14 2 14 8 20 8" />
									<line x1="12" y1="18" x2="12" y2="12" />
									<line x1="9" y1="15" x2="15" y2="15" />
								</svg></view>
							<text class="qa-label">导出报表</text>
							<text class="qa-sub">下载Excel</text>
						</view>
					</view> -->
					<view class="qa" @tap="onDismiss">
						<view class="qa-inner">
							<view class="qa-icon qa-icon-a"><svg class="s16 amber" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="1.5">
									<path
										d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
									<polyline points="22,6 12,13 2,6" />
								</svg></view>
							<text class="qa-label">人员管理</text>
							<text class="qa-sub">劝退/审核</text>
						</view>
					</view>
					<view class="qa" @tap="onAssessPublish">
						<view class="qa-inner">
							<view class="qa-icon qa-icon-g"><svg class="s16 green" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="1.5">
									<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
								</svg></view>
							<text class="qa-label">考核发布</text>
							<text class="qa-sub">发布考核任务</text>
						</view>
					</view>
					<view class="qa" @tap="onOverview">
						<view class="qa-inner">
							<view class="qa-icon qa-icon-p"><svg class="s16 purple" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="1.5">
									<line x1="18" y1="20" x2="18" y2="10"/>
									<line x1="12" y1="20" x2="12" y2="4"/>
									<line x1="6" y1="20" x2="6" y2="14"/>
								</svg></view>
							<text class="qa-label">考核总览</text>
							<text class="qa-sub">部门数据看板</text>
						</view>
					</view>
					<view class="qa" @tap="onAssessManage">
						<view class="qa-inner">
							<view class="qa-icon qa-icon-p"><svg class="s16 purple" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="1.5">
									<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
									<polyline points="14 2 14 8 20 8"/>
									<line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
								</svg></view>
							<text class="qa-label">考核管理</text>
							<text class="qa-sub">编辑/删除已审核考核</text>
						</view>
					</view>
					<!-- <view class="qa" @tap="onAction">
						<view class="qa-inner">
							<view class="qa-icon qa-icon-p"><svg class="s16 purple" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="1.5">
									<circle cx="12" cy="12" r="3" />
									<path
										d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
								</svg></view>
							<text class="qa-label">设置</text>
							<text class="qa-sub">系统配置</text>
						</view>
					</view> -->
				</view>
			</view>

		</view>

		<!-- 底部导航 -->
		<view class="btmnav">
			<view class="btmnav-inner">
			<view class="btmnav-item on">
				<svg class="s20 white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
				</svg>
				<text class="t10 fw6">首页</text>
			</view>
			<view class="btmnav-item" @tap="navTo('/pages/hr-review/hr-review')">
				<svg class="s20 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
				</svg>
				<text class="t10 mu">审核</text>
			</view>
			<view class="btmnav-item" @tap="navTo('/pages/hr-assess-status/hr-assess-status')">
				<svg class="s20 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
				</svg>
				<text class="t10 mu">考核状态</text>
			</view>
			<view class="btmnav-item" @tap="navTo('/pages/hr-kpi/hr-kpi')">
				<svg class="s20 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
				</svg>
				<text class="t10 mu">统计</text>
			</view>
			<view class="btmnav-item" @tap="goMyPage">
				<svg class="s20 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
				</svg>
				<text class="t10 mu">我的</text>
			</view>
			</view>
			<view class="safe-btm"></view>
		</view>

	</view>

	<!-- 审核状态编辑弹窗 -->
	<view v-if="modalVisible" class="modal-mask" @tap="closeEditModal">
		<view class="modal-card" @tap.stop>
			<view class="modal-hd">
				<text class="modal-title">修改审核状态</text>
				<view class="modal-close" @tap="closeEditModal">
					<svg class="s16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
					</svg>
				</view>
			</view>
			<view class="modal-info">
				<text class="modal-name">{{ editingAccount.name }}</text>
				<text class="modal-dept">{{ editingAccount.dept }} · 工号{{ editingAccount.code }}</text>
			</view>
			<view class="modal-options">
				<view class="mo-item" @tap="submitStatus(1)">
					<view class="mo-check" :class="{'mo-check-on': selectedStatus === 1}">
						<svg v-if="selectedStatus === 1" class="s14 white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
					</view>
					<view>
						<text class="mo-label">待审核</text>
						<text class="mo-desc">保持当前待审核状态</text>
					</view>
				</view>
				<view class="mo-item" @tap="submitStatus(2)">
					<view class="mo-check" :class="{'mo-check-on': selectedStatus === 2}">
						<svg v-if="selectedStatus === 2" class="s14 white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
					</view>
					<view>
						<text class="mo-label">通过</text>
						<text class="mo-desc">激活账号，恢复正常使用</text>
					</view>
				</view>
				<view class="mo-item" @tap="submitStatus(5)">
					<view class="mo-check" :class="{'mo-check-on': selectedStatus === 5}">
						<svg v-if="selectedStatus === 5" class="s14 white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
					</view>
					<view>
						<text class="mo-label">拒绝</text>
						<text class="mo-desc">驳回该账号申请</text>
					</view>
				</view>
			</view>
			<view class="modal-actions">
				<view class="ma-cancel" @tap="closeEditModal">取消</view>
				<view class="ma-confirm" :class="{'ma-disabled': submitting}" @tap="confirmEdit">{{ submitting ? '提交中...' : '确认修改' }}</view>
			</view>
		</view>
	</view>
</view>
</template>

<script>
	import { api } from '@/utils/api.js'

	// ── 部门配色映射 ──
	const DEPT_COLORS = {
		'销售部':   { deptCls:'dt-blue',   avaBg:'#dbeafe', iconCls:'di-blue',   iconColor:'blue' },
		'技术部':   { deptCls:'dt-indigo', avaBg:'#e0e7ff', iconCls:'di-indigo', iconColor:'indigo' },
		'市场部':   { deptCls:'dt-pink',   avaBg:'#fce7f3', iconCls:'di-pink',   iconColor:'pink' },
		'运营部':   { deptCls:'dt-green',  avaBg:'#f1f5f9', iconCls:'di-green',  iconColor:'green' },
		'主播部':   { deptCls:'dt-blue',   avaBg:'#fff7ed', iconCls:'di-blue',   iconColor:'blue' },
		'经纪部':   { deptCls:'dt-indigo', avaBg:'#f5f3ff', iconCls:'di-indigo', iconColor:'indigo' },
		'中转部':   { deptCls:'dt-green',  avaBg:'#ecfdf5', iconCls:'di-green',  iconColor:'green' },
		'人事部':   { deptCls:'dt-pink',   avaBg:'#fdf2f8', iconCls:'di-pink',   iconColor:'pink' },
	}

	// 人员头像配色轮转
	const PERSON_AVATARS = ['#dbeafe','#fce7f3','#f1f5f9','#e0e7ff','#f0fdf4','#fef2f2','#eff6ff','#fffbeb','#f5f3ff','#ecfdf5']

	// 部门icon路径轮转
	const DEPT_ICONS = [
		'M23 6l-9.5 9.5-5-5L1 18',
		'M16 18l6-6-6-6M8 6l-6 6 6 6',
		'M18.36 6.64a9 9 0 11-12.73 0M12 2v10',
		'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
		'M4 8V4a2 2 0 012-2h3v4M12 2v4h4a2 2 0 012 2v4M21 12v8a2 2 0 01-2 2h-3M16 22v-4h-4',
	]

	/** 状态映射（支持数字状态 1=待审核,2=已激活,3=待劝退,4=已劝退） */
	function mapStatus(s) {
		const num = Number(s)
		const numMap = {
			1: { status:'待审核', statusCls:'st-a', sdCls:'sda' },
			2: { status:'已激活', statusCls:'st-g', sdCls:'sdg' },
			3: { status:'待劝退', statusCls:'st-r', sdCls:'sdr' },
			4: { status:'已劝退', statusCls:'st-r', sdCls:'sdr' },
		}
		if (numMap[num]) return numMap[num]

		const strMap = {
			'pending':  { status:'待审核', statusCls:'st-a', sdCls:'sda' },
			'active':   { status:'已激活', statusCls:'st-g', sdCls:'sdg' },
			'dismiss':  { status:'待劝退', statusCls:'st-r', sdCls:'sdr' },
			'dismissed':{ status:'已劝退', statusCls:'st-r', sdCls:'sdr' },
		}
		const key = (s || '').toLowerCase()
		return strMap[key] || { status:s||'待审核', statusCls:'st-a', sdCls:'sda' }
	}

	/** 格式化时间：ISO字符串 → 相对时间 */
	function fmtRelative(t) {
		if (!t) return ''
		const d = new Date(t)
		const now = new Date()
		const diff = now - d
		const mins = Math.floor(diff / 60000)
		if (mins < 1) return '刚刚'
		if (mins < 60) return mins + '分钟前'
		const hrs = Math.floor(mins / 60)
		if (hrs < 24) return hrs + '小时前'
		const days = Math.floor(hrs / 24)
		if (days < 30) return days + '天前'
		return d.getMonth()+1 + '/' + d.getDate()
	}

	/** 账号行 → UI格式 */
	function mapAccount(r, idx) {
		const deptName = r.dept_name || r.dept || ''
		const colors = DEPT_COLORS[deptName] || { deptCls:'dt-blue', avaBg:PERSON_AVATARS[idx % PERSON_AVATARS.length] }
		const st = mapStatus(r.account_status)
		return {
			id: r.id || idx,
			avaBg: r.avaBg || colors.avaBg || PERSON_AVATARS[idx % PERSON_AVATARS.length],
			name: r.name || r.real_name || '',
			dept: deptName,
			deptCls: colors.deptCls || 'dt-blue',
			code: r.code || r.username || r.employee_no || '',
			status: st.status,
			statusCls: st.statusCls,
			sdCls: st.sdCls,
			hl: idx === 1,  // 第二条高亮
			time: fmtRelative(r.submit_time || r.update_time || r.create_time),
		}
	}

	/** 不达标人员 → UI格式 */
	function mapPerson(p, idx) {
		return {
			avaBg: PERSON_AVATARS[idx % PERSON_AVATARS.length],
			name: p.name || p.real_name || '',
			desc: p.desc || p.reason || p.kpi_desc || '',
			tag: p.tag || p.kpi_gap || '',
			tagCls: (p.tag || p.kpi_gap || '').includes('预警') ? 'amber' : 'red',
		}
	}

	/** 部门不达标 → UI格式（dept来自部门API，people来自不达标API） */
	function mapDept(d, idx, people) {
		const deptName = d.dept_name || d.name || ''
		const colors = DEPT_COLORS[deptName] || { iconCls:'di-blue', iconColor:'blue' }
		return {
			id: d.id || deptName,
			name: deptName,
			count: people.length,
			open: false,
			iconD: DEPT_ICONS[idx % DEPT_ICONS.length],
			iconCls: colors.iconCls || 'di-blue',
			iconColor: colors.iconColor || 'blue',
			people: people.map(mapPerson),
		}
	}

	export default {
			data() {
			return {
				overview: {
					pendingCount: 0,
					pendingChange: 0,
					activeCount: 0,
					activeChange: 0,
					pendingDismissCount: 0,
					dismissChange: 0,
					dismissedCount: 0,
				},
				accountList: [],
				deptList: [],
				loading: false,

				/* 审核状态弹窗 */
				modalVisible: false,
				editingAccount: {},
				selectedStatus: 1,
				joinDays: 0,
				submitting: false,
			}
		},
		onShow() {
			this.$checkAuth()
			this.fetchData()
		},
		methods: {
			goMyPage() { uni.navigateTo({ url: '/pages/my/my' }) },
			/* ── 数字千分位 ── */
			fmtNum(n) {
				if (n == null) return '0'
				return Number(n).toLocaleString()
			},

			/* ── 获取首页数据 ── */
			async fetchData() {
				this.loading = true
				try {
					// overview 独立请求，失败不影响其他数据
					this.fetchOverview()

					// 并发：账号列表（仅待审核，取5条）+ 部门列表
					const [accountRes, deptsRes] = await Promise.all([
						api.get('/api/admin/hr/accounts', { account_status: 1, limit: 5 }, { silent: true }),
						api.get('/api/admin/hr/departments', null, { silent: true }),
					])

					// 账号列表
					if (accountRes.code === 200) {
						const list = accountRes.data.list || accountRes.data || []
						this.accountList = (Array.isArray(list) ? list : []).map(mapAccount)
					}

					// 部门不达标人员：先拿部门列表，再按部门获取不达标数据
					if (deptsRes.code === 200 && deptsRes.data) {
						const depts = deptsRes.data || []
						await this.fetchUnderperforming(depts)
					}
				} catch (e) {
					console.error('[人事首页] 数据获取失败:', e)
				} finally {
					this.loading = false
				}
			},

			/* ── 独立获取概览 ── */
			async fetchOverview() {
				try {
					const overviewRes = await api.get('/api/admin/hr/overview', null, { silent: true })
					if (overviewRes.code === 200 && overviewRes.data) {
						const d = overviewRes.data
						this.overview = {
							pendingCount: d.pendingCount ?? 0,
							pendingChange: d.pendingChange ?? 0,
							activeCount: d.activeCount ?? 0,
							activeChange: d.activeChange ?? 0,
							pendingDismissCount: d.pendingDismissCount ?? 0,
							dismissChange: d.dismissChange ?? 0,
							dismissedCount: d.dismissedCount ?? 0,
						}
					}
				} catch (e) {
					console.error('[人事首页] 概览获取失败:', e)
				}
			},

			/* ── 按部门获取不达标人员 ── */
			async fetchUnderperforming(depts) {
				if (!depts.length) return
				try {
					// 并发请求每个部门的不达标人员
					const tasks = depts.map(d =>
						api.get('/api/admin/hr/underperforming', { dept_id: d.id }, { silent: true })
					)
					const results = await Promise.all(tasks)

					// 组装：所有部门都显示
					const list = results.map((res, idx) => {
						const d = depts[idx]
						let people = []
						if (res.code === 200) {
							people = res.data.list || res.data || []
						}
						return mapDept(d, idx, people)
					})
					this.deptList = list
				} catch (e) {
					console.error('[人事首页] 获取不达标人员失败:', e)
				}
			},

			navTo(url) { uni.navigateTo({ url }) },
			onAddAccount() {
				uni.navigateTo({
					url: '/pages/personnel-manage/personnel-manage'
				})
			},
			onDismiss() {
				uni.navigateTo({
					url: '/pages/hr-kpi/hr-kpi'
				})
			},
			onOverview() {
				uni.navigateTo({ url: '/pages/anchor-kpi/anchor-kpi' })
			},
			onAssessPublish() {
				uni.navigateTo({
					url: '/pages/assess-publish/assess-publish'
				})
			},
			onAssessManage() {
				uni.navigateTo({
					url: '/pages/assess-manage/assess-manage'
				})
			},

			/* ── 审核状态弹窗 ── */
			openEditModal(account) {
				this.editingAccount = account
				this.selectedStatus = 1
				this.modalVisible = true
			},
			closeEditModal() {
				this.modalVisible = false
				this.editingAccount = {}
			},
			submitStatus(status) {
				this.selectedStatus = status
			},
			async confirmEdit() {
				if (this.submitting) return
				this.submitting = true
				try {
					const res = await api.put(
						'/api/admin/hr/accounts/' + this.editingAccount.id,
						{ account_status: this.selectedStatus }
					)
					if (res.code === 200) {
						uni.showToast({ title: '状态修改成功', icon: 'success' })
						this.modalVisible = false
						// 从列表中移除该项
						const idx = this.accountList.findIndex(a => a.id === this.editingAccount.id)
						if (idx >= 0) this.accountList.splice(idx, 1)
					}
				} catch (e) {
					console.error('修改状态失败:', e)
				} finally {
					this.submitting = false
				}
			},
		}
	}
</script>

<style>
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #F1F5F9;
		padding-bottom: 180rpx;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased
	}

	.main {
		padding: 0 32rpx
	}

	.t10 {
		font-size: 20rpx
	}

	.t12 {
		font-size: 24rpx;
		margin-left: 30rpx;
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
		color: #94A3B8;
		margin-left: 10rpx;
	}

	.red {
		color: #EF4444
	}

	.amber {
		color: #F59E0B
	}

	.blue {
		color: #2563eb
	}

	.green {
		color: #059669
	}

	.gray {
		color: #475569
	}

	.purple {
		color: #8b5cf6
	}

	.pink {
		color: #db2777
	}

	.indigo {
		color: #4f46e5
	}
	.sum{
		margin-left: 8rpx;
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
		background: rgba(255, 255, 255, .8);
		border-bottom: 1rpx solid rgba(226, 232, 240, .6)
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
		background: #0F172A;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.bell-btn {
		position: relative;
		width: 72rpx;
		height: 72rpx;
		border-radius: 24rpx;
		background: #F8FAFC;
		border: 1rpx solid #f1f5f9;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.bell-dot {
		position: absolute;
		top: 12rpx;
		right: 20rpx;
		width: 16rpx;
		height: 16rpx;
		background: #EF4444;
		border-radius: 50%;
		border: 4rpx solid #fff
	}

	/* Section */
	.sec {
		margin-bottom: 48rpx
	}

	.sechd {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
		margin-top: 24rpx	;
	}

	.sechd-l {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 16rpx
	}

	/* Stats 4 - 两列网格 */
	.stats4 {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		margin-left: -12rpx;
		margin-right: -12rpx
	}

	.st-item {
		width: 50%;
		box-sizing: border-box;
		padding-left: 12rpx;
		padding-right: 12rpx;
		margin-bottom: 90rpx
	}

	.st-item-inner {
		background: #fff;
		border: 1rpx solid rgba(226, 232, 240, .8);
		border-radius: 32rpx;
		padding: 32rpx;
		height: 100%
	}

	.st-hd {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 16rpx;
		margin-bottom: 24rpx
	}

	.st-icon {
		width: 56rpx;
		height: 56rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.st-icon-a {
		background: #FFFBEB
	}

	.st-icon-g {
		background: #ECFDF5
	}

	.st-icon-r {
		background: #FEF2F2
	}

	.st-icon-z {
		background: #F8FAFC
	}

	.st-label {
		font-size: 24rpx;
		color: #94A3B8;
		font-weight: 500
	}

	.st-num {
		font-size: 48rpx;
		font-weight: 700;
		color: #0F172A;
		line-height: 1;
		display: block
	}

	.st-sub {
		font-size: 22rpx;
		color: #94A3B8;
		display: block;
		margin-top: 8rpx
	}

	/* List */
	.list-card {
		background: #fff;
		border: 1rpx solid rgba(226, 232, 240, .8);
		border-radius: 32rpx;
		overflow: hidden
	}

	.lr {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 32rpx;
		gap: 24rpx
	}

	.lr-hl {
		background: rgba(251, 191, 36, .03)
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
		color: #0F172A
	}

	.lr-sub {
		font-size: 24rpx;
		color: #94A3B8
	}

	.lr-r {
		text-align: center;
	}

	.lr-time {
		font-size: 20rpx;
		color: #d97706;
		font-weight: 500;
		display: block;
		margin-top: 8rpx
	}

	.ava {
		width: 88rpx;
		height: 88rpx;
		border-radius: 24rpx;
		flex-shrink: 0
	}

	.dv {
		height: 1rpx;
		background: #f1f5f9;
		margin: 0 32rpx
	}

	/* Status & dept tags */
	.status {
		display: inline-flex;
		align-items: center;
		gap: 8rpx;
		padding: 6rpx 35rpx;
		border-radius: 9999rpx;
		font-size: 24rpx;
		font-weight: 500;
		white-space: nowrap
	}
.status>span{
	display: flex;
	align-items: center;
}
.status>span>view:nth-child(1){
	margin-right: 2rpx;
}
.status>span>view:nth-child(2){
	margin-left: 2rpx;
}
	.st-a {
		background: #FEF3C7;
		color: #92400E;
		padding-top: 10rpx;
		padding-bottom: 10rpx;
	}

	.st-g {
		background: #D1FAE5;
		color: #065F46
	}

	.st-r {
		background: #FEE2E2;
		color: #991B1B
	}

	.sd {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%
	}

	.sda {
		background: #d97706
	}

	.sdg {
		background: #10b981
	}

	.sdr {
		background: #ef4444
	}

	.dept-tag {
		display: inline-flex;
		padding: 4rpx 16rpx;
		border-radius: 12rpx;
		font-size: 22rpx;
		font-weight: 600;
		white-space: nowrap
	}

	.dt-blue {
		background: #DBEAFE;
		color: #1E40AF
	}

	.dt-indigo {
		background: #E0E7FF;
		color: #3730A3
	}

	.dt-pink {
		background: #FCE7F3;
		color: #9D174D
	}

	.dt-green {
		background: #D1FAE5;
		color: #065F46
	}

	/* Dept cards */
	.dept-card {
		background: #fff;
		border: 1rpx solid rgba(226, 232, 240, .8);
		border-radius: 32rpx;
		overflow: hidden
	}

	.dept-hd {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 32rpx
	}

	.dept-hd-l {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx
	}

	.dept-icon {
		width: 64rpx;
		height: 64rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.di-blue {
		background: #DBEAFE
	}

	.di-indigo {
		background: #E0E7FF
	}

	.di-pink {
		background: #FCE7F3
	}

	.di-green {
		background: #D1FAE5
	}

	.dept-name {
		font-size: 28rpx;
		font-weight: 600;
		color: #0F172A;
		display: block
	}

	.dept-count {
		font-size: 24rpx;
		color: #94A3B8;
		display: block;
		margin-top: 2rpx
	}

	.chevron-open {
		transform: rotate(180deg);
		transition: transform .2s
	}

	.dept-body {
		border-top: 1rpx solid #f1f5f9;
		padding: 0 32rpx 32rpx
	}

	.dept-items {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
		margin-top: 32rpx
	}

	.dpi {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx
	}

	.ava-sm {
		width: 80rpx;
		height: 80rpx;
		border-radius: 16rpx;
		flex-shrink: 0
	}

	.dpi-main {
		flex: 1;
		min-width: 0
	}

	.dpi-name {
		font-size: 28rpx;
		font-weight: 500;
		color: #0F172A
	}

	.dpi-desc {
		font-size: 24rpx;
		color: #94A3B8;
		display: block;
		margin-top: 2rpx
	}

	.dpi-tag {
		font-size: 24rpx;
		font-weight: 600;
		flex-shrink: 0
	}

	/* Quick actions - 两列网格 */
	.quick4 {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		margin-left: -12rpx;
		margin-right: -12rpx
	}

	.qa {
		width: 50%;
		box-sizing: border-box;
		padding: 0 12rpx;
		margin-bottom: 24rpx
	}

	.qa:nth-last-child(-n+2) {
		margin-bottom: 0
	}

	.qa-inner {
		background: #fff;
		border: 1rpx solid rgba(226, 232, 240, .8);
		border-radius: 32rpx;
		padding: 32rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12rpx;
		min-height: 160rpx;
		justify-content: center
	}

	.qa-icon {
		width: 72rpx;
		height: 72rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.qa-icon-b {
		background: #DBEAFE
	}

	.qa-icon-g {
		background: #D1FAE5
	}

	.qa-icon-a {
		background: #FFFBEB
	}

	.qa-icon-p {
		background: #FAF5FF
	}

	.qa-label {
		font-size: 26rpx;
		color: #0F172A;
		font-weight: 600
	}

	.qa-sub {
		font-size: 20rpx;
		color: #94A3B8
	}

	/* Bottom nav */

	.btmnav-inner {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		padding: 8rpx 0
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
	.safe-btm { height: env(safe-area-inset-bottom, 0px) }
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

	.btmnav-label { font-size: 22rpx; font-weight: 500; color: #94a3b8; transition: color 0.2s; }
.btmnav-item.on .btmnav-label { color: #6370f0; font-weight: 600; }

/* Empty state */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 80rpx 32rpx 100rpx;
	background: #fff;
	border: 1rpx solid rgba(226, 232, 240, .8);
	border-radius: 32rpx;
}
.empty-icon-wrap {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	background: #f1f5f9;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 24rpx;
}
.empty-text {
	font-size: 26rpx;
	color: #94A3B8;
}
.s32 { width: 64rpx; height: 64rpx; flex-shrink: 0 }
.slate-300 { color: #CBD5E1 }

/* 编辑按钮 */
.edit-btn {
	display: inline-flex;
	align-items: center;
	gap: 6rpx;
	padding: 10rpx 24rpx;
	border-radius: 20rpx;
	background: #EEF2FF;
	color: #4F46E5;
	font-size: 24rpx;
	font-weight: 600;
	white-space: nowrap;
}

/* 弹窗遮罩 */
.modal-mask {
	position: fixed;
	top: 0; left: 0; right: 0; bottom: 0;
	z-index: 999;
	background: rgba(15, 23, 42, .5);
	backdrop-filter: blur(8rpx);
	-webkit-backdrop-filter: blur(8rpx);
	display: flex;
	align-items: flex-end;
	justify-content: center;
}
.modal-card {
	width: 100%;
	background: #fff;
	border-radius: 40rpx 40rpx 0 0;
	padding: 40rpx 32rpx;
	padding-bottom: calc(40rpx + env(safe-area-inset-bottom, 0px));
}
.modal-hd {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 32rpx;
}
.modal-title { font-size: 32rpx; font-weight: 700; color: #0F172A }
.modal-close {
	width: 60rpx; height: 60rpx;
	border-radius: 50%;
	background: #F1F5F9;
	display: flex;
	align-items: center;
	justify-content: center;
}
.modal-info {
	padding: 24rpx;
	background: #F8FAFC;
	border-radius: 20rpx;
	margin-bottom: 32rpx;
}
.modal-name { font-size: 28rpx; font-weight: 600; color: #0F172A; display: block }
.modal-dept { font-size: 24rpx; color: #94A3B8; margin-top: 8rpx; display: block }
.modal-options { display: flex; flex-direction: column; gap: 16rpx; margin-bottom: 36rpx }
.mo-item {
	display: flex;
	align-items: center;
	gap: 24rpx;
	padding: 28rpx 24rpx;
	border: 2rpx solid rgba(226, 232, 240, .8);
	border-radius: 24rpx;
}
.mo-check {
	width: 44rpx; height: 44rpx;
	border-radius: 50%;
	border: 2rpx solid #CBD5E1;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	transition: all .2s;
}
.mo-check-on { background: #4F46E5; border-color: #4F46E5 }
.mo-label { font-size: 28rpx; font-weight: 600; color: #0F172A; display: block }
.mo-desc { font-size: 22rpx; color: #94A3B8; margin-top: 4rpx; display: block }
.modal-actions { display: flex; gap: 24rpx }
.ma-cancel {
	flex: 1; text-align: center;
	padding: 28rpx 0;
	border-radius: 24rpx;
	background: #F1F5F9;
	font-size: 28rpx; font-weight: 600; color: #64748B;
}
.ma-confirm {
	flex: 2; text-align: center;
	padding: 28rpx 0;
	border-radius: 24rpx;
	background: #4F46E5;
	font-size: 28rpx; font-weight: 600; color: #fff;
}
.ma-disabled { opacity: .5; pointer-events: none }
.white { color: #fff }
</style>