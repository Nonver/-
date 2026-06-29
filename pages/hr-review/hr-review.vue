<template>
	<!-- <view class="pg"> -->

	<!-- ═══════════ Old Header ═══════════ -->
	<view class="hdr">
		<view class="hdr-inner">
			<view class="hdr-back" @tap="goBack"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"
					stroke="#64748b" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg></view>
			<view class="hdr-inner">
				<view class="hdr-l">
					<view class="hdr-icon">
						<svg class="s20 white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
						</svg>
					</view>
					<view>
						<text class="hdr-title">账号准入终审</text>
						<text class="hdr-sub">人事专员 · 全员账号审核</text>
					</view>

				</view>

			</view>
			<view class="bell-wrap">
				<svg class="s24 slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
					<path stroke-linecap="round" stroke-linejoin="round"
						d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
				</svg>
				<view class="bell-dot">3</view>
			</view>
		</view>

		<!-- ═══════════ Main ═══════════ -->
		<view class="main">

			<!-- Stats -->
			<view class="stats">
				<view class="stat-card">
					<text class="stat-num warning">{{ stats.pendingCount }}</text>
					<text class="stat-label">待审核</text>
				</view>
				<view class="stat-card">
					<text class="stat-num success">{{ stats.activeCount }}</text>
					<text class="stat-label">已激活</text>
				</view>
				<view class="stat-card">
					<text class="stat-num danger">{{ stats.rejectedCount }}</text>
					<text class="stat-label">已驳回</text>
				</view>
			</view>

			<!-- Tab -->
			<view class="tab-wrap">
				<view class="tab-inner">
					<view class="tab-indicator" :style="indicatorStyle"></view>
					<view class="tab" :class="currentTab==='pending'?'tab-on':'tab-off'" @tap="switchTab('pending')">
						<text>待审核</text>
						<view class="tab-badge warning">{{ pendingList.length }}</view>
					</view>
					<view class="tab" :class="currentTab==='active'?'tab-on':'tab-off'" @tap="switchTab('active')">
						<text>已激活</text>
						<view class="tab-badge slate">{{ activeList.length }}</view>
					</view>
					<view class="tab" :class="currentTab==='rejected'?'tab-on':'tab-off'" @tap="switchTab('rejected')">
						<text>已驳回</text>
						<view class="tab-badge slate">{{ rejectedList.length }}</view>
					</view>
				</view>
			</view>

			<!-- ═══════ List ═══════ -->
			<view v-if="currentTab==='pending'">
				<view class="list-hd">
					<text class="list-hd-title">待审核账号</text>
					<text class="list-hd-count">共 {{ pendingList.length }} 条</text>
				</view>

				<view v-for="(item, idx) in pendingList" :key="item.id" class="card card-anim"
					:style="'animation-delay:'+(idx*0.05)+'s'">
					<view class="card-body">
						<!-- Top -->
						<view class="card-top">
							<view class="card-user">
								<view class="avatar">
									<text class="avatar-text">{{ item.name.charAt(0) }}</text>
								</view>
								<view>
									<text class="card-name">{{ item.name }}</text>
									<text class="card-emp">工号: {{ item.employeeId }}</text>
								</view>
							</view>
							<view class="status-tag tag-amber">
								<view class="status-dot dot-amber pulse"></view>
								<text>待审核</text>
							</view>
						</view>

						<!-- Divider -->
						<view class="divider"></view>

						<!-- Fields -->
						<view class="fields">
							<view class="field-row">
								<text class="field-label">所属部门</text>
								<text class="field-val-bold">{{ item.department }}</text>
							</view>
							<view class="field-row">
								<text class="field-label">申请角色</text>
								<text class="field-val-bold">{{ item.role }}</text>
							</view>
							<view class="field-row">
								<text class="field-label">提交时间</text>
								<text class="field-val-mid">{{ item.submitTime }}</text>
							</view>
							<view class="field-row">
								<text class="field-label">账号类型</text>
								<text class="field-val-tag">{{ item.accountType }}</text>
							</view>
						</view>
					</view>

					<!-- Actions -->
					<view class="card-actions">
						<view class="action-btn action-approve" @tap="handleApprove(item)">
							<svg class="s16 white" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								stroke-width="2.2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<text>审核通过</text>
						</view>
						<view class="action-btn action-reject" @tap="handleReject(item)">
							<svg class="s16 danger" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								stroke-width="2.2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
							<text class="danger">驳回申请</text>
						</view>
					</view>
				</view>
			</view>

			<!-- ═══════ Active ═══════ -->
			<view v-if="currentTab==='active'">
				<view class="list-hd">
					<text class="list-hd-title">已激活账号</text>
					<text class="list-hd-count">共 {{ activeList.length }} 条</text>
				</view>

				<view v-for="item in activeList" :key="item.id" class="card card-blur">
					<view class="card-body">
						<view class="card-top">
							<view class="card-user">
								<view class="avatar avatar-dim">
									<text class="avatar-text-dim">{{ item.name.charAt(0) }}</text>
								</view>
								<view>
									<text class="card-name">{{ item.name }}</text>
									<text class="card-emp">工号: {{ item.employeeId }}</text>
								</view>
							</view>
							<view class="status-tag tag-emerald">
								<view class="status-dot dot-emerald"></view>
								<text>已激活</text>
							</view>
						</view>

						<view class="divider"></view>

						<view class="fields">
							<view class="field-row">
								<text class="field-label">所属部门</text>
								<text class="field-val-bold">{{ item.department }}</text>
							</view>
							<view class="field-row">
								<text class="field-label">角色</text>
								<text class="field-val-bold">{{ item.role }}</text>
							</view>
							<view class="field-row">
								<text class="field-label">激活时间</text>
								<text class="field-val-mid">{{ item.activateTime }}</text>
							</view>
							<view class="field-row">
								<text class="field-label">最后登录</text>
								<text class="field-val-mid">{{ item.lastLogin }}</text>
							</view>
						</view>
					</view>

					<view class="card-actions">
						<view class="action-disabled">
							<text>账号正常运行中</text>
						</view>
					</view>
				</view>

				<view class="list-footer">
					<text>— 共 {{ activeList.length }} 条已激活记录 —</text>
				</view>
			</view>

			<!-- ═══════ Rejected ═══════ -->
			<view v-if="currentTab==='rejected'">
				<view class="list-hd">
					<text class="list-hd-title">已驳回账号</text>
					<text class="list-hd-count">共 {{ rejectedList.length }} 条</text>
				</view>

				<view v-for="item in rejectedList" :key="item.id" class="card">
					<view class="card-body">
						<view class="card-top">
							<view class="card-user">
								<view class="avatar avatar-dim">
									<text class="avatar-text-dim">{{ item.name.charAt(0) }}</text>
								</view>
								<view>
									<text class="card-name">{{ item.name }}</text>
									<text class="card-emp">工号: {{ item.employeeId }}</text>
								</view>
							</view>
							<view class="status-tag tag-rose">
								<view class="status-dot dot-rose"></view>
								<text>已驳回</text>
							</view>
						</view>

						<view class="divider"></view>

						<view class="fields">
							<view class="field-row">
								<text class="field-label">所属部门</text>
								<text class="field-val-bold">{{ item.department }}</text>
							</view>
							<view class="field-row">
								<text class="field-label">申请角色</text>
								<text class="field-val-bold">{{ item.role }}</text>
							</view>
							<view class="field-row">
								<text class="field-label">提交时间</text>
								<text class="field-val-mid">{{ item.submitTime }}</text>
							</view>
							<view class="field-row">
								<text class="field-label">驳回时间</text>
								<text class="field-val-mid">{{ item.rejectTime }}</text>
							</view>
						</view>
					</view>

					<view class="card-actions">
						<view class="reject-reason">
							<view class="reject-reason-icon">
								<svg class="s14 danger" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
							</view>
							<view class="reject-reason-body">
								<text class="reject-reason-title">驳回原因</text>
								<text class="reject-reason-text">{{ item.reason }}</text>
							</view>
						</view>
					</view>
				</view>

				<view class="list-footer">
					<text>— 共 {{ rejectedList.length }} 条已驳回记录 —</text>
				</view>
			</view>


		</view>

		<!-- ═══════ 驳回弹窗 ═══════ -->
		<view class="modal-overlay" v-if="showRejectModal" @tap="closeRejectModal">
			<view class="modal-sheet" @tap.stop>
				<view class="ms-hd">
					<text class="ms-title">填写驳回原因</text>
				</view>
				<view class="ms-body">
					<text class="ms-label">驳回原因</text>
					<textarea class="ms-textarea" v-model="rejectReason" placeholder="请输入驳回原因..."/>
					<view class="ms-actions">
						<view class="ms-btn ms-btn-cancel" @tap="closeRejectModal">取消</view>
						<view class="ms-btn ms-btn-danger" @tap="confirmReject">确认驳回</view>
					</view>
				</view>
			</view>
		</view>

		<!-- ═══════ Toast ═══════ -->
		<view class="toast" :class="toastVisible ? 'toast-show' : ''">
			<view class="toast-icon" :class="toastType==='approve'?'toast-icon-success':'toast-icon-danger'">
				<svg class="s12" :class="toastType==='approve'?'success':'danger'" fill="none" stroke="currentColor"
					viewBox="0 0 24 24" stroke-width="2.5">
					<path v-if="toastType==='approve'" stroke-linecap="round" stroke-linejoin="round"
						d="M5 13l4 4L19 7" />
					<path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</view>
			<text class="toast-text">{{ toastMsg }}</text>
		</view>
	</view>
</template>

<script>
	const ROLE_MAP = { 1: '总经办/总监', 2: '主管', 3: '普通员工' }
	function roleLabel(lv) { return ROLE_MAP[lv] || '普通员工' }

	/** API账号 → UI格式 */
	function mapAccount(r) {
		return {
			id: r.id,
			name: r.real_name || r.username || '',
			employeeId: r.code || '',
			department: r.dept_name || '',
			role: roleLabel(r.role_level),
			submitTime: r.create_time || '',
			accountType: '企业邮箱账号',
			activateTime: r.update_time || '',
			lastLogin: r.last_login_time || '',
			rejectTime: r.update_time || '',
			reason: r.remark || ''
		}
	}

	import { api } from '@/utils/api.js'

	export default {
		data() {
			return {
				currentTab: 'pending',
				pendingList: [],
				activeList: [],
				rejectedList: [],
				stats: { pendingCount: 0, activeCount: 0, rejectedCount: 0 },
				loading: false,
				showRejectModal: false,
				rejectReason: '',
				currentRejectItem: null,
				submitting: false,
				toastVisible: false,
				toastMsg: '',
				toastType: 'approve'
			}
		},

		computed: {
			indicatorStyle() {
				const pos = { pending: 'translateX(0)', active: 'translateX(100%)', rejected: 'translateX(200%)' }
				return `transform: ${pos[this.currentTab] || 'translateX(0)'}`
			}
		},

		onShow() {
			this.$checkAuth()
			this.fetchData()
		},

		methods: {
			goBack() { uni.navigateTo({ url: '/pages/hr/hr' }) },

			switchTab(tab) {
				this.currentTab = tab
			},

			async fetchData() {
				this.loading = true
				try {
					await Promise.all([
						this.fetchPending(),
						this.fetchActive(),
						this.fetchRejected(),
						this.fetchStats()
					])
				} finally {
					this.loading = false
				}
			},

			async fetchStats() {
				try {
					const res = await api.get('/api/admin/hr/overview', null, { silent: true })
					if (res.code === 200 && res.data) {
						this.stats = {
							pendingCount: res.data.pendingCount ?? 0,
							activeCount: res.data.activeCount ?? 0,
							rejectedCount: res.data.rejectedCount ?? 0
						}
					}
				} catch (e) { console.error(e) }
			},

			async fetchPending() {
				try {
					const res = await api.get('/api/admin/hr/accounts', { account_status: 1, per_page: 100 }, { silent: true })
					if (res.code === 200) {
						const list = res.data.list || []
						this.pendingList = list.map(mapAccount)
					}
				} catch (e) { console.error(e) }
			},

			async fetchActive() {
				try {
					const res = await api.get('/api/admin/hr/accounts', { account_status: 2, per_page: 100 }, { silent: true })
					if (res.code === 200) {
						const list = res.data.list || []
						this.activeList = list.map(mapAccount)
					}
				} catch (e) { console.error(e) }
			},

			async fetchRejected() {
				try {
					const res = await api.get('/api/admin/hr/accounts', { account_status: 5, per_page: 100 }, { silent: true })
					if (res.code === 200) {
						const list = res.data.list || []
						this.rejectedList = list.map(mapAccount)
					}
				} catch (e) { console.error(e) }
			},

			async handleApprove(item) {
				if (this.submitting) return
				this.submitting = true
				try {
					const res = await api.put('/api/admin/hr/accounts/' + item.id, { account_status: 2 })
					if (res.code === 200) {
						this.showToast('approve', '已通过 ' + item.name + ' 的账号申请')
						this.removeCard(item.id, 'pendingList')
						this.fetchStats()
					}
				} catch (e) { console.error(e) } finally { this.submitting = false }
			},

			handleReject(item) {
				this.currentRejectItem = item
				this.rejectReason = ''
				this.showRejectModal = true
			},

			closeRejectModal() {
				this.showRejectModal = false
				this.currentRejectItem = null
				this.rejectReason = ''
			},

			async confirmReject() {
				if (this.submitting) return
				this.submitting = true
				try {
					const res = await api.put('/api/admin/hr/accounts/' + this.currentRejectItem.id, {
						account_status: 5,
						remark: this.rejectReason
					})
					if (res.code === 200) {
						this.showToast('reject', '已驳回 ' + this.currentRejectItem.name + ' 的账号申请')
						this.removeCard(this.currentRejectItem.id, 'pendingList')
						this.fetchStats()
						this.closeRejectModal()
					}
				} catch (e) { console.error(e) } finally { this.submitting = false }
			},

			removeCard(id, listKey) {
				const idx = this[listKey].findIndex(i => i.id === id)
				if (idx >= 0) this[listKey].splice(idx, 1)
			},

			showToast(type, msg) {
				this.toastType = type
				this.toastMsg = msg
				this.toastVisible = true
				setTimeout(() => { this.toastVisible = false }, 2500)
			}
		}
	}
</script>

<style>
	/* ═══════════ Base ═══════════ */
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #F7F8FA;
		font-family: -apple-system, BlinkMacSystemFont, 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased;
		position: relative;
	}

	/* ═══════════ Utility ═══════════ */
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

	.s24 {
		width: 48rpx;
		height: 48rpx;
		flex-shrink: 0
	}

	.slate-500 {
		color: #6B7280
	}

	.white {
		color: #fff
	}

	.success {
		color: #22C55E
	}

	.danger {
		color: #EF4444
	}

	.warning {
		color: #F59E0B
	}

	/* ═══════════ Header ═══════════ */
	.hdr-back {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		flex-shrink: 0;
		margin-right: 8rpx
	}

	.hdr-back:active {
		background: rgba(0, 0, 0, .06)
	}

	.hdr {
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1rpx solid #DADDE3;
		padding: 0 40rpx;
		/* padding-top: 88rpx; */
		position: sticky;
		top: 0;
		z-index: 50;
	}

	.hdr-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
	}

	.hdr-l {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	.hdr-icon {
		width: 52rpx;
		height: 52rpx;
		border-radius: 16rpx;
		background: #0EA5E9;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 16rpx rgba(14, 165, 233, 0.25);
	}

	.hdr-title {
		font-size: 28rpx;
		font-weight: 700;
		color: #111827;
		display: block;
	}

	.hdr-sub {
		font-size: 20rpx;
		color: #8A93A3;
		font-weight: 500;
		margin-top: 2rpx;
		display: block;
	}

	/* Bell */
	.bell-wrap {
		position: relative;
	}

	.bell-dot {
		position: absolute;
		top: -6rpx;
		right: -6rpx;
		width: 20rpx;
		height: 20rpx;
		background: #EF4444;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14rpx;
		font-weight: 700;
		color: #fff;
		box-shadow: 0 2rpx 6rpx rgba(239, 68, 68, 0.3);
	}

	/* ═══════════ Main ═══════════ */
	.main {
		padding: 32rpx 32rpx 160rpx;
	}

	/* ═══════════ Stats ═══════════ */
	.stats {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 12rpx;
		margin-bottom: 32rpx;
	}

	.stat-card {
		background: #fff;
		border-radius: 24rpx;
		padding: 32rpx 16rpx;
		text-align: center;
		border: 1rpx solid rgba(218, 221, 227, 0.6);
		box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.04);
	}

	.stat-num {
		font-size: 44rpx;
		font-weight: 700;
		line-height: 1;
		display: block;
	}

	.stat-label {
		font-size: 20rpx;
		color: #8A93A3;
		font-weight: 500;
		margin-top: 8rpx;
		display: block;
	}

	/* ═══════════ Tab ═══════════ */
	.tab-wrap {
		margin-bottom: 24rpx;
	}

	.tab-inner {
		background: #fff;
		border-radius: 24rpx;
		padding: 6rpx;
		border: 1rpx solid rgba(218, 221, 227, 0.6);
		box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.03);
		display: flex;
		position: relative;
	}

	.tab-indicator {
		position: absolute;
		top: 6rpx;
		bottom: 6rpx;
		left: 6rpx;
		width: calc(33.333% - 8rpx);
		background: #F0F9FF;
		border-radius: 16rpx;
		transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.tab {
		flex: 1;
		padding: 12rpx 0;
		text-align: center;
		font-size: 24rpx;
		font-weight: 500;
		border-radius: 16rpx;
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8rpx;
		transition: color 0.2s;
	}

	.tab-on {
		color: #0EA5E9;
		font-weight: 600
	}

	.tab-off {
		color: #8A93A3
	}

	.tab-badge {
		font-size: 16rpx;
		font-weight: 700;
		padding: 2rpx 12rpx;
		border-radius: 9999rpx;
		line-height: 1.4;
	}

	.tab-badge.warning {
		background: #FEF3C7;
		color: #D97706
	}

	.tab-badge.slate {
		background: #EDEFF2;
		color: #6B7280
	}

	/* ═══════════ List Header ═══════════ */
	.list-hd {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8rpx 4rpx 16rpx;
	}

	.list-hd-title {
		font-size: 24rpx;
		font-weight: 600;
		color: #374151;
	}

	.list-hd-count {
		font-size: 20rpx;
		color: #8A93A3;
	}

	/* ═══════════ Card ═══════════ */
	.card {
		background: #fff;
		border-radius: 24rpx;
		border: 1rpx solid rgba(218, 221, 227, 0.7);
		box-shadow: 0 4rpx 32rpx rgba(0, 0, 0, 0.05);
		overflow: hidden;
		margin-bottom: 24rpx;
		transition: all 0.3s ease;
	}

	.card-anim {
		animation: cardUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		opacity: 0;
		transform: translateY(16rpx);
	}

	@keyframes cardUp {
		to {
			opacity: 1;
			transform: translateY(0)
		}
	}

	.card-blur {
		opacity: 0.85
	}

	.card-body {
		padding: 32rpx
	}

	/* Top */
	.card-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 24rpx;
	}

	.card-user {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	/* Avatar */
	.avatar {
		width: 72rpx;
		height: 72rpx;
		border-radius: 20rpx;
		background: linear-gradient(135deg, #0EA5E9, #38BDF8);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		box-shadow: 0 2rpx 8rpx rgba(14, 165, 233, 0.2);
	}

	.avatar-dim {
		background: linear-gradient(135deg, #DADDE3, #EDEFF2)
	}

	.avatar-text {
		font-size: 28rpx;
		font-weight: 700;
		color: #fff;
	}

	.avatar-text-dim {
		font-size: 28rpx;
		font-weight: 700;
		color: #8A93A3;
	}

	.card-name {
		font-size: 26rpx;
		font-weight: 700;
		color: #111827;
		display: block;
	}

	.card-emp {
		font-size: 20rpx;
		color: #8A93A3;
		font-weight: 500;
		margin-top: 4rpx;
		display: block;
	}

	/* Status Tag */
	.status-tag {
		display: flex;
		align-items: center;
		gap: 6rpx;
		padding: 8rpx 18rpx;
		border-radius: 9999rpx;
		font-size: 18rpx;
		font-weight: 600;
		flex-shrink: 0;
	}

	.status-dot {
		width: 10rpx;
		height: 10rpx;
		border-radius: 50%;
		flex-shrink: 0
	}

	.dot-amber {
		background: #F59E0B
	}

	.dot-emerald {
		background: #22C55E
	}

	.dot-rose {
		background: #F43F5E
	}

	.tag-amber {
		background: #FFFBEB;
		color: #D97706;
		border: 1rpx solid rgba(251, 192, 45, 0.6)
	}

	.tag-emerald {
		background: #F0FDF4;
		color: #16A34A;
		border: 1rpx solid rgba(187, 247, 208, 0.6)
	}

	.tag-rose {
		background: #FEF2F2;
		color: #DC2626;
		border: 1rpx solid rgba(254, 202, 202, 0.6)
	}

	/* Pulse */
	.pulse {
		animation: pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulseRing {
		0% {
			box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.35)
		}

		70% {
			box-shadow: 0 0 0 8rpx rgba(245, 158, 11, 0)
		}

		100% {
			box-shadow: 0 0 0 0 rgba(245, 158, 11, 0)
		}
	}

	/* Divider */
	.divider {
		height: 1rpx;
		background: #EDEFF2;
		margin-bottom: 20rpx;
	}

	/* Fields */
	.fields {}

	.field-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12rpx 12rpx;
		border-radius: 14rpx;
	}

	.field-label {
		font-size: 22rpx;
		color: #8A93A3;
		font-weight: 500;
	}

	.field-val-bold {
		font-size: 22rpx;
		color: #374151;
		font-weight: 600;
	}

	.field-val-mid {
		font-size: 22rpx;
		color: #4B5563;
		font-weight: 500;
	}

	.field-val-tag {
		font-size: 18rpx;
		font-weight: 600;
		color: #0EA5E9;
		background: #F0F9FF;
		padding: 6rpx 16rpx;
		border-radius: 9999rpx;
	}

	/* ═══════════ Actions ═══════════ */
	.card-actions {
		padding: 0 32rpx 24rpx;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		border-radius: 20rpx;
		padding: 22rpx 0;
		font-size: 24rpx;
		font-weight: 600;
		transition: transform 0.12s ease, box-shadow 0.12s ease;
		margin-bottom: 16rpx;
	}

	.action-btn:active {
		transform: scale(0.97)
	}

	.action-approve {
		background: #22C55E;
		color: #fff;
		box-shadow: 0 4rpx 24rpx rgba(34, 197, 94, 0.25);
	}

	.action-approve:active {
		background: #16A34A
	}

	.action-reject {
		background: #fff;
		color: #EF4444;
		border: 2rpx solid #FECACA;
	}

	.action-reject:active {
		background: #FEF2F2
	}

	/* Disabled */
	.action-disabled {
		background: #F7F8FA;
		color: #8A93A3;
		font-size: 22rpx;
		font-weight: 500;
		padding: 22rpx 0;
		text-align: center;
		border-radius: 20rpx;
		border: 1rpx solid rgba(218, 221, 227, 0.4);
	}

	/* Reject reason */
	.reject-reason {
		display: flex;
		gap: 16rpx;
		background: #FEF2F2;
		border-radius: 20rpx;
		padding: 28rpx;
		border: 1rpx solid rgba(254, 202, 202, 0.4);
	}

	.reject-reason-icon {
		flex-shrink: 0;
		margin-top: 2rpx;
	}

	.reject-reason-body {
		flex: 1;
		min-width: 0
	}

	.reject-reason-title {
		font-size: 20rpx;
		font-weight: 600;
		color: #B91C1C;
		display: block;
		margin-bottom: 4rpx;
	}

	.reject-reason-text {
		font-size: 20rpx;
		color: #DC2626;
		line-height: 1.6;
		display: block;
	}

	/* List Footer */
	.list-footer {
		text-align: center;
		padding: 40rpx 0;
	}

	.list-footer text {
		font-size: 22rpx;
		color: #8A93A3;
	}

	/* ═══════════ Toast ═══════════ */
	.toast {
		position: fixed;
		top: 160rpx;
		left: 32rpx;
		right: 32rpx;
		z-index: 200;
		pointer-events: none;
		opacity: 0;
		transform: translateY(-12rpx) scale(0.95);
		transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
		display: flex;
		align-items: center;
		gap: 16rpx;
		background: #1F2937;
		padding: 28rpx 40rpx;
		border-radius: 24rpx;
		box-shadow: 0 8rpx 64rpx rgba(0, 0, 0, 0.2);
	}

	.toast-show {
		opacity: 1;
		transform: translateY(0) scale(1);
	}

	.toast-icon {
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.toast-icon-success {
		background: rgba(34, 197, 94, 0.2)
	}

	.toast-icon-danger {
		background: rgba(239, 68, 68, 0.2)
	}

	.toast-text {
		color: #fff;
		font-size: 22rpx;
		font-weight: 500;
	}

	/* ═══════════ Reject Modal ═══════════ */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40rpx;
	}
	.modal-sheet {
		width: 100%;
		max-width: 560rpx;
		background: #fff;
		border-radius: 24rpx;
		padding: 40rpx 32rpx 48rpx;
		animation: fadeScale 0.2s ease;
	}
	@keyframes fadeScale {
		from { opacity: 0; transform: scale(0.9); }
		to { opacity: 1; transform: scale(1); }
	}
	.ms-hd {
		margin-bottom: 32rpx;
	}
	.ms-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #1a1e26;
	}
	.ms-body {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}
	.ms-label {
		font-size: 22rpx;
		color: #8694ab;
		font-weight: 500;
	}
	.ms-textarea {
		width: 100%;
		height: 160rpx;
		border: 1rpx solid #e5e7eb;
		border-radius: 16rpx;
		padding: 24rpx;
		font-size: 24rpx;
		color: #1a1e26;
		background: #f9fafb;
		box-sizing: border-box;
	}
	.ms-actions {
		display: flex;
		flex-direction: row;
		gap: 24rpx;
	}
	.ms-btn {
		flex: 1;
		height: 88rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		font-weight: 600;
	}
	.ms-btn-cancel {
		background: #f1f5f9;
		color: #52607b;
	}
	.ms-btn-danger {
		background: #ef4444;
		color: #fff;
	}

</style>