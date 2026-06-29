<template>

	<view class="pg">
		<view class="hdr">
			<view class="hdr-inner">
				<view class="hdr-back" @tap="goBack"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"
						stroke="#64748b" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg></view>
				<view class="hdr-icon-wrap">
					<svg class="s20 white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
					</svg>
				</view>
				<view class="hdr-text-group">
					<text class="hdr-title">流水管理台账</text>
					<text class="hdr-sub">2024年1月</text>
				</view>
				<view class="hdr-right">
					<view class="perspective-tag">{{ isStaff ? '个人视角' : '财务视角' }}</view>
					<view v-if="!isStaff" class="audit-flow-btn" @tap="goToFlowReview">
						<svg class="s16" style="color:#fff" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
						</svg>
						<text>审核流水</text>
						<text v-if="pendingFlowCount>0" class="audit-flow-badge">{{ pendingFlowCount }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- ═══ Main ═══ -->
		<view class="main">

			<!-- ═══ Stats Cards ═══ -->
			<view class="stats-section">
				<!-- 累计总流水 -->
				<view class="stat-card">
					<view class="sc-hd">
						<text class="sc-label">累计总流水</text>
						<view class="sc-badge-all">ALL TIME</view>
					</view>
					<view class="sc-amount-row">
						<text class="sc-yen">¥</text>
						<text class="sc-num">{{ (Number(totalAmount) || 0).toFixed(2) }}</text>
					</view>
					<view class="sc-trend">
						<text class="st-text-gray">累计数据</text>
					</view>
				</view>

				<!-- 本月流水 -->
				<view class="stat-card">
					<view class="sc-hd">
						<text class="sc-label">本月流水</text>
						<view class="sc-badge-month">当月</view>
					</view>
					<view class="sc-amount-row">
						<text class="sc-yen">¥</text>
						<text class="sc-num">{{ (Number(monthTotal) || 0).toFixed(2) }}</text>
					</view>
					<view class="sc-breakdown">
						<view class="bd-item">
							<view class="bd-dot bd-income"></view>
							<text class="bd-label">收入</text>
							<text class="bd-value">¥{{ (Number(monthIncome) || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</text>
						</view>
						<view class="bd-item">
							<view class="bd-dot bd-expense"></view>
							<text class="bd-label">支出</text>
							<text class="bd-value">¥{{ (Number(monthExpense) || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- ═══ Date Filter ═══ -->
			<view class="filter-card">
				<view class="date-range-row">
					<picker mode="date" :value="startDate" @change="onStartDateChange" fields="day">
						<view class="date-input">
							<text :class="startDate?'di-text':'di-placeholder'">{{ startDate || '开始日期' }}</text>
							<svg class="s16 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
							</svg>
						</view>
					</picker>
					<text class="range-sep">—</text>
					<picker mode="date" :value="endDate" @change="onEndDateChange" fields="day">
						<view class="date-input">
							<text :class="endDate?'di-text':'di-placeholder'">{{ endDate || '结束日期' }}</text>
							<svg class="s16 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
							</svg>
						</view>
					</picker>
				</view>

				<!-- Quick filters -->
				<scroll-view scroll-x class="quick-scroll">
					<view class="quick-row">
						<view v-for="(q, qi) in quickFilters" :key="qi" class="quick-chip"
							:class="currentQuick===q.key?'qc-on':'qc-off'" @tap="currentQuick=q.key; onQuickFilter(q.key)">
							<text>{{ q.label }}</text>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- ═══ Person Filter ═══ -->
			<view class="person-filter-card" v-if="!isStaff">
				<view class="pf-hd">
					<text class="pf-title">人员筛选</text>
					<text class="pf-hint">全量数据</text>
				</view>
				<scroll-view scroll-x class="person-scroll">
					<view class="person-row">
						<view v-for="(p, pi) in personList" :key="pi" class="person-chip"
							:class="currentPerson===p.key?'pc-on':'pc-off'" @tap="currentPerson=p.key; fetchFlows()">
							<view v-if="p.key==='all'" style="display:flex;align-items:center;gap:6rpx">
								<svg class="s14 white" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round"
										d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
								</svg>
								<text>全部人员</text>
							</view>
							<view v-else style="display:flex;align-items:center;gap:6rpx">
								<view class="pc-avatar" :class="'av-'+pi">{{ p.name.charAt(0) }}</view>
								<text>{{ p.name }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- ═══ History List ═══ -->
			<view class="list-section">
				<view class="list-header">
					<text class="lh-title">历史流水明细</text>
					<text class="lh-count">共 {{ totalFlowCount }} 条记录</text>
				</view>

				<view class="record-list card-shadow">
					<view v-for="(r, ri) in recordList.slice(0, 5)" :key="ri" class="record-item" @tap="goDetail(r)">
						<view class="ri-left">
							<view class="ri-meta-row">
								<text class="ri-date">{{ r.date }}</text>
								<text v-if="r.dayLabel" class="ri-day-tag">{{ r.dayLabel }}</text>
								<view class="ri-type-tag" :class="'rt-'+r.typeKey">
									<text>{{ r.typeName }}</text>
								</view>
							</view>
							<text class="ri-title">{{ r.title }}</text>
							<text class="ri-handler">经办：{{ r.handler }}</text>
						</view>
						<view class="ri-right">
							<text class="ri-amount"
								:class="r.amount>=0?'amt-income':'amt-expense'">{{ r.amount>=0?'+':'-' }}¥{{ Math.abs(r.amount).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2}) }}</text>
							<text class="ri-time">{{ r.time }}</text>
						</view>
					</view>
				</view>

				<!-- View All Button -->
				<view class="load-more-btn" @tap="goToFlowList">
					<text>查看全部记录 →</text>
				</view>
			</view>

			<view class="bottom-spacer"></view>
		</view>

		<!-- ═══ Bottom Tab ═══ -->
		<!-- <view class="bottom-tab">
			<view class="bt-item bt-on">
				<view class="bt-icon-bg brand-bg">
					<svg class="s20 white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
					</svg>
				</view>
				<text class="bt-label-on">流水台账</text>
			</view>
			<view class="bt-item">
				<view class="bt-icon-bg gray-bg">
					<svg class="s20 gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
					</svg>
				</view>
				<text class="bt-label-off">统计报表</text>
			</view>
			<view class="bt-item">
				<view class="bt-icon-bg gray-bg">
					<svg class="s20 gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
					</svg>
				</view>
				<text class="bt-label-off">我的</text>
			</view>
		</view> -->

		<!-- Toast -->
		<view class="toast" :class="toastVisible?'toast-show':''">
			<text class="toast-text">{{ toastMsg }}</text>
		</view>
	</view>
</template>

<script>
	import { useAuth, DEPARTMENTS, ROLES } from '@/stores/auth.js'
	import { api } from '@/utils/api.js'
	const auth = useAuth()

	function fmtDateLabel(d, td) {
		if (!d) return ''
		if (d === td) return '今天'
		const yesterday = new Date()
		yesterday.setDate(yesterday.getDate() - 1)
		const yd = yesterday.toISOString().substring(0, 10)
		if (d === yd) return '昨天'
		return ''
	}

	const flowTypeConfig = {
		'income':   { typeKey: 'income',   typeName: '收入' },
		'expense':  { typeKey: 'expense',  typeName: '支出' },
		'transfer': { typeKey: 'transfer', typeName: '转账' },
		'live':     { typeKey: 'live',     typeName: '直播流水' },
	}

	function getFlowType(r) {
		if (r.flow_type && flowTypeConfig[r.flow_type]) {
			return flowTypeConfig[r.flow_type]
		}
		const isIncome = parseFloat(r.flow_amount) >= 0
		return isIncome ? flowTypeConfig['income'] : flowTypeConfig['expense']
	}

	function chineseMonth(d) {
		if (!d) return ''
		const m = String(d).substring(5)
		return m.replace('-', '月') + '日'
	}

	const quickData = [
		{ key: 'd7', label: '近7天' },
		{ key: 'd30', label: '近30天' },
		{ key: 'month', label: '本月' },
		{ key: 'lastMonth', label: '上月' },
		{ key: 'quarter', label: '本季度' }
	]

	export default {
		computed: {
			isStaff() {
				return auth.state.departmentId === DEPARTMENTS.OPERATION && auth.state.role === ROLES.EMPLOYEE
			}
		},
		data() {
			return {
				startDate: '',
				endDate: '',
				currentQuick: 'month',
				quickFilters: quickData,
				currentPerson: 'all',
				personList: [{ key: 'all', name: '' }],
				recordList: [],
				toastVisible: false,
				toastMsg: '',
				totalAmount: 0,
				monthTotal: 0,
				monthIncome: 0,
				monthExpense: 0,
				pendingFlowCount: 0,
				totalFlowCount: 0,
				loading: false
			}
		},
		onShow() {
			this.$checkAuth()
			// 员工模式：仅运营部员工可查看自己的台账
			if (this.isStaff) {
				this.fetchStaffStats()
				this.fetchStaffFlows()
				return
			}
			// 财务/总监模式
			if (auth.state.departmentId !== 2 && auth.state.departmentId !== 1) {
				uni.showToast({ title: '仅财务部/总经办可访问', icon: 'none' })
				setTimeout(() => { uni.redirectTo({ url: '/pages/oversight/oversight' }) }, 1500)
				return
			}
			this.fetchStats()
			this.fetchFlows()
			this.fetchPendingCount()
		},
		methods: {
			goBack() { this.$smartBack ? this.$smartBack() : uni.navigateBack() },
			goToFlowReview() {
				uni.navigateTo({ url: '/pages/flow-review/flow-review' })
			},
			goToFlowList() {
				uni.navigateTo({ url: '/pages/flow-list/flow-list' })
			},
			onStartDateChange(e) { this.startDate = e.detail.value; this.isStaff ? this.fetchStaffFlows() : this.fetchFlows() },
			onEndDateChange(e) { this.endDate = e.detail.value; this.isStaff ? this.fetchStaffFlows() : this.fetchFlows() },
			async fetchPendingCount() {
				try {
					const res = await api.get('/api/admin/operation/flow-reviews', { status: '1' }, { silent: true })
					if (res.code === 200) {
						this.pendingFlowCount = (res.data || []).length
					}
				} catch (e) { /* ignore */ }
			},
			async fetchStaffStats() {
				try {
					const res = await api.get('/api/admin/operation-staff/flow-ledger', {}, { silent: true })
					if (res.code === 200 && res.data && res.data.stats) {
						const s = res.data.stats
						this.totalAmount = Number(s.totalAmount) || 0
						this.monthTotal = Number(s.monthTotal) || 0
						this.monthIncome = Number(s.monthIncome) || 0
						this.monthExpense = Number(s.monthExpense) || 0
						this.personList = [{ key: 'all', name: '' }]
					}
				} catch (e) {
					console.error('员工流水统计失败:', e)
				}
			},
			async fetchStaffFlows() {
				this.loading = true
				try {
					const params = { page_size: 50 }
					if (this.startDate) params.start_date = this.startDate
					if (this.endDate) params.end_date = this.endDate

					const res = await api.get('/api/admin/operation-staff/flow-ledger', params, { silent: true })
					if (res.code === 200 && res.data) {
						this.totalFlowCount = res.data.total_count || 0
						const td = new Date().toISOString().substring(0, 10)
						this.recordList = (res.data.list || []).map(r => {
							const ft = getFlowType(r)
							return {
								_raw: r,
								date: chineseMonth(r.flow_date),
								dayLabel: fmtDateLabel(r.flow_date, td),
								typeKey: ft.typeKey,
								typeName: ft.typeName,
								title: r.remark || '流水记录',
								handler: auth.state.userName || '本人',
								amount: parseFloat(r.flow_amount) || 0,
								time: String(r.create_time || '').substring(11, 16) || ''
							}
						})
					}
				} catch (e) {
					console.error('员工流水记录失败:', e)
				} finally {
					this.loading = false
				}
			},
			async fetchStats() {
				try {
					const now = new Date()
					const month = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0')
					const res = await api.get('/api/admin/operation/ledger-stats', { month }, { silent: true })
					if (res.code === 200 && res.data) {
						this.totalAmount = Number(res.data.totalAmount) || 0
						this.monthTotal = Number(res.data.monthTotal) || 0
						this.monthIncome = Number(res.data.monthIncome) || 0
						this.monthExpense = Number(res.data.monthExpense) || 0
						this.personList = [
							{ key: 'all', name: '' },
							...(res.data.submitters || []).map(s => ({
								key: String(s.id), name: s.real_name
							}))
						]
					}
				} catch (e) {
					console.error('流水统计获取失败:', e)
				}
			},
			async fetchFlows() {
				this.loading = true
				try {
					const params = {}
					if (this.startDate) params.start_date = this.startDate
					if (this.endDate) params.end_date = this.endDate
					if (this.currentPerson !== 'all') params.user_id = this.currentPerson

					const res = await api.get('/api/admin/operation/flows', params, { silent: true })
					if (res.code === 200) {
						this.totalFlowCount = (res.data || []).length
						const td = new Date().toISOString().substring(0, 10)
						this.recordList = (res.data || []).map(r => {
							const ft = getFlowType(r)
							return {
								_raw: r,
								date: chineseMonth(r.flow_date),
								dayLabel: fmtDateLabel(r.flow_date, td),
								typeKey: ft.typeKey,
								typeName: ft.typeName,
								title: r.remark || '流水记录',
								handler: r.real_name || '未知',
								amount: parseFloat(r.flow_amount) || 0,
								time: String(r.create_time || '').substring(11, 16) || ''
							}
						})
					}
				} catch (e) {
					console.error('流水记录获取失败:', e)
				} finally {
					this.loading = false
				}
			},
			onQuickFilter(key) {
				const n = new Date()
				const fmt = d => d.toISOString().substring(0, 10)
				switch (key) {
					case 'd7':
						n.setDate(n.getDate() - 7)
						this.startDate = fmt(n)
						this.endDate = fmt(new Date())
						break
					case 'd30':
						n.setDate(n.getDate() - 30)
						this.startDate = fmt(n)
						this.endDate = fmt(new Date())
						break
					case 'month':
						this.startDate = n.getFullYear() + '-' + String(n.getMonth()+1).padStart(2,'0') + '-01'
						this.endDate = fmt(new Date())
						break
					case 'lastMonth':
						n.setMonth(n.getMonth() - 1)
						this.startDate = n.getFullYear() + '-' + String(n.getMonth()+1).padStart(2,'0') + '-01'
						this.endDate = n.getFullYear() + '-' + String(n.getMonth()+1).padStart(2,'0') + '-' + String(new Date(n.getFullYear(), n.getMonth()+1, 0).getDate()).padStart(2,'0')
						break
					case 'quarter':
						const qm = Math.floor(n.getMonth() / 3) * 3
						this.startDate = n.getFullYear() + '-' + String(qm+1).padStart(2,'0') + '-01'
						this.endDate = fmt(new Date())
						break
				}
				this.isStaff ? this.fetchStaffFlows() : this.fetchFlows()
			},
			goDetail(r) {
				const app = getApp()
				app.globalData.flowDetailData = r._raw
				uni.navigateTo({ url: '/pages/flow-detail/flow-detail' })
			},

			showToast(msg) {
				this.toastMsg = msg
				this.toastVisible = true
				clearTimeout(this._tt)
				this._tt = setTimeout(() => { this.toastVisible = false }, 2000)
			}
		}
	}
</script>

<style>
	/* Base */
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #F8F9FA;
		font-family: -apple-system, BlinkMacSystemFont, 'Noto Sans SC', sans-serif;
		-webkit-font-smoothing: antialiased;
		padding-bottom: 160rpx
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

	.white {
		color: #fff
	}

	.gray-400 {
		color: #ADB5BD
	}

	.gray-500 {
		color: #868E96
	}

	.gray-600 {
		color: #525252
	}

	.green {
		color: #2A9D5C
	}

	/* Header */
	.hdr {
		position: sticky;
		top: 0;
		z-index: 50;
		background: #fff;
		border-bottom: 1rpx solid #E9ECEF
	}

	.hdr-inner {
		display: flex;
		align-items: center;
		padding: 28rpx 36rpx 24rpx;
		gap: 16rpx
	}

	.hdr-icon-wrap {
		width: 72rpx;
		height: 72rpx;
		border-radius: 20rpx;
		background: linear-gradient(135deg, #4F6AF6, #3D58E3);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		box-shadow: 0 4rpx 12rpx rgba(79, 106, 246, 0.25);
	}

	.hdr-text-group {
		flex: 1;
		min-width: 0
	}

	.hdr-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #212529;
		display: block;
		line-height: 1.2
	}

	.hdr-sub {
		font-size: 20rpx;
		color: #868E96;
		margin-top: 4rpx;
		display: block
	}

	.hdr-right {
		display: flex;
		align-items: center;
		gap: 12rpx;
		flex-shrink: 0
	}

	.perspective-tag {
		font-size: 18rpx;
		font-weight: 600;
		color: #4F6AF6;
		background: #F0F4FF;
		padding: 6rpx 18rpx;
		border-radius: 12rpx;
	}

	.audit-flow-btn {
		display: flex;
		align-items: center;
		gap: 6rpx;
		background: linear-gradient(135deg, #6366f1, #4f46e5);
		color: #fff;
		font-size: 20rpx;
		font-weight: 600;
		padding: 10rpx 20rpx;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 12rpx rgba(99, 102, 241, 0.25);
		position: relative;
	}
	.audit-flow-btn:active { opacity: 0.85 }

	.audit-flow-badge {
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		min-width: 32rpx;
		height: 32rpx;
		line-height: 32rpx;
		text-align: center;
		background: #ef4444;
		color: #fff;
		font-size: 18rpx;
		font-weight: 700;
		border-radius: 50%;
		padding: 0 8rpx;
	}

	.notify-btn {
		width: 64rpx;
		height: 64rpx;
		border-radius: 18rpx;
		background: #F1F3F5;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.notify-btn:active {
		background: #DEE2E6
	}

	/* Main */
	.main {}

	/* Stats */
	.stats-section {
		padding: 24rpx 28rpx 16rpx
	}

	.stat-card {
		background: #fff;
		border-radius: 22rpx;
		padding: 28rpx 32rpx;
		margin-bottom: 18rpx;
		border: 1rpx solid #E9ECEF;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	}

	.sc-hd {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx
	}

	.sc-label {
		font-size: 24rpx;
		font-weight: 500;
		color: #868E96
	}

	.sc-badge-all,
	.sc-badge-month {
		font-size: 16rpx;
		font-weight: 600;
		letter-spacing: 0.05em;
		padding: 4rpx 14rpx;
		border-radius: 8rpx;
	}

	.sc-badge-all {
		background: #F8F9FA;
		color: #CED4DA
	}

	.sc-badge-month {
		background: #F0F4FF;
		color: #4F6AF6
	}

	.sc-amount-row {
		display: flex;
		align-items: baseline;
		gap: 4rpx;
		margin-bottom: 16rpx
	}

	.sc-yen {
		font-size: 26rpx;
		font-weight: 700;
		color: #495057
	}

	.sc-num {
		font-size: 48rpx;
		font-weight: 700;
		color: #212529;
		letter-spacing: -0.02em;
		line-height: 1
	}

	.sc-trend {
		display: flex;
		align-items: center;
		gap: 8rpx
	}

	.st-text-green {
		font-size: 20rpx;
		font-weight: 600;
		color: #2A9D5C
	}

	.st-text-gray {
		font-size: 18rpx;
		color: #ADB5BD
	}

	.sc-breakdown {
		display: flex;
		gap: 32rpx;
		margin-top: 16rpx
	}

	.bd-item {
		display: flex;
		align-items: center;
		gap: 10rpx
	}

	.bd-dot {
		width: 14rpx;
		height: 14rpx;
		border-radius: 50%;
		flex-shrink: 0
	}

	.bd-income {
		background: #E85D4E
	}

	.bd-expense {
		background: #2A9D5C
	}

	.bd-label {
		font-size: 20rpx;
		color: #868E96
	}

	.bd-value {
		font-size: 20rpx;
		font-weight: 600;
		color: #343A40
	}

	/* Date Filter Card */
	.filter-card {
		background: #fff;
		border-radius: 22rpx;
		padding: 24rpx 28rpx;
		margin: 0 28rpx 16rpx;
		border: 1rpx solid #E9ECEF;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	}

	.date-range-row {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 18rpx
	}

	.date-input {
		flex: 1;
		height: 80rpx;
		background: #F8F9FA;
		border: 1rpx solid #DEE2E6;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 24rpx;
	}

	.di-text {
		font-size: 24rpx;
		font-weight: 500;
		color: #343A40
	}

	.di-placeholder {
		font-size: 24rpx;
		color: #ADB5BD
	}

	.range-sep {
		font-size: 26rpx;
		color: #CED4DA;
		font-weight: 500
	}

	.quick-scroll {
		white-space: nowrap
	}

	.quick-row {
		display: inline-flex;
		gap: 14rpx
	}

	.quick-chip {
		height: 60rpx;
		line-height: 60rpx;
		padding: 0 28rpx;
		border-radius: 14rpx;
		font-size: 22rpx;
		font-weight: 500;
		flex-shrink: 0;
	}

	.qc-on {
		background: #4F6AF6;
		color: #fff;
		box-shadow: 0 2rpx 8rpx rgba(79, 106, 246, 0.3)
	}

	.qc-off {
		background: #F1F3F5;
		color: #525252
	}

	/* Person Filter */
	.person-filter-card {
		background: #fff;
		border-radius: 22rpx;
		padding: 24rpx 28rpx;
		margin: 0 28rpx 16rpx;
		border: 1rpx solid #E9ECEF;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	}

	.pf-hd {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 18rpx
	}

	.pf-title {
		font-size: 24rpx;
		font-weight: 600;
		color: #495057
	}

	.pf-hint {
		font-size: 20rpx;
		color: #ADB5BD
	}

	.person-scroll {
		white-space: nowrap
	}

	.person-row {
		display: inline-flex;
		gap: 14rpx
	}

	.person-chip {
		height: 68rpx;
		display: inline-flex;
		align-items: center;
		gap: 10rpx;
		padding: 0 24rpx;
		border-radius: 18rpx;
		font-size: 22rpx;
		font-weight: 500;
		flex-shrink: 0;
	}

	.pc-on {
		background: #4F6AF6;
		color: #fff;
		box-shadow: 0 2rpx 8rpx rgba(79, 106, 246, 0.3)
	}

	.pc-off {
		background: #F1F3F5;
		color: #525252
	}

	.pc-avatar {
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		background: #CED4DA;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18rpx;
		font-weight: 700;
		color: #fff;
		flex-shrink: 0;
	}

	.av-1 {
		background: #E85D4E
	}

	.av-2 {
		background: #4F6AF6
	}

	.av-3 {
		background: #2A9D5C
	}

	.av-4 {
		background: #F59E0B
	}

	/* List Section */
	.list-section {
		padding: 0 28rpx 16rpx
	}

	.list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 18rpx;
		padding: 0 4rpx
	}

	.lh-title {
		font-size: 28rpx;
		font-weight: 700;
		color: #212529
	}

	.lh-count {
		font-size: 20rpx;
		color: #ADB5BD
	}

	/* Record List */
	.record-list {
		background: #fff;
		border-radius: 22rpx;
		overflow: hidden;
		border: 1rpx solid #E9ECEF
	}

	.card-shadow {
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04)
	}

	.record-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 28rpx 32rpx;
	}

	.record-item:active {
		background: #F8F9FA
	}

	.record-item+.record-item {
		border-top: 1rpx solid #F1F3F5
	}

	.ri-left {
		flex: 1;
		min-width: 0;
		margin-right: 20rpx
	}

	.ri-meta-row {
		display: flex;
		align-items: center;
		gap: 10rpx;
		margin-bottom: 10rpx;
		flex-wrap: wrap
	}

	.ri-date {
		font-size: 22rpx;
		color: #ADB5BD;
		font-weight: 500
	}

	.ri-day-tag {
		font-size: 18rpx;
		color: #CED4DA;
		font-weight: 500;
		background: #F8F9FA;
		padding: 2rpx 12rpx;
		border-radius: 8rpx;
	}

	.ri-type-tag {
		font-size: 18rpx;
		font-weight: 500;
		padding: 4rpx 14rpx;
		border-radius: 8rpx;
	}

	.rt-income {
		background: rgba(232, 93, 78, 0.08);
		color: #E85D4E
	}

	.rt-expense {
		background: rgba(42, 157, 92, 0.08);
		color: #2A9D5C
	}

	.rt-transfer {
		background: rgba(79, 106, 246, 0.08);
		color: #4F6AF6
	}

	.rt-live {
		background: rgba(139, 92, 246, 0.08);
		color: #8B5CF6
	}

	.ri-title {
		font-size: 26rpx;
		font-weight: 500;
		color: #343A40;
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap
	}

	.ri-handler {
		font-size: 20rpx;
		color: #ADB5BD;
		margin-top: 6rpx;
		display: block
	}

	.ri-right {
		flex-shrink: 0;
		text-align: right
	}

	.ri-amount {
		font-size: 28rpx;
		font-weight: 700;
		display: block
	}

	.amt-income {
		color: #E85D4E
	}

	.amt-expense {
		color: #2A9D5C
	}

	.ri-time {
		font-size: 18rpx;
		color: #CED4DA;
		margin-top: 6rpx;
		display: block
	}

	/* Load More */
	.load-more-btn {
		margin-top: 28rpx;
		height: 80rpx;
		background: #fff;
		border: 1rpx solid #DEE2E6;
		border-radius: 18rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		font-weight: 500;
		color: #525252;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
	}

	.load-more-btn:active {
		background: #F8F9FA;
		border-color: #CED4DA
	}

	.bottom-spacer {
		height: 32rpx
	}

	/* Bottom Tab */
	.bottom-tab {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #fff;
		border-top: 1rpx solid #E9ECEF;
		display: flex;
		justify-content: space-around;
		padding: 12rpx 0;
		z-index: 60;
		padding-bottom: env(safe-area-inset-bottom, 0);
	}

	.bt-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6rpx;
		padding: 8rpx 32rpx
	}

	.bt-icon-bg {
		width: 72rpx;
		height: 72rpx;
		border-radius: 18rpx;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.brand-bg {
		background: linear-gradient(135deg, #4F6AF6, #3D58E3);
		box-shadow: 0 2rpx 8rpx rgba(79, 106, 246, 0.25)
	}

	.gray-bg {
		background: #F1F3F5
	}

	.bt-label-on {
		font-size: 18rpx;
		font-weight: 600;
		color: #4F6AF6
	}

	.bt-label-off {
		font-size: 18rpx;
		font-weight: 500;
		color: #CED4DA
	}

	.gray-500 {
		color: #868E96
	}

	/* Toast */
	.toast {
		position: fixed;
		top: 160rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 200;
		background: rgba(33, 37, 41, 0.92);
		backdrop-filter: blur(8px);
		padding: 18rpx 40rpx;
		border-radius: 9999rpx;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.toast-show {
		opacity: 1
	}

	.toast-text {
		color: #fff;
		font-size: 22rpx;
		font-weight: 500
	}
</style>