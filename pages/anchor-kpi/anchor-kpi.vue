<template>
	<view class="pg">

		<!-- Header -->
		<view class="hdr">
			<view class="hdr-inner">
				<view class="hdr-btn" @tap="goBack">
					<svg class="s18" fill="none" stroke="#475569" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
				</view>
				<text class="hdr-title">{{ deptName }}考核总览</text>
			</view>

			<!-- 搜索 -->
			<view class="search-bar">
				<view class="search-inner">
					<svg class="s14 mu" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
					<input class="search-input" v-model="keyword" placeholder="搜索姓名..." />
					<view v-if="keyword" class="search-clear" @tap="keyword=''">
						<svg class="s12 mu" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
					</view>
				</view>
			</view>
		</view>

		<view class="main">

			<!-- 统计卡片 -->
			<view class="stats-row">
				<view class="stat-box" @tap="filter='all'">
					<text class="stat-num">{{ stats.totalMembers }}</text>
					<text class="stat-label">总人数</text>
				</view>
				<view class="stat-box stat-pass" @tap="filter='pass'">
					<text class="stat-num green">{{ stats.passedCount }}</text>
					<text class="stat-label">已达标</text>
				</view>
				<view class="stat-box stat-fail" @tap="filter='fail'">
					<text class="stat-num red">{{ stats.failedCount }}</text>
					<text class="stat-label">不达标</text>
				</view>
			</view>

			<!-- 分类筛选 -->
			<view class="filter-row">
				<view class="f-btn" :class="filter==='all'?'f-on':''" @tap="filter='all'">全部</view>
				<view class="f-btn" :class="filter==='pass'?'f-on':''" @tap="filter='pass'">已达标</view>
				<view class="f-btn" :class="filter==='fail'?'f-on':''" @tap="filter='fail'">不达标</view>
			</view>

			<!-- 列表 -->
			<view v-if="loading" class="empty-tip">加载中...</view>
			<view v-else-if="filteredList.length===0" class="empty-tip">
				{{ keyword ? '未找到匹配成员' : '暂无数据' }}
			</view>
			<view v-else class="p-list">
				<view v-for="it in filteredList" :key="it.id" class="p-card" :class="{'p-fail':it.status==='fail','p-pass':it.status==='pass'}">
					<view class="p-top">
						<view class="p-avatar" :class="it.online?'p-online':''">
							<text class="p-avatar-txt">{{ (it.name||'?')[0] }}</text>
						</view>
						<view class="p-info">
							<text class="p-name">{{ it.name }}</text>
							<text class="p-role">{{ roleLabel(it.role) }}</text>
						</view>
						<view class="p-status" :class="it.status==='pass'?'p-pass-tag':(it.status==='fail'?'p-fail-tag':'p-pending-tag')">
							{{ it.status==='pass'?'已达标':(it.status==='fail'?'不达标':'未提交') }}
						</view>
					</view>
				<view v-if="it.status!=='pending'" class="p-score">
					<view class="p-score-bar">
						<view class="p-score-fill" :class="it.status==='pass'?'fill-green':'fill-red'" :style="{width:it.status==='pass'?'100%':'0%'}"></view>
					</view>
					<text class="p-score-val" :class="it.status==='pass'?'green':'red'">{{ it.status==='pass'?'100':'0' }}分</text>
				</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import { api } from '@/utils/api.js'
	import { useAuth, DEPT_LABELS } from '@/stores/auth.js'

	const ROLE_MAP = { 1:'总监', 2:'组长', 3:'员工' }

	export default {
		data() {
			return {
				filter: 'all',
				keyword: '',
				loading: false,
				deptName: '',
				stats: { totalMembers: 0, passedCount: 0, failedCount: 0 },
				personnelList: [],
			}
		},
		computed: {
			filteredList() {
				let list = this.personnelList
				if (this.filter==='pass') list = list.filter(k => k.status==='pass')
				if (this.filter==='fail') list = list.filter(k => k.status==='fail')
				const kw = this.keyword.trim()
				if (kw) list = list.filter(k => k.name && k.name.includes(kw))
				return list
			},
		},
		onShow() {
			this.$checkAuth()
			this.fetchOverview()
		},
		methods: {
			roleLabel(role) { return ROLE_MAP[role] || '成员' },
			goBack() { uni.navigateBack() },
			async fetchOverview() {
				const auth = useAuth()
				this.deptName = auth.state.departmentName || '部门'
				this.loading = true
				try {
					const res = await api.get('/api/admin/anchor/overview', null, { silent: true })
					if (res.data) {
						const d = res.data
						this.stats.totalMembers = d.total_members || 0
						this.stats.passedCount = d.passed_count || 0
						this.stats.failedCount = d.failed_count || 0
						this.personnelList = d.personnel_list || []
					}
				} catch (e) {
					console.error('[deptKpi]', e)
				}
				this.loading = false
			},
		},
	}
</script>

<style scoped>
	.pg { width:100%; min-height:100vh; background:#F8F9FC; font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif; -webkit-font-smoothing:antialiased }

	/* Header */
	.hdr { position:sticky; top:0; z-index:50; background:#fff; border-bottom:1rpx solid #F1F5F9 }
	.hdr-inner { display:flex; align-items:center; padding:24rpx 32rpx; padding-top:48rpx; gap:16rpx }
	.hdr-btn { width:48rpx; height:48rpx; display:flex; align-items:center; justify-content:center; border-radius:20rpx; flex-shrink:0 }
	.hdr-btn:active { background:#F1F5F9 }
	.hdr-title { font-size:32rpx; font-weight:700; color:#0F172A; flex:1 }

	/* 搜索 */
	.search-bar { padding:0 32rpx 20rpx }
	.search-inner { display:flex; align-items:center; height:72rpx; background:#F1F5F9; border-radius:20rpx; padding:0 20rpx; gap:12rpx }
	.search-input { flex:1; height:100%; font-size:26rpx; color:#0F172A; background:transparent }
	.search-clear { width:36rpx; height:36rpx; display:flex; align-items:center; justify-content:center; flex-shrink:0 }

	/* Main */
	.main { padding:24rpx 28rpx 60rpx }

	/* Stats */
	.stats-row { display:flex; gap:20rpx; margin-bottom:24rpx }
	.stat-box { flex:1; background:#fff; border-radius:20rpx; padding:28rpx 20rpx; text-align:center; box-shadow:0 1rpx 3rpx rgba(0,0,0,.04) }
	.stat-box:active { opacity:.8 }
	.stat-num { display:block; font-size:48rpx; font-weight:800; color:#0F172A; line-height:1.1 }
	.stat-label { font-size:22rpx; color:#94A3B8; margin-top:6rpx; display:block }
	.stat-pass .stat-num { color:#10B981 }
	.stat-fail .stat-num { color:#EF4444 }
	.green { color:#10B981 }
	.red { color:#EF4444 }

	/* Filter */
	.filter-row { display:flex; gap:16rpx; margin-bottom:24rpx }
	.f-btn { padding:10rpx 32rpx; border-radius:9999rpx; font-size:24rpx; font-weight:500; background:#fff; color:#64748B }
	.f-btn:active { opacity:.8 }
	.f-on { background:#0F172A; color:#fff }

	/* Person Card */
	.p-list { display:flex; flex-direction:column; gap:16rpx }
	.p-card { background:#fff; border-radius:20rpx; padding:28rpx; box-shadow:0 1rpx 3rpx rgba(0,0,0,.04) }
	.p-top { display:flex; align-items:center; gap:20rpx }
	.p-avatar { width:80rpx; height:80rpx; border-radius:50%; background:#F1F5F9; display:flex; align-items:center; justify-content:center; flex-shrink:0 }
	.p-online { box-shadow:0 0 0 4rpx rgba(16,185,129,.2) }
	.p-avatar-txt { font-size:32rpx; font-weight:700; color:#475569 }
	.p-info { flex:1; min-width:0 }
	.p-name { font-size:28rpx; font-weight:600; color:#0F172A; display:block }
	.p-role { font-size:22rpx; color:#94A3B8; margin-top:2rpx; display:block }
	.p-status { padding:6rpx 20rpx; border-radius:20rpx; font-size:22rpx; font-weight:600; flex-shrink:0; white-space:nowrap }
	.p-pass-tag { background:#D1FAE5; color:#059669 }
	.p-fail-tag { background:#FFE4E6; color:#DC2626 }
	.p-pending-tag { background:#F1F5F9; color:#64748B }

	/* Score Bar */
	.p-score { margin-top:20rpx; display:flex; align-items:center; gap:16rpx }
	.p-score-bar { flex:1; height:12rpx; background:#F1F5F9; border-radius:6rpx; overflow:hidden }
	.p-score-fill { height:100%; border-radius:6rpx }
	.fill-green { background:#10B981 }
	.fill-red { background:#EF4444 }
	.p-score-val { font-size:24rpx; font-weight:700; flex-shrink:0 }

	/* Empty */
	.empty-tip { text-align:center; padding:120rpx 0; font-size:26rpx; color:#94A3B8 }

	.s12 { width:24rpx;height:24rpx;flex-shrink:0 }
	.s14 { width:28rpx;height:28rpx;flex-shrink:0 }
	.s18 { width:36rpx;height:36rpx;flex-shrink:0 }
	.mu { color:#94A3B8 }
</style>
