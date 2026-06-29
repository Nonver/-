<template>
	<view class="pg">

		<!-- ═══════════════════ PAGE 1: 考核总览 ═══════════════════ -->
		<view v-show="currentPage==='overview'" class="page-overview">

			<!-- Header -->
			<view class="hdr">
				<view class="hdr-inner">
					<view class="hdr-btn" @tap="goBack">
						<svg class="s20 gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
						</svg>
					</view>
					<text class="hdr-text">考核总览</text>
					<view class="hdr-btn" @tap="showToast('搜索功能')">
						<svg class="s20 gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</view>
				</view>
			</view>

			<!-- Filter -->
			<view class="filter-bar">
				<view class="filter-inner">
					<view class="filter-btn" :class="currentFilter==='all'?'filter-on':'filter-off'" @tap="switchFilter('all')">全部</view>
					<view class="filter-btn" :class="currentFilter==='unqualified'?'filter-on':'filter-off'" @tap="switchFilter('unqualified')">不达标</view>
					<view class="filter-btn" :class="currentFilter==='qualified'?'filter-on':'filter-off'" @tap="switchFilter('qualified')">已达标</view>
				</view>
			</view>

			<!-- Main -->
			<view class="ov-main">

				<!-- Stats -->
				<view class="stats-card">
					<view class="stats-hd">
						<text class="stats-label">考核概况</text>
						<text class="stats-month">本月</text>
					</view>
					<view class="stats-grid stats-grid-4">
						<view class="stat-item">
							<text class="stat-num-strong">{{ kpiStats.totalCount }}</text>
							<text class="stat-note">总人数</text>
						</view>
						<view class="stat-item stat-item-border">
							<text class="stat-num-brand">{{ kpiStats.passedCount }}</text>
							<text class="stat-note">已达标</text>
						</view>
						<view class="stat-item stat-item-border">
							<text class="stat-num-red">{{ kpiStats.failedCount }}</text>
							<text class="stat-note">不达标</text>
						</view>
						<view class="stat-item stat-item-border">
							<text class="stat-num-orange">{{ kpiStats.needDismissCount }}</text>
							<text class="stat-note">可劝退（≥5次）</text>
						</view>
					</view>
				</view>

				<!-- Department Cards -->
				<view v-for="(dept, di) in departments" :key="dept.key" class="dept-card">
					<view class="dept-hd" @tap="toggleDept(dept.key)">
						<view class="dept-hd-l">
							<view class="dept-icon" :class="dept.iconBg">
								<svg class="s18" :class="dept.iconCls" fill="none" stroke="currentColor" :viewBox="dept.iconView">
									<path :d="dept.iconPath" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
								</svg>
							</view>
							<view>
								<text class="dept-name">{{ dept.name }}</text>
								<text class="dept-period">考核周期：{{ dept.period }}</text>
							</view>
						</view>
						<view class="dept-hd-r">
							<view class="dept-status" :class="dept.statusCls">{{ dept.statusLabel }}</view>
							<svg class="s16 gray-400" :class="deptExpanded[dept.key]?'arrow-up':'arrow-down'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</view>
					</view>

					<view class="dept-progress">
						<view class="progress-bar-track">
							<view class="progress-bar-fill" :class="dept.progressCls" :style="'width:'+dept.progress+'%'"></view>
						</view>
						<text class="progress-pct" :class="dept.progressCls">{{ dept.progress }}%</text>
					</view>

					<view class="dept-meta">
						<text class="meta-label">考核进度</text>
						<view class="meta-stats">
							<text class="meta-stat">达标 <text class="meta-num strong">{{ dept.passed }}</text> 人</text>
							<text class="meta-stat">不达标 <text class="meta-num red">{{ dept.failed }}</text> 人</text>
						</view>
					</view>

					<!-- Members (expandable) -->
					<view v-show="deptExpanded[dept.key]" class="dept-members animate-expand">
						<view class="member-hd">
							<text class="member-col w-16">姓名</text>
							<text class="member-col w-14 center">工号</text>
							<text class="member-col w-10 center">分数</text>
							<text class="member-col w-10 center">达标</text>
							<text class="member-col w-12 center">不达标</text>
							<text class="member-col w-10 right">状态</text>
						</view>
						<view v-for="m in filteredMembers(dept)" :key="m.name" class="member-row" :class="[m.status==='failed'?'member-row-warn':'', m.needDismiss?'member-row-danger':'']" @tap="viewMemberDetail(m)">
							<text class="member-col w-16 truncate" :class="m.needDismiss?'text-red':''">{{ m.name }}</text>
							<text class="member-col w-14 center gray-400">{{ m.empId }}</text>
							<text class="member-col w-10 center" :class="m.status==='failed'?'num-red':'num-' + dept.color">{{ m.score }}</text>
							<text class="member-col w-10 center num-green">{{ m.passedTimes }}</text>
							<text class="member-col w-12 center" :class="m.failedTimes>=5?'num-red bold':''">{{ m.failedTimes }}</text>
							<view class="member-col w-10 right">
								<text class="member-status" :class="m.status==='passed'?'mem-passed':'mem-failed'">{{ m.status==='passed'?'已达标':'不达标' }}</text>
								<text class="member-arrow">›</text>
							</view>
						</view>
					</view>
				</view>

				<view class="ov-spacer"></view>
			</view>
		</view>

		<!-- ═══════════════════ PAGE 2: 劝退管理 ═══════════════════ -->
		<view v-show="currentPage==='dismissal'" class="page-dismissal">

			<!-- Header -->
			<view class="hdr">
				<view class="hdr-inner">
					<view class="hdr-btn" @tap="switchMainTab('overview')">
						<svg class="s20 gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
						</svg>
					</view>
					<text class="hdr-text">劝退管理</text>
					<view class="hdr-btn" @tap="showToast('筛选')">
						<svg class="s20 gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
						</svg>
					</view>
				</view>
				<!-- Sub-tabs -->
				<view class="dm-tabs">
					<view class="dm-tab" :class="dmSubTab==='pending'?'dm-tab-on':'dm-tab-off'" @tap="dmSubTab='pending'">
						<text>待处理</text>
						<view class="dm-tab-badge" :class="dmSubTab==='pending'?'dm-badge-on':'dm-badge-off'">{{ dismissPending.length }}</view>
					</view>
					<view class="dm-tab" :class="dmSubTab==='submitted'?'dm-tab-on':'dm-tab-off'" @tap="dmSubTab='submitted'">
						<text>已提交</text>
						<view class="dm-tab-badge" :class="dmSubTab==='submitted'?'dm-badge-on':'dm-badge-off'">{{ dismissSubmitted.length }}</view>
					</view>
				</view>
			</view>

			<!-- Pending -->
			<view v-show="dmSubTab==='pending'" class="dm-list">
				<view v-for="(p, pi) in dismissPending" :key="pi" class="dm-card">
					<view class="dm-card-top">
						<view class="dm-user">
							<view class="dm-avatar" :class="p.avatarBg">{{ p.name.charAt(0) }}</view>
							<view>
								<text class="dm-name">{{ p.name }}</text>
								<text class="dm-dept">{{ p.deptLabel }}</text>
							</view>
						</view>
						<view class="dm-status-tag tag-amber">待处理</view>
					</view>

					<view class="dm-date-row">
						<svg class="s14 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
						<text class="dm-date">入职时间：{{ p.joinDate }}</text>
					</view>

					<view class="dm-field">
						<text class="dm-field-label">劝退原因备注</text>
						<textarea class="dm-textarea" v-model="p.remark" placeholder="请输入劝退原因及备注信息..."></textarea>
					</view>

					<view class="dm-actions">
						<view class="dm-btn dm-btn-primary" @tap="submitDismissal(p)">提交劝退</view>
					</view>
				</view>
				<view class="dm-spacer"></view>
			</view>

			<!-- Submitted -->
			<view v-show="dmSubTab==='submitted'" class="dm-list">
				<view v-for="(s, si) in dismissSubmitted" :key="si" class="dm-card">
					<view class="dm-card-top">
						<view class="dm-user">
							<view class="dm-avatar" :class="s.avatarBg">{{ s.name.charAt(0) }}</view>
							<view>
								<text class="dm-name">{{ s.name }}</text>
								<text class="dm-dept">{{ s.deptLabel }}</text>
							</view>
						</view>
						<view class="dm-status-tag" :class="s.statusCls">{{ s.statusLabel }}</view>
					</view>

					<view class="dm-info">
						<view class="dm-info-item" v-if="s.submitTime">
							<svg class="s14 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<text>提交时间：{{ s.submitTime }}</text>
						</view>
						<view class="dm-info-item" v-if="s.dealTime">
							<svg class="s14 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<text>{{ s.isApproved ? '劝退日期' : '驳回时间' }}：{{ s.dealTime }}</text>
						</view>
						<view class="dm-info-item">
							<svg class="s14 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							<text class="gray-500">原因：{{ s.reason }}</text>
						</view>
					</view>
				</view>
				<view class="dm-spacer"></view>
			</view>
		</view>

		<!-- ═══════════════════ Bottom Tab ═══════════════════ -->
		<view class="bottom-tab">
			<view class="bt-item" :class="currentPage==='overview'?'bt-on':''" @tap="switchMainTab('overview')">
				<svg class="s20" :class="currentPage==='overview'?'brand':'gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
				</svg>
				<text class="bt-label" :class="currentPage==='overview'?'brand':''">考核总览</text>
			</view>
			<view class="bt-item" :class="currentPage==='dismissal'?'bt-on':''" @tap="switchMainTab('dismissal')">
				<svg class="s20" :class="currentPage==='dismissal'?'brand':'gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
				</svg>
				<text class="bt-label" :class="currentPage==='dismissal'?'brand':''">劝退管理</text>
			</view>
			<!-- <view class="bt-item" @tap="showToast('数据统计')">
				<svg class="s20 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
				</svg>
				<text class="bt-label gray-400">数据统计</text>
			</view> -->
			<!-- <view class="bt-item" @tap="showToast('我的')">
				<svg class="s20 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
				<text class="bt-label gray-400">我的</text>
			</view> -->
		</view>

		<!-- ═══════════════════ Toast ═══════════════════ -->
		<view class="toast" :class="toastVisible?'toast-show':''">
			<text class="toast-text">{{ toastMsg }}</text>
		</view>
	</view>
</template>

<script>
	import { api } from '@/utils/api.js'

	// ── 部门UI配置映射 ──
	const DEPT_UI = {
		'经纪部': { key:'broker', color:'brand', iconBg:'icon-brand', iconCls:'brand', progressCls:'fill-brand',
			iconView:'0 0 24 24', iconPath:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z' },
		'中转部': { key:'transfer', color:'emerald', iconBg:'icon-emerald', iconCls:'emerald', progressCls:'fill-emerald',
			iconView:'0 0 24 24', iconPath:'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
		'运营部': { key:'operation', color:'violet', iconBg:'icon-violet', iconCls:'violet', progressCls:'fill-violet',
			iconView:'0 0 24 24', iconPath:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
		'主播部': { key:'anchor', color:'rose', iconBg:'icon-rose', iconCls:'rose', progressCls:'fill-rose',
			iconView:'0 0 24 24', iconPath:'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
	}

	// ── 头像配色轮转 ──
	const AVATAR_COLORS = ['dm-av-brand', 'dm-av-emerald', 'dm-av-violet', 'dm-av-rose']

	// ── 部门名称规范化（去掉"部门"后缀来匹配配置key） ──
	function normalizeDeptName(name) {
		if (!name) return ''
		return name.replace(/部门$/, '部')
	}

	// ── 格式化时间 ──
	function fmtDate(t) {
		if (!t) return ''
		const d = new Date(t)
		return d.getFullYear() + '.' + String(d.getMonth()+1).padStart(2,'0') + '.' + String(d.getDate()).padStart(2,'0')
	}

	export default {
		data() {
			return {
				currentPage: 'overview',
				currentFilter: 'all',
				deptExpanded: {},
				departments: [],

				/* 考核概况统计 */
				kpiStats: { totalCount: 0, passedCount: 0, failedCount: 0, needDismissCount: 0 },
				kpiLoading: false,

				/* 劝退管理 */
				dmSubTab: 'pending',
				dismissPending: [],
				dismissSubmitted: [],
				dmLoading: false,

				toastVisible: false,
				toastMsg: ''
			}
		},
		onShow() {
			this.$checkAuth()
			this.fetchKpiData()
			if (this.currentPage === 'dismissal') {
				this.fetchDismissData()
			}
		},
		methods: {
			goBack() { uni.navigateTo({ url: '/pages/hr/hr' }) },

			/* ── 考核总览 ── */
			async fetchKpiData() {
				this.kpiLoading = true
				try {
					const res = await api.get('/api/admin/hr/kpi/overview', null, { silent: true })
					if (res.code === 200 && res.data) {
						const d = res.data
						this.kpiStats = {
							totalCount: d.totalCount || 0,
							passedCount: d.passedCount || 0,
							failedCount: d.failedCount || 0,
							needDismissCount: d.needDismissCount || 0,
						}

						// 映射部门列表
						const rawDepts = d.departments || []
						this.departments = rawDepts.map((dept, idx) => {
							const name = dept.name || dept.dept_name || ''
							// 去掉"部门"后缀匹配UI配置
							const ui = DEPT_UI[normalizeDeptName(name)] || {
								key: 'dept' + idx,
								color: 'brand',
								iconBg: 'icon-brand',
								iconCls: 'brand',
								progressCls: 'fill-brand',
								iconView: '0 0 24 24',
								iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
							}

							// 后端已返回 statusLabel / statusCls，直接使用
							const isDone = dept.statusLabel === '已完成'

							const members = (dept.members || []).map(m => ({
								userId: m.userId || 0,
								name: m.name || m.real_name || '',
								empId: m.empId || m.employee_no || m.code || '',
								score: m.score ?? m.total_score ?? 0,
								status: m.status || 'passed',
								passedTimes: m.passedTimes ?? 0,
								failedTimes: m.failedTimes ?? 0,
								needDismiss: m.needDismiss || false,
							}))

							return {
								key: ui.key,
								name: name,
								period: dept.period || '',
								progress: dept.progress ?? 0,
								passed: dept.passed ?? dept.passedCount ?? 0,
								failed: dept.failed ?? dept.failedCount ?? 0,
								total: dept.total ?? dept.totalCount ?? 0,
								statusLabel: dept.statusLabel || (isDone ? '已完成' : '进行中'),
								statusCls: dept.statusCls || (isDone ? 'tag-emerald' : 'tag-amber'),
								iconBg: ui.iconBg,
								iconCls: ui.iconCls,
								color: ui.color,
								iconView: ui.iconView,
								iconPath: ui.iconPath,
								progressCls: ui.progressCls,
								members: members,
							}
						})
					}
				} catch (e) {
					console.error('[考核总览] 获取失败:', e)
				} finally {
					this.kpiLoading = false
				}
			},

			/* ── 劝退管理 ── */
			// 状态: 0=待HR处理, 1=待总经审核, 2=已劝退, 3=已驳回
			async fetchDismissData() {
				this.dmLoading = true
				try {
					const [pendingRes, submittedRes] = await Promise.all([
						api.get('/api/admin/hr/persuades', { status: 0 }, { silent: true }),
						api.get('/api/admin/hr/persuades', { status: '1,2,3' }, { silent: true }),
					])

					if (pendingRes.code === 200) {
						const list = pendingRes.data.list || []
						this.dismissPending = list.map((p, idx) => ({
							id: p.id,
							name: p.real_name || p.name || '',
							deptLabel: (p.dept_name || '') + ' · 入职 ' + (p.tenure || '') + ' 个月',
							joinDate: fmtDate(p.create_time || p.join_date),
							avatarBg: AVATAR_COLORS[idx % AVATAR_COLORS.length],
							remark: p.reason || '',
						}))
					}

					if (submittedRes.code === 200) {
						const list = submittedRes.data.list || []
						const STATUS_MAP = {
							1: { label: '审核中', cls: 'tag-amber' },
							2: { label: '已劝退', cls: 'tag-emerald' },
							3: { label: '已驳回', cls: 'tag-rose' },
						}
						this.dismissSubmitted = list.map((s, idx) => {
							const st = STATUS_MAP[s.status] || { label: '未知', cls: 'tag-gray' }
							return {
								id: s.id,
								name: s.real_name || s.name || '',
								deptLabel: s.dept_name || '',
								avatarBg: AVATAR_COLORS[idx % AVATAR_COLORS.length],
								statusLabel: st.label,
								statusCls: st.cls,
								isApproved: s.status === 2,
								submitTime: fmtDate(s.create_time),
								dealTime: fmtDate(s.deal_time),
								reason: s.hr_remark || s.reason || '',
							}
						})
					}
				} catch (e) {
					console.error('[劝退管理] 获取失败:', e)
				} finally {
					this.dmLoading = false
				}
			},

			switchFilter(f) { this.currentFilter = f },
			filteredMembers(dept) {
				const members = dept.members || []
				if (this.currentFilter === 'all') return members
				if (this.currentFilter === 'unqualified') return members.filter(m => m.status === 'failed')
				if (this.currentFilter === 'qualified') return members.filter(m => m.status === 'passed')
				return members
			},
			filteredCount(dept) {
				return this.filteredMembers(dept).length
			},
			switchMainTab(tab) {
				this.currentPage = tab
				if (tab === 'dismissal' && this.dismissPending.length === 0) {
					this.fetchDismissData()
				}
			},
			toggleDept(key) {
				this.$set(this.deptExpanded, key, !this.deptExpanded[key])
			},
			async submitDismissal(item) {
				uni.showModal({
					title: '提交劝退',
					content: '确认将该人员提交劝退申请？提交后将由总经办进行最终审核。',
					success: async (res) => {
						if (res.confirm) {
							try {
								await api.post('/api/admin/hr/persuades/' + item.id + '/submit',
									{ remark: item.remark || '' }, { silent: true })
								this.showToast('已提交，待总经审核')
								this.fetchDismissData()
							} catch (e) {
								this.showToast('操作失败')
							}
						}
					}
				})
			},
			viewMemberDetail(member) {
				if (!member.userId) return
				uni.navigateTo({
					url: '/pages/member-detail/member-detail?userId=' + member.userId + '&userName=' + encodeURIComponent(member.name),
				})
			},
			showToast(msg) {
				this.toastMsg = msg
				this.toastVisible = true
				clearTimeout(this._toastTimer)
				this._toastTimer = setTimeout(() => { this.toastVisible = false }, 2000)
			}
		}
	}
</script>

<style>
	/* ═══════ Base ═══════ */
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #f0f2f5;
		font-family: -apple-system, BlinkMacSystemFont, 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased;
		overflow-x: hidden;
		padding-bottom: 140rpx;
	}
	.s12 { width: 24rpx; height: 24rpx; flex-shrink: 0 }
	.s14 { width: 28rpx; height: 28rpx; flex-shrink: 0 }
	.s16 { width: 32rpx; height: 32rpx; flex-shrink: 0 }
	.s18 { width: 36rpx; height: 36rpx; flex-shrink: 0 }
	.s20 { width: 40rpx; height: 40rpx; flex-shrink: 0 }
	.gray-400 { color: #9ca3af }
	.gray-500 { color: #6b7280 }
	.gray-500 text { color: #6b7280 }
	.brand { color: #3b82f6 }
	.emerald { color: #10b981 }
	.violet { color: #8b5cf6 }
	.rose { color: #f43f5e }
	.truncate {
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	.animate-expand {
		animation: expandIn 0.35s ease-out;
		overflow: hidden;
	}
	@keyframes expandIn {
		from { max-height: 0; opacity: 0 }
		to { max-height: 2000rpx; opacity: 1 }
	}

	/* ═══════ Header ═══════ */
	.hdr {
		position: sticky;
		top: 0;
		z-index: 40;
		background: rgba(255,255,255,0.95);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1rpx solid rgba(0,0,0,0.04);
	}
	.hdr-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 112rpx;
		padding: 0 40rpx;
		/* padding-top: 48rpx; */
	}
	.hdr-btn {
		width: 48rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}
	.hdr-btn:active { background: #f9fafb }
	.hdr-text {
		font-size: 30rpx;
		font-weight: 600;
		color: #111827;
		letter-spacing: -0.02em;
	}
	.hdr-r {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	/* ═══════ Filter ═══════ */
	.filter-bar {
		position: sticky;
		top: 112rpx;
		z-index: 40;
		background: #f0f2f5;
		padding: 16rpx 32rpx 12rpx;
	}
	.filter-inner {
		display: flex;
		gap: 8rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 8rpx;
		box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
	}
	.filter-btn {
		flex: 1;
		text-align: center;
		padding: 14rpx 0;
		font-size: 24rpx;
		font-weight: 500;
		border-radius: 16rpx;
		transition: all 0.2s;
	}
	.filter-on { background: #3b82f6; color: #fff }
	.filter-off { color: #6b7280 }

	/* ═══════ Overview Main ═══════ */
	.ov-main { padding: 16rpx 32rpx 0 }
	.ov-spacer { height: 64rpx }

	/* Stats */
	.stats-card {
		background: #fff;
		border-radius: 24rpx;
		padding: 40rpx;
		box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.04);
		margin-bottom: 24rpx;
	}
	.stats-hd {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}
	.stats-label { font-size: 22rpx; color: #6b7280; font-weight: 500 }
	.stats-month {
		font-size: 18rpx; color: #3b82f6; background: #eff6ff;
		padding: 6rpx 20rpx; border-radius: 9999rpx; font-weight: 500;
	}
	.stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
	}
	.stats-grid-4 {
		grid-template-columns: 1fr 1fr 1fr 1fr;
	}
	.stat-item { text-align: center; padding: 0 16rpx }
	.stat-item-border { border-left: 1rpx solid #f3f4f6 }
	.stat-num-strong { font-size: 48rpx; font-weight: 700; color: #111827; display: block }
	.stat-num-brand { font-size: 48rpx; font-weight: 700; color: #3b82f6; display: block }
	.stat-num-red { font-size: 48rpx; font-weight: 700; color: #ef4444; display: block }
	.stat-num-orange { font-size: 48rpx; font-weight: 700; color: #f97316; display: block }
	.stat-note { font-size: 20rpx; color: #9ca3af; margin-top: 8rpx; display: block }

	/* Dept Card */
	.dept-card {
		background: #fff;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.04);
		overflow: hidden;
		margin-bottom: 20rpx;
	}
	.dept-hd {
		padding: 40rpx 40rpx 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.dept-hd:active { opacity: 0.8 }
	.dept-hd-l {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}
	.dept-icon {
		width: 52rpx;
		height: 52rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.icon-brand { background: #eff6ff }
	.icon-emerald { background: #ecfdf5 }
	.icon-violet { background: #f5f3ff }
	.icon-rose { background: #fff1f2 }
	.dept-name { font-size: 26rpx; font-weight: 600; color: #111827; display: block }
	.dept-period { font-size: 20rpx; color: #9ca3af; margin-top: 4rpx; display: block }
	.dept-hd-r {
		display: flex;
		align-items: center;
		gap: 12rpx;
		flex-shrink: 0;
	}
	.dept-status {
		padding: 6rpx 16rpx;
		border-radius: 9999rpx;
		font-size: 18rpx;
		font-weight: 600;
	}
	.tag-amber { background: #fffbeb; color: #d97706 }
	.tag-emerald { background: #ecfdf5; color: #059669 }
	.arrow-up { transform: rotate(180deg); transition: transform 0.3s }
	.arrow-down { transform: rotate(0deg); transition: transform 0.3s }

	/* Progress */
	.dept-progress {
		padding: 0 40rpx 16rpx;
		display: flex;
		align-items: center;
		gap: 16rpx;
	}
	.progress-bar-track {
		flex: 1;
		height: 12rpx;
		background: #f3f4f6;
		border-radius: 9999rpx;
		overflow: hidden;
	}
	.progress-bar-fill {
		height: 12rpx;
		border-radius: 9999rpx;
		transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
	}
	.fill-brand { background: #3b82f6 }
	.fill-emerald { background: #10b981 }
	.fill-violet { background: #8b5cf6 }
	.fill-rose { background: #f43f5e }
	.progress-pct { font-size: 24rpx; font-weight: 600 }

	/* Meta */
	.dept-meta {
		padding: 0 40rpx 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.meta-label { font-size: 20rpx; color: #9ca3af }
	.meta-stats { display: flex; gap: 24rpx }
	.meta-stat { font-size: 20rpx; color: #6b7280 }
	.meta-num { font-weight: 700 }
	.meta-num.strong { color: #111827 }
	.meta-num.red { color: #ef4444 }

	/* Members */
	.dept-members { border-top: 1rpx solid #f9fafb }
	.member-hd {
		display: flex;
		padding: 20rpx 40rpx;
		background: rgba(249,250,251,0.5);
		font-size: 20rpx;
		color: #9ca3af;
	}
	.member-row {
		display: flex;
		padding: 24rpx 40rpx;
		border-bottom: 1rpx solid #f9fafb;
		align-items: center;
		font-size: 22rpx;
	}
	.member-row-warn { background: rgba(254,242,242,0.3) }
	.member-row-danger { background: rgba(254,226,226,0.6); border-left: 4rpx solid #ef4444 }
	.member-col { flex-shrink: 0 }
	.w-20 { width: 140rpx }
	.w-16 { width: 112rpx }
	.w-14 { width: 98rpx }
	.w-12 { width: 84rpx }
	.w-10 { width: 70rpx }
	.center { text-align: center }
	.right { text-align: right }
	.num-red { color: #ef4444; font-weight: 600 }
	.num-green { color: #059669; font-weight: 600 }
	.num-brand { color: #3b82f6; font-weight: 600 }
	.num-emerald { color: #10b981; font-weight: 600 }
	.num-violet { color: #8b5cf6; font-weight: 600 }
	.num-rose { color: #f43f5e; font-weight: 600 }
	.bold { font-weight: 700 }
	.text-red { color: #dc2626 }
	.member-status {
		font-size: 18rpx;
		padding: 4rpx 16rpx;
		border-radius: 9999rpx;
		font-weight: 600;
	}
	.mem-passed { background: #ecfdf5; color: #059669 }
	.mem-failed { background: #fef2f2; color: #ef4444 }
	.member-arrow {
		font-size: 28rpx;
		color: #cbd5e1;
		margin-left: 6rpx;
		font-weight: 300;
	}
	.view-brand { color: #3b82f6 }
	.view-emerald { color: #10b981 }
	.view-violet { color: #8b5cf6 }
	.view-rose { color: #f43f5e }

	/* ═══════ Dismissal ═══════ */
	.page-dismissal { }
	.dm-tabs {
		display: flex;
		border-bottom: 1rpx solid #f3f4f6;
	}
	.dm-tab {
		flex: 1;
		text-align: center;
		padding: 20rpx 0;
		font-size: 24rpx;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8rpx;
		transition: all 0.2s;
	}
	.dm-tab-on { color: #3b82f6; border-bottom: 4rpx solid #3b82f6; font-weight: 600 }
	.dm-tab-off { color: #9ca3af; border-bottom: 4rpx solid transparent }
	.dm-tab-badge {
		font-size: 16rpx;
		padding: 2rpx 14rpx;
		border-radius: 9999rpx;
		font-weight: 600;
	}
	.dm-badge-on { background: #eff6ff; color: #3b82f6 }
	.dm-badge-off { background: #f3f4f6; color: #6b7280 }

	.dm-list { padding: 16rpx 32rpx 0 }
	.dm-spacer { height: 80rpx }
	.dm-card {
		background: #fff;
		border-radius: 24rpx;
		padding: 40rpx;
		box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.04);
		margin-bottom: 20rpx;
	}
	.dm-card-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	.dm-user { display: flex; align-items: center; gap: 16rpx }
	.dm-avatar {
		width: 56rpx;
		height: 56rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		font-weight: 700;
		color: #fff;
		flex-shrink: 0;
	}
	.dm-avatar-dim { background: #f3f4f6; color: #6b7280 }
	.dm-av-brand { background: #3b82f6 }
	.dm-av-emerald { background: #10b981 }
	.dm-av-violet { background: #8b5cf6 }
	.dm-av-rose { background: #f43f5e }
	.dm-name { font-size: 24rpx; font-weight: 600; color: #111827; display: block }
	.dm-dept { font-size: 20rpx; color: #9ca3af; margin-top: 4rpx; display: block }

	.dm-status-tag {
		padding: 6rpx 18rpx;
		border-radius: 9999rpx;
		font-size: 18rpx;
		font-weight: 600;
		flex-shrink: 0;
	}
	.tag-orange { background: #fff7ed; color: #ea580c }

	.dm-date-row {
		display: flex;
		align-items: center;
		gap: 8rpx;
		margin-bottom: 24rpx;
	}
	.dm-date { font-size: 20rpx; color: #6b7280 }

	.dm-field { margin-bottom: 24rpx }
	.dm-field-label {
		font-size: 20rpx;
		color: #6b7280;
		margin-bottom: 12rpx;
		display: block;
	}
	.dm-textarea {
		width: 100%;
		height: 120rpx;
		font-size: 24rpx;
		color: #374151;
		background: #f9fafb;
		border: 1rpx solid #f3f4f6;
		border-radius: 16rpx;
		padding: 20rpx 24rpx;
		box-sizing: border-box;
	}
	.dm-textarea:focus {
		border-color: #93c5fd;
		background: #fff;
	}

	.dm-actions {
		display: flex;
		gap: 16rpx;
	}
	.dm-btn {
		flex: 1;
		text-align: center;
		padding: 20rpx 0;
		border-radius: 16rpx;
		font-size: 22rpx;
		font-weight: 500;
		transition: all 0.12s;
	}
	.dm-btn:active { transform: scale(0.97) }
	.dm-btn-outline { background: #f9fafb; color: #6b7280 }
	.dm-btn-outline:active { background: #f3f4f6 }
	.dm-btn-primary { background: #3b82f6; color: #fff }
	.dm-btn-primary:active { background: #2563eb }
	.dm-btn-full {
		width: 100%;
		background: #eff6ff;
		color: #3b82f6;
	}
	.dm-btn-wrap { margin-top: 16rpx; border-top: 1rpx solid #f9fafb; padding-top: 24rpx }

	/* Info rows */
	.dm-info { }
	.dm-info-item {
		display: flex;
		align-items: flex-start;
		gap: 8rpx;
		font-size: 20rpx;
		color: #6b7280;
		margin-bottom: 12rpx;
		line-height: 1.5;
	}

	/* ═══════ Bottom Tab ═══════ */
	.bottom-tab {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 128rpx;
		background: #fff;
		border-top: 1rpx solid #f3f4f6;
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding-bottom: env(safe-area-inset-bottom, 0);
		z-index: 60;
		box-shadow: 0 -4rpx 24rpx rgba(0,0,0,0.04);
	}
	.bt-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4rpx;
		width: 128rpx;
	}
	.bt-label {
		font-size: 16rpx;
		font-weight: 500;
	}

	/* ═══════ Toast ═══════ */
	.toast {
		position: fixed;
		top: 160rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
		background: rgba(31,41,55,0.9);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		padding: 18rpx 40rpx;
		border-radius: 9999rpx;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.2s ease;
	}
	.toast-show { opacity: 1 }
	.toast-text { color: #fff; font-size: 22rpx; font-weight: 500 }
</style>
