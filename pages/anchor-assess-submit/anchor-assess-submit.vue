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
				<text class="hdr-title">主播考核提交</text>
				<view class="hdr-btn-placeholder"></view>
			</view>
		</view>

		<view class="main">
			<!-- ═══ 考核列表 ═══ -->
			<template v-if="!showSubmit">
				<!-- 加载中 -->
				<view v-if="loading" class="empty-state">
					<text class="empty-text">加载中...</text>
				</view>

				<!-- 空状态 -->
				<view v-else-if="assessList.length === 0" class="empty-state">
					<svg class="s48 empty-icon" fill="none" stroke="#CBD5E1" viewBox="0 0 24 24" stroke-width="1">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
					<text class="empty-text">暂无待提交的考核</text>
					<text class="empty-hint">考核由人事部统一发布</text>
				</view>

				<!-- 考核卡片列表 -->
				<view v-else>
					<view v-for="(item, idx) in assessList" :key="item.id" class="card" @tap="enterSubmit(item)">
						<!-- 头部 -->
						<view class="card-top">
							<view class="card-top-l">
								<text class="card-name">{{ item.period }}</text>
							</view>
							<view class="status-tag" :class="statusCfg(item.status).cls">
								<view class="status-dot" :class="statusCfg(item.status).dot"></view>
								<text>{{ statusCfg(item.status).label }}</text>
							</view>
						</view>

						<!-- 考核指标 -->
						<view class="target-tag">{{ item.targetRemark || '直播考核' }}</view>

						<!-- 主播指标 -->
						<view class="anchor-metrics" v-if="item.anchorMetrics">
							<view class="metric-row" v-if="item.anchorMetrics.month_stream_days">
								<text class="metric-label">月度开播</text>
								<text class="metric-val">{{ item.anchorMetrics.month_stream_days }}<text class="metric-unit">天</text></text>
							</view>
							<view class="metric-row" v-if="item.anchorMetrics.daily_live_hours">
								<text class="metric-label">每日时长</text>
								<text class="metric-val">{{ item.anchorMetrics.daily_live_hours }}<text class="metric-unit">小时</text></text>
							</view>
							<view class="metric-row" v-if="item.anchorMetrics.month_gift_target">
								<text class="metric-label">礼物流水</text>
								<text class="metric-val">{{ fmtNum(item.anchorMetrics.month_gift_target) }}<text class="metric-unit">元</text></text>
							</view>
							<view class="metric-row" v-if="item.anchorMetrics.daily_big_spender_target">
								<text class="metric-label">每日大哥</text>
								<text class="metric-val">{{ item.anchorMetrics.daily_big_spender_target }}<text class="metric-unit">人</text></text>
							</view>
						</view>

						<!-- 底部操作 -->
						<view class="card-btn" :class="item.status !== 'progress' ? 'card-btn-done' : 'card-btn-action'">
							<svg v-if="item.status === 'progress'" class="s14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m7-7H5" />
							</svg>
							<svg v-else class="s14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								<path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
							</svg>
							<text>{{ item.status === 'progress' ? '提交考核' : '查看详情' }}</text>
						</view>
					</view>
				</view>
				<view class="spacer"></view>
			</template>

			<!-- ═══ 提交表单 ═══ -->
			<template v-if="showSubmit">
				<!-- 考核信息 -->
				<view class="card">
					<text class="card-title">考核信息</text>
					<text class="info-period">{{ currentAssess.period }}</text>
					<view class="anchor-metrics" v-if="currentAssess.anchorMetrics">
						<view class="metric-row" v-if="currentAssess.anchorMetrics.month_stream_days">
							<text class="metric-label">月度开播天数目标</text>
							<text class="metric-val">{{ currentAssess.anchorMetrics.month_stream_days }}天</text>
						</view>
						<view class="metric-row" v-if="currentAssess.anchorMetrics.daily_live_hours">
							<text class="metric-label">每日直播时长目标</text>
							<text class="metric-val">{{ currentAssess.anchorMetrics.daily_live_hours }}小时</text>
						</view>
						<view class="metric-row" v-if="currentAssess.anchorMetrics.month_gift_target">
							<text class="metric-label">月礼物流水目标</text>
							<text class="metric-val">{{ fmtNum(currentAssess.anchorMetrics.month_gift_target) }}元</text>
						</view>
						<view class="metric-row" v-if="currentAssess.anchorMetrics.daily_big_spender_target">
							<text class="metric-label">每日大哥数目标</text>
							<text class="metric-val">{{ currentAssess.anchorMetrics.daily_big_spender_target }}人</text>
						</view>
					</view>
				</view>

				<!-- 提交表单 -->
				<view class="card" v-if="currentAssess.status === 'progress'">
					<text class="card-title">考核提交</text>

					<!-- 直播天数 -->
					<view class="field">
						<text class="field-label">本月直播天数</text>
						<view class="count-row">
							<input class="count-input" type="digit" v-model="form.streamDays" placeholder="0" @blur="onNumInput('streamDays')" />
							<text class="count-unit">天</text>
						</view>
					</view>

					<!-- 直播时长 -->
					<view class="field">
						<text class="field-label">日均直播时长</text>
						<view class="count-row">
							<input class="count-input" type="digit" v-model="form.streamHours" placeholder="0" @blur="onNumInput('streamHours')" />
							<text class="count-unit">小时/天</text>
						</view>
					</view>

					<!-- 直播流水 -->
					<view class="field">
						<text class="field-label">月礼物流水</text>
						<view class="count-row">
							<input class="count-input" type="digit" v-model="form.streamRevenue" placeholder="0" @blur="onNumInput('streamRevenue')" />
							<text class="count-unit">元</text>
						</view>
					</view>

				<!-- 每日大哥数 -->
				<view class="field">
					<text class="field-label">每日添加大哥数</text>
					<view class="count-row">
						<input class="count-input" type="number" v-model="form.bigSpender" placeholder="0" />
						<text class="count-unit">人/天</text>
					</view>
				</view>

				<!-- 大哥联系方式 -->
				<view class="field">
					<text class="field-label">大哥联系方式（选填）</text>
					<view class="contact-row" v-for="(c, idx) in form.contacts" :key="idx">
						<picker mode="selector" :range="contactTypes" :value="c.typeIdx || 0" @change="onContactTypeChange($event, idx)">
							<view class="contact-type" :class="c.type ? 'contact-type-active' : 'contact-type-placeholder'">
								<text>{{ c.type || '类型' }}</text>
								<svg class="s12 gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
								</svg>
							</view>
						</picker>
						<input class="contact-input" v-model="c.value" placeholder="请输入微信号/QQ号" />
						<view class="contact-del" @tap="removeContact(idx)" v-if="form.contacts.length > 1">
							<svg class="s12" fill="none" stroke="#ef4444" viewBox="0 0 24 24" stroke-width="2">
								<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</view>
					</view>
					<view class="contact-add" @tap="addContact">
						<svg class="s14" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m7-7H5" />
						</svg>
						<text>继续添加联系方式</text>
					</view>
				</view>

				<!-- 推荐主播人数 -->
				<view class="field">
					<text class="field-label">推荐主播人数（选填）</text>
					<view class="count-row">
						<input class="count-input" type="number" v-model="form.referralCount" placeholder="0" />
						<text class="count-unit">人</text>
					</view>
				</view>

				<!-- 完成说明 -->
					<view class="field">
						<text class="field-label">完成说明</text>
						<textarea class="field-textarea" v-model="form.remark" placeholder="请描述本月考核完成情况..." :maxlength="500" />
						<text class="char-count">{{ form.remark.length }}/500</text>
					</view>

					<!-- 图片上传 -->
					<view class="field">
						<text class="field-label">直播天数截图</text>
						<view class="image-upload-wrap">
							<view class="image-add" v-if="streamDaysImages.length < 9" @tap="chooseImage('streamDays')">
								<svg class="s14 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m7-7H5" />
								</svg>
							</view>
							<view v-for="(img, i) in streamDaysImages" :key="'sd'+i" class="image-item">
								<image :src="img.preview" class="image-thumb" mode="aspectFill" />
								<view v-if="img.uploading" class="image-mask"><text class="image-progress-text">上传中</text></view>
								<view class="image-delete" @tap="removeImage('streamDaysImages', i)">
									<svg class="s12 white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
										<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
									</svg>
								</view>
							</view>
						</view>
					</view>

					<view class="field">
						<text class="field-label">直播时长截图</text>
						<view class="image-upload-wrap">
							<view class="image-add" v-if="streamHoursImages.length < 9" @tap="chooseImage('streamHours')">
								<svg class="s14 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m7-7H5" />
								</svg>
							</view>
							<view v-for="(img, i) in streamHoursImages" :key="'sh'+i" class="image-item">
								<image :src="img.preview" class="image-thumb" mode="aspectFill" />
								<view v-if="img.uploading" class="image-mask"><text class="image-progress-text">上传中</text></view>
								<view class="image-delete" @tap="removeImage('streamHoursImages', i)">
									<svg class="s12 white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
										<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
									</svg>
								</view>
							</view>
						</view>
					</view>

					<view class="field">
						<text class="field-label">直播流水截图</text>
						<view class="image-upload-wrap">
							<view class="image-add" v-if="streamRevenueImages.length < 9" @tap="chooseImage('streamRevenue')">
								<svg class="s14 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m7-7H5" />
								</svg>
							</view>
							<view v-for="(img, i) in streamRevenueImages" :key="'sr'+i" class="image-item">
								<image :src="img.preview" class="image-thumb" mode="aspectFill" />
								<view v-if="img.uploading" class="image-mask"><text class="image-progress-text">上传中</text></view>
								<view class="image-delete" @tap="removeImage('streamRevenueImages', i)">
									<svg class="s12 white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
										<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
									</svg>
								</view>
							</view>
						</view>
					</view>

					<!-- 提交按钮 -->
					<view class="submit-btn" :class="submitting ? 'submit-disabled' : ''" @tap="doSubmit">
						<text>{{ submitting ? '提交中...' : '提交考核' }}</text>
					</view>
					<text class="submit-tip">提交后将由总经进行审核</text>
				</view>

				<!-- 已提交状态 -->
				<view class="card" v-if="currentAssess.status !== 'progress'">
					<text class="card-title">考核状态</text>
					<view class="result-badge" :class="currentAssess.status === 'completed' ? 'result-pass' : 'result-progress'">
						{{ currentAssess.status === 'completed' ? '已完结' : '已提交，等待审核...' }}
					</view>
					<text class="info-text" style="margin-top:16rpx;">{{ currentAssess.userSummary || currentAssess.targetRemark || '考核已提交' }}</text>
				</view>

				<!-- 返回列表 -->
				<view class="back-btn-card" @tap="backToList">
					<svg class="s14" fill="none" stroke="#64748B" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg>
					<text>返回考核列表</text>
				</view>
				<view class="spacer"></view>
			</template>
		</view>

		<!-- Toast -->
		<view class="toast" :class="toastVisible ? 'toast-show' : ''">
			<text class="toast-text">{{ toastMsg }}</text>
		</view>
	</view>
</template>

<script>
	import { api, BASE_URL } from '@/utils/api.js'

	const statusConfig = {
		progress:  { label: '待提交', cls: 'tag-amber', dot: 'dot-amber' },
		pending:   { label: '审核中', cls: 'tag-blue', dot: 'dot-blue' },
		completed: { label: '已完结', cls: 'tag-slate', dot: 'dot-slate' },
	}

	export default {
		data() {
			return {
				showSubmit: false,
				loading: true,
				assessList: [],
				currentAssess: {},
				targetPublishId: null,
				form: {
					streamDays: '',
					streamHours: '',
					streamRevenue: '',
					bigSpender: 0,
					remark: '',
					contacts: [{ type: '', typeIdx: 0, value: '' }],
					referralCount: '',
				},
				contactTypes: ['微信', 'QQ'],
				streamDaysImages: [],
				streamHoursImages: [],
				streamRevenueImages: [],
				submitting: false,
				toastVisible: false,
				toastMsg: '',
			}
		},
		onLoad(options) {
			// 支持从其他页面传入 publish_id 直接定位考核
			this.targetPublishId = options.publish_id ? parseInt(options.publish_id) : null
		},
		onShow() {
			this.$checkAuth()
			this.fetchAssessList()
		},
		methods: {
			statusCfg(s) { return statusConfig[s] || statusConfig.progress },
			fmtNum(n) { return parseFloat(n || 0).toLocaleString('zh-CN') },

			goBack() {
				const pages = getCurrentPages()
				if (pages.length > 1) {
					uni.navigateBack({ delta: 1 })
				} else {
					// 直接登录进入此页，无返回栈，跳转登录页
					uni.reLaunch({ url: '/pages/login/login' })
				}
			},

		async fetchAssessList() {
			this.loading = true
			try {
				const res = await api.get('/api/admin/assessments', null, { silent: true })
				if (res.data && res.data.list) {
					this.assessList = res.data.list.map(it => ({
						id: it.id,
						period: it.period || it.assess_cycle || '',
						targetRemark: it.target_remark || '',
						status: it.status || 'progress',
						userSummary: it.user_summary || '',
						anchorMetrics: it.metrics || null,
					}))
				}
			} catch (e) {
				console.error('[anchor-assess-submit]', e)
			}
			this.loading = false
			// 如果有传入 publish_id，自动进入对应考核
			if (this.targetPublishId) {
				const target = this.assessList.find(a => a.id === this.targetPublishId)
				if (target) {
					this.enterSubmit(target)
				}
				this.targetPublishId = null
			}
		},

		enterSubmit(item) {
			this.currentAssess = item
			// 先重置表单，再尝试加载已有数据
			this.form = { streamDays: '', streamHours: '', streamRevenue: '', bigSpender: 0, remark: '', contacts: [{ type: '', typeIdx: 0, value: '' }], referralCount: '' }
			this.streamDaysImages = []
			this.streamHoursImages = []
			this.streamRevenueImages = []
			this.showSubmit = true
			// 加载已上传的图片和已填写的数据
			this.loadExistingData(item.id)
		},

		async loadExistingData(publishId) {
			try {
				const res = await api.get('/api/admin/staff/assessment-detail', { publish_id: publishId }, { silent: true })
				if (!res.data) return
				const d = res.data
				// 回填已提交的表单数据
				if (d.anchor_submit) {
					const s = d.anchor_submit
					this.form.streamDays = s.stream_days || ''
					this.form.streamHours = s.stream_hours || ''
					this.form.streamRevenue = s.stream_revenue || ''
					this.form.bigSpender = s.big_spender_count || 0
					this.form.referralCount = s.referral_count || ''
				}
				if (d.user_summary) {
					this.form.remark = d.user_summary
				}
				// 回填已上传的图片
				if (d.submit_images) {
					const typeMap = { stream_days: 'streamDaysImages', stream_hours: 'streamHoursImages', stream_revenue: 'streamRevenueImages' }
					Object.keys(typeMap).forEach(key => {
						const imgList = d.submit_images[key]
						if (imgList && imgList.length > 0) {
							this[typeMap[key]] = imgList.map(img => ({
								preview: BASE_URL + '/' + img.path,
								uploading: false,
								path: img.path,
							}))
						}
					})
				}
				// 回填已保存的联系方式
				if (d.submit_resources && d.submit_resources.length > 0) {
					this.form.contacts = d.submit_resources.map(r => {
						const typeIdx = this.contactTypes.indexOf(r.platform || r.type)
						return {
							type: r.platform || r.type || '',
							typeIdx: typeIdx >= 0 ? typeIdx : 0,
							value: r.contact || r.value || '',
						}
					})
				}
			} catch (e) {
				console.error('[anchor-assess-submit] loadExistingData', e)
			}
		},

			addContact() {
				this.form.contacts.push({ type: '', typeIdx: 0, value: '' })
			},
			removeContact(idx) {
				this.form.contacts.splice(idx, 1)
			},
			onContactTypeChange(e, idx) {
				const i = e.detail.value
				this.form.contacts[idx].typeIdx = i
				this.form.contacts[idx].type = this.contactTypes[i]
			},

			backToList() {
				this.showSubmit = false
				this.fetchAssessList()
			},

			onNumInput(field) {
				let v = parseFloat(this.form[field]) || 0
				if (v < 0) v = 0
				this.form[field] = field === 'bigSpender' ? Math.floor(v) : v
			},

			/* ── 图片上传 ── */
			chooseImage(type) {
				const map = { streamDays: 'streamDaysImages', streamHours: 'streamHoursImages', streamRevenue: 'streamRevenueImages' }
				const listKey = map[type]
				const imageTypeMap = { streamDays: 'stream_days', streamHours: 'stream_hours', streamRevenue: 'stream_revenue' }
				const imageType = imageTypeMap[type]

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
							this.uploadImage(filepath, idx, listKey, imageType)
						})
					}
				})
			},

			uploadImage(filepath, idx, listKey, type) {
				const token = uni.getStorageSync('api_token')
				uni.uploadFile({
					url: BASE_URL + '/api/admin/staff/upload-assess-image',
					filePath: filepath,
					name: 'file',
					formData: {
						publish_id: (this.currentAssess.id || 0).toString(),
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
						}
					},
					fail: () => {
						this[listKey].splice(idx, 1)
						uni.showToast({ title: '上传失败', icon: 'none' })
					}
				})
			},

			removeImage(listKey, idx) {
				this[listKey].splice(idx, 1)
			},

			/* ── 提交考核 ── */
			async doSubmit() {
				if (this.submitting) return
				// 检查是否还有图片在上传
				const allImages = [...this.streamDaysImages, ...this.streamHoursImages, ...this.streamRevenueImages]
				if (allImages.some(img => img.uploading)) {
					this.showToast('图片正在上传中，请稍候')
					return
				}
				if (!this.form.remark.trim()) {
					this.showToast('请填写完成说明')
					return
				}
				this.submitting = true
				try {
					// 资源数据映射：前端{type,value} → 后端{platform,contact}
					const resources = this.form.contacts
						.filter(c => c.value.trim())
						.map(c => ({ platform: c.type || '', nickname: '', contact: c.value.trim() }))
					await api.post('/api/admin/staff/save-progress', {
						publish_id: this.currentAssess.id,
						progress: 0,
						remark: this.form.remark,
						stream_days: parseFloat(this.form.streamDays) || 0,
						stream_hours: parseFloat(this.form.streamHours) || 0,
						stream_revenue: parseFloat(this.form.streamRevenue) || 0,
						big_spender_count: parseInt(this.form.bigSpender) || 0,
						resources: resources,
						referral_count: parseInt(this.form.referralCount) || 0,
					})
					this.showToast('考核提交成功')
					this.submitting = false
					this.backToList()
				} catch (e) {
					this.submitting = false
				}
			},

			showToast(msg) {
				this.toastMsg = msg
				this.toastVisible = true
				setTimeout(() => { this.toastVisible = false }, 2500)
			},
		}
	}
</script>

<style>
	.pg {
		width: 100%; min-height: 100vh; background: #F8FAFC;
		font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased;
	}
	.s12 { width: 24rpx; height: 24rpx; flex-shrink: 0 }
	.s14 { width: 28rpx; height: 28rpx; flex-shrink: 0 }
	.s16 { width: 32rpx; height: 32rpx; flex-shrink: 0 }
	.s18 { width: 36rpx; height: 36rpx; flex-shrink: 0 }
	.s48 { width: 96rpx; height: 96rpx; flex-shrink: 0 }
	.gray-400 { color: #9ca3af }
	.white { color: #fff }

	/* Header */
	.hdr {
		position: sticky; top: 0; z-index: 50;
		background: rgba(255,255,255,0.92); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
		border-bottom: 1rpx solid rgba(0,0,0,0.08);
	}
	.hdr-inner {
		display: flex; align-items: center; justify-content: space-between;
		height: 112rpx; padding: 0 32rpx; padding-top: 48rpx;
	}
	.hdr-btn {
		width: 48rpx; height: 48rpx; display: flex; align-items: center; justify-content: center;
		border-radius: 20rpx;
	}
	.hdr-btn:active { background: #f9fafb }
	.hdr-btn-placeholder { width: 48rpx }
	.hdr-title { font-size: 32rpx; font-weight: 600; color: #0F172A; letter-spacing: -0.02em }

	/* Main */
	.main { padding: 32rpx }
	.spacer { height: 80rpx }

	/* Card */
	.card {
		background: #fff; border-radius: 24rpx; padding: 36rpx;
		margin-bottom: 24rpx; box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.04);
	}
	.card:active { transform: scale(0.985) }
	.card-title { font-size: 22rpx; font-weight: 600; color: #94A3B8; letter-spacing: 0.08em; display: block; margin-bottom: 24rpx }

	/* List Card */
	.card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16rpx }
	.card-top-l { flex: 1; min-width: 0; margin-right: 16rpx }
	.card-name { font-size: 28rpx; font-weight: 700; color: #1e293b; display: block }

	/* Status Tag */
	.status-tag { display: flex; align-items: center; gap: 8rpx; padding: 8rpx 20rpx; border-radius: 9999rpx; font-size: 20rpx; font-weight: 600; flex-shrink: 0 }
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

	.target-tag { font-size: 20rpx; font-weight: 500; color: #64748b; background: #f8fafc; padding: 6rpx 14rpx; border-radius: 8rpx; display: inline-block; margin-bottom: 16rpx }

	/* Anchor Metrics */
	.anchor-metrics {
		padding: 20rpx 24rpx;
		background: linear-gradient(135deg, #fefce8, #fef9c3);
		border-radius: 16rpx;
		border: 1rpx solid #fde047;
		margin-bottom: 20rpx;
	}
	.metric-row { display: flex; justify-content: space-between; align-items: center; padding: 10rpx 0 }
	.metric-row+.metric-row { border-top: 1rpx solid rgba(250,204,21,0.3) }
	.metric-label { font-size: 22rpx; color: #854d0e; font-weight: 500 }
	.metric-val { font-size: 24rpx; font-weight: 700; color: #713f12 }
	.metric-unit { font-size: 20rpx; font-weight: 500; color: #a16207; margin-left: 4rpx }

	/* Card Button */
	.card-btn { display: flex; align-items: center; justify-content: center; gap: 8rpx; padding: 20rpx 0; border-radius: 20rpx; font-size: 22rpx; font-weight: 600; transition: background 0.15s }
	.card-btn-action { background: #eff6ff; color: #2563eb }
	.card-btn-action:active { background: #dbeafe }
	.card-btn-done { background: #f8fafc; color: #64748b }

	/* Empty */
	.empty-state { display: flex; flex-direction: column; align-items: center; padding: 160rpx 0 }
	.empty-icon { margin-bottom: 24rpx }
	.empty-text { font-size: 26rpx; color: #94A3B8; display: block }
	.empty-hint { font-size: 22rpx; color: #CBD5E1; margin-top: 8rpx }

	/* Form */
	.info-period { font-size: 28rpx; font-weight: 700; color: #1e293b; display: block; margin-bottom: 16rpx }
	.field { margin-bottom: 28rpx }
	.field-label { font-size: 24rpx; font-weight: 600; color: #334155; display: block; margin-bottom: 16rpx }
	.field-textarea {
		width: 100%; font-size: 26rpx; color: #334155; background: #F9FAFB;
		border-radius: 16rpx; padding: 20rpx 24rpx; border: 1rpx solid #E2E8F0;
		height: 144rpx; box-sizing: border-box;
	}
	.char-count { font-size: 22rpx; color: #94A3B8; text-align: right; display: block; margin-top: 8rpx }

	.count-row { display: flex; align-items: center; gap: 16rpx }
	.count-input {
		width: 160rpx; height: 64rpx; text-align: center;
		font-size: 28rpx; font-weight: 700; color: #0F172A;
		background: #F9FAFB; border-radius: 12rpx; border: 1rpx solid #E2E8F0;
	}
	.count-unit { font-size: 22rpx; color: #94A3B8 }

	/* Image Upload */
	.image-upload-wrap { display: flex; flex-wrap: wrap; gap: 16rpx }
	.image-add {
		width: 160rpx; height: 160rpx; border-radius: 16rpx;
		border: 2rpx dashed #d1d5db; background: #f9fafb;
		display: flex; align-items: center; justify-content: center;
	}
	.image-item { width: 160rpx; height: 160rpx; border-radius: 16rpx; overflow: hidden; position: relative; background: #f1f5f9 }
	.image-thumb { width: 100%; height: 100% }
	.image-mask { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center }
	.image-progress-text { font-size: 20rpx; color: #fff; font-weight: 500 }
	.image-delete {
		position: absolute; top: 6rpx; right: 6rpx;
		width: 40rpx; height: 40rpx; border-radius: 50%;
		background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1
	}

	/* Submit */
	.submit-btn { width: 100%; height: 100rpx; background: #6370f0; border-radius: 24rpx; display: flex; align-items: center; justify-content: center; font-size: 30rpx; font-weight: 600; color: #fff; box-shadow: 0 8rpx 24rpx rgba(99,112,240,0.25) }
	.submit-btn:active { transform: scale(0.97) }
	.submit-disabled { opacity: 0.6; pointer-events: none }
	.submit-tip { display: block; margin-top: 16rpx; font-size: 24rpx; color: #94a3b8; text-align: center }

	/* Result Badge */
	.result-badge { text-align: center; padding: 20rpx 24rpx; border-radius: 16rpx; font-size: 26rpx; font-weight: 600 }
	.result-pass { background: #ecfdf5; color: #059669 }
	.result-fail { background: #fff1f2; color: #e11d48 }
	.result-progress { background: #eff6ff; color: #2563eb }
	.info-text { font-size: 24rpx; color: #64748b; line-height: 1.6 }

	/* Back button */
	.back-btn-card { display: flex; align-items: center; justify-content: center; gap: 8rpx; padding: 28rpx 0; font-size: 24rpx; color: #64748B; font-weight: 500 }
	.back-btn-card:active { opacity: 0.7 }

	/* Toast */
	.toast { position: fixed; top: 160rpx; left: 50%; transform: translateX(-50%); z-index: 200; background: rgba(31,41,55,0.92); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); padding: 18rpx 40rpx; border-radius: 9999rpx; pointer-events: none; opacity: 0; transition: opacity 0.2s ease }
	.toast-show { opacity: 1 }
	.toast-text { color: #fff; font-size: 22rpx; font-weight: 500 }

	/* Contact row */
	.contact-row { display: flex; align-items: center; gap: 12rpx; margin-bottom: 16rpx }
	.contact-type {
		display: flex; align-items: center; justify-content: space-between;
		width: 160rpx; height: 64rpx; padding: 0 16rpx;
		font-size: 24rpx; border-radius: 12rpx; border: 1rpx solid #E2E8F0;
		background: #F9FAFB; box-sizing: border-box;
	}
	.contact-type-active { color: #374151; font-weight: 600 }
	.contact-type-placeholder { color: #94A3B8 }
	.contact-input {
		flex: 1; height: 64rpx; min-width: 0;
		font-size: 24rpx; color: #334155;
		background: #F9FAFB; border-radius: 12rpx;
		border: 1rpx solid #E2E8F0; padding: 0 16rpx;
	}
	.contact-del { width: 48rpx; height: 48rpx; display: flex; align-items: center; justify-content: center; flex-shrink: 0 }
	.contact-add {
		display: flex; align-items: center; justify-content: center; gap: 8rpx;
		padding: 18rpx 0; border-radius: 14rpx;
		border: 2rpx dashed #d1d5db; color: #94A3B8; font-size: 24rpx;
		margin-top: 8rpx;
	}
	.contact-add:active { background: #F9FAFB }
</style>
