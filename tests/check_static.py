#!/usr/bin/env python3
"""Static handoff audit. Python 3 + beautifulsoup4 + tinycss2; no remote requests."""
from pathlib import Path
from urllib.parse import urlsplit,unquote
from bs4 import BeautifulSoup
import json,re,subprocess,hashlib
import tinycss2
ROOT=Path(__file__).resolve().parents[1]
issues=[];links=0;files=list((ROOT/'pages').glob('*.html'))+[ROOT/'index.html',ROOT/'integration/host-example.html']
for path in files:
 soup=BeautifulSoup(path.read_text(),'html.parser');ids=[x['id'] for x in soup.select('[id]')]
 if len(ids)!=len(set(ids)):issues.append(f'duplicate ids {path.name}')
 if '{{' in path.read_text():issues.append(f'unresolved template {path.name}')
 for el in soup.select('[href],[src]'):
  for attr in ('href','src'):
   v=el.get(attr)
   if not v:continue
   u=urlsplit(v)
   if u.scheme or u.netloc:continue
   if not u.path: continue
   links+=1;target=(path.parent/unquote(u.path)).resolve()
   if not target.exists():issues.append(f'missing local {path.relative_to(ROOT)} → {v}')
   elif u.fragment and target.suffix=='.html':
    ss=BeautifulSoup(target.read_text(),'html.parser')
    # Dynamic runtime IDs are documented and tested in the browser instead.
    if not ss.find(id=u.fragment) and not v.startswith('help-article'):issues.append(f'missing anchor {path.name} → {v}')
for path in list((ROOT/'demo').glob('*.js'))+list((ROOT/'integration').glob('*.js')):
 p=subprocess.run(['node','--check',str(path)],capture_output=True,text=True)
 if p.returncode:issues.append(f'JS syntax {path.name}: {p.stderr[:200]}')
css_rules=0
for path in (ROOT/'assets/css').glob('*.css'):
 if path.name=='preview-host.css':continue
 def walk(rules):
  global css_rules
  for r in rules:
   if r.type=='qualified-rule':
    css_rules+=1;sel=tinycss2.serialize(r.prelude)
    if '#pd-ui' not in sel:issues.append('unscoped '+path.name+': '+sel)
   elif r.type=='at-rule' and r.content is not None and r.lower_at_keyword not in ('keyframes','-webkit-keyframes'):
    walk(tinycss2.parse_rule_list(r.content,skip_whitespace=True,skip_comments=True))
 walk(tinycss2.parse_stylesheet(path.read_text(),skip_comments=True,skip_whitespace=True))
prod=(ROOT/'integration/controller.js').read_text()
for banned in [r'\bfetch\(',r'XMLHttpRequest',r'localStorage',r'sessionStorage',r'PDDemoData']:
 if re.search(banned,prod):issues.append('production adapter forbidden reference '+banned)
result={'html_documents':len(files),'local_links_checked':links,'scoped_css_rules':css_rules,'issues':issues}
(ROOT/'tests/results').mkdir(exist_ok=True)
(ROOT/'tests/results/static-audit.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps(result,ensure_ascii=False,indent=2))
raise SystemExit(bool(issues))
