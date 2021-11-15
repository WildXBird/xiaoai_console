var http = require('http');
var open = require('open');
const port = 15349
http.createServer(function (request, response) {
    try {
        console.log(request)
        let target = new URL(`http://127.0.0.1:8888${request.url}`).searchParams.get("url")

        open(target)
        response.writeHead(200, { 'Content-Type': 'text/plain' });

        // 发送响应数据 "Hello World"
        response.end('Hello World\n');
    } catch (error) {
        response.writeHead(403, { 'Content-Type': 'text/plain' });

        // 发送响应数据 "Hello World"
        response.end('Hello World\n');
    }


}).listen(15349);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:15349/');