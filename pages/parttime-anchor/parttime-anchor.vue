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
				<text class="hdr-title">兼职主播管理</text>
				<view class="hdr-btn" @tap="showToast('兼职主播列表')">
					<!-- <svg class="s18 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
					</svg> -->
				</view>
			</view>
		</view>

		<!-- Main -->
		<view class="main">

			<!-- ═══ Stats Card ═══ -->
			<view class="stats-card card-shadow anim-1">
				<view class="stats-deco"></view>
				<view class="stats-body">
					<text class="stats-label">兼职主播总人数</text>
					<view class="stats-num-row">
						<text class="stats-big">{{ stats.totalCount }}</text>
						<text class="stats-unit">人</text>
					</view>

					<view class="stats-grid">
						<view class="stat-box" @tap="onStatusFilter(1)">
							<view class="stat-dot-row">
								<view class="dot dot-green"></view>
								<text class="stat-sub-label">在岗中</text>
							</view>
							<text class="stat-val">{{ stats.activeCount }}<text class="stat-val-unit">人</text></text>
						</view>
						<view class="stat-box" @tap="onStatusFilter(2)">
							<view class="stat-dot-row">
								<view class="dot dot-yellow"></view>
								<text class="stat-sub-label">待入职</text>
							</view>
							<text class="stat-val">{{ stats.pendingCount }}<text class="stat-val-unit">人</text></text>
						</view>
						<view class="stat-box" @tap="onStatusFilter(3)">
							<view class="stat-dot-row">
								<view class="dot dot-blue"></view>
								<text class="stat-sub-label">流转中</text>
							</view>
							<text class="stat-val">{{ stats.flowCount }}<text class="stat-val-unit">人</text></text>
						</view>
						<view class="stat-box" @tap="onStatusFilter(4)">
							<view class="stat-dot-row">
								<view class="dot dot-purple"></view>
								<text class="stat-sub-label">已调岗</text>
							</view>
							<text class="stat-val">{{ stats.transferCount }}<text class="stat-val-unit">人</text></text>
						</view>
					</view>
				</view>
			</view>

			<!-- ═══ Quick Actions ═══ -->
			<view class="section anim-2">
				<text class="section-title">快捷操作</text>

				<view class="btn-primary ripple" @tap="openAddModal">
					<svg class="s20 white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
					</svg>
					<text>新增兼职主播</text>
				</view>

				<view class="btn-outline" @tap="goToStatusManage" v-if="isDirector">
					<svg class="s20 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
					</svg>
					<text>状态管理</text>
				</view>

				<view class="btn-outline" @tap="openTransferModal">
					<svg class="s20 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
					</svg>
					<text>转全职申请</text>
				</view>
			</view>

			<!-- ═══ Recruit Status ═══ -->
			<view class="section anim-3">
				<text class="section-title">招募状态</text>
				<view class="status-list">
					<!-- 招募待录入 -->
					<view class="status-card" @tap="onRecruitFilter(1)">
						<view class="status-card-l">
							<view class="icon-box icon-warn">
								<svg class="s20 warning" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
							</view>
							<view>
								<text class="sc-title">招募待录入</text>
								<text class="sc-desc">需尽快完成信息录入</text>
							</view>
						</view>
						<view class="badge badge-warn">{{ stats.recruitPendingCount }}</view>
					</view>

					<!-- 已入库 -->
					<view class="status-card" @tap="onRecruitFilter(2)">
						<view class="status-card-l">
							<view class="icon-box icon-ok">
								<svg class="s20 success" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</view>
							<view>
								<text class="sc-title">已入库</text>
								<text class="sc-desc">信息完整，可正常调配</text>
							</view>
						</view>
						<view class="badge badge-ok">{{ stats.recruitInCount }}</view>
					</view>

					<!-- 招募失效 -->
					<view class="status-card" @tap="onRecruitFilter(3)">
						<view class="status-card-l">
							<view class="icon-box icon-gray">
								<svg class="s20 neutral" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</view>
							<view>
								<text class="sc-title">招募失效</text>
								<text class="sc-desc">超期未处理或主动放弃</text>
							</view>
						</view>
						<view class="badge badge-gray">{{ stats.recruitInvalidCount }}</view>
					</view>
				</view>
			</view>

			<!-- ═══ Anchor List ═══ -->
			<view class="section anim-3" v-if="filterLabel">
				<view class="list-header">
					<text class="lh-title">{{ filterLabel }}</text>
					<text class="lh-count" @tap="clearFilter" v-if="filterActive">清除筛选</text>
				</view>

				<view v-if="listLoading" class="list-empty">
					<text class="le-text">加载中...</text>
				</view>

				<view v-else-if="anchorList.length === 0" class="list-empty">
					<text class="le-text">暂无数据</text>
				</view>

				<view v-for="(a, i) in anchorList" :key="i" class="anchor-card card-shadow">
					<view class="ac-body">
						<view class="ac-avatar-box" v-if="a.photo">
							<image class="ac-avatar" :src="photoUrl(a.photo)" mode="aspectFill" />
						</view>
						<view class="ac-avatar-box ac-avatar-empty" v-else>
							<text class="ac-avatar-txt">{{ (a.real_name || a.nickname || '?').charAt(0) }}</text>
						</view>
						<view class="ac-left">
							<view class="ac-name-row">
								<text class="ac-name">{{ a.real_name || a.nickname }}</text>
								<view class="ac-tag" :class="statusTagCls(a.status)">{{ statusLabel(a.status) }}</view>
								<view class="ac-tag ac-tag-recruit" v-if="a.recruit_status">{{ recruitLabel(a.recruit_status) }}</view>
							</view>
							<view class="ac-info">
								<text class="ac-info-text" v-if="a.nickname">昵称: {{ a.nickname }}</text>
								<text class="ac-info-text">ID: {{ a.anchor_id || '-' }}</text>
								<text class="ac-info-text">手机: {{ a.phone }}</text>
							</view>
							<text class="ac-time">添加时间: {{ fmtDate(a.create_time) }}</text>
						</view>
						<view class="ac-actions" v-if="isDirector && (a.status === 1 || a.status === 2)">
							<view class="ac-btn ac-btn-sm" @tap="openEditModal(a)">编辑</view>
							<view class="ac-btn ac-btn-sm ac-btn-danger" @tap="confirmDelete(a)">删除</view>
						</view>
					</view>
				</view>
			</view>

			<view class="spacer"></view>
		</view>

		<!-- ═══ Add/Edit Modal ═══ -->
		<view v-if="showAddModal" class="modal-mask" @tap="closeAddModal">
			<view class="modal-sheet" @tap.stop>
				<view class="drag-handle"></view>
				<view class="modal-header">
					<text class="modal-title">{{ editAnchor ? '编辑兼职主播' : '新增兼职主播' }}</text>
					<view class="modal-close" @tap="closeAddModal">
						<svg class="s16 gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</view>
				</view>
				<view class="modal-form">
					<!-- 照片选择 -->
					<view class="form-field">
						<text class="ff-label">主播照片</text>
						<view class="photo-picker" @tap="choosePhoto">
							<image v-if="formPhotoPreview" class="photo-preview" :src="formPhotoPreview" mode="aspectFill" />
							<view v-else class="photo-placeholder">
								<svg class="s24 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<text class="photo-tip">点击上传照片</text>
							</view>
						</view>
						<view v-if="formPhotoPreview" class="photo-remove" @tap="removePhoto">移除照片</view>
					</view>
					<view class="form-field">
						<text class="ff-label">主播ID</text>
						<input class="ff-input" type="text" v-model="form.anchor_id" placeholder="请输入主播ID" placeholder-class="input-placeholder" />
					</view>
					<view class="form-field">
						<text class="ff-label">主播昵称</text>
						<input class="ff-input" type="text" v-model="form.nickname" placeholder="请输入主播昵称" placeholder-class="input-placeholder" />
					</view>
					<view class="form-field">
						<text class="ff-label">主播真实姓名</text>
						<input class="ff-input" type="text" v-model="form.real_name" placeholder="请输入真实姓名" placeholder-class="input-placeholder" />
					</view>
					<view class="form-field">
						<text class="ff-label">主播手机号</text>
						<input class="ff-input" type="tel" v-model="form.phone" placeholder="请输入手机号" placeholder-class="input-placeholder" />
					</view>
					<!-- 流水图片 -->
					<view class="form-field">
						<text class="ff-label">流水图片</text>
						<view class="photo-picker" @tap="chooseFlowPhoto">
							<image v-if="flowPhotoPreview" class="photo-preview" :src="flowPhotoPreview" mode="aspectFill" />
							<view v-else class="photo-placeholder">
								<svg class="s24 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<text class="photo-tip">点击上传流水截图</text>
							</view>
						</view>
						<view v-if="flowPhotoPreview" class="photo-remove" @tap="removeFlowPhoto">移除图片</view>
					</view>
				</view>
				<view class="modal-submit" @tap="handleAddSubmit">
					<text>{{ editAnchor ? '保存修改' : '确认添加' }}</text>
				</view>
			</view>
		</view>

		<!-- ═══ Transfer Modal ═══ -->
		<view v-if="showTransferModal" class="modal-mask" @tap="closeTransferModal">
			<view class="modal-sheet" @tap.stop>
				<view class="drag-handle"></view>
				<view class="modal-header">
					<text class="modal-title">转全职申请</text>
					<view class="modal-close" @tap="closeTransferModal">
						<svg class="s16 gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</view>
				</view>
				<view class="modal-form">
					<view class="form-field">
						<text class="ff-label">选择主播</text>
						<picker :range="transferAnchorOptions" range-key="label" :value="transferAnchorIndex" @change="onTransferAnchorChange">
							<view class="ff-picker">
								<text :class="transferAnchorIndex>=0?'fi-text':'fi-placeholder'">{{ transferAnchorIndex>=0 ? transferAnchorOptions[transferAnchorIndex].label : '请选择主播' }}</text>
								<svg class="s16 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
								</svg>
							</view>
						</picker>
					</view>
					<view class="form-field">
						<text class="ff-label">目标部门</text>
						<view class="ff-picker">
							<text class="fi-text">中转部</text>
						</view>
					</view>
					<view class="form-warn">
						<svg class="s16 warning" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<text class="warn-text-sm">主播将转入中转部审核，状态变更为"流转中"。审核通过后成为运营部正式员工；驳回则恢复在岗</text>
					</view>
				</view>
				<view class="modal-submit" @tap="handleTransferSubmit">
					<text>确认转全职</text>
				</view>
			</view>
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
	const RECRUIT_MAP = { 1: '招募待录入', 2: '已入库', 3: '招募失效' }

	function fmtDate(dt) {
		if (!dt) return ''
		return dt.slice(0, 10).replace(/-/g, '.')
	}

	export default {
		computed: {
			isDirector() { return auth.state.role === ROLES.DIRECTOR },
		},
		data() {
			return {
				/* Stats */
				stats: {
					totalCount: 0,
					activeCount: 0,
					pendingCount: 0,
					flowCount: 0,
					transferCount: 0,
					recruitPendingCount: 0,
					recruitInCount: 0,
					recruitInvalidCount: 0,
				},
				/* List */
				anchorList: [],
				listLoading: false,
				filterStatus: null,
				filterRecruit: null,
				filterLabel: '',
				filterActive: false,
				allAnchors: [], // for transfer picker
				/* Add/Edit form */
				showAddModal: false,
				editAnchor: null,
				form: { anchor_id: '', nickname: '', real_name: '', phone: '', photo: '', flow_photo: '' },
				formPhotoPreview: '',
				flowPhotoPreview: '',
				/* Transfer modal */
				showTransferModal: false,
				transferAnchorOptions: [],
				transferAnchorIndex: -1,
				/* Toast */
				toastVisible: false,
				toastMsg: '',
			}
		},
		onShow() {
			this.$checkAuth()
			this.fetchStats()
			// 默认加载在岗中和已入库的列表
			if (!this.filterActive) {
				this.filterStatus = 1
				this.filterLabel = '在岗中'
				this.fetchList()
			}
		},
		methods: {
			/* ═══ API calls ═══ */
			async fetchStats() {
				try {
					const res = await api.get('/api/admin/parttime-anchor/stats')
					if (res.data) {
						Object.assign(this.stats, res.data)
					}
				} catch (e) { console.error('[兼职主播] stats:', e) }
			},

			async fetchList() {
				this.listLoading = true
				try {
					const params = { per_page: 100 }
					if (this.filterStatus) params.status = this.filterStatus
					if (this.filterRecruit) params.recruit_status = this.filterRecruit
					const res = await api.get('/api/admin/parttime-anchor/list', params)
					this.anchorList = (res.data && res.data.list) || []
				} catch (e) {
					console.error('[兼职主播] list:', e)
				} finally {
					this.listLoading = false
				}
			},

			async fetchAllAnchors() {
				try {
					const res = await api.get('/api/admin/parttime-anchor/list', { per_page: 200, status: '' })
					this.allAnchors = (res.data && res.data.list) || []
				} catch (e) { console.error('[兼职主播] all:', e) }
			},

			/* ═══ Filters ═══ */
			onStatusFilter(status) {
				this.filterStatus = status
				this.filterRecruit = null
				this.filterActive = true
				this.filterLabel = STATUS_MAP[status] || '全部'
				this.fetchList()
			},

			onRecruitFilter(recruit) {
				this.filterRecruit = recruit
				this.filterStatus = null
				this.filterActive = true
				this.filterLabel = RECRUIT_MAP[recruit] || '全部'
				this.fetchList()
			},

			clearFilter() {
				this.filterStatus = 1
				this.filterRecruit = null
				this.filterActive = false
				this.filterLabel = '在岗中'
				this.fetchList()
			},

			/* ═══ Helpers ═══ */
			statusLabel(s) { return STATUS_MAP[s] || '未知' },
			statusTagCls(s) {
				if (s === 1) return 'tag-green'
				if (s === 2) return 'tag-yellow'
				if (s === 3) return 'tag-blue'
				if (s === 4) return 'tag-purple'
				return 'tag-gray'
			},
			recruitLabel(s) { return RECRUIT_MAP[s] || '' },
			photoUrl(url) {
				if (!url) return ''
				if (url.startsWith('http') || url.startsWith('data:')) return url
				return BASE_URL + url
			},
			fmtDate,

			/* ═══ Add/Edit ═══ */
			openAddModal() {
				this.editAnchor = null
				this.form = { anchor_id: '', nickname: '', real_name: '', phone: '', photo: '', flow_photo: '' }
				this.formPhotoPreview = ''
				this.flowPhotoPreview = ''
				this.showAddModal = true
			},
			openEditModal(a) {
				this.editAnchor = a
				this.form = {
					anchor_id: a.anchor_id || '',
					nickname: a.nickname || '',
					real_name: a.real_name || '',
					phone: a.phone || '',
					photo: '',
					flow_photo: '',
				}
				this.formPhotoPreview = a.photo || ''
				this.flowPhotoPreview = a.flow_photo || ''
				this.showAddModal = true
			},
			closeAddModal() { this.showAddModal = false },

			choosePhoto() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						// #ifdef H5
						// H5 平台 blob URL → fetch blob → FileReader 转 base64
						const blobUrl = res.tempFilePaths[0]
						fetch(blobUrl)
							.then(r => r.blob())
							.then(blob => {
								const reader = new FileReader()
								reader.onload = (e) => {
									this.form.photo = e.target.result
									this.formPhotoPreview = this.form.photo
								}
								reader.readAsDataURL(blob)
							})
							.catch(() => this.showToast('照片读取失败'))
						// #endif

						// #ifndef H5
						// 小程序使用 getFileSystemManager
						const tempPath = res.tempFilePaths[0]
						const fs = uni.getFileSystemManager()
						fs.readFile({
							filePath: tempPath,
							encoding: 'base64',
							success: (readRes) => {
								const ext = tempPath.split('.').pop().toLowerCase()
								const mimeMap = { jpg: 'jpeg', jpeg: 'jpeg', png: 'png', gif: 'gif', webp: 'webp' }
								const mime = mimeMap[ext] || 'jpeg'
								this.form.photo = 'data:image/' + mime + ';base64,' + readRes.data
								this.formPhotoPreview = this.form.photo
							},
							fail: () => this.showToast('照片读取失败'),
						})
						// #endif
					},
				})
			},

			removePhoto() {
				this.form.photo = '__DELETE__'
				this.formPhotoPreview = ''
			},

			chooseFlowPhoto() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						// #ifdef H5
						const blobUrl = res.tempFilePaths[0]
						fetch(blobUrl)
							.then(r => r.blob())
							.then(blob => {
								const reader = new FileReader()
								reader.onload = (e) => {
									this.form.flow_photo = e.target.result
									this.flowPhotoPreview = this.form.flow_photo
								}
								reader.readAsDataURL(blob)
							})
							.catch(() => this.showToast('图片读取失败'))
						// #endif
						// #ifndef H5
						const tempPath = res.tempFilePaths[0]
						const fs = uni.getFileSystemManager()
						fs.readFile({
							filePath: tempPath,
							encoding: 'base64',
							success: (readRes) => {
								const ext = tempPath.split('.').pop().toLowerCase()
								const mimeMap = { jpg: 'jpeg', jpeg: 'jpeg', png: 'png', gif: 'gif', webp: 'webp' }
								const mime = mimeMap[ext] || 'jpeg'
								this.form.flow_photo = 'data:image/' + mime + ';base64,' + readRes.data
								this.flowPhotoPreview = this.form.flow_photo
							},
							fail: () => this.showToast('图片读取失败'),
						})
						// #endif
					},
				})
			},

			removeFlowPhoto() {
				this.form.flow_photo = '__DELETE__'
				this.flowPhotoPreview = ''
			},

			async handleAddSubmit() {
				if (!this.form.phone) return this.showToast('请填写手机号')
				if (!this.form.real_name && !this.form.nickname) return this.showToast('请填写昵称或姓名')

				// 构建提交数据：编辑模式下不传空photo/flow_photo（保留原图）
				const data = { ...this.form }
				if (this.editAnchor) {
					if (data.photo === '') {
						delete data.photo
					} else if (data.photo === '__DELETE__') {
						data.photo = ''
					}
					if (data.flow_photo === '') {
						delete data.flow_photo
					} else if (data.flow_photo === '__DELETE__') {
						data.flow_photo = ''
					}
				}

				try {
					if (this.editAnchor) {
						await api.put('/api/admin/parttime-anchor/' + this.editAnchor.id, data)
						this.showToast('修改成功')
					} else {
						await api.post('/api/admin/parttime-anchor', data)
						this.showToast('添加成功')
					}
					this.closeAddModal()
					this.fetchStats()
					this.fetchList()
				} catch (e) { /* api.js 已弹 toast */ }
			},

			confirmDelete(a) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除 ' + (a.real_name || a.nickname) + ' 吗？',
					success: async (res) => {
						if (!res.confirm) return
						try {
							await api.delete('/api/admin/parttime-anchor/' + a.id)
							this.showToast('已删除')
							this.fetchStats()
							this.fetchList()
						} catch (e) { /* api.js 已弹 toast */ }
					},
				})
			},

			/* ═══ Status Management ═══ */
			goToStatusManage() {
				uni.navigateTo({ url: '/pages/parttime-status/parttime-status' })
			},

			/* ═══ Transfer ═══ */
			async openTransferModal() {
				await this.fetchAllAnchors()
				this.transferAnchorOptions = this.allAnchors
					.filter(a => a.status === 1) // 只允许在岗的主播转全职
					.map(a => ({
						label: (a.real_name || a.nickname) + ' (' + (a.phone || '-') + ')',
						value: a.id,
					}))
				if (this.transferAnchorOptions.length === 0) {
					this.showToast('没有可转全职的主播')
					return
				}
				this.transferAnchorIndex = -1
				this.showTransferModal = true
			},
			closeTransferModal() { this.showTransferModal = false },
			onTransferAnchorChange(e) { this.transferAnchorIndex = parseInt(e.detail.value) },

			async handleTransferSubmit() {
				if (this.transferAnchorIndex < 0) return this.showToast('请选择主播')
				const aid = this.transferAnchorOptions[this.transferAnchorIndex].value
				try {
					await api.put('/api/admin/parttime-anchor/' + aid + '/transfer-fulltime')
					this.showToast('转全职申请已提交')
					this.closeTransferModal()
					this.fetchStats()
					this.fetchList()
				} catch (e) { /* api.js 已弹 toast */ }
			},

			/* ═══ Navigation ═══ */
			goBack() { uni.navigateTo({ url: auth.getHomePage() }) },

			/* ═══ Toast ═══ */
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
	/* Base */
	.pg { width: 100%; min-height: 100vh; background: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Noto Sans SC', 'PingFang SC', sans-serif; -webkit-font-smoothing: antialiased }
	.s16 { width: 32rpx; height: 32rpx; flex-shrink: 0 }
	.s18 { width: 36rpx; height: 36rpx; flex-shrink: 0 }
	.s20 { width: 40rpx; height: 40rpx; flex-shrink: 0 }
	.s24 { width: 48rpx; height: 48rpx; flex-shrink: 0 }
	.white { color: #fff }
	.text-secondary { color: #475569 }
	.warning { color: #D97706 }
	.success { color: #059669 }
	.neutral { color: #6B7280 }
	.gray-400 { color: #ADB5BD }
	.gray-500 { color: #868E96 }

	/* Anim */
	@keyframes slideUp {
		from { opacity: 0; transform: translateY(16rpx) }
		to { opacity: 1; transform: translateY(0) }
	}
	.anim-1 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: 0.08s; opacity: 0 }
	.anim-2 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: 0.16s; opacity: 0 }
	.anim-3 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: 0.24s; opacity: 0 }

	/* Header */
	.hdr {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(255,255,255,0.9);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1rpx solid rgba(0,0,0,0.08);
	}
	.hdr-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 112rpx;
		padding: 0 40rpx;
		padding-top: 48rpx;
	}
	.hdr-btn { width: 48rpx; height: 48rpx; display: flex; align-items: center; justify-content: center; border-radius: 20rpx }
	.hdr-btn:active { background: #f9fafb }
	.hdr-title { font-size: 32rpx; font-weight: 600; letter-spacing: -0.02em; color: #0F172A }

	/* Main */
	.main { padding: 40rpx 40rpx 80rpx }
	.spacer { height: 64rpx }

	/* Card shadow */
	.card-shadow {
		box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.06), 0 0 2rpx rgba(0,0,0,0.04);
	}

	/* Stats Card */
	.stats-card {
		background: #FAFBFC;
		border-radius: 28rpx;
		padding: 44rpx;
		position: relative;
		overflow: hidden;
		margin-bottom: 40rpx;
	}
	.stats-deco {
		position: absolute;
		top: 0;
		right: 0;
		width: 200rpx;
		height: 200rpx;
		background: rgba(37,99,235,0.03);
		border-radius: 50%;
		transform: translateY(-50%) translateX(50%);
	}
	.stats-body { position: relative }
	.stats-label {
		font-size: 22rpx;
		font-weight: 500;
		color: #94A3B8;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		display: block;
		margin-bottom: 4rpx;
	}
	.stats-num-row { display: flex; align-items: baseline; gap: 4rpx; margin-bottom: 40rpx }
	.stats-big { font-size: 88rpx; font-weight: 900; color: #0F172A; letter-spacing: -0.04em; line-height: 1 }
	.stats-unit { font-size: 24rpx; font-weight: 500; color: #475569; margin-left: 4rpx }

	/* Stats Grid */
	.stats-grid { display: flex; gap: 16rpx }
	.stat-box {
		flex: 1;
		background: #fff;
		border-radius: 20rpx;
		padding: 20rpx 16rpx;
		border: 1rpx solid rgba(0,0,0,0.06);
	}
	.stat-box:active { background: #f9fafb }
	.stat-dot-row { display: flex; align-items: center; gap: 10rpx; margin-bottom: 10rpx }
	.dot { width: 12rpx; height: 12rpx; border-radius: 50%; flex-shrink: 0 }
	.dot-green { background: #059669 }
	.dot-yellow { background: #D97706 }
	.dot-blue { background: #2563EB }
	.dot-purple { background: #7C3AED }
	.dot-gray { background: #94A3B8 }
	.stat-sub-label { font-size: 20rpx; color: #94A3B8; font-weight: 500 }
	.stat-val { font-size: 32rpx; font-weight: 700; color: #0F172A; display: block }
	.stat-val-unit { font-size: 18rpx; font-weight: 400; color: #94A3B8; margin-left: 4rpx }

	/* Section */
	.section { margin-bottom: 40rpx }
	.section-title {
		font-size: 22rpx;
		font-weight: 600;
		color: #94A3B8;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		display: block;
		margin-bottom: 20rpx;
		padding-left: 4rpx;
	}

	/* Buttons */
	.btn-primary {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16rpx;
		width: 100%;
		height: 96rpx;
		background: #2563EB;
		color: #fff;
		border-radius: 28rpx;
		font-size: 28rpx;
		font-weight: 600;
		box-shadow: 0 8rpx 24rpx rgba(37,99,235,0.2);
		margin-bottom: 20rpx;
		transition: all 0.15s;
	}
	.btn-primary:active { transform: scale(0.97); box-shadow: 0 4rpx 12rpx rgba(37,99,235,0.15) }

	.btn-outline {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16rpx;
		width: 100%;
		height: 96rpx;
		background: #fff;
		border: 1rpx solid #e5e7eb;
		color: #0F172A;
		border-radius: 28rpx;
		font-size: 28rpx;
		font-weight: 500;
		box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.06), 0 0 2rpx rgba(0,0,0,0.04);
		margin-bottom: 20rpx;
		transition: all 0.15s;
	}
	.btn-outline:active { background: #f9fafb; transform: scale(0.97) }

	/* Status List */
	.status-list { }

	.status-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #fff;
		border-radius: 28rpx;
		box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.06), 0 0 2rpx rgba(0,0,0,0.04);
		padding: 28rpx 32rpx;
		margin-bottom: 20rpx;
		transition: background 0.15s;
	}
	.status-card:active { background: rgba(0,0,0,0.02) }

	.status-card-l { display: flex; align-items: center; gap: 22rpx; flex: 1; min-width: 0 }

	.icon-box {
		width: 72rpx;
		height: 72rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.icon-warn { background: #FFFBEB }
	.icon-ok { background: #ECFDF5 }
	.icon-gray { background: #F3F4F6 }

	.sc-title { font-size: 28rpx; font-weight: 600; color: #0F172A; display: block }
	.sc-desc { font-size: 20rpx; color: #94A3B8; margin-top: 4rpx; display: block }

	.badge {
		min-width: 48rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 9999rpx;
		font-size: 24rpx;
		font-weight: 700;
		color: #fff;
		padding: 0 16rpx;
		flex-shrink: 0;
	}
	.badge-warn { background: #D97706 }
	.badge-ok { background: #059669 }
	.badge-gray { background: #9ca3af }

	/* ── Anchor List ── */
	.list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	.lh-title { font-size: 28rpx; font-weight: 700; color: #1a1a1a }
	.lh-count { font-size: 22rpx; color: #2563EB; font-weight: 500 }
	.list-empty { padding: 60rpx 0; text-align: center }
	.le-text { font-size: 24rpx; color: #ADB5BD }

	.anchor-card {
		background: #fff;
		border-radius: 20rpx;
		padding: 24rpx 28rpx;
		margin-bottom: 16rpx;
		border: 1rpx solid #E4E7EC;
	}
	.ac-body { display: flex; align-items: flex-start; justify-content: space-between; gap: 16rpx }
	.ac-left { flex: 1; min-width: 0 }
	.ac-name-row { display: flex; align-items: center; gap: 12rpx; margin-bottom: 10rpx; flex-wrap: wrap }
	.ac-name { font-size: 28rpx; font-weight: 700; color: #1a1a1a }
	.ac-tag {
		font-size: 18rpx; font-weight: 600; padding: 4rpx 14rpx; border-radius: 8rpx;
	}
	.tag-green { background: #ECFDF5; color: #059669; border: 1rpx solid #A7F3D0 }
	.tag-yellow { background: #FFFBEB; color: #D97706; border: 1rpx solid #FDE68A }
	.tag-blue { background: #EFF6FF; color: #2563EB; border: 1rpx solid #BFDBFE }
	.tag-purple { background: #F5F3FF; color: #7C3AED; border: 1rpx solid #DDD6FE }
	.tag-gray { background: #F3F4F6; color: #6B7280; border: 1rpx solid #D1D5DB }
	.ac-tag-recruit { background: #EEF2FF; color: #4F46E5; border: 1rpx solid #C7D2FE }
	.ac-info { display: flex; gap: 20rpx; margin-bottom: 8rpx; flex-wrap: wrap }
	.ac-info-text { font-size: 22rpx; color: #6C757D }
	.ac-time { font-size: 20rpx; color: #ADB5BD }
	.ac-actions { display: flex; gap: 12rpx; flex-shrink: 0; margin-top: 4rpx }
	.ac-btn {
		padding: 10rpx 24rpx; border-radius: 12rpx; font-size: 22rpx; font-weight: 500;
		background: #F0F5F9; color: #2D5A7B; border: 1rpx solid #D9E6F0;
	}
	.ac-btn-sm:active { opacity: 0.7 }
	.ac-btn-danger { background: #FEF2F2; color: #C44B4B; border: 1rpx solid #FECACA }

	/* ── Modal ── */
	.modal-mask {
		position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 200;
		background: rgba(0,0,0,0.4); display: flex; align-items: flex-end;
	}
	.modal-sheet {
		width: 100%; background: #fff; border-radius: 32rpx 32rpx 0 0;
		padding-bottom: env(safe-area-inset-bottom, 0);
	}
	.drag-handle { width: 72rpx; height: 6rpx; border-radius: 3rpx; background: #CED4DA; margin: 20rpx auto 24rpx }
	.modal-header {
		display: flex; align-items: center; justify-content: space-between;
		padding: 0 36rpx 28rpx; border-bottom: 1rpx solid #F1F3F5;
	}
	.modal-title { font-size: 32rpx; font-weight: 700; color: #1a1a1a }
	.modal-close { width: 56rpx; height: 56rpx; border-radius: 50%; background: #F1F3F5; display: flex; align-items: center; justify-content: center }
	.modal-form { padding: 24rpx 36rpx 0 }
	.form-field { margin-bottom: 24rpx }
	.ff-label { font-size: 24rpx; font-weight: 600; color: #495057; display: block; margin-bottom: 10rpx }
	.ff-input {
		width: 100%; height: 88rpx; background: #F7F8FA; border: 1rpx solid #E4E7EC;
		border-radius: 16rpx; padding: 0 24rpx; font-size: 26rpx; color: #1a1a1a; font-weight: 500; box-sizing: border-box;
	}
	.ff-picker {
		width: 100%; height: 88rpx; background: #F7F8FA; border: 1rpx solid #E4E7EC;
		border-radius: 16rpx; padding: 0 24rpx; display: flex; align-items: center; justify-content: space-between;
		font-size: 26rpx; font-weight: 500; box-sizing: border-box;
	}
	.input-placeholder { color: #ADB5BD }
	.fi-text { color: #1a1a1a; font-weight: 500 }
	.fi-placeholder { color: #ADB5BD }
	.form-warn {
		display: flex; align-items: flex-start; gap: 12rpx; margin: 0 0 24rpx;
		padding: 18rpx 20rpx; background: #fffbeb; border: 1rpx solid #fde68a; border-radius: 14rpx;
	}
	.warn-text-sm { font-size: 20rpx; color: #92400e; line-height: 1.6 }

	/* ── Photo Picker ── */
	.photo-picker {
		width: 180rpx; height: 180rpx; border-radius: 20rpx;
		background: #F7F8FA; border: 2rpx dashed #D1D5DB;
		display: flex; align-items: center; justify-content: center;
		overflow: hidden;
	}
	.photo-picker:active { background: #EEF2FF }
	.photo-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8rpx }
	.photo-tip { font-size: 20rpx; color: #ADB5BD; font-weight: 500 }
	.photo-preview { width: 100%; height: 100% }
	.photo-remove { font-size: 20rpx; color: #EF4444; font-weight: 500; margin-top: 10rpx; padding: 4rpx 0 }

	/* ── Anchor Card Avatar ── */
	.ac-avatar-box {
		width: 88rpx; height: 88rpx; border-radius: 20rpx;
		overflow: hidden; flex-shrink: 0;
	}
	.ac-avatar-empty {
		background: linear-gradient(135deg, #EEF2FF, #E0E7FF);
		display: flex; align-items: center; justify-content: center;
	}
	.ac-avatar-txt { font-size: 36rpx; font-weight: 700; color: #6366F1 }
	.ac-avatar { width: 100%; height: 100% }

	.modal-submit {
		width: calc(100% - 72rpx); margin: 28rpx 36rpx; height: 96rpx; border-radius: 18rpx;
		background: #2563EB; color: #fff; display: flex; align-items: center; justify-content: center;
		font-size: 28rpx; font-weight: 600;
		box-shadow: 0 4rpx 12rpx rgba(37,99,235,0.08);
	}
	.modal-submit:active { opacity: 0.9 }

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
