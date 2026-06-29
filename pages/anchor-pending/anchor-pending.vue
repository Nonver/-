<template>
	<view class="pg">
		<!-- Header -->
		<view class="hdr">
			<view class="hdr-inner">
				<view class="hdr-btn" @tap="goBack">
					<svg class="s18" fill="none" stroke="#475569" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg>
				</view>
				<text class="hdr-title">待提交考核</text>
				<view class="hdr-count">{{ totalText }}</view>
			</view>

			<!-- 搜索栏 -->
			<view class="search-bar">
				<view class="search-inner">
					<svg class="s14 search-icon" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" stroke-width="2">
						<circle cx="11" cy="11" r="8" />
						<line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
					<input class="search-input" v-model="keyword" placeholder="搜索员工姓名..." @input="onSearch" />
					<view v-if="keyword" class="search-clear" @tap="clearSearch">
						<svg class="s12" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" stroke-width="2">
							<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</view>
				</view>
			</view>
		</view>

		<!-- 列表 -->
		<view class="main">
			<view v-if="loading" class="empty-state">
				<text class="empty-text">加载中...</text>
			</view>
			<view v-else-if="filteredList.length===0" class="empty-state">
				<svg class="s48 empty-icon" fill="none" stroke="#CBD5E1" viewBox="0 0 24 24" stroke-width="1">
					<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
				</svg>
				<text class="empty-text">{{ keyword ? '未找到匹配员工' : '暂无待提交考核' }}</text>
			</view>
			<view v-else class="list-card">
				<view v-for="(it, idx) in filteredList" :key="it.id">
					<view v-if="idx>0" class="dv"></view>
					<view class="lr" :class="{'lr-urgent':it.urgent}">
						<view class="ava-ring" :class="{'online':it.online}" :style="{background:it.avaBg}"></view>
						<view class="lr-main">
							<view class="lr-hd">
								<text class="lr-title">{{ it.name }}</text>
								<text class="tag" :class="it.badgeCls">{{ it.badge }}</text>
							</view>
							<text class="lr-sub" :class="{'lr-sub-urgent':it.urgent}">{{ it.desc }}</text>
						</view>
						<view class="lr-btn" :class="{'lr-btn-urgent':it.urgent}">
							<svg class="s16" :class="it.urgent?'red':'blue'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
								<path :d="it.urgent ? 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01' : 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z'" />
							</svg>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { api } from '@/utils/api.js'

	export default {
		data() {
			return {
				loading: false,
				keyword: '',
				rawList: [],
			}
		},
		computed: {
			totalText() {
				const n = this.rawList.length
				return n > 0 ? '共' + n + '人' : ''
			},
			filteredList() {
				const kw = this.keyword.trim()
				const list = this.rawList.map(it => ({
					...it,
					online: it.role == 2 ? false : it.online,
					avaBg: it.online ? '#f0fdf4' : '#f1f5f9',
					badgeCls: it.urgent ? 'tag-r' : 'tag-a',
				}))
				if (!kw) return list
				return list.filter(it => it.name && it.name.includes(kw))
			},
		},
		onShow() {
			this.$checkAuth()
			this.fetchPendingList()
		},
		methods: {
			goBack() { uni.navigateBack({ delta: 1 }) },
			onSearch() { /* keyword 双向绑定，computed 自动过滤 */ },
			clearSearch() { this.keyword = '' },
			async fetchPendingList() {
				this.loading = true
				try {
					const res = await api.get('/api/admin/anchor/dashboard', null, { silent: true })
					if (res.data && res.data.pending_list) {
						this.rawList = res.data.pending_list
					}
				} catch (e) {
					console.error('[anchor-pending]', e)
				}
				this.loading = false
			},
		},
	}
</script>

<style>
	.pg { width:100%; min-height:100vh; background:#F8FAFC; font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif; -webkit-font-smoothing:antialiased }

	/* Header */
	.hdr { position:sticky; top:0; z-index:50; background:rgba(255,255,255,.92); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1rpx solid rgba(0,0,0,.06) }
	.hdr-inner { display:flex; align-items:center; padding:24rpx 32rpx; padding-top:48rpx; gap:16rpx }
	.hdr-btn { width:48rpx; height:48rpx; display:flex; align-items:center; justify-content:center; border-radius:20rpx; flex-shrink:0 }
	.hdr-btn:active { background:#F1F5F9 }
	.hdr-title { font-size:32rpx; font-weight:700; color:#0F172A; flex:1 }
	.hdr-count { font-size:24rpx; color:#94A3B8; font-weight:500; flex-shrink:0 }

	/* Search */
	.search-bar { padding:0 32rpx 20rpx }
	.search-inner { display:flex; align-items:center; height:72rpx; background:#F1F5F9; border-radius:20rpx; padding:0 20rpx; gap:12rpx }
	.search-icon { flex-shrink:0 }
	.search-input { flex:1; height:100%; font-size:26rpx; color:#0F172A; background:transparent }
	.search-input::placeholder { color:#94A3B8 }
	.search-clear { width:36rpx; height:36rpx; display:flex; align-items:center; justify-content:center; flex-shrink:0 }
	.search-clear:active { opacity:.6 }

	/* Main */
	.main { padding:0 32rpx 60rpx }

	/* Empty */
	.empty-state { display:flex; flex-direction:column; align-items:center; padding:120rpx 0 }
	.empty-icon { width:96rpx; height:96rpx; margin-bottom:24rpx }
	.empty-text { font-size:26rpx; color:#94A3B8 }

	/* List */
	.list-card { background:#fff; border-radius:24rpx; overflow:hidden; box-shadow:0 4rpx 24rpx rgba(0,0,0,.04) }
	.dv { height:1rpx; background:#F1F5F9; margin:0 32rpx }
	.lr { display:flex; flex-direction:row; align-items:center; padding:28rpx 32rpx; gap:24rpx }
	.lr:active { background:rgba(0,0,0,.02) }
	.ava-ring { width:64rpx; height:64rpx; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center }
	.online { box-shadow:0 0 0 4rpx rgba(16,185,129,.15) }
	.lr-main { flex:1; min-width:0 }
	.lr-hd { display:flex; flex-direction:row; align-items:center; gap:16rpx }
	.lr-title { font-size:28rpx; font-weight:600; color:#0F172A }
	.lr-sub { font-size:22rpx; color:#94A3B8; margin-top:4rpx; display:block }
	.lr-sub-urgent { color:#EF4444 }
	.lr-btn { width:56rpx; height:56rpx; border-radius:16rpx; display:flex; align-items:center; justify-content:center; background:#EFF6FF; flex-shrink:0 }
	.lr-btn-urgent { background:#FEF2F2 }
	.tag { display:inline-flex; align-items:center; padding:4rpx 16rpx; border-radius:12rpx; font-size:20rpx; font-weight:600; white-space:nowrap }
	.tag-a { background:#FFFBEB; color:#D97706 }
	.tag-r { background:#FEF2F2; color:#DC2626 }

	.s12 { width:24rpx;height:24rpx;flex-shrink:0 }
	.s14 { width:28rpx;height:28rpx;flex-shrink:0 }
	.s16 { width:32rpx;height:32rpx;flex-shrink:0 }
	.s18 { width:36rpx;height:36rpx;flex-shrink:0 }
	.s48 { width:96rpx;height:96rpx;flex-shrink:0 }
	.red { color:#EF4444 }
	.blue { color:#2563EB }
</style>
