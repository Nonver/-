<script>
	import { useAuth } from '@/stores/auth.js'
	import { trackNavigateTo, trackReLaunch, getHistory } from '@/utils/navigation-history.js'

	// 白名单：无需登录即可访问的页面
	const WHITE_LIST = [
		'/pages/login/login'
	]

	// 标记是否已注册拦截器
	let interceptorsRegistered = false

	/** 注册全局导航拦截器（追踪页面栈） */
	function registerNavigationInterceptors() {
		if (interceptorsRegistered) return
		interceptorsRegistered = true

		// 拦截 navigateTo
		uni.addInterceptor('navigateTo', {
			invoke() {
				trackNavigateTo()
			}
		})

		// 拦截 reLaunch
		uni.addInterceptor('reLaunch', {
			invoke(args) {
				trackReLaunch(args.url || '')
			}
		})
	}

	export default {
		onLaunch: function() {
			console.log('App Launch')
			const auth = useAuth()
			auth.init()

			// 注册导航拦截器，自动追踪页面栈到 sessionStorage
			registerNavigationInterceptors()

			// 页面刷新恢复：如果 sessionStorage 有历史记录，但页面栈只有1层
			// 说明是刷新后重新进入，需要恢复到最后访问的页面
			this.$nextTick(() => {
				const history = getHistory()
				const pages = getCurrentPages()
				if (history.length > 1 && pages.length <= 1) {
					const lastPage = history[history.length - 1]
					if (lastPage && lastPage !== '/pages/login/login') {
						console.log('[NavRestore] 检测到页面刷新，恢复导航到:', lastPage)
						// 使用 reLaunch 恢复到之前所在的页面
						uni.reLaunch({ url: lastPage })
					}
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			/**
			 * 检查登录状态，未登录则跳转登录页
			 * 在每个需要权限的页面 onShow 中调用 this.$checkAuth()
			 */
			checkAuth() {
				const auth = useAuth()
				if (!auth.state.userId) {
					const pages = getCurrentPages()
					const currentPage = pages[pages.length - 1]
					if (currentPage && currentPage.route) {
						const currentPath = '/' + currentPage.route
						if (WHITE_LIST.includes(currentPath)) return true
					}
					uni.navigateTo({ url: '/pages/login/login' })
					return false
				}
				return true
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	page {
		background-color: #f8fafc;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		-webkit-font-smoothing: antialiased;
	}
</style>
