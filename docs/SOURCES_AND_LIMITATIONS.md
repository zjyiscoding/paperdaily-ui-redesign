# 来源、真实性与核对范围

## 设计基线

本稿继承用户已确认的三份 HTML，以及55条统一元素建议。原稿保留于 `originals/`，指纹位于 `references/BASELINE.json`；`APPROVED_PLAN.md` 保留完整归类与参考链接。

此次重构抽离 CSS 与演示 JS，再扩展全站模板；没有把初版方案重新换成另一套字体、风格或组件库。品牌仅使用产品文字，不分发第三方字体文件。

## 网站入口与公开说明

2026-11-02 核对的公开入口/说明包括：

- https://paperdaily.org/
- https://paperdaily.org/search
- https://paperdaily.org/workbench
- https://paperdaily.org/hub/datasets
- https://paperdaily.org/hub/methods
- https://paperdaily.org/demo/daily
- https://paperdaily.org/help
- https://paperdaily.org/help/reference/feature-index
- https://paperdaily.org/help/how-to/account-settings
- https://paperdaily.org/help/how-to/report-history
- https://paperdaily.org/help/how-to/year-in-papers
- https://paperdaily.org/help/how-to/research-interests
- https://paperdaily.org/help/reference/api-scopes
- https://paperdaily.org/agents-help
- https://paperdaily.org/about
- https://paperdaily.org/about/metrics

论文检索 `/library`、已保存 `/saved`、统计 `/stats`、登录 `/login`、注册 `/signup`、账户 `/account`、档案 `/history`、更新日志 `/changelog` 的入口或说明可核对，但并非每一页都返回了完整正文。page-map 将 route-only 与 public 分开，不能把入口已知写成布局已实测。

## 登录态限制

本次尝试了已连接 Browser 工具，返回缺少 originating browser context，无法读取用户浏览器的登录态。因此没有登录后原始 DOM、私人矩阵、账户资料、积分或 Key。相关界面为准接入模板，已通过视觉与交互演示检查，但还需网站开发者用真实组件结构与数据核对。

本包“全站”范围是双方既定 M0–M19 用户端模块。动态数据的每条论文/数据集/文章由模板呈现，不为每条记录复制一个页面；未公开管理后台、未知机构专用页及未来新增功能不在已核对覆盖中。

## 内容性质

| 内容 | 本包如何处理 |
|---|---|
| 三页书目、数据集 | 延续已确认原型的公开快照；不宣称为实时库 |
| 日报 | 保留获确认2026-11-01的6篇节选；不是2026-11-02完整日报 |
| 问答、矩阵比较、深读结论 | 明示演示提示，不冒充模型/论文全文结果 |
| 方法列表与作者档案 | 结构示例；不虚构作者身份或使用关系 |
| 帮助文章 | 37主题导航与文字版式；不是完整重写/转载原站文档 |
| 统计图 | 本地样例统计，并附可读数据表；非平台总量 |
| 账户/配额 | 演示身份或待接入空值；不编造真实价格和余额 |
| 更新日志 | UI交付包的变更说明，不冒充PaperDaily产品版本发布 |
| 安装命令 | 来自公开Agent说明的短示例；本包不执行，不保证未来地址永远不变 |
| 图片 | 获确认原型截图的预览/放大示例，不构造“原版网站截图” |

网页可能持续变化，原团队接入前须核对当时真实页面、命令、字段与许可。本包不对数据许可或论文结论作独立保证。

## 浏览器验证限制

当前执行环境禁止 URL 导航，包括 file:// 和拦截测试域名。渲染/交互测试使用原 HTML 加本地资源内联到 Chromium 内容视图，预览文件本身没有被改成测试专用版本。URL 参数通过预览支持的 `data-preview-query` 等价入口测试；文件互链另做静态路径检查。

因此没有声称在 Safari、Firefox、手机真机、真实登录态或原站仓库中端到端跑通。宿主上线前仍需完成这些验证。
