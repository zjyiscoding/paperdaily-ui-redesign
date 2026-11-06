/* Presentation-only render helpers. Supply host data; no fixtures, fetch, storage or business decisions.
 * Strings are escaped; source URLs allow only http(s). Return values may be inserted into scoped view slots.
 */
(() => {
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const text=(v,fallback='未提供')=>v===null||v===undefined||v===''?fallback:esc(v);
  const safeURL=value=>{if(typeof value!=='string'||!value.trim())return null;try{const u=new URL(value,document.baseURI);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}};
  const badge=(value,tone='outline')=>`<span class="badge ${['green','blue','amber','danger','outline'].includes(tone)?tone:'outline'}">${text(value)}</span>`;
  const button=(label,action,id,cls='')=>`<button type="button" class="btn ${cls}" data-pd-action="${esc(action)}" data-id="${esc(id)}">${esc(label)}</button>`;
  const sourceLink=url=>{const u=safeURL(url);return u?`<a href="${esc(u)}" class="btn sm" target="_blank" rel="noopener noreferrer">查看来源 ↗</a>`:'';};
  const materials={abstract:'摘要级',fulltext:'全文级',unavailable:'材料不可用',unknown:'材料范围未提供'};
  const scope=p=>materials[p.materialScope]||materials.unknown;
  function paperCard(p,{selected=false,saved=false,canSave=false,showSelection=false}={}){
    return `<article class="pd-card-row" data-id="${esc(p.id)}">${showSelection?`<label><span class="sr-only">选择论文 ${esc(p.title)}</span><input type="checkbox" data-pd-select value="${esc(p.id)}" ${selected?'checked':''}></label>`:''}<div class="pd-grow"><h3>${button(p.translatedTitle||p.title,'papers.open',p.id,'ghost pd-title-button')}</h3>${p.translatedTitle?`<p class="paper-english">${esc(p.title)}</p>`:''}<p class="paper-meta">${text((p.authors||[]).join(' · '))} · ${text(p.source)} · ${text(p.publishedAt)}</p><div class="row">${badge(scope(p),'blue')}${(p.tags||[]).map(t=>badge(t)).join('')}</div>${p.abstract?`<p>${esc(p.abstract)}</p>`:''}<div class="row">${canSave?button(saved?'已保存':'保存','papers.toggleSaved',p.id,'sm'):''}${button('BibTeX','papers.citation',p.id,'sm')}${sourceLink(p.url)}</div></div></article>`;
  }
  function cell(value){return `<details class="pd-cell-details"><summary><span class="cell-text">${text(value)}</span><span class="expand-btn"><span class="pd-collapsed-label">展开全文</span><span class="pd-expanded-label">收起</span></span></summary><p class="pd-cell-full">${text(value)}</p></details>`;}
  function reviewRows(rows,{selectedIds=[]}={}){const selected=new Set(selectedIds);return rows.map((r,i)=>`<tr class="${selected.has(r.paper.id)?'is-selected':''}"><td class="select-col"><input type="checkbox" data-pd-select value="${esc(r.paper.id)}" aria-label="选择 ${esc(r.paper.title)}" ${selected.has(r.paper.id)?'checked':''}></td><td class="paper-col"><div class="paper-mini">${String(i+1).padStart(2,'0')} / ${text(r.paper.source)}</div><button class="paper-title" type="button" data-pd-action="papers.open" data-id="${esc(r.paper.id)}">${esc(r.paper.translatedTitle||r.paper.title)}</button><div class="paper-meta">${text((r.paper.authors||[]).join(' · '))}<br>${text(r.paper.publishedAt)}</div></td><td class="method-col">${cell(r.method)}</td><td class="data-col">${cell(r.data)}</td><td class="finding-col">${cell(r.findings)}</td><td class="gap-col">${cell(r.gaps)}</td><td class="material-col">${badge(scope(r.paper),'blue')}</td></tr>`).join('');}
  function datasetCard(d){return `<article class="panel dataset-card"><div class="dataset-card-top"><div class="dataset-monogram">${text((d.aliases||[])[0], 'DATA')}</div><div class="dataset-card-title"><h3><button type="button" data-pd-action="datasets.open" data-id="${esc(d.id)}">${esc(d.name)}</button></h3><p class="dataset-en">${text(d.owner)}</p></div></div><div class="dataset-facts">${badge(d.unit)}${badge(d.region)}</div><p class="dataset-owner">时间范围：${text(d.period)}</p><div class="dataset-bottom"><div><strong>${Number.isFinite(d.usageCount)?esc(d.usageCount.toLocaleString()):'—'}</strong><span class="metric-label">使用篇数 · 原服务口径</span></div><div class="access-area">${badge(d.access,'outline')}${button('查看详情','datasets.open',d.id,'sm')}</div></div></article>`;}
  function statePanel(state,{message='',retryAction='',loginURL=''}={}){
    if(state==='ready')return '';
    if(state==='loading')return '<div class="state-container" aria-busy="true"><div class="skeleton-list"><p class="muted small">加载中</p><div class="skeleton skeleton-title mt16"></div><div class="skeleton skeleton-body"></div></div></div>';
    const titles={empty:'暂无内容',error:'内容暂时无法加载',unauthenticated:'请先登录',forbidden:'当前无权访问'};
    const url=safeURL(loginURL);
    return `<div class="state-container"><div class="empty-state" role="${state==='error'?'alert':'status'}"><h2>${esc(titles[state]||'内容尚不可用')}</h2><p>${esc(message)}</p>${retryAction?button('重试',retryAction,'','primary'):''}${state==='unauthenticated'&&url?`<a class="btn primary" href="${esc(url)}">登录</a>`:''}</div></div>`;
  }
  window.PaperDailyViews=Object.freeze({escape:esc,paperCard,reviewRows,datasetCard,statePanel});
})();
