<template>
	<view class="pg">
		<!-- ═══ Header ═══ -->
		<view class="hdr">
			<view class="hdr-inner">
				<view class="hdr-back" @tap="goBack"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"
						stroke="#64748b" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg></view>
				<view class="hdr-text-group">
					<text class="hdr-title">人员管理</text>
					<text class="hdr-sub" v-if="!canManageAllDepts">{{ deptName }} · 共 {{ filteredList.length }} 人</text>
					<text class="hdr-sub" v-else>全部门 · 共 {{ filteredList.length }} 人</text>
				</view>
				<view class="hdr-icon">
					<svg class="s20 primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
					</svg>
				</view>
			</view>

			<!-- Add Buttons -->
			<view class="add-btn-area">
				<view class="add-btn add-btn-leader" @tap="openModal('leader')">
					<svg class="s16 primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
					</svg>
					<text class="add-btn-text-primary">新增组长</text>
				</view>
				<view class="add-btn add-btn-employee" @tap="openModal('employee')">
					<svg class="s16 accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
					</svg>
					<text class="add-btn-text-accent">新增员工</text>
				</view>
			</view>

			<!-- Warning Banner -->
			<view class="warn-banner">
				<svg class="s16 warning" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<text class="warn-text">新增账号将自动进入<text class="warn-bold">人事待审核队列</text>，审核通过后方可正常使用</text>
			</view>
		</view>

		<!-- ═══ Person List ═══ -->
		<view class="tabList">
			<view class="list">
				<view v-for="(item, i) in tabList" :key="i" :class="'tab-item '+(tabIndex===i?'tab-active':'')" @tap="onTabChange(i)">{{item.label}}</view>
			</view>
		</view>

		<!-- 部门筛选 -->
		<view class="dept-filter-bar" v-if="canManageAllDepts && deptFilterOptions.length > 0">
			<view class="df-label">
				<svg class="s16 gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
				</svg>
				<text class="df-label-text">部门</text>
			</view>
			<picker :range="deptFilterOptions" range-key="label" :value="deptFilterIndex" @change="onDeptFilterChange">
				<view class="df-picker">
					<text :class="deptFilterIndex>0?'df-selected':'df-placeholder'">{{ deptFilterOptions[deptFilterIndex].label }}</text>
					<svg class="s14 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
					</svg>
				</view>
			</picker>
		</view>

		<view class="list-section">
			<view class="list-hd">
				<text class="lh-title">{{ canManageAllDepts ? '全体人员' : '本部门人员' }}</text>
				<text class="lh-count">{{ filteredList.length }} 人</text>
			</view>

			<view v-for="(p, pi) in filteredList" :key="pi" class="person-card card-shadow anim-slide-up"
				:style="'animation-delay:'+(pi*0.05)+'s'">

				<view class="pc-body">
					<view class="pc-left">
						<view class="pc-name-row">
							<text class="pc-name">{{ p.name }}</text>
							<view class="role-badge" :class="p.role==='总监'?'rb-director':p.role==='组长'?'rb-leader':'rb-employee'">
								<text>{{ p.role }}</text>
							</view>
							<view class="dept-tag" v-if="canManageAllDepts">{{ p.department }}</view>
						</view>
						<view class="pc-status-row">
							<text class="pc-phone">{{ p.account }}</text>
							<view class="status-dot-wrap">
								<view class="status-dot" :class="'dot-'+p.statusKey"
									:class2="p.status==='待审核'?'dot-animate':''"></view>
								<text class="status-text" :class="'st-'+p.statusKey">{{ p.status }}</text>
							</view>
							<text class="pc-date">· {{ p.date }}</text>
						</view>
					</view>
					<view class="pc-actions" v-if="canEdit">
						<view class="action-btn" @tap="openEditModal(p)">
							<svg class="s14 gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
							</svg>
						</view>
						<view class="action-btn" @tap="confirmDelete(p)">
							<svg class="s14 gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
								stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
						</view>
					</view>
				</view>
			</view>

			<view class="bottom-spacer"></view>
		</view>



		<!-- ═══ Add Modal (Bottom Sheet) ═══ -->
		<view v-if="showModal" class="modal-mask" @tap="closeModal">
			<view class="modal-sheet" :class="showModal?'sheet-up':'sheet-down'" @tap.stop>
				<!-- Drag handle -->
				<view class="drag-handle"></view>

				<!-- Modal Header -->
				<view class="modal-header">
					<text class="modal-title">{{ modalType === 'leader' ? '新增组长' : '新增员工' }}</text>
					<view class="modal-close" @tap="closeModal">
						<svg class="s16 gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</view>
				</view>

				<!-- Form -->
				<view class="modal-form">
					<!-- 部门（总经办/人事部可选择） -->
					<view class="form-field" v-if="isGeneralOffice || isHR">
						<text class="ff-label">部门</text>
						<picker :range="deptOptions" range-key="label" :value="addDeptIndex" @change="onAddDeptChange">
							<view class="ff-picker">
								<text :class="addDeptIndex>=0?'fi-text':'fi-placeholder'">{{ addDeptIndex>=0 ? deptOptions[addDeptIndex].label : '请选择部门' }}</text>
								<svg class="s16 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
								</svg>
							</view>
						</picker>
					</view>
					<!-- 姓名 -->
					<view class="form-field">
						<text class="ff-label">姓名</text>
						<input class="ff-input" type="text" v-model="formName" placeholder="请输入姓名"
							placeholder-class="input-placeholder" />
					</view>
					<!-- 手机号 -->
					<view class="form-field">
						<text class="ff-label">手机号</text>
						<input class="ff-input" type="tel" v-model="formPhone" placeholder="请输入手机号"
							placeholder-class="input-placeholder" />
					</view>

					<!-- 备注 -->
					<view class="form-field">
						<text class="ff-label">备注（选填）</text>
						<textarea class="ff-textarea" v-model="formRemark" placeholder="请输入备注信息"
							placeholder-class="input-placeholder" :maxlength="200" />
					</view>
				</view>

				<!-- Form Warning -->
				<view class="form-warn">
					<svg class="s16 warning" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<text class="warn-text-sm">提交后将自动进入人事待审核队列</text>
				</view>

				<!-- Submit -->
				<view class="modal-submit" @tap="handleSubmit">
					<text>确认提交</text>
				</view>
			</view>
		</view>

		<!-- ═══ Edit Modal (Bottom Sheet) ═══ -->
		<view v-if="showEditModal" class="modal-mask" @tap="closeEditModal">
			<view class="modal-sheet" @tap.stop>
				<view class="drag-handle"></view>
				<view class="modal-header">
					<text class="modal-title">编辑人员</text>
					<view class="modal-close" @tap="closeEditModal">
						<svg class="s16 gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</view>
				</view>
				<view class="modal-form">
					<!-- 姓名（只读） -->
					<view class="form-field">
						<text class="ff-label">姓名</text>
						<view class="ff-readonly">{{ editForm.name }}</view>
					</view>
					<!-- 部门（总经办/人事部可编辑） -->
					<view class="form-field" v-if="isGeneralOffice || isHR">
						<text class="ff-label">部门</text>
						<picker :range="deptOptions" range-key="label" :value="editDeptIndex" @change="onEditDeptChange">
							<view class="ff-picker">
								<text :class="editDeptIndex>=0?'fi-text':'fi-placeholder'">{{ editDeptIndex>=0 ? deptOptions[editDeptIndex].label : '请选择部门' }}</text>
								<svg class="s16 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
								</svg>
							</view>
						</picker>
					</view>
				<!-- 角色 -->
				<view class="form-field">
					<text class="ff-label">角色</text>
					<picker :range="editRoleOptions" range-key="label" :value="editRoleIndex" @change="onEditRoleChange">
						<view class="ff-picker">
							<text :class="editRoleIndex>=0?'fi-text':'fi-placeholder'">{{ editRoleIndex>=0 ? editRoleOptions[editRoleIndex].label : '请选择角色' }}</text>
								<svg class="s16 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
								</svg>
							</view>
						</picker>
					</view>
					<!-- 审核状态（仅总经办可编辑） -->
					<view class="form-field" v-if="isGeneralOffice">
						<text class="ff-label">审核状态</text>
						<picker :range="auditOptions" range-key="label" :value="editAuditIndex" @change="onEditAuditChange">
							<view class="ff-picker">
								<text :class="editAuditIndex>=0?'fi-text':'fi-placeholder'">{{ editAuditIndex>=0 ? auditOptions[editAuditIndex].label : '请选择状态' }}</text>
								<svg class="s16 gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
								</svg>
							</view>
						</picker>
					</view>
				</view>
				<view class="modal-submit" @tap="handleEditSubmit" style="margin-bottom: 40rpx;">
					<text>保存修改</text>
				</view>
			</view>
		</view>

		<!-- Toast -->
		<view class="toast" :class="toastVisible?'toast-show':''">
			<view class="toast-inner">
				<svg class="s16 success" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
				</svg>
				<text class="toast-text">{{ toastMsg }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { useAuth, DEPT_LABELS, DEPARTMENTS } from '../../stores/auth.js'
	import { api } from '../../utils/api.js'
	const auth = useAuth()

	// ── 后端字段映射 ──
	const STATUS_MAP = {
		1: { label: '待审核', key: 'warning' },
		2: { label: '已通过', key: 'success' },
		5: { label: '已拒绝', key: 'danger' },
	}
	const ROLE_MAP = { 1: '总监', 2: '组长', 3: '员工' }
	const ROLE_REVERSE = { '总监': 1, '组长': 2, '员工': 3 }

	// 角色选项常量（模块级，不会被 Vue 响应式冻结）
	const ALL_ROLES = [
		{ label: '总监', value: 'director' },
		{ label: '组长', value: 'leader' },
		{ label: '员工', value: 'employee' }
	]
	const STAFF_ROLES = [
		{ label: '组长', value: 'leader' },
		{ label: '员工', value: 'employee' }
	]

	/** 格式化日期 Y-m-d H:i:s → YYYY.MM.DD */
	function fmtDate(dt) {
		if (!dt) return ''
		return dt.slice(0, 10).replace(/-/g, '.')
	}

	/** 将API返回的一行转为页面展示格式 */
	function mapRow(r, deptNameMap) {
		const st = STATUS_MAP[r.account_status] || STATUS_MAP[1]
		return {
			id: r.id,
			name: r.real_name || r.username || '',
			account: r.username || '',
			role: ROLE_MAP[r.role_level] || '员工',
			roleLevel: r.role_level || 3,
			status: st.label,
			statusKey: st.key,
			accountStatus: r.account_status || 1,
			department: deptNameMap[r.dept_id] || DEPT_LABELS[r.dept_id] || '未知',
			deptId: r.dept_id || 0,
			date: fmtDate(r.create_time),
		}
	}

	export default {
		data() {
			return {
				tabList:[
					{ label:'全部' },
					{ label:'总监' },
					{ label:'组长' },
					{ label:'员工' }
				],
				tabIndex: 0,
				personList: [],
				loading: false,
				/* ─ 权限相关 ─ */
				isGeneralOffice: false,
				isHR: false,
				isDirector: false,
				canEdit: false,
				deptName: '',
				deptId: 0,
				deptNameMap: {},
				/* ─ 部门筛选 ─ */
				deptFilterIndex: 0,
				deptFilterOptions: [],
				/* ─ 部门选项 ─ */
				deptOptions: [],
				/* ─ 新增表单 ─ */
				showModal: false,
				modalType: 'leader',
				formName: '',
				formPhone: '',
				roleOptions: [{ label: '组长', value: 'leader' }, { label: '员工', value: 'employee' }],
				roleIndex: 0,
				addDeptIndex: -1,
				formRemark: '',
				/* ─ 编辑弹窗 ─ */
				showEditModal: false,
				editingPerson: null,
				editForm: { name: '' },
				editDeptIndex: -1,
				editRoleIndex: -1,
				editAuditIndex: -1,
				auditOptions: [
					{ label: '待审核', value: 'pending', statusKey: 'warning', apiVal: 1 },
					{ label: '已通过', value: 'passed', statusKey: 'success', apiVal: 2 },
					{ label: '已拒绝', value: 'rejected', statusKey: 'danger', apiVal: 5 }
				],
				/* ─ Toast ─ */
				toastVisible: false,
				toastMsg: ''
			}
		},
		computed: {
			// 可管理全部门：总经办 或 人事部总监
			canManageAllDepts() {
				return this.isGeneralOffice || (this.isHR && this.isDirector)
			},
			filteredList() {
				let list = this.personList
				if (!this.canManageAllDepts) {
					list = list.filter(p => p.department === this.deptName)
				}
				// 部门筛选
				if (this.canManageAllDepts && this.deptFilterIndex > 0) {
					const deptLabel = this.deptFilterOptions[this.deptFilterIndex].label
					list = list.filter(p => p.department === deptLabel)
				}
				const tabLabel = this.tabList[this.tabIndex] && this.tabList[this.tabIndex].label
				if (tabLabel && tabLabel !== '全部') {
					list = list.filter(p => p.role === tabLabel)
				}
				return list
			},
			// 编辑弹窗角色选项：总经办/人事部可选总监，引用模块级常量避免响应式冻结
			editRoleOptions() {
				return (this.isGeneralOffice || this.isHR) ? ALL_ROLES : STAFF_ROLES
			}
		},
		onShow() {
			this.$checkAuth()
			this.initAuthState()
			this.fetchDeptOptions()
			this.fetchPersonList()
		},
		methods: {
			/* ── 权限初始化 ── */
			initAuthState() {
				const deptId = auth.state.departmentId
				const role = auth.state.role
				this.isGeneralOffice = deptId === DEPARTMENTS.GENERAL
				this.isHR = deptId === DEPARTMENTS.HR
				this.isDirector = role === auth.ROLES.DIRECTOR
				this.canEdit = this.isGeneralOffice || this.isHR
				this.deptName = DEPT_LABELS[deptId] || ''
				this.deptId = deptId || 0
			},

			/* ── 获取部门选项（从API） ── */
			async fetchDeptOptions() {
				try {
				const res = await api.get('/api/admin/hr/departments', null, { silent: true })
				const all = (res.data || []).map(d => ({
					label: d.dept_name,
					value: Number(d.id)
				}))
				// 排除总经办和财务部（不可添加）
				this.deptOptions = all.filter(d => d.value !== DEPARTMENTS.GENERAL && d.value !== DEPARTMENTS.FINANCE)
					// 部门名称映射表（用于API数据的dept_id→名称转换）
					const nameMap = {}
					all.forEach(d => { nameMap[d.value] = d.label })
					this.deptNameMap = nameMap
					// 构建部门筛选选项
					this.buildDeptFilterOptions(all)
					// 非全部门管理者默认选中本部门
					if (!this.canManageAllDepts) {
						const idx = this.deptOptions.findIndex(d => d.label === this.deptName)
						this.addDeptIndex = idx >= 0 ? idx : -1
					}
				} catch (e) {
					console.error('[人员管理] 获取部门列表失败，使用本地缓存:', e)
					// fallback: 使用本地部门常量
					const localDepts = Object.entries(DEPT_LABELS).map(([k,v]) => ({ label: v, value: Number(k) }))
					this.deptOptions = localDepts.filter(d => d.value !== DEPARTMENTS.GENERAL && d.value !== DEPARTMENTS.FINANCE)
					const nameMap = {}
					localDepts.forEach(d => { nameMap[d.value] = d.label })
					this.deptNameMap = nameMap
					this.buildDeptFilterOptions(localDepts)
					if (!this.canManageAllDepts) {
						const idx = this.deptOptions.findIndex(d => d.label === this.deptName)
						this.addDeptIndex = idx >= 0 ? idx : -1
					}
				}
			},

			/* ── 获取人员列表 ── */
			async fetchPersonList() {
				this.loading = true
				try {
					const params = {}
					if (!this.canManageAllDepts && this.deptId) {
						params.dept_id = this.deptId
					}
				const res = await api.get('/api/admin/hr/accounts', params)
				this.personList = (res.data.list || []).map(r => mapRow(r, this.deptNameMap))
				} catch (e) {
					console.error('[人员管理] 获取列表失败:', e)
				} finally {
					this.loading = false
				}
			},

			goBack() { this.$smartBack ? this.$smartBack() : uni.navigateBack() },

			/* ─ Tab ─ */
			onTabChange(i) { this.tabIndex = i },

			/* ─ 部门筛选 ─ */
			buildDeptFilterOptions(allDepts) {
				this.deptFilterOptions = [
					{ label: '全部部门', value: 0 },
					...allDepts.map(d => ({ label: d.label, value: d.value }))
				]
			},
			onDeptFilterChange(e) { this.deptFilterIndex = parseInt(e.detail.value) },

			/* ─ 新增 ─ */
			openModal(type) {
				this.modalType = type
				this.roleIndex = type === 'leader' ? 0 : 1
				this.formName = ''
				this.formPhone = ''
				this.formRemark = ''
				if (this.canManageAllDepts) this.addDeptIndex = -1
				this.showModal = true
			},
			closeModal() { this.showModal = false },
			onAddDeptChange(e) { this.addDeptIndex = parseInt(e.detail.value) },
			onRoleChange(e) { this.roleIndex = parseInt(e.detail.value) },

			async handleSubmit() {
				if (!this.formName || !this.formPhone) return this.showToast('请填写姓名和手机号')
				if ((this.isGeneralOffice || this.isHR) && this.addDeptIndex < 0) return this.showToast('请选择部门')

				// 计算 dept_id
				let deptId = this.deptId
				if (this.addDeptIndex >= 0) {
					deptId = this.deptOptions[this.addDeptIndex].value
				}

				// role_level: 组长=2, 员工=3
				const roleLevel = this.modalType === 'leader' ? 2 : 3

				try {
					await api.post('/api/admin/hr/accounts', {
						account: this.formPhone,
						password: '123456',
						real_name: this.formName,
						dept_id: deptId,
						role_level: roleLevel,
					})
					this.closeModal()
					this.showToast('已提交至人事审核队列')
					this.fetchPersonList()
				} catch (e) {
					// api.js 已弹出 toast
				}
			},

			/* ─ 编辑 ─ */
			openEditModal(p) {
				this.editingPerson = p
				this.editForm = { name: p.name }
				this.editRoleIndex = this.editRoleOptions.findIndex(o => o.label === p.role)

				// 审核状态使用 accountStatus 做映射
				this.editAuditIndex = this.auditOptions.findIndex(o => o.apiVal === p.accountStatus)
				if (this.isGeneralOffice || this.isHR) {
					this.editDeptIndex = this.deptOptions.findIndex(d => d.label === p.department)
				}
				this.showEditModal = true
			},
			closeEditModal() { this.showEditModal = false },
			onEditDeptChange(e) { this.editDeptIndex = parseInt(e.detail.value) },
			onEditRoleChange(e) { this.editRoleIndex = parseInt(e.detail.value) },
			onEditAuditChange(e) { this.editAuditIndex = parseInt(e.detail.value) },

			async handleEditSubmit() {
				const p = this.editingPerson
				if (!p) return

				const updateData = {}

				// 角色
				if (this.editRoleIndex >= 0) {
					const label = this.editRoleOptions[this.editRoleIndex].label
					// 只有总经办/人事部才能设置总监角色
					if (label === '总监' && !this.isGeneralOffice && !this.isHR) {
						this.showToast('无权限设置总监角色')
						return
					}
					updateData.role_level = ROLE_REVERSE[label] || 3
				}
				// 部门（总经办/人事部可编辑）
				if ((this.isGeneralOffice || this.isHR) && this.editDeptIndex >= 0) {
					updateData.dept_id = this.deptOptions[this.editDeptIndex].value
				}
				// 审核状态（仅总经办）
				if (this.isGeneralOffice && this.editAuditIndex >= 0) {
					updateData.account_status = this.auditOptions[this.editAuditIndex].apiVal
				}

				if (Object.keys(updateData).length === 0) {
					this.closeEditModal()
					return
				}

				try {
					await api.put('/api/admin/hr/accounts/' + p.id, updateData)
					this.closeEditModal()
					this.showToast('修改已保存')
					this.fetchPersonList()
				} catch (e) {
					// api.js 已弹出 toast
				}
			},

			/* ─ 删除 ─ */
			confirmDelete(p) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除 ' + p.name + ' 吗？删除后该账户将标记为已删除状态，不再出现在人员列表中。',
					success: async (res) => {
						if (!res.confirm) return
						try {
							await api.delete('/api/admin/hr/accounts/' + p.id)
							this.showToast('已删除 ' + p.name)
							this.fetchPersonList()
						} catch (e) {
							// api.js 已弹出 toast
						}
					}
				})
			},

			/* ─ Toast ─ */
			showToast(msg) {
				this.toastMsg = msg
				this.toastVisible = true
				clearTimeout(this._tt)
				this._tt = setTimeout(() => { this.toastVisible = false }, 2500)
			}
		}
	}
</script>

<style scoped>
	.hdr-back {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		flex-shrink: 0;
		margin-right: 8rpx
	}

	.hdr-back:active {
		background: rgba(0, 0, 0, .06)
	}
</style>

<style>
	/* Base */
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #F7F8FA;
		font-family: -apple-system, BlinkMacSystemFont, 'Noto Sans SC', sans-serif;
		-webkit-font-smoothing: antialiased
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

	.s20 {
		width: 40rpx;
		height: 40rpx;
		flex-shrink: 0
	}

	.white {
		color: #fff
	}

	.gray-400 {
		color: #ADB5BD
	}

	.gray-500 {
		color: #868E96
	}

	.primary {
		color: #2D5A7B
	}

	.accent {
		color: #E07A3E
	}

	.warning {
		color: #D4943A
	}

	.success {
		color: #3D8B6E
	}

	.danger-color {
		color: #C44B4B
	}

	/* Animations */
	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20rpx)
		}

		to {
			opacity: 1;
			transform: translateY(0)
		}
	}

	.anim-slide-up {
		animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		opacity: 0
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

	/* Header */
	.hdr {
		background: #fff;
		border-bottom: 1rpx solid #E4E7EC
	}

	.hdr-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 48rpx 36rpx 16rpx
	}

	.hdr-title {
		font-size: 36rpx;
		font-weight: 700;
		color: #1a1a1a;
		display: block;
		letter-spacing: -0.01em
	}

	.hdr-sub {
		font-size: 20rpx;
		color: #868E96;
		margin-top: 4rpx;
		display: block;
		font-weight: 500
	}

	.hdr-icon {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		background: #F0F5F9;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0
	}

	/* Add Buttons */
	.add-btn-area {
		padding: 0 36rpx;
		display: flex;
		flex-direction: column;
		gap: 16rpx
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		height: 80rpx;
		border-radius: 18rpx;
		font-size: 26rpx;
		font-weight: 600;
	}

	.add-btn-leader {
		border: 2rpx solid #2D5A7B;
		color: #2D5A7B;
		background: #fff;
		box-shadow: 0 1rpx 3rpx rgba(45, 90, 123, 0.04)
	}

	.add-btn-employee {
		border: 2rpx solid #E07A3E;
		color: #E07A3E;
		background: #fff;
		box-shadow: 0 1rpx 3rpx rgba(224, 122, 62, 0.04)
	}

	.add-btn:active {
		opacity: 0.8
	}

	.add-btn-text-primary {
		color: #2D5A7B
	}

	.add-btn-text-accent {
		color: #E07A3E
	}

	/* Warning Banner */
	.warn-banner {
		display: flex;
		align-items: flex-start;
		gap: 12rpx;
		margin: 16rpx 36rpx 24rpx;
		padding: 18rpx 20rpx;
		background: #fffbeb;
		border: 1rpx solid #fde68a;
		border-radius: 14rpx;
	}

	.warn-text {
		font-size: 20rpx;
		color: #92400e;
		line-height: 1.6
	}

	.warn-bold {
		font-weight: 600
	}

	/* List Section */
	.list-section {
		padding: 16rpx 28rpx 16rpx
	}

	.list-hd {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 18rpx;
		padding: 0 4rpx
	}

	.lh-title {
		font-size: 24rpx;
		font-weight: 700;
		color: #495057
	}

	.lh-count {
		font-size: 20rpx;
		color: #ADB5BD;
		font-weight: 500
	}

	/* Person Card */
	.person-card {
		background: #fff;
		border-radius: 22rpx;
		overflow: hidden;
		margin-bottom: 20rpx;
		border: 1rpx solid #E4E7EC
	}

	.card-shadow {
		box-shadow: 0 1rpx 3rpx rgba(45, 90, 123, 0.04), 0 1rpx 2rpx rgba(45, 90, 123, 0.02)
	}

	.pc-body {
		display: flex;
		align-items: flex-start;
		padding: 28rpx;
		gap: 16rpx
	}

	.pc-left {
		flex: 1;
		min-width: 0
	}

	/* Name Row */
	.pc-name-row {
		display: flex;
		align-items: center;
		gap: 14rpx;
		margin-bottom: 12rpx
	}

	.pc-name {
		font-size: 28rpx;
		font-weight: 700;
		color: #1a1a1a
	}

	.role-badge {
		font-size: 18rpx;
		font-weight: 600;
		padding: 4rpx 16rpx;
		border-radius: 10rpx;
	}

	.rb-director {
		background: #EDF4FF;
		color: #4A7FBD;
		border: 1rpx solid #C5DAF0
	}
	.rb-leader {
		background: #F0F5F9;
		color: #2D5A7B;
		border: 1rpx solid #D9E6F0
	}

	.rb-employee {
		background: #F8F9FA;
		color: #525252;
		border: 1rpx solid #E4E7EC
	}

	.dept-tag {
		font-size: 18rpx;
		font-weight: 500;
		color: #6C757D;
		background: #F1F3F5;
		padding: 4rpx 14rpx;
		border-radius: 8rpx;
		border: 1rpx solid #DEE2E6;
		flex-shrink: 0
	}

	/* Status Row */
	.pc-status-row {
		display: flex;
		align-items: center;
		gap: 8rpx
	}

	.status-dot-wrap {
		display: flex;
		align-items: center;
		gap: 8rpx
	}

	.status-dot {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		flex-shrink: 0
	}

	.dot-success {
		background: #3D8B6E
	}

	.dot-warning {
		background: #D4943A;
		animation: pulse 1.5s ease-in-out infinite
	}

	.dot-danger {
		background: #C44B4B
	}

	.status-text {
		font-size: 20rpx;
		font-weight: 500
	}

	.st-success {
		color: #3D8B6E
	}

	.st-warning {
		color: #D4943A
	}

	.st-danger {
		color: #C44B4B
	}

	.pc-date {
		font-size: 20rpx;
		color: #ADB5BD
	}

	/* Actions */
	.pc-actions {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
		flex-shrink: 0
	}

	.action-btn {
		width: 56rpx;
		height: 56rpx;
		border-radius: 14rpx;
		background: #F8F9FA;
		border: 1rpx solid #E4E7EC;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.action-btn:active {
		background: #F1F3F5
	}

	/* Modal */
	.modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 200;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: flex-end;
	}

	.modal-sheet {
		width: 100%;
		background: #fff;
		border-radius: 32rpx 32rpx 0 0;
		padding-bottom: env(safe-area-inset-bottom, 0);
	}

	.drag-handle {
		width: 72rpx;
		height: 6rpx;
		border-radius: 3rpx;
		background: #CED4DA;
		margin: 20rpx auto 24rpx
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 36rpx 28rpx;
		border-bottom: 1rpx solid #F1F3F5;
	}

	.modal-title {
		font-size: 32rpx;
		font-weight: 700;
		color: #1a1a1a
	}

	.modal-close {
		width: 56rpx;
		height: 56rpx;
		border-radius: 50%;
		background: #F1F3F5;
		display: flex;
		align-items: center;
		justify-content: center
	}

	/* Form */
	.modal-form {
		padding: 24rpx 36rpx 0
	}

	.form-field {
		margin-bottom: 24rpx
	}

	.ff-label {
		font-size: 24rpx;
		font-weight: 600;
		color: #495057;
		display: block;
		margin-bottom: 10rpx
	}

	.ff-input {
		width: 100%;
		height: 88rpx;
		background: #F7F8FA;
		border: 1rpx solid #E4E7EC;
		border-radius: 16rpx;
		padding: 0 24rpx;
		font-size: 26rpx;
		color: #1a1a1a;
		font-weight: 500;
		box-sizing: border-box;
	}

	.ff-input:focus-within {
		border-color: #2D5A7B;
		box-shadow: 0 0 0 4rpx rgba(45, 90, 123, 0.1)
	}

	.ff-picker {
		width: 100%;
		height: 88rpx;
		background: #F7F8FA;
		border: 1rpx solid #E4E7EC;
		border-radius: 16rpx;
		padding: 0 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
		font-weight: 500;
		box-sizing: border-box;
	}

	.ff-textarea {
		width: 100%;
		height: 140rpx;
		background: #F7F8FA;
		border: 1rpx solid #E4E7EC;
		border-radius: 16rpx;
		padding: 20rpx 24rpx;
		font-size: 26rpx;
		color: #1a1a1a;
		font-weight: 500;
		box-sizing: border-box;
		line-height: 1.6;
	}

	.input-placeholder {
		color: #ADB5BD
	}

	.fi-text {
		color: #1a1a1a;
		font-weight: 500
	}

	.fi-placeholder {
		color: #ADB5BD
	}

	/* Form Warning */
	.form-warn {
		display: flex;
		align-items: flex-start;
		gap: 12rpx;
		margin: 0 36rpx;
		padding: 18rpx 20rpx;
		background: #fffbeb;
		border: 1rpx solid #fde68a;
		border-radius: 14rpx;
	}

	.warn-text-sm {
		font-size: 20rpx;
		color: #92400e;
		line-height: 1.6
	}

	/* Submit */
	.modal-submit {
		width: calc(100% - 72rpx);
		margin: 28rpx 36rpx;
		height: 96rpx;
		border-radius: 18rpx;
		background: #2D5A7B;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		font-weight: 600;
		box-shadow: 0 4rpx 12rpx rgba(45, 90, 123, 0.08), 0 1rpx 3rpx rgba(45, 90, 123, 0.04);
	}

	.modal-submit:active {
		opacity: 0.9
	}

	.bottom-spacer {
		height: 32rpx
	}

	/* Toast */
	.toast {
		position: fixed;
		top: 48rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 300;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.toast-show {
		opacity: 1
	}

	.toast-inner {
		display: flex;
		align-items: center;
		gap: 12rpx;
		padding: 20rpx 36rpx;
		border-radius: 18rpx;
		background: rgba(26, 26, 26, 0.92);
		backdrop-filter: blur(8px);
	}

	.toast-text {
		color: #fff;
		font-size: 24rpx;
		font-weight: 500
	}

	/* 人员权限列表切换 */
	.tabList {
		width: 100%;
	}
	.tabList>view {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 28rpx 36rpx;
		background-color: #FFFFFF;
	}
	.tab-item {
		font-size: 24rpx;
		font-weight: 500;
		color: #868E96;
		padding: 10rpx 28rpx;
		border-radius: 12rpx;
		transition: all 0.2s;
	}
	.tab-active {
		color: #2D5A7B;
		background: #F0F5F9;
		font-weight: 600;
	}
	.action-tab {
		color: #2d5a7b;
	}

	/* 部门筛选栏 */
	.dept-filter-bar {
		margin: 0 28rpx 12rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #FFFFFF;
		border-radius: 12rpx;
		padding: 16rpx 24rpx;
	}

	.df-label {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.df-label-text {
		font-size: 24rpx;
		color: #6B7280;
		font-weight: 500;
	}

	.df-picker {
		display: flex;
		align-items: center;
		gap: 8rpx;
		background: #F5F7FA;
		padding: 10rpx 20rpx;
		border-radius: 8rpx;
	}

	.df-selected {
		font-size: 24rpx;
		color: #2D5A7B;
		font-weight: 500;
	}

	.df-placeholder {
		font-size: 24rpx;
		color: #B0B8C1;
	}

	/* 手机号 */
	.pc-phone {
		font-size: 22rpx;
		color: #7C8798;
		margin-right: 12rpx;
	}

/* 只读字段 */
	.ff-readonly {
		width: 100%;
		height: 88rpx;
		background: #EEF0F2;
		border: 1rpx solid #E4E7EC;
		border-radius: 16rpx;
		padding: 0 24rpx;
		font-size: 26rpx;
		color: #6C757D;
		font-weight: 500;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}
</style>