#!/usr/bin/env python3
"""Rebuild previews and framework-neutral fragments. Python 3.9+, standard library only."""
from pathlib import Path
import json, re, html
ROOT = Path(__file__).resolve().parents[1]
PAGE_MAP = json.loads((ROOT / 'integration/page-map.json').read_text(encoding='utf-8'))

def read(p):
    return (ROOT / p).read_text(encoding='utf-8')

def active_group(key):
    groups = {'home':['home'], 'research-qa':['research-qa'],
      'paper-search':['paper-search','paper-detail','author-detail','annual-collection'],
      'saved-papers':['saved-papers'], 'daily':['daily','daily-history'],
      'datasets':['datasets','dataset-detail','methods','method-detail'],
      'workbench':['workbench','review-matrix','deep-reading','reading-detail','questions','question-detail'],
      'help':['help','help-article','about','metrics','changelog'], 'stats':['stats'], 'agents':['agents']}
    return next((group for group, keys in groups.items() if key in keys), '')

def replace_vars(text, replacements):
    for key, value in replacements.items():
        text = text.replace('{{' + key + '}}', value)
    return re.sub(r'\{\{(?:ACTIVE|ARIA)_[a-z-]+\}\}', '', text)

def build():
    (ROOT/'pages').mkdir(exist_ok=True)
    entries = [dict(key='portal', title='全站预览', file='index.html', original_route='/',group='开发与验收')] + PAGE_MAP
    for entry in entries:
        key = entry['key']; base = '' if key == 'portal' else '../'
        source = read('src/pages/' + key + '.html')
        route = (entry.get('original_route') or '/').split(' · ')[0]
        if '<' in route or ' 或 ' in route: route = '/'
        group = active_group(key)
        options = ['<option value="'+base+'index.html"'+(' selected' if key=='portal' else '')+'>全站页面总览</option>']
        for category in dict.fromkeys(e['group'] for e in PAGE_MAP):
            options.append('<optgroup label="'+html.escape(category)+'">')
            for item in PAGE_MAP:
                if item['group'] == category:
                    options.append('<option value="'+base+item['file']+'"'+(' selected' if item['key']==key else '')+'>'+html.escape(item['title'])+'</option>')
            options.append('</optgroup>')
        replacements = {'BASE':base, 'TITLE':html.escape(entry['title']), 'ORIGINAL':'https://paperdaily.org'+route,
                        'PAGE_OPTIONS':''.join(options), 'ACTIVE_'+group:'active', 'ARIA_'+group:'aria-current="page"'}
        footer = replace_vars(read('src/shared/footer.html'), replacements)
        main = source.replace('{{FOOTER}}', footer)
        daily = key == 'daily'
        top = replace_vars(read('src/shared/daily-topbar.html' if daily else 'src/shared/topbar.html'), replacements)
        if daily:
            top = re.sub(r'<button[^>]*id="navOpen".*?</button>', '', top, flags=re.S)
            top = top.replace('<span class="mobile-only mobile-brand">PaperDaily</span>','')
        sidebar = '' if daily else replace_vars(read('src/shared/sidebar.html'),replacements)
        main = replace_vars(main,replacements)
        dialogs = '\n'.join(read('src/shared/'+x+'.html') for x in ['reviewDialog','aboutDialog','detailDialog','bibDialog','siteDialogs','toasts'])
        extra = ROOT/'src/pages'/f'{key}.dialogs.html'
        if extra.exists(): dialogs += '\n'+extra.read_text(encoding='utf-8')
        dialogs=replace_vars(dialogs,replacements)
        data_page = {'review-matrix':'matrix','datasets':'datasets','daily':'daily'}.get(key,key)
        styles='\n'.join(f'<link rel="stylesheet" href="{base}assets/css/{x}.css">' for x in ['tokens','components','extensions','preview-host'])
        scripts='\n'.join(f'<script defer src="{base}demo/{x}.js"></script>' for x in ['data','site-data','approved-pages','site'])
        doc=f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="robots" content="noindex,nofollow"><meta name="description" content="PaperDaily UI 准接入稿：共享样式、静态示例，不连接真实账户。"><title>{html.escape(entry['title'])} · PaperDaily UI 准接入稿</title>
{styles}
{scripts}
</head><body><div id="pd-ui" data-page="{data_page}" data-site-page="{key}"><a class="skip-link" href="#mainContent">跳转到主要内容</a><div id="app" class="app{' daily-app' if daily else ''}">{sidebar}<div class="workspace">{top}<noscript><p class="alert warning">JavaScript 已禁用：静态结构可读；本地示例列表与演示交互需要启用 JavaScript。</p></noscript>{main}</div></div>{dialogs}</div></body></html>'''
        target=ROOT/entry['file'];target.parent.mkdir(parents=True,exist_ok=True);target.write_text(doc,encoding='utf-8')
        if key != 'portal':
            # These are view/layout references: dynamic regions deliberately retain explicit binding slots.
            fragment = '<!-- View template only. Mount inside #pd-ui. Replace demo data/actions per INTEGRATION.md. -->\n'+source.replace('{{FOOTER}}','')
            if extra.exists(): fragment+='\n'+extra.read_text(encoding='utf-8')
            # The save opener is a UI action; the associated form is the service action.
            def adapt_tag(match):
                tag=match.group(0)
                if 'data-action="save-matrix"' in tag:
                    tag=re.sub(r' data-pd-action="[^"]*"','',tag)
                    tag=tag.replace('data-action="save-matrix"','data-pd-ui="open-dialog" data-pd-target="#saveDialog"')
                elif 'data-action="close-dialog"' in tag:
                    tag=tag.replace('data-action="close-dialog"','data-pd-ui="close-dialog"')
                return tag
            fragment=re.sub(r'<button\b[^>]*>',adapt_tag,fragment)
            (ROOT/'integration/fragments'/f'{key}.html').write_text(fragment,encoding='utf-8')
    print(f'Built {len(PAGE_MAP)} pages + index.html; {len(PAGE_MAP)} view fragments.')

if __name__=='__main__': build()
