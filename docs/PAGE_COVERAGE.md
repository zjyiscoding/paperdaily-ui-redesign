# 页面范围与原模块映射

此处“覆盖”指设计与准接入模板，不表示读取过所有真实登录后页面。共 36 个业务/辅助模板 + 1 个仅评审组件页；index 为总览入口。

| 编号 | 页面文件 | 业务区域 | 原站入口/区域 | 依据与状态 | 原模块 |
|---|---|---|---|---|---|
| 01 | [首页](../pages/home.html) | 发现与阅读 | `/` | 公开结构已核对 | M4 |
| 02 | [研究问答](../pages/research-qa.html) | 发现与阅读 | `/search` | 公开结构已核对 | M5 |
| 03 | [论文检索](../pages/paper-search.html) | 发现与阅读 | `/library` | 入口已核对 · 内容为模板 | M6 |
| 04 | [已保存与合集](../pages/saved-papers.html) | 发现与阅读 | `/saved` | 入口已核对 · 内容为模板 | M6 |
| 05 | [论文详情](../pages/paper-detail.html) | 发现与阅读 | `/paper/<paper-id>` | 公开职责 + 动态详情模板 | M6 |
| 06 | [作者档案](../pages/author-detail.html) | 发现与阅读 | `待开发者映射` | 待对接模板 | M6 |
| 07 | [研究日报](../pages/daily.html) | 发现与阅读 | `/demo/daily` | 已确认原型 | M7 |
| 08 | [报告档案](../pages/daily-history.html) | 发现与阅读 | `/history` | 依据公开功能说明 | M7 |
| 09 | [年度论文集](../pages/annual-collection.html) | 发现与阅读 | `/year/subfield/<id> 或 /year/field/<id>` | 依据公开功能说明 | M6 |
| 10 | [数据集地图](../pages/datasets.html) | 方法与数据 | `/hub/datasets` | 已确认原型 | M8 |
| 11 | [数据集资产卡](../pages/dataset-detail.html) | 方法与数据 | `/hub/datasets/<dataset-id>` | 公开职责 + 动态详情模板 | M8 |
| 12 | [研究方法索引](../pages/methods.html) | 方法与数据 | `/hub/methods` | 公开结构已核对 | M8 |
| 13 | [方法详情](../pages/method-detail.html) | 方法与数据 | `待开发者映射` | 待对接模板 | M8 |
| 14 | [工作台总览](../pages/workbench.html) | 综述与研究记录 | `/workbench · 总览区域` | 公开框架 + 登录后模板 | M9、M10 |
| 15 | [综述矩阵](../pages/review-matrix.html) | 综述与研究记录 | `/workbench · 综述矩阵区域` | 已确认原型 | M11 |
| 16 | [深读任务](../pages/deep-reading.html) | 综述与研究记录 | `/workbench · 深读区域` | 待对接模板 | M12 |
| 17 | [深读记录详情](../pages/reading-detail.html) | 综述与研究记录 | `待开发者映射` | 待对接模板 | M12 |
| 18 | [开放问题](../pages/questions.html) | 综述与研究记录 | `/workbench · 问题区域` | 待对接模板 | M13 |
| 19 | [开放问题详情](../pages/question-detail.html) | 综述与研究记录 | `待开发者映射` | 待对接模板 | M13 |
| 20 | [登录](../pages/login.html) | 账号与偏好 | `/login` | 入口已核对 · 内容为模板 | M17 |
| 21 | [注册](../pages/register.html) | 账号与偏好 | `/signup` | 入口已核对 · 内容为模板 | M17 |
| 22 | [找回密码](../pages/password-reset.html) | 账号与偏好 | `待开发者映射` | 待对接模板 | M17 |
| 23 | [账户资料与安全](../pages/account.html) | 账号与偏好 | `/account` | 依据公开功能说明 | M17 |
| 24 | [研究兴趣](../pages/research-interests.html) | 账号与偏好 | `待开发者映射` | 功能有说明 · 路由待核对 | M17 |
| 25 | [邮件与显示偏好](../pages/preferences.html) | 账号与偏好 | `/account · 设置卡片` | 依据公开功能说明 | M17 |
| 26 | [积分与配额](../pages/billing.html) | 账号与偏好 | `待开发者映射` | 功能有说明 · 路由待核对 | M17 |
| 27 | [API Keys](../pages/api-keys.html) | 账号与偏好 | `/account · API Keys 区域` | 依据公开功能说明 | M16、M17 |
| 28 | [可见性与隐私](../pages/privacy.html) | 账号与偏好 | `待开发者映射` | 功能有说明 · 路由待核对 | M17 |
| 29 | [帮助首页](../pages/help.html) | 帮助与说明 | `/help` | 公开结构已核对 | M14 |
| 30 | [帮助文章模板](../pages/help-article.html) | 帮助与说明 | `/help/<section>/<slug>` | 公开职责 + 动态详情模板 | M14 |
| 31 | [数据统计](../pages/stats.html) | 帮助与说明 | `/stats` | 入口已核对 · 内容为模板 | M15 |
| 32 | [Agent 接入](../pages/agents.html) | 帮助与说明 | `/agents-help` | 公开结构已核对 | M16 |
| 33 | [数据与口径](../pages/metrics.html) | 帮助与说明 | `/about/metrics` | 公开结构已核对 | M18 |
| 34 | [更新日志](../pages/changelog.html) | 帮助与说明 | `/changelog` | 入口已核对 · 内容为模板 | M18 |
| 35 | [关于知新](../pages/about.html) | 帮助与说明 | `/about` | 公开结构已核对 | M18 |
| 36 | [404 与错误页](../pages/not-found.html) | 帮助与说明 | `待开发者映射` | 待对接模板 | M19 |
| 37 | [组件与状态验收](../pages/components.html) | 开发与验收 | `待开发者映射` | 仅开发评审 | M3、M19 |

## 横跨全站的模块

| 模块 | 落地位置 |
|---|---|
| M0 根容器与布局 | #pd-ui、app、workspace、main、浮层宿主；src/shared |
| M1 侧边导航 | sidebar.html；窄屏导航、收起与当前项 |
| M2 顶部与全局提示 | topbar、标题区、状态提示、footer；预览切页器不进入生产 |
| M3 基础控件 | components.css + components.html；12 类组件/55 条建议 |
| M19 响应式、交互与可访问性 | 全站断点、focus、disabled/loading、移动导航；组件页拖动/键盘示例 |

## 页面变体不是新增业务路由

工作台总览/矩阵/深读/问题在原系统可能都是 `/workbench` 的页签。账户中的资料、邮件、Key 等也可能都在 `/account`。本包将它们拆成静态文件方便独立评审，不要求线上照搬拆分。

`paper-detail`、`dataset-detail`、`method-detail`、`help-article` 分别支持 `?id=` 或 `?topic=` 的本地参数。57 个详情/帮助样例变体已单独检查标题与脚本；其内容是展示数据，不是网页重新爬取结果。

作者档案、找回密码、权限细节、未见的详情路由是模板项。原站不存在的功能不要求新增；对应组件可复用到实际已存在的位置。原方案未包含、未公开的后台管理页面不在“已验证覆盖”范围。
