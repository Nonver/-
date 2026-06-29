<template>
	<!-- <view class="pg"> -->

		<!-- Header -->
		<view class="hdr anim-slide" style="animation-delay:0s">
			<view class="hdr-row">
				<view class="hdr-back" @tap="goBack"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"
						stroke="#64748b" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg></view>
				<view class="hdr-row">
					<text class="hdr-title">每日流水提交</text>
					<view class="dept-tag">运营部</view>
				</view>
				<text class="hdr-date">{{ currentDate }}</text>
			</view>

			<!-- ═══ Form (hidden after submit) ═══ -->
			<view v-show="!submitted" class="form-wrap anim-slide" style="animation-delay:0.05s">
				<view class="form-card">

					<!-- 流水日期 -->
					<view class="field">
						<text class="field-label">流水日期</text>
						<picker mode="date" :value="formDate" @change="onDateChange" fields="day">
							<view class="field-input field-picker">
								<text :class="formDate?'fi-text':'fi-placeholder'">{{ formDate || '请选择日期' }}</text>
								<svg class="s16 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
							</view>
						</picker>
					</view>

					<!-- 流水类型 -->
					<view class="field">
						<text class="field-label">流水类型</text>
						<picker :range="typeOptions" range-key="label" :value="typeIndex" @change="onTypeChange">
							<view class="field-input field-picker">
								<text
									:class="typeIndex>=0?'fi-text':'fi-placeholder'">{{ typeIndex>=0 ? typeOptions[typeIndex].label : '请选择流水类型' }}</text>
								<svg class="s16 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M19 9l-7 7-7-7" />
								</svg>
							</view>
						</picker>
					</view>

					<!-- 金额 -->
					<view class="field">
						<text class="field-label">金额</text>
						<view class="amount-wrap">
							<text class="yen-symbol">¥</text>
							<input class="field-input amount-input" type="digit" v-model="amount" placeholder="0.00"
								placeholder-class="input-placeholder" />
						</view>
					</view>

					<!-- 关联主播 -->
					<view class="field">
						<text class="field-label">关联主播</text>
						<view class="field-input field-picker" @tap="openAnchorPicker">
							<text :class="selectedAnchor?'fi-text':'fi-placeholder'">{{ selectedAnchor ? selectedAnchor.name : '请选择关联主播' }}</text>
							<svg class="s16 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</view>
					</view>

					<!-- 备注 -->
					<view class="field">
						<text class="field-label">备注</text>
						<textarea class="textarea-field" v-model="remark" placeholder="补充说明（选填）"
							placeholder-class="input-placeholder" :maxlength="200" />
					</view>

				</view>
			</view>

			<!-- Submit Button (hidden after submit) -->
			<view v-show="!submitted" class="submit-area anim-slide" style="animation-delay:0.1s">
				<view class="submit-btn" :class="submitting?'btn-disabled':''" @tap="handleSubmit">
					<template v-if="!submitting">
						<text>提交审核</text>
						<svg class="s16 white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					</template>
					<template v-else>
						<view class="spinner"></view>
						<text>提交中...</text>
					</template>
				</view>
				<text class="submit-hint">提交后将同步至财务审核系统</text>
			</view>

			<!-- ═══ Submitted State ═══ -->
			<view v-show="submitted" class="submitted-area anim-fade">
				<view class="result-card">
					<view class="result-header">
						<view class="result-icon-bg">
							<svg class="s20 success" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</view>
						<view>
							<text class="result-title">今日流水已提交</text>
							<text class="result-time">{{ submittedTime }}</text>
						</view>
					</view>

					<view class="result-body">
						<view class="result-row">
							<text class="rr-label">流水类型</text>
							<text class="rr-value">{{ typeIndex>=0?typeOptions[typeIndex].label:'-' }}</text>
						</view>
						<view class="result-row">
							<text class="rr-label">金额</text>
							<text class="rr-value rr-value-green">¥ {{ amountDisplay }}</text>
						</view>
						<view class="result-row">
							<text class="rr-label">关联主播</text>
							<text class="rr-value rr-normal">{{ selectedAnchor ? selectedAnchor.name : '-' }}</text>
						</view>
					</view>

					<view class="result-footer">
						<view class="pulse-dot"></view>
						<text class="status-pending">待财务审核</text>
					</view>
				</view>

				<view class="reset-btn" @tap="resetForm">
					<text>提交新流水</text>
				</view>
			</view>

			<!-- ═══ Success Modal ═══ -->
			<view v-if="showModal" class="modal-mask" @tap="closeModal">
				<view class="modal-box anim-scale" @tap.stop>
					<view class="modal-check">
						<svg class="s28 success" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							stroke-width="2.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					</view>
					<text class="modal-title">提交成功</text>
					<text class="modal-desc">流水数据已提交，等待财务审核</text>
					<view class="modal-status-row">
						<view class="pulse-dot"></view>
						<text class="modal-status-text">待财务审核</text>
					</view>
					<view class="modal-btn" @tap="closeModal">
						<text>我知道了</text>
					</view>
				</view>
			</view>

			<!-- ═══ 关联主播选择弹窗 ═══ -->
			<view v-if="showAnchorModal" class="modal-mask" @tap="closeAnchorPicker">
				<view class="anchor-modal anim-scale" @tap.stop>
					<view class="anchor-modal-header">
						<text class="amh-title">选择主播</text>
						<view class="amh-close" @tap="closeAnchorPicker">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
							</svg>
						</view>
					</view>
					<view class="anchor-search-wrap">
						<svg class="s16 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="position:absolute;left:24rpx;top:50%;transform:translateY(-50%);z-index:1">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
						</svg>
						<input class="anchor-search-input" type="text" v-model="anchorSearch" placeholder="搜索姓名..." placeholder-class="anchor-search-ph" @input="onAnchorSearch" />
					</view>
					<scroll-view class="anchor-scroll" scroll-y="true" :style="{ maxHeight: scrollHeight + 'px' }">
						<view v-if="filteredAnchors.length === 0" class="anchor-empty">
							<text>未找到匹配的主播</text>
						</view>
						<view v-for="a in filteredAnchors" :key="a.id" class="anchor-item"
							:class="selectedAnchor && selectedAnchor.id===a.id ? 'anchor-item-active' : ''"
							@tap="selectAnchor(a)">
							<view class="anchor-avatar" :style="{ background: a.avatarBg }">{{ a.name.charAt(0) }}</view>
							<view class="anchor-info">
								<text class="anchor-name">{{ a.name }}</text>
								<text class="anchor-role">{{ a.roleName }}</text>
							</view>
							<view v-if="selectedAnchor && selectedAnchor.id===a.id" class="anchor-check">
								<svg class="s16" style="color:#2563eb" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
								</svg>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>

			<!-- Toast -->
			<view class="toast" :class="toastVisible?'toast-show':''">
				<text class="toast-text">{{ toastMsg }}</text>
			</view>
		</view>
</template>

<script>
	import { api } from '@/utils/api.js'

	function formatDateCN(d) {
		const y = d.getFullYear()
		const m = String(d.getMonth() + 1).padStart(2, '0')
		const day = String(d.getDate()).padStart(2, '0')
		const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
		return y + '年' + m + '月' + day + '日 ' + weekdays[d.getDay()]
	}

	function formatDateInput(d) {
		return d.getFullYear() + '-' +
			String(d.getMonth() + 1).padStart(2, '0') + '-' +
			String(d.getDate()).padStart(2, '0')
	}

	const avatarPalette = ['#2563eb','#7c3aed','#db2777','#059669','#d97706','#dc2626','#0891b2','#4f46e5']

	export default {
		data() {
			const now = new Date()
			return {
				currentDate: formatDateCN(now),
				formDate: formatDateInput(now),
				typeOptions: [
					{ label: '收入', value: 'income' },
					{ label: '支出', value: 'expense' },
					{ label: '转账', value: 'transfer' },
					{ label: '直播流水', value: 'live' }
				],
				typeIndex: -1,
				amount: '',
				project: '',
				remark: '',
				submitting: false,
				submitted: false,
				showModal: false,
				submittedTime: '',
				toastVisible: false,
				toastMsg: '',

				// 关联主播选择器
				showAnchorModal: false,
				anchorSearch: '',
				selectedAnchor: null,
				anchorList: [],
				scrollHeight: 400
			}
		},
		computed: {
			amountDisplay() {
				if (!this.amount) return '0.00'
				const num = parseFloat(this.amount)
				if (isNaN(num)) return '0.00'
				return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
			},
			filteredAnchors() {
				const kw = (this.anchorSearch || '').trim().toLowerCase()
				if (!kw) return this.anchorList
				return this.anchorList.filter(a => a.name.toLowerCase().includes(kw))
			}
		},
		onShow() {
			this.$checkAuth()
		},
		methods: {
			goBack() {
				uni.navigateBack({ delta: 1 })
			},
			onDateChange(e) {
				this.formDate = e.detail.value
			},
			onTypeChange(e) {
				this.typeIndex = parseInt(e.detail.value)
			},

			// ═══ 关联主播选择器 ═══
			async openAnchorPicker() {
				this.showAnchorModal = true
				this.anchorSearch = ''
				// 自适应弹窗高度
				const sys = uni.getSystemInfoSync()
				this.scrollHeight = (sys.windowHeight || 700) * 0.55
				if (this.anchorList.length === 0) {
					await this.fetchMembers()
				}
			},
			closeAnchorPicker() {
				this.showAnchorModal = false
			},
			selectAnchor(a) {
				this.selectedAnchor = a
				this.showAnchorModal = false
			},
			onAnchorSearch() {
				// filteredAnchors 由 computed 自动处理
			},
			async fetchMembers(keyword) {
				try {
					const params = keyword ? { keyword } : {}
					const res = await api.get('/api/admin/operation/members', params)
					const list = (res.data || []).map((m, i) => ({
						...m,
						avatarBg: avatarPalette[i % avatarPalette.length]
					}))
					if (keyword) {
						// 搜索时直接替换列表
						return list
					}
					this.anchorList = list
				} catch (e) {
					console.error('[daily-flow] 加载成员失败:', e)
				}
			},

			async handleSubmit() {
				if (!this.formDate) return this.showToast('请选择流水日期')
				if (this.typeIndex < 0) return this.showToast('请选择流水类型')
				if (!this.amount || parseFloat(this.amount) <= 0) return this.showToast('请输入有效金额')

				this.submitting = true
				try {
					const res = await api.post('/api/admin/operation/flows', {
						flow_amount: parseFloat(this.amount),
						flow_date: this.formDate,
						flow_type: this.typeOptions[this.typeIndex].value,
						remark: this.remark,
						anchor_id: this.selectedAnchor ? this.selectedAnchor.id : null
					})
					if (res.code === 200) {
						this.submitting = false
						this.showModal = true
						this.submittedTime = new Date().toLocaleString('zh-CN', {
							year: 'numeric', month: '2-digit', day: '2-digit',
							hour: '2-digit', minute: '2-digit', hour12: false
						}).replace(/\//g, '-')
					} else {
						this.submitting = false
						this.showToast(res.message || '提交失败')
					}
				} catch (e) {
					console.error('[daily-flow] 提交失败:', e)
					this.submitting = false
					this.showToast('网络错误，请重试')
				}
			},
			closeModal() {
				this.showModal = false
				this.submitted = true
			},
			resetForm() {
				const now = new Date()
				this.formDate = formatDateInput(now)
				this.typeIndex = -1
				this.amount = ''
				this.project = ''
				this.remark = ''
				this.selectedAnchor = null
				this.submitted = false
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
		background: #f1f5f9;
		font-family: -apple-system, BlinkMacSystemFont, 'Noto Sans SC', sans-serif;
		-webkit-font-smoothing: antialiased
	}

	.s16 {
		width: 32rpx;
		height: 32rpx;
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

	.gray-400 {
		color: #94a8b4
	}

	.success {
		color: #10b981
	}

	/* Animations */
	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(16rpx)
		}

		to {
			opacity: 1;
			transform: translateY(0)
		}
	}

	.anim-slide {
		animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		opacity: 0
	}

	@keyframes fadeIn {
		from {
			opacity: 0
		}

		to {
			opacity: 1
		}
	}

	.anim-fade {
		animation: fadeIn 0.3s ease forwards;
		opacity: 0
	}

	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.92)
		}

		to {
			opacity: 1;
			transform: scale(1)
		}
	}

	.anim-scale {
		animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards
	}

	@keyframes spin {
		to {
			transform: rotate(360deg)
		}
	}

	.spinner {
		width: 32rpx;
		height: 32rpx;
		border: 3rpx solid rgba(255, 255, 255, 0.3);
		border-top-color: #fff;
		border-radius: 50%;
		animation: spin 0.8s linear infinite
	}

	@keyframes pulse {

		0%,
		100% {
			opacity: 1
		}

		50% {
			opacity: 0.5
		}
	}

	.pulse-dot {
		width: 14rpx;
		height: 14rpx;
		background: #f59e0b;
		border-radius: 50%;
		animation: pulse 1.5s ease-in-out infinite
	}

	/* Header */
	.hdr {
		padding: 48rpx 36rpx 16rpx
	}

	.hdr-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 6rpx
	}

	.hdr-title {
		font-size: 38rpx;
		font-weight: 700;
		color: #0f172a;
		letter-spacing: -0.02em
	}

	.dept-tag {
		font-size: 18rpx;
		font-weight: 600;
		color: #2563eb;
		background: #eff6ff;
		padding: 6rpx 18rpx;
		border-radius: 9999rpx;
		letter-spacing: 0.05em;
	}

	.hdr-date {
		font-size: 22rpx;
		color: #64748b;
		font-weight: 500
	}

	/* Form */
	.form-wrap {
		padding: 0 36rpx 16rpx
	}

	.form-card {
		background: #fff;
		border-radius: 20rpx;
		padding: 36rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	}

	.field {
		margin-bottom: 32rpx
	}

	.field:last-child {
		margin-bottom: 0
	}

	.field-label {
		font-size: 24rpx;
		font-weight: 600;
		color: #334155;
		display: block;
		margin-bottom: 12rpx;
		letter-spacing: 0.04em;
	}

	/* Input base */
	.field-input {
		width: 100%;
		height: 88rpx;
		background: #fff;
		border: 1rpx solid #e2e8f0;
		border-radius: 14rpx;
		padding: 0 28rpx;
		font-size: 28rpx;
		color: #0f172a;
		font-weight: 500;
		box-sizing: border-box;
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.field-input:focus-within {
		border-color: #3b82f6;
		box-shadow: 0 0 0 4rpx rgba(59, 130, 246, 0.1)
	}

	.fi-text {
		color: #0f172a;
		font-weight: 500
	}

	.fi-placeholder {
		color: #cbd5e1;
		font-weight: 400
	}

	.input-placeholder {
		color: #cbd5e1;
		font-weight: 400
	}

	/* Picker input */
	.field-picker {
		display: flex;
		align-items: center;
		justify-content: space-between
	}

	/* Amount with ¥ prefix */
	.amount-wrap {
		position: relative
	}

	.yen-symbol {
		position: absolute;
		left: 28rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 28rpx;
		color: #64748b;
		font-weight: 500;
	}

	.amount-input {
		padding-left: 52rpx
	}

	/* Textarea */
	.textarea-field {
		width: 100%;
		height: 160rpx;
		background: #fff;
		border: 1rpx solid #e2e8f0;
		border-radius: 14rpx;
		padding: 20rpx 28rpx;
		font-size: 28rpx;
		color: #0f172a;
		font-weight: 500;
		box-sizing: border-box;
		line-height: 1.6;
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.textarea-field:focus-within {
		border-color: #3b82f6;
		box-shadow: 0 0 0 4rpx rgba(59, 130, 246, 0.1)
	}

	/* Submit Area */
	.submit-area {
		padding: 0 36rpx 40rpx
	}

	.submit-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		width: 100%;
		height: 96rpx;
		background: #2563eb;
		color: #fff;
		border-radius: 20rpx;
		font-size: 30rpx;
		font-weight: 600;
		box-shadow: 0 8rpx 28rpx rgba(37, 99, 235, 0.25);
		transition: all 0.15s;
	}

	.submit-btn:active:not(.btn-disabled) {
		transform: scale(0.97);
		background: #1d4ed8
	}

	.btn-disabled {
		opacity: 0.7
	}

	.submit-hint {
		display: block;
		text-align: center;
		font-size: 20rpx;
		color: #94a8b4;
		font-weight: 500;
		margin-top: 18rpx;
	}

	/* Submitted State */
	.submitted-area {
		padding: 0 36rpx 40rpx
	}

	.result-card {
		background: #fff;
		border-radius: 20rpx;
		padding: 36rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
		margin-bottom: 24rpx;
	}

	.result-header {
		display: flex;
		align-items: center;
		gap: 20rpx;
		padding-bottom: 28rpx;
		border-bottom: 1rpx solid #f1f5f9;
		margin-bottom: 20rpx
	}

	.result-icon-bg {
		width: 68rpx;
		height: 68rpx;
		border-radius: 18rpx;
		background: #ecfdf5;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.result-title {
		font-size: 28rpx;
		font-weight: 700;
		color: #0f172a;
		display: block
	}

	.result-time {
		font-size: 22rpx;
		color: #94a8b4;
		margin-top: 4rpx;
		display: block
	}

	.result-body {}

	.result-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14rpx 0
	}

	.rr-label {
		font-size: 24rpx;
		color: #64748b
	}

	.rr-value {
		font-size: 26rpx;
		font-weight: 600;
		color: #0f172a
	}

	.rr-value-green {
		color: #10b981
	}

	.rr-normal {
		font-weight: 500;
		color: #334155
	}

	.result-footer {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-top: 24rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid #f1f5f9;
	}

	.status-pending {
		font-size: 24rpx;
		font-weight: 600;
		color: #d97706
	}

	.reset-btn {
		width: 100%;
		height: 88rpx;
		border: 2rpx solid #e2e8f0;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		font-weight: 600;
		color: #334155;
		transition: all 0.15s;
	}

	.reset-btn:active {
		background: #f8fafc;
		border-color: #cbd5e1
	}

	/* Success Modal */
	.modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 200;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-box {
		width: 600rpx;
		background: #fff;
		border-radius: 28rpx;
		padding: 48rpx 36rpx;
		text-align: center;
		box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
	}

	.modal-check {
		width: 96rpx;
		height: 96rpx;
		border-radius: 50%;
		background: #ecfdf5;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 28rpx;
	}

	.modal-title {
		font-size: 34rpx;
		font-weight: 700;
		color: #0f172a;
		display: block;
		margin-bottom: 8rpx
	}

	.modal-desc {
		font-size: 24rpx;
		color: #64748b;
		line-height: 1.6;
		display: block;
		margin-bottom: 28rpx
	}

	.modal-status-row {
		display: inline-flex;
		align-items: center;
		gap: 12rpx;
		background: #fffbeb;
		padding: 16rpx 28rpx;
		border-radius: 14rpx;
		margin-bottom: 32rpx;
	}

	.modal-status-text {
		font-size: 24rpx;
		font-weight: 600;
		color: #d97706
	}

	.modal-btn {
		width: 100%;
		height: 84rpx;
		background: #2563eb;
		color: #fff;
		border-radius: 18rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		font-weight: 600;
	}

	.modal-btn:active {
		background: #1d4ed8
	}

	/* Toast */
	.toast {
		position: fixed;
		top: 160rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 300;
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

	/* ═══ 关联主播选择弹窗 ═══ */
	.anchor-modal {
		width: 620rpx;
		background: #fff;
		border-radius: 24rpx;
		padding: 0;
		overflow: hidden;
		box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
	}

	.anchor-modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx 32rpx 12rpx;
	}

	.amh-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #0f172a;
	}

	.amh-close {
		width: 48rpx;
		height: 48rpx;
		border-radius: 50%;
		background: #f1f5f9;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.anchor-search-wrap {
		position: relative;
		margin: 8rpx 32rpx 16rpx;
	}

	.anchor-search-input {
		width: 100%;
		height: 80rpx;
		background: #f8fafc;
		border: 1rpx solid #e2e8f0;
		border-radius: 16rpx;
		padding: 0 28rpx 0 64rpx;
		font-size: 26rpx;
		color: #0f172a;
		box-sizing: border-box;
	}

	.anchor-search-ph {
		color: #cbd5e1;
	}

	.anchor-scroll {
		padding: 0 24rpx;
	}

	.anchor-empty {
		text-align: center;
		padding: 48rpx 0;
		font-size: 24rpx;
		color: #94a8b4;
	}

	.anchor-item {
		display: flex;
		align-items: center;
		padding: 20rpx 16rpx;
		border-radius: 14rpx;
		margin-bottom: 6rpx;
		transition: background 0.12s;
	}

	.anchor-item:active {
		background: #f1f5f9;
	}

	.anchor-item-active {
		background: #eff6ff;
	}

	.anchor-avatar {
		width: 68rpx;
		height: 68rpx;
		border-radius: 50%;
		color: #fff;
		font-size: 26rpx;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-right: 20rpx;
	}

	.anchor-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4rpx;
	}

	.anchor-name {
		font-size: 28rpx;
		font-weight: 600;
		color: #0f172a;
	}

	.anchor-role {
		font-size: 22rpx;
		color: #64748b;
	}

	.anchor-check {
		width: 44rpx;
		height: 44rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
</style>