/* New-page demo behavior only. No network calls or real account operations.
   Production hosts should use integration/controller.js instead. */
(() => {
  'use strict';
  const U = window.PDPreview;
  if (!U) throw new Error('Load approved-pages.js before site.js');
  const {ROOT,h,icon,button,badge,toast,openDialog,closeDialog,download,copyText,PAPERS,DATASETS,persist,readStore} = U;
  const S=window.PDSiteData;
  const $=(s,r=ROOT)=>r.querySelector(s), $$=(s,r=ROOT)=>Array.from(r.querySelectorAll(s));
  const params = new URLSearchParams(ROOT.dataset.previewQuery || location.search);
  const page = ROOT.dataset.sitePage;
  const trackingOnly=page==='questions'&&params.get('tracking')==='1';
  const link=(text,href,cls='btn')=>`<a class="${cls}" href="${h(href)}">${text}</a>`;
  const sbtn=(text,action,cls='',attrs='')=>`<button type="button" class="btn ${cls}" data-site-action="${action}" ${attrs}>${text}</button>`;
  const kv=items=>`<dl class="description-grid">${items.map(([a,b])=>`<dt>${h(a)}</dt><dd>${b}</dd>`).join('')}</dl>`;
  const section=(title,body)=>`<section class="drawer-section"><h3>${title}</h3>${body}</section>`;
  const validKeys=['title','description','state','paper','tracking','id'];
  let questions=readStore('site-questions',null);
  if(!Array.isArray(questions)||!questions.every(q=>q&&typeof q.title==='string'&&typeof q.id==='string'))questions=S.questions.map(q=>({id:q[0],title:q[1],state:q[2],paper:q[3],description:'将来源与待核验事项分别记录，后续线索需人工判断。',tracking:q[2]==='正在追踪'}));
  let keys=[{id:'key-demo-1',name:'本地助手 · 示例',scopes:['read:paper','read:reading'],used:'未接入真实使用时间'}];
  let editorKind=null, editorId=null, confirmFn=null, localCategory='全部方法',localChannel='all';
  let queryEpoch=0;
  const currentPaper=()=>PAPERS.find(p=>p.id===params.get('id'))||PAPERS[0];
  function renderPaper(){
    const p=currentPaper(),out=$('#paperDetailContent');if(!out)return;
    $('h1').textContent=p.zh;
    out.innerHTML=`<div class="pd-columns"><article class="pd-stack"><section class="panel panel-body"><div class="row">${badge(p.material,p.material==='摘要级'?'blue':'outline')}${p.tags.map(t=>badge(t)).join('')}</div><h2 class="mt16">${h(p.title)}</h2><p class="paper-meta">${h(p.authors)} · ${h(p.source)} · ${h(p.date)}</p><div class="row mt16">${button('保存','save-paper','',`data-id="${p.id}"`,'bookmark')}${button('BibTeX','bib','',`data-id="${p.id}"`,'quote')}${link('查看来源 ↗',p.url,'btn')}${sbtn('转给我的 Agent 深读','request-reading','primary',`data-pd-action="readings.enqueue" data-id="${p.id}"`)}</div></section><section class="panel panel-body"><h2>研究信息与阅读提示</h2>${section('研究问题',`<p>${h(p.short)}</p>`)}${section('方法',`<p>${h(p.methodText)}</p>`)}${section('数据与样本',`<p>${h(p.dataText)}</p>`)}${section('待核对问题',`<p>${h(p.gap)}</p>`)}</section><section class="panel panel-body"><h2>引用与相似论文</h2><p class="helper">以下是关联列表的版式示例，不代表真实引文或相似度关系。</p>${PAPERS.filter(x=>x.id!==p.id).slice(0,3).map(x=>link(h(x.zh)+' '+icon('chevronRight'),'paper-detail.html?id='+x.id,'pd-link-row')).join('')}</section></article><aside class="pd-stack"><section class="panel panel-body"><h3>出版与记录信息</h3><div class="mt16">${kv([['来源',h(p.source)],['发表日期',h(p.date)],['记录 ID',h(p.id)+'（本地）'],['全文可用性','未接入'],['核验状态','演示内容']])}</div></section><section class="panel panel-body"><h3>继续研究</h3>${link('加入比较矩阵','review-matrix.html','pd-link-row')}${link('查看深读界面','reading-detail.html?id='+p.id,'pd-link-row')}${link('留下研究问题','questions.html','pd-link-row')}${link('作者档案模板','author-detail.html','pd-link-row')}</section></aside></div>`;
    U.updateSavedButtons();
  }
  function renderDataset(){const out=$('#datasetDetailContent');if(!out)return;const d=DATASETS.find(x=>x.id===params.get('id'))||DATASETS[4];
    $('h1').textContent=d.name;
    out.innerHTML=`<div class="pd-columns"><article class="pd-stack"><section class="panel panel-body"><div class="row">${badge(d.abbr,'green')}${badge(d.type)}${badge(d.access,'outline')}</div><h2 class="mt16">${h(d.english)}</h2><p class="helper">${h(d.owner)}</p><div class="mt24">${kv([['观测单位',h(d.unit)],['覆盖地区',h(d.region)],['时间范围',h(d.period)],['获取方式',h(d.access)],['使用篇数',d.count.toLocaleString()+'（原型快照）'],['许可细节','未登记，需到数据方核验']])}</div><div class="row mt24">${sbtn('复制名称','copy-text','',`data-text="${h(d.name+' / '+d.english)}"`)}${link('原站登记入口 ↗',d.url,'btn')}</div></section><section class="panel panel-body"><h2>使用论文与证据位置</h2><p class="helper mt16">登记字段快照没有包含可逐条验证的关联论文，本模板不凭主题相似构造使用关系。</p><div class="empty-state"><div class="empty-icon">${icon('book')}</div><h3>关联记录等待接入</h3><p>接入原有数据集 ID 后，读取对应使用论文与证据片段。</p>${link('到论文检索查看样式','paper-search.html','btn')}</div></section></article><aside class="pd-stack"><section class="panel panel-body"><h3>登记与使用边界</h3><p class="helper">名称、许可、获取方式可能变化。此静态稿不承担数据许可确认。</p><div class="pd-divider"></div>${link('数据与口径','metrics.html','text-link')}</section><section class="panel panel-body"><h3>继续查找</h3>${link('其他数据集','datasets.html','pd-link-row')}${link('研究方法','methods.html','pd-link-row')}</section></aside></div>`;
  }
  function renderMethod(){const out=$('#methodDetailContent');if(!out)return;const m=S.methods.find(x=>x.id===params.get('id'))||S.methods[0];$('h1').textContent=m.name;
    out.innerHTML=`<div class="pd-columns"><article class="pd-stack"><section class="panel panel-body">${badge(m.category)}<h2 class="mt16">${h(m.english)}</h2><p class="pd-prose mt16">${h(m.desc)}</p>${section('用法片段', '<p>这里保留原文片段与来源位置插槽。示例没有接入论文抽取结果，不伪造原文引语。</p>')}${section('材料与限制','<p>方法名与使用次数不能替代识别假设、样本设计或模型验证。正式接入保留原系统字段。</p>')}</section><section class="panel panel-body"><h2>相关记录样式</h2><p class="helper">仅展示卡片与跳转样式，不断言这些论文使用了所选方法。</p>${PAPERS.slice(0,2).map(p=>link(h(p.zh),'paper-detail.html?id='+p.id,'pd-link-row')).join('')}</section></article><aside><section class="panel panel-body"><h3>条目信息</h3><div class="mt16">${kv([['本地 ID',h(m.id)],['分类',h(m.category)],['演示用法数',String(m.count)],['原文位置','等待接入']])}</div></section></aside></div>`;
  }
  function renderQuestions(){const out=$('#questionList');if(!out)return;
    if(trackingOnly){const heading=$('#mainContent h1');if(heading)heading.textContent='追踪清单';}
    out.innerHTML=questions.length?questions.map(q=>`<article class="panel panel-body pd-searchable" data-search="${h(q.title+q.state)}" data-tracking="${!!q.tracking}"><div class="section-head"><div><h3>${link(h(q.title),'question-detail.html?id='+encodeURIComponent(q.id),'')}</h3><p>本地示例 · 关联来源 ${h(q.paper)} · ${h(q.state)}</p></div>${badge(q.state,q.state==='正在追踪'?'green':'outline')}</div><p class="small muted">${h(q.description||'尚未补充说明')}</p><div class="row space-between mt16"><button type="button" class="switch" role="switch" aria-checked="${!!q.tracking}" data-site-action="question-track" data-id="${h(q.id)}" data-pd-action="questions.toggleTracking"><span class="switch-track" aria-hidden="true"></span><span>盯查</span><span class="small muted">${q.tracking?'演示开启':'演示关闭'}</span></button><div class="row">${link('查看详情','question-detail.html?id='+encodeURIComponent(q.id),'btn sm')}${sbtn('编辑','edit-question','sm',`data-id="${h(q.id)}" data-pd-action="questions.update"`)}${sbtn('删除','delete-question','danger sm',`data-id="${h(q.id)}" data-pd-action="questions.delete"`)}</div></div></article>`).join(''):`<div class="panel"><div class="empty-state"><h2>还没有本地问题</h2><p>从一个具体待核验的问题开始。</p>${sbtn('新建问题','new-question','primary')}</div></div>`;
    filterLocal();
  }
  function renderQuestion(){const out=$('#questionDetailContent');if(!out)return;const q=questions.find(q=>q.id===params.get('id'))||questions[0];if(!q){out.innerHTML='<div class="empty-state"><h2>这条本地问题已不存在</h2>'+link('返回问题列表','questions.html','btn')+'</div>';return;}
    $('h1').textContent=q.title;
    out.innerHTML=`<div class="pd-columns"><article class="pd-stack"><section class="panel panel-body"><div class="row">${badge(q.state)}${badge('本地演示','outline')}</div><h2 class="mt16">问题描述</h2><p class="pd-prose mt16">${h(q.description||'尚未补充')}</p><div class="row mt24">${sbtn('编辑问题','edit-question','primary',`data-id="${h(q.id)}"`)}${sbtn(q.state==='已关闭'?'重新打开':'关闭问题','close-question','',`data-id="${h(q.id)}"`)}${sbtn('删除','delete-question','danger',`data-id="${h(q.id)}"`)}</div></section><section class="panel panel-body"><h2>关联材料</h2><p class="helper">这是演示关联，不是系统新发现的证据。</p>${link(h((PAPERS.find(p=>p.id===q.paper)||PAPERS[0]).zh),'paper-detail.html?id='+encodeURIComponent(q.paper),'pd-link-row')}</section><section class="panel panel-body"><h2>最新线索</h2><p class="helper mt16">未连接追踪服务，不生成虚假的新论文命中。</p><div class="empty-state"><div class="empty-icon">${icon('search')}</div><h3>等待真实线索</h3><p>正式页面按已有接口展示匹配结果与核查状态。</p></div></section></article><aside><section class="panel panel-body"><h3>追踪设置</h3><button class="switch mt16" role="switch" aria-checked="${!!q.tracking}" type="button" data-site-action="question-track" data-id="${h(q.id)}"><span class="switch-track" aria-hidden="true"></span><span>${q.tracking?'演示开启':'演示关闭'}</span></button><p class="helper">此开关不创建定时任务。</p></section></aside></div>`;
  }
  function saveQuestions(){const ok=persist('site-questions',questions);if(!ok)toast('存储不可用：修改仅保留在本页','error');renderQuestions();renderQuestion();}
  function renderKeys(){const out=$('#keyRows');if(!out)return;out.innerHTML=keys.length?keys.map(k=>`<tr><td><strong>${h(k.name)}</strong><div class="helper">DEMO •••• 无效占位</div></td><td>${k.scopes.map(s=>badge(s,'outline')).join(' ')}</td><td class="small muted">${h(k.used)}</td><td><div class="row">${sbtn('权限','edit-key','sm',`data-id="${h(k.id)}" data-pd-action="keys.updateScopes"`)}${sbtn('撤销','revoke-key','danger sm',`data-id="${h(k.id)}" data-pd-action="keys.revoke"`)}</div></td></tr>`).join(''):'<tr><td colspan="4"><div class="empty-state"><h3>没有本地示例 Key</h3><p>新建可查看凭证呈现与确认状态。</p></div></td></tr>';}
  function renderHelp(){const out=$('#helpArticle');if(!out)return;const t=S.helpTopics.find(t=>t[0]===params.get('topic'))||S.helpTopics[0];$('h1').textContent=t[1];
    const bodySections=[['阅读目标',t[4]],['操作位置','保留原产品已有页面、字段与跳转。该模板统一正文、说明、代码与表格的呈现，不改变功能职责。'],['需要核对','读取结果时区分材料范围、任务状态与访问权限。未返回的数据明确显示缺失，不将演示样例当成线上记录。'],['完成与恢复','操作是否成功应以原服务回执为准。遇到失败保留输入，并显示对应的错误解释和原有恢复入口。']];
    out.innerHTML=`${badge(t[2],'outline')}<h2>${h(t[1])}</h2><p class="helper">简要说明示例 · 非原站全文替代品</p><div class="row mt16">${bodySections.map((x,i)=>link(x[0],'#help-section-'+i,'text-link')).join('')}</div>${bodySections.map((x,i)=>`<section id="help-section-${i}"><h2>${h(x[0])}</h2><p>${h(x[1])}</p></section>`).join('')}<div class="alert neutral mt24">正式接入保留站方原文、图片和章节顺序；当前文字仅用于检验长文组件。</div><div class="row mt24">${link('打开对应页面',t[3]+'.html','btn primary')}${link('全部帮助主题','help.html','btn')}</div>`;
    $$('.pd-help-nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='help-article.html?topic='+t[0]));
  }
  function renderWorkbenchTopics(){
    const out=$('#wbTopicTags');if(!out)return;
    let topics=[];try{topics=JSON.parse(out.dataset.topics||'[]');}catch(_){}
    if(!Array.isArray(topics))topics=[];
    topics=topics.filter(t=>t&&typeof t.name==='string').map((t,i)=>({name:t.name,count:Math.max(0,Number(t.count)||0),order:i})).sort((a,b)=>b.count-a.count||a.order-b.order);
    const shown=topics.length>3?topics.slice(0,2):topics;
    out.innerHTML=shown.map(t=>`<span class="wb-material-tag" title="${h(t.name)}">${h(t.name)} · ${t.count}</span>`).join('')+(topics.length>3?`<span class="wb-material-tag wb-material-tag--neutral" title="${h(topics.slice(2).map(t=>t.name).join('、'))}">+${topics.length-2}</span>`:'');
  }
  function filterLocal(){
    const input=$('[data-local-search]');if(!input)return;
    const q=input.value.trim().toLocaleLowerCase();const filters=$$('[data-local-filter]');
    let count=0;$$('.pd-searchable').forEach(item=>{
      const matches=(!trackingOnly||item.dataset.tracking!=='false')&&(!q||(item.dataset.search||item.textContent).toLocaleLowerCase().includes(q))&&filters.every(f=>!f.value||item.dataset[f.dataset.localFilter]===f.value)&&(localCategory==='全部方法'||!item.dataset.category||item.dataset.category===localCategory)&&(localChannel==='all'||!item.dataset.material||item.dataset.material===localChannel);
      item.hidden=!matches;if(matches)count++;
    });
    if($('#localResultCount'))$('#localResultCount').textContent=`${count} 条本地匹配记录`;
    if($('#localNoResults'))$('#localNoResults').hidden=count>0;
    const archive=$('.pd-heatmap');if(archive)archive.style.opacity=q?'.45':'1';
    updateSelection();
  }
  function clearLocal(){if(trackingOnly){location.href='questions.html';return;}const x=$('[data-local-search]');if(x)x.value='';$$('[data-local-filter]').forEach(s=>s.value='');localCategory='全部方法';localChannel='all';$$('[data-site-action="method-category"]').forEach(b=>{const on=b.dataset.category==='全部方法';b.classList.toggle('primary',on);b.setAttribute('aria-pressed',String(on));});filterLocal();}
  function updateSelection(){const all=$$('.pd-select-paper');const visible=all.filter(x=>!x.closest('.pd-searchable').hidden);const checked=all.filter(x=>x.checked).length;const master=$('#localSelectAll');if(master){master.checked=visible.length>0&&visible.every(x=>x.checked);master.indeterminate=visible.some(x=>x.checked)&&!master.checked;master.disabled=!visible.length;}if($('#localSelection'))$('#localSelection').textContent=`已选 ${checked} 篇`;if($('#exportSelected'))$('#exportSelected').disabled=!checked;}
  function showEditor(kind,title,body,submit='保存演示',id=null){editorKind=kind;editorId=id;$('#siteEditorTitle').textContent=title;$('#siteEditorBody').innerHTML=body;$('#siteEditorSubmit').textContent=submit;$('#siteEditorResult').hidden=true;openDialog('siteEditor');}
  function field(label,name,value='',type='text',required=true){return `<div class="form-row"><label class="field-label" for="edit-${name}">${label}</label>${type==='textarea'?`<textarea id="edit-${name}" name="${name}" ${required?'required':''}>${h(value)}</textarea>`:`<input id="edit-${name}" name="${name}" type="${type}" value="${h(value)}" ${required?'required':''} autocomplete="off">`}</div>`;}
  function showQuestionEditor(id=null){const q=questions.find(q=>q.id===id);showEditor('question',q?'编辑问题':'新建问题',field('问题标题','title',q?.title||'')+field('问题描述','description',q?.description||'','textarea',false)+`<label class="field">状态<select name="state">${['新发现','待核查','正在追踪','已关闭'].map(st=>`<option ${st===q?.state?'selected':''}>${st}</option>`).join('')}</select></label><p class="helper">只更新本地演示，不提交真实问题。</p>`,'保存问题',id);}
  function confirm(title,text,fn){$('#siteConfirmTitle').textContent=title;$('#siteConfirmText').textContent=text;confirmFn=fn;openDialog('siteConfirm');}
  function info(title,text){$('#siteInfoTitle').textContent=title;$('#siteInfoText').textContent=text;openDialog('siteInfo');}
  function keyEditor(id=null){const k=keys.find(k=>k.id===id);showEditor('key',k?'调整演示权限':'新建演示 Key',field('用途名称','name',k?.name||'')+'<fieldset style="border:0;margin:0;padding:0"><legend class="field-label">权限示例</legend>'+['read:paper','read:digest','read:reading','write:reading','write:profile','synth:ask'].map(sc=>`<label class="pd-choice"><input type="checkbox" name="scopes" value="${sc}" ${(k?.scopes||['read:paper']).includes(sc)?'checked':''}>${sc}</label>`).join('')+'</fieldset><p class="helper">示例不会取得或扩大任何真实权限。</p>',k?'保存权限':'创建演示',id);}
  function safeCSV(v){const s=String(v??'');return '"'+(/^[\s]*[=+@-]/.test(s)?"'":'')+s.replace(/"/g,'""')+'"';}
  function exportSelected(){const ids=new Set($$('.pd-select-paper:checked').map(x=>x.value));const rows=PAPERS.filter(x=>ids.has(x.id));if(!rows.length)return;const csv=[['标题','作者','来源','日期','材料','来源地址'],...rows.map(x=>[x.title,x.authors,x.source,x.date,x.material,x.url])].map(r=>r.map(safeCSV).join(',')).join('\r\n');download('PaperDaily_所选样例.csv','\ufeff'+csv,'text/csv;charset=utf-8');toast(`已导出 ${rows.length} 条本地记录`);}
  function onClick(e){const b=e.target.closest('[data-site-action]');if(!b||b.disabled)return;const a=b.dataset.siteAction;
    switch(a){
      case 'fill-prompt':{const t=$('#'+b.dataset.target);if(t){t.value=b.textContent.trim();t.focus();}break;}
      case 'open-review':openDialog('reviewDialog');break;
      case 'component-feedback':toast('组件反馈示例 · 未执行线上操作');break;
      case 'refresh-local':filterLocal();toast('已重新读取本地样例，未请求原站');break;
      case 'clear-local':clearLocal();break;
      case 'copy-target':{const t=$('#'+b.dataset.target);if(t)copyText(t.textContent);break;}
      case 'copy-text':copyText(b.dataset.text||'');break;
      case 'print':window.print();break;
      case 'export-selected':exportSelected();break;
      case 'method-category':localCategory=b.dataset.category;$$('[data-site-action="method-category"]').forEach(x=>{x.classList.toggle('primary',x===b);x.setAttribute('aria-pressed',String(x===b));});filterLocal();break;
      case 'annual-channel':localChannel=b.dataset.channel;$$('[data-site-action="annual-channel"]').forEach(x=>x.classList.toggle('primary',x===b));filterLocal();break;
      case 'archive-date':$$('.pd-heatmap button').forEach(x=>x.classList.toggle('current',x===b));$('#archiveSelection').textContent=`选中演示第 ${b.dataset.day} 天。只附有下方 2026-11-01 的日报节选，未生成其他历史报告。`;break;
      case 'archive-info':info('归档范围','这里只演示历史条目的外观。没有把同一篇日报冒充多个日期的报告。');break;
      case 'follow':{const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));b.textContent=on?'演示：已关注':'关注作者';toast('仅切换本地关注外观');break;}
      case 'author-info':info('身份核对','本页是匿名作者档案样式示例，没有提供真实作者身份、ORCID 或论文归属。');break;
      case 'new-collection':showEditor('collection','新建演示合集',field('合集名称','name'),'创建');break;
      case 'new-question':showQuestionEditor();break;
      case 'edit-question':showQuestionEditor(b.dataset.id);break;
      case 'delete-question':confirm('删除本地问题？','仅删除本浏览器的演示记录，不影响原站数据。',()=>{questions=questions.filter(q=>q.id!==b.dataset.id);saveQuestions();toast('已删除本地问题');});break;
      case 'close-question':{const q=questions.find(q=>q.id===b.dataset.id);if(q){q.state=q.state==='已关闭'?'待核查':'已关闭';saveQuestions();toast('已更新本地问题状态');}break;}
      case 'question-track':{const q=questions.find(q=>q.id===b.dataset.id);if(q){q.tracking=!q.tracking;saveQuestions();toast('只更新演示开关，不创建后台追踪');}break;}
      case 'setting-toggle':{const on=b.getAttribute('aria-checked')!=='true';b.setAttribute('aria-checked',String(on));const lab=$('.pd-toggle-state',b);if(lab)lab.textContent=on?'开启':'关闭';break;}
      case 'toggle-password':{const input=$('#'+b.dataset.target);if(input){const show=input.type==='password';input.type=show?'text':'password';b.textContent=show?'隐藏':'显示';}break;}
      case 'account-email':showEditor('sensitive','修改邮箱 · 界面演示',field('当前密码','currentPassword','','password')+field('新邮箱','email','','email')+'<p class="helper">不要输入真实凭证。提交后立即清空，不保存、不发送。</p>','验证演示字段');break;
      case 'account-password':showEditor('sensitive','修改密码 · 界面演示',field('当前密码','currentPassword','','password')+field('新密码','newPassword','','password')+field('确认新密码','confirmPassword','','password')+'<p class="helper">仅校验两次输入是否一致，不改变账号密码。</p>','验证演示字段');break;
      case 'account-delete':confirm('注销确认样式','这只是危险操作确认框。点击后不会注销真实账号。',()=>toast('确认框演示完成，未注销任何账号'));break;
      case 'journal-request':showEditor('journal','期刊建议 · 本地示例',field('期刊名称','name')+field('ISSN（可选）','issn','','text',false)+field('官网（可选）','url','','url',false)+field('建议原因','reason','','textarea',false),'提交演示');break;
      case 'new-key':keyEditor();break;
      case 'edit-key':keyEditor(b.dataset.id);break;
      case 'revoke-key':confirm('撤销演示 Key？','仅移除当前页面中的无效样例，不调用真实密钥管理接口。',()=>{keys=keys.filter(k=>k.id!==b.dataset.id);renderKeys();toast('已移除本地 Key 样例');});break;
      case 'request-reading':info('深读入队接口待接入','此按钮已标注 readings.enqueue 接入事件。演示不会创建任务、读取全文或启动本地助手。');break;
      case 'export-stats':download('PaperDaily_本地示例统计.csv','\ufeff材料范围,篇数\r\n摘要级,3\r\n待核验,3\r\n全文级,0','text/csv;charset=utf-8');toast('已导出本地统计，不是原站数据');break;
      case 'component-modal':info('普通弹窗','统一标题、正文、操作区、关闭与焦点返回。内容仅用于组件验收。');break;
      case 'component-drawer':$('#detailHeading').textContent='详情抽屉 · 组件示例';$('#detailBody').innerHTML='<p class="pd-prose">同一抽屉容器承载各页面自己的字段，不合并业务数据。</p>';openDialog('detailDialog');break;
      case 'component-confirm':confirm('危险操作确认','只测试确认与取消，不删除任何业务数据。',()=>toast('已确认示例操作'));break;
      case 'confirm-site':if(confirmFn){const f=confirmFn;confirmFn=null;closeDialog($('#siteConfirm'));f();}break;
      case 'image-preview':$('#siteImage').src=b.src;openDialog('siteImageDialog');break;
    }
  }
  ROOT.addEventListener('click',onClick);
  ROOT.addEventListener('input',e=>{if(e.target.matches('[data-local-search]')&&!e.isComposing)filterLocal();if(e.target.id==='componentSlider')$('#componentSliderValue').textContent=e.target.value;if(['rangeStart','rangeEnd'].includes(e.target.id)){const a=$('#rangeStart'),b=$('#rangeEnd');if(+a.value>+b.value){if(e.target===a)b.value=a.value;else a.value=b.value;}$('#rangeStartValue').textContent=a.value;$('#rangeEndValue').textContent=b.value;}});
  ROOT.addEventListener('compositionend',e=>{if(e.target.matches('[data-local-search]'))filterLocal();});
  ROOT.addEventListener('change',e=>{
    if(e.target.matches('[data-local-filter]'))filterLocal();
    if(e.target.id==='routeSelect'&&e.target.value)location.href=e.target.value;
    if(e.target.id==='localSelectAll'){$$('.pd-select-paper').filter(x=>!x.closest('.pd-searchable').hidden).forEach(x=>x.checked=e.target.checked);updateSelection();}
    if(e.target.matches('.pd-select-paper'))updateSelection();
    if(e.target.matches('[data-local-sort]')){const list=$('#localList');if(list){const rows=$$('.pd-searchable',list);const v=e.target.value;rows.sort((a,b)=>{const pa=PAPERS.find(p=>p.id===a.dataset.id),pb=PAPERS.find(p=>p.id===b.dataset.id);if(!pa||!pb)return 0;return v==='title'?pa.title.localeCompare(pb.title):v==='date'?pb.date.localeCompare(pa.date):PAPERS.indexOf(pa)-PAPERS.indexOf(pb);});rows.forEach(r=>list.appendChild(r));}}
  });
  ROOT.addEventListener('submit',async e=>{
    const form=e.target;if(form.id==='siteEditorForm')return;
    const kind=form.dataset.siteForm;if(!kind)return;e.preventDefault();
    if(!form.reportValidity())return;
    const showResult=(message,error=false)=>{const out=$('.pd-form-result',form);if(out){out.innerHTML=`<div class="alert ${error?'error':'neutral'}">${h(message)}</div>`;}else toast(message,error?'error':'success');};
    if(kind==='filter'){filterLocal();return;}
    if(kind==='author-search'){showResult('这是搜索页交互示例；正式接入后将调用作者检索接口。');return;}
    if(kind==='home-query'){const q=new FormData(form).get('query');location.href='research-qa.html?q='+encodeURIComponent(q);return;}
    if(kind==='qa'){
      const epoch=++queryEpoch,button=$('button[type=submit]',form),label=button.innerHTML;button.disabled=true;button.innerHTML='<span class="spinner"></span>展示预置内容';
      $('#qaAnswer').setAttribute('aria-busy','true');
      setTimeout(()=>{if(epoch!==queryEpoch)return;button.disabled=false;button.innerHTML=label;$('#qaAnswer').removeAttribute('aria-busy');toast('显示的是同一份预置演示，不是对输入问题生成的答案');},400);return;
    }
    if(kind==='auth'){
      const pw=$('[name=password]',form),confirm=$('[name=confirmPassword]',form);if(pw&&confirm&&pw.value!==confirm.value){confirm.setCustomValidity('两次演示密码需要一致');confirm.reportValidity();confirm.setCustomValidity('');showResult('请核对两次输入。',true);return;}
      $$('input[name=password],input[name=confirmPassword]',form).forEach(x=>x.value='');showResult('表单校验完成。此稿没有提交凭证、创建账号、登录或发送邮件。');return;
    }
    if(kind==='settings'){
      const data={};for(const [k,v] of new FormData(form)){if(k.toLowerCase().includes('password'))continue;if(k in data)data[k]=[].concat(data[k],v);else data[k]=v;}
      $$('[role=switch]',form).forEach(s=>data[s.dataset.key]=s.getAttribute('aria-checked')==='true');
      const ok=persist('settings-'+form.dataset.settingsKey,data);showResult(ok?'已保存本地演示设置，未修改线上账号。':'演示已更新，但当前浏览器不允许持久存储。',!ok);return;
    }
    if(kind==='reading-note'){const text=$('[name=note]',form).value;const ok=persist('reading-note-'+currentPaper().id,text);showResult(ok?'本地批注已保存，未上传原站。':'存储不可用，批注仍保留在输入框中。',!ok);return;}
    if(kind==='component'){showResult('本地校验通过，仅用于验收反馈状态。');}
  });
  $('#siteEditorForm')?.addEventListener('submit',e=>{
    e.preventDefault();const form=e.target;if(!form.reportValidity())return;
    const text=name=>String(new FormData(form).get(name)||'').trim();
    if(editorKind==='sensitive'){
      const a=$('[name=newPassword]',form),b=$('[name=confirmPassword]',form);if(a&&b&&a.value!==b.value){b.setCustomValidity('两次输入需要一致');b.reportValidity();b.setCustomValidity('');return;}
      form.reset();closeDialog($('#siteEditor'));toast('已完成字段演示。未保存或发送任何凭证。');return;
    }
    if(editorKind==='question'){
      if(!text('title'))return;const existing=questions.find(q=>q.id===editorId);if(existing){existing.title=text('title');existing.description=text('description');existing.state=text('state');}
      else questions.unshift({id:'q-demo-'+Date.now(),title:text('title'),description:text('description'),state:text('state'),paper:'p1',tracking:false});
      saveQuestions();closeDialog($('#siteEditor'));toast('已保存本地问题');return;
    }
    if(editorKind==='key'){
      const name=text('name'),scopes=new FormData(form).getAll('scopes');if(!name||!scopes.length){$('#siteEditorResult').hidden=false;$('#siteEditorResult').textContent='请填写用途名称并选择至少一项演示权限。';return;}
      const k=keys.find(k=>k.id===editorId);if(k){k.name=name;k.scopes=scopes;}else keys.push({id:'key-demo-'+Date.now(),name,scopes,used:'从未调用服务'});
      renderKeys();closeDialog($('#siteEditor'));if(!k)info('演示 Key 已展示','DEMO_NOT_A_REAL_KEY — 此字符串不是凭证，无法访问服务，也未被保存到浏览器存储。');else toast('已更新演示权限');return;
    }
    if(editorKind==='collection'){const name=text('name');if(!name)return;const ok=persist('site-collection',{name});closeDialog($('#siteEditor'));toast(ok?'已创建本地演示合集：'+name:'合集仅保留在本页，存储不可用',ok?'success':'error');return;}
    if(editorKind==='journal'){closeDialog($('#siteEditor'));toast('建议表单演示完成，未提交给站方或进入审核。');return;}
  });
  $('#siteEditor')?.addEventListener('close',()=>{$$('input[type=password],input[type=email]', $('#siteEditor')).forEach(x=>x.value='');editorKind=null;editorId=null;});
  $('#siteConfirm')?.addEventListener('close',()=>{confirmFn=null;});
  // Apply query only to the matching local field; do not evaluate it or render it as HTML.
  if(page==='research-qa'&&params.has('q'))$('#field-question').value=params.get('q');
  if(page==='reading-detail'){$('#readingTitle').textContent=currentPaper().zh;const note=readStore('reading-note-'+currentPaper().id,null);if(typeof note==='string')$('#field-note').value=note;}
  renderPaper();renderDataset();renderMethod();renderQuestions();renderQuestion();renderKeys();renderHelp();renderWorkbenchTopics();
  if($('#demoIndeterminate'))$('#demoIndeterminate').indeterminate=true;
  if($('#field-componentReadonly'))$('#field-componentReadonly').readOnly=true;
  // Restore only non-sensitive demonstration settings.
  $$('form[data-settings-key]').forEach(form=>{const state=readStore('settings-'+form.dataset.settingsKey,null);if(!state||typeof state!=='object')return;for(const input of $$('input,textarea,select',form)){if(!(input.name in state)||['password','email'].includes(input.type))continue;const value=state[input.name];if(['checkbox','radio'].includes(input.type))input.checked=[].concat(value).includes(input.value);else input.value=String(value);}$$('[role=switch]',form).forEach(b=>{if(b.dataset.key in state){const on=Boolean(state[b.dataset.key]);b.setAttribute('aria-checked',String(on));const label=$('.pd-toggle-state',b);if(label)label.textContent=on?'开启':'关闭';}});});
  const splitter=$('#splitter'),split=$('#splitDemo');if(splitter&&split){let dragging=false;const set=v=>{v=Math.min(65,Math.max(20,v));split.style.setProperty('--pd-split',v+'%');splitter.setAttribute('aria-valuenow',String(Math.round(v)));};splitter.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();set(e.key==='Home'?20:e.key==='End'?65:+splitter.getAttribute('aria-valuenow')+(e.key==='ArrowRight'?5:-5));}});splitter.addEventListener('pointerdown',e=>{dragging=true;splitter.setPointerCapture(e.pointerId);});splitter.addEventListener('pointermove',e=>{if(dragging){const r=split.getBoundingClientRect();set((e.clientX-r.left)/r.width*100);}});splitter.addEventListener('pointerup',()=>dragging=false);splitter.addEventListener('lostpointercapture',()=>dragging=false);}
  filterLocal();
  window.PDSiteDemo={filterLocal,renderQuestions,renderKeys,renderPaper,renderDataset,renderMethod};
})();

