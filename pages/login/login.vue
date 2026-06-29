<template>
<view class="pg">

  <view class="spacer-top"></view>

  <!-- 品牌区 -->
  <view class="brand">
    <view class="brand-icon">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>
    </view>
    <text class="brand-title">企业管理系统</text>
    <text class="brand-sub">Enterprise Management System</text>
  </view>

  <!-- 登录卡片 -->
  <view class="card">
    <view class="card-inner">

      <!-- 账号密码表单 -->
      <view class="form">
        <!-- 账号 -->
        <view class="fi">
          <text class="fl">账号</text>
          <view class="input-wrap">
            <input class="inp" type="text" v-model="account" placeholder="请输入企业账号" @input="onAccountInput" @blur="onAccountBlur" />
          </view>
        </view>

        <!-- 密码 -->
        <view class="fi">
          <text class="fl">密码</text>
          <view class="input-wrap">
            <input class="inp" type="password" v-model="password" placeholder="请输入登录密码" @confirm="handleLogin" />
          </view>
        </view>

        <!-- 记住密码 -->
        <view class="remember-row" @tap="rememberPwd = !rememberPwd">
          <view class="remember-check" :class="{ 'check-on': rememberPwd }">
            <svg v-if="rememberPwd" class="s12 white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </view>
          <text class="remember-text">记住密码</text>
        </view>

        <!-- 登录按钮 -->
        <view class="btn-wrap">
          <view class="btn" :class="loading ? 'btn-disabled' : ''" @tap="handleLogin">
            {{ loading ? '登录中...' : '登录' }}
          </view>
        </view>
      </view>

      <!-- 辅助链接 -->
      <view class="extra">
        <text class="extra-link">忘记密码</text>
      </view>
    </view>
  </view>

  <view class="spacer-bottom"></view>

  <!-- 底部版权 -->
  <view class="footer">
    <text class="footer-text"> 2026 企业管理系统 版权所有</text>
  </view>

</view>
</template>

<script>
import { useAuth } from '@/stores/auth.js'
import { api, setToken } from '@/utils/api.js'

export default {
  data() {
    return {
      account: '',
      password: '',
      loading: false,
      rememberPwd: false,
      cachedAccounts: [],
      // 标记初始填充是否完成，防止 onAccountInput 在初始化阶段干扰
      _initDone: false,
    }
  },

  onLoad() {
    this.loadRememberedAccounts()
    // 仅在首次打开页面时自动填入第一个记住的账户
    if (this.cachedAccounts.length > 0) {
      const first = this.cachedAccounts[0]
      this.account = first.account
      this.password = first.password
      this.rememberPwd = true
    }
    // 延迟标记，确保 v-model 绑定完成后再开启匹配监听
    this.$nextTick(() => {
      this._initDone = true
    })
  },

  methods: {
    /** 加载缓存的账号列表 */
    loadRememberedAccounts() {
      try {
        const raw = uni.getStorageSync('remembered_accounts')
        this.cachedAccounts = raw ? JSON.parse(raw) : []
      } catch (e) {
        this.cachedAccounts = []
      }
    },

    /** 保存账号密码到缓存（去重更新） */
    saveAccountToCache(account, pwd) {
      this.loadRememberedAccounts()
      const idx = this.cachedAccounts.findIndex(a => a.account === account)
      if (idx >= 0) {
        this.cachedAccounts[idx].password = pwd
      } else {
        this.cachedAccounts.push({ account, password: pwd })
      }
      uni.setStorageSync('remembered_accounts', JSON.stringify(this.cachedAccounts))
    },

    /** 账号输入时匹配已缓存的密码（仅在用户手动输入时生效） */
    onAccountInput(e) {
      if (!this._initDone) return
      this.loadRememberedAccounts()
      const val = (e && e.detail && e.detail.value) || this.account
      const found = this.cachedAccounts.find(a => a.account === val)
      if (found) {
        this.password = found.password
        this.rememberPwd = true
      }
    },

    /** 账号失焦时匹配 */
    onAccountBlur(e) {
      this.onAccountInput(e)
    },

    async handleLogin() {
      if (this.loading) return
      if (!this.account.trim() || !this.password.trim()) {
        uni.showToast({ title: '请输入账号和密码', icon: 'none' })
        return
      }

      this.loading = true

      try {
        const d = await api.post('/api/admin/login', {
          account: this.account.trim(),
          username: this.account.trim(),
          password: this.password,
        })

        this.loading = false

        // 记住密码
        if (this.rememberPwd) {
          this.saveAccountToCache(this.account.trim(), this.password)
        }

        // 保存 token
        setToken(d.data.token)

        // 保存用户信息
        const auth = useAuth()
        auth.setUser({
          id: d.data.userId,
          name: d.data.userName,
          account: d.data.account,
          usercode: d.data.usercode,
          department: d.data.department,
          role: d.data.role,
        })

        // 跳转首页（tab页面用switchTab）
        const page = auth.getHomePage()
        uni.navigateTo({ url: page })
      } catch (e) {
        this.loading = false
        if (!e.message) {
          uni.showToast({ title: '网络异常，请检查后端服务', icon: 'none' })
        }
      }
    },
  },
}
</script>

<style>
.pg {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
}

.spacer-top {
  flex: 1.2;
  width: 100%;
}

.spacer-bottom {
  flex: 0.8;
  width: 100%;
}

/* 品牌区 */
.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 64rpx;
}

.brand-icon {
  width: 96rpx;
  height: 96rpx;
  background: #f1f5f9;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
}

.icon {
  width: 48rpx;
  height: 48rpx;
  color: #64748b;
}

.brand-title {
  font-size: 44rpx;
  font-weight: 600;
  color: #0f172a;
  letter-spacing: 0.02em;
}

.brand-sub {
  font-size: 24rpx;
  color: #94a3b8;
  margin-top: 12rpx;
  font-weight: 400;
}

/* 卡片 */
.card {
  width: 640rpx;
  background: #ffffff;
  border: 1rpx solid #e2e8f0;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.03);
}

.card-inner {
  padding: 64rpx 48rpx;
}

/* 表单 */
.form {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}

.fi {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.fl {
  font-size: 28rpx;
  font-weight: 500;
  color: #334155;
}

.input-wrap {
  position: relative;
}

.inp {
  width: 100%;
  height: 96rpx;
  padding: 0 28rpx;
  background: #f8fafc;
  border: 1rpx solid #e2e8f0;
  border-radius: 16rpx;
  font-size: 30rpx;
  color: #0f172a;
  box-sizing: border-box;
}

.inp::placeholder {
  color: #cbd5e1;
}

/* 按钮 */
.btn-wrap {
  margin-top: 8rpx;
}

.btn {
  width: 100%;
  height: 96rpx;
  background: #0f172a;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 500;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: opacity 0.15s ease;
}

.btn:active { opacity: 0.85; }
.btn-disabled { opacity: 0.5; }

/* 记住密码 */
.remember-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 8rpx 0;
}
.remember-check {
  width: 36rpx;
  height: 36rpx;
  border-radius: 8rpx;
  border: 2rpx solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.check-on {
  background: #0f172a;
  border-color: #0f172a;
}
.remember-text {
  font-size: 26rpx;
  color: #64748b;
}
.s12 { width: 24rpx; height: 24rpx; flex-shrink: 0 }
.white { color: #fff }

/* 辅助链接 */
.extra {
  display: flex;
  justify-content: center;
  margin-top: 48rpx;
}

.extra-link {
  font-size: 26rpx;
  color: #64748b;
  transition: color 0.15s ease;
}

.extra-link:active { color: #334155; }

/* 底部 */
.footer {
  padding: 48rpx 0 32rpx;
  text-align: center;
}

.footer-text {
  font-size: 22rpx;
  color: #cbd5e1;
}
</style>
