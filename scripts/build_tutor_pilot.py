"""Build a small private tutor Worker without migrating the public learning app."""
import json
import shutil
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
HUB = 'https://haha-physics-learning-m4.low556902.chatgpt.site'


def build(output, origin):
    parsed = urlparse(origin)
    if parsed.scheme != 'https' or not parsed.hostname or not parsed.hostname.endswith('.chatgpt.site') or parsed.path or parsed.query or parsed.fragment or parsed.username or parsed.port:
        raise ValueError('Use the exact HTTPS Site origin, without a trailing slash.')
    if output.exists() and any(output.iterdir()):
        raise ValueError('Output directory must be empty.')
    assets = {}
    types = {'.mjs': 'text/javascript; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml'}
    paths = list((ROOT / 'app/tutor').glob('*')) + [ROOT / 'app/physics-notes' / name for name in ('content.js', 'models.js', 'notes.js')] + [ROOT / 'app/favicon.svg']
    for path in sorted(paths):
        if not path.is_file() or path.suffix not in types:
            raise ValueError('Unexpected asset in tutor build.')
        body = path.read_text(encoding='utf-8')
        url = '/' + path.relative_to(ROOT / 'app').as_posix()
        if url == '/tutor/index.html':
            body = body.replace('../catalog.html', HUB + '/index.html')
            body = body.replace('Tutor preview · English pilot.', 'Private tutor pilot · English only.').replace('YOON / TUTOR LAB', 'HAHA / PRIVATE TUTOR PILOT')
            assets['/tutor/'] = {'body': body, 'type': types[path.suffix]}
        assets[url] = {'body': body, 'type': types[path.suffix]}
    sources = []
    for path in ('app/tutor/teaching.mjs', 'scripts/tutor_provider.mjs', 'server/tutor-worker.mjs'):
        lines = (ROOT / path).read_text(encoding='utf-8').splitlines()
        sources.append('\n'.join(line.removeprefix('export ') for line in lines if not line.startswith('import ')))
    bundle = '\n'.join(sources) + '\nconst assets=' + json.dumps(assets, ensure_ascii=False) + ';\nexport default pilotWorker(assets,' + json.dumps(origin) + ');\n'
    if len(bundle.encode('utf-8')) > 1_000_000:
        raise ValueError('Tutor Worker exceeds the bounded artifact size.')
    target = output / 'dist/server'
    target.mkdir(parents=True)
    (target / 'index.js').write_text(bundle, encoding='utf-8')
    shutil.copytree(ROOT / 'server/drizzle', output / 'drizzle')
    return len(assets), len(bundle.encode('utf-8'))


if __name__ == '__main__':
    count, size = build(Path(sys.argv[1]).resolve(), sys.argv[2])
    print(f'Built private tutor: {count} routes, {size} bytes; public app unchanged.')
