<template>
	<view class="pg">
		<!-- 顶部标题区 -->
		<view class="header">
			<view class="hdr-inner">
				<view class="hdr-back" @tap="goBack">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg>
				</view>
				<view>
					<text class="hdr-title">考核发布</text>
					<text class="hdr-sub">中转部专属考核指标</text>
				</view>
			</view>
		</view>

		<view class="main">

			<!-- 1. 考核周期选择 -->
			<view class="card">
				<view class="card-label">
					<svg class="s12 indigo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
						<line x1="16" y1="2" x2="16" y2="6" />
						<line x1="8" y1="2" x2="8" y2="6" />
						<line x1="3" y1="10" x2="21" y2="10" />
					</svg>
					<text>考核周期</text>
				</view>
				<view class="date-row">
					<view class="date-field">
						<text class="date-label">开始日期</text>
						<picker mode="date" :value="form.startDate" @change="onStartDate">
							<view class="date-picker">
								<text class="date-text">{{ form.startDate || '请选择' }}</text>
								<svg class="s14 slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"
									stroke-width="1.5">
									<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
									<line x1="16" y1="2" x2="16" y2="6" />
									<line x1="8" y1="2" x2="8" y2="6" />
									<line x1="3" y1="10" x2="21" y2="10" />
								</svg>
							</view>
						</picker>
					</view>
					<view class="date-field">
						<text class="date-label">结束日期</text>
						<picker mode="date" :value="form.endDate" @change="onEndDate">
							<view class="date-picker">
								<text class="date-text">{{ form.endDate || '请选择' }}</text>
								<svg class="s14 slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"
									stroke-width="1.5">
									<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
									<line x1="16" y1="2" x2="16" y2="6" />
									<line x1="8" y1="2" x2="8" y2="6" />
									<line x1="3" y1="10" x2="21" y2="10" />
								</svg>
							</view>
						</picker>
					</view>
				</view>
			</view>

			<!-- 2. 考核指标目标值 -->
			<view class="card">
				<view class="card-label">
					<svg class="s12 indigo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10" />
						<circle cx="12" cy="12" r="6" />
						<circle cx="12" cy="12" r="2" />
					</svg>
					<text>考核指标目标值</text>
				</view>
				<text class="card-hint">请设定各项考核指标的目标数值</text>

				<!-- 指标1: 月度承接经纪新人数量 -->
				<view class="metric-row">
					<view class="mr-icon" style="background:#FEF3C7">
						<svg class="s14" style="color:#F59E0B" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<line x1="19" y1="8" x2="19" y2="14" />
							<line x1="22" y1="11" x2="16" y2="11" />
						</svg>
					</view>
					<text class="mr-label">月度承接经纪新人数量</text>
					<view class="mr-input-wrap"><input class="mr-input" type="number" v-model="form.newBrokerCount"
							placeholder="0" /></view>
					<text class="mr-unit">人</text>
				</view>
				<!-- 指标2: 每日新人跟进任务完成率 -->
				<view class="metric-row">
					<view class="mr-icon" style="background:#D1FAE5">
						<svg class="s14" style="color:#10B981" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
						</svg>
					</view>
					<text class="mr-label">每日新人跟进任务完成率</text>
					<view class="mr-input-wrap"><input class="mr-input" type="number" v-model="form.followUpRate"
							placeholder="0" /></view>
					<text class="mr-unit">%</text>
				</view>
				<!-- 指标3: 7日主播留存率 -->
				<view class="metric-row">
					<view class="mr-icon" style="background:#E0F2FE">
						<svg class="s14" style="color:#0EA5E9" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="1.5">
							<circle cx="12" cy="12" r="10" />
							<polyline points="12 6 12 12 16 14" />
						</svg>
					</view>
					<text class="mr-label">7日主播留存率</text>
					<view class="mr-input-wrap"><input class="mr-input" type="number" v-model="form.retain7d"
							placeholder="0" /></view>
					<text class="mr-unit">%</text>
				</view>
				<!-- 指标4: 30日主播留存率 -->
				<view class="metric-row">
					<view class="mr-icon" style="background:#EDE9FE">
						<svg class="s14" style="color:#8B5CF6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="1.5">
							<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
							<line x1="16" y1="2" x2="16" y2="6" />
							<line x1="8" y1="2" x2="8" y2="6" />
							<line x1="3" y1="10" x2="21" y2="10" />
							<path d="M9 16l2 2 4-4" />
						</svg>
					</view>
					<text class="mr-label">30日主播留存率</text>
					<view class="mr-input-wrap"><input class="mr-input" type="number" v-model="form.retain30d"
							placeholder="0" /></view>
					<text class="mr-unit">%</text>
				</view>
				<!-- 指标5: 月度成功移交运营部人数 -->
				<view class="metric-row">
					<view class="mr-icon" style="background:#FFE4E6">
						<svg class="s14" style="color:#FB7185" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
						</svg>
					</view>
					<text class="mr-label">月度成功移交运营部人数</text>
					<view class="mr-input-wrap"><input class="mr-input" type="number" v-model="form.transferCount"
							placeholder="0" /></view>
					<text class="mr-unit">人</text>
				</view>
				<!-- 指标6: 主播移交达标率 -->
				<view class="metric-row">
					<view class="mr-icon" style="background:#CCFBF1">
						<svg class="s14" style="color:#14B8A6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="1.5">
							<polyline points="9 11 12 14 22 4" />
							<path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
						</svg>
					</view>
					<text class="mr-label">主播移交达标率</text>
					<view class="mr-input-wrap"><input class="mr-input" type="number" v-model="form.transferRate"
							placeholder="0" /></view>
					<text class="mr-unit">%</text>
				</view>
				<!-- 指标7: 新人流失率 -->
				<view class="metric-row">
					<view class="mr-icon" style="background:#FFF7ED">
						<svg class="s14" style="color:#F97316" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<line x1="23" y1="11" x2="17" y2="11" />
						</svg>
					</view>
					<text class="mr-label">新人流失率</text>
					<view class="mr-input-wrap"><input class="mr-input" type="number" v-model="form.churnRate"
							placeholder="0" /></view>
					<text class="mr-unit">%</text>
				</view>
			</view>

			<!-- 3. 考核规则填写 -->
			<view class="card">
				<view class="card-label">
					<svg class="s12 indigo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					<text>考核规则</text>
				</view>
				<text class="card-hint">补充说明考核细则与评分标准</text>
				<view class="textarea-wrap">
					<textarea class="f-textarea" v-model="form.rule" placeholder="请输入考核规则说明，如评分标准、奖惩机制、特殊情况处理等..."
						:maxlength="500" @input="onRuleInput" />
					<view class="textarea-foot">
						<text class="char-count" :class="{'char-warn': ruleLen > 450}">{{ ruleLen }} / 500</text>
					</view>
				</view>
			</view>

			<!-- 双审核提示 -->
			<view class="audit-tip">
				<view class="tip-icon-wrap">
					<svg class="s16 indigo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
				</view>
				<view>
					<text class="tip-title">双审核队列</text>
					<text class="tip-desc">提交后将依次经过财务初审与总经终审，审核通过后即可生效发布。</text>
				</view>
			</view>

		</view>

		<!-- 底部提交按钮 -->
		<view class="submit-footer">
			<view class="submit-btn" :class="{'submit-loading': loading}" @tap="onSubmit">
				<text v-if="!loading">提交发布</text>
				<text v-else>提交中...</text>
				<svg v-if="!loading" class="s18 white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
					stroke-width="2">
					<line x1="5" y1="12" x2="19" y2="12" />
					<polyline points="12 5 19 12 12 19" />
				</svg>
				<svg v-else class="s18 white spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"
					stroke-width="2">
					<circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20" />
				</svg>
			</view>
			<text class="submit-hint">提交后将进入双审核队列</text>
			<view class="safe-btm"></view>
		</view>

		<!-- 提交成功弹窗 -->
		<view class="modal-overlay" v-if="showModal" @tap="closeModal">
			<view class="modal-card" @tap.stop>
				<view class="modal-check">
					<svg class="s24 emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
						stroke-linecap="round" stroke-linejoin="round">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</view>
				<text class="modal-title">提交成功</text>
				<text class="modal-desc">考核方案已进入双审核队列，请耐心等待审核结果。</text>
				<view class="modal-btn" @tap="closeModal">我知道了</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					startDate: '2025-01-01',
					endDate: '2025-01-31',
					newBrokerCount: '50',
					followUpRate: '95',
					retain7d: '80',
					retain30d: '65',
					transferCount: '35',
					transferRate: '90',
					churnRate: '15',
					rule: '',
				},
				loading: false,
				showModal: false,
				ruleLen: 0,
			}
		},
		onShow() {
			this.$checkAuth()
		},
		methods: {
			goBack() {
				uni.reLaunch(
					{
						url: '/pages/transfer/transfer'
					}
				)
			},
			onStartDate(e) {
				this.form.startDate = e.detail.value
			},
			onEndDate(e) {
				this.form.endDate = e.detail.value
			},
			onRuleInput(e) {
				this.ruleLen = (e.detail.value || '').length
			},
			onSubmit() {
				if (!this.form.startDate || !this.form.endDate) {
					uni.showToast({
						title: '请选择考核周期',
						icon: 'none'
					});
					return
				}
				if (this.loading) return
				this.loading = true
				setTimeout(() => {
					this.loading = false
					this.showModal = true
				}, 1500)
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
		background: #F8F9FC;
		font-family: 'Outfit', 'Noto Sans SC', 'PingFang SC', system-ui, sans-serif;
		-webkit-font-smoothing: antialiased;
		padding-bottom: 200rpx
	}

	/* header */
	.header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: #fff;
		border-bottom: 1rpx solid #F1F5F9;
		padding: 40rpx 40rpx 32rpx
	}

	.hdr-back {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 8rpx;
		flex-shrink: 0;
		border-radius: 50%
	}

	.hdr-back:active {
		background: rgba(0, 0, 0, .06)
	}

	.hdr-inner {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx
	}

	.hdr-icon {
		width: 72rpx;
		height: 72rpx;
		border-radius: 24rpx;
		background: #EEF2FF;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.hdr-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #111827;
		display: block
	}

	.hdr-sub {
		font-size: 24rpx;
		color: #9CA3AF;
		display: block;
		margin-top: 4rpx
	}

	/* main */
	.main {
		padding: 32rpx 32rpx 0
	}

	/* card */
	.card {
		background: #fff;
		border-radius: 32rpx;
		border: 1rpx solid rgba(229, 231, 235, .8);
		padding: 40rpx;
		margin-bottom: 32rpx
	}

	.card-label {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 16rpx;
		margin-bottom: 8rpx;
		font-size: 28rpx;
		font-weight: 600;
		color: #111827
	}

	.card-hint {
		font-size: 22rpx;
		color: #9CA3AF;
		display: block;
		padding-left: 40rpx
	}

	/* date */
	.date-row {
		display: flex;
		flex-direction: row;
		gap: 24rpx;
		margin-top: 24rpx
	}

	.date-field {
		flex: 1
	}

	.date-label {
		font-size: 22rpx;
		font-weight: 500;
		color: #9CA3AF;
		text-transform: uppercase;
		position: absolute;
		top: 8rpx;
		left: 32rpx
	}

	.date-picker {
		position: relative;
		padding-top: 40rpx;
		padding-bottom: 20rpx;
		padding-left: 32rpx;
		padding-right: 32rpx;
		border: 1rpx solid #E5E7EB;
		border-radius: 24rpx;
		background: #fff;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center
	}

	.date-text {
		font-size: 28rpx;
		font-weight: 500;
		color: #111827
	}

	/* metric rows */
	.metric-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx;
		padding: 28rpx 0;
		border-top: 1rpx solid #F3F4F6
	}

	.metric-row:active {
		background: #F8F9FC;
		margin: 0 -40rpx;
		padding-left: 40rpx;
		padding-right: 40rpx
	}

	.mr-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0
	}

	.mr-label {
		flex: 1;
		font-size: 28rpx;
		font-weight: 500;
		color: #111827;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0
	}

	.mr-input-wrap {
		width: 152rpx;
		border: 1rpx solid #E5E7EB;
		border-radius: 16rpx;
		background: rgba(249, 250, 251, .5);
		overflow: hidden
	}

	.mr-input {
		width: 100%;
		height: 80rpx;
		/* padding: 0 24rpx; */
		font-size: 28rpx;
		font-weight: 600;
		color: #111827;
		text-align: right;
		background: transparent;
		text-align: center;
	}

	.mr-unit {
		font-size: 24rpx;
		color: #9CA3AF;
		font-weight: 500;
		width: 24rpx
	}

	/* textarea */
	.textarea-wrap {
		margin-top: 24rpx;
		border: 1rpx solid #E5E7EB;
		border-radius: 24rpx;
		background: #fff;
		overflow: hidden
	}

	.f-textarea {
		width: 100%;
		height: 260rpx;
		padding: 28rpx 32rpx;
		font-size: 28rpx;
		color: #111827;
		line-height: 1.6;
		background: transparent
	}

	.f-textarea::placeholder {
		color: #D1D5DB
	}

	.textarea-foot {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		padding: 0 32rpx 20rpx
	}

	.char-count {
		font-size: 22rpx;
		color: #D1D5DB
	}

	.char-warn {
		color: #F59E0B
	}

	/* audit tip */
	.audit-tip {
		display: flex;
		flex-direction: row;
		gap: 20rpx;
		padding: 0 8rpx;
		margin-bottom: 32rpx
	}

	.tip-icon-wrap {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		background: #EEF2FF;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-top: 4rpx
	}

	.tip-title {
		font-size: 24rpx;
		font-weight: 500;
		color: #6B7280;
		display: block
	}

	.tip-desc {
		font-size: 22rpx;
		color: #9CA3AF;
		display: block;
		margin-top: 4rpx;
		line-height: 1.5
	}

	/* submit footer */
	.submit-footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 40;
		background: rgba(255, 255, 255, .85);
		backdrop-filter: blur(48rpx);
		-webkit-backdrop-filter: blur(48rpx);
		border-top: 1rpx solid #F3F4F6;
		padding: 28rpx 40rpx 20rpx
	}

	.submit-btn {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 16rpx;
		width: 100%;
		height: 96rpx;
		background: #6366F1;
		color: #fff;
		font-size: 28rpx;
		font-weight: 600;
		border-radius: 24rpx;
		box-shadow: 0 8rpx 40rpx rgba(99, 102, 241, .25)
	}

	.submit-btn:active {
		transform: scale(.98);
		background: #4F46E5
	}

	.submit-loading {
		opacity: .8;
		pointer-events: none
	}

	.submit-hint {
		text-align: center;
		font-size: 22rpx;
		color: #9CA3AF;
		margin-top: 24rpx;
		display: block
	}

	.safe-btm {
		height: env(safe-area-inset-bottom, 0px)
	}

	/* modal */
	.modal-overlay {
		position: fixed;
		inset: 0;
		z-index: 100;
		background: rgba(0, 0, 0, .3);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 48rpx
	}

	.modal-card {
		width: 580rpx;
		background: #fff;
		border-radius: 48rpx;
		padding: 56rpx 48rpx 40rpx;
		text-align: center;
		box-shadow: 0 40rpx 120rpx rgba(0, 0, 0, .15)
	}

	.modal-check {
		width: 128rpx;
		height: 128rpx;
		border-radius: 50%;
		background: #D1FAE5;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 40rpx
	}

	.modal-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #111827;
		display: block;
		margin-bottom: 16rpx
	}

	.modal-desc {
		font-size: 28rpx;
		color: #6B7280;
		line-height: 1.5;
		display: block;
		margin-bottom: 48rpx
	}

	.modal-btn {
		width: 100%;
		height: 96rpx;
		background: #6366F1;
		color: #fff;
		font-size: 28rpx;
		font-weight: 600;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.modal-btn:active {
		background: #4F46E5
	}

	/* spin animation */
	.spin {
		animation: spin .8s linear infinite
	}

	@keyframes spin {
		from {
			transform: rotate(0deg)
		}

		to {
			transform: rotate(360deg)
		}
	}

	/* utility */
	.s12 {
		width: 24rpx;
		height: 24rpx;
		flex-shrink: 0
	}

	.s14 {
		width: 28rpx;
		height: 28rpx;
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

	.s24 {
		width: 48rpx;
		height: 48rpx;
		flex-shrink: 0
	}

	.indigo {
		color: #6366F1
	}

	.white {
		color: #fff
	}

	.emerald {
		color: #10B981
	}

	.slate-300 {
		color: #D1D5DB
	}
</style>