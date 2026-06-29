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
				<text class="hdr-title">编辑考核</text>
				<view class="hdr-btn-placeholder"></view>
			</view>
		</view>

		<!-- Form -->
		<view class="main">
			<!-- 部门（只读展示） -->
			<view class="card">
				<text class="card-title">考核部门</text>
				<view class="dept-grid">
					<view v-for="d in deptList" :key="d.id" class="dept-item" :class="form.deptId===d.id?'dept-on':''">
						<view class="dept-icon" :class="d.iconBg">
							<svg class="s16" :class="d.iconCls" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path :d="d.iconPath" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</view>
						<text class="dept-name">{{ d.name }}</text>
					</view>
				</view>
			</view>

			<!-- ── 人事部表单 ── -->
			<template v-if="form.deptId===3">
				<view class="card">
					<text class="card-title">考核周期</text>
					<picker mode="selector" :range="cycleLabels" :value="cycleIdx" @change="onCycleChange">
						<view class="picker-row">
							<text :class="form.cycle?'':'placeholder'">{{ form.cycle || '请选择考核周期' }}</text>
							<svg class="s14 gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
							</svg>
						</view>
					</picker>
				</view>

				<view class="card">
					<text class="card-title">考核内容</text>
					<textarea class="f-textarea" v-model="form.target" placeholder="请输入考核目标，如：每天招聘三个试岗员工" :maxlength="500" />
					<text class="char-count">{{ form.target.length }}/500</text>
				</view>
			</template>

			<!-- ── 经纪部表单 ── -->
			<template v-if="form.deptId===4">
				<view class="card">
					<text class="card-title">考核周期</text>
					<picker mode="selector" :range="cycleLabels" :value="cycleIdx" @change="onCycleChange">
						<view class="picker-row">
							<text :class="form.cycle?'':'placeholder'">{{ form.cycle || '请选择考核周期' }}</text>
							<svg class="s14 gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
							</svg>
						</view>
					</picker>
				</view>

				<view class="card">
					<text class="card-title">每日添加微信数量</text>
					<view class="stepper-row">
						<view class="stepper-btn" :class="broker.wechat<=0?'stepper-disabled':''" @tap="broker.wechat>0?broker.wechat--:null">
							<svg class="s14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" d="M5 12h14"/></svg>
						</view>
						<text class="stepper-num">{{ broker.wechat }}</text>
						<view class="stepper-btn" @tap="broker.wechat++">
							<svg class="s14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"/></svg>
						</view>
						<text class="stepper-unit">个微信</text>
					</view>
				</view>

				<view class="card">
					<text class="card-title">每日邀请入会数量</text>
					<view class="stepper-row">
						<view class="stepper-btn" :class="broker.joinParty<=0?'stepper-disabled':''" @tap="broker.joinParty>0?broker.joinParty--:null">
							<svg class="s14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" d="M5 12h14"/></svg>
						</view>
						<text class="stepper-num">{{ broker.joinParty }}</text>
						<view class="stepper-btn" @tap="broker.joinParty++">
							<svg class="s14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"/></svg>
						</view>
						<text class="stepper-unit">个入会</text>
					</view>
				</view>

				<view class="card preview-card">
					<text class="card-title">考核要求</text>
					<text class="preview-text">每日添加微信{{ broker.wechat }}人，邀请入会{{ broker.joinParty }}人</text>
				</view>
			</template>

			<!-- ── 中转部/运营部表单 ── -->
			<template v-if="form.deptId===5 || form.deptId===6">
				<view class="card">
					<text class="card-title">考核周期</text>
					<picker mode="selector" :range="cycleLabels" :value="cycleIdx" @change="onCycleChange">
						<view class="picker-row">
							<text :class="form.cycle?'':'placeholder'">{{ form.cycle || '请选择考核周期' }}</text>
							<svg class="s14 gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
							</svg>
						</view>
					</picker>
				</view>

				<view class="card">
					<text class="card-title">考核要求</text>
					<textarea class="f-textarea" v-model="form.target" placeholder="请输入考核要求..." :maxlength="500" />
					<text class="char-count">{{ form.target.length }}/500</text>
				</view>
			</template>

			<!-- ── 主播部表单 ── -->
			<template v-if="form.deptId===7">
				<view class="card">
					<text class="card-title">考核周期</text>
					<picker mode="selector" :range="cycleLabels" :value="cycleIdx" @change="onCycleChange">
						<view class="picker-row">
							<text :class="form.cycle?'':'placeholder'">{{ form.cycle || '请选择考核周期' }}</text>
							<svg class="s14 gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
							</svg>
						</view>
					</picker>
				</view>

				<view class="card">
					<text class="card-title">月度开播天数</text>
					<text class="card-subtitle">主播当月需要有效开播的天数</text>
					<view class="stepper-row">
						<view class="stepper-btn" :class="anchor.streamDays<=0?'stepper-disabled':''" @tap="anchor.streamDays>0?anchor.streamDays--:null">
							<svg class="s14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" d="M5 12h14"/></svg>
						</view>
						<text class="stepper-num">{{ anchor.streamDays }}</text>
						<view class="stepper-btn" @tap="anchor.streamDays++">
							<svg class="s14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"/></svg>
						</view>
						<text class="stepper-unit">天/月</text>
					</view>
				</view>

				<view class="card">
					<text class="card-title">每日直播时长</text>
					<text class="card-subtitle">主播每天需达到的有效直播时长</text>
					<view class="stepper-row">
						<view class="stepper-btn" :class="anchor.dailyHours<=0?'stepper-disabled':''" @tap="anchor.dailyHours>0?anchor.dailyHours=(anchor.dailyHours-0.5).toFixed(1)*1:null">
							<svg class="s14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" d="M5 12h14"/></svg>
						</view>
						<text class="stepper-num">{{ anchor.dailyHours }}</text>
						<view class="stepper-btn" @tap="anchor.dailyHours=(anchor.dailyHours+0.5).toFixed(1)*1">
							<svg class="s14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"/></svg>
						</view>
						<text class="stepper-unit">小时/天</text>
					</view>
				</view>

				<view class="card">
					<text class="card-title">月度礼物流水目标</text>
					<text class="card-subtitle">主播当月需达到的礼物打赏总流水</text>
					<view class="stepper-row">
						<view class="stepper-btn" :class="anchor.giftRevenue<=0?'stepper-disabled':''" @tap="anchor.giftRevenue>0?anchor.giftRevenue-=100:null">
							<svg class="s14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" d="M5 12h14"/></svg>
						</view>
						<text class="stepper-num">{{ anchor.giftRevenue }}</text>
						<view class="stepper-btn" @tap="anchor.giftRevenue+=100">
							<svg class="s14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"/></svg>
						</view>
						<text class="stepper-unit">元/月</text>
					</view>
				</view>

				<view class="card">
					<text class="card-title">每日添加大哥数</text>
					<text class="card-subtitle">主播每天需添加的高价值用户（大哥）数量</text>
					<view class="stepper-row">
						<view class="stepper-btn" :class="anchor.bigSpender<=0?'stepper-disabled':''" @tap="anchor.bigSpender>0?anchor.bigSpender--:null">
							<svg class="s14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" d="M5 12h14"/></svg>
						</view>
						<text class="stepper-num">{{ anchor.bigSpender }}</text>
						<view class="stepper-btn" @tap="anchor.bigSpender++">
							<svg class="s14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"/></svg>
						</view>
						<text class="stepper-unit">个/天</text>
					</view>
				</view>

				<view class="card preview-card">
					<text class="card-title">考核要求预览</text>
					<text class="preview-text">月度开播{{ anchor.streamDays }}天，每日直播{{ anchor.dailyHours }}小时，月礼物流水{{ anchor.giftRevenue }}元，每日添加大哥{{ anchor.bigSpender }}人</text>
				</view>
			</template>

			<!-- 提交按钮 -->
			<view class="submit-bar">
				<view class="submit-btn" :class="submitting?'submit-disabled':''" @tap="onSubmit">
					{{ submitting ? '保存中...' : '保存修改' }}
				</view>
			</view>

			<view class="spacer"></view>
		</view>

		<!-- Toast -->
		<view class="toast" :class="toastVisible?'toast-show':''">
			<text class="toast-text">{{ toastMsg }}</text>
		</view>
	</view>
</template>

<script>
	import { api } from '@/utils/api.js'

	const DEPT_LIST = [
		{ id: 3, name: '人事部', iconBg: 'bg-pink', iconCls: 'txt-pink', iconPath: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
		{ id: 4, name: '经纪部', iconBg: 'bg-blue', iconCls: 'txt-blue', iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z' },
		{ id: 5, name: '中转部', iconBg: 'bg-emerald', iconCls: 'txt-emerald', iconPath: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
		{ id: 6, name: '运营部', iconBg: 'bg-violet', iconCls: 'txt-violet', iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
		{ id: 7, name: '主播部', iconBg: 'bg-rose', iconCls: 'txt-rose', iconPath: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
	]
	const CYCLE_OPTS = ['日度（1天）', '周度（7天）', '月度（30天）']

	export default {
		data() {
			return {
				editId: 0,
				deptList: DEPT_LIST,
				cycleLabels: CYCLE_OPTS,
				cycleIdx: 0,
				form: {
					deptId: 0,
					cycle: '',
					target: '',
				},
				broker: {
					wechat: 5,
					joinParty: 1,
				},
				anchor: {
					streamDays: 26,
					dailyHours: 6,
					giftRevenue: 5000,
					bigSpender: 3,
				},
				submitting: false,
				loading: true,
				toastVisible: false,
				toastMsg: '',
			}
		},
		onLoad(options) {
			this.editId = parseInt(options.id) || 0
			if (this.editId) {
				this.loadDetail()
			}
		},
		onShow() {
			this.$checkAuth()
		},
		methods: {
			async loadDetail() {
				this.loading = true
				try {
					const res = await api.get('/api/admin/hr/assessments/' + this.editId, null, { silent: true })
					if (res.code === 200 && res.data) {
						const d = res.data
						this.form.deptId = d.dept_id

						// 匹配考核周期索引
						this.cycleIdx = CYCLE_OPTS.indexOf(d.assess_cycle)
						if (this.cycleIdx < 0) this.cycleIdx = 0
						this.form.cycle = d.assess_cycle || CYCLE_OPTS[0]

					// 人事部/中转部/运营部/主播部：target_remark 回显
					if (d.dept_id === 3 || d.dept_id >= 5) {
						this.form.target = d.target_remark || ''
					}

					// 经纪部：wechat_count, join_party_count
					if (d.dept_id === 4) {
						this.broker.wechat = d.wechat_count || 5
						this.broker.joinParty = d.join_party_count || 1
						this.form.target = d.target_remark || ''
					}

					// 主播部：anchor fields
					if (d.dept_id === 7) {
						this.anchor.streamDays = d.stream_days || 26
						this.anchor.dailyHours = d.daily_hours || 6
						this.anchor.giftRevenue = d.gift_revenue || 5000
						this.anchor.bigSpender = d.big_spender_count || 3
					}
					}
				} catch (e) {
					console.error('[编辑考核] 加载失败:', e)
					this.showToast('加载考核数据失败')
				} finally {
					this.loading = false
				}
			},

			onCycleChange(e) {
				this.cycleIdx = e.detail.value
				this.form.cycle = CYCLE_OPTS[e.detail.value]
			},

			async onSubmit() {
				if (this.submitting) return
				if (!this.form.cycle) { this.showToast('请选择考核周期'); return }

				if (this.form.deptId === 4) {
					if (this.broker.wechat <= 0) { this.showToast('请设置每日微信数量'); return }
					if (this.broker.joinParty <= 0) { this.showToast('请设置每日入会数量'); return }
				}

			if (this.form.deptId === 3) {
				if (!this.form.target.trim()) { this.showToast('请输入考核内容'); return }
			}

			if (this.form.deptId === 7) {
				if (this.anchor.streamDays <= 0) { this.showToast('请设置月度开播天数'); return }
				if (this.anchor.dailyHours <= 0) { this.showToast('请设置每日直播时长'); return }
				if (this.anchor.giftRevenue <= 0) { this.showToast('请设置月礼物流水目标'); return }
				if (this.anchor.bigSpender <= 0) { this.showToast('请设置每日大哥数'); return }
			}

				this.submitting = true
				try {
					const payload = {
						assess_cycle: this.form.cycle,
						target_remark: this.form.target,
					}

				if (this.form.deptId === 4) {
					payload.wechat_count = this.broker.wechat
					payload.join_party_count = this.broker.joinParty
				}
				if (this.form.deptId === 3) {
					payload.recruit_target = 3
				}
				if (this.form.deptId === 7) {
					payload.stream_days = this.anchor.streamDays
					payload.daily_hours = this.anchor.dailyHours
					payload.gift_revenue = this.anchor.giftRevenue
					payload.big_spender_count = this.anchor.bigSpender
				}

					const res = await api.put('/api/admin/hr/assessments/' + this.editId, payload)
					if (res.code === 200) {
						this.showToast('保存成功')
						setTimeout(() => { uni.navigateBack() }, 1000)
					} else {
						this.showToast(res.message || '保存失败')
					}
				} catch (e) {
					this.showToast('网络错误，请重试')
				} finally {
					this.submitting = false
				}
			},

			goBack() { uni.navigateBack({ delta: 1 }) },

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
	.s14 { width: 28rpx; height: 28rpx; flex-shrink: 0 }
	.s16 { width: 32rpx; height: 32rpx; flex-shrink: 0 }
	.s18 { width: 36rpx; height: 36rpx; flex-shrink: 0 }
	.gray-400 { color: #9ca3af }

	/* Header */
	.hdr { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1rpx solid rgba(0,0,0,0.08) }
	.hdr-inner { display: flex; align-items: center; justify-content: space-between; height: 112rpx; padding: 0 32rpx; padding-top: 48rpx }
	.hdr-btn { width: 48rpx; height: 48rpx; display: flex; align-items: center; justify-content: center; border-radius: 20rpx }
	.hdr-btn:active { background: #f9fafb }
	.hdr-btn-placeholder { width: 48rpx }
	.hdr-title { font-size: 32rpx; font-weight: 600; color: #0F172A; letter-spacing: -0.02em }

	/* Main */
	.main { padding: 32rpx }
	.spacer { height: 80rpx }

	/* Card */
	.card { background: #fff; border-radius: 24rpx; padding: 36rpx; margin-bottom: 24rpx; box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.04) }
	.card-title { font-size: 22rpx; font-weight: 600; color: #94A3B8; letter-spacing: 0.08em; display: block; margin-bottom: 24rpx }

	/* Dept Grid */
	.dept-grid { display: flex; flex-wrap: wrap; gap: 16rpx }
	.dept-item { display: flex; align-items: center; gap: 12rpx; padding: 14rpx 22rpx; border-radius: 16rpx; border: 2rpx solid #F1F5F9; background: #fff }
	.dept-on { border-color: #3B82F6; background: #EFF6FF }
	.dept-icon { width: 48rpx; height: 48rpx; border-radius: 12rpx; display: flex; align-items: center; justify-content: center }
	.bg-blue { background: #DBEAFE } .bg-emerald { background: #D1FAE5 } .bg-violet { background: #EDE9FE } .bg-rose { background: #FFE4E6 } .bg-pink { background: #FCE7F3 }
	.txt-blue { color: #2563EB } .txt-emerald { color: #059669 } .txt-violet { color: #7C3AED } .txt-rose { color: #E11D48 } .txt-pink { color: #BE185D }
	.dept-name { font-size: 22rpx; font-weight: 600; color: #0F172A }

	/* Picker */
	.picker-row { display: flex; justify-content: space-between; align-items: center; padding: 24rpx 0 }
	.picker-row text:first-child { font-size: 28rpx; color: #0F172A; font-weight: 500 }
	.placeholder { color: #ADB5BD !important }

	/* Stepper */
	.stepper-row { display: flex; align-items: center; gap: 16rpx }
	.stepper-btn { width: 64rpx; height: 64rpx; border-radius: 16rpx; background: #F1F5F9; display: flex; align-items: center; justify-content: center }
	.stepper-btn:active { background: #E2E8F0 }
	.stepper-disabled { opacity: 0.4; pointer-events: none }
	.stepper-num { font-size: 40rpx; font-weight: 700; color: #0F172A; min-width: 72rpx; text-align: center }
	.stepper-unit { font-size: 24rpx; color: #94A3B8; margin-left: 4rpx }

	/* Textarea */
	.f-textarea { width: 100%; height: 160rpx; font-size: 26rpx; color: #374151; background: #F9FAFB; border: 1rpx solid #F1F5F9; border-radius: 16rpx; padding: 20rpx 24rpx; box-sizing: border-box }

	/* Preview card */
	.preview-card { background: #F0FDF4; border: 2rpx solid #BBF7D0 }
	.preview-text { font-size: 28rpx; color: #15803D; font-weight: 600; line-height: 1.6 }

	/* Submit */
	.submit-bar { padding: 0 8rpx }
	.submit-btn { width: 100%; height: 100rpx; background: #10B981; border-radius: 24rpx; display: flex; align-items: center; justify-content: center; font-size: 30rpx; font-weight: 600; color: #fff; box-shadow: 0 8rpx 24rpx rgba(16,185,129,0.25) }
	.submit-btn:active { transform: scale(0.97) }
	.submit-disabled { opacity: 0.6; pointer-events: none }

	/* Toast */
	.toast { position: fixed; top: 160rpx; left: 50%; transform: translateX(-50%); z-index: 200; background: rgba(31,41,55,0.92); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); padding: 18rpx 40rpx; border-radius: 9999rpx; pointer-events: none; opacity: 0; transition: opacity 0.2s ease }
	.toast-show { opacity: 1 }
	.toast-text { color: #fff; font-size: 22rpx; font-weight: 500 }
</style>
