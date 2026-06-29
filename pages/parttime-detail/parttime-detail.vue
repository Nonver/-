<template>
	<view class="pg">

		<!-- Header -->
		<view class="hdr">
			<view class="hdr-inner">
				<view class="hdr-btn" @tap="goBack">
					<svg class="s20 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg>
				</view>
				<text class="hdr-title">{{ anchor.real_name || anchor.nickname || '主播详情' }}</text>
				<view class="hdr-btn-placeholder"></view>
			</view>
		</view>

		<!-- Main -->
		<view class="main" v-if="!loading">

			<!-- Photo + Name -->
			<view class="profile-card card-shadow">
				<view class="pc-photo-box">
					<image v-if="anchor.photo" class="pc-photo" :src="photoUrl" mode="aspectFill" @tap="previewPhoto" />
					<view v-else class="pc-photo-empty">
						<text class="pc-photo-txt">{{ (anchor.real_name || anchor.nickname || '?').charAt(0) }}</text>
					</view>
				</view>
				<view class="pc-info">
					<text class="pc-name">{{ anchor.real_name || anchor.nickname }}</text>
					<view class="pc-tag-row">
						<view class="pc-tag pc-tag-status" :class="statusTagCls(anchor.status)">{{ statusMap[anchor.status] || '未知' }}</view>
					</view>
				</view>
			</view>

			<!-- Detail Info -->
			<view class="info-card card-shadow">
				<text class="info-title">基本信息</text>

				<view class="info-row" v-if="anchor.anchor_id">
					<text class="ir-label">主播ID</text>
					<text class="ir-value">{{ anchor.anchor_id }}</text>
				</view>
				<view class="info-row" v-if="anchor.nickname">
					<text class="ir-label">昵称</text>
					<text class="ir-value">{{ anchor.nickname }}</text>
				</view>
				<view class="info-row" v-if="anchor.real_name">
					<text class="ir-label">真实姓名</text>
					<text class="ir-value">{{ anchor.real_name }}</text>
				</view>
				<view class="info-row">
					<text class="ir-label">手机号</text>
					<text class="ir-value">{{ anchor.phone || '-' }}</text>
				</view>
				<view class="info-row">
					<text class="ir-label">入职状态</text>
					<view class="ir-status" :class="statusTagCls(anchor.status)">{{ statusMap[anchor.status] || '未知' }}</view>
				</view>
				<view class="info-row">
					<text class="ir-label">添加时间</text>
					<text class="ir-value">{{ fmtDate(anchor.create_time) }}</text>
				</view>
				<view class="info-row" v-if="anchor.update_time">
					<text class="ir-label">更新时间</text>
					<text class="ir-value">{{ fmtDate(anchor.update_time) }}</text>
				</view>
			</view>

			<!-- 流水图片 -->
			<view class="info-card card-shadow" v-if="anchor.flow_photo">
				<text class="info-title">流水图片</text>
				<image class="flow-photo" :src="flowPhotoUrl" mode="widthFix" @tap="previewFlowPhoto" />
			</view>

			<!-- Actions -->
			<view class="actions" v-if="isDirector && anchor.status === 2">
				<view class="action-btn action-confirm" @tap="confirmEnroll">
					<svg class="s20 white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<text>确认入职</text>
				</view>
				<view class="action-btn action-reject" @tap="confirmReject">
					<svg class="s20 white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
					<text>拒绝</text>
				</view>
			</view>

			<view class="spacer"></view>
		</view>

		<view class="loading-box" v-else>
			<text class="loading-text">加载中...</text>
		</view>

		<!-- Toast -->
		<view class="toast" :class="toastVisible?'toast-show':''">
			<text class="toast-text">{{ toastMsg }}</text>
		</view>
	</view>
</template>

<script>
	import { useAuth, ROLES } from '@/stores/auth.js'
	import { api, BASE_URL } from '@/utils/api.js'
	const auth = useAuth()

	const STATUS_MAP = { 1: '在岗中', 2: '待入职', 3: '流转中', 4: '已调岗' }

	function fmtDate(dt) {
		if (!dt) return ''
		return dt.slice(0, 10).replace(/-/g, '.')
	}

	export default {
		data() {
			return {
				anchorId: 0,
				anchor: {},
				loading: true,
				statusMap: STATUS_MAP,
				toastVisible: false,
				toastMsg: '',
			}
		},
		computed: {
			isDirector() { return auth.state.role === ROLES.DIRECTOR },
			photoUrl() {
				if (!this.anchor.photo) return ''
				if (this.anchor.photo.startsWith('http') || this.anchor.photo.startsWith('data:')) return this.anchor.photo
				return BASE_URL + this.anchor.photo
			},
			flowPhotoUrl() {
				if (!this.anchor.flow_photo) return ''
				if (this.anchor.flow_photo.startsWith('http') || this.anchor.flow_photo.startsWith('data:')) return this.anchor.flow_photo
				return BASE_URL + this.anchor.flow_photo
			},
		},
		onLoad(options) {
			this.anchorId = parseInt(options.id) || 0
			if (this.anchorId) {
				this.fetchDetail()
			}
		},
		onShow() {
			this.$checkAuth()
		},
		methods: {
			async fetchDetail() {
				this.loading = true
				try {
					const res = await api.get('/api/admin/parttime-anchor/' + this.anchorId)
					this.anchor = res.data || {}
				} catch (e) {
					console.error('[主播详情] fetch:', e)
				} finally {
					this.loading = false
				}
			},

			statusTagCls(s) {
				if (s === 1) return 'tag-green'
				if (s === 2) return 'tag-yellow'
				if (s === 3) return 'tag-blue'
				if (s === 4) return 'tag-purple'
				return 'tag-gray'
			},

			confirmEnroll() {
				const name = this.anchor.real_name || this.anchor.nickname
				uni.showModal({
					title: '确认入职',
					content: '确定将 ' + name + ' 入职为在岗状态吗？',
					success: async (res) => {
						if (!res.confirm) return
						try {
							await api.put('/api/admin/parttime-anchor/' + this.anchorId + '/status', { status: 1 })
							this.showToast('已入职成功')
							this.anchor.status = 1
						} catch (e) { /* api.js已弹toast */ }
					},
				})
			},

			confirmReject() {
				const name = this.anchor.real_name || this.anchor.nickname
				uni.showModal({
					title: '拒绝入职',
					content: '确定拒绝 ' + name + ' 的入职申请吗？此操作将删除该主播记录。',
					success: async (res) => {
						if (!res.confirm) return
						try {
							await api.delete('/api/admin/parttime-anchor/' + this.anchorId)
							this.showToast('已拒绝')
							setTimeout(() => { uni.navigateBack({ delta: 1 }) }, 800)
						} catch (e) { /* api.js已弹toast */ }
					},
				})
			},

			previewPhoto() {
				uni.previewImage({ urls: [this.photoUrl], current: this.photoUrl })
			},

			previewFlowPhoto() {
				uni.previewImage({ urls: [this.flowPhotoUrl], current: this.flowPhotoUrl })
			},

			goBack() { uni.navigateBack({ delta: 1 }) },

			showToast(msg) {
				this.toastMsg = msg
				this.toastVisible = true
				clearTimeout(this._tt)
				this._tt = setTimeout(() => { this.toastVisible = false }, 2000)
			},

			fmtDate,
		},
	}
</script>

<style>
	.pg { width: 100%; min-height: 100vh; background: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Noto Sans SC', 'PingFang SC', sans-serif; -webkit-font-smoothing: antialiased }
	.s20 { width: 40rpx; height: 40rpx; flex-shrink: 0 }
	.text-secondary { color: #475569 }
	.white { color: #fff }

	/* Header */
	.hdr {
		position: sticky; top: 0; z-index: 50;
		background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
		border-bottom: 1rpx solid rgba(0,0,0,0.08);
	}
	.hdr-inner {
		display: flex; align-items: center; justify-content: space-between;
		height: 112rpx; padding: 0 40rpx; padding-top: 48rpx;
	}
	.hdr-btn { width: 48rpx; height: 48rpx; display: flex; align-items: center; justify-content: center; border-radius: 20rpx }
	.hdr-btn:active { background: #f9fafb }
	.hdr-btn-placeholder { width: 48rpx }
	.hdr-title { font-size: 32rpx; font-weight: 600; letter-spacing: -0.02em; color: #0F172A }

	/* Main */
	.main { padding: 40rpx 40rpx 80rpx }
	.spacer { height: 64rpx }
	.card-shadow { box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.06), 0 0 2rpx rgba(0,0,0,0.04) }

	/* Loading */
	.loading-box { display: flex; justify-content: center; padding-top: 200rpx }
	.loading-text { font-size: 28rpx; color: #ADB5BD }

	/* Profile Card */
	.profile-card {
		background: #fff; border-radius: 28rpx; padding: 40rpx;
		display: flex; align-items: center; gap: 32rpx; margin-bottom: 32rpx;
	}
	.pc-photo-box { width: 160rpx; height: 160rpx; border-radius: 24rpx; overflow: hidden; flex-shrink: 0 }
	.pc-photo-empty {
		width: 100%; height: 100%;
		background: linear-gradient(135deg, #EEF2FF, #E0E7FF);
		display: flex; align-items: center; justify-content: center;
	}
	.pc-photo-txt { font-size: 64rpx; font-weight: 700; color: #6366F1 }
	.pc-photo { width: 100%; height: 100% }
	.pc-info { flex: 1; min-width: 0 }
	.pc-name { font-size: 36rpx; font-weight: 700; color: #0F172A; display: block; margin-bottom: 12rpx }
	.pc-tag-row { display: flex; gap: 12rpx }

	.pc-tag {
		font-size: 20rpx; font-weight: 600; padding: 6rpx 18rpx; border-radius: 8rpx;
	}
	.pc-tag-status { }
	.tag-green { background: #ECFDF5; color: #059669; border: 1rpx solid #A7F3D0 }
	.tag-yellow { background: #FFFBEB; color: #D97706; border: 1rpx solid #FDE68A }
	.tag-blue { background: #EFF6FF; color: #2563EB; border: 1rpx solid #BFDBFE }
	.tag-purple { background: #F5F3FF; color: #7C3AED; border: 1rpx solid #DDD6FE }
	.tag-gray { background: #F3F4F6; color: #6B7280; border: 1rpx solid #D1D5DB }

	/* Info Card */
	.info-card {
		background: #fff; border-radius: 28rpx; padding: 36rpx; margin-bottom: 32rpx;
	}
	.info-title { font-size: 22rpx; font-weight: 600; color: #94A3B8; letter-spacing: 0.12em; display: block; margin-bottom: 28rpx; text-transform: uppercase }
	.info-row { display: flex; align-items: center; justify-content: space-between; padding: 18rpx 0; border-bottom: 1rpx solid #F1F5F9 }
	.info-row:last-child { border-bottom: none }
	.ir-label { font-size: 26rpx; color: #64748B; font-weight: 500 }
	.ir-value { font-size: 26rpx; color: #0F172A; font-weight: 600 }
	.ir-status { font-size: 20rpx; font-weight: 600; padding: 4rpx 14rpx; border-radius: 8rpx }

	/* Actions */
	.actions { display: flex; gap: 24rpx }
	.action-btn {
		flex: 1; height: 104rpx; border-radius: 28rpx;
		display: flex; align-items: center; justify-content: center; gap: 16rpx;
		font-size: 28rpx; font-weight: 600; color: #fff;
		box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.12);
	}
	.action-btn:active { transform: scale(0.97) }
	.action-confirm { background: #059669; box-shadow: 0 8rpx 24rpx rgba(5,150,105,0.2) }
	.action-reject { background: #EF4444; box-shadow: 0 8rpx 24rpx rgba(239,68,68,0.2) }

	/* Flow Photo */
	.flow-photo { width: 100%; border-radius: 16rpx; margin-top: 8rpx }

	/* Toast */
	.toast {
		position: fixed; top: 160rpx; left: 50%; transform: translateX(-50%); z-index: 200;
		background: rgba(31,41,55,0.92); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
		padding: 18rpx 40rpx; border-radius: 9999rpx; pointer-events: none;
		opacity: 0; transition: opacity 0.2s ease;
	}
	.toast-show { opacity: 1 }
	.toast-text { color: #fff; font-size: 22rpx; font-weight: 500 }
</style>
