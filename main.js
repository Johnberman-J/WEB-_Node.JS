var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(h2Title, list, body) {
  return  `
            <!doctype html>
            <html>
            <head>
              <title>WEB1 - ${h2Title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
              <a href="/create">Create</a>
              ${body}
            </body>
            </html>
          `;
}

function templateList(filelist) {
  var list = '<ul>';
  var i = 0;
  while(i<filelist.length) {
    var filename = filelist[i].substring(0, (filelist[i].length-4));
    list = list + `<li><a href="/?id=${filelist[i]}">${filename}</a></li>`
    i++;
  }
  list = list + '</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;
    var title = queryData.id;


    if(pathName === '/') {
      if(queryData.id === undefined) {

        fs.readdir('./data', function(err, filelist) {
          var title = `Johnberman's Blog`;
          var description = 'Hello, Node.JS!';
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title.substring(0,(title.length-4))}</h2><p>${description}</p>`);

          response.writeHead(200);
          response.end(template);
        })

      } else {
        fs.readdir('./data', function(err, filelist) {
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title.substring(0,(title.length-4))}</h2><p>${description}</p>`);

            response.writeHead(200);
            response.end(template);
          });
      });
    }

  } else if(pathName === '/create') {

      fs.readdir('./data', function(err, filelist) {
        var title = `WEB - Create`;
        var list = templateList(filelist);
        var template = templateHTML(title, list, `
            <form action="http://localhost:3000/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p><textarea name="description" placeholder="description"></textarea></p>
              <p><input type="submit"></p>
            </form>
        `);

        response.writeHead(200);
        response.end(template);
      })

  } else if(pathName === '/create_process') {
      var body = '';
      request.on('data', function(data) {
        body = body + data;
        // 아래는 패킷이 너무 클경우 연결을 끊어버리는 일종의 보안장치.
        // if (body.length > 1e6)
        //   request.connection.destroy();
      });
      request.on('end', function() {
        var post = qs.parse(body);
      });

      response.writeHead(404);
      response.end('Success');
  } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
