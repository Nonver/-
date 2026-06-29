<template>
	<view class="pf-wrap">
		<!-- Header -->
		<view class="pf-bar">
			<view class="pf-back" @tap="goBack">
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</view>
			<text class="pf-title">个人中心</text>
			<view class="pf-back" style="visibility:hidden">
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</view>
		</view>

		<view class="pf-pg">
			<!-- 个人信息卡 -->
			<view class="pf-card">
				<view class="pf-avatar">
					<text class="pf-av-text">{{ initial }}</text>
				</view>
				<text class="pf-name">{{ userName }}</text>
				<view class="pf-tags">
					<view class="pf-tag pf-tag-dept">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
						</svg>
						<text>{{ deptName }}</text>
					</view>
					<view class="pf-tag pf-tag-role">{{ roleLabel }}</view>
				</view>
				<text class="pf-code">工号 {{ userCode }}</text>
			</view>

			<!-- 统计卡片 -->
			<view class="pf-stats">
				<view class="pfs-item">
					<text class="pfs-num pfs-amber">{{ joinDays }}</text>
					<text class="pfs-label">在岗天数</text>
				</view>
			</view>

			<!-- 菜单 -->
			<view class="pf-menu">
				<view class="pf-item" @tap="showToast('工号: '+userCode)">
					<view class="pf-item-icon pf-icon-id">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="1.5">
							<rect x="3" y="7" width="18" height="13" rx="2" />
							<path d="M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2" />
						</svg>
					</view>
					<view class="pf-item-body">
						<text class="pf-label">工号</text>
						<text class="pf-sub">{{ userCode }}</text>
					</view>
				</view>
				<view class="pf-div"></view>
				<view class="pf-item" @tap="showToast('部门: '+deptName)">
					<view class="pf-item-icon pf-icon-dept">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M2.25 21h19.5m-18-18v18m7.5-18v18m7.5-18v18" />
						</svg>
					</view>
					<view class="pf-item-body">
						<text class="pf-label">部门</text>
						<text class="pf-sub">{{ deptName }}</text>
					</view>
				</view>
				<view class="pf-div"></view>
				<view class="pf-item">
					<view class="pf-item-icon pf-icon-role">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="1.5">
							<circle cx="12" cy="8" r="5" />
							<path d="M3 21v-2a7 7 0 017-7h4a7 7 0 017 7v2" />
						</svg>
					</view>
					<view class="pf-item-body">
						<text class="pf-label">角色</text>
						<text class="pf-sub">{{ roleLabel }}</text>
					</view>
				</view>
				<view class="pf-div"></view>
				<view class="pf-item" @tap="showToast('缓存已清除')">
					<view class="pf-item-icon pf-icon-cache">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
						</svg>
					</view>
					<view class="pf-item-body">
						<text class="pf-label">清除缓存</text>
						<text class="pf-sub">释放本地存储空间</text>
					</view>
				</view>
			</view>

			<view class="pf-menu" style="margin-top:16rpx">
				<view class="pf-item" @tap="showPwdModal = true">
					<view class="pf-item-icon pf-icon-key">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="1.5">
							<rect x="3" y="11" width="18" height="11" rx="2" />
							<path d="M7 11V7a5 5 0 0110 0v4" />
						</svg>
					</view>
					<view class="pf-item-body">
						<text class="pf-label">修改密码</text>
						<text class="pf-sub">定期更新密码保障安全</text>
					</view>
					<text class="pf-arr">&rsaquo;</text>
				</view>
				<view class="pf-div"></view>
				<view class="pf-item" @tap="doLogout">
					<view class="pf-item-icon pf-icon-logout">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
							stroke-width="1.5">
							<path
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
					</view>
					<view class="pf-item-body">
						<text class="pf-label pf-logout">退出登录</text>
						<text class="pf-sub pf-sub-logout">退出后需要重新登录</text>
					</view>
					<text class="pf-arr pf-arr-red">&rsaquo;</text>
				</view>
			</view>

			<view class="pf-ver">v2.0.2 &middot; 绩效管理系统</view>
		</view>

		<!-- 修改密码弹窗 -->
		<view v-if="showPwdModal" class="pwd-mask" @tap="closePwdModal">
			<view class="pwd-sheet" @tap.stop>
				<view class="pwd-hd">
					<text class="pwd-title">修改密码</text>
					<text class="pwd-sub">验证当前密码后设置新密码</text>
				</view>
				<view class="pwd-field">
					<text class="pwd-label">当前密码</text>
					<view class="pwd-input-row">
						<input class="pwd-input" :type="seeOld?'text':'password'" v-model="oldPwd"
							placeholder="请输入当前密码" />
						<view class="pwd-eye" @tap="seeOld=!seeOld">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
								:stroke="seeOld?'#3b82f6':'#94a3b8'" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</view>
					</view>
				</view>
				<view class="pwd-field">
					<text class="pwd-label">新密码</text>
					<view class="pwd-input-row">
						<input class="pwd-input" :type="seeNew?'text':'password'" v-model="newPwd"
							placeholder="8-20位，字母/数字组合" />
						<view class="pwd-eye" @tap="seeNew=!seeNew">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
								:stroke="seeNew?'#3b82f6':'#94a3b8'" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</view>
					</view>
				</view>
				<view class="pwd-field">
					<text class="pwd-label">确认新密码</text>
					<view class="pwd-input-row">
						<input class="pwd-input" :type="seeConfirm?'text':'password'" v-model="confirmPwd"
							placeholder="请再次输入新密码" />
						<view class="pwd-eye" @tap="seeConfirm=!seeConfirm">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
								:stroke="seeConfirm?'#3b82f6':'#94a3b8'" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</view>
					</view>
				</view>
				<view class="pwd-actions">
					<view class="pwd-btn pwd-btn-confirm" :class="submitting?'pwd-btn-disabled':''"
						@tap="handleChangePwd"><text>{{ submitting ? '提交中...' : '确认修改' }}</text></view>
					<view class="pwd-btn pwd-btn-cancel" @tap="closePwdModal"><text>取消</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		useAuth,
		ROLE_LABELS
	} from '@/stores/auth.js'
	import {
		api
	} from '@/utils/api.js'

	export default {
		data() {
			return {
				userName: '',
				deptName: '',
				roleLabel: '',
				joinDays: 0,
				showPwdModal: false,
				seeOld: false,
				seeNew: false,
				seeConfirm: false,
				oldPwd: '',
				newPwd: '',
				confirmPwd: '',
				submitting: false,
			}
		},
		computed: {
			initial() {
				const n = this.userName
				return n ? n.charAt(0) : '?'
			},
			userCode() {
				const auth = useAuth()
				return auth.state.code || ''
			},
		},
		onShow() {
			this.fetchProfile()
		},
		methods: {
			goBack() {
				const pages = getCurrentPages()
				if (pages.length > 1) {
					uni.navigateBack({ delta: 1 })
				} else {
					const auth = useAuth()
					uni.reLaunch({ url: auth.getHomePage() })
				}
			},
			async fetchProfile() {
				try {
					const auth = useAuth()
					const u = auth.state
					this.userName = u.userName || '员工'
					this.deptName = u.departmentName || ''
					this.roleLabel = ROLE_LABELS[u.role] || ''
					// 获取在岗天数
					const res = await api.get('/api/admin/staff/dashboard', null, {
						silent: true
					})
					if (res.data) {
						this.joinDays = res.data.join_days || 0
					}
				} catch (e) {}
			},
			closePwdModal() {
				this.showPwdModal = false
				this.oldPwd = '';
				this.newPwd = '';
				this.confirmPwd = ''
			},
			async handleChangePwd() {
				if (!this.oldPwd) return uni.showToast({
					title: '请输入当前密码',
					icon: 'none'
				})
				if (!this.newPwd || this.newPwd.length < 8 || this.newPwd.length > 20) return uni.showToast({
					title: '新密码需8-20位',
					icon: 'none'
				})
				if (this.newPwd !== this.confirmPwd) return uni.showToast({
					title: '两次密码不一致',
					icon: 'none'
				})
				this.submitting = true
				try {
					await api.post('/api/admin/auth/change-password', {
						old_password: this.oldPwd,
						new_password: this.newPwd
					})
					uni.showToast({
						title: '密码修改成功',
						icon: 'success'
					})
					this.closePwdModal()
				} catch (e) {
					uni.showToast({
						title: e.message || '修改失败',
						icon: 'none'
					})
				}
				this.submitting = false
			},
			doLogout() {
				uni.showModal({
					title: '确认退出',
					content: '退出后需要重新登录，确认退出？',
					confirmText: '退出',
					confirmColor: '#ef4444',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							uni.removeStorageSync('api_token')
							uni.removeStorageSync('auth_state')
							uni.reLaunch({
								url: '/pages/login/login'
							})
						}
					}
				})
			},
			showToast(msg) {
				uni.showToast({
					title: msg,
					icon: 'none'
				})
			},
		},
	}
</script>

<style>
	.pf-wrap {
		min-height: 100vh;
		background: #f1f5f9
	}

	.pf-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 12rpx;
		height: 88rpx;
		background: #fff;
		border-bottom: 1rpx solid #e2e8f0
	}

	.pf-back {
		width: 64rpx;
		height: 64rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%
	}

	.pf-back:active {
		background: #f1f5f9
	}

	.pf-title {
		font-size: 30rpx;
		font-weight: 600;
		color: #0f172a
	}

	.pf-pg {
		padding: 0 30rpx;
		margin-top: 30rpx;
		padding-bottom: 40rpx
	}

	.pf-card {
		background: #fff;
		border-radius: 20rpx;
		padding: 40rpx 32rpx;
		text-align: center;
		margin-bottom: 20rpx;
		box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, .04)
	}

	.pf-avatar {
		width: 96rpx;
		height: 96rpx;
		margin: 0 auto 20rpx;
		background: linear-gradient(135deg, #3b82f6, #2563eb);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 16rpx rgba(59, 130, 246, .3)
	}

	.pf-av-text {
		font-size: 40rpx;
		font-weight: 700;
		color: #fff
	}

	.pf-name {
		display: block;
		font-size: 40rpx;
		font-weight: 700;
		color: #0f172a;
		margin-bottom: 14rpx
	}

	.pf-tags {
		display: flex;
		justify-content: center;
		gap: 12rpx;
		margin-bottom: 10rpx
	}

	.pf-tag {
		display: flex;
		align-items: center;
		gap: 6rpx;
		font-size: 18rpx;
		color: #64748b;
		background: #f1f5f9;
		padding: 6rpx 16rpx;
		border-radius: 8rpx
	}

	.pf-tag-role {
		color: #2563eb;
		background: #eff6ff
	}

	.pf-code {
		font-size: 20rpx;
		color: #94a3b8;
		display: block
	}

	.pf-stats {
		display: flex;
		background: #fff;
		border-radius: 20rpx;
		padding: 28rpx 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, .04)
	}

	.pfs-item {
		flex: 1;
		text-align: center
	}

	.pfs-num {
		font-size: 36rpx;
		font-weight: 700;
		color: #1e293b;
		display: block;
		line-height: 1.2
	}

	.pfs-amber {
		color: #f59e0b
	}

	.pfs-label {
		font-size: 20rpx;
		color: #94a3b8;
		font-weight: 500;
		margin-top: 4rpx;
		display: block
	}

	.pf-menu {
		background: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, .04)
	}

	.pf-item {
		display: flex;
		align-items: center;
		padding: 24rpx 28rpx
	}

	.pf-item:active {
		background: #f8fafc
	}

	.pf-div {
		height: 1rpx;
		background: #f1f5f9;
		margin: 0 28rpx
	}

	.pf-item-icon {
		width: 64rpx;
		height: 64rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
		flex-shrink: 0
	}

	.pf-icon-id {
		background: #eff6ff;
		color: #3b82f6
	}

	.pf-icon-dept {
		background: #f0fdf4;
		color: #22c55e
	}

	.pf-icon-role {
		background: #fef3c7;
		color: #f59e0b
	}

	.pf-icon-cache {
		background: #f8fafc;
		color: #64748b
	}

	.pf-icon-key {
		background: #fef2f2;
		color: #ef4444
	}

	.pf-icon-logout {
		background: #fef2f2;
		color: #ef4444
	}

	.pf-item-body {
		flex: 1;
		min-width: 0
	}

	.pf-label {
		font-size: 28rpx;
		color: #334155;
		display: block
	}

	.pf-sub {
		font-size: 20rpx;
		color: #94a3b8;
		margin-top: 2rpx;
		display: block
	}

	.pf-logout {
		color: #ef4444
	}

	.pf-sub-logout {
		color: #fca5a5
	}

	.pf-arr {
		font-size: 28rpx;
		color: #cbd5e1;
		flex-shrink: 0
	}

	.pf-arr-red {
		color: #fca5a5
	}

	.pf-ver {
		text-align: center;
		padding: 40rpx 0;
		font-size: 22rpx;
		color: #cbd5e1
	}

	/* 修改密码弹窗 */
	.pwd-mask {
		position: fixed;
		inset: 0;
		z-index: 999;
		background: rgba(0, 0, 0, .45);
		display: flex;
		align-items: flex-end;
		justify-content: center
	}

	.pwd-sheet {
		width: 100%;
		background: #fff;
		border-radius: 28rpx 28rpx 0 0;
		padding: 40rpx 36rpx 60rpx
	}

	.pwd-hd {
		margin-bottom: 32rpx
	}

	.pwd-title {
		font-size: 34rpx;
		font-weight: 700;
		color: #0f172a;
		display: block
	}

	.pwd-sub {
		font-size: 24rpx;
		color: #94a3b8;
		margin-top: 6rpx;
		display: block
	}

	.pwd-field {
		margin-bottom: 24rpx
	}

	.pwd-label {
		font-size: 26rpx;
		color: #475569;
		font-weight: 500;
		margin-bottom: 10rpx;
		display: block
	}

	.pwd-input-row {
		display: flex;
		align-items: center;
		background: #f8fafc;
		border: 1rpx solid #e2e8f0;
		border-radius: 14rpx;
		overflow: hidden
	}

	.pwd-input {
		flex: 1;
		height: 80rpx;
		padding: 0 24rpx;
		font-size: 28rpx;
		color: #1e293b
	}

	.pwd-eye {
		width: 72rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0
	}

	.pwd-actions {
		margin-top: 36rpx
	}

	.pwd-btn {
		height: 88rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		font-weight: 600
	}

	.pwd-btn:active {
		opacity: .8
	}

	.pwd-btn-confirm {
		background: #2563eb;
		color: #fff;
		margin-bottom: 16rpx
	}

	.pwd-btn-disabled {
		opacity: .5;
		pointer-events: none
	}

	.pwd-btn-cancel {
		background: #f1f5f9;
		color: #64748b
	}
</style>