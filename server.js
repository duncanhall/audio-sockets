var http = require('http');
var port = 8000;

http.createServer(function (request, response) {
	response.writeHead(20, {'Content-Type':'text/plain'});
	response.end('node-websockets server running.');
}).listen(port);

console.log('Server running on port ' + port);
