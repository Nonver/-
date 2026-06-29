import App from './App'
import { createSSRApp } from 'vue'
import { smartNavigateBack } from '@/utils/navigation-history.js'

export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.$checkAuth = App.methods.checkAuth
  app.config.globalProperties.$smartBack = smartNavigateBack
  return { app }
}