<template>
	<view class="pg">
		<!-- 顶部返回 -->
		<view class="header">
			<view class="hdr-row">
				<view class="hdr-back" @tap="goBack">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
				</view>
				<text class="hdr-title">经纪部考核</text>
			</view>
			<text class="hdr-desc">{{ periodVal === '1天' ? '录入每日招募指标，总经办+财务部双审核' : periodVal === '7天' ? '录入每周招募指标，总经办+财务部双审核' : '录入每月招募指标，总经办+财务部双审核' }}</text>
		</view>

		<!-- 表单区域 -->
		<view class="main">

			<!-- 1. 考核周期 -->
			<view class="field">
				<text class="f-label">考核周期</text>
				<picker mode="selector" :range="periodList" :value="periodIdx" @change="onPeriodChange">
					<view class="f-picker">
						<text class="picker-text"
							:class="{'picker-placeholder': !periodVal}">{{ periodVal || '请选择考核周期' }}</text>
						<svg class="s16 slate-400" viewBox="0 0 16 16" fill="none">
							<path d="M4 6L8 10L12 6" stroke="#8E8E93" stroke-width="1.5" stroke-linecap="round"
								stroke-linejoin="round" />
						</svg>
					</view>
				</picker>
			</view>

			<!-- 2. 招募主播目标值 -->
			<view class="field">
				<text class="f-label">{{ cycleLabel('招募主播目标值') }}</text>
				<view class="f-input-wrap">
					<input class="f-input" type="number" v-model="form.target" placeholder="请输入目标人数"
						@input="calcRate" />
					<text class="f-unit">人</text>
				</view>
			</view>

			<!-- 3. 实际招募主播人数 -->
			<view class="field">
				<text class="f-label">{{ cycleLabel('招募主播人数') }}</text>
				<view class="f-input-wrap">
					<input class="f-input" type="number" v-model="form.actual" placeholder="请输入实际招募人数"
						@input="calcRate" />
					<text class="f-unit">人</text>
				</view>
			</view>

			<!-- 3.5 每日微信/入会目标 -->
			<view class="field">
				<text class="f-label">{{ cycleLabel('添加微信目标') }}</text>
				<view class="f-input-wrap">
					<input class="f-input" type="number" v-model="form.wechat" placeholder="请输入添加微信目标数量" />
					<text class="f-unit">个</text>
				</view>
			</view>
			<view class="field">
				<text class="f-label">{{ cycleLabel('邀请入会目标') }}</text>
				<view class="f-input-wrap">
					<input class="f-input" type="number" v-model="form.joinParty" placeholder="请输入邀请入会目标数量" />
					<text class="f-unit">个</text>
				</view>
			</view>

			<!-- 4. 招募任务完成率 -->
			<view class="field">
				<text class="f-label">{{ cycleLabel('招募任务完成率') }}</text>
				<view class="f-input-wrap">
					<input class="f-input" type="text" v-model="completionRate" placeholder="自动计算或手动输入" />
					<text class="f-unit">%</text>
				</view>
				<text class="f-hint">根据目标值与实际人数自动计算，也可手动调整</text>
			</view>

			<!-- 5. 招募达标状态 -->
			<view class="field">
				<text class="f-label">{{ cycleLabel('招募达标状态') }}</text>
				<view class="radio-row">
					<view class="radio-pill" :class="form.status==='pass' ? 'radio-active' : 'radio-inactive'"
						@tap="form.status='pass'">
						<view class="radio-dot" :class="form.status==='pass' ? 'dot-filled' : 'dot-empty'"></view>
						<text>已达标</text>
					</view>
					<view class="radio-pill" :class="form.status==='fail' ? 'radio-active' : 'radio-inactive'"
						@tap="form.status='fail'">
						<view class="radio-dot dot-empty"></view>
						<text>未达标</text>
					</view>
				</view>
			</view>

			<!-- 分隔线 -->
			<view class="divider"></view>

			<!-- 6. 招募考核规则说明 -->
			<view class="field">
				<text class="f-label">招募考核规则说明</text>
				<view class="textarea-wrap">
					<textarea class="f-textarea" v-model="form.rule" placeholder="请输入考核规则说明、备注或其他补充信息..."
						:maxlength="500" @input="onTextInput" />
					<view class="textarea-foot">
						<text class="char-count" :class="{'char-over': charLen > 500}">{{ charLen }}/500</text>
					</view>
				</view>
			</view>

			<!-- 审核队列提示 -->
			<view class="audit-tip">
				<svg class="s18 tip-icon" viewBox="0 0 18 18" fill="none" stroke="#8E8E93" stroke-width="1.5">
					<circle cx="9" cy="9" r="7.5" />
					<path d="M9 6V9.75" stroke-linecap="round" />
					<circle cx="9" cy="5" r="0.75" fill="#8E8E93" />
				</svg>
				<view>
					<text class="tip-title">提交后将进入双审核队列</text>
					<text class="tip-desc">财务部初审 → 总经办终审，预计2-3个工作日完成</text>
				</view>
			</view>

			<!-- 7. 提交按钮 -->
			<view class="submit-btn" @tap="onSubmit">
				<text>提交审核</text>
				<svg class="s18 white" viewBox="0 0 18 18" fill="none" stroke="white" stroke-width="1.5"
					stroke-linecap="round" stroke-linejoin="round">
					<path d="M3.75 9H14.25M14.25 9L9.75 4.5M14.25 9L9.75 13.5" />
				</svg>
			</view>

			<!-- 底部安全区 -->
			<view class="safe-btm"></view>

		</view>

		<!-- 提交成功弹窗 -->
		<view class="modal-overlay" v-if="showModal" @tap="closeModal">
			<view class="modal-card" @tap.stop>
				<view class="modal-icon">
					<svg class="s28 white" viewBox="0 0 28 28" fill="none" stroke="white" stroke-width="2.5"
						stroke-linecap="round" stroke-linejoin="round">
						<path d="M6 14L11.5 19.5L22 8.5" />
					</svg>
				</view>
				<text class="modal-title">提交成功</text>
				<text class="modal-desc">考核数据已录入，正在进入审核队列</text>

				<view class="modal-queue">
					<view class="mq-item">
						<view class="mq-num mq-active">1</view>
						<view class="mq-text">
							<text class="mq-name">财务部审核</text>
							<text class="mq-status">待审核</text>
						</view>
						<view class="mq-badge">待审核</view>
					</view>
					<view class="mq-item mq-wait">
						<view class="mq-num">2</view>
						<view class="mq-text">
							<text class="mq-name">总经办审核</text>
							<text class="mq-status">等待中</text>
						</view>
					</view>
				</view>

				<view class="modal-btn" @tap="closeModal">知道了</view>
			</view>
		</view>

	</view>
</template>

<script>
	import { api } from '@/utils/api.js'

	export default {
		data() {
			return {
				periodList: ['1天', '7天', '30天'],
				periodIdx: 0,
				form: {
					target: '',
					actual: '',
					status: 'pass',
					rule: '',
					wechat: '',
					joinParty: '',
				},
				showModal: false,
				charLen: 0,
				submitting: false,
			}
		},
		computed: {
			periodVal() {
				return this.periodList[this.periodIdx] || '7天'
			},
			cyclePrefix() {
				if (this.periodVal === '1天') return '每日'
				return this.periodVal === '7天' ? '每周' : '每月'
			},
			cyclePrefix2() {
				if (this.periodVal === '1天') return '日度'
				return this.periodVal === '7天' ? '周度' : '月度'
			},
			completionRate() {
				const t = parseFloat(this.form.target) || 0
				const a = parseFloat(this.form.actual) || 0
				if (t > 0 && a >= 0) return Math.round((a / t) * 100)
				return ''
			}
		},
		onShow() {
			this.$checkAuth()
		},
		methods: {
			cycleLabel(text) {
				// 对于"招募主播目标值"和"招募达标状态"用"周度/月度"
				// 对于"招募主播人数"和"招募任务完成率"用"每周/每月"
				if (text.includes('目标值') || text.includes('达标')) {
					return this.cyclePrefix2 + text
				}
				return this.cyclePrefix + text
			},
			goBack() { uni.navigateBack() },
			onPeriodChange(e) {
				this.periodIdx = e.detail.value
			},
			calcRate() {
				/* auto via computed */ },
			onTextInput(e) {
				this.charLen = (e.detail.value || '').length
			},
			async onSubmit() {
				if (this.submitting) return
				if (!this.periodVal) {
					uni.showToast({ title: '请选择考核周期', icon: 'none' })
					return
				}
				if (!this.form.target) {
					uni.showToast({ title: '请输入目标值', icon: 'none' })
					return
				}
				if (!this.form.actual) {
					uni.showToast({ title: '请输入实际招募人数', icon: 'none' })
					return
				}

				this.submitting = true
				uni.showLoading({ title: '提交中...', mask: true })
				try {
					await api.post('/api/admin/broker/assessments', {
						assess_cycle: this.periodVal,
						monthly_recruit_target: parseInt(this.form.target) || 0,
						actual_recruit_num: parseInt(this.form.actual) || 0,
						completion_rate: parseFloat(this.completionRate) || 0,
						is_standard: this.form.status === 'pass' ? '达标' : '未达标',
						rule_description: this.form.rule,
						wechat_count: parseInt(this.form.wechat) || 0,
						join_party_count: parseInt(this.form.joinParty) || 0,
					})
					uni.hideLoading()
					this.showModal = true
				} catch (e) {
					uni.hideLoading()
				}
				this.submitting = false
			},
			closeModal() {
				this.showModal = false
			},
		}
	}
</script>

<style>
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #F5F5F7;
		font-family: 'DM Sans', 'Noto Sans SC', 'PingFang SC', system-ui, sans-serif;
		-webkit-font-smoothing: antialiased
	}

	/* header */
	.header {
		padding: 80rpx 48rpx 56rpx;
		background: #fff
	}

	.header { background:#fff; padding:24rpx 28rpx; border-bottom:1rpx solid #f1f5f9 }
	.hdr-back { width:56rpx; height:56rpx; display:flex; align-items:center; justify-content:center; margin-right:10rpx; border-radius:50%; flex-shrink:0 }
	.hdr-back:active { background:rgba(0,0,0,.06) }
	.hdr-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx;
		margin-bottom: 16rpx
	}

	.hdr-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 24rpx;
		background: #1C1C1E;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.hdr-title {
		font-size: 44rpx;
		font-weight: 700;
		color: #1C1C1E;
		letter-spacing: -0.5px
	}

	.hdr-desc {
		font-size: 28rpx;
		color: #8E8E93;
		line-height: 1.5;
		padding-left: 104rpx;
		display: block
	}

	/* main */
	.main {
		padding: 0 48rpx;
		margin-top: 30rpx;
	}

	/* field */
	.field {
		margin-bottom: 48rpx
	}

	.f-label {
		display: block;
		font-size: 26rpx;
		font-weight: 600;
		color: #1C1C1E;
		text-transform: uppercase;
		letter-spacing: 1px;
		margin-bottom: 24rpx
	}

	.f-input-wrap {
		position: relative
	}

	.f-input {
		width: 100%;
		height: 104rpx;
		padding: 0 32rpx;
		padding-right: 80rpx;
		font-size: 30rpx;
		font-weight: 500;
		color: #1C1C1E;
		background: #fff;
		border: 1rpx solid #E5E5EA;
		border-radius: 24rpx;
		box-sizing: border-box
	}

	.f-input::placeholder {
		color: #C7C7CC
	}

	.f-unit {
		position: absolute;
		right: 32rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 26rpx;
		font-weight: 500;
		color: #8E8E93
	}

	.f-picker {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 104rpx;
		padding: 0 32rpx;
		background: #fff;
		border: 1rpx solid #E5E5EA;
		border-radius: 24rpx;
		box-sizing: border-box
	}

	.picker-text {
		font-size: 30rpx;
		font-weight: 500;
		color: #1C1C1E
	}

	.picker-placeholder {
		color: #C7C7CC
	}

	.f-hint {
		font-size: 24rpx;
		color: #C7C7CC;
		margin-top: 16rpx;
		display: block
	}

	/* radio */
	.radio-row {
		display: flex;
		flex-direction: row;
		gap: 24rpx
	}

	.radio-pill {
		flex: 1;
		height: 96rpx;
		border-radius: 24rpx;
		border: 1px solid #E5E5EA;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 16rpx;
		font-size: 30rpx;
		transition: all .2s
	}

	.radio-active {
		background: #1C1C1E;
		color: #fff;
		border-color: #1C1C1E;
		font-weight: 600
	}

	.radio-inactive {
		background: #fff;
		color: #8E8E93;
		font-weight: 500
	}

	.radio-dot {
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%
	}

	.dot-filled {
		background: #fff
	}

	.dot-empty {
		border: 3rpx solid #C7C7CC
	}

	/* divider */
	.divider {
		height: 1rpx;
		background: #E5E5EA;
		margin-bottom: 48rpx
	}

	/* textarea */
	.textarea-wrap {
		background: #fff;
		border: 1rpx solid #E5E5EA;
		border-radius: 24rpx;
		overflow: hidden
	}

	.f-textarea {
		width: 100%;
		height: 280rpx;
		padding: 28rpx 32rpx;
		font-size: 30rpx;
		font-weight: 400;
		color: #1C1C1E;
		line-height: 1.6;
		box-sizing: border-box
	}

	.f-textarea::placeholder {
		color: #C7C7CC
	}

	.textarea-foot {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		padding: 0 32rpx 20rpx
	}

	.char-count {
		font-size: 24rpx;
		color: #C7C7CC
	}

	.char-over {
		color: #FF3B30
	}

	/* audit tip */
	.audit-tip {
		display: flex;
		flex-direction: row;
		gap: 24rpx;
		padding: 28rpx 32rpx;
		background: #F5F5F7;
		border-radius: 24rpx;
		margin-bottom: 48rpx
	}

	.tip-icon {
		margin-top: 4rpx;
		flex-shrink: 0
	}

	.tip-title {
		font-size: 26rpx;
		font-weight: 500;
		color: #1C1C1E;
		display: block
	}

	.tip-desc {
		font-size: 24rpx;
		color: #8E8E93;
		display: block;
		margin-top: 8rpx
	}

	/* submit */
	.submit-btn {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 16rpx;
		width: 100%;
		height: 108rpx;
		background: #1C1C1E;
		color: #fff;
		font-size: 32rpx;
		font-weight: 600;
		border-radius: 28rpx;
		box-shadow: 0 8rpx 32rpx rgba(28, 28, 30, .2);
		margin-bottom: 48rpx
	}

	.submit-btn:active {
		transform: scale(.98);
		opacity: .9
	}

	/* modal */
	.modal-overlay {
		position: fixed;
		inset: 0;
		z-index: 100;
		background: rgba(0, 0, 0, .4);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 48rpx
	}

	.modal-card {
		width: 640rpx;
		background: #fff;
		border-radius: 40rpx;
		padding: 56rpx 48rpx 40rpx;
		text-align: center;
		box-shadow: 0 40rpx 120rpx rgba(0, 0, 0, .15)
	}

	.modal-icon {
		width: 128rpx;
		height: 128rpx;
		border-radius: 50%;
		background: #1C1C1E;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 40rpx
	}

	.modal-title {
		font-size: 36rpx;
		font-weight: 700;
		color: #1C1C1E;
		display: block;
		margin-bottom: 16rpx
	}

	.modal-desc {
		font-size: 28rpx;
		color: #8E8E93;
		line-height: 1.5;
		display: block;
		margin-bottom: 48rpx
	}

	.modal-queue {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
		margin-bottom: 40rpx
	}

	.mq-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx;
		padding: 24rpx;
		background: #F5F5F7;
		border-radius: 20rpx;
		text-align: left
	}

	.mq-wait {
		opacity: .5
	}

	.mq-num {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		background: #E5E5EA;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22rpx;
		font-weight: 700;
		color: #8E8E93;
		flex-shrink: 0
	}

	.mq-active {
		background: #1C1C1E;
		color: #fff
	}

	.mq-text {
		flex: 1
	}

	.mq-name {
		font-size: 26rpx;
		font-weight: 600;
		color: #1C1C1E
	}

	.mq-status {
		font-size: 22rpx;
		color: #8E8E93;
		display: block;
		margin-top: 2rpx
	}

	.mq-badge {
		display: inline-flex;
		align-items: center;
		gap: 12rpx;
		padding: 8rpx 24rpx;
		border-radius: 9999rpx;
		background: #FFF3E0;
		font-size: 24rpx;
		font-weight: 500;
		color: #E65100
	}

	.modal-btn {
		width: 100%;
		height: 96rpx;
		background: #1C1C1E;
		color: #fff;
		font-size: 30rpx;
		font-weight: 600;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.safe-btm {
		height: 64rpx
	}

	/* utility */
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

	.s28 {
		width: 56rpx;
		height: 56rpx;
		flex-shrink: 0
	}

	.white {
		color: #fff
	}

	.slate-400 {
		color: #8E8E93
	}
</style>