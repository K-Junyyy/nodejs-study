var http = require('http'),
fs = require('fs');
 
var server = http.createServer(function(request, response) {
    fs.readFile('./index.html', function(error, data) {
        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.end(data);
    });
}).listen(3000, function() {
    console.log('Server Start!');
});