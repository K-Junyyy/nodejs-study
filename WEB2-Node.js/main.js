var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitize_html = require('sanitize-html');


// http모듈로 서버를 생성한다. 
var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;


  if (pathname === '/') { // pathname이 정상적인 경우

    if (queryData.id == undefined) { // Home일 경우

      fs.readdir('./data', 'utf8', function (error, filelist) {

        var title = 'Welcome';
        var description = "Hello, Node.js";
        var list = template.list(filelist);
        var html = template.html(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href ="/create">create</a>`);
        response.writeHead(200);
        response.end(html);
      });
    }
    else { // CSS, HTML, JavaScript인 경우
      fs.readdir('./data', function (error, filelist) {
        var filteredID = path.parse(queryData.id).base
        fs.readFile(`data/${filteredID}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var sanitized_title = sanitize_html(title);
          var sanitized_description = sanitize_html(description,{
            allowedTags:['h1']
          });
          var list = template.list(filelist);
          var html = template.html(title, list,
            `<h2>${sanitized_title}</h2>${sanitized_description}`,
            `<a href ="/create">create</a> 
             <a href ="/update?id=${sanitized_title}">update</a>
             <form action = "delete_process" method = "POST">
              <input type = "hidden" name = "id" value = "${sanitized_title}">
              <input type = "submit" value = "delete">
             </form>`);
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  }
  else if (pathname == "/create") {
    fs.readdir('./data', function (error, filelist) {

      var title = 'create';
      var list = template.list(filelist);
      var html = template.html(title, list,
        `
      <form action="/create_process" method = "POST">
      <p>제목 : <input type="text" name = "title" placeholder = "title"></p>
      <p><textarea name = "description" cols = "60" rows = "20" placeholder = "description"></textarea></p>
      <p><input type="submit"></p>
      </form>
      `,
        //`<a href ="/create">create</a> <a href ="/update?id=${title}">update</a>`);
        ``);
      response.writeHead(200);
      response.end(html);
    });
  }
  else if (pathname == "/create_process") {

    var body = '';
    request.on('data', function (data) {
      body += data;
    })
    request.on('end', function () {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;

      fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      })
    })


  }
  else if (pathname == '/update') {
    fs.readdir('./data', function (error, filelist) {
      var filteredID = path.parse(queryData.id).base
      fs.readFile(`data/${filteredID}`, 'utf8', function (err, description) {
        var title = queryData.id;
        var list = template.list(filelist);
        var html = template.html(title, list,
          `
          <form action="/update_process" method = "POST">
          <p><input type = "hidden" name = "id" value = "${title}"</p>
          <p>제목 : <input type = "text" name = "title" placeholder = "title" value = "${title}"></p>
          <p><textarea name = "description" cols = "60" rows = "20" placeholder = "description">${description}</textarea></p>
          <p><input type="submit"></p>
          </form>
          `,
          //`<a href ="/create">create</a> <a href ="/update?id=${title}">update</a>`);
          ``);
        response.writeHead(200);
        response.end(html);
      });
    });
  }
  else if (pathname == '/update_process') {
    var body = '';
    request.on('data', function (data) {
      body += data;
    })
    request.on('end', function () {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function () {
        fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        })
      })
    })

  }
  else if (pathname == '/delete_process') {
    var body = '';
    request.on('data', function (data) {
      body += data;
    })
    request.on('end', function () {
      var post = qs.parse(body);
      var id = post.id;
      var filteredID = path.parse(id).base

      fs.unlink(`data/${filteredID}`, function (err) {
        response.writeHead(302, { Location: `/` });
        response.end();
      })

    })
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