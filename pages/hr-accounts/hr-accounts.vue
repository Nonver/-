<template>
	<view class="pg">
		<!-- 顶栏 -->
		<view class="topbar">
			<view class="topbar-inner">
				<view class="tbl">
					<view class="back-btn" @tap="goBack">
						<svg class="s14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<polyline points="15 18 9 12 15 6" />
						</svg>
					</view>
					<view>
						<text class="t16 fw6">全员账号审核</text>
						<text v-if="accounts.length > 0" class="t12 mu">{{ totalCount }} 条记录</text>
					</view>
				</view>
			</view>
		</view>

		<view class="main">

			<!-- 部门筛选 tabs -->
			<view class="dept-tabs-wrap">
				<scroll-view scroll-x class="dept-tabs" :show-scrollbar="false">
					<view class="dept-tabs-inner">
						<view
							v-for="dt in deptTabs"
							:key="dt.value"
							class="dt-tab"
							:class="{'dt-tab-on': currentDept === dt.value}"
							@tap="switchDept(dt.value)"
						>{{ dt.label }}</view>
					</view>
				</scroll-view>
			</view>

			<!-- 账号列表 -->
			<view v-if="accounts.length > 0" class="list-card">
				<view v-for="(it, idx) in accounts" :key="it.id">
					<view v-if="idx > 0" class="dv"></view>
					<view class="lr">
						<view class="ava" :style="{ background: it.avaBg }"></view>
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

			<!-- 空状态 -->
			<view v-else-if="!loading" class="empty-state">
				<view class="empty-icon-wrap">
					<svg class="s32 slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
						<circle cx="9" cy="7" r="4"/>
						<path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
					</svg>
				</view>
				<text class="empty-text">暂无账户数据</text>
			</view>

			<!-- 分页 -->
			<view v-if="totalPages > 1" class="pagination">
				<view class="p-btn" :class="{ 'p-disabled': page === 1 }" @tap="goPage(page - 1)">
					<text class="p-arrow">‹</text>
					<text>上一页</text>
				</view>
				<text class="p-info">{{ page }} / {{ totalPages }}</text>
				<view class="p-btn" :class="{ 'p-disabled': page >= totalPages }" @tap="goPage(page + 1)">
					<text>下一页</text>
					<text class="p-arrow">›</text>
				</view>
			</view>

		</view>

		<view class="safe-btm"></view>

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

	// 部门配色映射
	const DEPT_COLORS = {
		'销售部': { deptCls: 'dt-blue', avaBg: '#dbeafe' },
		'技术部': { deptCls: 'dt-indigo', avaBg: '#e0e7ff' },
		'市场部': { deptCls: 'dt-pink', avaBg: '#fce7f3' },
		'运营部': { deptCls: 'dt-green', avaBg: '#f1f5f9' },
		'主播部': { deptCls: 'dt-blue', avaBg: '#fff7ed' },
		'经纪部': { deptCls: 'dt-indigo', avaBg: '#f5f3ff' },
		'中转部': { deptCls: 'dt-green', avaBg: '#ecfdf5' },
		'人事部': { deptCls: 'dt-pink', avaBg: '#fdf2f8' },
	}
	const PERSON_AVATARS = ['#dbeafe', '#fce7f3', '#f1f5f9', '#e0e7ff', '#f0fdf4', '#fef2f2', '#eff6ff', '#fffbeb', '#f5f3ff', '#ecfdf5']
	const PAGE_SIZE = 10

	/** 状态映射（支持数字状态 1=待审核,2=已激活,3=待劝退,4=已劝退） */
	function mapStatus(s) {
		const num = Number(s)
		const numMap = {
			1: { status:'待审核', statusCls:'st-a', sdCls:'sda' },
			2: { status:'已激活', statusCls:'st-g', sdCls:'sdg' },
			3: { status:'待劝退', statusCls:'st-r', sdCls:'sdr' },
			4: { status:'已劝退', statusCls:'st-r', sdCls:'sdr' },
			5: { status:'已拒绝', statusCls:'st-d', sdCls:'sdd' },
		}
		if (numMap[num]) return numMap[num]

		const strMap = {
			'pending':   { status: '待审核', statusCls: 'st-a', sdCls: 'sda' },
			'active':    { status: '已激活', statusCls: 'st-g', sdCls: 'sdg' },
			'dismiss':   { status: '待劝退', statusCls: 'st-r', sdCls: 'sdr' },
			'dismissed': { status: '已劝退', statusCls: 'st-r', sdCls: 'sdr' },
		}
		const key = (s || '').toLowerCase()
		return strMap[key] || { status: s || '待审核', statusCls: 'st-a', sdCls: 'sda' }
	}

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
		return d.getMonth() + 1 + '/' + d.getDate()
	}

	function mapAccount(r, idx) {
		const deptName = r.dept_name || r.dept || ''
		const colors = DEPT_COLORS[deptName] || { deptCls: 'dt-blue', avaBg: PERSON_AVATARS[idx % PERSON_AVATARS.length] }
		const st = mapStatus(r.account_status)
		return {
			id: r.id || idx,
			avaBg: colors.avaBg || PERSON_AVATARS[idx % PERSON_AVATARS.length],
			name: r.name || r.real_name || '',
			dept: deptName,
			deptCls: colors.deptCls || 'dt-blue',
			code: r.code || r.username || r.employee_no || '',
			status: st.status,
			statusCls: st.statusCls,
			sdCls: st.sdCls,
			time: fmtRelative(r.submit_time || r.update_time || r.create_time),
		}
	}

	export default {
		data() {
			return {
				currentDept: 'all',
				deptTabs: [{ label: '全部', value: 'all' }],
				accounts: [],
				page: 1,
				totalCount: 0,
				totalPages: 1,
				loading: false,

				/* 审核状态弹窗 */
				modalVisible: false,
				editingAccount: {},
				selectedStatus: 1,
				submitting: false,
			}
		},
		onShow() {
			this.$checkAuth()
			this.fetchDeptTabs()
			this.fetchAccounts()
		},
		methods: {
			/* 获取部门列表生成 tabs */
			async fetchDeptTabs() {
				try {
					const res = await api.get('/api/admin/hr/departments', null, { silent: true })
					if (res.code === 200 && res.data) {
						const depts = res.data || []
						const tabs = [{ label: '全部', value: 'all' }]
						depts.forEach(d => {
							tabs.push({ label: d.dept_name || d.name, value: d.id })
						})
						this.deptTabs = tabs
					}
				} catch (e) {
					console.error('[账号审核] 部门列表获取失败:', e)
				}
			},

			/* 获取账号列表 */
			async fetchAccounts() {
				this.loading = true
				try {
					const params = { account_status: 1, page: this.page, per_page: PAGE_SIZE }
					if (this.currentDept !== 'all') {
						params.dept_id = this.currentDept
					}
					const res = await api.get('/api/admin/hr/accounts', params, { silent: true })
					if (res.code === 200 && res.data) {
						const list = res.data.list || res.data || []
						this.accounts = (Array.isArray(list) ? list : []).map(mapAccount)
						this.totalCount = res.data.total || list.length
						this.totalPages = Math.ceil(this.totalCount / PAGE_SIZE) || 1
					}
				} catch (e) {
					console.error('[账号审核] 账号列表获取失败:', e)
				} finally {
					this.loading = false
				}
			},

			/* 切换部门 */
			switchDept(val) {
				if (val === this.currentDept) return
				this.currentDept = val
				this.page = 1
				this.fetchAccounts()
			},

			/* 翻页 */
			goPage(p) {
				if (p < 1 || p > this.totalPages) return
				this.page = p
				this.fetchAccounts()
			},

			/* 返回 */
			goBack() {
				uni.navigateBack()
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
						const idx = this.accounts.findIndex(a => a.id === this.editingAccount.id)
						if (idx >= 0) this.accounts.splice(idx, 1)
						this.totalCount = Math.max(0, this.totalCount - 1)
						this.totalPages = Math.ceil(this.totalCount / PAGE_SIZE) || 1
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
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased;
	}
	.main { padding: 0 32rpx 200rpx; }

	.t10 { font-size: 20rpx }
	.t12 { font-size: 24rpx; margin-left: 30rpx; }
	.t14 { font-size: 28rpx }
	.t16 { font-size: 32rpx }
	.fw5 { font-weight: 500 }
	.fw6 { font-weight: 600 }
	.mu { color: #94A3B8; margin-left: 10rpx; }

	.s14 { width: 28rpx; height: 28rpx; flex-shrink: 0 }
	.s32 { width: 64rpx; height: 64rpx; flex-shrink: 0 }
	.slate-300 { color: #CBD5E1 }

	/* 顶栏 */
	.topbar {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(255, 255, 255, .8);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1rpx solid rgba(226, 232, 240, .6);
	}
	.topbar-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 24rpx 32rpx;
	}
	.tbl {
		display: flex;
		align-items: center;
		gap: 24rpx;
	}
	.back-btn {
		width: 72rpx;
		height: 72rpx;
		border-radius: 24rpx;
		background: #F8FAFC;
		border: 1rpx solid #f1f5f9;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 部门 tabs */
	.dept-tabs-wrap {
		margin-top: 24rpx;
		margin-bottom: 24rpx;
	}
	.dept-tabs {
		white-space: nowrap;
	}
	.dept-tabs-inner {
		display: inline-flex;
		gap: 16rpx;
	}
	.dt-tab {
		display: inline-flex;
		padding: 16rpx 32rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		color: #64748B;
		background: #fff;
		border: 1rpx solid rgba(226, 232, 240, .8);
		white-space: nowrap;
		font-weight: 500;
	}
	.dt-tab-on {
		color: #fff;
		background: #0F172A;
		border-color: #0F172A;
	}

	/* 列表 */
	.list-card {
		background: #fff;
		border: 1rpx solid rgba(226, 232, 240, .8);
		border-radius: 32rpx;
		overflow: hidden;
	}
	.lr {
		display: flex;
		align-items: center;
		padding: 32rpx;
		gap: 24rpx;
	}
	.lr-main { flex: 1; min-width: 0 }
	.lr-hd { display: flex; align-items: center; gap: 16rpx; margin-bottom: 4rpx }
	.lr-title { font-size: 28rpx; font-weight: 600; color: #0F172A }
	.lr-sub { font-size: 24rpx; color: #94A3B8 }
	.lr-r { text-align: center; }
	.lr-time { font-size: 20rpx; color: #d97706; font-weight: 500; display: block; margin-top: 8rpx }
	.ava { width: 88rpx; height: 88rpx; border-radius: 24rpx; flex-shrink: 0 }
	.dv { height: 1rpx; background: #f1f5f9; margin: 0 32rpx }

	/* 状态标签 */
	.status {
		display: inline-flex;
		align-items: center;
		gap: 8rpx;
		padding: 6rpx 35rpx;
		border-radius: 9999rpx;
		font-size: 24rpx;
		font-weight: 500;
		white-space: nowrap;
	}
	.st-a { background: #FEF3C7; color: #92400E }
	.st-g { background: #D1FAE5; color: #065F46 }
	.st-r { background: #FEE2E2; color: #991B1B }
	.sd { width: 12rpx; height: 12rpx; border-radius: 50% }
	.sda { background: #d97706 }
	.sdg { background: #10b981 }
	.sdr { background: #ef4444 }

	/* 部门标签 */
	.dept-tag {
		display: inline-flex;
		padding: 4rpx 16rpx;
		border-radius: 12rpx;
		font-size: 22rpx;
		font-weight: 600;
		white-space: nowrap;
	}
	.dt-blue { background: #DBEAFE; color: #1E40AF }
	.dt-indigo { background: #E0E7FF; color: #3730A3 }
	.dt-pink { background: #FCE7F3; color: #9D174D }
	.dt-green { background: #D1FAE5; color: #065F46 }

	/* 空状态 */
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
	.empty-text { font-size: 26rpx; color: #94A3B8 }

	/* 分页 */
	.pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 32rpx;
	}
	.p-btn {
		display: flex;
		align-items: center;
		gap: 8rpx;
		padding: 16rpx 32rpx;
		background: #fff;
		border: 1rpx solid rgba(226, 232, 240, .8);
		border-radius: 20rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #0F172A;
	}
	.p-arrow { font-size: 36rpx; line-height: 1; }
	.p-disabled { opacity: 0.35; pointer-events: none }
	.p-info { font-size: 24rpx; color: #94A3B8; font-weight: 500 }

	.safe-btm { height: env(safe-area-inset-bottom, 0px) }

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
