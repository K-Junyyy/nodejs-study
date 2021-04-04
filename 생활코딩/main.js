// 서버 사용을 위해 http모듈을 http라는 변수에 담는다.
var http = require('http');
var fs = require('fs');
var url = require('url');

// http모듈로 서버를 생성한다. 
var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === '/') { // pathname이 정상적인 경우

    if (queryData.id == undefined) { // Home일 경우

      fs.readdir('./data', function (error, filelist) {

        var title = 'Welcome';
        var description = "Hello, Node.js";
        var list = '<ul>';

        for (var i = 0; i < filelist.length; i++) {
          list += `<li><a href="?id=${filelist[i]}">${filelist[i]}</a></li>`;
        }
        list += '</ul>';

        var tamplete = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>`;
        response.writeHead(200);
        response.end(tamplete);
      });


    }
    else { // CSS, HTML, JavaScript인 경우

      fs.readdir('./data', function (error, filelist) {

        var list = '<ul>';
        for (var i = 0; i < filelist.length; i++) {
          list += `<li><a href="?id=${filelist[i]}">${filelist[i]}</a></li>`;
        }
        list += '</ul>';

        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var tamplete = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>`;
          response.writeHead(200);
          response.end(tamplete);
        });
      });
    }

  }
  else { // 잘못된 요청
    response.writeHead(404);
    response.end('Not found');
  }

});

// listen 함수로 3000 포트에 서버를 실행한다.
app.listen(3000, function () {
  console.log("server is running...")
});