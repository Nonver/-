<template>
	<view class="pg">
		<view>

			<!-- 顶部导航 -->
			<view class="header">
				<view class="hdr-row">
					<view>
						<text class="hdr-title">考核初审</text>
						<text class="hdr-sub">财务部 · 前置合规初审</text>
					</view>
					<view class="hdr-bell" @tap="onNotify">
						<svg class="s16 ink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
						</svg>
					</view>
				</view>

				<!-- Tab 切换 -->
				<view class="tabs">
					<view class="tab" :class="tab==='pending' ? 'tab-on' : 'tab-off'" @tap="tab='pending'">
						<text>待初审</text>
						<text class="tab-badge" v-if="pendingCount">{{ pendingCount }}</text>
					</view>
					<view class="tab" :class="tab==='approved' ? 'tab-on' : 'tab-off'" @tap="tab='approved'">
						<text>已通过</text>
						<text class="tab-badge tab-badge-green" v-if="approvedCount">{{ approvedCount }}</text>
					</view>
					<view class="tab" :class="tab==='rejected' ? 'tab-on' : 'tab-off'" @tap="tab='rejected'">
						<text>已驳回</text>
						<text class="tab-badge tab-badge-red" v-if="rejectedCount">{{ rejectedCount }}</text>
					</view>
				</view>
			</view>

			<view class="main">

				<!-- === 待初审 === -->
				<view v-if="tab==='pending'">
					<view class="card" v-for="(item, idx) in pendingList" :key="item.id"
						:style="{animationDelay: (idx*0.08)+'s'}">
						<view class="card-body">
							<view class="card-tag-row">
								<view class="dept-tag" :style="{background: item.tagBg, color: item.tagColor}">
									{{ item.dept }}</view>
								<text class="card-date">{{ item.month }}</text>
							</view>

							<view class="info-row"><text class="info-label">考核周期</text><text
									class="info-val">{{ item.period }}</text></view>
							<view class="info-row"><text class="info-label">考核指标</text><text
									class="info-val">{{ item.metrics }}</text></view>
							<view class="info-row"><text class="info-label">提交时间</text><text
									class="info-val ink-600">{{ item.time }}</text></view>
						</view>

						<view class="card-action">
							<textarea class="card-textarea" v-model="item.note" placeholder="请输入初审意见或备注..." />
							<view class="action-btns">
								<view class="abtn abtn-primary" @tap="approveItem(item)">通过初审</view>
								<view class="abtn abtn-outline" @tap="rejectItem(item)">驳回</view>
							</view>
						</view>
					</view>
				</view>

				<!-- === 已通过 === -->
				<view v-if="tab==='approved'">
					<view class="card" v-for="item in approvedList" :key="item.id">
						<view class="card-body">
							<view class="card-tag-row">
								<view class="card-tag-left">
									<view class="dept-tag" :style="{background: item.tagBg, color: item.tagColor}">
										{{ item.dept }}</view>
									<view class="status-tag status-pass">
										<view class="status-dot dot-green"></view>
										<text>已通过</text>
									</view>
								</view>
								<text class="card-date">{{ item.month }}</text>
							</view>

							<view class="info-row"><text class="info-label">考核周期</text><text
									class="info-val">{{ item.period }}</text></view>
							<view class="info-row"><text class="info-label">考核指标</text><text
									class="info-val">{{ item.metrics }}</text></view>
							<view class="info-row"><text class="info-label">提交时间</text><text
									class="info-val ink-600">{{ item.time }}</text></view>
							<view class="info-row"><text class="info-label">初审备注</text><text
									class="info-val ink-600">{{ item.note }}</text></view>
						</view>

						<view class="card-footer">
							<text class="foot-label">通过时间</text>
							<text class="foot-val">{{ item.passTime }}</text>
						</view>
					</view>
				</view>

				<!-- === 已驳回 === -->
				<view v-if="tab==='rejected'">
					<view class="card" v-for="item in rejectedList" :key="item.id">
						<view class="card-body">
							<view class="card-tag-row">
								<view class="card-tag-left">
									<view class="dept-tag" :style="{background: item.tagBg, color: item.tagColor}">
										{{ item.dept }}</view>
									<view class="status-tag status-reject">
										<view class="status-dot dot-red"></view>
										<text>已驳回</text>
									</view>
								</view>
								<text class="card-date">{{ item.month }}</text>
							</view>

							<view class="info-row"><text class="info-label">考核周期</text><text
									class="info-val">{{ item.period }}</text></view>
							<view class="info-row"><text class="info-label">考核指标</text><text
									class="info-val">{{ item.metrics }}</text></view>
							<view class="info-row"><text class="info-label">提交时间</text><text
									class="info-val ink-600">{{ item.time }}</text></view>
							<view class="info-row"><text class="info-label">驳回原因</text><text
									class="info-val red fw5">{{ item.reason }}</text></view>
						</view>

						<view class="card-footer">
							<text class="foot-label">驳回时间</text>
							<text class="foot-val">{{ item.rejectTime }}</text>
						</view>
					</view>
				</view>

				<!-- 权限提示 -->
				<view class="perm-tip">
					<svg class="s16 ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<view>
						<text class="perm-text">您当前为<text
								class="fw6 ink-700">财务部初审权限</text>，无终审权限，仅可查看初审范围内数据。终审结果以总经办审核为准。</text>
					</view>
				</view>

				<view class="safe-btm"></view>

			</view>

			<!-- Toast -->
			<view class="toast" v-if="toastVisible"><text>{{ toastMsg }}</text></view>



			<bottom-nav :items="navItems" :current="currentView" @change="onNavChange" />

		</view>

	</view>
</template>

<script>
	import BottomNav from '@/components/bottom-nav.vue'
	import { api } from '@/utils/api.js'

	// ── 部门标签配色映射 ──
	const DEPT_TAG_STYLES = [
		{ tagBg: '#F0F9FF', tagColor: '#0EA5E9' },
		{ tagBg: '#FFFBEB', tagColor: '#D97706' },
		{ tagBg: '#ECFDF5', tagColor: '#059669' },
		{ tagBg: '#FFF1F2', tagColor: '#E11D48' },
		{ tagBg: '#EDE9FE', tagColor: '#7C3AED' },
		{ tagBg: '#FEF2F2', tagColor: '#DC2626' },
		{ tagBg: '#F0FDF4', tagColor: '#16A34A' },
	]

	/** 格式化日期 Y-m-d H:i:s → YYYY-MM-DD HH:MM */
	function fmtTime(t) {
		if (!t) return ''
		return String(t).replace('T', ' ').substring(0, 16)
	}

	/** 将API返回的一行转为页面展示格式 */
	function mapRow(r, idx) {
		const style = DEPT_TAG_STYLES[idx % DEPT_TAG_STYLES.length]
		return {
			id: r.id,
			dept: r.dept_name || '',
			month: (r.period || '').substring(0, 7) || '',
			period: r.period || '',
			metrics: r.metrics || r.indicators || '',
			time: fmtTime(r.submit_time || r.create_time),
			note: r.review_note || r.note || '',
			reason: r.reject_reason || r.reason || '',
			passTime: fmtTime(r.review_time || r.approve_time),
			rejectTime: fmtTime(r.review_time || r.reject_time),
			tagBg: style.tagBg,
			tagColor: style.tagColor,
		}
	}

	export default {
		components: {
			BottomNav
		},
		data() {
			return {
				currentView: 'audit',
			navItems: [{
					key: 'audit',
					label: '考核审核',
					page: ''
				},
				{
					key: 'flowAudit',
					label: '流水审核',
					page: '/pages/flow-review/flow-review'
				},
				{
					key: 'review',
					label: '财务流水',
					page: '/pages/flow-ledger/flow-ledger'
				},
				{
					key: 'inuser',
					label: '人员管理',
					page: '/pages/personnel-manage/personnel-manage'
				},
				{
					key: 'profile',
					label: '个人中心',
					page: '/pages/my/my'
				},
			],
				tab: 'pending',
				pendingList: [],
				approvedList: [],
				rejectedList: [],
				pendingCount: 0,
				approvedCount: 0,
				rejectedCount: 0,
				loading: false,
				toastVisible: false,
				toastMsg: '',
			}
		},
		onShow() {
			this.$checkAuth()
			this.fetchReviews()
		},
		methods: {
			/* ── 获取审核列表 ── */
			async fetchReviews() {
				this.loading = true
				try {
					const [histRes, pendingRes, approvedRes, rejectedRes] = await Promise.all([
						api.get('/api/admin/finance/reviews', null, { silent: true }),
						api.get('/api/admin/finance/pending', null, { silent: true }),
						api.get('/api/admin/finance/reviews', { status: 'approved' }, { silent: true }),
						api.get('/api/admin/finance/reviews', { status: 'rejected' }, { silent: true }),
					])

					// 统计数据
					if (histRes.code === 200 && histRes.data) {
						this.approvedCount = histRes.data.approvedCount || 0
						this.rejectedCount = histRes.data.rejectedCount || 0
					}

					// 待初审列表（来自 dept_assess_publish 表，assess_status=1）
					if (pendingRes.code === 200) {
						this.pendingList = (pendingRes.data || []).map(mapRow)
						this.pendingCount = this.pendingList.length
					}
					if (approvedRes.code === 200) {
						this.approvedList = (approvedRes.data.list || approvedRes.data || []).map(mapRow)
					}
					if (rejectedRes.code === 200) {
						this.rejectedList = (rejectedRes.data.list || rejectedRes.data || []).map(mapRow)
					}
				} catch (e) {
					console.error('[考核初审] 获取审核列表失败:', e)
				} finally {
					this.loading = false
				}
			},

			/* ── 通过初审 ── */
			async approveItem(item) {
				try {
					await api.post('/api/admin/finance/reviews/' + item.id + '/approve', {
						note: item.note || ''
					})
					this.showToast('初审已通过')
					this.fetchReviews()
				} catch (e) {
					this.showToast('操作失败')
				}
			},

			/* ── 驳回 ── */
			async rejectItem(item) {
				const reason = item.note || '数据不符合合规要求'
				if (!item.note || !item.note.trim()) {
					this.showToast('请填写驳回原因')
					return
				}
				try {
					await api.post('/api/admin/finance/reviews/' + item.id + '/reject', {
						reason: item.note
					})
					this.showToast('已驳回')
					this.fetchReviews()
				} catch (e) {
					this.showToast('操作失败')
				}
			},

			onNavChange(key) {
				if (key === 'audit') {
					this.currentView = 'audit'
					return
				}
			},
			onNotify() {
				this.showToast('暂无新通知')
			},
			showToast(msg) {
				this.toastMsg = msg
				this.toastVisible = true
				clearTimeout(this._tt)
				this._tt = setTimeout(() => {
					this.toastVisible = false
				}, 2000)
			}
		}
	}
</script>

<style>
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #F8FAFC;
		font-family: 'DM Sans', 'Noto Sans SC', 'PingFang SC', system-ui, sans-serif;
		-webkit-font-smoothing: antialiased
	}

	/* typo */
	.t11 {
		font-size: 22rpx
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

	.t18 {
		font-size: 36rpx
	}

	.t20 {
		font-size: 40rpx
	}

	.fw5 {
		font-weight: 500
	}

	.fw6 {
		font-weight: 600
	}

	.ink-400 {
		color: #94A3B8
	}

	.ink-500 {
		color: #64748B
	}

	.ink-600 {
		color: #475569
	}

	.ink-700 {
		color: #334155
	}

	.ink-900 {
		color: #0F172A
	}

	.red {
		color: #E11D48
	}

	.s16 {
		width: 32rpx;
		height: 32rpx;
		flex-shrink: 0
	}

	/* header */
	.header {
		position: sticky;
		top: 0;
		z-index: 40;
		background: #fff;
		border-bottom: 1rpx solid #E2E8F0
	}

	.hdr-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		padding: 40rpx 36rpx 0
	}

	.hdr-title {
		font-size: 40rpx;
		font-weight: 700;
		color: #0F172A;
		display: block
	}

	.hdr-sub {
		font-size: 24rpx;
		color: #94A3B8;
		font-weight: 500;
		display: block;
		margin-top: 4rpx
	}

	.hdr-bell {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		background: #F1F5F9;
		display: flex;
		align-items: center;
		justify-content: center
	}

	/* tabs */
	.tabs {
		display: flex;
		flex-direction: row;
		padding: 28rpx 36rpx 0
	}

	.tab {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 12rpx;
		padding: 24rpx 0;
		font-size: 28rpx;
		border-bottom: 4rpx solid transparent
	}

	.tab-on {
		font-weight: 600;
		color: #0F172A;
		border-bottom-color: #0F172A
	}

	.tab-off {
		font-weight: 500;
		color: #94A3B8
	}

	.tab-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 40rpx;
		height: 40rpx;
		padding: 0 8rpx;
		border-radius: 9999rpx;
		background: #0F172A;
		color: #fff;
		font-size: 20rpx;
		font-weight: 700
	}

	.tab-badge-green {
		background: #ECFDF5;
		color: #059669
	}

	.tab-badge-red {
		background: #FFF1F2;
		color: #E11D48
	}

	/* main */
	.main {
		padding: 32rpx 32rpx 0
	}

	/* card */
	.card {
		background: #fff;
		border-radius: 24rpx;
		border: 1rpx solid #E2E8F0;
		margin-bottom: 32rpx;
		overflow: hidden;
		animation: slideIn .35s ease-out both
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(24rpx)
		}

		to {
			opacity: 1;
			transform: translateY(0)
		}
	}

	.card-body {
		padding: 40rpx 40rpx 0
	}

	.card-tag-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx
	}

	.card-tag-left {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 16rpx
	}

	.dept-tag {
		padding: 8rpx 24rpx;
		border-radius: 16rpx;
		font-size: 24rpx;
		font-weight: 700;
		letter-spacing: 1px
	}

	.card-date {
		font-size: 22rpx;
		color: #94A3B8;
		font-weight: 500
	}

	.status-tag {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 12rpx;
		padding: 8rpx 20rpx;
		border-radius: 12rpx;
		font-size: 22rpx;
		font-weight: 700
	}

	.status-pass {
		background: #ECFDF5;
		color: #059669
	}

	.status-reject {
		background: #FFF1F2;
		color: #E11D48
	}

	.status-dot {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%
	}

	.dot-green {
		background: #10B981
	}

	.dot-red {
		background: #F43F5E
	}

	/* info rows */
	.info-row {
		display: flex;
		flex-direction: row;
		margin-bottom: 24rpx
	}

	.info-label {
		font-size: 22rpx;
		color: #94A3B8;
		font-weight: 500;
		text-transform: uppercase;
		width: 128rpx;
		flex-shrink: 0
	}

	.info-val {
		font-size: 28rpx;
		color: #1E293B;
		flex: 1;
		font-weight: 500;
		line-height: 1.5
	}

	/* action */
	.card-action {
		padding: 28rpx 40rpx 40rpx;
		border-top: 1rpx solid #F1F5F9
	}

	.card-textarea {
		width: 100%;
		height: 180rpx;
		padding: 24rpx 28rpx;
		font-size: 28rpx;
		color: #1E293B;
		background: #F8FAFC;
		border: 1rpx solid #E2E8F0;
		border-radius: 16rpx;
		box-sizing: border-box;
		line-height: 1.5;
		margin-bottom: 24rpx
	}

	.card-textarea::placeholder {
		color: #CBD5E1
	}

	.action-btns {
		display: flex;
		flex-direction: column;
		gap: 20rpx
	}

	.abtn {
		width: 100%;
		height: 88rpx;
		border-radius: 16rpx;
		font-size: 28rpx;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.abtn-primary {
		background: #0F172A;
		color: #fff
	}

	.abtn-primary:active {
		opacity: .9
	}

	.abtn-outline {
		background: #fff;
		color: #475569;
		border: 1rpx solid #E2E8F0
	}

	.abtn-outline:active {
		background: #F8FAFC
	}

	/* card footer */
	.card-footer {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 40rpx;
		background: #F8FAFC;
		border-top: 1rpx solid #F1F5F9
	}

	.foot-label {
		font-size: 22rpx;
		color: #94A3B8;
		font-weight: 500
	}

	.foot-val {
		font-size: 24rpx;
		color: #475569;
		font-weight: 600
	}

	/* perm tip */
	.perm-tip {
		display: flex;
		flex-direction: row;
		gap: 24rpx;
		padding: 28rpx 32rpx;
		background: #F1F5F9;
		border-radius: 24rpx;
		border: 1rpx solid #E2E8F0;
		margin-bottom: 80rpx
	}

	.perm-text {
		font-size: 24rpx;
		color: #64748B;
		line-height: 1.6
	}

	/* toast */
	.toast {
		position: fixed;
		top: 160rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 200;
		background: #0F172A;
		color: #fff;
		font-size: 28rpx;
		font-weight: 500;
		padding: 24rpx 40rpx;
		border-radius: 24rpx;
		animation: fadeIn .2s ease-out
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(-16rpx)
		}

		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0)
		}
	}

	.safe-btm {
		height: 48rpx
	}
</style>