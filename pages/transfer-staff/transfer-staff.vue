<template>
<view class="pg">
  <!-- <view> -->

  <!-- 顶部导航栏 -->
  <view class="topbar">
    <view class="topbar-inner">
      <view class="tbl">
        
        <view>
          <text class="t16 fw6 ink">{{ userInfo.greeting }}，{{ userInfo.name }}</text>
          <text class="t11 mu">{{ userInfo.date }} {{ userInfo.week }}</text>
        </view>
      </view>
      <view class="tbr">
        
        <view class="avatar-sm">
          <text class="t12 fw6 blue">{{ (userInfo.name || '员')[0] }}</text>
        </view>
      </view>
    </view>
  </view>

  <view class="main">

    <!-- 核心数据指标 -->
    <view class="sec">
      <view class="sechd">
        <text class="t14 fw6 ink">核心数据指标</text>
        <text class="t11 mu">今日实时</text>
      </view>

      <!-- 当日操作数 -->
      <view class="mcard mcard-mb">
        <view class="mcard-row">
          <view class="mcard-left">
            <view class="micon micon-blue">
              <svg class="s16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </view>
            <view>
              <text class="mcard-label">当日操作数</text>
              <view class="mcard-trend">
                <svg class="s10" viewBox="0 0 24 24" fill="none" :stroke="metrics.operation_trend_up ? '#10B981' : '#EF4444'" stroke-width="2.5">
                  <template v-if="metrics.operation_trend_up">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </template>
                  <template v-else>
                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                    <polyline points="17 18 23 18 23 12"/>
                  </template>
                </svg>
                <text class="t11 fw5" :class="metrics.operation_trend>=0?'green':'red'">{{ metrics.operation_trend >= 0 ? '+' : '' }}{{ metrics.operation_trend }}%</text>
                <text class="t11 mu">较昨日</text>
              </view>
            </view>
          </view>
          <view class="mcard-right">
            <text class="mcard-num">{{ metrics.today_operation }}</text>
            <text class="t11 mu">本月 {{ metrics.month_recruit }}</text>
          </view>
        </view>
        <view class="progress-bar"><view class="progress-fill" :style="'width:'+Math.min(100,metrics.today_operation*50)+'%;background:#3B82F6'"></view></view>
      </view>

      <!-- 移交运营数 -->
      <view class="mcard mcard-mb">
        <view class="mcard-row">
          <view class="mcard-left">
            <view class="micon micon-amber">
              <svg class="s16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><line x1="8" y1="20" x2="16" y2="4"/><line x1="16" y1="20" x2="8" y2="4"/></svg>
            </view>
            <view>
              <text class="mcard-label">移交运营数</text>
              <view class="mcard-trend">
                <svg class="s10" viewBox="0 0 24 24" fill="none" :stroke="metrics.transfer_trend_up ? '#10B981' : '#EF4444'" stroke-width="2.5">
                  <template v-if="metrics.transfer_trend_up">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </template>
                  <template v-else>
                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                    <polyline points="17 18 23 18 23 12"/>
                  </template>
                </svg>
                <text class="t11 fw5" :class="metrics.transfer_trend>=0?'green':'red'">{{ metrics.transfer_trend >= 0 ? '+' : '' }}{{ metrics.transfer_trend }}%</text>
                <text class="t11 mu">较上月</text>
              </view>
            </view>
          </view>
          <view class="mcard-right">
            <text class="mcard-num">{{ metrics.transferred }}</text>
            <text class="t11 mu">已移交</text>
          </view>
        </view>
        <view class="progress-bar"><view class="progress-fill" :style="'width:'+Math.min(100,metrics.transferred)+'%;background:#F59E0B'"></view></view>
      </view>

      <!-- 主播流失数 -->
      <view class="mcard">
        <view class="mcard-row">
          <view class="mcard-left">
            <view class="micon micon-red">
              <svg class="s16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/></svg>
            </view>
            <view>
              <text class="mcard-label">主播流失数</text>
              <view class="mcard-trend">
                <svg class="s10" viewBox="0 0 24 24" fill="none" :stroke="!metrics.lost_trend_up ? '#10B981' : '#EF4444'" stroke-width="2.5">
                  <template v-if="!metrics.lost_trend_up">
                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                    <polyline points="17 18 23 18 23 12"/>
                  </template>
                  <template v-else>
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </template>
                </svg>
                <text class="t11 fw5" :class="metrics.lost_trend<=0?'green':'red'">{{ metrics.lost_trend >= 0 ? '+' : '' }}{{ metrics.lost_trend }}%</text>
                <text class="t11 mu">较上月</text>
              </view>
            </view>
          </view>
          <view class="mcard-right">
            <text class="mcard-num">{{ metrics.lost }}</text>
            <text class="t11 mu">累计流失</text>
          </view>
        </view>
        <view class="progress-bar"><view class="progress-fill" :style="'width:'+Math.min(100,metrics.lost*4)+'%;background:#EF4444'"></view></view>
      </view>
    </view>

    <!-- 流转审核待办 -->
    <view class="sec">
      <view class="sechd">
        <view class="sechd-l">
          <text class="t14 fw6 ink">流转审核待办</text>
          <view class="badge-count" v-if="pendingTodos.length > 0"><text>{{ pendingTodos.length }}</text></view>
        </view>
        <text class="t12 blue fw5" @tap="onViewAll">查看全部</text>
      </view>

      <!-- 动态待办列表 -->
      <view v-if="pendingTodos.length === 0" class="tcard" style="text-align:center;padding:60rpx 32rpx">
        <text class="t12 mu">暂无待办事项</text>
      </view>
      <view v-for="(todo, i) in pendingTodos" :key="todo.id" class="tcard" :class="i < pendingTodos.length-1 ? 'tcard-mb' : ''">
        <view class="tcard-body">
          <view class="tcard-icon" :class="todo.priority==='high'?'bg-red-light':(todo.priority==='medium'?'bg-amber-light':'bg-muted')">
            <svg class="s14" viewBox="0 0 24 24" fill="none" :stroke="todo.priority==='high'?'#EF4444':(todo.priority==='medium'?'#F59E0B':'#64748B')" stroke-width="2">
              <template v-if="todo.priority==='high'">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </template>
              <template v-else>
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </template>
            </svg>
          </view>
          <view class="tcard-main">
            <view class="tcard-tags">
              <text class="ttag" :class="todo.priority==='high'?'ttag-red':(todo.priority==='medium'?'ttag-amber':'ttag-muted')">{{ todo.priorityLabel }}</text>
              <text class="ttag ttag-blue">{{ todo.type }}</text>
            </view>
            <text class="tcard-title">{{ todo.title }}</text>
            <text class="tcard-desc">{{ todo.desc }}</text>
            <view class="tcard-foot">
              <text class="tcard-time mu">{{ todo.deadline }}</text>
              <view class="btn" :class="todo.priority==='high'?'btn-primary':'btn-secondary'" @tap="onHandle(todo.id, todo.anchor_name)">{{ todo.priority==='high' ? '立即处理' : '查看详情' }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="sec">
      <view class="quick4">
        <view class="qbtn" @tap="onRegister">
          <view class="qbtn-icon bg-blue-light">
            <svg class="s16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          </view>
          <text class="qbtn-label">新人登记</text>
        </view>
        <view class="qbtn" @tap="onDashboard">
          <view class="qbtn-icon bg-green-light">
            <svg class="s16" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </view>
          <text class="qbtn-label">数据看板</text>
        </view>
        <view class="qbtn" @tap="onTransfer">
          <view class="qbtn-icon bg-amber-light">
            <svg class="s16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </view>
          <text class="qbtn-label">移交申请</text>
        </view>
        <view class="qbtn" @tap="onSettings">
          <view class="qbtn-icon bg-blue-light">
            <svg class="s16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </view>
          <text class="qbtn-label">设置</text>
        </view>
      </view>
    </view>

  </view>

  <!-- 底部导航 -->
  <bottom-nav :items="navItems" :current="currentView" @change="onNavChange" />

</view>
</template>

<script>
import BottomNav from '@/components/bottom-nav.vue'
import { api } from '@/utils/api.js'
import { useAuth } from '@/stores/auth.js'

export default {
  components: { BottomNav },
  data() {
    const auth = useAuth()
    return {
      currentView: 'home',
      activeTab: 0,
      loading: false,
      userInfo: {
        name: auth.state.userName || auth.state.account || '员工',
        dept_name: auth.state.departmentName || '中转部',
        greeting: '下午好',
        date: '',
        week: '',
        role: '',
        code: auth.state.code || '',
      },
      assess: { publish_id: 0, cycle: '', cycle_month: '-', overall_progress: 0, items: [], cards: [], days_remain: 0 },
      metrics: {
        today_operation: 0, month_recruit: 0, total_recruit: 0, transferred: 0, lost: 0,
        operation_trend: 0, operation_trend_up: false,
        transfer_trend: 0, transfer_trend_up: false,
        lost_trend: 0, lost_trend_up: false,
      },
      pendingTodos: [],
      navItems: [
        { key:'home',    label:'首页',       page:'/pages/transfer-staff/transfer-staff' },
        { key:'recruit', label:'主播流转',   page:'/pages/transfer-flow/transfer-flow' },
        { key:'history', label:'历史考核',   page:'/pages/broker-assessment-list/broker-assessment-list' },
        { key:'profile', label:'个人中心',   page:'/pages/my/my' },
      ],
    }
  },
  onShow() { this.$checkAuth(); this.fetchDashboard() },
  computed: {
    roleLabel() {
      const auth = useAuth()
      // 优先使用 API 返回的 role 字符串，兜底用 auth store
      if (this.userInfo.role) return this.userInfo.role
      const dept = auth.state.departmentName || '中转部'
      const map = { 1: dept + '总监', 2: dept + '组长', 3: dept + '员工' }
      return map[auth.state.role] || dept + '员工'
    },
    trendIcon(up) { return up ? 'up' : 'down' },
    trendCls(val, up) {
      if (up) return val > 0 ? 'green' : 'mu'
      return val > 0 ? 'red' : 'green'
    },
    kpiRingOffset() {
      const pct = this.assess.overall_progress || 0
      const r = 52; const c = 2 * Math.PI * r
      return c * (1 - pct / 100)
    },
  },
  methods: {
    async fetchDashboard() {
      this.loading = true
      try {
        const res = await api.get('/api/admin/transfer-staff/dashboard')
        if (res.data) {
          const d = res.data
          // 用户信息：逐字段赋值，保留原有兜底值
          if (d.user) {
            const u = d.user
            this.userInfo.name     = u.name || this.userInfo.name
            this.userInfo.dept_name = u.dept_name || this.userInfo.dept_name
            this.userInfo.greeting = u.greeting || this.userInfo.greeting
            this.userInfo.date     = u.date || this.userInfo.date
            this.userInfo.week     = u.week || this.userInfo.week
            this.userInfo.role     = u.role || this.userInfo.role
            this.userInfo.code     = u.usercode || this.userInfo.code
          }
          this.assess = d.assess || { publish_id: 0, cycle: '', cycle_month: '-', overall_progress: 0, items: [], cards: [], days_remain: 0 }
          this.metrics = d.metrics || this.metrics
          this.pendingTodos = d.pending_todos || []
        }
      } catch (e) {
        console.error('[transfer-staff] fetchDashboard error:', e)
      }
      this.loading = false
    },
    goToDetail(publishId, name) {
      if (!publishId) return
      uni.navigateTo({ url: '/pages/assessment-detail/assessment-detail?publish_id=' + publishId + '&name=' + encodeURIComponent(name || '') })
    },
    onNotify() { uni.showToast({ title:'暂无新消息', icon:'none' }) },
    onViewAll() { uni.navigateTo({ url:'/pages/transfer-flow/transfer-flow' }) },
    onHandle(id, name) {
      uni.navigateTo({ url:'/pages/transfer-flow/transfer-flow' })
    },
    onDetail(name) { uni.navigateTo({ url:'/pages/transfer-flow/transfer-flow' }) },
    onRegister() { uni.navigateTo({ url:'/pages/transfer-flow/transfer-flow' }) },
    onDashboard() { uni.pageScrollTo({ scrollTop: 0, duration: 300 }) },
    onTransfer() { uni.navigateTo({ url:'/pages/transfer-flow/transfer-flow' }) },
    onSettings() { uni.navigateTo({ url:'/pages/my/my' }) },
    onNavChange(key) { this.currentView = key },
  }
}
</script>

<style>
.pg { width:100%; min-height:100vh; background:#F4F6F9; font-family:'PingFang SC','Helvetica Neue',Arial,sans-serif; -webkit-font-smoothing:antialiased; padding-bottom:48rpx }
.main { padding:0 32rpx }

/* typography */
.t10 { font-size:20rpx } .t11 { font-size:22rpx } .t12 { font-size:24rpx } .t14 { font-size:28rpx } .t16 { font-size:32rpx }
.fw5 { font-weight:500 } .fw6 { font-weight:600 }
.mu { color:#64748B } .red { color:#EF4444 } .amber { color:#F59E0B } .blue { color:#2563EB } .green { color:#10B981 } .ink { color:#0F172A }
.s10 { width:20rpx;height:20rpx;flex-shrink:0 } .s14 { width:28rpx;height:28rpx;flex-shrink:0 } .s16 { width:32rpx;height:32rpx;flex-shrink:0 } .s18 { width:36rpx;height:36rpx;flex-shrink:0 } .s20 { width:40rpx;height:40rpx;flex-shrink:0 }

/* topbar */
.topbar { position:sticky; top:0; z-index:50; background:rgba(255,255,255,.85); backdrop-filter:blur(40rpx); -webkit-backdrop-filter:blur(40rpx); border-bottom:1rpx solid #E2E8F0 }
.topbar-inner { display:flex; flex-direction:row; justify-content:space-between; align-items:center; padding:20rpx 32rpx; height:112rpx }
.tbl { display:flex; flex-direction:row; align-items:center; gap:24rpx }
.tbl-icon { width:72rpx; height:72rpx; border-radius:24rpx; background:rgba(37,99,235,.08); display:flex; align-items:center; justify-content:center }
.tbr { display:flex; flex-direction:row; align-items:center; gap:24rpx }
.bell-btn { width:72rpx; height:72rpx; border-radius:24rpx; background:#F1F5F9; display:flex; align-items:center; justify-content:center; position:relative }
.bell-dot { position:absolute; top:16rpx; right:16rpx; width:16rpx; height:16rpx; background:#EF4444; border-radius:50%; border:4rpx solid #fff }
.avatar-sm { width:72rpx; height:72rpx; border-radius:24rpx; background:rgba(37,99,235,.08); display:flex; align-items:center; justify-content:center }
.role-tag { font-size:20rpx; font-weight:600; color:#2563EB; background:rgba(37,99,235,.08); padding:8rpx 20rpx; border-radius:9999rpx; white-space:nowrap }

/* section */
.sec { margin-bottom:40rpx; padding-top:32rpx }
.sechd { display:flex; flex-direction:row; justify-content:space-between; align-items:center; margin-bottom:24rpx; padding:0 8rpx }
.sechd-l { display:flex; flex-direction:row; align-items:center; gap:16rpx }
.badge-count { padding:4rpx 16rpx; background:rgba(239,68,68,.1); border-radius:9999rpx }
.badge-count text { font-size:22rpx; color:#EF4444; font-weight:700 }

/* metric cards */
.mcard { background:#fff; border-radius:32rpx; padding:32rpx; box-shadow:0 4rpx 24rpx rgba(0,0,0,.05) }
.mcard-mb { margin-bottom:24rpx }
.mcard-row { display:flex; flex-direction:row; justify-content:space-between; align-items:flex-start; margin-bottom:24rpx }
.mcard-left { display:flex; flex-direction:row; align-items:flex-start; gap:24rpx; flex:1; min-width:0 }
.mcard-right { text-align:right; flex-shrink:0 }
.mcard-label { font-size:26rpx; color:#64748B; font-weight:500; display:block }
.mcard-num { font-size:56rpx; font-weight:700; color:#0F172A; line-height:1; display:block }
.mcard-trend { display:flex; flex-direction:row; align-items:center; gap:8rpx; margin-top:4rpx }
.micon { width:88rpx; height:88rpx; border-radius:32rpx; display:flex; align-items:center; justify-content:center; flex-shrink:0 }
.micon-blue { background:rgba(59,130,246,.08) }
.micon-green { background:rgba(16,185,129,.08) }
.micon-amber { background:rgba(245,158,11,.08) }
.micon-red { background:rgba(239,68,68,.08) }

/* progress bar */
.progress-bar { height:12rpx; background:#F1F5F9; border-radius:9999rpx; overflow:hidden }
.progress-fill { height:100%; border-radius:9999rpx }

/* task cards */
.tcard { background:#fff; border-radius:32rpx; padding:32rpx; box-shadow:0 4rpx 24rpx rgba(0,0,0,.05) }
.tcard-mb { margin-bottom:24rpx }
.tcard-body { display:flex; flex-direction:row; gap:24rpx }
.tcard-icon { width:80rpx; height:80rpx; border-radius:24rpx; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:4rpx }
.bg-red-light { background:rgba(239,68,68,.08) }
.bg-amber-light { background:rgba(245,158,11,.08) }
.bg-muted { background:#F1F5F9 }
.tcard-main { flex:1; min-width:0 }
.tcard-tags { display:flex; flex-direction:row; gap:16rpx; margin-bottom:10rpx }
.tcard-title { font-size:28rpx; font-weight:600; color:#0F172A; line-height:1.4; display:block }
.tcard-desc { font-size:24rpx; color:#64748B; display:block; margin-top:8rpx; line-height:1.5 }
.tcard-foot { display:flex; flex-direction:row; justify-content:space-between; align-items:center; margin-top:20rpx }
.tcard-time { font-size:22rpx }

/* task tags */
.ttag { padding:4rpx 16rpx; border-radius:12rpx; font-size:20rpx; font-weight:700; white-space:nowrap }
.ttag-red { background:rgba(239,68,68,.1); color:#EF4444 }
.ttag-blue { background:rgba(59,130,246,.1); color:#3B82F6 }
.ttag-amber { background:rgba(245,158,11,.1); color:#F59E0B }
.ttag-green { background:rgba(16,185,129,.1); color:#10B981 }
.ttag-muted { background:#F1F5F9; color:#64748B }

/* buttons */
.btn { padding:12rpx 32rpx; border-radius:16rpx; font-size:24rpx; font-weight:500 }
.btn-primary { background:#2563EB; color:#fff }
.btn-primary:active { opacity:.9 }
.btn-secondary { background:#F1F5F9; color:#475569 }
.btn-secondary:active { background:#E2E8F0 }

/* quick actions */
.quick4 { display:flex; flex-direction:row; gap:24rpx }
.qbtn { flex:1; display:flex; flex-direction:column; align-items:center; gap:16rpx; padding:28rpx 8rpx; background:#fff; border-radius:32rpx; box-shadow:0 4rpx 24rpx rgba(0,0,0,.05) }
.qbtn:active { transform:scale(.95) }
.qbtn-icon { width:88rpx; height:88rpx; border-radius:24rpx; display:flex; align-items:center; justify-content:center }
.bg-blue-light { background:rgba(59,130,246,.08) }
.bg-green-light { background:rgba(16,185,129,.08) }
.bg-amber-light { background:rgba(245,158,11,.08) }
.qbtn-label { font-size:22rpx; color:#64748B; font-weight:500 }

.safe-btm { height:48rpx }

/* ========== Assessment Card ========== */
.acard { background:#fff; border-radius:32rpx; padding:32rpx; box-shadow:0 4rpx 24rpx rgba(0,0,0,.05) }
.acard-top { display:flex; flex-direction:row; justify-content:space-between; align-items:center; margin-bottom:24rpx }
.acard-info text { display:block }
.acard-body { display:flex; flex-direction:row; gap:32rpx; align-items:center }
.ring-wrap { position:relative; width:120rpx; height:120rpx; flex-shrink:0 }
.ring { width:120rpx; height:120rpx }
.ring-center { position:absolute; inset:0; display:flex; align-items:center; justify-content:center }
.ring-pct { font-size:32rpx; font-weight:700; color:#0F172A }
.kpi-items { flex:1; min-width:0; display:flex; flex-direction:column; gap:12rpx }
.kpi-row { display:flex; align-items:center; gap:10rpx }
.kpi-dot { width:12rpx; height:12rpx; border-radius:50%; flex-shrink:0 }
.kpi-dot.emerald { background:#10B981 } .kpi-dot.blue { background:#3B82F6 } .kpi-dot.amber { background:#F59E0B }
.kpi-label { font-size:20rpx; color:#64748B; width:100rpx; flex-shrink:0 }
.kpi-bar { flex:1; height:6rpx; background:#F1F5F9; border-radius:9999rpx; overflow:hidden }
.kpi-fill { height:100%; border-radius:9999rpx }
.kpi-fill.bg-emerald { background:#10B981 } .kpi-fill.bg-blue { background:#3B82F6 } .kpi-fill.bg-amber { background:#F59E0B }
.kpi-val { font-size:20rpx; font-weight:600; width:52rpx; text-align:right; flex-shrink:0 }
</style>
