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
				<text class="hdr-title">提交进度</text>
				<view class="hdr-btn-placeholder"></view>
			</view>
		</view>

		<!-- Content -->
		<view class="main">
			<!-- 考核信息 -->
			<view class="card">
				<view class="card-hd">
					<view class="dot dot-blue"></view>
					<text class="card-ttl">{{ assessTitle }}</text>
				</view>
				<view class="info-row">
					<text class="info-lbl">发布人</text>
					<text class="info-val">{{ publisher }}</text>
				</view>
				<view class="info-row">
					<text class="info-lbl">考核周期</text>
					<text class="info-val">{{ assessCycle }}</text>
				</view>
				<view class="info-row" v-if="assessTarget">
					<text class="info-lbl">考核指标</text>
					<text class="info-val target-val">{{ assessTarget }}</text>
				</view>
				<view class="info-row" v-if="assessTargetDetail">
					<text class="info-lbl">指标要求</text>
					<text class="info-val">{{ assessTargetDetail }}</text>
				</view>
			</view>

			<!-- 已提交提示 -->
			<view class="card submitted-card" v-if="submitted">
				<view class="submitted-icon-wrap">
					<svg class="s48 emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</view>
				<text class="submitted-title">{{ submitStatusText }}</text>
				<text class="submitted-desc">{{ submitDesc }}</text>
				<view class="submitted-back-btn" @tap="goBack">返回</view>
			</view>

			<!-- 提交表单（未提交时显示） -->
			<template v-else>
				<!-- 今日完成量 -->
				<view class="card">
					<text class="card-title">今日完成情况</text>
					<view class="input-row">
						<text class="input-lbl">添加微信数量</text>
						<input class="num-input" type="number" v-model="wechatCount" placeholder="0" @input="onNumInput('wechatCount')" />
						<text class="input-unit">个</text>
					</view>
					<view class="input-row" style="margin-top: 24rpx;">
						<text class="input-lbl">邀请入会数量</text>
						<input class="num-input" type="number" v-model="joinPartyCount" placeholder="0" @input="onNumInput('joinPartyCount')" />
						<text class="input-unit">个</text>
					</view>
				</view>

				<!-- 资源录入 -->
				<view class="card">
					<text class="card-title">资源明细录入</text>

					<!-- 录入表单 -->
					<view class="res-form">
						<view class="res-form-row">
							<text class="res-lbl">平台</text>
							<picker :range="platformOptions" :value="platformIndex" @change="onPlatformChange">
								<view class="df-picker">
									<text :class="platformIndex>=0?'df-selected':'df-placeholder'">{{ platformIndex>=0 ? platformOptions[platformIndex] : '请选择' }}</text>
									<svg class="s14 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
									</svg>
								</view>
							</picker>
						</view>
						<view class="res-form-row">
							<text class="res-lbl">主播昵称</text>
							<input class="res-input" v-model="resNickname" placeholder="请输入主播昵称" placeholder-class="ip-pl" />
						</view>
						<view class="res-form-row">
							<text class="res-lbl">联系方式</text>
							<input class="res-input" v-model="resContact" placeholder="微信 / QQ" placeholder-class="ip-pl" />
						</view>
						<view class="res-add-btn" @tap="addResource">添加</view>
					</view>

					<!-- 资源列表 -->
					<view class="res-list" v-if="resourceList.length > 0">
						<view class="res-item" v-for="(item, i) in resourceList" :key="i">
							<view class="res-item-info">
								<text class="res-platform" :class="item.platform==='微信'?'rp-wechat':'rp-join'">{{ item.platform }}</text>
								<text class="res-nickname">{{ item.nickname }}</text>
								<text class="res-contact">{{ item.contact }}</text>
							</view>
							<view class="res-del" @tap="removeResource(i)">
								<svg class="s16" fill="none" stroke="#EF4444" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</view>
						</view>
					</view>
					<text class="res-empty" v-else>暂未添加资源</text>
				</view>

				<!-- 备注 -->
				<view class="card">
					<text class="card-title">备注说明（选填）</text>
					<textarea class="f-textarea" v-model="remark" placeholder="可补充说明今日完成情况..." :maxlength="200" />
					<text class="char-count">{{ remark.length }}/200</text>
				</view>

				<!-- 提交 -->
				<view class="submit-bar">
					<view class="submit-btn" :class="submitting?'submit-disabled':''" @tap="onSubmit">
						{{ submitting ? '提交中...' : '提交完成量' }}
					</view>
				</view>
			</template>
		</view>

		<!-- Toast -->
		<view class="toast" :class="toastVisible?'toast-show':''">
			<text class="toast-text">{{ toastMsg }}</text>
		</view>
	</view>
</template>

<script>
	import { api } from '@/utils/api.js'

	export default {
		data() {
			return {
				publishId: 0,
				assessTitle: '',
				assessCycle: '',
				assessTarget: '',
				assessTargetDetail: '',
				publisher: '',
				wechatCount: 0,
				joinPartyCount: 0,
				remark: '',
				submitting: false,
				toastVisible: false,
				toastMsg: '',
				submitted: false,
				submitStatusText: '已提交考核',
				submitDesc: '',
				/* 资源录入 */
				platformOptions: ['微信', '入会'],
				platformIndex: -1,
				resNickname: '',
				resContact: '',
				resourceList: [],
			}
		},
		onLoad(params) {
			this.publishId = parseInt(params.publish_id) || 0
			this.assessTitle = decodeURIComponent(params.title || '考核任务')
			this.assessCycle = decodeURIComponent(params.cycle || '')
			this.assessTarget = decodeURIComponent(params.target || '')
			this.assessTargetDetail = decodeURIComponent(params.targetDetail || '')
			this.publisher = decodeURIComponent(params.publisher || '')
		},
		async onShow() {
			this.$checkAuth()
			if (this.publishId) {
				await this.checkSubmitted()
			}
		},
		methods: {
			goBack() { uni.navigateBack({ delta: 1 }) },
			onNumInput(field) {
				let v = parseInt(this[field]) || 0
				if (v < 0) v = 0
				this[field] = v
			},
			async checkSubmitted() {
				try {
					const res = await api.get('/api/admin/staff/assessment-detail', { publish_id: this.publishId })
					if (res.data) {
						const status = res.data.user_status
						if (status === 'passed') {
							this.submitted = true
							this.submitStatusText = '总经审核：达标'
							this.submitDesc = '该考核已通过总经审核'
						} else if (status === 'failed') {
							this.submitted = true
							this.submitStatusText = '总经审核：不达标'
							this.submitDesc = '该考核已被标记为不达标'
						} else if (status === 'submitted' || res.data.user_summary) {
							this.submitted = true
							this.submitStatusText = '已提交考核'
							this.submitDesc = '考核已提交，等待总经审核中...'
						}
						// 补充指标要求（URL参数可能丢失，从API兜底）
						if (!this.assessTargetDetail) {
							const parts = []
							if (res.data.wechat_count) parts.push('微信' + res.data.wechat_count + '个')
							if (res.data.join_party_count) parts.push('入会' + res.data.join_party_count + '个')
							if (res.data.recruit_target_num) parts.push('招募' + res.data.recruit_target_num + '人')
							this.assessTargetDetail = parts.join(' / ')
						}
					}
				} catch (e) {
					console.error('[checkSubmitted]', e)
				}
			},
			/* ── 资源录入 ── */
			onPlatformChange(e) { this.platformIndex = parseInt(e.detail.value) },
			addResource() {
				if (this.platformIndex < 0) return this.showToast('请选择平台')
				if (!this.resNickname.trim()) return this.showToast('请输入主播昵称')
				if (!this.resContact.trim()) return this.showToast('请输入联系方式')
				this.resourceList.push({
					platform: this.platformOptions[this.platformIndex],
					nickname: this.resNickname.trim(),
					contact: this.resContact.trim(),
				})
				this.platformIndex = -1
				this.resNickname = ''
				this.resContact = ''
			},
			removeResource(i) { this.resourceList.splice(i, 1) },

			async onSubmit() {
				if (this.submitting) return

				this.submitting = true
				try {
					const res = await api.post('/api/admin/staff/submit-daily', {
						publish_id: this.publishId,
						wechat_count: this.wechatCount,
						join_party_count: this.joinPartyCount,
						remark: this.remark,
						resources: this.resourceList,
					})
					if (res.code === 200) {
						this.submitted = true
						this.submitStatusText = '已提交考核'
						this.submitDesc = '考核已提交，等待总经审核中...'
						this.showToast('提交成功')
					} else {
						this.showToast(res.message || '提交失败')
					}
				} catch (e) {
					this.showToast('网络错误，请重试')
				} finally {
					this.submitting = false
				}
			},
			showToast(msg) {
				this.toastMsg = msg
				this.toastVisible = true
				clearTimeout(this._tt)
				this._tt = setTimeout(() => { this.toastVisible = false }, 2000)
			},
		},
	}
</script>

<style>
	.pg { width: 100%; min-height: 100vh; background: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Noto Sans SC', 'PingFang SC', sans-serif; -webkit-font-smoothing: antialiased }

	/* Header */
	.hdr { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1rpx solid rgba(0,0,0,0.08) }
	.hdr-inner { display: flex; align-items: center; justify-content: space-between; height: 112rpx; padding: 0 32rpx; padding-top: 48rpx }
	.hdr-btn { width: 48rpx; height: 48rpx; display: flex; align-items: center; justify-content: center; border-radius: 20rpx }
	.hdr-btn:active { background: #f9fafb }
	.hdr-btn-placeholder { width: 48rpx }
	.hdr-title { font-size: 32rpx; font-weight: 600; color: #0F172A; letter-spacing: -0.02em }

	/* Main */
	.main { padding: 32rpx }

	/* Card */
	.card { background: #fff; border-radius: 24rpx; padding: 36rpx; margin-bottom: 24rpx; box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.04) }
	.card-hd { display: flex; align-items: center; gap: 12rpx; margin-bottom: 24rpx }
	.dot { width: 12rpx; height: 12rpx; border-radius: 50% }
	.dot-blue { background: #3B82F6 }
	.card-ttl { font-size: 28rpx; font-weight: 600; color: #0F172A }
	.card-title { font-size: 22rpx; font-weight: 600; color: #94A3B8; letter-spacing: 0.08em; display: block; margin-bottom: 24rpx }

	/* Info */
	.info-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx }
	.info-row:last-child { margin-bottom: 0 }
	.info-lbl { font-size: 24rpx; color: #94A3B8 }
	.info-val { font-size: 24rpx; font-weight: 600; color: #475569 }
	.target-val { color: #2563EB; background: #EFF6FF; padding: 6rpx 16rpx; border-radius: 10rpx }

	/* Input Row */
	.input-row { display: flex; align-items: center; gap: 16rpx }
	.input-lbl { font-size: 26rpx; color: #475569; flex-shrink: 0 }
	.num-input { width: 140rpx; height: 72rpx; text-align: center; font-size: 36rpx; font-weight: 700; color: #0F172A; background: #F9FAFB; border-radius: 16rpx; border: 1rpx solid #E2E8F0 }
	.input-unit { font-size: 24rpx; color: #94A3B8 }
	.s18 { width: 36rpx; height: 36rpx; flex-shrink: 0 }

	/* Textarea */
	.f-textarea { width: 100%; height: 120rpx; font-size: 26rpx; color: #374151; background: #F9FAFB; border: 1rpx solid #F1F5F9; border-radius: 16rpx; padding: 20rpx 24rpx; box-sizing: border-box }
	.char-count { font-size: 20rpx; color: #ADB5BD; display: block; text-align: right; margin-top: 10rpx }

	/* Submit */
	.submit-bar { margin-top: 40rpx; padding: 0 8rpx }
	.submit-btn { width: 100%; height: 100rpx; background: #3B82F6; border-radius: 24rpx; display: flex; align-items: center; justify-content: center; font-size: 30rpx; font-weight: 600; color: #fff; box-shadow: 0 8rpx 24rpx rgba(59,130,246,0.25) }
	.submit-btn:active { transform: scale(0.97) }
	.submit-disabled { opacity: 0.6; pointer-events: none }

	/* Resource Entry */
	.res-form { margin-bottom: 20rpx }
	.res-form-row { display: flex; align-items: center; margin-bottom: 16rpx }
	.res-lbl { font-size: 24rpx; color: #64748B; width: 120rpx; flex-shrink: 0 }
	.res-input { flex: 1; height: 64rpx; font-size: 24rpx; color: #374151; background: #F9FAFB; border: 1rpx solid #E2E8F0; border-radius: 12rpx; padding: 0 16rpx; box-sizing: border-box }
	.ip-pl { color: #B0B8C1; font-size: 24rpx }
	.df-picker { display: flex; align-items: center; justify-content: space-between; flex: 1; height: 64rpx; background: #F9FAFB; border: 1rpx solid #E2E8F0; border-radius: 12rpx; padding: 0 16rpx; box-sizing: border-box }
	.df-selected { font-size: 24rpx; color: #374151; font-weight: 500 }
	.df-placeholder { font-size: 24rpx; color: #B0B8C1 }
	.s14 { width: 28rpx; height: 28rpx; flex-shrink: 0 }

	.res-add-btn { width: 100%; height: 64rpx; background: #F0F5F9; border: 1rpx dashed #93C5FD; border-radius: 12rpx; display: flex; align-items: center; justify-content: center; font-size: 24rpx; color: #3B82F6; font-weight: 500 }
	.res-add-btn:active { background: #DBEAFE }

	/* Resource List */
	.res-list { margin-top: 20rpx }
	.res-item { display: flex; align-items: center; justify-content: space-between; padding: 16rpx 12rpx; border-bottom: 1rpx solid #F1F5F9 }
	.res-item:last-child { border-bottom: none }
	.res-item-info { display: flex; align-items: center; gap: 12rpx; flex: 1; flex-wrap: wrap }
	.res-platform { font-size: 20rpx; font-weight: 600; padding: 4rpx 12rpx; border-radius: 8rpx; flex-shrink: 0 }
	.rp-wechat { color: #16A34A; background: #F0FDF4 }
	.rp-join { color: #9333EA; background: #FAF5FF }
	.res-nickname { font-size: 24rpx; color: #374151; font-weight: 500 }
	.res-contact { font-size: 22rpx; color: #94A3B8 }
	.res-del { width: 48rpx; height: 48rpx; display: flex; align-items: center; justify-content: center; flex-shrink: 0 }
	.res-del:active { opacity: 0.6 }
	.s16 { width: 32rpx; height: 32rpx; flex-shrink: 0 }

	.res-empty { font-size: 24rpx; color: #B0B8C1; display: block; text-align: center; padding: 16rpx 0 }

	/* Toast */
	.toast { position: fixed; top: 160rpx; left: 50%; transform: translateX(-50%); z-index: 200; background: rgba(31,41,55,0.92); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); padding: 18rpx 40rpx; border-radius: 9999rpx; pointer-events: none; opacity: 0; transition: opacity 0.2s ease }
	.toast-show { opacity: 1 }
	.toast-text { color: #fff; font-size: 22rpx; font-weight: 500 }

	/* 已提交状态卡片 */
	.submitted-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 56rpx 40rpx;
	}
	.submitted-icon-wrap {
		margin-bottom: 24rpx;
	}
	.s48 {
		width: 96rpx;
		height: 96rpx;
		flex-shrink: 0;
	}
	.submitted-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #0F172A;
		margin-bottom: 12rpx;
	}
	.submitted-desc {
		font-size: 24rpx;
		color: #94A3B8;
		margin-bottom: 36rpx;
	}
	.submitted-back-btn {
		width: 240rpx;
		height: 76rpx;
		background: #3B82F6;
		border-radius: 9999rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		font-weight: 600;
		color: #fff;
		box-shadow: 0 6rpx 20rpx rgba(59,130,246,0.25);
	}
</style>
