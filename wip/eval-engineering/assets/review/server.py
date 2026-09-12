"""Dependency-free local review workspace. Never serves the private manifest."""
import argparse
import fcntl
from datetime import datetime, timezone
import hashlib
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
from pathlib import Path
import secrets
from urllib.parse import urlparse


def digest(value):
    return hashlib.sha256(value).hexdigest()


def now():
    return datetime.now(timezone.utc).isoformat()


class Review:
    def __init__(self, manifest, state_dir):
        self.manifest_path = Path(manifest).resolve()
        self.manifest = json.loads(self.manifest_path.read_text())
        self.state_dir = Path(state_dir).resolve()
        self.state_dir.mkdir(parents=True, exist_ok=True)
        self.state_path = self.state_dir / 'review-state.json'
        self.tasks = {}
        self.outputs = {}
        self.assets = Path(__file__).parent
        m = self.manifest
        if not isinstance(m.get('title'), str) or not isinstance(m.get('tasks'), list) or not m['tasks']:
            raise ValueError('Manifest requires title and nonempty tasks')
        fingerprints = []
        for task in m['tasks']:
            tid = task['id']
            if not isinstance(tid, str) or tid in self.tasks:
                raise ValueError('Task IDs must be unique strings')
            if not isinstance(task.get('request'), str) or not isinstance(task.get('title'), str):
                raise ValueError('Each task requires title and request')
            if len(task['outputs']) not in (1, 2):
                raise ValueError('A task needs one or two outputs')
            self.tasks[tid] = task
            for output in task['outputs']:
                if ('path' in output) == ('text' in output):
                    raise ValueError('Each output requires exactly one of path or text')
                if 'path' in output:
                    path = (self.manifest_path.parent / output['path']).resolve()
                    raw = path.read_bytes()
                    output['_path'] = str(path)
                    if output.get('sha256') != digest(raw):
                        raise ValueError('Output hash is missing or does not match the frozen manifest')
                else:
                    if not m.get('preview'):
                        raise ValueError('Inline output text is only for labeled previews')
                    raw = output['text'].encode()
                    output['_path'] = None
                output['_text'] = raw.decode('utf-8')
                output['_sha256'] = digest(raw)
                fingerprints.append(output['_sha256'])
        self.fingerprint = digest(self.manifest_path.read_bytes() + json.dumps(fingerprints).encode())
        self.lock = (self.state_dir / 'server.lock').open('a')
        try:
            fcntl.flock(self.lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            self.load_state()
        except BlockingIOError:
            self.lock.close()
            raise ValueError('This review already has a running server. Reuse its URL or stop it before restarting.')
        except Exception:
            self.lock.close()
            raise
        for tid, entries in self.state['mapping'].items():
            for entry in entries:
                self.outputs[entry['id']] = (tid, entry, self.tasks[tid]['outputs'][entry['index']])

    def load_state(self):
        if self.state_path.exists():
            self.state = json.loads(self.state_path.read_text())
            if self.state['fingerprint'] != self.fingerprint:
                raise ValueError('Manifest or outputs changed. Start a new state directory; existing feedback will not be retargeted.')
        else:
            mapping = {}
            for tid, task in self.tasks.items():
                indexes = list(range(len(task['outputs'])))
                if self.manifest.get('blind', False):
                    secrets.SystemRandom().shuffle(indexes)
                mapping[tid] = [{'id': secrets.token_hex(12), 'index': idx,
                                 'label': chr(65 + position)} for position, idx in enumerate(indexes)]
            self.state = {'fingerprint': self.fingerprint, 'mapping': mapping,
                          'comments': [], 'decisions': {}, 'revealed_at': None, 'revision': 0,
                          'operations': {}, 'events': [], 'blind_snapshot': None,
                          'workspace_id': secrets.token_hex(16)}
            self.write()

    def write(self):
        temp = self.state_path.with_suffix('.tmp')
        temp.write_text(json.dumps(self.state, ensure_ascii=False, indent=2) + '\n')
        temp.replace(self.state_path)

    def close(self):
        self.lock.close()

    def assert_frozen(self):
        if digest(self.manifest_path.read_bytes() + json.dumps([
            digest(Path(o['_path']).read_bytes()) if o['_path'] else o['_sha256']
            for t in self.tasks.values() for o in t['outputs']]).encode()) != self.fingerprint:
            raise ValueError('Source changed. Review is paused to protect existing annotations.')

    def is_blind(self):
        return bool(self.manifest.get('blind')) and not self.state['revealed_at']

    def public_feedback(self):
        comments = [{k: c[k] for k in ('id', 'task_id', 'output_id', 'label', 'scope',
                    'quote', 'start', 'end', 'comment', 'created_at', 'updated_at')}
                    for c in self.state['comments']]
        decisions = {tid: {k: d[k] for k in ('choice', 'reason', 'completed', 'updated_at')}
                     for tid, d in self.state['decisions'].items()}
        return {'comments': comments, 'decisions': decisions, 'revision': self.state['revision']}

    def public(self, check_source=True):
        if check_source:
            self.assert_frozen()
        tasks = []
        for tid, task in self.tasks.items():
            outputs = []
            for entry in self.state['mapping'][tid]:
                o = task['outputs'][entry['index']]
                visible = {'id': entry['id'], 'label': entry['label'], 'text': o['_text'],
                           'words': len(o['_text'].split()), 'status': o.get('status', 'complete')}
                if self.state['revealed_at']:
                    visible['identity'] = o.get('identity', 'Unnamed candidate')
                outputs.append(visible)
            tasks.append({'id': tid, 'title': task['title'], 'request': task['request'],
                          'context': task.get('context', []), 'questions': task.get('questions', []),
                          'outputs': outputs})
        return {'workspace_id': self.state['workspace_id'], 'title': self.manifest['title'], 'subtitle': self.manifest.get('subtitle', ''),
                'preview': bool(self.manifest.get('preview')), 'blind': self.is_blind(),
                'blind_available': bool(self.manifest.get('blind')), 'revealed': bool(self.state['revealed_at']),
                'disclosure': self.manifest.get('disclosure', ''), 'tasks': tasks,
                'feedback': self.public_feedback()}

    def mutate(self, body):
        operation = body.get('operation_id')
        if not isinstance(operation, str) or not 1 <= len(operation) <= 100:
            raise ValueError('A mutation requires an operation ID')
        payload_hash = digest(json.dumps(body, sort_keys=True).encode())
        if operation in self.state['operations']:
            if self.state['operations'][operation] != payload_hash:
                raise ValueError('An operation ID cannot be reused for different changes')
            return self.public(check_source=False)
        self.assert_frozen()
        if type(body.get('revision')) is not int or body['revision'] != self.state['revision']:
            raise Conflict('Another window saved changes. Reload the latest review before saving this draft.')
        action = body.get('action')
        previous = json.loads(json.dumps(self.state))
        try:
            if action == 'comment':
                oid = body['output_id']
                tid, entry, output = self.outputs[oid]
                cid, comment = body['id'], body['comment']
                if not isinstance(cid, str) or not 1 <= len(cid) <= 100 or not isinstance(comment, str) or not 0 < len(comment.strip()) <= 20000:
                    raise ValueError('Enter a comment of at most 20,000 characters')
                scope = body.get('scope', 'whole_output')
                start, end, quote = None, None, ''
                if scope == 'selected_text':
                    start, end, quote = body['start'], body['end'], body['quote']
                    raw = output['_text'].encode('utf-16-le')
                    if type(start) is not int or type(end) is not int or not 0 <= start < end <= len(raw) // 2:
                        raise ValueError('Invalid source range')
                    if raw[start * 2:end * 2].decode('utf-16-le') != quote:
                        raise ValueError('Selected text no longer matches the output')
                elif scope != 'whole_output':
                    raise ValueError('Invalid comment scope')
                old = next((c for c in self.state['comments'] if c['id'] == cid), None)
                if old and (old['output_id'] != oid or old['scope'] != scope or old['quote'] != quote or old['start'] != start or old['end'] != end):
                    raise ValueError('A comment cannot be moved to another output or passage')
                stamp = now()
                c = {'id': cid, 'task_id': tid, 'output_id': oid, 'label': entry['label'],
                     'scope': scope, 'start': start, 'end': end, 'quote': quote, 'comment': comment,
                     'artifact': output['_path'], 'sha256': output['_sha256'],
                     'run_id': output.get('run_id'), 'trial_id': output.get('trial_id', tid),
                     'offset_unit': 'UTF-16 code units', 'blinded': self.is_blind(),
                     'reviewer': self.manifest.get('reviewer', 'Local reviewer'),
                     'created_at': old['created_at'] if old else stamp, 'updated_at': stamp}
                if old:
                    c['history'] = old.get('history', []) + ([{'comment': old['comment'], 'updated_at': old['updated_at']}] if old['comment'] != comment else [])
                    self.state['comments'][self.state['comments'].index(old)] = c
                else:
                    self.state['comments'].append(c)
            elif action == 'decision':
                tid = body['task_id']
                task = self.tasks[tid]
                choice, reason, completed = body.get('choice'), body.get('reason', ''), body.get('completed', False)
                if not isinstance(reason, str) or len(reason) > 20000 or type(completed) is not bool:
                    raise ValueError('Invalid decision')
                paired = len(task['outputs']) == 2
                if choice not in (('A', 'B', 'tie', 'neither', None) if paired else (None,)):
                    raise ValueError('Invalid choice')
                if completed and paired and (choice is None or not reason.strip()):
                    raise ValueError('Choose A, B, tie or neither and give a reason before finishing')
                if completed and any(o.get('status', 'complete') != 'complete' for o in task['outputs']):
                    raise ValueError('Resolve unavailable outputs before completing the review')
                self.state['decisions'][tid] = {'choice': choice, 'reason': reason,
                    'completed': completed, 'updated_at': now(), 'blinded': self.is_blind(),
                    'reviewer': self.manifest.get('reviewer', 'Local reviewer'),
                    'outputs': [{'id': e['id'], 'label': e['label'],
                        'sha256': task['outputs'][e['index']]['_sha256'],
                        'artifact': task['outputs'][e['index']]['_path'],
                        'run_id': task['outputs'][e['index']].get('run_id')}
                        for e in self.state['mapping'][tid]]}
            elif action == 'reveal':
                if not self.manifest.get('blind') or not all(self.state['decisions'].get(t, {}).get('completed') for t in self.tasks):
                    raise ValueError('Finish every task before revealing identities')
                self.state['revealed_at'] = self.state['revealed_at'] or now()
                if self.state['blind_snapshot'] is None:
                    self.state['blind_snapshot'] = {'comments': previous['comments'], 'decisions': previous['decisions'], 'at': self.state['revealed_at']}
            else:
                raise ValueError('Unknown action')
            self.state['revision'] += 1
            self.state['operations'][operation] = payload_hash
            self.state['events'].append({'at': now(), 'action': action, 'operation_id': operation,
                'revision': self.state['revision'], 'blinded': bool(self.manifest.get('blind')) and not previous['revealed_at'],
                'previous_comments': previous['comments'] if action == 'comment' else None,
                'previous_decisions': previous['decisions'] if action == 'decision' else None})
            self.write()
        except Exception:
            self.state = previous
            raise
        return self.public(check_source=False)


class Conflict(ValueError):
    pass


def make_handler(review, token):
    class Handler(BaseHTTPRequestHandler):
        def reply(self, body, status=200, mime='application/json', filename=None):
            raw = json.dumps(body, ensure_ascii=False).encode() if mime == 'application/json' else body
            self.send_response(status)
            self.send_header('Content-Type', mime + '; charset=utf-8')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.send_header('Referrer-Policy', 'no-referrer')
            self.send_header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'")
            if filename:
                self.send_header('Content-Disposition', f'attachment; filename="{filename}"')
            self.send_header('Content-Length', str(len(raw)))
            self.end_headers()
            self.wfile.write(raw)

        def valid_host(self):
            return self.headers.get('Host') == f'127.0.0.1:{self.server.server_port}'

        def do_GET(self):
            path = urlparse(self.path).path
            if not self.valid_host() or not path.startswith('/' + token + '/'):
                return self.reply({'error': 'Not found'}, 404)
            route = path[len(token) + 2:]
            try:
                if route == 'data':
                    return self.reply(review.public())
                if route.startswith('output/'):
                    _, entry, output = review.outputs[route.split('/')[1]]
                    review.assert_frozen()
                    return self.reply(output['_text'].encode(), mime='text/plain', filename='Output-' + entry['label'] + '.md')
                files = {'': ('index.html', 'text/html'), 'styles.css': ('styles.css', 'text/css'),
                         'app.js': ('app.js', 'text/javascript'), 'components.js': ('components.js', 'text/javascript')}
                if route in files:
                    name, mime = files[route]
                    return self.reply((review.assets / name).read_bytes(), mime=mime)
                return self.reply({'error': 'Not found'}, 404)
            except (ValueError, KeyError, OSError) as error:
                return self.reply({'error': 'Review data unavailable or changed. Ask the agent to check the source.'}, 409)

        def do_POST(self):
            if not self.valid_host() or self.path != '/' + token + '/action' or self.headers.get('Origin') != f'http://127.0.0.1:{self.server.server_port}':
                return self.reply({'error': 'Invalid origin or route'}, 403)
            try:
                length = int(self.headers.get('Content-Length', '0'))
                if not 0 < length <= 100000:
                    raise ValueError('Invalid request size')
                body = json.loads(self.rfile.read(length))
                if not isinstance(body, dict):
                    raise ValueError('Invalid request')
                return self.reply(review.mutate(body))
            except Conflict as error:
                return self.reply({'error': str(error)}, 409)
            except (ValueError, KeyError, TypeError, UnicodeError):
                return self.reply({'error': 'Could not save: check the selection, comment, or decision. No feedback was changed.'}, 400)
            except OSError:
                return self.reply({'error': 'Local save failed. Your draft is still in this browser; retry when storage is available.'}, 500)

        def log_message(self, *args):
            pass
    return Handler


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--manifest', required=True)
    parser.add_argument('--state', required=True)
    parser.add_argument('--port', type=int, default=None)
    args = parser.parse_args()
    review = Review(args.manifest, args.state)
    token = secrets.token_urlsafe(24)
    server_info = review.state_dir / 'server.json'
    port = args.port
    if port is None:
        port = urlparse(json.loads(server_info.read_text())['url']).port if server_info.exists() else 0
    server = HTTPServer(('127.0.0.1', port), make_handler(review, token))
    url = f'http://127.0.0.1:{server.server_port}/{token}/'
    server_info.write_text(json.dumps({'url': url}))
    print(url, flush=True)
    server.serve_forever()
