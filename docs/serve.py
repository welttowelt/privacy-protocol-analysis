import http.server, socketserver, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
with socketserver.TCPServer(("", 8742), http.server.SimpleHTTPRequestHandler) as httpd:
    httpd.serve_forever()
