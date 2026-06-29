import { reactive } from 'vue'

// ========== 角色常量（数字） ==========
export const ROLES = {
	DIRECTOR: 1,  // 部门总监
	LEADER: 2,    // 部门组长
	EMPLOYEE: 3,  // 部门员工
}

export const ROLE_LABELS = {
	[ROLES.DIRECTOR]: '部门总监',
	[ROLES.LEADER]: '部门组长',
	[ROLES.EMPLOYEE]: '部门员工',
}

// ========== 部门常量（数字） ==========
export const DEPARTMENTS = {
	GENERAL: 1,     // 总经办
	FINANCE: 2,     // 财务部
	HR: 3,          // 人事部
	BROKER: 4,      // 经纪部
	TRANSFER: 5,    // 中转部
	OPERATION: 6,   // 运营部
	ANCHOR: 7,      // 主播部
}

export const DEPT_LABELS = {
	[DEPARTMENTS.GENERAL]: '总经办',
	[DEPARTMENTS.FINANCE]: '财务部',
	[DEPARTMENTS.HR]: '人事部',
	[DEPARTMENTS.BROKER]: '经纪部',
	[DEPARTMENTS.TRANSFER]: '中转部',
	[DEPARTMENTS.OPERATION]: '运营部',
	[DEPARTMENTS.ANCHOR]: '主播部',
}

// ========== 角色层级 ==========
const ROLE_HIERARCHY = {
	[ROLES.EMPLOYEE]: 0,
	[ROLES.LEADER]: 1,
	[ROLES.DIRECTOR]: 2,
}

// ========== 仅审核部门（无自主考核权） ==========
export const AUDIT_ONLY_DEPTS = [DEPARTMENTS.FINANCE, DEPARTMENTS.GENERAL]

// ========== 部门 → 首页路由映射 ==========
export const DEPT_HOME_MAP = {
	'4|1': '/pages/index/index',                          // 经纪部总监
	'4|2': '/pages/broker-staff/broker-staff',             // 经纪部组长
	'4|3': '/pages/broker-staff/broker-staff',             // 经纪部员工
	'5|1': '/pages/transfer/transfer',                     // 中转部总监
	'5|2': '/pages/transfer-staff/transfer-staff',         // 中转部组长
	'5|3': '/pages/transfer-staff/transfer-staff',         // 中转部员工
	'6|1': '/pages/operation/operation',                   // 运营部总监
	'6|3': '/pages/operation-staff/operation-staff',       // 运营部员工
	'3|1': '/pages/hr/hr',                                 // 人事部总监
	'7|1': '/pages/anchor/anchor',                         // 主播部总监
	'2|1': '/pages/finance-review/finance-review',         // 财务部初审
	'1|1': '/pages/oversight/oversight',                   // 总经办终审 → 首页
}

// ========== 状态标签 ==========
export const STATUS_LABELS = {
	ASSESS_PENDING: 'pending',
	ASSESS_SUBMITTED: 'submitted',
	ASSESS_REVIEWING: 'reviewing',
	ASSESS_APPROVED: 'approved',
	ASSESS_REJECTED: 'rejected',
	ASSESS_CLOSED: 'closed',
}

export const STATUS_MAP = {
	[STATUS_LABELS.ASSESS_PENDING]: { label: '待提交', cls: 'tag-warning' },
	[STATUS_LABELS.ASSESS_SUBMITTED]: { label: '已提交', cls: 'tag-info' },
	[STATUS_LABELS.ASSESS_REVIEWING]: { label: '审核中', cls: 'tag-info' },
	[STATUS_LABELS.ASSESS_APPROVED]: { label: '已通过', cls: 'tag-success' },
	[STATUS_LABELS.ASSESS_REJECTED]: { label: '已驳回', cls: 'tag-danger' },
	[STATUS_LABELS.ASSESS_CLOSED]: { label: '已完结', cls: 'tag-default' },
}

// ========== 响应式状态 ==========
const state = reactive({
	role: null,
	userId: null,
	userName: null,
	account: null,
	code: null,
	departmentId: null,
	departmentName: null,
})

// ========== Composable ==========
export function useAuth() {

	/** 从本地恢复登录态 */
	function init() {
		try {
			const stored = uni.getStorageSync('auth_state')
			if (stored && stored.userId) {
			state.role = stored.role
			state.userId = stored.userId
			state.userName = stored.userName
			state.account = stored.account
			state.code = stored.usercode
			state.departmentId = stored.departmentId
				state.departmentName = DEPT_LABELS[stored.departmentId] || ''
			}
		} catch (e) { }
	}

	/** 持久化到本地 */
	function persist() {
		try {
			uni.setStorageSync('auth_state', {
				role: state.role,
				userId: state.userId,
				userName: state.userName,
				account: state.account,
				usercode: state.code,
				departmentId: state.departmentId,
				departmentName: state.departmentName,
			})
		} catch (e) { }
	}

	/** 登录后设置用户信息 */
	function setUser({ id, name, account, usercode, department, role }) {
		state.role = role
		state.userId = id
		state.userName = name
		state.account = account
		state.code = usercode
		state.departmentId = department
		state.departmentName = DEPT_LABELS[department] || ''
		persist()
	}

	/** 获取首页路由 */
	function getHomePage() {
		const key = state.departmentId + '|' + state.role
		return DEPT_HOME_MAP[key] || '/pages/staff/staff'
	}

	/** 登出 */
	function logout() {
		state.role = null
		state.userId = null
		state.userName = null
		state.account = null
		state.code = null
		state.departmentId = null
		state.departmentName = null
		try {
			uni.removeStorageSync('auth_state')
			uni.removeStorageSync('api_token')
		} catch (e) { }
	}

	/** 是否已登录 */
	function isLoggedIn() {
		return !!state.userId
	}

	// 权限判断
	function isDirector() { return state.role === ROLES.DIRECTOR }
	function isEmployee() { return state.role === ROLES.EMPLOYEE }
	function isAdmin() { return state.role <= ROLES.DIRECTOR }
	function isAuditOnlyDept() { return AUDIT_ONLY_DEPTS.includes(state.departmentId) }

	function hasMinRole(role) {
		return (ROLE_HIERARCHY[state.role] || 0) >= (ROLE_HIERARCHY[role] || 0)
	}

	return {
		state,
		ROLES, ROLE_LABELS,
		DEPARTMENTS, DEPT_LABELS,
		STATUS_LABELS, STATUS_MAP,
		AUDIT_ONLY_DEPTS, DEPT_HOME_MAP,
		init, setUser, getHomePage, logout, isLoggedIn,
		isDirector, isEmployee, isAdmin, isAuditOnlyDept, hasMinRole,
	}
}
