<template>
	<view class="pg">

		<!-- ═══ Header ═══ -->
		<view class="hdr">
			<view class="hdr-inner">
				<view class="hdr-back" @tap="goBack"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"
						stroke="#64748b" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg></view>
				<view class="hdr-icon-wrap brand-bg">
					<svg class="s20 white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
				</view>
				<view class="hdr-text-group">
					<text class="hdr-title">运营流水审核</text>
					<text class="hdr-sub">财务部 · 移动端审核工作台</text>
				</view>
				<view class="search-btn" @tap="showToast('搜索')">
					<svg class="s18 gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</view>
			</view>

			<!-- Status Tabs -->
			<scroll-view scroll-x class="tab-scroll">
				<view class="tab-row">
					<view v-for="(t, ti) in tabs" :key="ti" class="tab-chip"
						:class="currentTab===t.key?'tab-on':'tab-off'" @tap="currentTab=t.key">
						<text>{{ t.label }}</text>
						<text class="tab-count" :class="currentTab===t.key?'tc-on':'tc-off'">{{ t.count }}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- ═══ Main Content ═══ -->
		<view class="main">

			<!-- Today summary bar -->
			<view class="summary-bar">
				<text class="sb-left">今日待审 <text class="sb-bold">{{ todayCount }}</text> 条</text>
				<view class="sb-right" v-if="hasUrgent">
					<view class="urgent-dot"></view>
					<text class="urgent-text">有紧急流水</text>
				</view>
			</view>

			<!-- Card List -->
			<view v-for="(item, idx) in cardList" :key="idx" class="flow-card card-shadow anim-fade"
				:style="'animation-delay:'+(idx*0.05)+'s'">

				<!-- Card Body: info -->
				<view class="card-body">
					<!-- Top row: avatar + name + status badge -->
					<view class="cb-top">
						<view class="avatar-box" :class="'ab-'+item.avatarColor">
							<text class="avatar-letter">{{ item.name.charAt(0) }}</text>
						</view>
						<view class="cb-info">
							<text class="cb-name">{{ item.name }}</text>
							<text class="cb-role">{{ item.dept }} · {{ item.role }}</text>
						</view>
						<!-- Status Badge -->
						<view v-if="item.status==='pending'" class="status-badge sb-pending">
							<view class="sb-pulse"></view>
							<text>待审核</text>
						</view>
						<view v-if="item.status==='approved'" class="status-badge sb-approved">
							<svg class="s12 success" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								stroke-width="2.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<text>已通过</text>
						</view>
						<view v-if="item.status==='rejected'" class="status-badge sb-rejected">
							<svg class="s12 red" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								stroke-width="2.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
							<text>已驳回</text>
						</view>
					</view>

					<!-- Amount -->
					<view class="amount-row">
						<text class="amount-num"
							:class="item.amount>=0?'amt-pos':'amt-neg'">{{ item.amount>=0?'+':'-' }}¥{{ Math.abs(item.amount).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2}) }}</text>
						<text class="amount-cny">CNY</text>
					</view>

					<!-- Detail grid: date + type -->
					<view class="detail-grid">
						<view class="dg-cell">
							<text class="dg-label">提交日期</text>
							<text class="dg-value">{{ item.date }}</text>
						</view>
						<view class="dg-cell">
							<text class="dg-label">流水类型</text>
							<text class="dg-value">{{ item.typeName }}</text>
						</view>
					</view>

					<!-- Remark -->
					<view class="remark-cell">
						<text class="dg-label">备注说明</text>
						<text class="remark-text">{{ item.remark }}</text>
					</view>

					<!-- Review result (for approved/rejected) -->
					<view v-if="item.reviewResult" class="review-result" :class="'rr-'+item.status">
						<view class="rr-header">
							<svg v-if="item.status==='approved'" class="s16 success" fill="none" stroke="currentColor"
								viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<svg v-if="item.status==='rejected'" class="s16 red" fill="none" stroke="currentColor"
								viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<text class="rr-title"
								:class="item.status==='approved'?'rr-green':'rr-red'">{{ item.status==='approved'?'审核通过':'审核驳回' }}</text>
							<text class="rr-time">{{ item.reviewTime }}</text>
						</view>
						<text class="rr-msg"
							:class="item.status==='approved'?'msg-green':'msg-red'">{{ item.reviewMsg }}</text>
						<text class="rr-reviewer">审核人：{{ item.reviewer }}</text>
					</view>
				</view>

				<!-- Card Actions (pending only) -->
				<view v-if="item.status==='pending'" class="card-actions">
					<view class="action-row">
						<view class="btn-pass" @tap="toggleReview(item, false)">
							<svg class="s16 green" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								stroke-width="2.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<text>审核通过</text>
						</view>
						<view class="btn-reject" @tap="toggleReview(item, true)">
							<svg class="s16 red" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								stroke-width="2.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
							<text>驳回</text>
						</view>
					</view>

					<!-- Expandable review panel -->
					<view v-if="item.showPanel" class="review-panel anim-slide-down">
						<view class="rp-hd">
							<svg class="s16 gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
							</svg>
							<text
								class="rp-title">{{ item.panelIsReject?'驳回原因':'审核意见' }}{{ item.panelIsReject?'（必填）':'（选填）' }}</text>
						</view>
						<textarea class="rp-textarea" v-model="item.panelText"
							:placeholder="item.panelIsReject?'请输入驳回原因...':'请输入审核意见（选填）...'"
							placeholder-class="textarea-placeholder" :maxlength="300" />
						<view class="rp-submit" :class="item.panelIsReject?'rps-reject':'rps-pass'"
							@tap="confirmReview(item)">
							<text>确认{{ item.panelIsReject?'驳回':'通过' }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- Load More -->
			<view class="load-more">
				<view class="lm-dot lm-d1"></view>
				<view class="lm-dot lm-d2"></view>
				<view class="lm-dot lm-d3"></view>
				<text class="lm-text">加载更多</text>
			</view>

			<view class="bottom-spacer"></view>
		</view>

		<!-- Toast -->
		<view class="toast" :class="toastVisible?'toast-show':''">
			<text class="toast-text">{{ toastMsg }}</text>
		</view>
	</view>
</template>

<script>
	import {
		api
	} from '@/utils/api.js'

	// 头像颜色映射
	const avatarColors = ['pink', 'blue', 'purple', 'indigo', 'orange', 'teal']

	const flowTypeLabels = {
		'income': '收入流水', 'expense': '支出流水', 'transfer': '转账流水', 'live': '直播流水'
	}
	function getFlowTypeName(flowType, amount) {
		if (flowType && flowTypeLabels[flowType]) return flowTypeLabels[flowType]
		return amount >= 0 ? '收入流水' : '支出流水'
	}

	export default {
		data() {
			return {
				currentTab: 'pending',
				tabs: [{
						key: 'pending',
						label: '待审核',
						count: 0
					},
					{
						key: 'approved',
						label: '已审核',
						count: 0
					},
					{
						key: 'rejected',
						label: '已驳回',
						count: 0
					}
				],
				cardList: [],
				allPending: [],
				allApproved: [],
				allRejected: [],
				todayCount: 0,
				hasUrgent: false,
				toastVisible: false,
				toastMsg: '',
				loading: false
			}
		},
		onShow() {
			this.$checkAuth()
			this.fetchData()
		},
		watch: {
			currentTab() {
				this.filterCards()
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},

			async fetchData() {
				this.loading = true
				try {
					const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
						api.get('/api/admin/operation/flow-reviews', {
							status: 1
						}),
						api.get('/api/admin/operation/flow-reviews', {
							status: 2
						}),
						api.get('/api/admin/operation/flow-reviews', {
							status: 3
						})
					])

					this.allPending = this.transformList(pendingRes.data || [])
					this.allApproved = this.transformList(approvedRes.data || [])
					this.allRejected = this.transformList(rejectedRes.data || [])

					this.tabs[0].count = this.allPending.length
					this.tabs[1].count = this.allApproved.length
					this.tabs[2].count = this.allRejected.length

					this.filterCards()

					const today = this.formatDate(new Date())
					this.todayCount = this.allPending.filter(f => f.date === today).length
					this.hasUrgent = this.allPending.length > 0
				} catch (e) {
					console.error('[flow-review] 数据加载失败:', e)
				} finally {
					this.loading = false
				}
			},

			transformList(list) {
				return list.map((item, idx) => {
					const amount = parseFloat(item.amount) || 0
					const statusMap = {
						1: 'pending',
						2: 'approved',
						3: 'rejected'
					}
					const status = statusMap[item.auditStatus] || 'pending'
					return {
						id: item.id,
						name: item.name || '未知',
						dept: item.dept || '运营部',
						role: item.role || '员工',
						avatarColor: avatarColors[idx % avatarColors.length],
						status: status,
						amount: amount,
						typeName: getFlowTypeName(item.flowType, amount),
						date: this.formatDate(item.flowDate || item.createTime),
						remark: item.remark || '',
						showPanel: false,
						panelIsReject: false,
						panelText: '',
						reviewResult: status !== 'pending',
						reviewMsg: item.auditRemark || '',
						reviewTime: item.auditTime ? this.formatDateTime(item.auditTime) : '',
						reviewer: ''
					}
				})
			},

			filterCards() {
				const map = {
					pending: this.allPending,
					approved: this.allApproved,
					rejected: this.allRejected
				}
				this.cardList = map[this.currentTab] || []
			},

			toggleReview(item, isReject) {
				this.cardList.forEach(c => {
					if (c !== item) c.showPanel = false
				})
				item.panelIsReject = isReject
				item.showPanel = !item.showPanel
			},

			async confirmReview(item) {
				if (item.panelIsReject && (!item.panelText || !item.panelText.trim())) {
					return this.showToast('请输入驳回原因')
				}

				const url = item.panelIsReject ?
					`/api/admin/operation/flows/${item.id}/reject` :
					`/api/admin/operation/flows/${item.id}/approve`

				const data = item.panelIsReject ? {
					reason: item.panelText.trim()
				} : {
					remark: item.panelText.trim()
				}

				try {
					const res = await api.post(url, data)
					if (res.code === 200) {
						this.showToast(item.panelIsReject ? '已驳回' : '已通过')
						item.showPanel = false
						await this.fetchData()
					}
				} catch (e) {
					console.error('[flow-review] 审核操作失败:', e)
					this.showToast('操作失败，请重试')
				}
			},

			showToast(msg) {
				this.toastMsg = msg
				this.toastVisible = true
				clearTimeout(this._tt)
				this._tt = setTimeout(() => {
					this.toastVisible = false
				}, 2000)
			},

			formatDate(dateStr) {
				if (!dateStr) return '-'
				const d = new Date(dateStr)
				if (isNaN(d.getTime())) return String(dateStr).substring(0, 10)
				const y = d.getFullYear()
				const m = String(d.getMonth() + 1).padStart(2, '0')
				const day = String(d.getDate()).padStart(2, '0')
				return `${y}-${m}-${day}`
			},

			formatDateTime(dateStr) {
				if (!dateStr) return '-'
				const d = new Date(dateStr)
				if (isNaN(d.getTime())) return String(dateStr).substring(0, 16)
				const y = d.getFullYear()
				const m = String(d.getMonth() + 1).padStart(2, '0')
				const day = String(d.getDate()).padStart(2, '0')
				const h = String(d.getHours()).padStart(2, '0')
				const min = String(d.getMinutes()).padStart(2, '0')
				return `${y}-${m}-${day} ${h}:${min}`
			}
		}
	}
</script>

<style>
	/* Base */
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #fafafa;
		font-family: -apple-system, BlinkMacSystemFont, 'Noto Sans SC', sans-serif;
		-webkit-font-smoothing: antialiased;
		padding-bottom: 40rpx
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

	.s20 {
		width: 40rpx;
		height: 40rpx;
		flex-shrink: 0
	}

	.white {
		color: #fff
	}

	.gray-400 {
		color: #a3a3a3
	}

	.gray-500 {
		color: #737373
	}

	.gray-600 {
		color: #525252
	}

	.success {
		color: #16a34a
	}

	.red {
		color: #dc2626
	}

	.green {
		color: #22c55e
	}

	/* Animations */
	@keyframes fadeSlideIn {
		from {
			opacity: 0;
			transform: translateY(12rpx)
		}

		to {
			opacity: 1;
			transform: translateY(0)
		}
	}

	.anim-fade {
		animation: fadeSlideIn 0.4s ease-out forwards;
		opacity: 0
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			max-height: 0;
			transform: translateY(-8rpx)
		}

		to {
			opacity: 1;
			max-height: 500rpx;
			transform: translateY(0)
		}
	}

	.anim-slide-down {
		animation: slideDown 0.3s ease-out forwards;
		overflow: hidden
	}

	@keyframes pulseDot {

		0%,
		100% {
			opacity: 1
		}

		50% {
			opacity: 0.5
		}
	}

	.sb-pulse {
		width: 10rpx;
		height: 10rpx;
		border-radius: 50%;
		background: #f59e0b;
		animation: pulseDot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
	}

	@keyframes bounce {

		0%,
		100% {
			transform: translateY(0)
		}

		50% {
			transform: translateY(-6rpx)
		}
	}

	/* Header */
	.hdr {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(20px);
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.08)
	}

	.hdr-inner {
		display: flex;
		align-items: center;
		padding: 28rpx 36rpx 20rpx;
		gap: 16rpx
	}

	.hdr-icon-wrap {
		width: 72rpx;
		height: 72rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		box-shadow: 0 4rpx 12rpx rgba(99, 102, 241, 0.2);
	}

	.brand-bg {
		background: linear-gradient(135deg, #6366f1, #4f46e5)
	}

	.hdr-text-group {
		flex: 1;
		min-width: 0
	}

	.hdr-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #171717;
		display: block;
		line-height: 1.2
	}

	.hdr-sub {
		font-size: 20rpx;
		color: #a3a3a3;
		margin-top: 2rpx;
		display: block
	}

	.search-btn {
		width: 72rpx;
		height: 72rpx;
		border-radius: 18rpx;
		background: #f5f5f5;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0
	}

	.search-btn:active {
		background: #e5e5e5
	}

	/* Tab Scroll */
	.tab-scroll {
		width: auto;
		white-space: nowrap;
		padding: 36rpx 36rpx 36rpx 36rpx;
	}

	.tab-row {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.tab-chip {
		display: inline-flex;
		align-items: center;
		gap: 10rpx;
		padding: 18rpx 32rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		font-weight: 500;
		flex-shrink: 0;
		border: 1rpx solid transparent;
	}

	.tab-on {
		background: #6366f1;
		color: #fff;
		box-shadow: 0 4rpx 16rpx rgba(99, 102, 241, 0.2)
	}

	.tab-off {
		background: #fff;
		color: #737373;
		border-color: #e5e5e5
	}

	.tc-on {
		background: rgba(255, 255, 255, 0.2);
		padding: 2rpx 12rpx;
		border-radius: 9999rpx;
		font-size: 18rpx
	}

	.tc-off {
		background: #f5f5f5;
		padding: 2rpx 12rpx;
		border-radius: 9999rpx;
		font-size: 18rpx;
		color: #a3a3a3
	}

	/* Main */
	.main {}

	/* Summary Bar */
	.summary-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 36rpx 16rpx
	}

	.sb-left {
		font-size: 24rpx;
		color: #a3a3a3;
		font-weight: 500
	}

	.sb-bold {
		color: #171717;
		font-weight: 700
	}

	.sb-right {
		display: flex;
		align-items: center;
		gap: 10rpx
	}

	.urgent-dot {
		width: 14rpx;
		height: 14rpx;
		border-radius: 50%;
		background: #f59e0b;
		animation: pulseDot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
	}

	.urgent-text {
		font-size: 20rpx;
		color: #d97706;
		font-weight: 600
	}

	/* Flow Card */
	.flow-card {
		background: #fff;
		border-radius: 24rpx;
		overflow: hidden;
		margin-bottom: 24rpx
	}

	.card-shadow {
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04), 0 1rpx 6rpx rgba(0, 0, 0, 0.03)
	}

	.card-body {
		padding: 32rpx
	}

	/* Avatar */
	.cb-top {
		display: flex;
		align-items: center;
		gap: 18rpx;
		margin-bottom: 24rpx
	}

	.avatar-box {
		width: 80rpx;
		height: 80rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.ab-pink {
		background: linear-gradient(135deg, #fce7f3, #fbcfe8)
	}

	.ab-blue {
		background: linear-gradient(135deg, #dbeafe, #bfdbfe)
	}

	.ab-purple {
		background: linear-gradient(135deg, #ede9fe, #ddd6fe)
	}

	.ab-indigo {
		background: linear-gradient(135deg, #e0e7ff, #c7d2fe)
	}

	.ab-orange {
		background: linear-gradient(135deg, #fff7ed, #fed7aa)
	}

	.ab-teal {
		background: linear-gradient(135deg, #ccfbf1, #99f6e4)
	}

	.avatar-letter {
		font-size: 30rpx;
		font-weight: 700;
		color: #374151
	}

	.cb-info {
		flex: 1;
		min-width: 0
	}

	.cb-name {
		font-size: 26rpx;
		font-weight: 700;
		color: #171717;
		display: block
	}

	.cb-role {
		font-size: 20rpx;
		color: #a3a3a3;
		margin-top: 4rpx;
		display: block
	}

	/* Status Badge */
	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 8rpx;
		padding: 8rpx 18rpx;
		border-radius: 12rpx;
		font-size: 20rpx;
		font-weight: 600;
		flex-shrink: 0;
	}

	.sb-pending {
		background: #fffbeb;
		border: 1rpx solid #fde68a;
		color: #b45309
	}

	.sb-approved {
		background: #f0fdf4;
		border: 1rpx solid #bbf7d0;
		color: #15803d
	}

	.sb-rejected {
		background: #fef2f2;
		border: 1rpx solid #fecaca;
		color: #b91c1c
	}

	/* Amount */
	.amount-row {
		display: flex;
		align-items: baseline;
		gap: 8rpx;
		margin-bottom: 20rpx
	}

	.amount-num {
		font-size: 44rpx;
		font-weight: 900;
		letter-spacing: -0.02em
	}

	.amt-pos {
		color: #16a34a
	}

	.amt-neg {
		color: #dc2626
	}

	.amount-cny {
		font-size: 20rpx;
		color: #a3a3a3;
		font-weight: 500
	}

	/* Detail Grid */
	.detail-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16rpx;
		margin-bottom: 16rpx
	}

	.dg-cell {
		background: #fafafa;
		border-radius: 16rpx;
		padding: 18rpx 20rpx
	}

	.dg-label {
		font-size: 18rpx;
		color: #a3a3a3;
		display: block;
		margin-bottom: 6rpx
	}

	.dg-value {
		font-size: 24rpx;
		font-weight: 600;
		color: #262626
	}

	/* Remark */
	.remark-cell {
		background: #fafafa;
		border-radius: 16rpx;
		padding: 18rpx 20rpx;
		margin-bottom: 0
	}

	.remark-text {
		font-size: 22rpx;
		color: #404040;
		line-height: 1.6
	}

	/* Review Result */
	.review-result {
		border-radius: 16rpx;
		padding: 22rpx 24rpx;
		margin-top: 16rpx
	}

	.rr-approved {
		background: #f0fdf4;
		border: 1rpx solid #bbf7d0
	}

	.rr-rejected {
		background: #fef2f2;
		border: 1rpx solid #fecaca
	}

	.rr-header {
		display: flex;
		align-items: center;
		gap: 10rpx;
		margin-bottom: 10rpx
	}

	.rr-title {
		font-size: 24rpx;
		font-weight: 700
	}

	.rr-green {
		color: #166534
	}

	.rr-red {
		color: #991b1b
	}

	.rr-time {
		font-size: 18rpx;
		margin-left: auto;
		color: #a3a3a3
	}

	.rr-msg {
		font-size: 20rpx;
		line-height: 1.6;
		display: block
	}

	.msg-green {
		color: #166534
	}

	.msg-red {
		color: #991b1b
	}

	.rr-reviewer {
		font-size: 18rpx;
		color: #a3a3a3;
		margin-top: 8rpx;
		display: block
	}

	/* Card Actions */
	.card-actions {
		padding: 0 32rpx 28rpx
	}

	.action-row {
		display: flex;
		gap: 18rpx;
		margin-bottom: 0
	}

	.btn-pass {
		flex: 1;
		height: 84rpx;
		border-radius: 18rpx;
		background: #f0fdf4;
		border: 1rpx solid #bbf7d0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10rpx;
		font-size: 24rpx;
		font-weight: 600;
		color: #15803d;
	}

	.btn-pass:active {
		background: #dcfce7
	}

	.btn-reject {
		flex: 1;
		height: 84rpx;
		border-radius: 18rpx;
		background: #fef2f2;
		border: 1rpx solid #fecaca;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10rpx;
		font-size: 24rpx;
		font-weight: 600;
		color: #b91c1c;
	}

	.btn-reject:active {
		background: #fee2e2
	}

	/* Review Panel */
	.review-panel {
		margin-top: 18rpx
	}

	.rp-hd {
		display: flex;
		align-items: center;
		gap: 10rpx;
		margin-bottom: 14rpx
	}

	.rp-title {
		font-size: 24rpx;
		font-weight: 600;
		color: #404040
	}

	.rp-textarea {
		width: 100%;
		height: 160rpx;
		background: #fafafa;
		border: 1rpx solid #e5e5e5;
		border-radius: 16rpx;
		padding: 20rpx 24rpx;
		font-size: 24rpx;
		color: #262626;
		box-sizing: border-box;
		line-height: 1.6;
	}

	.textarea-placeholder {
		color: #a3a3a3
	}

	.rp-submit {
		width: 100%;
		height: 84rpx;
		border-radius: 18rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		font-weight: 600;
		color: #fff;
		margin-top: 16rpx;
	}

	.rps-pass {
		background: #16a34a;
		box-shadow: 0 4rpx 16rpx rgba(22, 163, 74, 0.2)
	}

	.rps-pass:active {
		background: #15803d
	}

	.rps-reject {
		background: #dc2626;
		box-shadow: 0 4rpx 16rpx rgba(220, 38, 38, 0.2)
	}

	.rps-reject:active {
		background: #b91c1c
	}

	/* Load More */
	.load-more {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8rpx;
		padding: 40rpx 0
	}

	.lm-dot {
		width: 10rpx;
		height: 10rpx;
		border-radius: 50%;
		background: #d4d4d4
	}

	.lm-d1 {
		animation: bounce 0.6s ease-in-out infinite
	}

	.lm-d2 {
		animation: bounce 0.6s ease-in-out infinite;
		animation-delay: 0.15s
	}

	.lm-d3 {
		animation: bounce 0.6s ease-in-out infinite;
		animation-delay: 0.3s
	}

	.lm-text {
		font-size: 20rpx;
		color: #a3a3a3;
		margin-left: 6rpx
	}

	.bottom-spacer {
		height: 32rpx
	}

	/* Toast */
	.toast {
		position: fixed;
		top: 160rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 200;
		background: rgba(23, 23, 23, 0.92);
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