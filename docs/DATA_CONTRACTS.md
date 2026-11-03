# 展示数据、事件与动态插槽

## 1. 字段来自哪一层

`integration/contracts.d.ts` 是展示层要求；不是原后端接口说明。原 JSON 经宿主 mapper 转成 PaperView、DatasetView、ReviewRowView、QuestionView 后交给视图。缺失值保留 null/unknown，不将 undefined 变为 0 或“已完成”。

| 视图对象 | 最少要提供的内容 | 注意 |
|---|---|---|
| PaperView | id、title、authors、tags、materialScope | 材料范围不等于质量已核验；doi/url 可以缺失 |
| ReviewRowView | paper；method/data/findings/gaps 可缺 | 全部比较字段保持可读完整文本，不制造论文结论 |
| DatasetView | id、name；owner/unit/region/period/access 可缺 | usageCount 缺失显示 —；许可未知就是未知 |
| QuestionView | id、title、state、paperIds、tracking | 追踪真实生效必须有后台回执 |
| PageData | state、items、permissions；total/cursor 可缺 | 不从本地6篇样例推算全库总量；不把403当空列表 |

`demo/data.json` 是原三页的数据快照，`demo/methods.json` / `questions.json` / `help-topics.json` 是模板演示。正式接入不 import 它们。

## 2. 动作命名

`data-pd-action` 使用视图意图而不是接口路径，例如 `reviews.save`、`questions.update`。开发者把这些意图映射到原事件/服务，**不据此新建 `/api/reviews.save` 等假地址**。完整静态标记与来源页见 `action-map.json`。

动态渲染器提供：`papers.open`、`papers.toggleSaved`、`papers.citation`、`datasets.open`、`questions.open`、`questions.update`、`questions.toggleTracking`。其他逻辑采用原框架组件或自行绑定。

`data-pd-form` 标注表单意图，提交后得到 `data.fields`；多值字段为数组，文件若存在仍是 File，不能当普通字符串拼到 HTML。真实权限、提交校验和敏感字段处置必须由宿主实现。

## 3. 成功、失败和取消

宿主服务必须明确返回 `ok`。返回空值或未绑定时不能显示成功。`checked` 只用来反映真实确认后的开关位置；状态文字与列表数据由宿主一并刷新。

加载/提交可以显示 spinner；若服务没有真实进度，维持不定进度。“正在生成”不能自动按计时器跳到90%。组件页的百分比是写明的静态状态样例，非任务运行。

AbortSignal 只说明界面不再等待；任务后台是否真的终止，仍取决于原接口。销毁绑定器不代替业务取消。

## 4. 样式和内容的替换边界

`view-slots.json` 指定所有动态内容区域。原模板保留完整外壳；宿主填入真实列表、论文记录、图表数据、帮助正文与账户字段。特别是帮助文章，需保留原文而不是把本稿短示例当成完整文档。

## 5. 凭证与用户隐私

本包没有真实邮箱、API Key、Cookie、token 或账户余额。示例邮箱使用 example.invalid。登录和注册只验证本地字段并清空密码，既不请求网络也不写密码存储。API Key 样例的权限变化不访问真实服务。

正式接入保留原系统的隐藏/一次性展示规则。不要从“学校名称”推断机构资格，不从客户端开关推断权限，不把待核验材料当真值。
