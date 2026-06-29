# 巨鲸绩效考核管理系统（前端）

基于 **uni-app (Vue 3)** 构建的企业级多部门绩效考核管理 H5 应用。

## 技术栈

| 技术 | 说明 |
|------|------|
| 框架 | uni-app 3.x (H5 平台) + Vue 3.5 |
| 状态管理 | Pinia 2.x + Vuex 4.x |
| 构建工具 | Vite 5 |
| 样式 | Sass + 自定义设计系统 |
| 文档生成 | docx 9.x |

## 项目结构

```
├── App.vue                         # 应用入口
├── main.js                         # 主入口
├── pages.json                      # 页面路由配置（48个页面）
├── vite.config.js                  # Vite 构建配置
├── pages/                          # 页面目录
│   ├── login/                      # 登录
│   ├── staff/                      # 员工工作台
│   ├── hr/                         # 人事部
│   ├── assessment/                 # 考核管理
│   ├── assessment-detail/          # 考核详情与提交
│   ├── anchor/                     # 主播部（总监端）
│   ├── anchor-assess-submit/       # 主播部考核提交
│   ├── broker-staff/               # 经纪部员工
│   ├── broker-assessment-list/     # 经纪部考核列表
│   ├── transfer/                   # 中转部
│   ├── operation/                  # 运营部
│   ├── finance-review/             # 财务初审
│   ├── oversight/                  # 总经办
│   └── ...
├── components/                     # 通用组件
├── stores/                         # Pinia 状态管理
├── utils/                          # 工具函数（API封装等）
└── static/                         # 静态资源
```

## 系统功能

- 🔐 **RBAC 权限控制**：7部门 × 3角色（总监/组长/员工）精细化路由分发
- 📝 **考核发布管理**：人事部统一控制各周期考核
- 📤 **员工考核提交**：多部门差异化表单 + 图片凭证上传
- 🔍 **三级审核流程**：员工提交 → 财务初审 → 总经终审
- 📊 **数据仪表盘**：部门进度概览、KPI 指环图、达标率统计
- 🎨 **自定义设计系统**：50+ 手写 CSS 组件，无第三方 UI 库依赖

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务
npm run dev

# 构建生产版本
npm run build
```

## 后端 API

后端为独立的 Laravel 项目，提供 RESTful API（Bearer Token 认证）。

- 后端仓库：[assessmentApi](https://github.com/your-org/assessmentApi)

## 相关文档

- [项目完整文档](./项目文档.html)
