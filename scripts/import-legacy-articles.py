"""Import the approved public WordPress export as safe React data, never executable HTML.
Usage: python3 scripts/import-legacy-articles.py /path/to/public-post-export.json
Only finessebjj.com/wp-content/uploads media can be downloaded. No cloud writes.
"""
import hashlib
import html
import json
import re
import sys
import subprocess
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
ALLOWED = {'p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'strong', 'b', 'em', 'i', 'br', 'a', 'img', 'video'}
VOID = {'img', 'source', 'br', 'hr', 'input', 'meta', 'link'}
REDIRECTS = {'/contact-us': '/contact', '/adults-brazilian-jiu-jitsu-spring': '/programs/adult-bjj', '/kids-brazilian-jiu-jitsu-spring': '/programs/kids-bjj', '/wrestling-jiu-jitsu-spring': '/programs/wrestling', '/services': '/#programs', '/our-team': '/about'}
REDIRECTS.update({item['source']: item['destination'] for item in json.loads((ROOT / 'src/lib/legacy-redirects.json').read_text())})
media_cache, media_notes = {}, []
def media(src):
    parsed = urlparse(src)
    if parsed.hostname not in {'finessebjj.com', 'www.finessebjj.com'} or not parsed.path.startswith('/wp-content/uploads/'):
        return None
    url = 'https://finessebjj.com' + parsed.path
    if url in media_cache: return media_cache[url]
    extension = Path(parsed.path).suffix.lower()
    if extension not in {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.webm'}: return None
    local = '/legacy-media/' + hashlib.sha256(url.encode()).hexdigest()[:16] + extension
    target = ROOT / 'public' / local.lstrip('/')
    target.parent.mkdir(parents=True, exist_ok=True)
    try:
        if not target.exists():
            subprocess.run(['curl', '--fail', '--silent', '--show-error', '--max-time', '25', '--max-filesize', '40000000', '--output', str(target), url], check=True, capture_output=True)
        media_cache[url] = local
        return local
    except Exception as error:
        media_notes.append({'url': url, 'error': str(error)})
        media_cache[url] = None
        return None

def href(raw):
    parsed = urlparse(raw)
    if parsed.scheme not in {'', 'https', 'http', 'mailto', 'tel'}: return None
    if parsed.hostname and parsed.hostname.endswith('sparkpages.io'): return None
    if parsed.hostname in {'finessebjj.com', 'www.finessebjj.com'} and parsed.path.startswith('/wp-content/uploads/'):
        return media(raw)
    if parsed.hostname in {'finessebjj.com', 'www.finessebjj.com'} or not parsed.hostname and parsed.scheme not in {'mailto', 'tel'}:
        route = parsed.path.rstrip('/') or '/'
        return REDIRECTS.get(route, route) + (('#' + parsed.fragment) if parsed.fragment else '')
    return raw

class SafeArticle(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = {'tag': 'fragment', 'children': []}
        self.stack = [('root', self.root)]
        self.ignored = 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in {'script', 'style', 'iframe'}:
            self.ignored += 1
            return
        if self.ignored: return
        if tag == 'source':
            for name, parent in reversed(self.stack):
                if name == 'video' and not parent.get('src'): parent['src'] = media(attrs.get('src', ''))
            return
        node = {'tag': tag if tag in ALLOWED else 'fragment', 'children': []}
        if tag == 'a': node['href'] = href(attrs.get('href', ''))
        if tag == 'img':
            source = attrs.get('data-src') or attrs.get('data-lazy-src') or attrs.get('src', '')
            node['src'] = media(source)
            node['alt'] = attrs.get('alt', '')
            node['width'] = int(attrs.get('width', '0')) if attrs.get('width', '').isdigit() else 0
            node['height'] = int(attrs.get('height', '0')) if attrs.get('height', '').isdigit() else 0
            if not node['src']: return
            dimensions = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(ROOT / 'public' / node['src'].lstrip('/'))], capture_output=True, text=True).stdout
            for prop, name in [('width', 'pixelWidth'), ('height', 'pixelHeight')]:
                found = re.search(name + r': (\d+)', dimensions)
                if found: node[prop] = int(found.group(1))
        if tag == 'video': node['src'] = media(attrs.get('src', ''))
        self.stack[-1][1]['children'].append(node)
        if tag not in VOID: self.stack.append((tag, node))
    def handle_endtag(self, tag):
        if tag in {'script', 'style', 'iframe'}:
            self.ignored = max(0, self.ignored - 1)
            return
        if self.ignored: return
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break
    def handle_data(self, text):
        if not self.ignored and text: self.stack[-1][1]['children'].append(text)

def plain(value): return re.sub(r'<[^>]+>', '', html.unescape(value)).strip()

def main():
    source = json.loads(Path(sys.argv[1]).read_text())
    assert len(source) == 35, 'Review the source inventory before importing a different number of articles'
    articles, review = [], []
    for post in source:
        route = urlparse(post['link']).path.rstrip('/')
        assert re.fullmatch(r'/(kids|adult|uncategorized)/[a-z0-9-]+', route), route
        body = post['content']['rendered']
        notes = ['Original archive claims and advice have not been independently substantiated.']
        corrected = False
        if re.search(r'17711\s+kuykendahl', body, re.I):
            if post['date'][:4] == '2020': notes.append('Historical relocation story retains its dated former location; archive notice supplies the current address.')
            else:
                body, count = re.subn(r'17711\s+Kuykendahl\s+Rd\.?\s*(?:a,?\s*)?,?\s*Spring,?\s*TX\s*77379', '18300 Strack Dr, Suite 300, Spring, TX 77379', body, flags=re.I)
                corrected = count > 0
                notes.append(f'Corrected {count} occurrences of the former contact address to the user-confirmed current address.')
        if re.search(r'\$\d+', body): notes.append('Historical price or market-size figures: not current academy pricing.')
        if 'sparkpages.io' in body: notes.append('Historical Spark promotion link disabled; no replacement offer invented.')
        if re.search(r'\b\d+(?:\.\d+)?\s*(?:%|percent)\b|nearly \d+', plain(body), re.I): notes.append('Numerical/percentage claims require source review.')
        parser = SafeArticle(); parser.feed(body)
        article = {'path': route, 'slug': post['slug'], 'category': route.split('/')[1], 'title': plain(post['title']['rendered']), 'published': post['date'][:10], 'modified': '2026-10-29' if corrected else post['modified'][:10], 'sourceUrl': post['link'], 'description': re.sub(r'\s+', ' ', plain(post['excerpt']['rendered']))[:250], 'body': parser.root['children']}
        if not article['description']: article['description'] = article['title'] + ' — from the Finesse BJJ Academy article archive.'
        articles.append(article)
        review.append({'path': route, 'notes': notes})
    (ROOT / 'src/lib/legacy-posts.json').write_text(json.dumps(articles, ensure_ascii=False, separators=(',', ':')) + '\n')
    (ROOT / 'docs/legacy-article-review.json').write_text(json.dumps({'captured': '2026-10-29', 'articles': review, 'mediaIssues': media_notes}, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'articles': len(articles), 'localMedia': sum(bool(v) for v in media_cache.values()), 'mediaIssues': media_notes}, indent=2))
if __name__ == '__main__': main()
