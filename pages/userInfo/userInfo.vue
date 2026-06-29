<template>
	<view class="pg">
		<!-- 顶部卡片区 -->
		<view class="hero">
			<view class="hero-bg"></view>
			<view class="hero-body">
				<!-- 头像 -->
				<view class="avatar-ring">
					<view class="avatar-inner">
						<text class="avatar-text">{{ initial }}</text>
					</view>
				</view>
				<!-- 信息 -->
				<text class="hero-name">{{ userName }}</text>
				<view class="hero-tags">
					<view class="htag htag-dept">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
						<text>{{ deptName }}</text>
					</view>
					<view class="htag htag-role">{{ roleLabel }}</view>
				</view>
				<text v-if="userCode" class="hero-code">工号 {{ userCode }}</text>

				<!-- 快捷统计 -->
				<view class="stats-row">
					<view class="stat-item">
						<text class="stat-num">{{ stats.assessCount }}</text>
						<text class="stat-label">累计考核</text>
					</view>
					<view class="stat-div"></view>
					<view class="stat-item">
						<text class="stat-num">{{ stats.passRate }}%</text>
						<text class="stat-label">达标率</text>
					</view>
					<view class="stat-div"></view>
					<view class="stat-item">
						<text class="stat-num">{{ stats.joinDays }}</text>
						<text class="stat-label">在岗天数</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 菜单区域 -->
		<view class="content">
			<!-- 个人信息 -->
			<view class="section">
				<text class="sec-label">个人信息</text>
				<view class="sec-card">
					<view v-if="userCode" class="menu-item" @tap="showToast('工号: '+userCode)">
						<view class="mi-icon mi-icon-id">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2"/></svg>
						</view>
						<view class="mi-body">
							<text class="mi-title">工号</text>
							<text class="mi-sub">{{ userCode }}</text>
						</view>
					</view>
					<view class="mi-div"></view>
					<view class="menu-item" @tap="showToast('部门: '+deptName)">
						<view class="mi-icon mi-icon-dept">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m7.5-18v18m7.5-18v18"/></svg>
						</view>
						<view class="mi-body">
							<text class="mi-title">部门</text>
							<text class="mi-sub">{{ deptName }}</text>
						</view>
					</view>
					<view class="mi-div"></view>
					<view class="menu-item">
						<view class="mi-icon mi-icon-role">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 017-7h4a7 7 0 017 7v2"/></svg>
						</view>
						<view class="mi-body">
							<text class="mi-title">角色</text>
							<text class="mi-sub">{{ roleLabel }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 账户安全 -->
			<view class="section">
				<text class="sec-label">账户安全</text>
				<view class="sec-card">
					<view class="menu-item" @tap="openPasswordModal">
						<view class="mi-icon mi-icon-key">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
						</view>
						<view class="mi-body">
							<text class="mi-title">修改密码</text>
							<text class="mi-sub">定期更新密码保障账户安全</text>
						</view>
						<svg class="mi-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
					</view>
					<view class="mi-div"></view>
					<view class="menu-item" @tap="showToast('缓存已清除')">
						<view class="mi-icon mi-icon-cache">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"/></svg>
						</view>
						<view class="mi-body">
							<text class="mi-title">清除缓存</text>
							<text class="mi-sub">释放本地存储空间</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 关于 -->
			<view class="section">
				<text class="sec-label">关于</text>
				<view class="sec-card">
					<view class="menu-item">
						<view class="mi-icon mi-icon-info">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>
						</view>
						<view class="mi-body">
							<text class="mi-title">版本号</text>
							<text class="mi-sub">v2.0.1 · 2024 绩效管理系统</text>
						</view>
					</view>
					<view class="mi-div"></view>
					<view class="menu-item" @tap="showToast('感谢使用绩效管理系统')">
						<view class="mi-icon mi-icon-thanks">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
						</view>
						<view class="mi-body">
							<text class="mi-title">反馈与支持</text>
							<text class="mi-sub">如有问题请联系管理员</text>
						</view>
						<svg class="mi-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
					</view>
				</view>
			</view>

			<!-- 退出登录 -->
			<view class="logout-btn" @tap="openLogoutModal">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
				<text>退出登录</text>
			</view>

			<!-- 底部安全区 -->
			<view class="safe-btm"></view>
		</view>

		<!-- 修改密码弹窗 -->
		<view v-if="showPwdModal" class="modal-mask" @tap="closePwdModal">
			<view class="modal-sheet" @tap.stop>
				<view class="drag-handle"></view>
				<text class="modal-title">修改密码</text>
				<text class="modal-sub">请设置一个安全的新密码</text>
				<view class="field">
					<text class="f-label">当前密码</text>
					<input class="f-input" :type="see1?'text':'password'" v-model="oldPwd" placeholder="请输入当前密码" />
					<view class="eye-btn" @tap="see1=!see1">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
					</view>
				</view>
				<view class="field">
					<text class="f-label">新密码</text>
					<input class="f-input" :type="see2?'text':'password'" v-model="newPwd" placeholder="请输入新密码（8-20位）" />
				</view>
				<view class="field">
					<text class="f-label">确认新密码</text>
					<input class="f-input" :type="see3?'text':'password'" v-model="confirmPwd" placeholder="请再次输入新密码" />
				</view>
				<view class="pwd-btn" @tap="handleChangePwd"><text>确认修改</text></view>
				<view class="pwd-cancel" @tap="closePwdModal"><text>取消</text></view>
			</view>
		</view>

		<!-- 退出登录弹窗 -->
		<view v-if="showLogoutModal" class="modal-mask" @tap="hideLogoutModal">
			<view class="modal-sheet" @tap.stop>
				<view class="drag-handle"></view>
				<view class="logout-icon">
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
				</view>
				<text class="logout-title">确认退出登录？</text>
				<text class="logout-desc">退出后需要重新登录才能访问</text>
				<view class="logout-confirm" @tap="handleLogout"><text>确认退出</text></view>
				<view class="logout-cancel" @tap="hideLogoutModal"><text>取消</text></view>
			</view>
		</view>

		<!-- Toast -->
		<view class="toast" :class="toastVisible?'toast-show':''">
			<view class="toast-inner">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
				<text>{{ toastMsg }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { useAuth } from '@/stores/auth.js'

	export default {
		data() {
			return {
				showPwdModal: false,
				showLogoutModal: false,
				see1: false, see2: false, see3: false,
				oldPwd: '', newPwd: '', confirmPwd: '',
				toastVisible: false, toastMsg: '',
				stats: { assessCount: 0, passRate: 0, joinDays: 0 },
			}
		},
		computed: {
			auth() { return useAuth() },
			userName() { return this.auth.state.userName || '员工' },
			userCode() { return this.auth.state.code || '' },
			deptName() { return this.auth.state.departmentName || '未知部门' },
			roleLabel() {
				const m = { 1: '部门总监', 2: '部门组长', 3: '部门员工' }
				return m[this.auth.state.role] || '员工'
			},
			initial() {
				const n = this.userName
				return n ? n.charAt(0) : '?'
			},
		},
		onShow() {
			this.$checkAuth()
			this.fetchStats()
		},
		methods: {
			async fetchStats() {
				try {
					const { api } = require('@/utils/api.js')
					const res = await api.get('/api/admin/staff/dashboard', null, { silent: true })
				if (res.data) {
					const d = res.data
					this.stats.assessCount = d.done_count + d.progress_count + d.pending_count
					this.stats.passRate = d.kpi_rate || 0
					this.stats.joinDays = d.join_days || 0
				}
			} catch (e) {}
			},
			goBack() {
				const pages = getCurrentPages()
				if (pages.length > 1) {
					uni.navigateBack()
				} else {
					const auth = useAuth()
					uni.navigateTo({ url: auth.getHomePage() })
				}
			},
			openPasswordModal() { this.showPwdModal = true },
			closePwdModal() { this.showPwdModal = false },
			openLogoutModal() { this.showLogoutModal = true },
			hideLogoutModal() { this.showLogoutModal = false },
			handleLogout() {
				const { logout } = useAuth()
				logout()
				uni.reLaunch({ url: '/pages/login/login' })
			},
			handleChangePwd() {
				if (!this.oldPwd) return this.showToast('请输入当前密码')
				if (!this.newPwd || this.newPwd.length < 8) return this.showToast('新密码需8-20位')
				if (this.newPwd !== this.confirmPwd) return this.showToast('两次密码不一致')
				this.closePwdModal()
				this.oldPwd = ''; this.newPwd = ''; this.confirmPwd = ''
				setTimeout(() => this.showToast('密码修改成功'), 300)
			},
			showToast(msg) {
				this.toastMsg = msg
				this.toastVisible = true
				clearTimeout(this._tt)
				this._tt = setTimeout(() => { this.toastVisible = false }, 2500)
			}
		}
	}
</script>

<style>
	.pg { width:100%; min-height:100vh; background:#f1f5f9; font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif; -webkit-font-smoothing:antialiased }

	/* Hero */
	.hero { position:relative; overflow:hidden }
	.hero-bg {
		position:absolute; top:0; left:0; right:0; bottom:0;
		background:linear-gradient(135deg, #1e3a5f 0%, #2d5a87 40%, #3b82f6 100%);
		border-radius:0 0 48rpx 48rpx;
	}
	.hero-body { position:relative; z-index:1; padding:80rpx 40rpx 48rpx; display:flex; flex-direction:column; align-items:center }
	.avatar-ring {
		width:160rpx; height:160rpx; border-radius:50%;
		background:linear-gradient(135deg, rgba(255,255,255,.25), rgba(255,255,255,.05));
		display:flex; align-items:center; justify-content:center; margin-bottom:24rpx;
		box-shadow:0 0 40rpx rgba(0,0,0,.15)
	}
	.avatar-inner {
		width:140rpx; height:140rpx; border-radius:50%;
		background:linear-gradient(135deg, rgba(255,255,255,.3), rgba(255,255,255,.1));
		display:flex; align-items:center; justify-content:center
	}
	.avatar-text { font-size:56rpx; font-weight:700; color:#fff; text-shadow:0 2rpx 8rpx rgba(0,0,0,.15) }
	.hero-name { font-size:40rpx; font-weight:700; color:#fff; margin-bottom:16rpx; letter-spacing:-0.02em }
	.hero-tags { display:flex; gap:16rpx; margin-bottom:12rpx }
	.htag { display:flex; align-items:center; gap:8rpx; padding:8rpx 20rpx; border-radius:9999rpx; font-size:22rpx; font-weight:500 }
	.htag-dept { background:rgba(255,255,255,.15); color:rgba(255,255,255,.9) }
	.htag-role { background:rgba(255,255,255,.2); color:#fff }
	.hero-code { font-size:22rpx; color:rgba(255,255,255,.45); margin-bottom:32rpx }

	/* Stats */
	.stats-row { display:flex; flex-direction:row; align-items:center; width:100%;
		background:rgba(255,255,255,.08); border-radius:24rpx; padding:24rpx 16rpx;
		border:1rpx solid rgba(255,255,255,.1)
	}
	.stat-item { flex:1; text-align:center }
	.stat-num { font-size:40rpx; font-weight:700; color:#fff; display:block; line-height:1.2 }
	.stat-label { font-size:20rpx; color:rgba(255,255,255,.5); display:block; margin-top:4rpx }
	.stat-div { width:1rpx; height:48rpx; background:rgba(255,255,255,.15) }

	/* Content */
	.content { padding:50rpx 0 }

	/* Section */
	.section { margin-bottom:24rpx }
	.sec-label { display:block; font-size:22rpx; font-weight:600; color:#94a3b8; margin:0 8rpx 16rpx; text-transform:uppercase; letter-spacing:.08em }
	.sec-card { background:#fff; border-radius:24rpx; overflow:hidden; box-shadow:0 1rpx 4rpx rgba(0,0,0,.04) }

	/* Menu Item */
	.menu-item { display:flex; align-items:center; padding:28rpx 32rpx }
	.menu-item:active { background:#f8fafc }
	.mi-div { height:1rpx; background:#f1f5f9; margin:0 32rpx }
	.mi-icon { width:72rpx; height:72rpx; border-radius:18rpx; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-right:20rpx }
	.mi-icon-id { background:#eff6ff; color:#3b82f6 }
	.mi-icon-dept { background:#f0fdf4; color:#22c55e }
	.mi-icon-role { background:#fef3c7; color:#f59e0b }
	.mi-icon-key { background:#fef2f2; color:#ef4444 }
	.mi-icon-cache { background:#f8fafc; color:#64748b }
	.mi-icon-info { background:#f5f3ff; color:#8b5cf6 }
	.mi-icon-thanks { background:#ffe4e6; color:#f43f5e }
	.mi-body { flex:1; min-width:0 }
	.mi-title { font-size:28rpx; font-weight:500; color:#1e293b; display:block }
	.mi-sub { font-size:20rpx; color:#94a3b8; margin-top:4rpx; display:block }
	.mi-arrow { flex-shrink:0 }

	/* Logout */
	.logout-btn {
		display:flex; align-items:center; justify-content:center; gap:12rpx;
		width:100%; height:100rpx; background:#fff; border-radius:24rpx;
		font-size:28rpx; font-weight:500; color:#ef4444; margin-bottom:32rpx;
		box-shadow:0 1rpx 4rpx rgba(0,0,0,.04)
	}
	.logout-btn:active { background:#fef2f2 }

	/* Modal Base */
	.modal-mask {
		position:fixed; top:0; left:0; right:0; bottom:0; z-index:200;
		background:rgba(15,23,42,.4); backdrop-filter:blur(4px);
		display:flex; align-items:flex-end
	}
	.modal-sheet { width:100%; background:#fff; border-radius:32rpx 32rpx 0 0; padding:0 48rpx 48rpx; padding-bottom:calc(48rpx + env(safe-area-inset-bottom)) }
	.drag-handle { width:64rpx; height:6rpx; border-radius:3rpx; background:#e2e8f0; margin:20rpx auto 32rpx }

	/* Pwd Fields */
	.modal-title { font-size:36rpx; font-weight:700; color:#0f172a; display:block; margin-bottom:8rpx }
	.modal-sub { font-size:24rpx; color:#94a3b8; display:block; margin-bottom:32rpx }
	.field { margin-bottom:24rpx; position:relative }
	.f-label { font-size:24rpx; font-weight:500; color:#475569; display:block; margin-bottom:12rpx }
	.f-input { width:100%; height:100rpx; background:#f8fafc; border:1rpx solid #e2e8f0; border-radius:18rpx; padding:0 32rpx; font-size:28rpx; color:#1e293b; box-sizing:border-box }
	.eye-btn { position:absolute; right:28rpx; bottom:26rpx }
	.pwd-btn { width:100%; height:100rpx; background:#3b82f6; border-radius:18rpx; display:flex; align-items:center; justify-content:center; font-size:28rpx; font-weight:600; color:#fff; margin-bottom:16rpx }
	.pwd-btn:active { opacity:.9 }
	.pwd-cancel { width:100%; height:100rpx; background:#f1f5f9; border-radius:18rpx; display:flex; align-items:center; justify-content:center; font-size:28rpx; font-weight:500; color:#64748b }
	.pwd-cancel:active { background:#e2e8f0 }

	/* Logout Modal */
	.logout-icon { width:112rpx; height:112rpx; border-radius:50%; background:#fef2f2; display:flex; align-items:center; justify-content:center; margin:8rpx auto 28rpx }
	.logout-title { font-size:32rpx; font-weight:700; color:#0f172a; display:block; text-align:center; margin-bottom:12rpx }
	.logout-desc { font-size:24rpx; color:#94a3b8; display:block; text-align:center; margin-bottom:40rpx }
	.logout-confirm { width:100%; height:100rpx; background:#ef4444; border-radius:18rpx; display:flex; align-items:center; justify-content:center; font-size:28rpx; font-weight:600; color:#fff; margin-bottom:16rpx }
	.logout-confirm:active { opacity:.9 }
	.logout-cancel { width:100%; height:100rpx; background:#f1f5f9; border-radius:18rpx; display:flex; align-items:center; justify-content:center; font-size:28rpx; font-weight:500; color:#64748b }
	.logout-cancel:active { background:#e2e8f0 }

	/* Toast */
	.toast { position:fixed; top:96rpx; left:50%; transform:translateX(-50%); z-index:300; opacity:0; transition:opacity .2s }
	.toast-show { opacity:1 }
	.toast-inner { display:flex; align-items:center; gap:10rpx; padding:20rpx 40rpx; border-radius:16rpx; background:rgba(15,23,42,.9); color:#fff; font-size:24rpx; font-weight:500 }

	.safe-btm { height:64rpx }
</style>
