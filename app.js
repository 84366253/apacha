const fs = require('fs');

const http = require('http');

const path = require('path');

const mime = require('mime');

// 获取本地绝对路径  d:\node.js\dom-2_夜\www
let rootpath = path.join(__dirname, 'www');

let server = http.createServer((request, response) => {
    //获取本地绝对路径加拼接网络路径
    let targetPath = path.join(rootpath, request.url);

    //判断路径是否存在
    if (fs.existsSync(targetPath)) {
        //此路径是文件还是文件夹
        fs.stat(targetPath, (err, data) => {
            //是文件直接读取并且输出
            if (data.isFile()) {
                response.setHeader('content-type',mime.getType(targetPath));
                fs.readFile(targetPath, (err, data) => {
                    response.end(data);
                });
            }
            // 是文件夹遍历成li标签a标签
            if (data.isDirectory()) {
                fs.readdir(targetPath, (err, data) => {
                    let tem = '';
                    for (let i = 0; i < data.length; i++) {
                        tem += `
                            <li>
                            <a href="${request.url}${request.url== '/' ? '' : '/' }${data[i]}">${data[i]}</a>
                            </li>
                        `
                    }
                    response.end(`
                    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
              <html>
              
              <head>
                  <title>Index of/ </title>
              </head>
              
              <body>
                  <h1>Index of ${request.url}</h1>
                  <ul>
                      ${tem}
                  </ul>
              </body>
              
              </html>
                    `)
                });
            }

        });
    } else {
        //路径不存在直接显示404 表示未找到此地址
        response.statusCode = 404;
        response.setHeader('content-type', 'text/html;charset=utf-8');
        response.end(`
        <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
        <html><head>
        <title>404 Not Found</title>
        </head><body>
        <h1>Not Found</h1>
        <p>你请求的${request.url} 不在服务器上哦,检查一下呗</p>
        </body></html>
    `);
    }


});


server.listen(3000, '127.0.0.1', () => {
    console.log('监听127.0.0.1');
});

