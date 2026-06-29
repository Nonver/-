<template>
	<view class="pg">
		<!-- Header -->
		<view class="hdr">
			<view class="hdr-row">
				<view class="hdr-back" @tap="goBack">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
					</svg>
				</view>
				<text class="hdr-title">流水详情</text>
			</view>
		</view>

		<!-- Main -->
		<view class="main" v-if="loaded">
			<!-- Amount Card -->
			<view class="amount-card card-shadow anim-fade">
				<view class="ac-header">
					<view class="ac-type-tag" :class="typeTagClass">
						<view class="type-dot"></view>
						<text>{{ flowTypeName }}</text>
					</view>
				</view>
				<view class="ac-amount-row">
					<text class="ac-sign">{{ isIncome ? '+' : '-' }}</text>
					<text class="ac-yen">¥</text>
					<text class="ac-num">{{ absAmount }}</text>
				</view>
				<text class="ac-date">{{ flowDateText }}</text>
			</view>

			<!-- Basic Info Card -->
			<view class="detail-card card-shadow anim-fade" style="animation-delay:0.05s">
				<view class="dc-title-row">
					<svg class="s16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" style="color:#4F6AF6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
					</svg>
					<text class="dc-title">基本信息</text>
				</view>

				<view class="dc-item">
					<text class="dc-label">流水编号</text>
					<text class="dc-value dc-code">{{ flowCode }}</text>
				</view>
				<view class="dc-item">
					<text class="dc-label">流水类型</text>
					<view class="dc-value-row">
						<view class="dc-type-badge" :class="typeTagClass">{{ flowTypeName }}</view>
					</view>
				</view>
				<view class="dc-item">
					<text class="dc-label">流水日期</text>
					<text class="dc-value">{{ flowDateText }}</text>
				</view>
				<view class="dc-item">
					<text class="dc-label">金额</text>
					<text class="dc-value dc-amount" :class="isIncome ? 'val-income' : 'val-expense'">
						{{ isIncome ? '+' : '-' }}¥{{ absAmount }}
					</text>
				</view>
				<view class="dc-item">
					<text class="dc-label">经办人</text>
					<text class="dc-value">{{ handler }}</text>
				</view>
				<view class="dc-item" v-if="anchorName">
					<text class="dc-label">关联主播</text>
					<text class="dc-value">{{ anchorName }}</text>
				</view>
				<view class="dc-item">
					<text class="dc-label">提交时间</text>
					<text class="dc-value">{{ createTimeText }}</text>
				</view>
			</view>

			<!-- Remark Card -->
			<view class="detail-card card-shadow anim-fade" style="animation-delay:0.1s" v-if="remark">
				<view class="dc-title-row">
					<svg class="s16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" style="color:#F59E0B">
						<path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
					</svg>
					<text class="dc-title">备注说明</text>
				</view>
				<view class="remark-box">
					<text class="remark-text">{{ remark }}</text>
				</view>
			</view>

			<!-- Audit Status Card -->
			<view class="detail-card card-shadow anim-fade" style="animation-delay:0.15s" v-if="auditStatus !== null">
				<view class="dc-title-row">
					<svg class="s16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" style="color:#10B981">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
					</svg>
					<text class="dc-title">审核状态</text>
				</view>

				<view class="audit-status-header">
					<view class="audit-badge" :class="auditClass">
						<view v-if="auditStatus === 1" class="audit-dot au-pulse"></view>
						<text>{{ auditText }}</text>
					</view>
				</view>

				<view v-if="auditStatus === 1" class="audit-tip">
					<svg class="s14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" style="color:#F59E0B">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
					</svg>
					<text>该流水正在等待财务审核，审核通过后将计入统计</text>
				</view>

				<view class="dc-item" v-if="auditRemark">
					<text class="dc-label">审核意见</text>
					<text class="dc-value">{{ auditRemark }}</text>
				</view>
				<view class="dc-item" v-if="auditTimeText">
					<text class="dc-label">审核时间</text>
					<text class="dc-value">{{ auditTimeText }}</text>
				</view>
			</view>

			<view class="bottom-spacer"></view>
		</view>
	</view>
</template>

<script>
	const flowTypeMap = {
		'income':   { label: '收入',     tagClass: 'tt-income',   isIncome: true },
		'expense':  { label: '支出',     tagClass: 'tt-expense',  isIncome: false },
		'transfer': { label: '转账',     tagClass: 'tt-transfer', isIncome: true },
		'live':     { label: '直播流水', tagClass: 'tt-live',     isIncome: true },
	}

	export default {
		data() {
			return {
				loaded: false,
				id: null,
				flowType: '',
				flowDate: '',
				amount: 0,
				handler: '',
				anchorName: '',
				remark: '',
				createTime: '',
				auditStatus: null,
				auditRemark: '',
				auditTime: ''
			}
		},
		computed: {
			flowTypeInfo() {
				return flowTypeMap[this.flowType] || (parseFloat(this.amount) >= 0
					? { label: '收入', tagClass: 'tt-income', isIncome: true }
					: { label: '支出', tagClass: 'tt-expense', isIncome: false })
			},
			flowTypeName() { return this.flowTypeInfo.label },
			isIncome() { return this.flowTypeInfo.isIncome },
			typeTagClass() { return this.flowTypeInfo.tagClass },
			absAmount() {
				return Math.abs(this.amount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
			},
			flowCode() {
				if (!this.id) return '-'
				const d = this.createTime || this.flowDate || ''
				const ds = d.substring(0, 10).replace(/-/g, '') || '00000000'
				return '#OP' + ds + String(this.id).padStart(3, '0')
			},
			flowDateText() { return this.flowDate || '-' },
			createTimeText() {
				return this.createTime ? this.createTime.substring(0, 16) : '-'
			},
			auditTimeText() {
				return this.auditTime ? this.auditTime.substring(0, 16) : ''
			},
			auditText() {
				const map = { 1: '待审核', 2: '已通过', 3: '已驳回' }
				return map[this.auditStatus] || '未知'
			},
			auditClass() {
				const map = { 1: 'au-pending', 2: 'au-approved', 3: 'au-rejected' }
				return map[this.auditStatus] || 'au-pending'
			}
		},
		onLoad() {
			const app = getApp()
			const data = app.globalData?.flowDetailData
			if (!data) {
				uni.showToast({ title: '数据加载失败', icon: 'none' })
				setTimeout(() => { uni.navigateBack() }, 1200)
				return
			}
			this.id = data.id
			this.flowType = data.flow_type || ''
			this.flowDate = data.flow_date || ''
			this.amount = parseFloat(data.flow_amount) || 0
			this.handler = data.real_name || '未知'
			this.anchorName = data.anchor_name || ''
			this.remark = data.remark || ''
			this.createTime = data.create_time || ''
			this.auditStatus = data.audit_status !== undefined ? parseInt(data.audit_status) : null
			this.auditRemark = data.audit_remark || ''
			this.auditTime = data.audit_time || ''
			this.loaded = true
		},
		onUnload() {
			const app = getApp()
			if (app.globalData) app.globalData.flowDetailData = null
		},
		methods: {
			goBack() { uni.navigateBack() }
		}
	}
</script>

<style>
	/* Base */
	.pg { width:100%; min-height:100vh; background:#F8F9FA; font-family:-apple-system,BlinkMacSystemFont,'Noto Sans SC',sans-serif; -webkit-font-smoothing:antialiased; padding-bottom:40rpx }

	.s14 { width:28rpx; height:28rpx; flex-shrink:0 }
	.s16 { width:32rpx; height:32rpx; flex-shrink:0 }

	.card-shadow { box-shadow:0 2rpx 12rpx rgba(0,0,0,0.04) }

	/* Animations */
	@keyframes fadeSlideIn {
		from { opacity:0; transform:translateY(12rpx) }
		to   { opacity:1; transform:translateY(0) }
	}
	.anim-fade { animation:fadeSlideIn 0.35s ease-out forwards; opacity:0 }

	@keyframes pulse2 { 0%,100%{opacity:1} 50%{opacity:0.5} }
	.au-pulse { animation:pulse2 1.5s ease-in-out infinite }

	/* Header */
	.hdr { background:#fff; position:sticky; top:0; z-index:50; padding-bottom:12rpx; border-bottom:1rpx solid #E9ECEF }
	.hdr-row { display:flex; align-items:center; padding:28rpx 36rpx 0; gap:16rpx }
	.hdr-back { width:60rpx; height:60rpx; display:flex; align-items:center; justify-content:center; flex-shrink:0 }
	.hdr-title { font-size:30rpx; font-weight:700; color:#212529; flex:1 }

	/* Main */
	.main { padding:20rpx 28rpx 0 }

	/* Amount Card */
	.amount-card {
		background:linear-gradient(135deg, #1E293B, #0F172A);
		border-radius:24rpx;
		padding:36rpx 36rpx 28rpx;
		margin-bottom:20rpx;
		border:1rpx solid rgba(255,255,255,0.06);
	}
	.ac-header { margin-bottom:20rpx }
	.ac-type-tag {
		display:inline-flex; align-items:center; gap:8rpx;
		padding:8rpx 20rpx; border-radius:12rpx; font-size:22rpx; font-weight:600;
	}
	.type-dot { width:12rpx; height:12rpx; border-radius:50% }
	.tt-income .type-dot { background:#E85D4E }
	.tt-expense .type-dot { background:#2A9D5C }
	.tt-transfer .type-dot { background:#4F6AF6 }
	.tt-live .type-dot { background:#8B5CF6 }
	.tt-income { background:rgba(232,93,78,0.12); color:#FCA5A5 }
	.tt-expense { background:rgba(42,157,92,0.12); color:#6EE7B7 }
	.tt-transfer { background:rgba(79,106,246,0.12); color:#93C5FD }
	.tt-live { background:rgba(139,92,246,0.12); color:#C4B5FD }

	.ac-amount-row { display:flex; align-items:baseline; gap:4rpx; margin-bottom:10rpx }
	.ac-sign { font-size:32rpx; font-weight:700; color:rgba(255,255,255,0.6) }
	.ac-yen  { font-size:32rpx; font-weight:700; color:rgba(255,255,255,0.7) }
	.ac-num  { font-size:56rpx; font-weight:800; color:#fff; letter-spacing:-0.02em; line-height:1 }
	.ac-date { font-size:22rpx; color:rgba(255,255,255,0.4); font-weight:500 }

	/* Detail Card */
	.detail-card {
		background:#fff; border-radius:22rpx; padding:28rpx 32rpx;
		margin-bottom:20rpx; border:1rpx solid #E9ECEF;
	}
	.dc-title-row { display:flex; align-items:center; gap:10rpx; margin-bottom:20rpx; padding-bottom:16rpx; border-bottom:1rpx solid #F1F3F5 }
	.dc-title { font-size:26rpx; font-weight:700; color:#212529 }

	.dc-item { display:flex; justify-content:space-between; align-items:center; padding:16rpx 0 }
	.dc-item+.dc-item { border-top:1rpx solid #F8F9FA }
	.dc-label { font-size:24rpx; color:#868E96; flex-shrink:0; margin-right:20rpx }
	.dc-value { font-size:24rpx; font-weight:500; color:#343A40; text-align:right; flex:1; word-break:break-all }
	.dc-code { font-family:'SF Mono','Menlo',monospace; color:#ADB5BD; font-size:22rpx }
	.dc-value-row { text-align:right }
	.dc-type-badge { display:inline-flex; align-items:center; padding:6rpx 16rpx; border-radius:10rpx; font-size:20rpx; font-weight:600 }
	.dc-amount { font-size:28rpx; font-weight:700 }
	.val-income { color:#E85D4E }
	.val-expense { color:#2A9D5C }

	/* Remark Card */
	.remark-box { background:#FFFBEB; border-radius:14rpx; padding:20rpx 24rpx; border:1rpx solid #FDE68A }
	.remark-text { font-size:24rpx; color:#92400E; line-height:1.7 }

	/* Audit Card */
	.audit-status-header { margin-bottom:8rpx }
	.audit-badge { display:inline-flex; align-items:center; gap:8rpx; padding:10rpx 22rpx; border-radius:14rpx; font-size:22rpx; font-weight:600 }
	.audit-dot { width:14rpx; height:14rpx; border-radius:50% }
	.au-pending { background:#FFFBEB; border:1rpx solid #FDE68A; color:#B45309 }
	.au-pending .audit-dot { background:#F59E0B }
	.au-approved { background:#F0FDF4; border:1rpx solid #BBF7D0; color:#15803D }
	.au-rejected { background:#FEF2F2; border:1rpx solid #FECACA; color:#B91C1C }
	.audit-tip { display:flex; align-items:flex-start; gap:8rpx; background:#FFFBEB; border-radius:12rpx; padding:16rpx 20rpx; margin-bottom:12rpx; font-size:20rpx; color:#B45309; line-height:1.5 }

	.bottom-spacer { height:32rpx }
</style>
