#! /usr/bin/env python

# Usage: python cors_http_server.py <port>

from SimpleHTTPServer import SimpleHTTPRequestHandler, BaseHTTPServer

class CORSRequestHandler (SimpleHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', 'https://edlablog.eng.ed.ac.uk/post')
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, content-type, Authorization")
        SimpleHTTPRequestHandler.end_headers(self)

if __name__ == '__main__':
    BaseHTTPServer.test(CORSRequestHandler, BaseHTTPServer.HTTPServer)
