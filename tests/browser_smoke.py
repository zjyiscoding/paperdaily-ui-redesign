#!/usr/bin/env python3
"""Preview rendering/interaction harness. pip install playwright beautifulsoup4.
The CI environment blocks URL navigation; contents are loaded through set_content.
Local assets are inlined for tests only. Distributed pages are unchanged.
"""
import asyncio, json, os, base64, mimetypes, re
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[1]
EXE=os.environ.get('CHROMIUM') or ('/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None)

def inline_page(path):
 s=BeautifulSoup(path.read_text(encoding='utf-8'),'html.parser')
 for link in list(s.select('link[rel=stylesheet][href]')):
  p=(path.parent/link['href']).resolve();el=s.new_tag('style');el.string=p.read_text(encoding='utf-8');link.replace_with(el)
 for script in list(s.select('script[src]')):
  p=(path.parent/script['src']).resolve();el=s.new_tag('script');el.string=p.read_text(encoding='utf-8');script.replace_with(el)
 # Deferred external scripts in <head> must execute after the body when inlined.
 head_scripts=list(s.head.select('script')) if s.head else []
 for script in head_scripts:s.body.append(script.extract())
 for img in s.select('img[src]'):
  p=(path.parent/img['src']).resolve()
  if p.exists():img['src']='data:'+str(mimetypes.guess_type(str(p))[0])+';base64,'+base64.b64encode(p.read_bytes()).decode()
 return str(s).replace('viewbox=','viewBox=')

async def load(browser,path,width=1440,height=1000):
 page=await browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
 page.set_default_timeout(4000)
 errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
 await page.set_content(inline_page(path),wait_until='load',timeout=15000)
 await page.wait_for_timeout(120)
 return page,errs

async def main():
 reports=ROOT/'tests/results';reports.mkdir(exist_ok=True)
 results=json.loads((reports/'render-audit.json').read_text()) if os.environ.get('PD_SMOKE_RESUME') and (reports/'render-audit.json').exists() else []
 already={(r['page'],r['width']) for r in results}
 entries=json.loads((ROOT/'integration/page-map.json').read_text())
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=EXE,args=['--no-sandbox'])
  for width in (1440,1024,390):
   for entry in [dict(key='portal',file='index.html')]+entries:
    if (entry['key'],width) in already: continue
    page,errs=await load(browser,ROOT/entry['file'],width)
    info=await page.evaluate('''() => {const r=document.getElementById('pd-ui');const ids=[...document.querySelectorAll('[id]')].map(x=>x.id);return {h1:document.querySelector('h1')?.textContent,overflow:document.documentElement.scrollWidth>innerWidth+1,scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,duplicateIds:ids.filter((x,i)=>ids.indexOf(x)!==i),root:!!r,content:document.querySelector('#liveContent')?.innerText.length||0}}''')
    record={'page':entry['key'],'width':width,**info,'errors':errs};results.append(record)
    if errs or info['overflow'] or info['duplicateIds'] or not info['h1']:print('ISSUE',json.dumps(record,ensure_ascii=False))
    if (width==1440 and entry['key'] in ['home','review-matrix','datasets','daily','account','help','stats','agents','components','paper-search']) or (width==390 and entry['key'] in ['review-matrix','datasets','account','help','home']):
     
     try: await page.screenshot(path=str(ROOT/'previews'/f'{entry["key"]}-{width}.png'),full_page=False,timeout=4000,animations='disabled')
     except Exception as ex: print('Screenshot warning',entry['key'],width,str(ex)[:100],flush=True)
    (reports/'render-audit.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
    print(entry['key'],width,'checked',flush=True)
    await page.close()
   print('Finished viewport',width,flush=True)
  await browser.close()
 (reports/'render-audit.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
 print('Render checks',len(results),'issues',sum(bool(r['errors'] or r['overflow'] or r['duplicateIds'] or not r['h1']) for r in results))
if __name__=='__main__':asyncio.run(main())
