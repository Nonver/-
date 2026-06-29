import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import uniH5Vite from '@dcloudio/uni-h5-vite';

// 指定源码目录为项目根目录（兼容HBuilderX和CLI），但不覆盖已设置的值
process.env.UNI_INPUT_DIR = process.env.UNI_INPUT_DIR || process.cwd();

export default defineConfig({
	plugins: [
		uni(),
		...uniH5Vite(),
	],
	server: {
		port: 5173,
		host: '0.0.0.0',
		allowedHosts: true,
		proxy: {
			// 开发环境代理：将 https://assapi.gxjujing.com 的请求转发到 192.168.0.26
			'/api': {
				target: 'http://192.168.0.26',
				changeOrigin: true,
				rewrite: (path) => '/assessapi' + path
			}
		}
	}
});