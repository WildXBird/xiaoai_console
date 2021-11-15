var http = require('http');
var open = require('open');

process.on('uncaughtException', function (err) {
    console.error("uncaughtException", err);
    // process.exit(2)
});
process.on('unhandledRejection', function (err) {
    console.error("!!!unhandledRejection", err);
    // process.exit(2)
});


const port = 15349
http.createServer(function (request, response) {
    try {
        console.log(request.url)
        let url = new URL(`http://127.0.0.1:8888${request.url}`)
        let target = url.searchParams.get("url")
console.log("url",url)
console.log("target",target)
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