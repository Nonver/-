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
					<text class="dt-hdr-title">{{ detailData.name || '主播部考核' }}</text>
				</view>
				<view class="status-tag" :class="statusCfg(detailData.status).cls">
					<view class="status-dot" :class="statusCfg(detailData.status).dot"></view>
					<text>{{ statusCfg(detailData.status).label }}</text>
				</view>
			</view>
		</view>

		<view class="dt-body" v-if="publishId">
			<!-- 基本信息 -->
			<view class="card">
				<view class="info-row">
					<view>
						<text class="info-label">考核周期</text>
						<text class="info-val">{{ detailData.period || '暂无' }}</text>
					</view>
					<view class="info-r">
						<text class="info-label">考核对象</text>
						<text class="info-val">{{ detailData.target || '主播部' }}</text>
					</view>
				</view>
			</view>

			<!-- 考核指标 -->
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
			<view class="card" v-else>
				<view class="sec-hd">
					<svg class="s16 primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
					<text class="sec-hd-text">考核要求</text>
				</view>
				<text class="requirement-text">{{ detailData.target_remark || '暂无考核要求' }}</text>
			</view>

			<!-- 考核备注 -->
			<view class="card">
				<view class="sec-hd">
					<svg class="s16 amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					<text class="sec-hd-text">考核备注</text>
				</view>
				<text class="requirement-text">{{ detailData.rule_description || '暂无备注' }}</text>
			</view>

			<!-- 考核提交 -->
			<view class="card" v-if="detailData.user_status === 'none'">
				<view class="sec-hd">
					<svg class="s16 emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<text class="sec-hd-text">考核提交</text>
				</view>

				<!-- 直播天数 -->
				<view class="field">
					<text class="info-label field-label">直播天数</text>
					<view class="count-row">
						<input class="count-input" type="digit" v-model="streamDays" placeholder="0" @input="onNumInput('streamDays')" />
						<text class="count-unit">天</text>
						<text v-if="anchorTarget.stream_days" class="target-hint">目标: {{ anchorTarget.stream_days }} 天</text>
					</view>
				</view>
				<view class="field">
					<text class="info-label field-label">直播天数截图</text>
					<image-upload :imageList="streamDaysImages" :uploadType="'stream_days'" @choose="chooseImage" @remove="(i) => removeImage('streamDaysImages', i)" />
				</view>

				<!-- 直播时长 -->
				<view class="field">
					<text class="info-label field-label">直播时长</text>
					<view class="count-row">
						<input class="count-input" type="digit" v-model="streamHours" placeholder="0" @input="onNumInput('streamHours')" />
						<text class="count-unit">小时</text>
						<text v-if="anchorTarget.stream_hours" class="target-hint">目标: {{ anchorTarget.stream_hours }} 小时/天</text>
					</view>
				</view>
				<view class="field">
					<text class="info-label field-label">直播时长截图</text>
					<image-upload :imageList="streamHoursImages" :uploadType="'stream_hours'" @choose="chooseImage" @remove="(i) => removeImage('streamHoursImages', i)" />
				</view>

				<!-- 直播流水 -->
				<view class="field">
					<text class="info-label field-label">直播流水</text>
					<view class="count-row">
						<input class="count-input" type="digit" v-model="streamRevenue" placeholder="0" @input="onNumInput('streamRevenue')" />
						<text class="count-unit">元</text>
						<text v-if="anchorTarget.stream_revenue" class="target-hint">目标: {{ anchorTarget.stream_revenue }} 元</text>
					</view>
				</view>
				<view class="field">
					<text class="info-label field-label">直播流水截图</text>
					<image-upload :imageList="streamRevenueImages" :uploadType="'stream_revenue'" @choose="chooseImage" @remove="(i) => removeImage('streamRevenueImages', i)" />
				</view>

				<!-- 每日添加大哥数 -->
				<view class="field">
					<text class="info-label field-label">每日添加大哥数</text>
					<view class="count-row">
						<input class="count-input" type="number" v-model="bigSpenderCount" placeholder="0" @input="onNumInput('bigSpenderCount')" />
						<text class="count-unit">个</text>
					</view>
				</view>

				<!-- 大哥资源明细 -->
				<view class="field">
					<text class="info-label field-label">资源明细（选填）</text>
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
							<text class="res-lbl">大哥昵称</text>
							<input class="res-input" v-model="resNickname" placeholder="请输入大哥昵称" placeholder-class="ip-pl" />
						</view>
						<view class="res-form-row">
							<text class="res-lbl">联系方式</text>
							<input class="res-input" v-model="resContact" placeholder="微信/QQ" placeholder-class="ip-pl" />
						</view>
						<view class="res-add-btn" @tap="addResource">添加</view>
					</view>
					<!-- 资源列表 -->
					<view class="res-list" v-if="resourceList.length > 0">
						<view class="res-item" v-for="(item, i) in resourceList" :key="i">
							<view class="res-item-info">
								<text class="res-platform" :class="item.platform==='微信'?'rp-wechat':'rp-qq'">{{ item.platform }}</text>
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
					<text class="res-empty" v-else>暂未添加大哥资源</text>
				</view>

				<!-- 完成说明 -->
				<view class="field">
					<text class="info-label field-label">完成说明</text>
					<textarea class="field-textarea" v-model="progressDesc" placeholder="请描述本次考核完成的各项工作内容..." />
				</view>

				<view class="btn btn-primary btn-shadow" :class="{ 'btn-disabled': submitting }" @tap="submitProgress">
					<text>{{ submitting ? '提交中...' : '提交考核' }}</text>
				</view>
				<text class="submit-tip">提交后将由总经进行审核，仅可提交一次</text>
			</view>

			<!-- 已提交 -->
			<view class="card" v-if="detailData.user_status !== 'none'">
				<view class="sec-hd">
					<svg class="s16 emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<text class="sec-hd-text">{{ detailData.user_status === 'passed' ? '达标' : detailData.user_status === 'failed' ? '不达标' : '已提交考核' }}</text>
				</view>

				<!-- 已提交的完成数据展示 -->
				<view v-if="anchorSubmit && (anchorSubmit.stream_days || anchorSubmit.stream_hours || anchorSubmit.stream_revenue || anchorSubmit.big_spender_count)" class="submit-data">
					<view class="submit-data-row" v-if="anchorSubmit.stream_days">
						<text class="submit-data-lbl">直播天数</text>
						<text class="submit-data-val">{{ anchorSubmit.stream_days }} 天</text>
					</view>
					<view class="submit-data-row" v-if="anchorSubmit.stream_hours">
						<text class="submit-data-lbl">直播时长</text>
						<text class="submit-data-val">{{ anchorSubmit.stream_hours }} 小时</text>
					</view>
					<view class="submit-data-row" v-if="anchorSubmit.stream_revenue">
						<text class="submit-data-lbl">直播流水</text>
						<text class="submit-data-val">{{ anchorSubmit.stream_revenue }} 元</text>
					</view>
					<view class="submit-data-row" v-if="anchorSubmit.big_spender_count">
						<text class="submit-data-lbl">添加大哥数</text>
						<text class="submit-data-val">{{ anchorSubmit.big_spender_count }} 个</text>
					</view>
				</view>

				<!-- 已提交的图片 -->
				<view v-if="submitImages && Object.keys(submitImages).length > 0" class="submitted-images">
					<text class="info-label field-label" style="margin-top:20rpx;">提交凭证</text>
					<view v-for="(images, type) in submitImages" :key="type" class="img-type-group">
						<text class="img-type-label">{{ imageTypeLabel(type) }}</text>
						<view class="image-preview-grid">
							<image v-for="(img, i) in images" :key="i" :src="getImageFullUrl(img.path)" class="image-thumb" mode="aspectFill" @tap="previewImage(img.path)" />
						</view>
					</view>
				</view>

				<!-- 已提交的资源明细 -->
				<view v-if="submitResources && submitResources.length > 0" class="res-list" style="margin-top:20rpx;">
					<text class="info-label field-label">大哥资源明细</text>
					<view class="res-item" v-for="(item, i) in submitResources" :key="i">
						<view class="res-item-info">
							<text class="res-platform" :class="item.platform==='微信'?'rp-wechat':'rp-qq'">{{ item.platform }}</text>
							<text class="res-nickname">{{ item.nickname }}</text>
							<text class="res-contact">{{ item.contact }}</text>
						</view>
					</view>
				</view>

				<text class="requirement-text" style="margin-top:20rpx;">{{ detailData.user_summary || '考核已提交，等待总经审核中...' }}</text>
				<view class="result-badge" v-if="detailData.user_status === 'passed'" style="background:#ecfdf5;color:#047857;margin-top:16rpx;padding:12rpx 20rpx;border-radius:12rpx;text-align:center;font-weight:600;">
					总经审核：达标
				</view>
				<view class="result-badge" v-if="detailData.user_status === 'failed'" style="background:#fff1f2;color:#be123c;margin-top:16rpx;padding:12rpx 20rpx;border-radius:12rpx;text-align:center;font-weight:600;">
					总经审核：不达标
				</view>
			</view>

			<view class="dt-spacer"></view>
		</view>

		<!-- 无考核数据 -->
		<view class="dt-body" v-else>
			<view class="card">
				<text class="requirement-text" style="text-align:center;color:#94a3b8;">暂无考核数据</text>
			</view>
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

	const statusConfig = {
		pending: { label: '待审核', cls: 'tag-amber', dot: 'dot-amber' },
		progress: { label: '进行中', cls: 'tag-blue', dot: 'dot-blue' },
		completed: { label: '已完结', cls: 'tag-slate', dot: 'dot-slate' },
		passed: { label: '达标', cls: 'tag-emerald', dot: 'dot-emerald' },
		failed: { label: '不达标', cls: 'tag-rose', dot: 'dot-rose' }
	}

	const imageTypeLabels = {
		'stream_days': '直播天数',
		'stream_hours': '直播时长',
		'stream_revenue': '直播流水',
	}

	export default {
		data() {
			return {
				publishId: 0,
				detailData: { user_status: 'none' },
				indicators: [],
				progressDesc: '',
				submitting: false,
				toastVisible: false,
				toastMsg: '',
				loading: false,
				/* 主播部完成数据 */
				streamDays: '',
				streamHours: '',
				streamRevenue: '',
				bigSpenderCount: 0,
				/* 目标值 */
				anchorTarget: {},
				anchorSubmit: null,
				submitImages: {},
				submitResources: [],
				/* 每个指标的图片列表 */
				streamDaysImages: [],
				streamHoursImages: [],
				streamRevenueImages: [],
				/* 资源录入 */
				platformOptions: ['微信', 'QQ'],
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
			imageTypeLabel(type) { return imageTypeLabels[type] || '其他' },
			navigateBack() { uni.navigateBack() },

			async fetchDetail() {
				if (!this.publishId) return
				this.loading = true
				try {
					const res = await api.get('/api/admin/staff/assessment-detail', { publish_id: this.publishId })
					if (res.data) {
						const d = res.data
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
						}
						this.indicators = d.indicators || []
						this.progressDesc = d.user_summary || ''
						this.anchorTarget = d.anchor_target || {}
						this.anchorSubmit = d.anchor_submit || null
						this.submitImages = d.submit_images || {}
						this.submitResources = d.submit_resources || []
					}
				} catch (e) {
					console.error('[anchorAssessment]', e)
				}
				this.loading = false
			},

			onNumInput(field) {
				let v = parseFloat(this[field]) || 0
				if (v < 0) v = 0
				this[field] = field === 'bigSpenderCount' ? Math.floor(v) : v
			},

			/* ── 图片上传 ── */
			chooseImage(type) {
				const listKey = this.getImageListKey(type)
				uni.chooseImage({
					count: 9,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						const tempFiles = res.tempFilePaths || []
						tempFiles.forEach(filepath => {
							const item = { preview: filepath, uploading: true, path: '' }
							this[listKey].push(item)
							const idx = this[listKey].length - 1
							this.uploadImage(filepath, idx, listKey, type)
						})
					}
				})
			},
			getImageListKey(type) {
				const map = {
					'stream_days': 'streamDaysImages',
					'stream_hours': 'streamHoursImages',
					'stream_revenue': 'streamRevenueImages',
				}
				return map[type] || 'streamDaysImages'
			},
			uploadImage(filepath, idx, listKey, type) {
				const token = uni.getStorageSync('api_token')
				const uploadTask = uni.uploadFile({
					url: BASE_URL + '/api/admin/staff/upload-assess-image',
					filePath: filepath,
					name: 'file',
					formData: {
						publish_id: this.publishId.toString(),
						image_type: type,
					},
					header: { 'Authorization': 'Bearer ' + token },
					success: (res) => {
						try {
							const data = JSON.parse(res.data)
							if (data.code === 200 && data.data) {
								this[listKey][idx].path = data.data.path
								this[listKey][idx].uploading = false
							} else {
								this[listKey].splice(idx, 1)
								uni.showToast({ title: data.message || '上传失败', icon: 'none' })
							}
						} catch (e) {
							this[listKey].splice(idx, 1)
							uni.showToast({ title: '上传异常', icon: 'none' })
						}
					},
					fail: () => {
						this[listKey].splice(idx, 1)
						uni.showToast({ title: '网络异常，上传失败', icon: 'none' })
					}
				})
			},
			removeImage(listKey, idx) {
				this[listKey].splice(idx, 1)
			},

			/* ── 资源录入 ── */
			onPlatformChange(e) { this.platformIndex = parseInt(e.detail.value) },
			addResource() {
				if (this.platformIndex < 0) return this.showToast('请选择平台')
				if (!this.resNickname.trim()) return this.showToast('请输入大哥昵称')
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

			/* ── 提交考核 ── */
			async submitProgress() {
				if (this.submitting) return
				// 检查是否有正在上传的图片
				const allImages = [...this.streamDaysImages, ...this.streamHoursImages, ...this.streamRevenueImages]
				const uploading = allImages.filter(img => img.uploading)
				if (uploading.length > 0) {
					this.showToast('图片正在上传中，请稍候')
					return
				}
				if (!this.progressDesc.trim()) {
					this.showToast('请填写完成说明')
					return
				}
				this.submitting = true
				try {
					await api.post('/api/admin/staff/save-progress', {
						publish_id: this.publishId,
						progress: 0,
						remark: this.progressDesc,
						stream_days: parseFloat(this.streamDays) || 0,
						stream_hours: parseFloat(this.streamHours) || 0,
						stream_revenue: parseFloat(this.streamRevenue) || 0,
						big_spender_count: parseInt(this.bigSpenderCount) || 0,
						resources: this.resourceList,
					})
					this.showToast('考核已提交')
					this.fetchDetail()
				} catch (e) {
					this.submitting = false
				}
			},

			getImageFullUrl(path) {
				if (!path) return ''
				if (path.startsWith('http')) return path
				return BASE_URL + '/' + path
			},
			previewImage(path) {
				const url = this.getImageFullUrl(path)
				uni.previewImage({
					urls: [url],
					current: url,
				})
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
	.pg {
		width: 100%; min-height: 100vh; background: #f8fafc;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased; position: relative; overflow: hidden;
	}
	.s12 { width: 24rpx; height: 24rpx; flex-shrink: 0 }
	.s14 { width: 28rpx; height: 28rpx; flex-shrink: 0 }
	.s16 { width: 32rpx; height: 32rpx; flex-shrink: 0 }
	.s18 { width: 36rpx; height: 36rpx; flex-shrink: 0 }
	.s20 { width: 40rpx; height: 40rpx; flex-shrink: 0 }
	.slate-400 { color: #94a3b8 }
	.slate-500 { color: #64748b }
	.slate-600 { color: #475569 }
	.primary { color: #6370f0 }
	.emerald { color: #10b981 }
	.amber { color: #f59e0b }
	.red { color: #ef4444 }
	.rose { color: #f43f5e }

	.dt-hdr {
		background: rgba(255,255,255,0.92); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
		border-bottom: 1rpx solid #f1f5f9; padding: 0 32rpx; padding-top: 88rpx; position: sticky; top: 0; z-index: 50;
	}
	.dt-hdr-row { display: flex; align-items: center; gap: 16rpx; padding: 20rpx 0; }
	.back-btn { width: 72rpx; height: 72rpx; border-radius: 20rpx; background: #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
	.back-btn:active { background: #e2e8f0 }
	.dt-hdr-titles { flex: 1; min-width: 0 }
	.dt-hdr-title { font-size: 28rpx; font-weight: 700; color: #0f172a; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

	.dt-body { padding: 32rpx 40rpx 200rpx; }
	.dt-spacer { height: 48rpx }

	.card { background: #fff; border-radius: 28rpx; padding: 40rpx; margin-bottom: 32rpx; border: 1rpx solid #f1f5f9; }

	.status-tag { display: flex; align-items: center; gap: 8rpx; padding: 8rpx 20rpx; border-radius: 9999rpx; font-size: 20rpx; font-weight: 600; flex-shrink: 0; }
	.status-dot { width: 10rpx; height: 10rpx; border-radius: 50%; flex-shrink: 0 }
	.dot-amber { background: #f59e0b }
	.dot-blue { background: #3b82f6 }
	.dot-slate { background: #94a3b8 }
	.dot-emerald { background: #10b981 }
	.dot-rose { background: #f43f5e }
	.tag-amber { background: #fffbeb; color: #d97706 }
	.tag-blue { background: #eff6ff; color: #2563eb }
	.tag-slate { background: #f1f5f9; color: #64748b }
	.tag-emerald { background: #ecfdf5; color: #059669 }
	.tag-rose { background: #fff1f2; color: #e11d48 }

	.info-row { display: flex; justify-content: space-between; margin-bottom: 24rpx; }
	.info-r { text-align: right }
	.info-label { font-size: 22rpx; color: #94a3b8; font-weight: 500; display: block; margin-bottom: 8rpx; }
	.info-val { font-size: 26rpx; font-weight: 600; color: #1e293b; }

	.sec-hd { display: flex; align-items: center; gap: 12rpx; margin-bottom: 28rpx; }
	.sec-hd-text { font-size: 26rpx; font-weight: 700; color: #334155; }

	.indicator-item { padding: 20rpx 0; }
	.indicator-border { border-top: 1rpx solid #f1f5f9 }
	.indicator-hd { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8rpx; }
	.indicator-name { font-size: 26rpx; font-weight: 600; color: #475569; }
	.indicator-weight { font-size: 22rpx; font-weight: 700; color: #6370f0; background: #f0f4ff; padding: 4rpx 16rpx; border-radius: 8rpx; }
	.indicator-meta { font-size: 22rpx; color: #94a3b8; margin-bottom: 6rpx; }
	.indicator-target { color: #475569; font-weight: 500; }
	.indicator-standard { font-size: 20rpx; color: #94a3b8; line-height: 1.5; }
	.indicator-progress { display: flex; align-items: center; gap: 16rpx; margin: 12rpx 0 8rpx; }
	.indicator-pct { font-size: 22rpx; font-weight: 700; flex-shrink: 0; min-width: 60rpx; text-align: right; }
	.bar { height: 8rpx; background: #f1f5f9; border-radius: 9999rpx; overflow: hidden }
	.bar-fill { height: 8rpx; border-radius: 9999rpx; transition: width 0.5s ease }
	.bar-ind { flex: 1; height: 6rpx }
	.bar-primary { background: #6370f0 }
	.bar-emerald { background: #10b981 }
	.bar-rose { background: #f43f5e }

	.requirement-text { font-size: 28rpx; color: #1e293b; line-height: 1.8; padding: 8rpx 0 }

	/* 数量输入行 */
	.field { margin-bottom: 28rpx }
	.field-label { margin-bottom: 16rpx }
	.field-textarea {
		width: 100%; font-size: 26rpx; color: #334155; background: #f8fafc;
		border-radius: 20rpx; padding: 24rpx 28rpx; border: 1rpx solid #e2e8f0; height: 144rpx; box-sizing: border-box;
	}

	.count-row { display: flex; align-items: center; gap: 16rpx; flex-wrap: wrap }
	.count-lbl { font-size: 24rpx; color: #64748B; flex-shrink: 0 }
	.count-input { width: 160rpx; height: 64rpx; text-align: center; font-size: 28rpx; font-weight: 700; color: #0F172A; background: #F9FAFB; border-radius: 12rpx; border: 1rpx solid #E2E8F0 }
	.count-unit { font-size: 22rpx; color: #94A3B8 }
	.target-hint { font-size: 20rpx; color: #94a3b8; margin-left: 8rpx }

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
	.image-thumb { width: 100%; height: 100% }
	.image-mask {
		position: absolute; top: 0; left: 0; right: 0; bottom: 0;
		background: rgba(0,0,0,0.4);
		display: flex; align-items: center; justify-content: center;
	}
	.image-progress-text { font-size: 20rpx; color: #fff; font-weight: 500 }
	.image-delete {
		position: absolute; top: 6rpx; right: 6rpx;
		width: 40rpx; height: 40rpx; border-radius: 50%;
		background: rgba(0,0,0,0.5);
		display: flex; align-items: center; justify-content: center;
		z-index: 1;
	}
	.white { color: #fff }
	.image-add {
		width: 160rpx; height: 160rpx; border-radius: 16rpx;
		border: 2rpx dashed #d1d5db; background: #f9fafb;
		display: flex; flex-direction: column; align-items: center; justify-content: center;
		gap: 8rpx;
	}
	.image-add-text { font-size: 20rpx; color: #94a3b8 }
	.s32 { width: 64rpx; height: 64rpx; flex-shrink: 0 }

	/* 资源明细 */
	.res-form { background: #F8FAFC; border-radius: 16rpx; padding: 24rpx 24rpx 16rpx; margin-top: 8rpx }
	.res-form-row { display: flex; align-items: center; margin-bottom: 20rpx }
	.res-lbl { width: 120rpx; font-size: 24rpx; color: #64748B; flex-shrink: 0 }
	.res-input { flex: 1; height: 56rpx; font-size: 24rpx; color: #1E293B; background: #fff; border-radius: 10rpx; padding: 0 16rpx; border: 1rpx solid #E2E8F0 }
	.df-picker { flex: 1; display: flex; align-items: center; justify-content: space-between; height: 56rpx; background: #fff; border-radius: 10rpx; padding: 0 16rpx; border: 1rpx solid #E2E8F0 }
	.df-selected { font-size: 24rpx; color: #1E293B }
	.df-placeholder { font-size: 24rpx; color: #94A3B8 }
	.gray-400 { color: #9ca3af }
	.ip-pl { color: #94A3B8 }
	.res-add-btn { text-align: center; padding: 14rpx 0; font-size: 24rpx; font-weight: 600; color: #6370F0; background: #EEF2FF; border-radius: 12rpx }
	.res-list { display: flex; flex-direction: column; gap: 12rpx; margin-top: 16rpx }
	.res-item { display: flex; align-items: center; justify-content: space-between; background: #F9FAFB; padding: 16rpx 20rpx; border-radius: 14rpx }
	.res-item-info { display: flex; align-items: center; gap: 20rpx; flex: 1; min-width: 0 }
	.res-platform { font-size: 22rpx; font-weight: 600; padding: 4rpx 14rpx; border-radius: 8rpx; flex-shrink: 0 }
	.rp-wechat { background: #ECFDF5; color: #059669 }
	.rp-qq { background: #EFF6FF; color: #2563EB }
	.res-nickname { font-size: 24rpx; color: #334155; font-weight: 500 }
	.res-contact { font-size: 22rpx; color: #94A3B8; margin-left: auto }
	.res-del { width: 48rpx; height: 48rpx; display: flex; align-items: center; justify-content: center; flex-shrink: 0 }
	.res-empty { font-size: 22rpx; color: #94A3B8; text-align: center; padding: 20rpx 0; display: block }

	/* 已提交数据 */
	.submit-data { margin-top: 20rpx }
	.submit-data-row { display: flex; align-items: center; padding: 12rpx 0; border-bottom: 1rpx solid #f1f5f9 }
	.submit-data-row:last-child { border-bottom: none }
	.submit-data-lbl { font-size: 24rpx; color: #94a3b8; min-width: 140rpx }
	.submit-data-val { font-size: 26rpx; color: #1e293b; font-weight: 600 }

	/* 已提交图片 */
	.img-type-group { margin-top: 16rpx }
	.img-type-label { font-size: 22rpx; color: #64748b; font-weight: 500; display: block; margin-bottom: 12rpx }
	.image-preview-grid { display: flex; flex-wrap: wrap; gap: 12rpx }
	.image-preview-grid .image-thumb { width: 140rpx; height: 140rpx; border-radius: 12rpx; flex-shrink: 0 }

	.btn { display: flex; align-items: center; justify-content: center; padding: 24rpx 0; border-radius: 20rpx; font-size: 26rpx; font-weight: 600; }
	.btn:active { transform: scale(0.98) }
	.btn-primary { background: #6370f0; color: #fff; }
	.btn-disabled { background: #cbd5e1; color: #94a3b8; pointer-events: none; box-shadow: none }
	.btn-shadow { box-shadow: 0 8rpx 32rpx rgba(99,112,240,0.3) }

	.submit-tip { display: block; margin-top: 16rpx; font-size: 24rpx; color: #94a3b8; text-align: center; }

	.toast {
		position: fixed; top: 160rpx; left: 50%;
		background: #1e293b; color: #fff; font-size: 22rpx; font-weight: 500;
		padding: 24rpx 40rpx; border-radius: 28rpx;
		display: flex; align-items: center; gap: 12rpx; white-space: nowrap;
		z-index: 200; pointer-events: none; opacity: 0;
		transform: translate(-50%, -16rpx); transition: all 0.3s ease;
	}
	.toast-show { opacity: 1; transform: translate(-50%, 0); }
	.toast-text { color: #fff }
</style>
