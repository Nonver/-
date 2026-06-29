<template>
	<!-- <view class="pg"> -->
		<view>

		<!-- 顶部导航 -->
		<view class="topbar">
			<view class="topbar-inner">
				<view class="tbl">
					<view class="tbl-icon">
						<svg class="s20 white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					</view>
				<view>
					<text class="t15 fw6">{{ pageTitle }}</text>
					<text class="t11 mu">{{ deptName }} · 数据隔离中</text>
				</view>
				</view>
				<view class="ava-wrap">
					<view class="ava-dot"></view>
					<view class="ava-ph">
						<svg class="s20 gray" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</view>
				</view>
			</view>
		</view>

		<view class="main">

			<!-- 快捷入口 -->
			<view class="sec shortcuts">
				<!-- <view class="qb" @tap="onPublish">
					<view class="qb-deco qb-deco-warm"></view>
					<view class="icon-box icon-box-warm">
						<svg class="s18 warm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
								d="M12 4v16m8-8H4" />
						</svg>
					</view>
					<text class="t13 fw6">考核发布</text>
					<text class="t11 mu" style="margin-top:2rpx">新建考核任务</text>
				</view> -->
				<view class="qb" @tap="onAnchor">
					<view class="qb-deco qb-deco-dark"></view>
					<view class="icon-box icon-box-dark">
						<svg class="s18 dark" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</view>
					<text class="t13 fw6">兼职主播管理</text>
					<text class="t11 mu" style="margin-top:2rpx">人员调配与审核</text>
				</view>
			</view>

			<!-- 考核概览 -->
			<view class="sec">
				<view class="sechd">
					<text class="t13 fw6">考核概览</text>
					<text class="t11 mu">本部门数据</text>
				</view>
				<view class="stats3">
					<view class="sc" :class="{'shimmer-card': assessList.some(a=>a.status===1)}">
						<view class="sc-inner">
							<view class="sc-top">
								<view class="sd sda"></view>
								<text class="t10 mu">待审核</text>
							</view>
							<text class="sn">{{ assessStats.pending }}</text>
							<text class="t10 mu" style="margin-top:6rpx">当前待处理</text>
						</view>
					</view>
					<view class="sc">
						<view class="sc-top">
							<view class="sd sdb"></view>
							<text class="t10 mu">已下发</text>
						</view>
						<text class="sn">{{ assessStats.published }}</text>
						<text class="t10 mu" style="margin-top:6rpx">累计发布</text>
					</view>
					<view class="sc">
						<view class="sc-top">
							<view class="sd sdg"></view>
							<text class="t10 mu">已完结</text>
						</view>
						<text class="sn">{{ assessStats.completed }}</text>
						<text class="t10 mu" style="margin-top:6rpx">审核通过</text>
					</view>
				</view>
			</view>

			<!-- 人员规模 -->
			<view class="sec">
				<view class="sechd">
					<text class="t13 fw6">人员规模</text>
					<text class="t11 mu">实时统计</text>
				</view>
				<view class="stats2">
					<view class="pc" @tap="goPersonnel">
						<view class="pc-top">
							<view>
								<text class="t10 mu" style="margin-bottom:8rpx;display:block">部门在岗人数</text>
								<text class="pn">{{ personnelStats.deptMembers }}</text>
							</view>
							<view class="pc-icon">
								<svg class="s20 gray" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
							</view>
						</view>
						<view class="pc-bar">
							<view class="pc-bar-in pc-bar-dark" style="width:78%"></view>
						</view>
						<text class="t10 mu" style="margin-top:8rpx;display:block">78% 满编</text>
					</view>
					<view class="pc">
						<view class="pc-top">
							<view>
								<text class="t10 mu" style="margin-bottom:8rpx;display:block">在职兼职主播</text>
								<text class="pn">{{ personnelStats.parttimeAnchors }}</text>
							</view>
							<view class="pc-icon pc-icon-warm">
								<svg class="s20 warm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
										d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
								</svg>
							</view>
						</view>
						<view class="pc-bar">
							<view class="pc-bar-in pc-bar-warm" style="width:62%"></view>
						</view>
						<text class="t10 mu" style="margin-top:8rpx;display:block">62% 活跃</text>
					</view>
				</view>
			</view>

			<!-- 主播流转 -->
			<view class="sec">
				<view class="sechd">
					<text class="t13 fw6">主播流转</text>
					<text class="t11 mu">中转部数据</text>
				</view>
				<view class="stats4">
					<view class="tc">
						<text class="t10 mu">今日招募</text>
						<text class="tn tn-blue">{{ transferStats.todayRecruit || 0 }}</text>
					</view>
					<view class="tc">
						<text class="t10 mu">维护中</text>
						<text class="tn tn-purple">{{ transferStats.maintainingCount || 0 }}</text>
					</view>
					<view class="tc">
						<text class="t10 mu">待流转</text>
						<text class="tn tn-amber">{{ transferStats.pendingTransfer || 0 }}</text>
					</view>
					<view class="tc">
						<text class="t10 mu">已流失</text>
						<text class="tn tn-red">{{ transferStats.lostCount || 0 }}</text>
					</view>
				</view>
				<!-- 最近流转记录 -->
				<view class="list-card" style="margin-top:20rpx" v-if="transferList.length > 0">
					<view v-for="(t, idx) in transferList" :key="t.id">
						<view v-if="idx>0" class="ln"></view>
						<view class="lr" @tap="onTransferItem(t)">
							<view class="lr-icon" :class="t.lose_status==1?'bg-red':t.transfer_status==1?'bg-g':'bg-z'">
								<text class="lr-txt">{{ (t.anchor_name || '?').charAt(0) }}</text>
							</view>
							<view class="lr-mid">
								<view class="lr-mid-top">
									<text class="t13 fw5">{{ t.anchor_name || '-' }}</text>
									<text class="tag" :class="t.lose_status==1?'tag-red':t.transfer_status==1?'tag-green':'tag-def'">
										{{ t.lose_status==1?'已流失':t.transfer_status==1?'已流转':'维护中' }}
									</text>
								</view>
								<text class="t11 mu">{{ t.agent_name || '-' }} · {{ t.follow_record ? '有跟进记录' : '暂无跟进' }}</text>
							</view>
							<svg class="s16 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
							</svg>
						</view>
					</view>
				</view>
			</view>

			<!-- 待提交考核列表 -->
			<view class="sec">
				<view class="sechd">
					<view class="sechd-l">
						<text class="t13 fw6">待提交考核</text>
						<text class="tag tag-amber" v-if="assessList.length">{{ assessList.length }} 项待处理</text>
					</view>
					<view class="sechd-r" @tap="goToAssessment">
						<text class="t11 mu">查看全部</text>
						<svg class="s14 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</view>
				</view>
				<view class="list-card" v-if="assessList.length > 0">
					<view v-for="(it, idx) in assessList" :key="it.id">
						<view v-if="idx>0" class="ln"></view>
						<view class="lr" :class="{'lr-hl':it.hl,'lr-dim':it.dim}" @tap="onAssessItem(it)">
							<view class="lr-icon" :class="it.iconBg">
								<text v-if="it.icon==='txt'" class="lr-txt">{{ it.iconTxt }}</text>
								<svg v-else class="s20" :class="it.iconCls" viewBox="0 0 24 24" fill="none"
									stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
										:d="it.iconD" />
								</svg>
							</view>
							<view class="lr-mid">
								<view class="lr-mid-top">
									<text class="t13 fw5" :class="{'t-strike':it.dim}">{{ it.title }}</text>
									<text v-if="it.badge" class="tag" :class="it.badgeCls">{{ it.badge }}</text>
								</view>
								<text class="t11 mu" style="margin-top:2rpx">{{ it.sub }}</text>
							</view>
							<svg v-if="!it.dim" class="s16 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M9 5l7 7-7 7" />
							</svg>
						</view>
					</view>
				</view>
				<view v-else class="list-card" style="padding:48rpx 32rpx;text-align:center">
					<text class="t11 mu">暂无考核记录</text>
				</view>
			</view>

			<!-- 新增招募待办 -->
			<view class="sec">
				<view class="sechd">
					<view class="sechd-l">
						<text class="t13 fw6">新增招募待办</text>
						<text class="tag tag-blue" v-if="recruitList.length">{{ recruitList.length }} 项进行中</text>
					</view>
					<view class="sechd-r" @tap="navTo('/pages/parttime-anchor/parttime-anchor')">
						<text class="t11 mu">查看全部</text>
						<svg class="s14 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</view>
				</view>
				<view class="recruit-list" v-if="recruitList.length > 0">
					<view class="rc" :class="{'rc-hl':it.hl}" v-for="it in recruitList" :key="it.id">
						<view class="rc-row">
							<view class="rc-ava" :style="{background:it.avaBg}"></view>
							<view class="rc-mid">
								<view class="rc-mid-top">
									<text class="t13 fw5">{{ it.name }}</text>
									<text class="tag" :class="it.badgeCls">{{ it.badge }}</text>
								</view>
								<text class="t11 mu" style="margin-top:2rpx">{{ it.desc }}</text>
								<view class="rc-meta">
									<view class="rc-meta-item">
										<svg class="s12 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												:d="it.icon1" />
										</svg>
										<text class="t10 mu">{{ it.meta1 }}</text>
									</view>
									<text v-if="it.meta2" class="t10 mu">{{ it.meta2 }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else style="background:#fff;border:1rpx solid rgba(0,0,0,.06);border-radius:28rpx;padding:48rpx 32rpx;text-align:center">
					<text class="t11 mu">暂无招募待办</text>
				</view>
			</view>

			<!-- 数据隔离 -->
			<view class="iso">
				<svg class="s14 mu" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
						d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
				</svg>
				<text class="t11 mu">数据已隔离 · 仅展示经纪部专属信息</text>
			</view>

		</view>

		<!-- 底部导航 -->
		<view class="btmnav">
			<view class="btmnav-inner">
			<view class="btmnav-item on">
					<svg class="s20 white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
					</svg>
				<text class="t10 fw5">首页</text>
			</view>
			<view class="btmnav-item" @tap="navTo('/pages/personnel-manage/personnel-manage')">
					<svg class="s20 gray" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<circle stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" cx="12" cy="8" r="5"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 21v-2a7 7 0 017-7h4a7 7 0 017 7v2"/>
					</svg>
				<text class="t10 fw5 mu">人员管理</text>
			</view>
			<view class="btmnav-item" @tap="navTo('/pages/anchor-kpi/anchor-kpi')">
					<svg class="s20 gray" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<line stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" x1="18" y1="20" x2="18" y2="10"/>
						<line stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" x1="12" y1="20" x2="12" y2="4"/>
						<line stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" x1="6" y1="20" x2="6" y2="14"/>
					</svg>
				<text class="t10 fw5 mu">考核总览</text>
			</view>
			<view class="btmnav-item" @tap="navTo('/pages/my/my')">
					<svg class="s20 gray" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
					</svg>
				<text class="t10 fw5 mu">我的</text>
			</view>
			</view>
			<view class="safe-btm"></view>
		</view>

</view>
</template>

<script>
	import { api } from '@/utils/api.js'
	import { useAuth, ROLE_LABELS, DEPT_LABELS } from '@/stores/auth.js'

	export default {
		data() {
			return {
				assessStats: { pending: 0, published: 0, completed: 0 },
				personnelStats: { deptMembers: 0, parttimeAnchors: 0 },
				assessList: [],
				recruitList: [],
				transferStats: { todayRecruit: 0, maintainingCount: 0, pendingTransfer: 0, lostCount: 0 },
				transferList: [],
			}
		},
		computed: {
			pageTitle() {
				const auth = useAuth()
				const roleLabel = ROLE_LABELS[auth.state.role] || '部门员工'
				return auth.state.departmentName + roleLabel.replace('部门', '')
			},
			deptName() {
				const auth = useAuth()
				return auth.state.departmentName || '经纪部'
			},
		},
		onShow() {
			this.$checkAuth()
			this.fetchDashboard()
			this.fetchTransfer()
		},
		methods: {
		async fetchDashboard() {
				try {
					const res = await api.get('/api/admin/stats/broker-dashboard')
					if (res.data) {
						this.assessStats = res.data.assessmentStats || { pending: 0, published: 0, completed: 0 }
						this.personnelStats = res.data.personnelStats || { deptMembers: 0, parttimeAnchors: 0 }
						this.assessList = (res.data.assessList || []).map(it => ({
							...it,
							hl: it.status === 1,
							dim: it.status === 4,
							icon: 'txt',
							iconTxt: String(it.id).slice(-2),
							iconBg: it.status === 1 ? 'bg-b' : it.status === 4 ? 'bg-g' : 'bg-z',
							iconCls: it.status === 1 ? 'blue' : it.status === 4 ? 'green' : 'gray',
						}))
						this.recruitList = (res.data.recruitList || []).map(it => ({
							...it,
							hl: false,
							avaBg: '#f4f4f5',
							icon1: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
						}))
					}
				} catch (e) {
					console.error('[Dashboard]', e)
				}
			},

			async fetchTransfer() {
				try {
					const tRes = await api.get('/api/admin/transfer/transfer', null, { silent: true })
					console.log('[Transfer] API返回:', JSON.stringify(tRes))
					if (tRes.data) {
						this.transferStats = tRes.data.stats || this.transferStats
						this.transferList = tRes.data.recentList || []
						console.log('[Transfer] stats:', this.transferStats, 'list:', this.transferList.length)
					} else {
						console.warn('[Transfer] 无data字段，完整响应:', JSON.stringify(tRes))
					}
				} catch (e) {
					console.error('[Transfer] 请求失败:', e)
				}
			},
			navTo(url) { uni.navigateTo({url}) },
			goPersonnel() { uni.navigateTo({ url: '/pages/personnel-manage/personnel-manage' }) },
			goToAssessment() { uni.navigateTo({ url: '/pages/assessment/assessment' }) },
			onPublish() {
				uni.navigateTo({
					url: '/pages/broker-assessment/broker-assessment'
				})
			},
			onAnchor() {
				uni.navigateTo({
					url: '/pages/parttime-anchor/parttime-anchor'
				})
			},
	
			onAssessItem(it) {
				uni.navigateTo({
					url: '/pages/submit-progress/submit-progress?publish_id=' + it.id + '&title=' + encodeURIComponent(it.title || '') + '&cycle=' + encodeURIComponent(it.sub || '') + '&target=' + encodeURIComponent(it.target || '') + '&targetDetail=' + encodeURIComponent(it.target_detail || '') + '&publisher=' + encodeURIComponent(it.publisher || '')
				})
			},
			onTransferItem(t) {
				if (!t.parttime_id) {
					uni.showToast({ title: '暂无主播信息', icon: 'none' })
					return
				}
				uni.navigateTo({
					url: '/pages/parttime-detail/parttime-detail?id=' + t.parttime_id
				})
			},
		}
	}
</script>

<style>
	.pg {
		width: 100%;
		min-height: 100vh;
		background: #f7f7f8;
		padding-bottom: 120rpx;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased
	}

	.main {
		padding: 0 32rpx
	}

	/* 文字 */
	.t10 {
		font-size: 20rpx
	}

	.t11 {
		font-size: 22rpx
	}

	.t13 {
		font-size: 26rpx
	}

	.t15 {
		font-size: 30rpx
	}

	.fw5 {
		font-weight: 500
	}

	.fw6 {
		font-weight: 600
	}

	.mu {
		color: #a1a1aa;
		margin-left: 10rpx;
	}

	.t-em {
		color: #22c55e;
		font-weight: 500
	}

	.t-strike {
		text-decoration: line-through;
		color: #71717a
	}

	.white {
		color: #fff
	}

	.dark {
		color: #18181b
	}

	.gray {
		color: #52525b
	}

	.blue {
		color: #3b82f6
	}

	.green {
		color: #22c55e
	}

	.purple {
		color: #8b5cf6
	}

	.warm {
		color: #b8945f
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

	.s20 {
		width: 40rpx;
		height: 40rpx;
		flex-shrink: 0
	}

	.s12 {
		width: 24rpx;
		height: 24rpx;
		flex-shrink: 0
	}

	/* 顶栏 */
	.topbar {
		/* position: sticky; */
		top: 0;
		z-index: 50;
		background: rgba(255, 255, 255, .92);
		border-bottom: 1rpx solid rgba(0, 0, 0, .06)
	}

	.topbar-inner {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		/* padding: 24rpx 40rpx; */
		width: 100%;
		padding: 24rpx 0	;
	}

	.tbl {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx
	}

	.tbl-icon {
		width: 72rpx;
		height: 72rpx;
		border-radius: 20rpx;
		background: #18181b;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.ava-wrap {
		position: relative
	}

	.ava-dot {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		background: #22c55e;
		position: absolute;
		top: -4rpx;
		right: -4rpx;
		border: 4rpx solid #fff;
		animation: pulse 2s ease-in-out infinite
	}

	@keyframes pulse {

		0%,
		100% {
			opacity: 1;
			transform: scale(1)
		}

		50% {
			opacity: .5;
			transform: scale(.8)
		}
	}

	.ava-ph {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		border: 1rpx solid rgba(0, 0, 0, .1);
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f4f4f5
	}

	/* section */
	.sec {
		margin-bottom: 40rpx;
		margin-top: 40rpx;
	}

	.sechd {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 4rpx;
		margin-bottom: 24rpx
	}

	.sechd-l {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 16rpx
	}

	.sechd-r {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 4rpx
	}

	/* 快捷入口 双列 */
	.shortcuts {
		display: flex;
		flex-direction: row;
		gap: 24rpx
	}

	.qb {
		flex: 1;
		background: #fff;
		border: 1rpx solid rgba(0, 0, 0, .06);
		border-radius: 28rpx;
		padding: 32rpx;
		position: relative;
		overflow: hidden
	}

	.qb:active {
		transform: scale(.97);
		opacity: .9
	}

	.qb-deco {
		position: absolute;
		top: 0;
		right: 0;
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		transform: translate(50%, -50%)
	}

	.qb-deco-warm {
		background: rgba(201, 169, 110, .05)
	}

	.qb-deco-dark {
		background: rgba(24, 24, 27, .03)
	}

	.icon-box {
		width: 72rpx;
		height: 72rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 24rpx
	}

	.icon-box-warm {
		background: rgba(201, 169, 110, .1)
	}

	.icon-box-dark {
		background: rgba(24, 24, 27, .05)
	}

	/* 考核概览 三列 */
	.stats3 {
		display: flex;
		flex-direction: row;
		gap: 16rpx
	}

	.sc {
		flex: 1;
		background: #fff;
		border: 1rpx solid rgba(0, 0, 0, .06);
		border-radius: 28rpx;
		padding: 28rpx 20rpx;
		position: relative;
		overflow: hidden
	}

	.sc:active {
		transform: scale(.98)
	}

	.shimmer-card::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, .4) 50%, transparent 100%);
		background-size: 200% 100%;
		animation: shim 3s ease-in-out infinite;
		z-index: 0
	}

	@keyframes shim {
		0% {
			background-position: 200% 0
		}

		100% {
			background-position: -200% 0
		}
	}

	.sc-inner {
		position: relative;
		z-index: 1
	}

	.sc-top {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 20rpx
	}

	.sd {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%
	}

	.sda {
		background: #f59e0b
	}

	.sdb {
		background: #3b82f6
	}

	.sdg {
		background: #22c55e
	}

	.sn {
		font-size: 52rpx;
		font-weight: 700;
		color: #18181b;
		line-height: 1;
		letter-spacing: -.02em
	}

	/* 人员规模 双列 */
	.stats2 {
		display: flex;
		flex-direction: row;
		gap: 16rpx
	}

	.pc {
		flex: 1;
		background: #fff;
		border: 1rpx solid rgba(0, 0, 0, .06);
		border-radius: 28rpx;
		padding: 32rpx
	}

	.pc:active {
		transform: scale(.98)
	}

	.pc-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start
	}

	.pn {
		font-size: 56rpx;
		font-weight: 700;
		color: #18181b;
		line-height: 1;
		letter-spacing: -.02em
	}

	.pc-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 20rpx;
		background: #f4f4f5;
		display: flex;
		align-items: center;
		justify-content: center
	}

	.pc-icon-warm {
		background: rgba(201, 169, 110, .1)
	}

	.pc-bar {
		height: 6rpx;
		background: #f4f4f5;
		border-radius: 9999rpx;
		margin-top: 24rpx
	}

	.pc-bar-in {
		height: 6rpx;
		border-radius: 9999rpx
	}

	.pc-bar-dark {
		background: #27272a
	}

	.pc-bar-warm {
		background: #c9a96e
	}

	/* 考核列表 */
	.list-card {
		background: #fff;
		border: 1rpx solid rgba(0, 0, 0, .06);
		border-radius: 32rpx;
		overflow: hidden
	}

	.lr {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 28rpx 32rpx;
		gap: 24rpx
	}

	.lr:active {
		background: rgba(0, 0, 0, .03)
	}

	.lr-hl {
		background: rgba(0, 0, 0, .015)
	}

	.lr-dim {
		opacity: .5
	}

	.lr-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0
	}

	.lr-txt {
		font-size: 26rpx;
		font-weight: 600;
		color: #52525b
	}

	.bg-z {
		background: #f4f4f5
	}

	.bg-b {
		background: #eff6ff
	}

	.bg-g {
		background: #f0fdf4
	}

	.bg-p {
		background: #faf5ff
	}

	.bg-red {
		background: #fef2f2
	}

	/* 主播流转 四列 */
	.stats4 {
		display: flex;
		flex-direction: row;
		gap: 16rpx
	}

	.tc {
		flex: 1;
		background: #fff;
		border: 1rpx solid rgba(0, 0, 0, .06);
		border-radius: 28rpx;
		padding: 24rpx 16rpx;
		text-align: center
	}

	.tn {
		font-size: 44rpx;
		font-weight: 700;
		color: #18181b;
		line-height: 1;
		letter-spacing: -.02em;
		display: block;
		margin-top: 12rpx
	}

	.tn-blue { color: #3b82f6 }
	.tn-purple { color: #8b5cf6 }
	.tn-amber { color: #d97706 }
	.tn-red { color: #dc2626 }


	.lr-mid {
		flex: 1;
		min-width: 0
	}

	.lr-mid-top {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 16rpx
	}

	.ln {
		height: 1rpx;
		background: linear-gradient(90deg, transparent, rgba(0, 0, 0, .06), transparent);
		margin: 0 32rpx
	}

	/* 招募 */
	.recruit-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx
	}

	.rc {
		background: #fff;
		border: 1rpx solid rgba(0, 0, 0, .06);
		border-radius: 28rpx;
		padding: 32rpx
	}

	.rc:active {
		transform: scale(.98)
	}

	.rc-hl {
		background: rgba(0, 0, 0, .01);
		border-color: rgba(0, 0, 0, .1)
	}

	.rc-row {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		gap: 24rpx
	}

	.rc-ava {
		width: 88rpx;
		height: 88rpx;
		border-radius: 20rpx;
		flex-shrink: 0;
		border: 1rpx solid rgba(0, 0, 0, .06)
	}

	.rc-mid {
		flex: 1;
		min-width: 0
	}

	.rc-mid-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center
	}

	.rc-meta {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 24rpx;
		margin-top: 16rpx
	}

	.rc-meta-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8rpx
	}

	/* 标签 */
	.tag {
		display: inline-flex;
		align-items: center;
		padding: 4rpx 16rpx;
		border-radius: 8rpx;
		font-size: 20rpx;
		font-weight: 500;
		white-space: nowrap;
		flex-shrink: 0;
		letter-spacing: .02em
	}

	.tag-amber {
		background: #fffbeb;
		color: #d97706;
		border: 1rpx solid rgba(217, 119, 6, .2)
	}

	.tag-blue {
		background: #eff6ff;
		color: #2563eb;
		border: 1rpx solid rgba(37, 99, 235, .2)
	}

	.tag-red {
		background: #fef2f2;
		color: #dc2626;
		border: 1rpx solid rgba(220, 38, 38, .2)
	}

	.tag-green {
		background: #f0fdf4;
		color: #16a34a;
		border: 1rpx solid rgba(22, 163, 74, .2)
	}

	.tag-def {
		background: #f4f4f5;
		color: #71717a;
		border: 1rpx solid rgba(113, 113, 122, .2)
	}

	/* 隔离 */
	.iso {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 16rpx;
		padding: 32rpx 0
	}

	/* 底部导航 - 紧凑优化 */





	/* 底部导航 */
	.btmnav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-top: 1rpx solid rgba(0, 0, 0, 0.06);
	}
	.btmnav-inner {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		padding: 8rpx 0;
	}
	.safe-btm { height: env(safe-area-inset-bottom, 0px) }
	.btmnav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4rpx;
		padding: 8rpx 12rpx;
		border-radius: 20rpx;
		transition: background 0.2s;
	}
	.btmnav-item.on {
		background: rgba(99, 112, 240, 0.1);
	}
	.btmnav-label {
		font-size: 20rpx;
		font-weight: 500;
		color: #94a3b8;
		transition: color 0.2s;
	}
	.btmnav-item.on .btmnav-label {
		color: #6370f0;
		font-weight: 600;
	}

	.btmnav-label { font-size: 22rpx; font-weight: 500; color: #94a3b8; transition: color 0.2s; }
.btmnav-item.on .btmnav-label { color: #6370f0; font-weight: 600; }
</style>