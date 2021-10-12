var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body) {
  return  `
            <!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              ${list}
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
          var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);

          response.writeHead(200);
          response.end(template);
        })

      } else {
        fs.readdir('./data', function(err, filelist) {
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
            response.writeHead(200);
            response.end(template);
          });
      });
    }

    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
