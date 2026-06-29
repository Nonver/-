<template>
	<view class="pg">
		<!-- 顶栏 -->
		<view class="topbar">
			<view class="topbar-inner">
				<view class="back-btn" @tap="goBack">
					<svg class="s16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="15 18 9 12 15 6"/>
					</svg>
				</view>
				<text class="t16 fw6">考核管理</text>
				<view style="width:60rpx"></view>
			</view>
		</view>

		<view class="main">
			<!-- 搜索 + 筛选 -->
			<view class="search-row">
				<view class="search-input-wrap">
					<svg class="s14 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
					</svg>
					<input class="search-input" v-model="keyword" placeholder="搜索部门名称..." @input="onSearchInput"/>
				</view>
			</view>

			<view class="filter-row">
				<view class="filter-item" @tap="openDeptPicker">
					<text class="filter-label">{{ selectedDeptName || '全部部门' }}</text>
					<svg class="s12 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="6 9 12 15 18 9"/>
					</svg>
				</view>
				<view class="filter-item">
					<picker mode="date" fields="month" :value="period" @change="onPeriodChange">
						<text class="filter-label">{{ period || '全部周期' }}</text>
						<svg class="s12 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
						</svg>
					</picker>
				</view>
				<view class="reset-btn" @tap="resetFilter" v-if="keyword || period || selectedDeptId">
					<text>重置</text>
				</view>
			</view>

			<!-- 列表 -->
			<view v-if="list.length > 0">
				<view v-for="(it, idx) in list" :key="it.id" class="card" :style="{marginBottom: idx < list.length-1 ? '20rpx' : '0'}">
					<view class="card-hd">
						<view class="card-title-row">
							<text class="card-title">{{ it.dept_name }}</text>
							<text class="status-tag" :class="'st-'+it.manager_audit_cls">{{ it.manager_audit_text }}</text>
						</view>
						<text class="card-cycle">{{ it.assess_cycle }}</text>
					</view>
					<view class="card-body">
						<text class="card-desc">{{ it.target_remark || '暂无考核目标描述' }}</text>
					</view>
					<view class="card-ft">
						<text class="card-time">发布: {{ fmtTime(it.publish_time) }}</text>
						<view class="card-actions">
							<view class="act-btn edit" @tap="goEdit(it)">
								<svg class="s12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
									<path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
								</svg>
								<text>编辑</text>
							</view>
							<view class="act-btn del" @tap="confirmDelete(it)">
								<svg class="s12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
								</svg>
								<text>删除</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view v-else-if="!loading" class="empty-state">
				<view class="empty-icon-wrap">
					<svg class="s32 slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
						<polyline points="14 2 14 8 20 8"/>
						<line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
					</svg>
				</view>
				<text class="empty-text">暂无总经已审核的考核</text>
			</view>

			<!-- 加载更多 -->
			<view v-if="hasMore && list.length > 0" class="load-more" @tap="loadMore">
				<text v-if="!loadingMore">加载更多</text>
				<text v-else>加载中...</text>
			</view>
			<view v-if="!hasMore && list.length > 0" class="load-end">
				<text>— 已加载全部 —</text>
			</view>
		</view>

		<!-- 部门选择弹窗 -->
		<view v-if="deptPickerVisible" class="modal-mask" @tap="closeDeptPicker">
			<view class="modal-card" @tap.stop>
				<view class="modal-hd">
					<text class="modal-title">选择部门</text>
					<view class="modal-close" @tap="closeDeptPicker">
						<svg class="s16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
						</svg>
					</view>
				</view>
				<view class="modal-dept-list">
					<view class="dept-opt" :class="{'dept-opt-on': selectedDeptId === 0}" @tap="selectDept(0, '全部部门')">
						<text>全部部门</text>
						<svg v-if="selectedDeptId === 0" class="s14 green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
					</view>
					<view v-for="d in departments" :key="d.id" class="dept-opt" :class="{'dept-opt-on': selectedDeptId === d.id}" @tap="selectDept(d.id, d.dept_name)">
						<text>{{ d.dept_name }}</text>
						<svg v-if="selectedDeptId === d.id" class="s14 green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
					</view>
				</view>
			</view>
		</view>

		<!-- 删除确认弹窗 -->
		<view v-if="deleteVisible" class="modal-mask" @tap="closeDeleteModal">
			<view class="modal-card" @tap.stop>
				<view class="modal-hd">
					<text class="modal-title">确认删除</text>
					<view class="modal-close" @tap="closeDeleteModal">
						<svg class="s16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
						</svg>
					</view>
				</view>
				<view class="delete-warn">
					<svg class="s24 red" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
						<line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
					</svg>
					<text class="delete-text">确定要删除「{{ deletingItem.dept_name }}」的考核记录吗？此操作不可恢复，将同时删除关联的员工考核数据。</text>
				</view>
				<view class="modal-actions">
					<view class="ma-cancel" @tap="closeDeleteModal">取消</view>
					<view class="ma-confirm-del" :class="{'ma-disabled': submitting}" @tap="submitDelete">{{ submitting ? '删除中...' : '确认删除' }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { api } from '@/utils/api.js'

	export default {
		data() {
			return {
				keyword: '',
				period: '',
				selectedDeptId: 0,
				selectedDeptName: '',
				departments: [],
				list: [],
				page: 1,
				total: 0,
				perPage: 10,
				loading: false,
				loadingMore: false,
				searchTimer: null,

				// 部门选择弹窗
				deptPickerVisible: false,

				// 删除确认弹窗
				deleteVisible: false,
				deletingItem: {},
				submitting: false,
			}
		},
		computed: {
			hasMore() {
				return this.page * this.perPage < this.total
			}
		},
		onShow() {
			this.$checkAuth()
			this.fetchData()
		},
		methods: {
			goBack() { uni.navigateBack() },

			fmtTime(t) {
				if (!t) return ''
				const d = new Date(t)
				const y = d.getFullYear()
				const m = String(d.getMonth()+1).padStart(2,'0')
				const day = String(d.getDate()).padStart(2,'0')
				return y + '-' + m + '-' + day
			},

			async fetchData(reset = true) {
				if (this.loading || this.loadingMore) return
				if (reset) {
					this.page = 1
					this.loading = true
				} else {
					this.loadingMore = true
				}

				try {
					const params = {
						page: this.page,
						keyword: this.keyword,
						period: this.period,
						dept_id: this.selectedDeptId || undefined,
					}
					const res = await api.get('/api/admin/hr/assessments/manage', params, { silent: true })
					if (res.code === 200 && res.data) {
						if (reset) {
							this.list = res.data.list || []
						} else {
							this.list = this.list.concat(res.data.list || [])
						}
						this.total = res.data.total || 0
						this.perPage = res.data.per_page || 10
						this.departments = res.data.departments || []
					}
				} catch (e) {
					console.error('[考核管理] 数据获取失败:', e)
				} finally {
					this.loading = false
					this.loadingMore = false
				}
			},

			loadMore() {
				if (!this.hasMore || this.loadingMore) return
				this.page++
				this.fetchData(false)
			},

			onSearchInput(e) {
				clearTimeout(this.searchTimer)
				this.keyword = e.detail.value
				this.searchTimer = setTimeout(() => {
					this.fetchData()
				}, 400)
			},

			onPeriodChange(e) {
				this.period = e.detail.value
				this.$nextTick(() => this.fetchData())
			},

			openDeptPicker() {
				this.deptPickerVisible = true
			},
			closeDeptPicker() {
				this.deptPickerVisible = false
			},
			selectDept(id, name) {
				this.selectedDeptId = id
				this.selectedDeptName = name
				this.deptPickerVisible = false
				this.fetchData()
			},

			resetFilter() {
				this.keyword = ''
				this.period = ''
				this.selectedDeptId = 0
				this.selectedDeptName = ''
				this.fetchData()
			},

			/* 编辑 - 跳转至完整编辑页 */
			goEdit(item) {
				uni.navigateTo({
					url: '/pages/assess-manage/assess-manage-edit?id=' + item.id
				})
			},

			/* 删除 */
			confirmDelete(item) {
				this.deletingItem = item
				this.deleteVisible = true
			},
			closeDeleteModal() {
				this.deleteVisible = false
				this.deletingItem = {}
			},
			async submitDelete() {
				if (this.submitting) return
				this.submitting = true
				try {
					const res = await api.delete('/api/admin/hr/assessments/' + this.deletingItem.id, { silent: true })
					if (res.code === 200) {
						uni.showToast({ title: '删除成功', icon: 'success' })
						this.deleteVisible = false
						this.fetchData()
					}
				} catch (e) {
					console.error('[考核管理] 删除失败:', e)
				} finally {
					this.submitting = false
				}
			},
		}
	}
</script>

<style>
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #F1F5F9;
		padding-bottom: 60rpx;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased;
	}

	.t10 { font-size: 20rpx; }
	.t12 { font-size: 24rpx; }
	.t14 { font-size: 28rpx; }
	.t16 { font-size: 32rpx; }
	.fw6 { font-weight: 600; }
	.mu { color: #94A3B8; }
	.red { color: #EF4444; }
	.green { color: #059669; }

	.s12 { width: 24rpx; height: 24rpx; flex-shrink: 0; }
	.s14 { width: 28rpx; height: 28rpx; flex-shrink: 0; }
	.s16 { width: 32rpx; height: 32rpx; flex-shrink: 0; }
	.s24 { width: 48rpx; height: 48rpx; flex-shrink: 0; }
	.s32 { width: 64rpx; height: 64rpx; flex-shrink: 0; }
	.slate-300 { color: #CBD5E1; }

	/* 顶栏 */
	.topbar {
		position: sticky; top: 0; z-index: 50;
		background: rgba(255,255,255,.85);
		border-bottom: 1rpx solid rgba(226,232,240,.6);
	}
	.topbar-inner {
		display: flex; align-items: center; justify-content: space-between;
		padding: 24rpx 32rpx;
	}
	.back-btn {
		width: 60rpx; height: 60rpx; border-radius: 20rpx;
		background: #F8FAFC; display: flex; align-items: center; justify-content: center;
	}

	.main { padding: 0 32rpx; }

	/* 搜索 */
	.search-row {
		margin-top: 24rpx;
	}
	.search-input-wrap {
		display: flex; align-items: center; gap: 16rpx;
		background: #fff; border: 1rpx solid rgba(226,232,240,.8);
		border-radius: 24rpx; padding: 20rpx 28rpx;
	}
	.search-input {
		flex: 1; font-size: 26rpx; color: #0F172A;
	}

	/* 筛选 */
	.filter-row {
		display: flex; align-items: center; gap: 16rpx;
		margin-top: 20rpx; margin-bottom: 24rpx; flex-wrap: wrap;
	}
	.filter-item {
		display: flex; align-items: center; gap: 8rpx;
		padding: 14rpx 24rpx; border-radius: 20rpx;
		background: #fff; border: 1rpx solid rgba(226,232,240,.8);
	}
	.filter-label {
		font-size: 24rpx; color: #475569;
	}
	.reset-btn {
		padding: 14rpx 24rpx; border-radius: 20rpx;
		background: #E0E7FF; color: #4F46E5;
		font-size: 24rpx; font-weight: 500;
	}

	/* 卡片 */
	.card {
		background: #fff; border: 1rpx solid rgba(226,232,240,.8);
		border-radius: 28rpx; padding: 28rpx;
	}
	.card-hd { margin-bottom: 16rpx; }
	.card-title-row {
		display: flex; align-items: center; gap: 16rpx; margin-bottom: 6rpx;
	}
	.card-title {
		font-size: 28rpx; font-weight: 600; color: #0F172A;
	}
	.card-cycle {
		font-size: 24rpx; color: #94A3B8;
	}
	.card-body { margin-bottom: 16rpx; }
	.card-desc {
		font-size: 26rpx; color: #334155; line-height: 1.6;
	}
	.card-ft {
		display: flex; justify-content: space-between; align-items: center;
		border-top: 1rpx solid #f1f5f9; padding-top: 16rpx;
	}
	.card-time { font-size: 22rpx; color: #94A3B8; }
	.card-actions { display: flex; gap: 16rpx; }

	.act-btn {
		display: inline-flex; align-items: center; gap: 6rpx;
		padding: 10rpx 20rpx; border-radius: 16rpx;
		font-size: 22rpx; font-weight: 500;
	}
	.act-btn.edit { background: #EEF2FF; color: #4F46E5; }
	.act-btn.del { background: #FEF2F2; color: #EF4444; }

	/* 状态标签 */
	.status-tag {
		display: inline-flex; padding: 6rpx 18rpx; border-radius: 999rpx;
		font-size: 22rpx; font-weight: 600;
	}
	.st-pass { background: #D1FAE5; color: #065F46; }
	.st-reject { background: #FEE2E2; color: #991B1B; }
	.st-unknown { background: #F1F5F9; color: #475569; }

	/* 加载更多 */
	.load-more {
		text-align: center; padding: 32rpx 0;
		font-size: 26rpx; color: #4F46E5; font-weight: 500;
	}
	.load-end {
		text-align: center; padding: 32rpx 0;
		font-size: 24rpx; color: #CBD5E1;
	}

	/* 空状态 */
	.empty-state {
		display: flex; flex-direction: column; align-items: center;
		padding: 100rpx 32rpx; background: #fff;
		border: 1rpx solid rgba(226,232,240,.8); border-radius: 32rpx;
	}
	.empty-icon-wrap {
		width: 120rpx; height: 120rpx; border-radius: 50%;
		background: #f1f5f9; display: flex;
		align-items: center; justify-content: center; margin-bottom: 24rpx;
	}
	.empty-text { font-size: 26rpx; color: #94A3B8; }

	/* 弹窗通用 */
	.modal-mask {
		position: fixed; top: 0; left: 0; right: 0; bottom: 0;
		z-index: 999; background: rgba(15,23,42,.5);
		backdrop-filter: blur(8rpx); -webkit-backdrop-filter: blur(8rpx);
		display: flex; align-items: flex-end; justify-content: center;
	}
	.modal-card {
		width: 100%; background: #fff;
		border-radius: 40rpx 40rpx 0 0;
		padding: 40rpx 32rpx;
		padding-bottom: calc(40rpx + env(safe-area-inset-bottom, 0px));
		max-height: 80vh; overflow-y: auto;
	}
	.modal-hd {
		display: flex; align-items: center; justify-content: space-between;
		margin-bottom: 32rpx;
	}
	.modal-title { font-size: 32rpx; font-weight: 700; color: #0F172A; }
	.modal-close {
		width: 60rpx; height: 60rpx; border-radius: 50%;
		background: #F1F5F9; display: flex; align-items: center; justify-content: center;
	}
	.modal-dept-list { display: flex; flex-direction: column; gap: 8rpx; margin-bottom: 16rpx; }
	.dept-opt {
		display: flex; justify-content: space-between; align-items: center;
		padding: 28rpx 24rpx; border-radius: 20rpx;
		border: 2rpx solid rgba(226,232,240,.8);
		font-size: 28rpx; color: #0F172A;
	}
	.dept-opt-on { border-color: #4F46E5; background: #F8FAFF; }

	/* 删除确认 */
	.delete-warn {
		display: flex; flex-direction: column; align-items: center;
		padding: 32rpx 24rpx; margin-bottom: 32rpx;
		background: #FEF2F2; border-radius: 20rpx;
	}
	.delete-text {
		font-size: 26rpx; color: #991B1B; text-align: center;
		margin-top: 20rpx; line-height: 1.6;
	}

	.modal-actions { display: flex; gap: 24rpx; }
	.ma-cancel {
		flex: 1; text-align: center; padding: 28rpx 0;
		border-radius: 24rpx; background: #F1F5F9;
		font-size: 28rpx; font-weight: 600; color: #64748B;
	}
	.ma-confirm {
		flex: 2; text-align: center; padding: 28rpx 0;
		border-radius: 24rpx; background: #4F46E5;
		font-size: 28rpx; font-weight: 600; color: #fff;
	}
	.ma-confirm-del {
		flex: 2; text-align: center; padding: 28rpx 0;
		border-radius: 24rpx; background: #EF4444;
		font-size: 28rpx; font-weight: 600; color: #fff;
	}
	.ma-disabled { opacity: .5; pointer-events: none; }
</style>
