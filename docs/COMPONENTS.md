# 组件与建议落地索引

## 1. 不变的设计基线

颜色、正文尺寸、按钮高度/圆角/状态与密度来自已确认的三页原稿。主题只在 tokens.css 定义一次；components.css 保留原组件规则；extensions.css 只补足新页面和框架无关渲染器。没有引入 Radix/Ant/Carbon 运行库或外部字体。

| 家族 | 范围 | 共用 class / 元素 | 实际位置 |
|---|---|---|---|
| A01 | 页面框架与导航 | `app / sidebar / topbar / tabs / pd-pager` | 全部页面 |
| A02 | 文字、图标与身份 | `h1–h3 / small / muted / icon / avatar` | 全部页面 |
| A03 | 按钮与链接 | `btn / primary / ghost / danger / sm / text-link` | 全部页面 |
| A04 | 输入与表单 | `field / search-field / form-row / pd-form-grid` | 问答、检索、账号、批注 |
| A05 | 选择、筛选与数值 | `select / checkbox / switch / range` | 矩阵、数据集、偏好、组件页 |
| A06 | 标签与元信息 | `badge / count / paper-meta / description-grid` | 全部内容页面 |
| A07 | 卡片、列表与面板 | `panel / dataset-card / reading-card / pd-card-row` | 列表、日报、资源与详情 |
| A08 | 表格与矩阵 | `matrix-table / pd-table / table-scroll` | 矩阵、统计、Key、账单 |
| A09 | 浮层、菜单与提示 | `dialog / drawer / pop-menu / pd-tooltip` | 矩阵、详情、账号、组件页 |
| A10 | 反馈与进度 | `alert / empty-state / skeleton / toast / spinner` | 全部页面；任务页与评审工具 |
| A11 | 滚动、展开与尺寸 | `table-scroll / disclosure / cell-text / pd-demo-split` | 矩阵、长文、代码；拖动仅组件页 |
| A12 | 图表、图片与代码 | `codebox / pd-chart / pd-media` | 统计、帮助、Agent、组件页 |

## 2. 八类组合板块

| 组合 | 语义片段 | 复用位置 |
|---|---|---|
| B01 标题与操作 | integration/components/B01-heading.html | 页面、详情、日报 |
| B02 搜索与筛选 | B02-toolbar.html | 论文、数据集、问题 |
| B03 资源列表与卡片 | B03-resource.html | 论文、方法、数据集 |
| B04 详情与证据 | B04-detail.html | 论文、深读、问题 |
| B05 表格与矩阵 | B05-table.html | 矩阵、Key、账单 |
| B06 任务与状态 | B06-task.html | 生成、深读、反馈 |
| B07 设置与身份 | B07-form.html | 登录、偏好、账户 |
| B08 长文与说明 | B08-document.html | 日报、帮助、Agent |

## 3. 55 条元素建议逐项对应

“落地”不代表强制新增原站不存在的业务功能。滑杆、分隔拖动、双端范围等放在验收页独立展示，正式页面仅在已有需求时采用。

| 原建议编号 | 元素 | 样式/示例位置 |
|---|---|---|
| A01.01 | 页面容器与区块边界 | `app / sidebar / topbar / tabs / pd-pager`；全部页面 |
| A01.02 | 侧边导航与菜单项 | `app / sidebar / topbar / tabs / pd-pager`；全部页面 |
| A01.03 | 页签 | `app / sidebar / topbar / tabs / pd-pager`；全部页面 |
| A01.04 | 面包屑与文档目录 | `app / sidebar / topbar / tabs / pd-pager`；全部页面 |
| A01.05 | 分页 | `app / sidebar / topbar / tabs / pd-pager`；全部页面 |
| A02.01 | 文字层级 | `h1–h3 / small / muted / icon / avatar`；全部页面 |
| A02.02 | 正文、摘要和引用 | `h1–h3 / small / muted / icon / avatar`；全部页面 |
| A02.03 | 图标 | `h1–h3 / small / muted / icon / avatar`；全部页面 |
| A02.04 | 头像与品牌占位 | `h1–h3 / small / muted / icon / avatar`；全部页面 |
| A03.01 | 统一按钮基样式 | `btn / primary / ghost / danger / sm / text-link`；全部页面 |
| A03.02 | 按钮主次层级 | `btn / primary / ghost / danger / sm / text-link`；全部页面 |
| A03.03 | 纯图标按钮 | `btn / primary / ghost / danger / sm / text-link`；全部页面 |
| A03.04 | 危险操作 | `btn / primary / ghost / danger / sm / text-link`；全部页面 |
| A03.05 | 按钮加载状态 | `btn / primary / ghost / danger / sm / text-link`；全部页面 |
| A03.06 | 按钮禁用状态 | `btn / primary / ghost / danger / sm / text-link`；全部页面 |
| A03.07 | 链接 | `btn / primary / ghost / danger / sm / text-link`；全部页面 |
| A04.01 | 单行输入框 | `field / search-field / form-row / pd-form-grid`；问答、检索、账号、批注 |
| A04.02 | 搜索框 | `field / search-field / form-row / pd-form-grid`；问答、检索、账号、批注 |
| A04.03 | 多行文本框 | `field / search-field / form-row / pd-form-grid`；问答、检索、账号、批注 |
| A04.04 | 字段标题与校验 | `field / search-field / form-row / pd-form-grid`；问答、检索、账号、批注 |
| A04.05 | 密码与 API Key | `field / search-field / form-row / pd-form-grid`；问答、检索、账号、批注 |
| A05.01 | 单选下拉框 | `select / checkbox / switch / range`；矩阵、数据集、偏好、组件页 |
| A05.02 | 多选与筛选条件 | `select / checkbox / switch / range`；矩阵、数据集、偏好、组件页 |
| A05.03 | 复选框与全选 | `select / checkbox / switch / range`；矩阵、数据集、偏好、组件页 |
| A05.04 | 单选框 | `select / checkbox / switch / range`；矩阵、数据集、偏好、组件页 |
| A05.05 | 开关 | `select / checkbox / switch / range`；矩阵、数据集、偏好、组件页 |
| A05.06 | 日期与年份 | `select / checkbox / switch / range`；矩阵、数据集、偏好、组件页 |
| A05.07 | 数值滑杆 | `select / checkbox / switch / range`；矩阵、数据集、偏好、组件页 |
| A06.01 | 主题标签 | `badge / count / paper-meta / description-grid`；全部内容页面 |
| A06.02 | 状态与证据徽标 | `badge / count / paper-meta / description-grid`；全部内容页面 |
| A06.03 | 数量徽标 | `badge / count / paper-meta / description-grid`；全部内容页面 |
| A06.04 | 作者、来源、时间和版本 | `badge / count / paper-meta / description-grid`；全部内容页面 |
| A07.01 | 资源卡片与列表项 | `panel / dataset-card / reading-card / pd-card-row`；列表、日报、资源与详情 |
| A07.02 | 指标卡片 | `panel / dataset-card / reading-card / pd-card-row`；列表、日报、资源与详情 |
| A07.03 | 详情信息与关联内容 | `panel / dataset-card / reading-card / pd-card-row`；列表、日报、资源与详情 |
| A08.01 | 表头、行和单元格 | `matrix-table / pd-table / table-scroll`；矩阵、统计、Key、账单 |
| A08.02 | 长文本单元格 | `matrix-table / pd-table / table-scroll`；矩阵、统计、Key、账单 |
| A08.03 | 宽表与固定区域 | `matrix-table / pd-table / table-scroll`；矩阵、统计、Key、账单 |
| A08.04 | 表格工具栏和行内操作 | `matrix-table / pd-table / table-scroll`；矩阵、统计、Key、账单 |
| A09.01 | 操作菜单 | `dialog / drawer / pop-menu / pd-tooltip`；矩阵、详情、账号、组件页 |
| A09.02 | 提示气泡 | `dialog / drawer / pop-menu / pd-tooltip`；矩阵、详情、账号、组件页 |
| A09.03 | 弹窗与确认框 | `dialog / drawer / pop-menu / pd-tooltip`；矩阵、详情、账号、组件页 |
| A09.04 | 详情抽屉 | `dialog / drawer / pop-menu / pd-tooltip`；矩阵、详情、账号、组件页 |
| A10.01 | 空状态与无结果 | `alert / empty-state / skeleton / toast / spinner`；全部页面；任务页与评审工具 |
| A10.02 | 错误、权限与材料不足 | `alert / empty-state / skeleton / toast / spinner`；全部页面；任务页与评审工具 |
| A10.03 | 加载与骨架屏 | `alert / empty-state / skeleton / toast / spinner`；全部页面；任务页与评审工具 |
| A10.04 | 短提示与持续提示 | `alert / empty-state / skeleton / toast / spinner`；全部页面；任务页与评审工具 |
| A10.05 | 任务进度 | `alert / empty-state / skeleton / toast / spinner`；全部页面；任务页与评审工具 |
| A10.06 | 步骤与流程说明 | `alert / empty-state / skeleton / toast / spinner`；全部页面；任务页与评审工具 |
| A11.01 | 滚动条 | `table-scroll / disclosure / cell-text / pd-demo-split`；矩阵、长文、代码；拖动仅组件页 |
| A11.02 | 折叠与展开 | `table-scroll / disclosure / cell-text / pd-demo-split`；矩阵、长文、代码；拖动仅组件页 |
| A11.03 | 面板拖拽分隔线 | `table-scroll / disclosure / cell-text / pd-demo-split`；矩阵、长文、代码；拖动仅组件页 |
| A12.01 | 代码、命令与接口示例 | `codebox / pd-chart / pd-media`；统计、帮助、Agent、组件页 |
| A12.02 | 图表和网络视图 | `codebox / pd-chart / pd-media`；统计、帮助、Agent、组件页 |
| A12.03 | 图片与文档预览 | `codebox / pd-chart / pd-media`；统计、帮助、Agent、组件页 |

## 4. 统一但不混淆

按钮共用外观，保存/导出/删除/登录仍保留独立事件；按钮不替代真实链接。材料范围、核验结论、任务状态、访问权限是不同字段；不把摘要级当作错误，不把全文级当作结论已核验。

所有业务页均可打开评审工具查看正常、加载、空内容、错误、未登录；原型评审工具本身不进入正式系统。页面中其他表单错误、禁用、选中、半选、浮层、危险确认、材料不可用与权限不足在对应页面/组件页展示。

图表使用本地 SVG 说明外观与数据表并列，正式接入保留原图表引擎；图片预览使用获确认原型截图，不假造论文图或官方截图。
