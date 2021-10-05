var http = require('http');
var fs = require('fs');
var app = http.createServer(function(request,response){
    var url = request.url;
    if(request.url == '/'){
      url = '/index.html';
    }
    if(request.url == '/favicon.ico'){
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(200);
    // console.log(__dirname + url);> cmd에서 접속자가 페이지를 누를때 url을 콘솔로 출력해줌.
    response.end(fs.readFileSync(__dirname + url));

});
app.listen(3000);
