# PaperDaily 全站 UI · 准接入稿

版本：UI Handoff 1.0 · 2026-11-02  
设计基线：已确认的综述矩阵、数据集地图、研究日报原型。没有重新选择颜色、字号、按钮状态或信息密度。

## 从这里开始

**完整解压后，先打开根目录 `index.html`。** 这是全站页面总览，按业务区域列出全部入口；每页顶部也可切换页面。不要只拖出单个 HTML，它现在引用共享的 CSS 和 JavaScript。

包内有 **36 个业务/辅助页面模板、1 个组件验收页、1 个总览入口**。另有独立的开发绑定示例 `integration/host-example.html`。帮助文章使用 1 个模板搭配 37 个主题入口，不用 37 份重复页面冒充独立设计。

直接双击即可查看预览。需要测试跨页面的本地存储与正常 URL 参数时，建议在本目录执行：

```bash
python3 start-preview.py
# 浏览器打开 http://127.0.0.1:8000/index.html
# Ctrl+C 关闭；只监听本机，不对外发布。
```

预览不需要 npm、CDN、外部字体、构建服务或原站账户。Python 仅是可选的本地预览方式。点击“原站”和来源链接才会打开外部网站。

## 已覆盖的区域

| 区域 | 预览内容 |
|---|---|
| 发现与阅读 | 首页、研究问答、论文检索、已保存与合集、论文详情、作者档案、日报、报告档案、年度论文集 |
| 方法与数据 | 数据集地图、数据集资产卡、方法索引、方法详情 |
| 综述与记录 | 总数据 - 综述矩阵 |
| 账号与偏好 | 登录、注册、找回密码、账户资料、安全、研究兴趣、邮件/显示偏好、配额、API Keys、隐私 |
| 帮助与说明 | 帮助首页、帮助文章、统计、Agent 接入、数据口径、更新日志、关于、404 |
| 共用设计 | 页面外壳、导航、12 类组件、8 类组合板块、状态、密度、字号、无障碍交互示例 |

账号各子页、工作台各页签在预览中单独成文件，方便评审；**不要求原站新增这些路由**。原有一个页面里的设置卡片可以仍留在同页。

## 给开发者的文件

```text
index.html                   页面总览
pages/                       37 个可操作预览
assets/css/tokens.css        已确认的主题变量
assets/css/components.css    从已确认原型抽出的共用组件样式
assets/css/extensions.css    新页面组合与局部辅助样式
assets/css/preview-host.css  仅独立预览宿主重置，不进入原站
src/pages/                   可维护的页面主内容源文件
src/shared/                  导航、顶栏、页脚、浮层等共享源文件
integration/fragments/       37 份框架无关主内容参考片段
integration/controller.js    可选事件绑定器：无网络、无模拟数据、无本地存储
integration/renderers.js     用宿主数据渲染论文、矩阵行、数据集、问题和状态
integration/contracts.d.ts   展示层数据与动作类型说明
integration/adapter.example.js  原有服务绑定示例
integration/host-example.html   可单独打开的最小接入示例
integration/page-map.json    原模块、预览文件、原站入口和核对状态
integration/action-map.json  动作、表单、页面对应关系
integration/view-slots.json  动态内容插槽与宿主数据要求
integration/components/     8 类组合板块的独立语义示例
integration/partials/       共享外壳/浮层参考（不含评审工具）
demo/                        仅供预览的样例、模拟状态、本地收藏/笔记
originals/                   3 份获确认原稿，未覆盖改写
references/                  原方案、原稿指纹和已确认截图
previews/                    实际浏览器渲染截图
docs/                        页面覆盖、组件落地、接入、状态、数据、验证说明
tests/                       静态与 Chromium 检查脚本、JSON 结果
tools/build.py               仅用 Python 标准库重新组装预览
```

先读 `docs/INTEGRATION.md`，再按 `docs/PAGE_COVERAGE.md` 对照你的原组件。无需同时引入新的 UI 框架；可以只用 CSS、用现有框架事件，或逐个采用可选绑定器。

## 明确边界

本包完成的是**既定 M0–M19 范围的全站 UI 模板与准接入素材**，不是原网站已部署的改版。没有原仓库、API 合同或可用的登录态，因此登录后页面、未知详情路由均有标记；不能声称与真实私有页面逐像素对应，也不能保证覆盖未公开的管理员页面。

演示论文/数据集沿用已确认原稿的快照；研究结论、问答、深读、问题、账户和配额并非真实结果。Key 仅为无效占位。输入密码不发送、不持久保存。日报保留获确认的 2026-11-01 节选，没有用新日期伪装成新的真实报告。

**正式接入禁止加载 `demo/`、`preview-host.css` 或评审工具。** 保留原站登录、权限、后端状态、计费、路由、排序与字段定义；用实际数据替换示例。未绑定的生产动作会明确报“尚未接入”，不会假装保存或生成成功。

## 复查与构建

```bash
python3 tools/build.py
# 可选测试依赖，仅运行测试需要，不影响网页预览：
python3 -m pip install playwright beautifulsoup4 tinycss2
python3 -m playwright install chromium
# 浏览器可由 CHROMIUM 环境变量指定现有 Chromium 路径。
python3 tests/check_static.py
python3 tests/browser_smoke.py
python3 tests/interaction_checks.py
python3 tests/variants_and_baseline.py
```

`check_static.py` 的 JavaScript 语法检查还需本机 Node.js；这些依赖均只用于重新运行测试，不是浏览页面的要求。

测试环境限制、实际结果与未覆盖项见 `docs/QA_REPORT.md`。本地链接做了静态存在性检查；浏览器渲染采用装载页面内容的方式，不将环境不允许的 URL 导航写成已通过。
