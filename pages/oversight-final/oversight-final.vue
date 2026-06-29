<template>
<view class="pg">

  <!-- 顶部标题栏 -->
  <view class="topbar">
    <view class="topbar-inner">
      <view class="tbl">
        <view class="back-btn" @tap="goBack">
          <svg class="s16 ink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </view>
        <text class="t18 fw6 ink-900">考核终审</text>
        <view class="perm-badge"><text>最高权限</text></view>
      </view>
      <view class="bell-btn" @tap="onNotify">
        <svg class="s16 ink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        <view class="bell-dot"></view>
      </view>
    </view>
  </view>

  <!-- 统计概览 -->
  <view class="stats-row">
    <view class="stat-item stat-blue">
      <text class="stat-num">{{ pendingCount }}</text>
      <text class="stat-label">待终审</text>
    </view>
    <view class="stat-item stat-green">
      <text class="stat-num">{{ approvedCount }}</text>
      <text class="stat-label">已通过</text>
    </view>
    <view class="stat-item stat-red">
      <text class="stat-num">{{ rejectedCount }}</text>
      <text class="stat-label">已驳回</text>
    </view>
  </view>

  <!-- Tab 切换 -->
  <view class="tabs">
    <view class="tab" :class="tab==='pending' ? 'tab-on' : 'tab-off'" @tap="tab='pending'">
      <text>待终审</text>
      <text class="tab-badge">{{ pendingCount }}</text>
    </view>
    <view class="tab" :class="tab==='approved' ? 'tab-on' : 'tab-off'" @tap="tab='approved'">
      <text>终审通过</text>
    </view>
    <view class="tab" :class="tab==='rejected' ? 'tab-on' : 'tab-off'" @tap="tab='rejected'">
      <text>终审驳回</text>
    </view>
  </view>

  <!-- 内容区 -->
  <view class="main">

    <!-- === 待终审 === -->
    <view v-if="tab==='pending'">
      <view class="review-card" v-for="(item, idx) in pendingList" :key="item.id" :style="{animationDelay: (idx*0.08)+'s'}">
        <view class="rc-hd">
          <view class="rc-dept">
            <view class="rc-icon" :style="{background: item.iconBg}">
              <svg class="s14" :style="{color: item.iconColor}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path :d="item.iconD" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </view>
            <view>
              <text class="rc-name">{{ item.dept }}</text>
              <text class="rc-person">{{ item.person }}</text>
            </view>
          </view>
          <view class="rc-status" :class="item.statusCls">{{ item.statusText }}</view>
        </view>

        <view class="rc-info">
          <view class="rc-row"><text class="rc-label">考核周期</text><text class="rc-val">{{ item.period }}</text></view>
          <view class="rc-row"><text class="rc-label">考核指标</text><text class="rc-val">{{ item.metrics }}</text></view>
          <view class="rc-row"><text class="rc-label">考核目标</text><text class="rc-val">{{ item.targets }}</text></view>
          <view class="rc-row"><text class="rc-label">提交时间</text><text class="rc-val ink-600">{{ item.submitTime }}</text></view>
          <view class="rc-row"><text class="rc-label">财务部初审</text><text class="rc-val" :class="item.reviewCls">{{ item.reviewText }}</text></view>
        </view>

        <view class="rc-actions" v-if="item.canAct">
          <view class="rc-btn rc-btn-blue" @tap="openApprove(item)">通过终审</view>
          <view class="rc-btn rc-btn-red" @tap="openReject(item)">驳回</view>
        </view>
        <view class="rc-actions" v-else>
          <view class="rc-btn rc-btn-disabled"><text>等待初审完成</text></view>
        </view>
      </view>
    </view>

    <!-- === 终审通过 === -->
    <view v-if="tab==='approved'">
      <view class="review-card" v-for="item in approvedList" :key="item.id">
        <view class="rc-hd">
          <view class="rc-dept">
            <view class="rc-icon" :style="{background: item.iconBg}">
              <svg class="s14" :style="{color: item.iconColor}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path :d="item.iconD" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </view>
            <view>
              <text class="rc-name">{{ item.dept }}</text>
              <text class="rc-person">{{ item.person }}</text>
            </view>
          </view>
          <view class="rc-status-green">终审通过</view>
        </view>
        <view class="rc-info">
          <view class="rc-row"><text class="rc-label">考核周期</text><text class="rc-val">{{ item.period }}</text></view>
          <view class="rc-row"><text class="rc-label">考核指标</text><text class="rc-val">{{ item.metrics }}</text></view>
          <view class="rc-row"><text class="rc-label">考核目标</text><text class="rc-val">{{ item.targets }}</text></view>
        </view>
        <view class="rc-footer">
          <view class="rc-row"><text class="rc-label">终审时间</text><text class="rc-val ink-600">{{ item.time }}</text></view>
          <view class="rc-row"><text class="rc-label">终审意见</text><text class="rc-val">{{ item.comment }}</text></view>
          <view class="rc-row"><text class="rc-label">终审人</text><text class="rc-val ink-600">{{ item.reviewer }}</text></view>
        </view>
      </view>
      <view class="list-end">— 已显示全部 {{ approvedCount }} 条记录 —</view>
    </view>

    <!-- === 终审驳回 === -->
    <view v-if="tab==='rejected'">
      <view class="review-card rejected-card" v-for="item in rejectedList" :key="item.id">
        <view class="rc-hd">
          <view class="rc-dept">
            <view class="rc-icon" :style="{background: item.iconBg}">
              <svg class="s14" :style="{color: item.iconColor}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path :d="item.iconD" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </view>
            <view>
              <text class="rc-name">{{ item.dept }}</text>
              <text class="rc-person">{{ item.person }}</text>
            </view>
          </view>
          <view class="rc-status-red">终审驳回</view>
        </view>
        <view class="rc-info">
          <view class="rc-row"><text class="rc-label">考核周期</text><text class="rc-val">{{ item.period }}</text></view>
          <view class="rc-row"><text class="rc-label">考核指标</text><text class="rc-val">{{ item.metrics }}</text></view>
          <view class="rc-row"><text class="rc-label">考核目标</text><text class="rc-val">{{ item.targets }}</text></view>
        </view>
        <view class="rc-footer rc-footer-red">
          <view class="rc-row"><text class="rc-label">驳回时间</text><text class="rc-val ink-600">{{ item.time }}</text></view>
          <view class="rc-row"><text class="rc-label">驳回原因</text><text class="rc-val red fw5">{{ item.reason }}</text></view>
          <view class="rc-row"><text class="rc-label">终审人</text><text class="rc-val ink-600">{{ item.reviewer }}</text></view>
        </view>
      </view>
      <view class="list-end">— 已显示全部 {{ rejectedCount }} 条记录 —</view>
    </view>

    <view class="safe-btm"></view>
  </view>

  <!-- 驳回弹窗 -->
  <view class="modal-overlay" v-if="showReject" @tap="closeReject">
    <view class="modal-sheet" @tap.stop>
      <view class="ms-hd">
        <text class="ms-title">填写驳回原因</text>
        <svg class="s16 ink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" @tap="closeReject"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </view>
      <view class="ms-body">
        <text class="ms-label">考核对象</text>
        <text class="ms-target">{{ rejectTarget?.dept }} · {{ rejectTarget?.person }}</text>
        <text class="ms-label">驳回原因 <text class="red">*</text></text>
        <textarea class="ms-textarea" v-model="rejectReason" placeholder="请详细说明驳回原因，便于被考核人理解并整改..."/>
        <view class="ms-btn ms-btn-red" @tap="submitReject">确认驳回</view>
      </view>
      <view class="ms-safe"></view>
    </view>
  </view>

  <!-- 通过弹窗 -->
  <view class="modal-overlay" v-if="showApprove" @tap="closeApprove">
    <view class="modal-sheet" @tap.stop>
      <view class="ms-hd">
        <text class="ms-title">填写终审意见</text>
        <svg class="s16 ink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" @tap="closeApprove"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </view>
      <view class="ms-body">
        <text class="ms-label">终审意见</text>
        <textarea class="ms-textarea short" v-model="approveComment" placeholder="可选填终审意见..."/>
        <view class="ms-btn ms-btn-blue" @tap="submitApprove">确认通过</view>
      </view>
      <view class="ms-safe"></view>
    </view>
  </view>

  <!-- Toast -->
  <view class="toast" v-if="toastVisible">
    <text>{{ toastMsg }}</text>
  </view>



</view>
</template>

<script>
import { useAuth, DEPT_LABELS } from '../../stores/auth.js'
import { api } from '../../utils/api.js'
const auth = useAuth()

// ── 部门图标/颜色映射 ──
const DEPT_ICONS = [
	{ bg: '#DBEAFE', color: '#2563EB', d: 'M7 3v4h10V3M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
	{ bg: '#FEF3C7', color: '#D97706', d: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
	{ bg: '#E0E7FF', color: '#4F46E5', d: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5' },
	{ bg: '#CCFBF1', color: '#0D9488', d: 'M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-4.457 3.077l1.41-.513m14.095-5.13l1.41-.513M16.74 16.74a7.5 7.5 0 01.643-.642m-10.766 0a7.5 7.5 0 01.643.642m0-9.48a7.5 7.5 0 01.643.642m10.766 0a7.5 7.5 0 01-.643.642M20.491 7.955l-1.41-.513M5.509 16.045l-1.41.513M7.955 3.509l.513 1.41m7.064 14.162l.513 1.41M16.045 20.491l-.513-1.41M7.955 20.491l-.513-1.41' },
	{ bg: '#FFE4E6', color: '#E11D48', d: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
]
function deptIcon(deptId) {
	return DEPT_ICONS[Math.abs(deptId) % DEPT_ICONS.length]
}

function fmtDate(dt) {
	if (!dt) return ''
	const s = String(dt).slice(0, 10)
	return s.replace(/-/g, '.')
}
function fmtDateTime(dt) {
	if (!dt) return ''
	const s = String(dt)
	return s.replace(/-/g, '.').replace(' ', ' · ')
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
			loading: false,
			showReject: false,
			showApprove: false,
			rejectTarget: null,
			approveTarget: null,
			rejectReason: '',
			approveComment: '',
			toastVisible: false,
			toastMsg: '',
			deptNameMap: {},
		}
	},
	onShow() {
		this.$checkAuth()
		this.fetchDeptOptions()
		this.fetchPending()
		this.fetchHistory()
	},
	methods: {
		async fetchDeptOptions() {
			try {
				const res = await api.get('/api/admin/hr/departments')
				const map = {}
				;(res.data || []).forEach(d => { map[Number(d.id)] = d.dept_name })
				this.deptNameMap = map
			} catch (e) { /* 静默 */ }
		},

		/* ── 获取待终审列表 ── */
		async fetchPending() {
			try {
				const res = await api.get('/api/admin/oversight/pending')
				const list = (res.data || []).map(r => {
					const icon = deptIcon(r.dept_id)
					const deptName = this.deptNameMap[r.dept_id] || DEPT_LABELS[r.dept_id] || '未知'
					return {
						id: r.id,
						deptId: r.dept_id,
						dept: deptName,
						person: r.real_name || r.username || '',
						period: r.assess_cycle || '-',
						metrics: r.assess_targets || '-',
						targets: r.target_remark || '-',
						submitTime: fmtDateTime(r.publish_time),
						reviewText: '已通过 · 财务部',
						reviewCls: 'green',
						statusText: '初审通过',
						statusCls: 'rc-status-green',
						canAct: true,
						iconBg: icon.bg,
						iconColor: icon.color,
						iconD: icon.d,
					}
				})
				this.pendingList = list
				this.pendingCount = list.length
			} catch (e) {
				console.error('[终审] 获取待终审列表失败:', e)
			}
		},

		/* ── 获取终审历史（通过 + 驳回） ── */
		async fetchHistory() {
			try {
				const res = await api.get('/api/admin/oversight/reviews')
				const all = res.data || []
				const approved = []
				const rejected = []
				all.forEach(r => {
					const icon = deptIcon(r.dept_id)
					const deptName = this.deptNameMap[r.dept_id] || DEPT_LABELS[r.dept_id] || '未知'
					const item = {
						id: r.id,
						dept: deptName,
						person: r.publisher_name || '',
						period: r.assess_cycle || '-',
						metrics: r.assess_targets || '-',
						targets: r.target_remark || '-',
						time: fmtDateTime(r.audit_time),
						reviewer: r.reviewer_name || '总经办',
						iconBg: icon.bg,
						iconColor: icon.color,
						iconD: icon.d,
					}
					if (r.audit_status === 2) {
						item.comment = r.audit_remark || '审核通过'
						approved.push(item)
					} else if (r.audit_status === 3) {
						item.reason = r.audit_remark || '未填写原因'
						rejected.push(item)
					}
				})
				this.approvedList = approved
				this.rejectedList = rejected
				this.approvedCount = approved.length
				this.rejectedCount = rejected.length
			} catch (e) {
				console.error('[终审] 获取历史列表失败:', e)
			}
		},

		goBack() { uni.navigateBack({ delta: 1 }) },
		onNotify() { this.showToast('暂无新通知') },

		openReject(item) { this.rejectTarget = item; this.rejectReason = ''; this.showReject = true },
		closeReject() { this.showReject = false },

		openApprove(item) { this.approveTarget = item; this.approveComment = ''; this.showApprove = true },
		closeApprove() { this.showApprove = false },

		/* ── 驳回终审 ── */
		async submitReject() {
			if (!this.rejectReason.trim()) { this.showToast('请填写驳回原因'); return }
			try {
				await api.post('/api/admin/oversight/reviews/' + this.rejectTarget.id + '/reject', {
					reason: this.rejectReason.trim()
				})
				this.showReject = false
				this.showToast('已驳回该考核单据')
				this.fetchPending()
				this.fetchHistory()
			} catch (e) { /* api.js 已提示 */ }
		},

		/* ── 通过终审 ── */
		async submitApprove() {
			try {
				await api.post('/api/admin/oversight/reviews/' + this.approveTarget.id + '/approve', {
					remark: this.approveComment.trim() || ''
				})
				this.showApprove = false
				this.showToast('终审已通过')
				this.fetchPending()
				this.fetchHistory()
			} catch (e) { /* api.js 已提示 */ }
		},

		showToast(msg) {
			this.toastMsg = msg; this.toastVisible = true
			setTimeout(() => { this.toastVisible = false }, 2500)
		}
	}
}
</script>

<style>
.pg { width:100%; min-height:100vh; background:#F8FAFC; font-family:'Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif; -webkit-font-smoothing:antialiased }

/* typo */
.t11 { font-size:22rpx } .t12 { font-size:24rpx } .t14 { font-size:28rpx } .t16 { font-size:32rpx } .t18 { font-size:36rpx }
.fw5 { font-weight:500 } .fw6 { font-weight:600 }
.ink-400 { color:#94A3B8 } .ink-600 { color:#475569 } .ink-900 { color:#0F172A }
.blue { color:#2563EB } .green { color:#059669 } .red { color:#DC2626 } .amber { color:#D97706 }
.s14 { width:28rpx;height:28rpx;flex-shrink:0 } .s16 { width:32rpx;height:32rpx;flex-shrink:0 }

/* topbar */
.topbar { position:sticky; top:0; z-index:40; background:rgba(255,255,255,.95); border-bottom:1rpx solid #E2E8F0 }
.topbar-inner { display:flex; flex-direction:row; justify-content:space-between; align-items:center; padding:16rpx 36rpx; height:112rpx }
.tbl { display:flex; flex-direction:row; align-items:center; gap:24rpx }
.back-btn { width:64rpx; height:64rpx; border-radius:50%; display:flex; align-items:center; justify-content:center }
.back-btn:active { background:#F1F5F9 }
.perm-badge { padding:4rpx 16rpx; background:rgba(37,99,235,.1); border-radius:9999rpx }
.perm-badge text { font-size:22rpx; font-weight:500; color:#2563EB }
.bell-btn { width:72rpx; height:72rpx; border-radius:50%; display:flex; align-items:center; justify-content:center; position:relative }
.bell-btn:active { background:#F1F5F9 }
.bell-dot { position:absolute; top:16rpx; right:16rpx; width:16rpx; height:16rpx; background:#DC2626; border-radius:50% }

/* stats */
.stats-row { display:flex; flex-direction:row; gap:24rpx; padding:36rpx 36rpx 32rpx; background:#fff }
.stat-item { flex:1; text-align:center; padding:28rpx 16rpx; border-radius:24rpx; border:1px solid }
.stat-blue { background:rgba(37,99,235,.03); border-color:rgba(37,99,235,.2) }
.stat-green { background:rgba(5,150,105,.03); border-color:rgba(5,150,105,.2) }
.stat-red { background:rgba(220,38,38,.03); border-color:rgba(220,38,38,.2) }
.stat-num { font-size:48rpx; font-weight:700; display:block; line-height:1 }
.stat-blue .stat-num { color:#2563EB }
.stat-green .stat-num { color:#059669 }
.stat-red .stat-num { color:#DC2626 }
.stat-label { font-size:24rpx; color:#475569; font-weight:500; display:block; margin-top:8rpx }

/* tabs */
.tabs { display:flex; flex-direction:row; position:sticky; top:112rpx; z-index:30; background:#fff; border-bottom:1rpx solid #E2E8F0; padding:0 36rpx }
.tab { flex:1; display:flex; flex-direction:row; justify-content:center; align-items:center; gap:8rpx; padding:28rpx 0; font-size:28rpx; border-bottom:4rpx solid transparent }
.tab-on { font-weight:600; color:#2563EB; border-bottom-color:#2563EB }
.tab-off { font-weight:500; color:#475569 }
.tab-badge { font-size:24rpx; padding:2rpx 12rpx; border-radius:9999rpx; background:rgba(37,99,235,.1); color:#2563EB }

/* main */
.main { padding:32rpx 36rpx }

/* review card */
.review-card { background:#fff; border-radius:24rpx; border:1rpx solid #E2E8F0; margin-bottom:32rpx; overflow:hidden; animation:cardEnter .3s ease-out both }
@keyframes cardEnter { from{opacity:0;transform:translateY(16rpx)} to{opacity:1;transform:translateY(0)} }
.rejected-card { border-color:rgba(220,38,38,.3) }
.rc-hd { display:flex; flex-direction:row; justify-content:space-between; align-items:center; padding:36rpx 36rpx 0 }
.rc-dept { display:flex; flex-direction:row; align-items:center; gap:20rpx }
.rc-icon { width:72rpx; height:72rpx; border-radius:16rpx; display:flex; align-items:center; justify-content:center }
.rc-name { font-size:28rpx; font-weight:600; color:#0F172A; display:block }
.rc-person { font-size:24rpx; color:#94A3B8; display:block; margin-top:4rpx }
.rc-status { padding:8rpx 20rpx; border-radius:9999rpx; font-size:24rpx; font-weight:500 }
.rc-status-green { background:rgba(5,150,105,.1); color:#059669; border:1px solid rgba(5,150,105,.2) }
.rc-status-amber { background:rgba(217,119,6,.1); color:#D97706; border:1px solid rgba(217,119,6,.2) }
.rc-status-red { background:rgba(220,38,38,.1); color:#DC2626 }

/* rc-info */
.rc-info { padding:32rpx 36rpx 0 }
.rc-row { display:flex; flex-direction:row; margin-bottom:20rpx }
.rc-label { font-size:24rpx; color:#94A3B8; width:128rpx; flex-shrink:0 }
.rc-val { font-size:28rpx; color:#0F172A; flex:1; font-weight:500 }

/* rc-footer */
.rc-footer { padding:28rpx 36rpx 36rpx; border-top:1rpx solid #E2E8F0; margin-top:28rpx }
.rc-footer-red { border-top-color:rgba(220,38,38,.2) }

/* rc-actions */
.rc-actions { display:flex; flex-direction:row; gap:20rpx; padding:0 36rpx 36rpx }
.rc-btn { flex:1; height:88rpx; border-radius:16rpx; font-size:28rpx; font-weight:600; display:flex; align-items:center; justify-content:center }
.rc-btn-blue { background:#2563EB; color:#fff }
.rc-btn-blue:active { background:#1D4ED8 }
.rc-btn-red { background:#fff; color:#DC2626; border:1px solid rgba(220,38,38,.3) }
.rc-btn-red:active { background:#FEF2F2 }
.rc-btn-disabled { background:#F1F5F9; color:#94A3B8 }
.rc-btn-disabled text { font-size:28rpx; font-weight:600 }

/* list end */
.list-end { text-align:center; padding:48rpx 0; font-size:24rpx; color:#94A3B8 }

/* modal */
.modal-overlay { position:fixed; inset:0; z-index:100 }
.modal-overlay::before { content:''; position:absolute; inset:0; background:rgba(0,0,0,.4) }
.modal-sheet { position:absolute; bottom:0; left:0; right:0; background:#fff; border-radius:40rpx 40rpx 0 0; animation:slideUp .2s ease-out }
@keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
.ms-hd { display:flex; flex-direction:row; justify-content:space-between; align-items:center; padding:32rpx 36rpx 24rpx; border-bottom:1rpx solid #E2E8F0 }
.ms-title { font-size:32rpx; font-weight:600; color:#0F172A }
.ms-body { padding:32rpx 36rpx }
.ms-label { font-size:24rpx; font-weight:500; color:#475569; display:block; margin-bottom:16rpx }
.ms-target { font-size:28rpx; font-weight:500; color:#0F172A; display:block; margin-bottom:32rpx }
.ms-textarea { width:100%; height:240rpx; padding:28rpx 32rpx; font-size:28rpx; color:#0F172A; background:#F8FAFC; border:1rpx solid #E2E8F0; border-radius:16rpx; box-sizing:border-box; line-height:1.5 }
.ms-textarea.short { height:180rpx }
.ms-btn { width:100%; height:96rpx; border-radius:16rpx; font-size:28rpx; font-weight:600; display:flex; align-items:center; justify-content:center; margin-top:32rpx }
.ms-btn-blue { background:#2563EB; color:#fff }
.ms-btn-blue:active { background:#1D4ED8 }
.ms-btn-red { background:#DC2626; color:#fff }
.ms-btn-red:active { background:#B91C1C }
.ms-safe { height:env(safe-area-inset-bottom,0px) }

/* toast */
.toast { position:fixed; top:160rpx; left:50%; transform:translateX(-50%); z-index:200; background:#0F172A; color:#fff; font-size:28rpx; font-weight:500; padding:24rpx 40rpx; border-radius:24rpx; box-shadow:0 8rpx 32rpx rgba(0,0,0,.2); animation:fadeIn .2s ease-out }
@keyframes fadeIn { from{opacity:0;transform:translateX(-50%) translateY(-16rpx)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

.safe-btm { height:48rpx }

</style>
