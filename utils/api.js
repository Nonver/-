/**
 * 统一API请求封装
 * 
 * 使用方式：
 *   import { api } from '@/utils/api.js'
 *   const res = await api.get('/api/admin/stats/overview')
 *   const res = await api.post('/api/admin/login', { account: 'xxx', password: 'xxx' })
 * 
 * @returns {Promise<{code:number, message:string, data:any}>}
 */

// ========== 配置 ==========
// 后端API地址
// 开发环境：BASE_URL留空，请求走Vite代理转发到后端服务器
// 生产环境：发布时改为真实域名
// const BASE_URL = 'http://192.168.0.26.assessapi'  // 生	产环境
const BASE_URL = 'https://assapi.gxjujing.com'  // 开发环境


const DEFAULT_HEADERS = {
	'Content-Type': 'application/json',
}

// ========== 核心请求方法 ==========
function request(config) {
	const silent = config.silent || false
	return new Promise((resolve, reject) => {
		// 1. 读取token
		const token = uni.getStorageSync('api_token')
		const headers = { ...DEFAULT_HEADERS }
		if (token) {
			headers['Authorization'] = 'Bearer ' + token
		}

		// 2. 发起请求
		uni.request({
			url: BASE_URL + config.url,
			method: config.method || 'GET',
			data: config.data,
			header: headers,
			timeout: config.timeout || 15000,
		
			success: (res) => {
				// HTTP状态码非200
				if (res.statusCode !== 200) {
					if (res.statusCode === 401) {
						handleAuthExpired()
					}
					const msg = (res.data && res.data.message) || '服务器异常'
					if (!silent) uni.showToast({ title: msg, icon: 'none' })
					reject({ code: res.statusCode, message: msg })
					return
				}

				const d = res.data
				// 业务码非200
				if (d.code !== 200) {
					if (d.code === 401) {
						handleAuthExpired()
					}
					if (!silent) uni.showToast({ title: d.message || '操作失败', icon: 'none' })
					reject({ code: d.code, message: d.message })
					return
				}

				// 成功
				resolve(d)
			},

			fail: (err) => {
				console.error('[API] 请求失败:', err)
				if (!silent) uni.showToast({ title: '网络异常，请检查后端服务', icon: 'none' })
				reject({ code: -1, message: '网络异常', error: err })
			},
		})
	})
}

// ========== 简便方法 ==========
// 用法: api.get(url, params) 或 api.get(url, params, { silent: true })
function get(url, params, opts) {
	opts = opts || {}
	if (params) {
		const qs = Object.keys(params)
			.filter(k => params[k] !== undefined && params[k] !== null)
			.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
			.join('&')
		if (qs) url += '?' + qs
	}
	return request({ url, method: 'GET', silent: opts.silent })
}

function post(url, data, opts) {
	opts = opts || {}
	return request({ url, method: 'POST', data, silent: opts.silent })
}

function put(url, data, opts) {
	opts = opts || {}
	return request({ url, method: 'PUT', data, silent: opts.silent })
}

function del(url, opts) {
	opts = opts || {}
	return request({ url, method: 'DELETE', silent: opts.silent })
}

// ========== 认证过期处理 ==========
function handleAuthExpired() {
	try {
		uni.removeStorageSync('api_token')
		uni.removeStorageSync('auth_state')
	} catch (e) { }
	uni.navigateTo({ url: '/pages/login/login' })
}

// ========== Token管理 ==========
function setToken(token) {
	uni.setStorageSync('api_token', token)
}

function getToken() {
	return uni.getStorageSync('api_token') || ''
}

function clearToken() {
	try {
		uni.removeStorageSync('api_token')
		uni.removeStorageSync('auth_state')
	} catch (e) { }
}

// ========== 导出 ==========
export { BASE_URL, setToken, getToken, clearToken }

export const api = {
	get,
	post,
	put,
	delete: del,
	request,
}
