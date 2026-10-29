"""Read-only HTTP smoke checks for a protected Finesse Vercel deployment.
Uses the existing authenticated Vercel CLI; never prints authentication headers.
Usage: python3 scripts/check-deployed-site.py https://<finesse-deployment>.vercel.app [report-path]
"""
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import json
import re
import subprocess
import sys
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]
BASE = sys.argv[1].rstrip('/')
REPORT = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT/'docs/launch-deployment-checks.json'
assert re.fullmatch(r'https://finesse-private-8k4q2m-[a-z0-9]+-dillans-projects-f662840b\.vercel\.app', BASE)

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title, self.lang, self.h1 = '', '', 0
        self.meta, self.canonicals, self.links, self.schemas = {}, [], set(), []
        self.in_title, self.in_schema, self.schema = False, False, ''
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'html': self.lang = a.get('lang', '')
        if tag == 'title': self.in_title = True
        if tag == 'h1': self.h1 += 1
        if tag == 'meta': self.meta[a.get('name') or a.get('property')] = a.get('content', '')
        if tag == 'link' and a.get('rel') == 'canonical': self.canonicals.append(a.get('href'))
        if a.get('href', '').startswith('/') and not a['href'].startswith('//'): self.links.add(urlparse(a['href']).path)
        if tag == 'script' and a.get('type') == 'application/ld+json': self.in_schema, self.schema = True, ''
    def handle_data(self, text):
        if self.in_title: self.title += text
        if self.in_schema: self.schema += text
    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
        if tag == 'script' and self.in_schema:
            self.schemas.append(json.loads(self.schema)); self.in_schema = False

def fetch(route):
    with tempfile.TemporaryDirectory(prefix='finesse-http-', dir='/private/tmp') as temp:
        body, headers = Path(temp)/'body', Path(temp)/'headers'
        command = ['vercel','curl',route,'--deployment',BASE,'--scope','dillans-projects-f662840b','--','--silent','--max-time','30','--output',str(body),'--dump-header',str(headers),'--write-out','%{http_code}']
        response = subprocess.run(command, capture_output=True, text=True)
        assert response.returncode == 0, f'HTTP client failed for {route}'
        status = int(response.stdout.strip())
        # Keep only non-sensitive headers used by these checks, then delete all temporary headers.
        safe = {}
        for line in headers.read_text().splitlines():
            if ':' in line:
                key, value = line.split(':',1)
                if key.lower() in {'content-type','location','x-robots-tag'}: safe[key.lower()] = value.strip()
        return status, safe, body.read_bytes()

def check_page(route):
    status, headers, data = fetch(route)
    assert status == 200, f'{route}: HTTP {status}'
    html = data.decode('utf8')
    page = Page(); page.feed(html)
    expected = 'https://finessebjj.com' + ('' if route == '/' else route)
    assert page.canonicals == [expected], f'{route}: canonical {page.canonicals}'
    assert page.title and page.meta.get('description'), f'{route}: missing metadata'
    assert page.lang == 'en' and page.h1 == 1, f'{route}: language/H1'
    assert 'noindex' in page.meta.get('robots','') if route in {'/privacy','/terms'} else 'noindex' not in page.meta.get('robots',''), f'{route}: robots meta'
    assert any(any(e.get('address',{}).get('streetAddress') == '18300 Strack Dr, Suite 300' for e in s.get('@graph',[])) for s in page.schemas), f'{route}: business graph'
    og = page.meta.get('og:image','')
    assert og and (ROOT/'public'/urlparse(og).path.lstrip('/')).exists(), f'{route}: social asset'
    if route == '/':
        for marker in ['id="programs"','id="trainers"','LUIS DIAZ','what-your-child-learns-on-the-mat']: assert marker in html, f'Initial homepage HTML missing {marker}'
    if route == '/schedule': assert 'awaiting confirmation' not in html, 'Stale timetable confirmation notice'
    return {'route':route,'status':status,'title':page.title,'canonical':expected,'schemas':len(page.schemas),'hostingRobots':headers.get('x-robots-tag')}, page.links

started = time.monotonic()
status, _, data = fetch('/sitemap.xml'); assert status == 200
routes = [urlparse(u).path for u in re.findall(r'<loc>(.*?)</loc>', data.decode())]
assert len(routes) == 50, f'Expected 50 canonical sitemap URLs, got {len(routes)}'
routes += ['/privacy','/terms']
results, links = [], set()
with ThreadPoolExecutor(max_workers=4) as executor:
    for future in as_completed([executor.submit(check_page, route) for route in routes]):
        result, found = future.result(); results.append(result); links.update(found)
        if len(results) % 10 == 0: print(f'Checked {len(results)}/{len(routes)} pages', flush=True)
assert len({r['title'] for r in results}) == len(results), 'Duplicate page titles'
remaining = links - set(routes)
with ThreadPoolExecutor(max_workers=4) as executor:
    futures = {executor.submit(fetch, route):route for route in remaining}
    for future in as_completed(futures):
        status, _, _ = future.result(); assert status == 200, f'Internal destination {futures[future]}: {status}'
redirects = json.loads((ROOT/'src/lib/legacy-redirects.json').read_text()) + [
    {'source':'/contact-us','destination':'/contact'}, {'source':'/adults-brazilian-jiu-jitsu-spring','destination':'/programs/adult-bjj'},
    {'source':'/kids-brazilian-jiu-jitsu-spring','destination':'/programs/kids-bjj'}, {'source':'/wrestling-jiu-jitsu-spring','destination':'/programs/wrestling'},
    {'source':'/services','destination':'/#programs'}, {'source':'/our-team','destination':'/about'}]
for redirect in redirects:
    status, headers, _ = fetch(redirect['source'])
    assert status == 308 and headers.get('location') in {redirect['destination'],BASE+redirect['destination']}, f'Redirect {redirect["source"]}'
for route in ['/not-a-real-page','/news/not-a-real-post','/competitions/not-a-real-event']:
    assert fetch(route)[0] == 404, f'Real 404 for {route}'
status, _, robots = fetch('/robots.txt')
assert status == 200 and b'Disallow: /api/' in robots and b'Sitemap: https://finessebjj.com/sitemap.xml' in robots
summary = {'deployment':BASE,'pages':sorted(results,key=lambda r:r['route']),'internalDestinations':len(links),'redirects':len(redirects),'notFoundChecks':3,'seconds':round(time.monotonic()-started,1)}
REPORT.write_text(json.dumps(summary,indent=2)+'\n')
print(f'PASS: {len(results)} deployed pages, {len(links)} internal destinations, {len(redirects)} redirects, 3 real 404s; production robots/sitemap and confirmed timetable.',flush=True)
