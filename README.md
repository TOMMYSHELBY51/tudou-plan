# 土豆计划 (Tudou Plan)

一款面向宠物主人的 Web 应用，主要用于记录和分析爱犬的健康状况。

## 功能特性

### 1. 健康监测
- 📷 上传小狗大便图片，AI 分析健康状况
- 📊 查看历史记录和健康趋势
- 💡 获取针对性的养护建议

### 2. 饮食管理
- 🍖 记录小狗每日饮食情况
- 📝 支持多种餐次类型（早餐、午餐、晚餐、零食）
- 📈 查看饮食历史记录

### 3. 狗粮评分系统
- 🏆 内置 14 款热门狗粮数据
- 📊 智能成分分析评分
- ⚖️ 可自定义评分权重
- 🔍 支持多款狗粮对比分析
- 🛒 查看淘宝购买链接

### 4. 汪汪社区
- 📸 分享小狗日常照片
- ❤️ 点赞互动
- 💬 浏览社区动态

## 技术栈

### 前端
- React 18
- Vite
- Tailwind CSS
- React Router
- Lucide Icons

### 后端
- Node.js
- Express
- Lowdb (JSON 文件数据库)
- Multer (文件上传)

### AI 服务
- OpenAI GPT-4 Vision API（健康分析）

## 快速开始

### 环境要求
- Node.js >= 18
- npm 或 yarn

### 安装步骤

```bash
# 1. 克隆仓库
git clone <your-repo-url>
cd tudou-plan

# 2. 安装依赖
npm install

# 3. 配置环境变量
# 复制 .env.example 为 .env，并填入必要的配置：
# - OPENAI_API_KEY: 你的 OpenAI API Key

# 4. 启动开发服务器
npm run dev
```

### 构建生产版本

```bash
npm run build
npm run preview
```

## 项目结构

```
tudou-plan/
├── server/                 # 后端代码
│   ├── data/              # 数据库文件
│   ├── uploads/           # 上传文件存储
│   ├── index.js           # 服务器入口
│   ├── aiService.js       # AI 服务
│   ├── dogFoodData.js     # 狗粮数据
│   └── dogFoodScorer.js   # 评分逻辑
├── src/                   # 前端代码
│   ├── components/        # 公共组件
│   ├── pages/             # 页面组件
│   ├── App.jsx           # 路由配置
│   └── main.jsx          # 入口文件
├── .env                   # 环境变量（不提交）
├── .gitignore            # Git 忽略配置
├── package.json
└── vite.config.js
```

## 部署说明

### 开发环境
直接运行 `npm run dev` 即可启动前后端开发服务器。

### 生产环境

1. **安装 Node.js 环境**
2. **使用 PM2 部署**
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name tudou-plan
   ```
3. **配置反向代理**（Nginx）将前端请求转发到后端

## 版本历史

详见 [CHANGELOG.md](CHANGELOG.md)

## 后续规划

- [ ] 用户登录注册系统
- [ ] 多宠物的支持
- [ ] 数据导出功能
- [ ] 微信小程序版本
- [ ] 推送通知功能

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎提交 Issue。
