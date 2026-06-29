<template>
	<view class="pg">

		<!-- Header -->
		<view class="hdr">
			<view class="hdr-inner">
				<view class="hdr-back" @tap="goBack">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
					</svg>
				</view>
				<view class="hdr-text-group">
					<text class="hdr-title">劝退记录</text>
					<text class="hdr-sub">人事劝退申请、审批与归档</text>
				</view>
				<view class="hdr-right">
					<view class="perspective-tag perspective-tag-red">总经办视角</view>
				</view>
			</view>
		</view>

		<!-- 统计概览 -->
		<view class="stats-row">
			<view class="stat-item stat-red">
				<text class="stat-num">{{ pendingCount }}</text>
				<text class="stat-label">待审核</text>
			</view>
			<view class="stat-item stat-green">
				<text class="stat-num">{{ approvedCount }}</text>
				<text class="stat-label">已通过</text>
			</view>
			<view class="stat-item stat-gray">
				<text class="stat-num">{{ rejectedCount }}</text>
				<text class="stat-label">已拒绝</text>
			</view>
		</view>

		<!-- Tab 切换 -->
		<view class="tabs">
			<view class="tab" :class="tab==='pending' ? 'tab-on' : 'tab-off'" @tap="tab='pending'">
				<text>待审核</text>
				<text class="tab-badge">{{ pendingCount }}</text>
			</view>
			<view class="tab" :class="tab==='approved' ? 'tab-on' : 'tab-off'" @tap="tab='approved'">
				<text>已通过</text>
			</view>
			<view class="tab" :class="tab==='rejected' ? 'tab-on' : 'tab-off'" @tap="tab='rejected'">
				<text>已拒绝</text>
			</view>
		</view>

		<!-- 内容区 -->
		<view class="main">

			<!-- 待审核 -->
			<view v-if="tab==='pending'">
				<view class="card" v-for="(item, idx) in pendingList" :key="item.id" :style="{animationDelay: (idx*0.08)+'s'}">
					<view class="card-hd">
						<view class="card-dept">
							<view class="card-icon" :style="{background: item.iconBg}">
								<svg class="s14" :style="{color: item.iconColor}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path :d="item.iconD" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</view>
							<view>
								<text class="card-name">{{ item.person }}</text>
								<text class="card-dept-name">{{ item.dept }} · {{ item.role }}</text>
							</view>
						</view>
						<view class="card-status card-status-pending">待审核</view>
					</view>
					<view class="card-info">
						<view class="info-row"><text class="info-label">劝退原因</text><text class="info-val">{{ item.reason }}</text></view>
						<view class="info-row"><text class="info-label">提交时间</text><text class="info-val info-val-muted">{{ item.submitTime }}</text></view>
						<view class="info-row"><text class="info-label">提交人</text><text class="info-val info-val-muted">{{ item.submitter }}</text></view>
					</view>
					<view class="card-actions">
						<view class="ca-btn ca-btn-green" @tap="handleApprove(item)">通过</view>
						<view class="ca-btn ca-btn-red" @tap="handleReject(item)">驳回</view>
					</view>
				</view>
				<view v-if="pendingList.length===0" class="empty">暂无待审核的劝退申请</view>
			</view>

			<!-- 已通过 -->
			<view v-if="tab==='approved'">
				<view class="card" v-for="item in approvedList" :key="item.id">
					<view class="card-hd">
						<view class="card-dept">
							<view class="card-icon" :style="{background: item.iconBg}">
								<svg class="s14" :style="{color: item.iconColor}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path :d="item.iconD" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</view>
							<view>
								<text class="card-name">{{ item.person }}</text>
								<text class="card-dept-name">{{ item.dept }} · {{ item.role }}</text>
							</view>
						</view>
						<view class="card-status card-status-green">已通过</view>
					</view>
					<view class="card-info">
						<view class="info-row"><text class="info-label">劝退原因</text><text class="info-val">{{ item.reason }}</text></view>
						<view class="info-row"><text class="info-label">审批时间</text><text class="info-val info-val-muted">{{ item.time }}</text></view>
						<view class="info-row"><text class="info-label">审批人</text><text class="info-val info-val-muted">{{ item.reviewer }}</text></view>
					</view>
				</view>
				<view v-if="approvedList.length===0" class="empty">暂无已通过的劝退记录</view>
			</view>

			<!-- 已拒绝 -->
			<view v-if="tab==='rejected'">
				<view class="card card-rejected" v-for="item in rejectedList" :key="item.id">
					<view class="card-hd">
						<view class="card-dept">
							<view class="card-icon" :style="{background: item.iconBg}">
								<svg class="s14" :style="{color: item.iconColor}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path :d="item.iconD" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</view>
							<view>
								<text class="card-name">{{ item.person }}</text>
								<text class="card-dept-name">{{ item.dept }} · {{ item.role }}</text>
							</view>
						</view>
						<view class="card-status card-status-red">已拒绝</view>
					</view>
					<view class="card-info">
						<view class="info-row"><text class="info-label">劝退原因</text><text class="info-val">{{ item.reason }}</text></view>
						<view class="info-row"><text class="info-label">拒绝原因</text><text class="info-val danger-color">{{ item.rejectReason }}</text></view>
						<view class="info-row"><text class="info-label">审批时间</text><text class="info-val info-val-muted">{{ item.time }}</text></view>
					</view>
				</view>
				<view v-if="rejectedList.length===0" class="empty">暂无被拒绝的劝退记录</view>
			</view>

			<view class="safe-btm"></view>
		</view>

		<!-- Toast -->
		<view class="toast" v-if="toastVisible">
			<view class="toast-inner">
				<svg class="s14 success" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
				<text class="toast-text">{{ toastMsg }}</text>
			</view>
		</view>

	</view>
</template>

<script>
import { api } from '@/utils/api.js'

const iconMap = [
	{ iconBg:'#DBEAFE', iconColor:'#2563EB', iconD:'M7 3v4h10V3M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
	{ iconBg:'#FEF3C7', iconColor:'#D97706', iconD:'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
	{ iconBg:'#CCFBF1', iconColor:'#0D9488', iconD:'M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-4.457 3.077l1.41-.513m14.095-5.13l1.41-.513M16.74 16.74a7.5 7.5 0 01.643-.642m-10.766 0a7.5 7.5 0 01.643.642m0-9.48a7.5 7.5 0 01.643.642m10.766 0a7.5 7.5 0 01-.643.642M20.491 7.955l-1.41-.513M5.509 16.045l-1.41.513M7.955 3.509l.513 1.41m7.064 14.162l.513 1.41M16.045 20.491l-.513-1.41M7.955 20.491l-.513-1.41' },
	{ iconBg:'#FFE4E6', iconColor:'#E11D48', iconD:'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
	{ iconBg:'#E0E7FF', iconColor:'#4F46E5', iconD:'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5' }
]

function getIcon(idx) { return iconMap[idx % iconMap.length] }

function fmtTime(t) {
	if (!t) return ''
	return String(t).replace('T', ' ').substring(0, 16)
}

export default {
	data() {
		return {
			tab: 'pending',
			pendingList: [],
			approvedList: [],
			rejectedList: [],
			pendingCount: 0,
			approvedCount: 0,
			rejectedCount: 0,
			toastVisible: false,
			toastMsg: '',
			loading: false
		}
	},
	onShow() {
		this.$checkAuth()
		this.fetchData()
	},
	methods: {
		goBack() { uni.navigateBack() },
		async fetchData() {
			this.loading = true
			try {
				const [allRes, pendingRes, approvedRes, rejectedRes] = await Promise.all([
					api.get('/api/admin/hr/persuades', null, { silent: true }),
					api.get('/api/admin/hr/persuades', { status: 1 }, { silent: true }),  // 待总经审核
					api.get('/api/admin/hr/persuades', { status: 2 }, { silent: true }),  // 已劝退
					api.get('/api/admin/hr/persuades', { status: 3 }, { silent: true })   // 已驳回
				])

				if (allRes.code === 200 && allRes.data) {
					this.pendingCount  = allRes.data.submittedCount || 0   // 待总经审核
					this.approvedCount = allRes.data.approvedCount  || 0   // 已劝退
					this.rejectedCount = allRes.data.rejectedCount  || 0   // 已驳回
				}

				const mapItem = (it, idx) => {
					const icon = getIcon(idx)
					return {
						id: it.id,
						person: it.real_name || '未知',
						dept: it.dept_name || '',
						role: '',
						reason: it.hr_remark || it.reason || '',
						submitTime: fmtTime(it.create_time),
						submitter: it.real_name || '',
						time: fmtTime(it.deal_time),
						reviewer: '',
						rejectReason: '',
						...icon
					}
				}

				if (pendingRes.code === 200) {
					this.pendingList = (pendingRes.data.list || []).map(mapItem)
				}
				if (approvedRes.code === 200) {
					this.approvedList = (approvedRes.data.list || []).map(mapItem)
				}
				if (rejectedRes.code === 200) {
					this.rejectedList = (rejectedRes.data.list || []).map(mapItem)
				}
			} catch (e) {
				console.error('劝退记录加载失败:', e)
			} finally {
				this.loading = false
			}
		},
		async handleApprove(item) {
			try {
				await api.post('/api/admin/hr/persuades/' + item.id + '/approve', null, { silent: true })
				this.showToast('已通过该劝退申请')
				this.fetchData()
			} catch (e) { this.showToast('操作失败') }
		},
		async handleReject(item) {
			try {
				await api.post('/api/admin/hr/persuades/' + item.id + '/reject', null, { silent: true })
				this.showToast('已驳回该劝退申请')
				this.fetchData()
			} catch (e) { this.showToast('操作失败') }
		},
		showToast(msg) {
			this.toastMsg = msg; this.toastVisible = true
			clearTimeout(this._tt)
			this._tt = setTimeout(() => { this.toastVisible = false }, 2500)
		}
	}
}
</script>

<style scoped>
.hdr-back { width:60rpx; height:60rpx; display:flex; align-items:center; justify-content:center; border-radius:50%; flex-shrink:0; margin-right:8rpx }
.hdr-back:active { background:rgba(0,0,0,.06) }
.hdr-right { display:flex; align-items:center; gap:16rpx; flex-shrink:0 }
</style>

<style>
.pg { width:100%; min-height:100vh; background:#F7F8FA; font-family:-apple-system,BlinkMacSystemFont,'Noto Sans SC',sans-serif; -webkit-font-smoothing:antialiased }
.s14 { width:28rpx; height:28rpx; flex-shrink:0 }
.s16 { width:32rpx; height:32rpx; flex-shrink:0 }
.s18 { width:36rpx; height:36rpx; flex-shrink:0 }
.s20 { width:40rpx; height:40rpx; flex-shrink:0 }
.success { color:#3D8B6E }
.danger-color { color:#C44B4B }

/* Header */
.hdr { background:#fff; border-bottom:1rpx solid #E4E7EC }
.hdr-inner { display:flex; align-items:center; justify-content:space-between; padding:48rpx 36rpx 16rpx }
.hdr-title { font-size:36rpx; font-weight:700; color:#1a1a1a; display:block; letter-spacing:-0.01em }
.hdr-sub { font-size:20rpx; color:#868E96; margin-top:4rpx; display:block; font-weight:500 }
.hdr-text-group { flex:1; min-width:0 }

.perspective-tag { padding:6rpx 20rpx; border-radius:9999rpx; font-size:20rpx; font-weight:500 }
.perspective-tag-red { background:rgba(220,38,38,.1); color:#DC2626 }

/* Stats */
.stats-row { display:flex; flex-direction:row; gap:24rpx; padding:32rpx 36rpx; background:#fff }
.stat-item { flex:1; text-align:center; padding:24rpx 16rpx; border-radius:20rpx; border:1px solid }
.stat-red { background:rgba(220,38,38,.03); border-color:rgba(220,38,38,.2) }
.stat-green { background:rgba(5,150,105,.03); border-color:rgba(5,150,105,.2) }
.stat-gray { background:rgba(71,85,105,.03); border-color:rgba(71,85,105,.2) }
.stat-num { font-size:44rpx; font-weight:700; display:block; line-height:1 }
.stat-red .stat-num { color:#DC2626 }
.stat-green .stat-num { color:#059669 }
.stat-gray .stat-num { color:#475569 }
.stat-label { font-size:22rpx; color:#475569; font-weight:500; display:block; margin-top:6rpx }

/* Tabs */
.tabs { display:flex; flex-direction:row; position:sticky; top:0; z-index:30; background:#fff; border-bottom:1rpx solid #E2E8F0; padding:0 36rpx }
.tab { flex:1; display:flex; flex-direction:row; justify-content:center; align-items:center; gap:8rpx; padding:24rpx 0; font-size:26rpx; border-bottom:4rpx solid transparent }
.tab-on { font-weight:600; color:#2563EB; border-bottom-color:#2563EB }
.tab-off { font-weight:500; color:#475569 }
.tab-badge { font-size:22rpx; padding:2rpx 12rpx; border-radius:9999rpx; background:rgba(37,99,235,.1); color:#2563EB }

/* Main */
.main { padding:24rpx 28rpx }

/* Card */
.card { background:#fff; border-radius:20rpx; border:1rpx solid #E2E8F0; margin-bottom:24rpx; overflow:hidden; animation:cardEnter .3s ease-out both }
.card-rejected { border-color:rgba(220,38,38,.25) }
@keyframes cardEnter { from{opacity:0;transform:translateY(16rpx)} to{opacity:1;transform:translateY(0)} }
.card-hd { display:flex; flex-direction:row; justify-content:space-between; align-items:center; padding:28rpx 28rpx 0 }
.card-dept { display:flex; flex-direction:row; align-items:center; gap:16rpx }
.card-icon { width:64rpx; height:64rpx; border-radius:14rpx; display:flex; align-items:center; justify-content:center }
.card-name { font-size:26rpx; font-weight:600; color:#0F172A; display:block }
.card-dept-name { font-size:22rpx; color:#94A3B8; display:block; margin-top:4rpx }
.card-status { padding:6rpx 16rpx; border-radius:9999rpx; font-size:22rpx; font-weight:500 }
.card-status-pending { background:rgba(37,99,235,.1); color:#2563EB; border:1px solid rgba(37,99,235,.2) }
.card-status-green { background:rgba(5,150,105,.1); color:#059669; border:1px solid rgba(5,150,105,.2) }
.card-status-red { background:rgba(220,38,38,.1); color:#DC2626; border:1px solid rgba(220,38,38,.2) }

.card-info { padding:20rpx 28rpx 0 }
.info-row { display:flex; flex-direction:row; margin-bottom:16rpx }
.info-label { font-size:22rpx; color:#94A3B8; width:112rpx; flex-shrink:0 }
.info-val { font-size:24rpx; color:#0F172A; flex:1; font-weight:500; line-height:1.5 }
.info-val-muted { color:#475569 }

.card-actions { display:flex; flex-direction:row; gap:16rpx; padding:0 28rpx 28rpx }
.ca-btn { flex:1; height:80rpx; border-radius:14rpx; font-size:26rpx; font-weight:600; display:flex; align-items:center; justify-content:center }
.ca-btn-green { background:#059669; color:#fff }
.ca-btn-green:active { background:#047857 }
.ca-btn-red { background:#fff; color:#DC2626; border:1rpx solid rgba(220,38,38,.3) }
.ca-btn-red:active { background:#FEF2F2 }

/* Empty */
.empty { text-align:center; padding:80rpx 0; font-size:26rpx; color:#94A3B8 }

/* Toast */
.toast { position:fixed; top:160rpx; left:50%; transform:translateX(-50%); z-index:200 }
.toast-inner { display:flex; align-items:center; gap:12rpx; padding:20rpx 36rpx; border-radius:20rpx; background:rgba(15,23,42,.92); backdrop-filter:blur(8px) }
.toast-text { color:#fff; font-size:24rpx; font-weight:500 }

.safe-btm { height:40rpx }
</style>
