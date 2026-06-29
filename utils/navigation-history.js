/**
 * 导航历史追踪工具
 * 解决H5页面刷新后页面栈丢失、无法返回的问题
 * 使用 sessionStorage 保存导航历史（刷新不丢失，关闭标签页清空）
 */

const STORAGE_KEY = '__nav_history__'
const MAX_HISTORY = 20

/** 获取当前页面完整路径（含参数） */
function getCurrentRoute() {
	try {
		const pages = getCurrentPages()
		const page = pages[pages.length - 1]
		if (page && page.route) {
			const fullPath = '/' + page.route
			if (page.options && Object.keys(page.options).length > 0) {
				const query = Object.entries(page.options)
					.map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
					.join('&')
				return fullPath + '?' + query
			}
			return fullPath
		}
	} catch (e) {}
	return ''
}

/** 读取历史记录 */
export function getHistory() {
	try {
		const raw = sessionStorage.getItem(STORAGE_KEY)
		return raw ? JSON.parse(raw) : []
	} catch (e) {
		return []
	}
}

/** 保存历史记录 */
function saveHistory(history) {
	try {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history))
	} catch (e) {}
}

/** navigateTo 时调用：将当前页加入历史 */
export function trackNavigateTo() {
	const route = getCurrentRoute()
	if (!route) return

	const history = getHistory()

	// 避免连续重复（同一页面反复记录）
	if (history.length > 0 && history[history.length - 1] === route) {
		return
	}

	// 如果新路由在历史中已存在，截断到该位置（用户从中间页重新导航）
	const existIndex = history.indexOf(route)
	if (existIndex > -1) {
		history.splice(existIndex)
	}

	history.push(route)
	if (history.length > MAX_HISTORY) {
		history.shift()
	}
	saveHistory(history)
}

/** reLaunch 时调用：清空历史并记录目标页 */
export function trackReLaunch(targetUrl) {
	saveHistory([targetUrl || getCurrentRoute()])
}

/**
 * 智能返回
 * - 页面栈正常时：使用原生 uni.navigateBack
 * - 刷新后页面栈丢失时：从 sessionStorage 历史中取出上一页，用 redirectTo 跳转
 */
export function smartNavigateBack(delta = 1) {
	const pages = getCurrentPages()

	if (pages.length > 1) {
		// 正常情况：页面栈还在，直接用原生返回
		const history = getHistory()
		for (let i = 0; i < delta && history.length > 0; i++) {
			history.pop()
		}
		saveHistory(history)
		uni.navigateBack({ delta })
		return
	}

	// 刷新后页面栈丢失：从 sessionStorage 恢复
	const history = getHistory()
	if (history.length <= 1) {
		// 完全没有历史记录，跳回登录页
		uni.reLaunch({ url: '/pages/login/login' })
		return
	}

	// 移除当前页（历史最后一条）
	history.pop()
	const prevPage = history[history.length - 1]
	saveHistory(history)

	if (prevPage) {
		// 用 redirectTo 跳回上一页（替换当前页，不增加栈）
		uni.redirectTo({ url: prevPage })
	} else {
		uni.reLaunch({ url: '/pages/login/login' })
	}
}
