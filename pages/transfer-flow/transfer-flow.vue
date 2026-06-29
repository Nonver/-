<template>
	<view class="pg">

		<!-- Header -->
		<view class="hdr">
			<view class="hdr-inner">
				<view class="hdr-btn" @tap="goBack">
					<svg class="s18 gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg>
				</view>
				<view class="hdr-title-group">
					<text class="hdr-title">主播流转审核</text>
					<text class="hdr-sub">中转部工作台</text>
				</view>
				<view class="hdr-btn bell-wrap">
					<svg class="s18 gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
					</svg>
					<view class="bell-dot"></view>
				</view>
			</view>
		</view>

		<!-- Main -->
		<view class="main">

			<!-- ═══ Stats ═══ -->
			<view class="stats-section">
				<view class="section-hd">
					<text class="section-hd-title">今日数据概览</text>
					<text class="section-date">{{ todayDate }}</text>
				</view>

				<!-- 当日转化 -->
				<view class="stat-card">
					<view class="stat-card-l">
						<view class="stat-icon stat-icon-brand">
							<svg class="s20 brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</view>
						<view>
							<text class="stat-label">当日转化</text>
							<text class="stat-num">{{ dayConversion }}</text>
						</view>
					</view>
					<view class="trend trend-up"><text>今日</text></view>
				</view>

				<!-- 7日留存达标 -->
				<view class="stat-card">
					<view class="stat-card-l">
						<view class="stat-icon stat-icon-blue">
							<svg class="s20 blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
							</svg>
						</view>
						<view>
							<text class="stat-label">7日留存达标</text>
							<text class="stat-num">{{ retain7d }}</text>
						</view>
					</view>
					<view class="trend trend-up"><text>达标</text></view>
				</view>

				<!-- 主播流失 -->
				<view class="stat-card">
					<view class="stat-card-l">
						<view class="stat-icon stat-icon-red">
							<svg class="s20 red" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M13 16h-1v-4h-1m1 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</view>
						<view>
							<text class="stat-label">主播流失</text>
							<text class="stat-num">{{ loseCount }}</text>
						</view>
					</view>
					<view class="trend trend-down"><text>累计</text></view>
				</view>
			</view>

			<!-- ═══ Filter Tabs ═══ -->
			<scroll-view scroll-x class="filter-scroll">
				<view class="filter-row">
					<view v-for="(f, fi) in filters" :key="fi" class="filter-chip"
						:class="currentFilter===f.key?'chip-on':'chip-off'" @tap="currentFilter=f.key">
						<text>{{ f.label }}</text>
						<text class="chip-count">{{ f.count }}</text>
					</view>
				</view>
			</scroll-view>

			<!-- ═══ Anchor List ═══ -->
			<view class="list-section">
				<view class="list-hd">
					<text class="list-hd-title">待审核主播</text>
					<text class="list-hd-count">共 {{ anchorList.length }} 位</text>
				</view>

				<view v-for="(item, idx) in anchorList" :key="idx" class="anchor-card card-shadow anim-fade"
					:style="'animation-delay:'+(idx*0.06)+'s'">

					<view class="card-body">
						<!-- Top: avatar + info + status -->
						<view class="ac-top">
							<view class="avatar-wrap">
								<view class="avatar-box" :class="item.status==='lost'?'avatar-dim':''">
									<text class="avatar-letter">{{ item.name.charAt(0) }}</text>
								</view>
								<view class="online-dot" :class="'dot-'+item.dotColor"></view>
							</view>

							<view class="ac-info">
								<view class="ac-name-row">
									<text class="ac-name"
										:class="item.status==='lost'?'name-lost':''">{{ item.name }}</text>
									<view class="status-badge" :class="'sb-'+item.statusColor">
										<view class="sb-dot" :class="'dot-'+item.statusColor"></view>
										<text>{{ item.statusText }}</text>
									</view>
								</view>
								<view class="ac-meta-row">
									<text class="meta-item">经纪: {{ item.agent }}</text>
									<text class="meta-item">{{ item.timeAgo }}</text>
								</view>
							</view>
						</view>

						<!-- Metrics grid -->
						<view class="metrics-grid">
							<view class="metric-cell" :class="item.status==='lost'?'metric-dim':''">
								<text class="metric-label">直播时长</text>
								<text class="metric-val">{{ item.hours }}</text>
							</view>
							<view class="metric-cell" :class="item.status==='lost'?'metric-dim':''">
								<text class="metric-label">粉丝数</text>
								<text class="metric-val">{{ item.fans }}</text>
							</view>
							<view class="metric-cell" :class="item.status==='lost'?'metric-dim':''">
								<text class="metric-label">收益</text>
								<text class="metric-val">{{ item.income }}</text>
							</view>
						</view>

						<!-- Progress bar (only for "maintaining") -->
						<view v-if="item.progress !== undefined" class="progress-block">
							<view class="pb-hd">
								<text class="pb-label">7日留存进度</text>
								<text class="pb-val">{{ item.progressText }}</text>
							</view>
							<view class="pb-track">
								<view class="pb-fill" :style="'width:'+item.progress+'%'"></view>
							</view>
						</view>

						<!-- Info note -->
						<view v-if="item.note" class="info-note" :class="'note-'+item.noteColor">
							<view class="note-icon" :class="'icon-'+item.noteColor"></view>
							<text class="note-text" :class="'text-'+item.noteColor">{{ item.note }}</text>
						</view>
					</view>

					<!-- Actions -->
					<view class="card-actions">
						<template v-if="item.status!=='lost' && item.status!=='transfer'">
							<view class="action-primary" @tap="handleApprove(item)">
								<svg class="s16 white" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<text>审核通过并移交</text>
							</view>
							<view class="action-danger" @tap="handleReject(item)">
								<svg class="s16 red" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
								<text>标记流失</text>
							</view>
						</template>

						<!-- Transfer/lost status: disabled buttons -->
						<template v-if="item.status==='transfer' || item.status==='lost'">
							<view class="action-disabled">
								<svg class="s16 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
									stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<text>{{ item.status==='transfer' ? '已移交运营部' : '已标记流失' }}</text>
							</view>
						</template>
					</view>
				</view>

				<!-- Load more -->
				<view class="load-more">
					<view class="load-spinner"></view>
					<text>加载更多...</text>
				</view>
			</view>

			<view class="bottom-spacer"></view>
		</view>

		<!-- Bottom Tab -->
		<!-- <view class="bottom-tab">
			<view class="bt-item bt-on">
				<view class="bt-icon-bg brand-bg">
					<svg class="s20 brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
					</svg>
				</view>
				<text class="bt-label-on">审核</text>
			</view>
			<view class="bt-item">
				<view class="bt-icon-bg gray-bg">
					<svg class="s20 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
					</svg>
				</view>
				<text class="bt-label-off">数据</text>
			</view>
			<view class="bt-item">
				<view class="bt-icon-bg gray-bg">
					<svg class="s20 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
	import { api } from '@/utils/api.js'

	function timeAgoText(t) {
		if (!t) return ''
		const diff = Date.now() - new Date(t).getTime()
		const mins = Math.floor(diff / 60000)
		if (mins < 60) return mins <= 0 ? '刚刚' : mins + '分钟前'
		const hours = Math.floor(mins / 60)
		if (hours < 24) return hours + '小时前'
		const days = Math.floor(hours / 24)
		if (days < 30) return days + '天前'
		return Math.floor(days / 30) + '月前'
	}

	export default {
		data() {
			const n = new Date()
			return {
				todayDate: n.getFullYear() + '.' + String(n.getMonth()+1).padStart(2,'0') + '.' + String(n.getDate()).padStart(2,'0'),
				currentFilter: 'all',
				filters: [
					{ key: 'all', label: '全部', count: 0 },
					{ key: 'followup', label: '待跟进', count: 0 },
					{ key: 'maintaining', label: '维护中', count: 0 },
					{ key: 'transfer', label: '待移交', count: 0 },
					{ key: 'lost', label: '已流失', count: 0 }
				],
				anchorList: [],
				toastVisible: false,
				toastMsg: '',
				dayConversion: 0,
				retain7d: 0,
				loseCount: 0,
				loading: false
			}
		},
		onShow() {
			this.$checkAuth()
			this.fetchData()
		},
		watch: {
			currentFilter() {
				this.fetchData()
			}
		},
		methods: {
			goBack() { uni.navigateBack({ delta: 1 }) },
			async fetchData() {
				this.loading = true
				try {
					const params = this.currentFilter !== 'all' ? { status: this.currentFilter } : {}
					const [flowRes, statsRes] = await Promise.all([
						api.get('/api/admin/transfer/anchor-flow', params, { silent: true }),
						api.get('/api/admin/transfer/anchor-stats', null, { silent: true })
					])

					// 统计数据
					if (statsRes.code === 200 && statsRes.data) {
						this.dayConversion = statsRes.data.dayConversion || 0
						this.retain7d = statsRes.data.retain7d || 0
						this.loseCount = statsRes.data.loseCount || 0
						// 更新筛选数量
						const sc = statsRes.data.statusCounts || []
						const m = {}
						sc.forEach(s => { m[s.status_key] = s.count })
						let total = 0
						this.filters.forEach(f => {
							const c = m[f.key] || 0
							f.count = c
							total += (f.key === 'all' ? 0 : c)
						})
						this.filters.find(f => f.key === 'all').count = total
					}

					// 流转列表
					if (flowRes.code === 200) {
						this.anchorList = (flowRes.data || []).map(r => {
							const isLost = r.lose_status == 1
							const isTransfer = r.transfer_status == 1
							const isRetained7 = r.retain_7d_status == 1
							const isRetained30 = r.retain_30d_status == 1

							let statusKey, statusText, statusColor, dotColor, noteStr, noteColor
							if (isLost) {
								statusKey = 'lost'
								statusText = '主播流失'
								statusColor = 'red'
								dotColor = 'gray'
								noteStr = '已标记为流失状态'
								noteColor = 'red'
							} else if (isTransfer) {
								statusKey = 'transfer'
								statusText = '已移交'
								statusColor = 'green'
								dotColor = 'green'
								noteStr = r.follow_record || '已移交运营部，成为正式员工'
								noteColor = 'green'
							} else if (isRetained7 || isRetained30) {
								statusKey = isRetained30 ? 'retained30' : 'retained7'
								statusText = isRetained30 ? '30日留存达标' : '7日留存达标'
								statusColor = 'green'
								dotColor = 'green'
								noteStr = r.follow_record || '留存达标，建议安排运营团队对接'
								noteColor = 'green'
							} else {
								statusKey = r.follow_record ? 'maintaining' : 'followup'
								statusText = r.follow_record ? '跟进维护中' : '新人待跟进'
								statusColor = r.follow_record ? 'orange' : 'blue'
								dotColor = 'green'
								noteStr = r.follow_record || '新人主播，首次开播需重点跟进指导'
								noteColor = r.follow_record ? '' : 'amber'
							}

							return {
								id: r.id,
								recruit_id: r.recruit_id,
								name: r.anchor_name || '未命名',
								agent: r.agent_name || (r.recruit_user ? '经纪' + r.recruit_user : ''),
								timeAgo: timeAgoText(r.create_time),
								status: statusKey,
								statusText: statusText,
								statusColor: statusColor,
								dotColor: dotColor,
								hours: '0h',
								fans: '0',
								income: '¥0',
								progress: isRetained7 && !isRetained30 ? 57 : undefined,
								progressText: isRetained7 && !isRetained30 ? '4/7 天' : undefined,
								note: noteStr,
								noteColor: noteColor
							}
						})
					}
				} catch (e) {
					console.error('主播流转记录获取失败:', e)
				} finally {
					this.loading = false
				}
			},
			handleApprove(item) {
				this.doTransfer(item)
			},
			handleReject(item) {
				this.doMarkLose(item)
			},
			async doTransfer(item) {
				try {
					await api.post('/api/admin/transfer/anchor-flow/' + item.id + '/transfer')
					this.showToast('已通过并移交: ' + item.name)
					this.fetchData()
				} catch (e) {
					this.showToast('操作失败')
				}
			},
			async doMarkLose(item) {
				try {
					await api.post('/api/admin/transfer/anchor-flow/' + item.id + '/lose')
					this.showToast('已标记流失: ' + item.name)
					this.fetchData()
				} catch (e) {
					this.showToast('操作失败')
				}
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
		background: #f5f5f7;
		font-family: -apple-system, BlinkMacSystemFont, 'Noto Sans SC', sans-serif;
		-webkit-font-smoothing: antialiased;
		padding-bottom: 160rpx
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
		color: #9ca3af
	}

	.gray-600 {
		color: #4b5563
	}

	.brand {
		color: #14b8a6
	}

	.blue {
		color: #3b82f6
	}

	.red {
		color: #ef4444
	}

	.green {
		color: #22c55e
	}

	/* Anim */
	@keyframes fadeSlideIn {
		from {
			opacity: 0;
			transform: translateY(8rpx)
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

	/* Header */
	.hdr {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(12px);
		border-bottom: 1rpx solid #f3f4f6
	}

	.hdr-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 28rpx 32rpx;
		padding-top: 48rpx
	}

	.hdr-btn {
		width: 52rpx;
		height: 52rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 20rpx;
		background: #f9fafb;
		position: relative
	}

	.hdr-btn:active {
		background: #f3f4f6
	}

	.bell-wrap {
		position: relative
	}

	.bell-dot {
		position: absolute;
		top: 14rpx;
		right: 14rpx;
		width: 12rpx;
		height: 12rpx;
		background: #ef4444;
		border-radius: 50%
	}

	.hdr-title-group {
		display: flex;
		flex-direction: column
	}

	.hdr-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #111827;
		line-height: 1.2
	}

	.hdr-sub {
		font-size: 20rpx;
		color: #9ca3af;
		margin-top: 2rpx
	}

	/* Main */
	.main {}

	/* Stats Section */
	.stats-section {
		padding: 28rpx 32rpx 16rpx
	}

	.section-hd {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx
	}

	.section-hd-title {
		font-size: 26rpx;
		font-weight: 700;
		color: #111827
	}

	.section-date {
		font-size: 20rpx;
		color: #9ca3af
	}

	.stat-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border-radius: 24rpx;
		padding: 28rpx 32rpx;
		margin-bottom: 18rpx;
		box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06), 0 0 2rpx rgba(0, 0, 0, 0.08);
	}

	.stat-card-l {
		display: flex;
		align-items: center;
		gap: 20rpx
	}

	.stat-icon {
		width: 72rpx;
		height: 72rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.stat-icon-brand {
		background: #f0fdfa
	}

	.stat-icon-blue {
		background: #eff6ff
	}

	.stat-icon-red {
		background: #fef2f2
	}

	.stat-label {
		font-size: 20rpx;
		color: #6b7280;
		display: block;
		margin-bottom: 4rpx
	}

	.stat-num {
		font-size: 44rpx;
		font-weight: 900;
		color: #111827;
		line-height: 1
	}

	.trend {
		display: flex;
		align-items: center;
		gap: 6rpx;
		padding: 10rpx 18rpx;
		border-radius: 14rpx;
		font-size: 20rpx;
		font-weight: 600
	}

	.trend-up {
		background: #f0fdf4;
		color: #22c55e
	}

	.trend-down {
		background: #fef2f2;
		color: #ef4444
	}

	/* Filter Scroll */
	.filter-scroll {
		white-space: nowrap;
		padding: 16rpx 32rpx 8rpx
	}

	.filter-row {
		display: inline-flex;
		gap: 14rpx
	}

	.filter-chip {
		display: inline-flex;
		align-items: center;
		gap: 8rpx;
		padding: 16rpx 28rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		font-weight: 500;
		border: 1rpx solid transparent;
		flex-shrink: 0;
	}

	.chip-on {
		background: #14b8a6;
		color: #fff;
		box-shadow: 0 4rpx 16rpx rgba(20, 184, 166, 0.2)
	}

	.chip-off {
		background: #fff;
		color: #6b7280;
		border-color: #e5e7eb
	}

	.chip-count {
		font-size: 18rpx;
		opacity: 0.8
	}

	/* List */
	.list-section {
		padding: 16rpx 32rpx 0
	}

	.list-hd {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx
	}

	.list-hd-title {
		font-size: 26rpx;
		font-weight: 700;
		color: #111827
	}

	.list-hd-count {
		font-size: 20rpx;
		color: #9ca3af
	}

	/* Anchor Card */
	.anchor-card {
		background: #fff;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06), 0 0 2rpx rgba(0, 0, 0, 0.08);
		overflow: hidden;
		margin-bottom: 20rpx;
	}

	.card-shadow {
		box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06), 0 0 2rpx rgba(0, 0, 0, 0.08)
	}

	.card-body {
		padding: 28rpx
	}

	/* Avatar */
	.ac-top {
		display: flex;
		gap: 20rpx;
		margin-bottom: 20rpx
	}

	.avatar-wrap {
		position: relative;
		flex-shrink: 0
	}

	.avatar-box {
		width: 88rpx;
		height: 88rpx;
		border-radius: 20rpx;
		background: linear-gradient(135deg, #14b8a6, #2dd4bf);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.avatar-dim {
		background: linear-gradient(135deg, #e5e7eb, #d1d5db);
		filter: grayscale(100%)
	}

	.avatar-letter {
		font-size: 32rpx;
		font-weight: 700;
		color: #fff
	}

	.online-dot {
		position: absolute;
		bottom: -2rpx;
		right: -2rpx;
		width: 24rpx;
		height: 24rpx;
		border-radius: 50%;
		border: 3rpx solid #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.dot-green {
		background: #22c55e
	}

	.dot-yellow {
		background: #eab308
	}

	.dot-gray {
		background: #9ca3af
	}

	/* Info */
	.ac-info {
		flex: 1;
		min-width: 0
	}

	.ac-name-row {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 8rpx;
		flex-wrap: wrap
	}

	.ac-name {
		font-size: 28rpx;
		font-weight: 700;
		color: #111827
	}

	.name-lost {
		color: #9ca3af
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 8rpx;
		padding: 6rpx 16rpx;
		border-radius: 12rpx;
		font-size: 18rpx;
		font-weight: 500;
	}

	.sb-dot {
		width: 10rpx;
		height: 10rpx;
		border-radius: 50%;
		flex-shrink: 0
	}

	.sb-blue {
		background: #eff6ff;
		color: #3b82f6;
		border: 1rpx solid #dbeafe
	}

	.sb-orange {
		background: #fff7ed;
		color: #ea580c;
		border: 1rpx solid #fed7aa
	}

	.sb-green {
		background: #f0fdf4;
		color: #16a34a;
		border: 1rpx solid #bbf7d0
	}

	.sb-purple {
		background: #faf5ff;
		color: #a855f7;
		border: 1rpx solid #e9d5ff
	}

	.sb-red {
		background: #fef2f2;
		color: #dc2626;
		border: 1rpx solid #fecaca
	}

	.dot-blue {
		background: #3b82f6
	}

	.dot-orange {
		background: #ea580c
	}

	.dot-green {
		background: #16a34a
	}

	.dot-purple {
		background: #a855f7
	}

	.dot-red {
		background: #dc2626
	}

	.ac-meta-row {
		display: flex;
		gap: 20rpx
	}

	.meta-item {
		font-size: 20rpx;
		color: #9ca3af;
		display: flex;
		align-items: center;
		gap: 6rpx
	}

	/* Metrics */
	.metrics-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 12rpx;
		margin-bottom: 20rpx
	}

	.metric-cell {
		background: #f9fafb;
		border-radius: 16rpx;
		padding: 16rpx 12rpx;
		text-align: center
	}

	.metric-dim {
		background: #f3f4f6
	}

	.metric-label {
		font-size: 18rpx;
		color: #9ca3af;
		display: block;
		margin-bottom: 4rpx
	}

	.metric-val {
		font-size: 24rpx;
		font-weight: 700;
		color: #1f2937
	}

	/* Progress */
	.progress-block {
		margin-bottom: 20rpx
	}

	.pb-hd {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10rpx
	}

	.pb-label {
		font-size: 20rpx;
		color: #6b7280
	}

	.pb-val {
		font-size: 20rpx;
		font-weight: 600;
		color: #14b8a6
	}

	.pb-track {
		height: 12rpx;
		background: #f3f4f6;
		border-radius: 9999rpx;
		overflow: hidden
	}

	.pb-fill {
		height: 12rpx;
		background: linear-gradient(90deg, #2dd4bf, #14b8a6);
		border-radius: 9999rpx;
		transition: width 0.6s ease
	}

	/* Info Note */
	.info-note {
		display: flex;
		gap: 14rpx;
		border-radius: 16rpx;
		padding: 20rpx 24rpx
	}

	.note-icon {
		flex-shrink: 0;
		width: 28rpx;
		height: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 2rpx
	}

	.note-text {
		font-size: 20rpx;
		line-height: 1.6;
		flex: 1
	}

	.note-amber {
		background: #fffbeb
	}

	.icon-amber {
		color: #d97706
	}

	.text-amber {
		color: #92400e
	}

	.note-green {
		background: #f0fdf4
	}

	.icon-green {
		color: #16a34a
	}

	.text-green {
		color: #166534
	}

	.note-purple {
		background: #faf5ff
	}

	.icon-purple {
		color: #a855f7
	}

	.text-purple {
		color: #7e22ce
	}

	.note-red {
		background: #fef2f2
	}

	.icon-red {
		color: #dc2626
	}

	.text-red {
		color: #991b1b
	}

	/* Actions */
	.card-actions {
		padding: 0 28rpx 28rpx;
		display: flex;
		flex-direction: column;
		gap: 14rpx
	}

	.action-primary {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		height: 80rpx;
		border-radius: 20rpx;
		background: linear-gradient(135deg, #14b8a6, #0d9488);
		color: #fff;
		font-size: 24rpx;
		font-weight: 600;
		box-shadow: 0 8rpx 24rpx rgba(20, 184, 166, 0.25);
	}

	.action-primary:active {
		opacity: 0.9
	}

	.action-danger {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		height: 80rpx;
		border-radius: 20rpx;
		background: #fef2f2;
		color: #dc2626;
		border: 1rpx solid #fecaca;
		font-size: 24rpx;
		font-weight: 600;
	}

	.action-danger:active {
		background: #fee2e2
	}

	.action-purple {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		height: 80rpx;
		border-radius: 20rpx;
		background: #a855f7;
		color: #fff;
		font-size: 24rpx;
		font-weight: 600;
		box-shadow: 0 8rpx 24rpx rgba(168, 85, 247, 0.25);
	}

	.action-purple:active {
		opacity: 0.9
	}

	.action-disabled {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		height: 80rpx;
		border-radius: 20rpx;
		background: #f3f4f6;
		color: #9ca3af;
		font-size: 24rpx;
		font-weight: 500;
	}

	/* Load More */
	.load-more {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		padding: 36rpx 0
	}

	.load-more text {
		font-size: 20rpx;
		color: #9ca3af
	}

	.load-spinner {
		width: 24rpx;
		height: 24rpx;
		border: 2rpx solid #e5e7eb;
		border-top-color: #9ca3af;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg)
		}
	}

	/* Bottom Tab */
	.bottom-tab {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #fff;
		border-top: 1rpx solid #f3f4f6;
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
		width: 64rpx;
		height: 64rpx;
		border-radius: 18rpx;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.brand-bg {
		background: #f0fdfa
	}

	.gray-bg {
		background: #f9fafb
	}

	.bt-label-on {
		font-size: 18rpx;
		font-weight: 600;
		color: #0d9488
	}

	.bt-label-off {
		font-size: 18rpx;
		font-weight: 500;
		color: #9ca3af
	}

	/* Spacer */
	.bottom-spacer {
		height: 64rpx
	}

	/* Toast */
	.toast {
		position: fixed;
		top: 160rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 200;
		background: rgba(31, 41, 55, 0.92);
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