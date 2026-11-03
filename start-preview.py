#!/usr/bin/env python3
"""Optional local static preview. No remote connection, uploads, or backend."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import argparse, functools

def main():
    p=argparse.ArgumentParser(description='PaperDaily local preview')
    p.add_argument('--port',type=int,default=8000)
    args=p.parse_args()
    handler=functools.partial(SimpleHTTPRequestHandler,directory=str(Path(__file__).resolve().parent))
    try:
        with ThreadingHTTPServer(('127.0.0.1',args.port),handler) as server:
            print(f'Open http://127.0.0.1:{args.port}/index.html (Ctrl+C stops the preview)')
            server.serve_forever()
    except KeyboardInterrupt: pass
    except OSError as exc: p.error(str(exc))
if __name__=='__main__': main()
