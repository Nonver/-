<template>
	<view class="pg">
		<!-- Header -->
		<view class="hdr">
			<view class="hdr-row">
				<view class="back-btn" @tap="goBack">
					<svg class="s16 ink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
					</svg>
				</view>
				<view>
					<text class="hdr-title">考核详情</text>
					<text class="hdr-sub">员工考核内容查看</text>
				</view>
			</view>
		</view>

		<view class="main" v-if="!loading">
			<!-- 人员信息 -->
			<view class="card">
				<view class="card-hd">
					<view class="avatar" :class="data.is_passed ? 'avatar-pass' : (data.audit_status === 0 ? 'avatar-fail' : '')">
						{{ (data.real_name || '?').charAt(0) }}
					</view>
					<view>
						<text class="person-name">{{ data.real_name || data.username }}</text>
						<text class="person-dept">{{ data.dept_name || '未知部门' }}</text>
					</view>
					<view class="status-tag" :class="statusCfg.cls">{{ statusCfg.label }}</view>
				</view>
				<view class="info-row">
					<text class="info-lbl">考核周期</text>
					<text class="info-val">{{ data.assess_cycle || '-' }}</text>
				</view>
				<view class="info-row" v-if="data.target_remark">
					<text class="info-lbl">考核要求</text>
					<text class="info-val">{{ data.target_remark }}</text>
				</view>
				<view class="info-row" v-if="data.rule_description">
					<text class="info-lbl">考核备注</text>
					<text class="info-val">{{ data.rule_description }}</text>
				</view>
			</view>

			<!-- 提交内容 -->
			<view class="card">
				<view class="sec-hd">
					<svg class="s14 blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
					</svg>
					<text class="sec-title">提交内容</text>
				</view>
				<text class="content-text">{{ data.remark || '暂无内容' }}</text>
			</view>

			<!-- 资源明细 -->
			<view class="card" v-if="data.resources && data.resources.length > 0">
				<view class="sec-hd">
					<svg class="s14 amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
					</svg>
					<text class="sec-title">资源明细</text>
				</view>
				<view class="res-item tap-copy" v-for="(r, i) in data.resources" :key="i" @tap="doCopy(r.nickname + ' / ' + r.contact)">
					<view class="res-platform" :class="r.platform === '微信' ? 'rp-wechat' : 'rp-join'">{{ r.platform }}</view>
					<text class="res-nickname">{{ r.nickname }}</text>
					<text class="res-contact">{{ r.contact }}</text>
				</view>
			</view>

			<!-- 提交凭证 -->
			<view class="card" v-if="data.images && data.images.length > 0">
				<view class="sec-hd">
					<svg class="s14 green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
						<circle cx="8.5" cy="8.5" r="1.5"/>
						<polyline points="21 15 16 10 5 21"/>
					</svg>
					<text class="sec-title">提交凭证</text>
				</view>
				<view class="images-grid">
					<image v-for="(img, i) in data.images" :key="i" :src="imgFullUrl(img)" class="detail-img" mode="widthFix" @tap="previewImage(data.images, i)" />
				</view>
			</view>

			<!-- 提交时间 -->
			<view class="card">
				<view class="info-row">
					<text class="info-lbl">提交时间</text>
					<text class="info-val">{{ data.create_time || '-' }}</text>
				</view>
			</view>

			<!-- 审核操作 -->
			<view class="actions" v-if="data.can_review">
				<view class="abtn abtn-pass" @tap="onPass">
					<text>达标</text>
				</view>
				<view class="abtn abtn-fail" @tap="onFail">
					<text>不达标</text>
				</view>
			</view>
		</view>

		<!-- Loading -->
		<view class="loading-wrap" v-if="loading">
			<text class="loading-text">加载中...</text>
		</view>
	</view>
</template>

<script>
	import { api, BASE_URL } from '@/utils/api.js'

	export default {
		data() {
			return {
				id: 0,
				data: {},
				loading: true,
			}
		},
		onLoad(params) {
			this.id = parseInt(params.id) || 0
		},
		onShow() {
			this.$checkAuth()
			this.fetchDetail()
		},
		computed: {
			statusCfg() {
				if (this.data.is_passed) {
					return { label: '达标', cls: 'tag-pass' }
				} else if (this.data.audit_status === 0) {
					return { label: '不达标', cls: 'tag-fail' }
				} else if (this.data.audit_status === 2) {
					return { label: '待审核', cls: 'tag-pending' }
				}
				return { label: '未提交', cls: 'tag-pending' }
			},
		},
		methods: {
			goBack() { uni.navigateBack() },

			async fetchDetail() {
				if (!this.id) return
				this.loading = true
				try {
					const res = await api.get(`/api/admin/oversight/assess-results/${this.id}/detail`)
					if (res.data) {
						this.data = res.data
					}
				} catch (e) {
					console.error('[audit-detail]', e)
					uni.showToast({ title: '加载失败', icon: 'none' })
				}
				this.loading = false
			},

			async onPass() {
				uni.showModal({
					title: '确认操作',
					content: `确定将 ${this.data.real_name || this.data.username} 标记为【达标】吗？`,
					success: async (res) => {
						if (!res.confirm) return
						try {
							await api.post(`/api/admin/oversight/assess-results/${this.id}/pass`)
							uni.showToast({ title: '已标记为达标', icon: 'success' })
							this.fetchDetail()
						} catch (e) { /* api.js 已提示 */ }
					}
				})
			},

			async onFail() {
				uni.showModal({
					title: '确认操作',
					content: `确定将 ${this.data.real_name || this.data.username} 标记为【不达标】吗？`,
					success: async (res) => {
						if (!res.confirm) return
						try {
							await api.post(`/api/admin/oversight/assess-results/${this.id}/fail`)
							uni.showToast({ title: '已标记为不达标', icon: 'none' })
							this.fetchDetail()
						} catch (e) { /* api.js 已提示 */ }
					}
				})
			},

			imgFullUrl(path) {
				if (!path) return ''
				if (path.startsWith('http')) return path
				return BASE_URL + '/' + path
			},
			previewImage(paths, index) {
				const urls = paths.map(p => this.imgFullUrl(p))
				uni.previewImage({ current: urls[index] || '', urls })
			},

			doCopy(text) {
				if (!text) return
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.showToast({ title: '已复制: ' + text, icon: 'none' })
					}
				})
			},
		}
	}
</script>

<style>
	.pg { min-height: 100vh; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif; }

	/* Header */
	.hdr { background: #fff; padding: 88rpx 32rpx 0; border-bottom: 1rpx solid #f1f5f9; position: sticky; top: 0; z-index: 50 }
	.hdr-row { display: flex; align-items: center; gap: 16rpx; padding: 16rpx 0 }
	.back-btn { width: 64rpx; height: 64rpx; border-radius: 16rpx; background: #f1f5f9; display: flex; align-items: center; justify-content: center }
	.hdr-title { font-size: 30rpx; font-weight: 700; color: #0f172a; display: block }
	.hdr-sub { font-size: 22rpx; color: #94a3b8; margin-top: 2rpx; display: block }
	.s16 { width: 32rpx; height: 32rpx; flex-shrink: 0 }
	.s14 { width: 28rpx; height: 28rpx; flex-shrink: 0 }
	.ink-600 { color: #475569 }
	.blue { color: #2563eb }
	.amber { color: #d97706 }
	.green { color: #10b981 }

	/* Main */
	.main { padding: 24rpx 24rpx 160rpx }

	/* Card */
	.card { background: #fff; border-radius: 20rpx; padding: 28rpx; margin-bottom: 20rpx; box-shadow: 0 4rpx 20rpx rgba(0,0,0,.03) }
	.card-hd { display: flex; align-items: center; gap: 16rpx; margin-bottom: 24rpx }
	.avatar { width: 72rpx; height: 72rpx; border-radius: 18rpx; background: #eff6ff; color: #2563eb; font-size: 28rpx; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0 }
	.avatar-pass { background: #ecfdf5; color: #10b981 }
	.avatar-fail { background: #fef2f2; color: #ef4444 }
	.person-name { font-size: 28rpx; font-weight: 600; color: #1e293b; display: block }
	.person-dept { font-size: 22rpx; color: #94a3b8 }

	.status-tag { font-size: 22rpx; font-weight: 600; padding: 6rpx 16rpx; border-radius: 8rpx; margin-left: auto }
	.tag-pass { background: #ecfdf5; color: #10b981 }
	.tag-fail { background: #fef2f2; color: #ef4444 }
	.tag-pending { background: #eff6ff; color: #2563eb }

	/* Info */
	.info-row { display: flex; align-items: flex-start; margin-bottom: 16rpx }
	.info-row:last-child { margin-bottom: 0 }
	.info-lbl { font-size: 24rpx; color: #94a3b8; width: 120rpx; flex-shrink: 0 }
	.info-val { font-size: 26rpx; color: #1e293b; flex: 1; line-height: 1.6 }

	/* Section */
	.sec-hd { display: flex; align-items: center; gap: 10rpx; margin-bottom: 20rpx }
	.sec-title { font-size: 26rpx; font-weight: 600; color: #334155 }
	.content-text { font-size: 26rpx; color: #1e293b; line-height: 1.8; white-space: pre-wrap }

	/* Resources */
	.res-item { display: flex; align-items: center; gap: 12rpx; padding: 16rpx 0; border-bottom: 1rpx solid #f1f5f9 }
	.res-item:last-child { border-bottom: none }
	.res-platform { font-size: 20rpx; font-weight: 600; padding: 4rpx 12rpx; border-radius: 8rpx; flex-shrink: 0 }
	.rp-wechat { color: #16a34a; background: #f0fdf4 }
	.rp-join { color: #9333ea; background: #faf5ff }
	.res-nickname { font-size: 24rpx; color: #374151; font-weight: 500 }
	.res-contact { font-size: 22rpx; color: #94a3b8; margin-left: auto }
	.tap-copy { padding: 4rpx 0; user-select: auto }
	.tap-copy:active { opacity: 0.5 }

	/* Images */
	.images-grid { display: flex; flex-wrap: wrap; gap: 16rpx }
	.detail-img { width: calc(50% - 8rpx); border-radius: 12rpx; background: #f1f5f9 }

	/* Actions */
	.actions { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; padding: 20rpx 32rpx; padding-bottom: calc(20rpx + env(safe-area-inset-bottom)); display: flex; gap: 20rpx; border-top: 1rpx solid #f1f5f9; z-index: 60 }
	.abtn { flex: 1; text-align: center; padding: 24rpx 0; border-radius: 16rpx; font-size: 28rpx; font-weight: 600; }
	.abtn:active { transform: scale(0.97) }
	.abtn-pass { background: #10b981; color: #fff }
	.abtn-fail { background: #fff; color: #ef4444; border: 2rpx solid #fee2e2 }

	/* Loading */
	.loading-wrap { display: flex; justify-content: center; padding-top: 300rpx }
	.loading-text { font-size: 26rpx; color: #94a3b8 }
</style>
