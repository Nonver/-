<template>
	<view class="pg">
		<!-- Header -->
		<view class="dt-hdr">
			<view class="dt-hdr-row">
				<view class="back-btn" @tap="navigateBack">
					<svg class="s20 slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
				</view>
				<view class="dt-hdr-titles">
					<text class="dt-hdr-title">{{ detailData.name || '考核详情' }}</text>
				</view>
				<view class="status-tag" :class="statusCfg(detailData.status).cls">
					<view class="status-dot" :class="statusCfg(detailData.status).dot"></view>
					<text>{{ statusCfg(detailData.status).label }}</text>
				</view>
			</view>
		</view>

		<!-- Detail Content -->
		<view class="dt-body">

			<!-- 基本信息 + 考核要求 + 考核备注 合并 -->
			<view class="card">
				<view class="info-row">
					<view>
						<text class="info-label">考核周期</text>
						<text class="info-val">{{ detailData.period || '暂无' }}</text>
					</view>
					<view class="info-r">
						<text class="info-label">考核对象</text>
						<text class="info-val">{{ detailData.target || '个人' }}</text>
					</view>
				</view>
				<view v-if="detailData.targetDetail" class="info-row" style="margin-top: 20rpx;">
					<text class="info-label" style="margin-bottom: 0;">考核指标</text>
					<text class="info-val" style="color: #059669; font-weight: 600;">{{ detailData.targetDetail }}</text>
				</view>
				<view v-if="detailData.target_remark" class="merged-divider"></view>
				<view v-if="detailData.target_remark" class="merged-block">
					<text class="merged-label">考核要求</text>
					<text class="merged-text">{{ detailData.target_remark }}</text>
				</view>
				<view v-if="detailData.rule_description" class="merged-divider"></view>
				<view v-if="detailData.rule_description" class="merged-block">
					<text class="merged-label">考核备注</text>
					<text class="merged-text">{{ detailData.rule_description }}</text>
				</view>
			</view>

			<!-- 考核指标进度列表 -->
			<view class="card" v-if="indicators.length > 0">
				<view class="sec-hd">
					<svg class="s16 primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
					</svg>
					<text class="sec-hd-text">考核指标</text>
				</view>
				<view v-for="(ind, i) in indicators" :key="i" class="indicator-item" :class="i>0?'indicator-border':''">
					<view class="indicator-hd">
						<text class="indicator-name">{{ ind.name }}</text>
						<view class="indicator-weight">{{ ind.weight }}</view>
					</view>
					<view class="indicator-meta">
						<text>目标: <text class="indicator-target">{{ ind.target }}</text></text>
						<text v-if="ind.actual" style="margin-left:24rpx">实际: <text class="indicator-target" :class="ind.pct>=100?'emerald':(ind.pct>=60?'amber':'red')">{{ ind.actual }}</text></text>
					</view>
					<view v-if="ind.pct !== undefined && ind.pct !== null" class="indicator-progress">
						<view class="bar bar-ind">
							<view class="bar-fill" :class="ind.pct>=100?'bar-emerald':(ind.pct>=60?'bar-primary':'bar-rose')" :style="'width:'+ind.pct+'%'"></view>
						</view>
						<text class="indicator-pct" :class="ind.pct>=100?'emerald':(ind.pct>=60?'amber':'red')">{{ ind.pct }}%</text>
					</view>
					<text class="indicator-standard">{{ ind.standard }}</text>
				</view>
			</view>

			<!-- 考核提交 - 未提交时显示 -->
			<view class="card" v-if="detailData.user_status === 'none'">
				<view class="sec-hd">
					<svg class="s16 emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<text class="sec-hd-text">考核提交</text>
				</view>

				<!-- 今日完成量 -->
				<view class="field">
					<text class="info-label field-label">今日完成情况</text>
					<view class="count-row">
						<text class="count-lbl">添加微信数量</text>
						<input class="count-input" type="number" v-model="wechatCount" placeholder="0" @input="onCountInput('wechatCount')" />
						<text class="count-unit">个</text>
					</view>
					<view class="count-row" style="margin-top: 20rpx;">
						<text class="count-lbl">邀请入会数量</text>
						<input class="count-input" type="number" v-model="joinPartyCount" placeholder="0" @input="onCountInput('joinPartyCount')" />
						<text class="count-unit">个</text>
					</view>
				</view>

				<view class="field">
					<text class="info-label field-label">完成说明</text>
					<textarea class="field-textarea" v-model="progressDesc" placeholder="请描述本次考核完成的各项工作内容..." />
				</view>

				<!-- 图片上传 -->
				<view class="field">
					<text class="info-label field-label">提交凭证（选填，可多张）</text>
					<view class="image-upload-wrap">
						<view v-for="(img, i) in imageList" :key="i" class="image-item">
							<image :src="img.preview || img.path" class="image-thumb" mode="aspectFill" />
							<view v-if="img.uploading" class="image-mask">
								<text class="image-progress-text">上传中...</text>
							</view>
							<view class="image-delete" @tap="removeImage(i)">
								<svg class="s16 white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
									<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
								</svg>
							</view>
						</view>
						<view class="image-add" @tap="chooseImage">
							<svg class="s32 slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
								<line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
							</svg>
							<text class="image-add-text">添加图片</text>
						</view>
					</view>
				</view>

				<!-- 资源明细录入 -->
				<view class="field">
					<text class="info-label field-label">资源明细录入（选填）</text>
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

				<view class="btn btn-primary btn-shadow" :class="{ 'btn-disabled': submitting }" @tap="submitProgress">
					<text>{{ submitting ? '提交中...' : '提交考核' }}</text>
				</view>
				<text class="submit-tip">提交后将由总经进行审核，仅可提交一次</text>
			</view>

			<!-- 已提交 / 审核结果 -->
			<!-- 审核结果 -->
			<view class="card" v-if="detailData.user_status === 'passed' || detailData.user_status === 'failed'">
				<view class="sec-hd">
					<svg class="s16 emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<text class="sec-hd-text">{{ detailData.user_status === 'passed' ? '达标' : '不达标' }}</text>
				</view>
				<view class="result-badge" v-if="detailData.user_status === 'passed'" style="background:#ecfdf5;color:#047857;padding:12rpx 20rpx;border-radius:12rpx;text-align:center;font-weight:600;">
					总经审核：达标
				</view>
				<view class="result-badge" v-if="detailData.user_status === 'failed'" style="background:#fff1f2;color:#be123c;padding:12rpx 20rpx;border-radius:12rpx;text-align:center;font-weight:600;">
					总经审核：不达标
				</view>
			</view>

			<!-- 已提交待审核 -->
			<view class="card" v-else-if="detailData.user_status !== 'none'">
				<view class="sec-hd">
					<svg class="s16 emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<text class="sec-hd-text">已提交考核</text>
				</view>
				<text class="requirement-text">考核已提交，等待总经审核中...</text>
			</view>

			<view class="dt-spacer"></view>
		</view>

		<!-- Toast -->
		<view class="toast" :class="toastVisible ? 'toast-show' : ''">
			<svg class="s16 emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
			<text class="toast-text">{{ toastMsg }}</text>
		</view>
	</view>
</template>

<script>
	import { api, BASE_URL } from '@/utils/api.js'
	import { useAuth } from '@/stores/auth.js'

	const statusConfig = {
		pending: { label: '待审核', cls: 'tag-amber', dot: 'dot-amber' },
		rejected: { label: '审核驳回', cls: 'tag-red', dot: 'dot-red' },
		progress: { label: '进行中', cls: 'tag-blue', dot: 'dot-blue' },
		completed: { label: '已完结', cls: 'tag-slate', dot: 'dot-slate' },
		passed: { label: '达标', cls: 'tag-emerald', dot: 'dot-emerald' },
		failed: { label: '不达标', cls: 'tag-rose', dot: 'dot-rose' }
	}

	export default {
		data() {
			return {
				publishId: 0,
				detailData: {},
				indicators: [],
				progressDesc: '',
				imageList: [],
				submitting: false,
				/* 今日完成量 */
				wechatCount: 0,
				joinPartyCount: 0,
				toastVisible: false,
				toastMsg: '',
				authRole: 'employee',
				loading: false,
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
			if (params.name) {
				this.detailData.name = decodeURIComponent(params.name)
			}
		},

		onShow() {
			this.$checkAuth()
			this.fetchDetail()
		},

		methods: {
			statusCfg(s) { return statusConfig[s] || statusConfig.pending },
			progressCls(p) {
				if (p >= 80) return 'emerald'
				if (p >= 50) return 'primary'
				return 'slate-500'
			},
			progressBarCls(p) {
				if (p >= 80) return 'bar-emerald'
				if (p >= 50) return 'bar-primary'
				return 'bar-slate'
			},

			navigateBack() {
				uni.navigateBack()
			},

		async fetchDetail() {
			if (!this.publishId) {
				uni.showToast({ title: '缺少考核ID', icon: 'none' })
				return
			}
			this.loading = true
			try {
				const res = await api.get('/api/admin/staff/assessment-detail', { publish_id: this.publishId })
				if (res.data) {
					const d = res.data
					const parts = []
					if (d.wechat_count) parts.push('微信' + d.wechat_count + '个')
					if (d.join_party_count) parts.push('入会' + d.join_party_count + '个')
					if (d.recruit_target_num) parts.push('招募' + d.recruit_target_num + '人')
					this.detailData = {
						id: d.id,
						name: this.detailData.name || d.name,
						period: d.period,
						status: d.status,
						target: d.target,
						progress: d.user_progress,
						target_remark: d.target_remark,
						rule_description: d.rule_description,
						user_status: d.user_status,
						user_score: d.user_score,
						user_summary: d.user_summary,
						dept_id: d.dept_id,
						targetDetail: parts.join(' / '),
					}
					this.indicators = d.indicators || []
					this.progressDesc = d.user_summary || ''

					// 回填已上传但未提交的图片（防止重复上传）
					if (d.submit_images && !this.imageList.length) {
						const allImgs = []
						Object.values(d.submit_images).forEach(arr => {
							arr.forEach(img => {
								allImgs.push({
									preview: BASE_URL + '/' + img.path,
									uploading: false,
									path: img.path,
								})
							})
						})
						this.imageList = allImgs
					}

					// 回填已保存的资源明细
					if (d.submit_resources && d.submit_resources.length > 0 && !this.resourceList.length) {
						this.resourceList = d.submit_resources.map(r => ({
							platform: r.platform || '',
							nickname: r.nickname || '',
							contact: r.contact || '',
						}))
					}
				}
			} catch (e) {
				console.error('[assessmentDetail]', e)
			}
			this.loading = false
		},

			onProgressSlider(e) {
				this.progressVal = e.detail.value
				this.hasUnsaved = true
			},
			chooseImage() {
				uni.chooseImage({
					count: 9,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						const tempFiles = res.tempFilePaths || []
						tempFiles.forEach(filepath => {
							const item = { preview: filepath, uploading: true, path: '' }
							this.imageList.push(item)
							const idx = this.imageList.length - 1
							this.uploadImage(filepath, idx)
						})
					}
				})
			},
			uploadImage(filepath, idx) {
				const token = uni.getStorageSync('api_token')
				const uploadTask = uni.uploadFile({
					url: this.getApiBase() + '/api/admin/staff/upload-assess-image',
					filePath: filepath,
					name: 'file',
					formData: { publish_id: this.publishId.toString() },
					header: { 'Authorization': 'Bearer ' + token },
					success: (res) => {
						try {
							const data = JSON.parse(res.data)
							if (data.code === 200 && data.data) {
								this.imageList[idx].path = data.data.path
								this.imageList[idx].uploading = false
							} else {
								this.imageList.splice(idx, 1)
								uni.showToast({ title: data.message || '上传失败', icon: 'none' })
							}
						} catch (e) {
							this.imageList.splice(idx, 1)
							uni.showToast({ title: '上传异常', icon: 'none' })
						}
					},
					fail: () => {
						this.imageList.splice(idx, 1)
						uni.showToast({ title: '网络异常，上传失败', icon: 'none' })
					}
				})
			},
			getApiBase() {
				return BASE_URL
			},
			removeImage(idx) {
				this.imageList.splice(idx, 1)
			},
			async submitProgress() {
				if (this.submitting) return
				if (!this.progressDesc.trim()) {
					this.showToast('请填写完成说明')
					return
				}
				// 检查是否有正在上传的图片
				const uploading = this.imageList.filter(img => img.uploading)
				if (uploading.length > 0) {
					this.showToast('图片正在上传中，请稍候')
					return
				}
				this.submitting = true
				try {
					const paths = this.imageList.filter(img => img.path).map(img => img.path)
					await api.post('/api/admin/staff/save-progress', {
						publish_id: this.publishId,
						progress: 0,
						remark: this.progressDesc,
						image_paths: paths.join(','),
						resources: this.resourceList,
						wechat_count: this.wechatCount,
						join_party_count: this.joinPartyCount,
					})
					this.showToast('考核已提交')
					this.fetchDetail()
				} catch (e) {
					this.submitting = false
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

			onCountInput(field) {
				let v = parseInt(this[field]) || 0
				if (v < 0) v = 0
				this[field] = v
			},

			showToast(msg) {
				this.toastMsg = msg
				this.toastVisible = true
				setTimeout(() => { this.toastVisible = false }, 2500)
			}
		}
	}
</script>

<style>
	/* ═══════════════════════════════ */
	/* Base */
	/* ═══════════════════════════════ */
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #f8fafc;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased;
		position: relative;
		overflow: hidden;
	}

	/* ═══════════════════════════════ */
	/* Utility */
	/* ═══════════════════════════════ */
	.s12 { width: 24rpx; height: 24rpx; flex-shrink: 0 }
	.s14 { width: 28rpx; height: 28rpx; flex-shrink: 0 }
	.s16 { width: 32rpx; height: 32rpx; flex-shrink: 0 }
	.s18 { width: 36rpx; height: 36rpx; flex-shrink: 0 }
	.s20 { width: 40rpx; height: 40rpx; flex-shrink: 0 }
	.s24 { width: 48rpx; height: 48rpx; flex-shrink: 0 }
	.s32 { width: 64rpx; height: 64rpx; flex-shrink: 0 }
	.s56 { width: 112rpx; height: 112rpx; flex-shrink: 0 }
	.slate-300 { color: #cbd5e1 }
	.slate-400 { color: #94a3b8 }
	.slate-500 { color: #64748b }
	.slate-600 { color: #475569 }
	.primary { color: #6370f0 }
	.emerald { color: #10b981 }
	.amber { color: #f59e0b }
	.violet { color: #8b5cf6 }

	/* ═══════════════════════════════ */
	/* Detail Header */
	/* ═══════════════════════════════ */
	.dt-hdr {
		background: rgba(255,255,255,0.92);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1rpx solid #f1f5f9;
		padding: 0 32rpx;
		/* padding-top: 88rpx; */
		position: sticky;
		top: 0;
		z-index: 50;
	}
	.dt-hdr-row {
		display: flex;
		align-items: center;
		gap: 16rpx;
		padding: 20rpx 0;
	}
	.back-btn {
		width: 72rpx;
		height: 72rpx;
		border-radius: 20rpx;
		background: #f1f5f9;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition: background 0.15s;
	}
	.back-btn:active { background: #e2e8f0 }
	.dt-hdr-titles { flex: 1; min-width: 0 }
	.dt-hdr-title {
		font-size: 28rpx;
		font-weight: 700;
		color: #0f172a;
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* ═══════════════════════════════ */
	/* Detail Body */
	/* ═══════════════════════════════ */
	.dt-body {
		padding: 32rpx 40rpx 200rpx;
	}
	.dt-spacer { height: 48rpx }

	/* ═══════════════════════════════ */
	/* Card */
	/* ═══════════════════════════════ */
	.card {
		background: #fff;
		border-radius: 28rpx;
		padding: 40rpx;
		margin-bottom: 32rpx;
		border: 1rpx solid #f1f5f9;
	}

	/* ═══════════════════════════════ */
	/* Status Tags */
	/* ═══════════════════════════════ */
	.status-tag {
		display: flex;
		align-items: center;
		gap: 8rpx;
		padding: 8rpx 20rpx;
		border-radius: 9999rpx;
		font-size: 20rpx;
		font-weight: 600;
		flex-shrink: 0;
	}
	.status-dot { width: 10rpx; height: 10rpx; border-radius: 50%; flex-shrink: 0 }
	.dot-amber { background: #f59e0b }
	.dot-red { background: #ef4444 }
	.dot-blue { background: #3b82f6 }
	.dot-slate { background: #94a3b8 }
	.dot-emerald { background: #10b981 }
	.dot-rose { background: #f43f5e }
	.tag-amber { background: #fffbeb; color: #d97706 }
	.tag-red { background: #fef2f2; color: #ef4444 }
	.tag-blue { background: #eff6ff; color: #2563eb }
	.tag-slate { background: #f1f5f9; color: #64748b }
	.tag-emerald { background: #ecfdf5; color: #059669 }
	.tag-rose { background: #fff1f2; color: #e11d48 }

	/* ═══════════════════════════════ */
	/* Progress Bar */
	/* ═══════════════════════════════ */
	.progress-label { font-size: 20rpx; color: #94a3b8; font-weight: 500 }
	.progress-val { font-size: 24rpx; font-weight: 700 }
	.bar { height: 8rpx; background: #f1f5f9; border-radius: 9999rpx; overflow: hidden }
	.bar-fill { height: 8rpx; border-radius: 9999rpx; transition: width 0.5s ease }
	.bar-primary { background: #6370f0 }
	.bar-emerald { background: #10b981 }
	.bar-slate { background: #94a3b8 }
	.bar-tl { height: 6rpx }

	/* ═══════════════════════════════ */
	/* Info */
	/* ═══════════════════════════════ */
	.info-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 24rpx;
	}
	.info-r { text-align: right }
	.info-label {
		font-size: 22rpx;
		color: #94a3b8;
		font-weight: 500;
		display: block;
		margin-bottom: 8rpx;
	}
	.info-val {
		font-size: 26rpx;
		font-weight: 600;
		color: #1e293b;
	}
	.info-divider {
		height: 1rpx;
		background: #f1f5f9;
		margin-bottom: 24rpx;
	}
	.info-progress {}
	.info-bar-wrap {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}
	.info-bar-wrap .bar { flex: 1 }

	/* ═══════════════════════════════ */
	/* Section Header */
	/* ═══════════════════════════════ */
	.sec-hd {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 28rpx;
	}
	.sec-hd-text {
		font-size: 26rpx;
		font-weight: 700;
		color: #334155;
	}

	/* ═══════════════════════════════ */
	/* Indicators */
	/* ═══════════════════════════════ */
	.indicator-item {
		padding: 20rpx 0;
	}
	.indicator-border { border-top: 1rpx solid #f1f5f9 }
	.indicator-hd {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8rpx;
	}
	.indicator-name {
		font-size: 26rpx;
		font-weight: 600;
		color: #475569;
	}
	.indicator-weight {
		font-size: 22rpx;
		font-weight: 700;
		color: #6370f0;
		background: #f0f4ff;
		padding: 4rpx 16rpx;
		border-radius: 8rpx;
	}
	.indicator-meta {
		font-size: 22rpx;
		color: #94a3b8;
		margin-bottom: 6rpx;
	}
	.indicator-target {
		color: #475569;
		font-weight: 500;
	}
	.indicator-standard {
		font-size: 20rpx;
		color: #94a3b8;
		line-height: 1.5;
	}

	/* 考核要求文本 */
	.requirement-text {
		font-size: 28rpx;
		color: #1e293b;
		line-height: 1.8;
		padding: 8rpx 0
	}

	/* 合并信息块 */
	.merged-divider { height: 1rpx; background: #f1f5f9; margin: 20rpx 0 }
	.merged-block { }
	.merged-label { font-size: 22rpx; color: #94a3b8; font-weight: 500; display: block; margin-bottom: 10rpx }
	.merged-text { font-size: 26rpx; color: #334155; line-height: 1.7 }

	/* 提交审核提示 */
	.submit-tip {
		display: block;
		margin-top: 16rpx;
		font-size: 24rpx;
		color: #94a3b8;
		text-align: center;
	}

	/* 指标进度条 */
	.indicator-progress {
		display: flex;
		align-items: center;
		gap: 16rpx;
		margin: 12rpx 0 8rpx;
	}
	.bar-ind { flex: 1; height: 6rpx }
	.indicator-pct {
		font-size: 22rpx;
		font-weight: 700;
		flex-shrink: 0;
		min-width: 60rpx;
		text-align: right;
	}
	.rose { color: #f43f5e }
	.red { color: #ef4444 }
	.bar-rose { background: #f43f5e }

	/* ═══════════════════════════════ */
	/* Rules */
	/* ═══════════════════════════════ */
	.rule-item {
		display: flex;
		gap: 20rpx;
		padding: 20rpx 0;
	}
	.rule-item:last-child { padding-bottom: 0 }
	.rule-num {
		width: 48rpx;
		height: 48rpx;
		border-radius: 16rpx;
		background: #f1f5f9;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20rpx;
		font-weight: 700;
		color: #64748b;
		flex-shrink: 0;
	}
	.rule-body { flex: 1; min-width: 0 }
	.rule-title {
		font-size: 26rpx;
		font-weight: 600;
		color: #475569;
		display: block;
		margin-bottom: 6rpx;
	}
	.rule-desc {
		font-size: 22rpx;
		color: #94a3b8;
		line-height: 1.5;
		display: block;
	}

	/* ═══════════════════════════════ */
	/* Section Divider */
	/* ═══════════════════════════════ */
	.section-divider {
		display: flex;
		align-items: center;
		gap: 24rpx;
		padding: 0 40rpx;
		margin-bottom: 32rpx;
	}
	.sd-line { flex: 1; height: 1rpx; background: #e2e8f0 }
	.sd-text { font-size: 22rpx; font-weight: 500; color: #94a3b8; letter-spacing: 0.05em; white-space: nowrap }

	/* ═══════════════════════════════ */
	/* Progress Slider */
	/* ═══════════════════════════════ */
	.slider-wrap { margin-bottom: 32rpx }
	.slider-hd {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	.slider-input-group {
		display: flex;
		align-items: center;
		gap: 4rpx;
	}
	.slider-input {
		width: 120rpx;
		text-align: right;
		font-size: 32rpx;
		font-weight: 700;
		color: #6370f0;
		background: #f0f4ff;
		border-radius: 12rpx;
		padding: 8rpx 16rpx;
		border: 1rpx solid #dbeafe;
	}
	.slider-input-unit { font-size: 24rpx; font-weight: 600; color: #94a3b8 }
	.slider-track-wrap { margin-bottom: 12rpx }
	.slider-track { width: 100% }
	.slider-labels {
		display: flex;
		justify-content: space-between;
		font-size: 18rpx;
		color: #cbd5e1;
		font-weight: 500;
	}

	/* ═══════════════════════════════ */
	/* Field */
	/* ═══════════════════════════════ */
	.field { margin-bottom: 28rpx }
	.field-label { margin-bottom: 16rpx }
	.field-textarea {
		width: 100%;
		font-size: 26rpx;
		color: #334155;
		background: #f8fafc;
		border-radius: 20rpx;
		padding: 24rpx 28rpx;
		border: 1rpx solid #e2e8f0;
		height: 144rpx;
		box-sizing: border-box;
	}
	.field-textarea:focus {
		border-color: #a5b8fc;
		background: #fff;
	}
	.field-textarea-tall { height: 200rpx }

	/* 数量输入行 */
	.count-row { display: flex; align-items: center; gap: 16rpx }
	.count-lbl { font-size: 24rpx; color: #64748B; flex-shrink: 0 }
	.count-input { width: 120rpx; height: 60rpx; text-align: center; font-size: 28rpx; font-weight: 700; color: #0F172A; background: #F9FAFB; border-radius: 12rpx; border: 1rpx solid #E2E8F0 }
	.count-unit { font-size: 22rpx; color: #94A3B8 }

	/* 图片上传 */
	.image-upload-wrap {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
	}
	.image-item {
		width: 160rpx;
		height: 160rpx;
		border-radius: 16rpx;
		overflow: hidden;
		position: relative;
		background: #f1f5f9;
	}
	.image-thumb {
		width: 100%;
		height: 100%;
	}
	.image-mask {
		position: absolute;
		top: 0; left: 0; right: 0; bottom: 0;
		background: rgba(0,0,0,0.45);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.image-progress-text {
		color: #fff;
		font-size: 20rpx;
		font-weight: 500;
	}
	.image-delete {
		position: absolute;
		top: 4rpx;
		right: 4rpx;
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		background: rgba(0,0,0,0.55);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.image-add {
		width: 160rpx;
		height: 160rpx;
		border-radius: 16rpx;
		border: 2rpx dashed #cbd5e1;
		background: #f8fafc;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8rpx;
	}
	.image-add:active { background: #f1f5f9; border-color: #94a3b8; }
	.image-add-text {
		font-size: 20rpx;
		color: #94a3b8;
	}
	.s32 { width: 64rpx; height: 64rpx; flex-shrink: 0 }

	/* ═══════════════════════════════ */
	/* Buttons */
	/* ═══════════════════════════════ */
	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24rpx 0;
		border-radius: 20rpx;
		font-size: 26rpx;
		font-weight: 600;
		transition: all 0.15s;
	}
	.btn:active { transform: scale(0.98) }
	.btn-primary {
		background: #6370f0;
		color: #fff;
	}
	.btn-primary:active { background: #4f52e3 }
	.btn-disabled { background: #cbd5e1; color: #94a3b8; pointer-events: none; box-shadow: none }
	.btn-shadow { box-shadow: 0 8rpx 32rpx rgba(99,112,240,0.3) }
	.btn-violet {
		background: #8b5cf6;
		color: #fff;
	}
	.btn-violet:active { background: #7c3aed }
	.btn-shadow-violet { box-shadow: 0 8rpx 32rpx rgba(139,92,246,0.3) }

	/* ═══════════════════════════════ */
	/* Upload */
	/* ═══════════════════════════════ */
	.upload-zone {
		border: 2rpx dashed #e2e8f0;
		border-radius: 20rpx;
		padding: 48rpx 32rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 28rpx;
		transition: all 0.2s;
	}
	.upload-zone:active {
		border-color: #6370f0;
		background: rgba(99,112,240,0.04);
	}
	.upload-text {
		font-size: 22rpx;
		color: #94a3b8;
		font-weight: 500;
		margin-top: 16rpx;
	}
	.upload-sub {
		font-size: 18rpx;
		color: #cbd5e1;
		margin-top: 8rpx;
	}
	.upload-zone-disabled {
		background: #f8fafc;
		opacity: 0.7;
	}
	.upload-zone-disabled:active {
		border-color: #e2e8f0;
		background: #f8fafc;
	}

	/* ═══════════════════════════════ */
	/* Timeline */
	/* ═══════════════════════════════ */
	.timeline { position: relative; padding-left: 40rpx }
	.tl-item { position: relative; padding-bottom: 40rpx }
	.tl-item:last-child { padding-bottom: 0 }
	.tl-line {
		position: absolute;
		left: 8rpx;
		top: 20rpx;
		bottom: 0;
		width: 2rpx;
		background: #e2e8f0;
	}
	.tl-dot {
		position: absolute;
		left: 0;
		top: 6rpx;
		width: 18rpx;
		height: 18rpx;
		border-radius: 50%;
		border: 4rpx solid #fff;
		box-shadow: 0 0 0 2rpx currentColor;
	}
	.tl-dot-primary { color: #6370f0; background: #6370f0 }
	.tl-dot-default { color: #cbd5e1; background: #cbd5e1 }
	.tl-body { margin-left: 28rpx }
	.tl-hd {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
	}
	.tl-date { font-size: 24rpx; font-weight: 600; color: #475569 }
	.tl-pct { font-size: 22rpx; font-weight: 700 }
	.tl-desc {
		font-size: 22rpx;
		color: #94a3b8;
		line-height: 1.5;
		margin-top: 10rpx;
		display: block;
	}

	/* ═══════════════════════════════ */
	/* Bottom Bar - Role Action Buttons */
	/* ═══════════════════════════════ */
	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(255,255,255,0.92);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-top: 1rpx solid #f1f5f9;
		padding: 20rpx 40rpx;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		z-index: 60;
	}
	.bb-btn {
		flex: 1;
		text-align: center;
		padding: 24rpx 0;
		border-radius: 20rpx;
		font-size: 26rpx;
		font-weight: 600;
		transition: all 0.15s;
	}
	.bb-btn:active { transform: scale(0.98) }
	/* 员工 - sage green */
	.bb-btn-employee {
		background: #6ea896;
		color: #fff;
		box-shadow: 0 8rpx 32rpx rgba(110,168,150,0.35);
	}
	.bb-btn-employee:active { background: #5a9080 }
	/* 组长/总监 - amber */
	.bb-btn-leader {
		background: #f59e0b;
		color: #fff;
		box-shadow: 0 8rpx 32rpx rgba(245,158,11,0.35);
	}
	.bb-btn-leader:active { background: #d97706 }
	/* 管理员 - red */
	.bb-btn-admin {
		background: #ef4444;
		color: #fff;
		box-shadow: 0 8rpx 32rpx rgba(239,68,68,0.35);
	}
	.bb-btn-admin:active { background: #dc2626 }

	/* ═══════════════════════════════ */
	/* Resource Entry */
	/* ═══════════════════════════════ */
	.res-form { margin-bottom: 20rpx }
	.res-form-row { display: flex; align-items: center; margin-bottom: 16rpx }
	.res-lbl { font-size: 24rpx; color: #64748B; width: 120rpx; flex-shrink: 0 }
	.res-input { flex: 1; height: 64rpx; font-size: 24rpx; color: #374151; background: #F9FAFB; border: 1rpx solid #E2E8F0; border-radius: 12rpx; padding: 0 16rpx; box-sizing: border-box }
	.ip-pl { color: #B0B8C1; font-size: 24rpx }
	.df-picker { display: flex; align-items: center; justify-content: space-between; flex: 1; height: 64rpx; background: #F9FAFB; border: 1rpx solid #E2E8F0; border-radius: 12rpx; padding: 0 16rpx; box-sizing: border-box }
	.df-selected { font-size: 24rpx; color: #374151; font-weight: 500 }
	.df-placeholder { font-size: 24rpx; color: #B0B8C1 }

	.res-add-btn { width: 100%; height: 64rpx; background: #F0F5F9; border: 1rpx dashed #93C5FD; border-radius: 12rpx; display: flex; align-items: center; justify-content: center; font-size: 24rpx; color: #3B82F6; font-weight: 500; margin-left: 120rpx; width: calc(100% - 120rpx) }
	.res-add-btn:active { background: #DBEAFE }

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

	.res-empty { font-size: 24rpx; color: #B0B8C1; display: block; text-align: center; padding: 16rpx 0 }

	/* ═══════════════════════════════ */
	/* Toast */
	/* ═══════════════════════════════ */
	.toast {
		position: fixed;
		top: 160rpx;
		left: 50%;
		background: #1e293b;
		color: #fff;
		font-size: 22rpx;
		font-weight: 500;
		padding: 24rpx 40rpx;
		border-radius: 28rpx;
		display: flex;
		align-items: center;
		gap: 12rpx;
		white-space: nowrap;
		z-index: 200;
		pointer-events: none;
		opacity: 0;
		transform: translate(-50%, -16rpx);
		transition: all 0.3s ease;
	}
	.toast-show {
		opacity: 1;
		transform: translate(-50%, 0);
	}
	.toast-text { color: #fff }
</style>
