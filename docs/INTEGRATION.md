# 开发接入说明

## 1. 本包是什么，不是什么

这是把获确认的静态设计整理成共用样式、主内容片段、展示数据契约与事件适配器的**准接入稿**。没有假定原站使用 React、Vue、Next.js 或某个组件库。页面已能本地展示和操作，但不代替原仓库、真实接口、登录态和自动化端到端业务测试。

所有 `pages/*.html` 都是评审入口，不是让你把现有路由整个替换成这些 HTML。`integration/fragments/*.html` 也只是主内容/浮层参考，有些保留动态插槽或示例文本，必须绑定宿主数据并校对字段后使用。

## 2. 三种采用方式

| 原项目允许的改动 | 可采用的内容 | 不应带入的东西 |
|---|---|---|
| 只换视觉 | 三个共享 CSS、对应 class、主题变量 | 新接口、新路由、演示 JS、假登录 |
| 接受局部 UI 改动 | 在换肤上采用折叠、浮层、表单提示与组件语义 | 把演示追踪当真实后台任务 |
| 逐页迁移视图 | 页面片段、展示数据映射、renderers/controller 或原框架事件 | 把 36 个预览文件理解为必须新增 36 条线上路由 |

先挑一个原页面根节点接入；并行保存旧视图以便回退。确认在现有组件库、浮层宿主、滚动结构、权限状态下无冲突后，再复用到其他页面。这里不承诺未知代码下的改动工时。

## 3. 只导入这一组样式

```html
<link rel="stylesheet" href="/your-assets/tokens.css">
<link rel="stylesheet" href="/your-assets/components.css">
<link rel="stylesheet" href="/your-assets/extensions.css">
<div id="pd-ui">
  <!-- 原路由下的页面或局部 UI -->
</div>
```

`/your-assets/` 是你的静态资源目录，不是 PaperDaily 已有地址。所有规则约束在 `#pd-ui`；动画名称使用 `pd-` 前缀。**同一个 document 只放一个 `#pd-ui`。** 局部先行时把它放在此次试点范围外层，而不是给每个卡片复制相同 ID。

CSS 不向根外扩散，但宿主原有全局样式仍可能向内部继承；需要核查优先级、主题变量、字体、box-sizing、表单 reset。`#pd-ui` 的选择器权重属于交付约定，重命名根节点时必须统一修改三份样式，而不是到处追加 `!important`。

`preview-host.css` 中的 `html/body` 重置只服务独立页面，**不得带入原项目**。若局部挂载不需要整屏高度，可在宿主范围明确覆盖 `#pd-ui{min-height:0}`。布局、页面滚动由原应用负责。

Portal/Teleport 渲染的菜单、抽屉、弹窗要挂在 `#pd-ui` 内的浮层宿主，或由开发者为其提供同等作用域；不要为图省事把本包选择器改成无范围的 `button`、`input`、`.card`。

## 4. 视图与数据分离

页面源文件位于 `src/pages/`，共享外壳位于 `src/shared/`。动态页面插槽见 `view-slots.json`，字段类型见 `contracts.d.ts`。这些是本次交付的展示契约，不是对原 API 字段的猜测。

你可以继续使用原框架的 JSX、Vue 模板等，只迁移 DOM 分组与 class。也可以使用可选的 `renderers.js`：

```js
// liveRows 由你原有的数据层返回，再映射为 ReviewRowView[]。
const root = document.getElementById('pd-ui');
root.querySelector('#matrixBody').innerHTML =
  PaperDailyViews.reviewRows(liveRows, { selectedIds });
```

renderers 不读取网络、账户或演示数据；会转义字符串，拒绝非 HTTP(S) 来源链接。缺失值显示“未提供/—”，不会伪造作者、DOI、使用关系或材料级别。它不是 HTML 富文本净化库；原应用的合法富文本仍使用原净化/渲染方案。

列表与表格可分别采用 `paperCard`、`datasetCard`、`questionCard`、`reviewRows`、`statePanel`。未包含的复杂业务块照 `fragments` 改造成原有组件，不强制使用字符串模板。

## 5. 原事件继续保留；可选绑定器不能与它重复执行

使用原框架事件时，不加载 `controller.js`。采用绑定器时，在对应元素上保留 `data-pd-action` 或 `data-pd-form`，只绑定原有服务回调：

```js
const controller = PaperDailyUI.mount(root, {
  actions: {
    'reviews.save': async ({ data, signal }) => {
      // hostSaveReview 是原项目已有服务，不是本包定义的新接口。
      const result = await hostSaveReview(mapReviewInput(data.fields), { signal });
      if (!result.succeeded) return { ok: false, message: '保存未完成' };
      refreshExistingReviewStore(result);
      return { ok: true, message: '保存成功' };
    }
  }
});
// 在组件卸载时：
controller.destroy();
```

正式操作必须返回 `{ok:true}` 才能确认成功；没有绑定的操作给出可见错误。按钮等待时保留宽度和原文案、暂时禁止重复触发；失败后恢复。统一错误提示不直接暴露异常栈或服务端敏感信息。

`actions` 的真实事件含义见 `action-map.json`；原型的 `data-action` / `data-site-action` 是演示标记，不是生产业务接口。事件绑定应选择一种，不能既保留原 `onclick`，又让绑定器执行相同保存。

提交表单的 `fields` 只直接送给显式传入的宿主 callback；不写入日志、localStorage 或广播事件。宿主仍负责校验、鉴权、CSRF、速率限制、网络取消与重试。`AbortSignal` 是取消通知，不等于后台任务已取消。

纯 UI 可以用原生 `details/summary`，或用 `data-pd-ui="open-dialog|close-dialog|toggle"` 与 `data-pd-target`。绑定器不自动迁移原站的路由、筛选或权限规则。

## 6. 页面片段处理步骤

| 顺序 | 要做的事 |
|---|---|
| 1 | 从 page-map 找到原功能，不按本地文件名猜线上路由。unknown/null 项先映射到原入口。 |
| 2 | 保留原 DOM id、事件函数、路由参数与业务字段；将参考结构改写到原组件。模板 ID 不是原站 ID。 |
| 3 | 使用共享 CSS；原站已有布局优先只迁移控件 class，避免重建整壳。 |
| 4 | 用真实响应填入动态插槽，按真实权限传 canSave/canEdit 等值。 |
| 5 | 替换所有演示文案与书目；保留真实材料范围、核验状态与隐私标记。 |
| 6 | 单独确认新增折叠、列显隐、抽屉等 U 项；没有接受的保持原交互。 |
| 7 | 关掉 demo 脚本、评审面板、模拟状态、示例账号和预览切页栏。 |
| 8 | 在原应用中复测请求、跳转、返回、错误、未登录、权限、窄屏与键盘。 |

页面中需要保留的技术性示例，例如安装命令、API 权限值、真实说明正文，以原站为准。帮助页本包提供 37 主题入口与排版，不是用短摘要覆盖原帮助全文。

## 7. 数据表、浮层与响应式

宽表只在 `.table-scroll`/`.pd-table-scroll` 内横向滚动；不要让整个应用宽度等于表格最小宽度。新布局的 grid/flex 子项保持 `min-width:0`。窄屏移除原型矩阵的首列固定，避免盖住剩余内容。已有滚动容器、`sticky` 祖先与层叠须在真实应用复核。

弹窗/抽屉保留明确标题、关闭按钮、键盘焦点与返回触发位置；无保存草稿或不可逆操作不一律允许点遮罩退出。消息有持久错误与短提示之分。正式业务里不得用固定时间进度条冒充服务进度。

## 8. 原型存储与安全界线

`demo/` 中只有带 `pd-ui-demo-` 前缀的本地收藏、矩阵标题、问题、批注、偏好；密码、Key 不写入存储。测试浏览器可能禁用 storage，界面会提示仅保留当前页。

生产样式和适配器不依赖该前缀。正式接入不应读取演示记录。Key 的 `DEMO_NOT_A_REAL_KEY` 不是凭证；不能接入原服务。可见性切换在本地仅演示，不是授权检查。

## 9. 回退与验收

保留原组件或 feature flag。回退时卸载可选 controller、移除本次 CSS 引用、恢复原组件入口，不修改原数据库或用户数据。最终上线前 checklist 见 `ACCEPTANCE.md`；本包 QA 只代表独立模板环境，不替代原项目回归测试。
