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
				<text class="hdr-title">全部流水明细</text>
			</view>

			<!-- Search Bar -->
			<view class="search-section">
				<view class="search-box">
					<svg class="s16 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
					</svg>
					<input class="search-input" v-model="keyword" placeholder="搜索备注、经办人..." placeholder-class="search-ph" @confirm="onSearch" />
					<view v-if="keyword" class="search-clear" @tap="keyword=''; onSearch()">✕</view>
				</view>
			</view>
		</view>

		<!-- Date Filter -->
		<view class="filter-row">
			<picker mode="date" :value="startDate" @change="onStartDateChange">
				<view class="filter-input">
					<text :class="startDate?'di-text':'di-placeholder'">{{ startDate || '开始日期' }}</text>
				</view>
			</picker>
			<text class="sep">~</text>
			<picker mode="date" :value="endDate" @change="onEndDateChange">
				<view class="filter-input">
					<text :class="endDate?'di-text':'di-placeholder'">{{ endDate || '结束日期' }}</text>
				</view>
			</picker>
			<view class="filter-btn" @tap="fetchData(true)">筛选</view>
		</view>

		<!-- Record List -->
		<view class="record-list card-shadow">
			<view v-for="(r, ri) in recordList" :key="ri" class="record-item" @tap="goDetail(r)">
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

			<view v-if="recordList.length===0 && !loading" class="empty-state">
				<text class="empty-text">暂无流水记录</text>
			</view>
		</view>

		<!-- Load More -->
		<view v-if="hasMore && recordList.length>0" class="load-more-btn" @tap="loadMore">
			<text>{{ loading ? '加载中...' : '加载更多记录' }}</text>
		</view>
		<view v-if="!hasMore && recordList.length>0" class="no-more-text">已加载全部记录</view>

		<view class="bottom-spacer"></view>

		<!-- Toast -->
		<view class="toast" :class="toastVisible?'toast-show':''">
			<text class="toast-text">{{ toastMsg }}</text>
		</view>
	</view>
</template>

<script>
	import { api } from '@/utils/api.js'

	function fmtDateLabel(d, td) {
		if (!d) return ''
		if (d === td) return '今天'
		const yesterday = new Date()
		yesterday.setDate(yesterday.getDate() - 1)
		if (d === yesterday.toISOString().substring(0, 10)) return '昨天'
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

	export default {
		data() {
			return {
				keyword: '',
				startDate: '',
				endDate: '',
				recordList: [],
				page: 1,
				pageSize: 20,
				hasMore: true,
				loading: false,
				toastVisible: false,
				toastMsg: ''
			}
		},
		onShow() {
			this.$checkAuth()
			this.fetchData(true)
		},
		methods: {
			goBack() { uni.navigateBack() },

			onStartDateChange(e) { this.startDate = e.detail.value },
			onEndDateChange(e) { this.endDate = e.detail.value },

			onSearch() {
				this.page = 1
				this.hasMore = true
				this.fetchData(true)
			},

			async fetchData(reset) {
				if (reset) { this.page = 1; this.hasMore = true; this.recordList = [] }
				this.loading = true
				try {
					const params = {
						page: this.page,
						page_size: this.pageSize
					}
					if (this.keyword) params.keyword = this.keyword
					if (this.startDate) params.start_date = this.startDate
					if (this.endDate) params.end_date = this.endDate

					const res = await api.get('/api/admin/operation/flows', params, { silent: true })
					if (res.code === 200) {
						const td = new Date().toISOString().substring(0, 10)
						const mapped = (res.data || []).map(r => {
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

						if (this.page === 1) {
							this.recordList = mapped
						} else {
							this.recordList = this.recordList.concat(mapped)
						}
						this.hasMore = mapped.length >= this.pageSize
					}
				} catch (e) {
					console.error('流水列表加载失败:', e)
				} finally {
					this.loading = false
				}
			},

			loadMore() {
				if (this.loading || !this.hasMore) return
				this.page++
				this.fetchData(false)
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
	.pg { width: 100%; min-height: 100vh; background: #F8F9FA; font-family: -apple-system, BlinkMacSystemFont, 'Noto Sans SC', sans-serif; -webkit-font-smoothing: antialiased; padding-bottom: 40rpx }

	.s16 { width: 32rpx; height: 32rpx; flex-shrink: 0 }
	.gray-400 { color: #ADB5BD }
	.card-shadow { box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04) }

	/* Header */
	.hdr { background: #fff; position: sticky; top: 0; z-index: 50; padding-bottom: 20rpx; border-bottom: 1rpx solid #E9ECEF }
	.hdr-row { display: flex; align-items: center; padding: 28rpx 36rpx 0; gap: 16rpx }
	.hdr-back { width: 60rpx; height: 60rpx; display: flex; align-items: center; justify-content: center; flex-shrink: 0 }
	.hdr-title { font-size: 30rpx; font-weight: 700; color: #212529; flex: 1 }

	/* Search */
	.search-section { padding: 16rpx 36rpx 0 }
	.search-box { display: flex; align-items: center; background: #F1F3F5; border-radius: 16rpx; padding: 0 20rpx; height: 72rpx; gap: 10rpx }
	.search-input { flex: 1; font-size: 24rpx; color: #343A40; height: 100% }
	.search-ph { color: #ADB5BD }
	.search-clear { width: 36rpx; height: 36rpx; border-radius: 50%; background: #CED4DA; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 20rpx; flex-shrink: 0 }

	/* Filter */
	.filter-row { display: flex; align-items: center; padding: 20rpx 36rpx 16rpx; gap: 12rpx }
	.filter-input { flex: 1; height: 68rpx; background: #fff; border: 1rpx solid #DEE2E6; border-radius: 14rpx; display: flex; align-items: center; padding: 0 20rpx }
	.di-text { font-size: 22rpx; font-weight: 500; color: #343A40 }
	.di-placeholder { font-size: 22rpx; color: #ADB5BD }
	.sep { font-size: 22rpx; color: #CED4DA; font-weight: 500 }
	.filter-btn { height: 68rpx; padding: 0 28rpx; background: #4F6AF6; color: #fff; border-radius: 14rpx; font-size: 22rpx; font-weight: 600; display: flex; align-items: center; flex-shrink: 0 }
	.filter-btn:active { opacity: 0.85 }

	/* Record List */
	.record-list { background: #fff; border-radius: 22rpx; overflow: hidden; margin: 0 28rpx; border: 1rpx solid #E9ECEF }
	.record-item { display: flex; justify-content: space-between; align-items: flex-start; padding: 28rpx 32rpx }
	.record-item:active { background: #F8F9FA }
	.record-item+.record-item { border-top: 1rpx solid #F1F3F5 }
	.ri-left { flex: 1; min-width: 0; margin-right: 20rpx }
	.ri-meta-row { display: flex; align-items: center; gap: 10rpx; margin-bottom: 10rpx; flex-wrap: wrap }
	.ri-date { font-size: 22rpx; color: #ADB5BD; font-weight: 500 }
	.ri-day-tag { font-size: 18rpx; color: #CED4DA; font-weight: 500; background: #F8F9FA; padding: 2rpx 12rpx; border-radius: 8rpx }
	.ri-type-tag { font-size: 18rpx; font-weight: 500; padding: 4rpx 14rpx; border-radius: 8rpx }
	.rt-income { background: rgba(232,93,78,0.08); color: #E85D4E }
	.rt-expense { background: rgba(42,157,92,0.08); color: #2A9D5C }
	.rt-transfer { background: rgba(79,106,246,0.08); color: #4F6AF6 }
	.rt-live { background: rgba(139,92,246,0.08); color: #8B5CF6 }
	.ri-title { font-size: 26rpx; font-weight: 500; color: #343A40; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap }
	.ri-handler { font-size: 20rpx; color: #ADB5BD; margin-top: 6rpx; display: block }
	.ri-right { flex-shrink: 0; text-align: right }
	.ri-amount { font-size: 28rpx; font-weight: 700; display: block }
	.amt-income { color: #E85D4E }
	.amt-expense { color: #2A9D5C }
	.ri-time { font-size: 18rpx; color: #CED4DA; margin-top: 6rpx; display: block }

	/* Empty */
	.empty-state { padding: 80rpx 0; text-align: center }
	.empty-text { font-size: 24rpx; color: #ADB5BD }

	/* Load More */
	.load-more-btn { margin: 28rpx; height: 80rpx; background: #fff; border: 1rpx solid #DEE2E6; border-radius: 18rpx; display: flex; align-items: center; justify-content: center; font-size: 24rpx; font-weight: 500; color: #525252; box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04) }
	.load-more-btn:active { background: #F8F9FA; border-color: #CED4DA }
	.no-more-text { text-align: center; padding: 28rpx 0; font-size: 20rpx; color: #CED4DA }

	.bottom-spacer { height: 32rpx }

	/* Toast */
	.toast { position: fixed; top: 160rpx; left: 50%; transform: translateX(-50%); z-index: 200; background: rgba(33,37,41,0.92); backdrop-filter: blur(8px); padding: 18rpx 40rpx; border-radius: 9999rpx; pointer-events: none; opacity: 0; transition: opacity 0.2s }
	.toast-show { opacity: 1 }
	.toast-text { color: #fff; font-size: 22rpx; font-weight: 500 }
</style>
