#!/usr/bin/env python3
"""Test dynamic fixture routes via supported data-preview-query; compare approved CSS computed values."""
from browser_smoke import *
async def main():
 records=[];base=[]
 data=json.loads((ROOT/'demo/data.json').read_text());methods=json.loads((ROOT/'demo/methods.json').read_text());topics=json.loads((ROOT/'demo/help-topics.json').read_text())
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path=EXE,args=['--no-sandbox'])
  cases=[('paper-detail','id='+x['id'],x['zh']) for x in data['papers']]+[('dataset-detail','id='+x['id'],x['name']) for x in data['datasets']]+[('method-detail','id='+x['id'],x['name']) for x in methods]+[('help-article','topic='+x[0],x[1]) for x in topics]
  for key,query,expected in cases:
   html=inline_page(ROOT/'pages'/f'{key}.html').replace('id="pd-ui"',f'id="pd-ui" data-preview-query="{query}"',1)
   page=await b.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));await page.set_content(html,wait_until='load');await page.wait_for_timeout(20)
   actual=await page.locator('h1').first.inner_text()
   records.append({'page':key,'query':query,'passed':actual==expected and not errors,'errors':list(errors),'actual_title':actual});await page.close()
  props=['fontSize','fontFamily','fontWeight','lineHeight','borderRadius','backgroundColor','color','paddingTop','paddingBottom','paddingLeft','paddingRight','minHeight']
  for key,orig in [('review-matrix','01-review-matrix.html'),('datasets','02-dataset-map.html'),('daily','03-research-daily.html')]:
   selectors=['#pd-ui','h1','.btn.primary','.badge','.panel']
   if key=='review-matrix':
    selectors=['#pd-ui','h1','[data-action=generate]','.badge','.matrix-panel','.matrix-table th','.cell-text','.paper-title']
   if key=='datasets':selectors+=['.dataset-card','.dataset-card h3']
   if key=='daily':selectors+=['.reading-card','.reading-card h3']
   for w in [1440,390]:
    old,oe=await load(b,ROOT/'originals'/orig,w);new,ne=await load(b,ROOT/'pages'/f'{key}.html',w)
    for selector in selectors:
     js='''([selector,props])=>{const el=document.querySelector(selector);if(!el)return null;const s=getComputedStyle(el);return Object.fromEntries(props.map(k=>[k,s[k]]));}'''
     a=await old.evaluate(js,[selector,props]);z=await new.evaluate(js,[selector,props])
     base.append({'page':key,'width':w,'selector':selector,'passed':a==z,'before':a,'after':z})
    await old.close();await new.close()
  await b.close()
 (ROOT/'tests/results/variant-audit.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
 (ROOT/'tests/results/baseline-audit.json').write_text(json.dumps(base,ensure_ascii=False,indent=2))
 print('Variants',len(records),'failed',sum(not x['passed'] for x in records))
 print('Approved-style comparisons',len(base),'failed',sum(not x['passed'] for x in base))
 for x in base:
  if not x['passed']:print(x['page'],x['width'],x['selector'],[(k,v,x['after'][k]) for k,v in x['before'].items() if v!=x['after'][k]])
if __name__=='__main__':asyncio.run(main())
