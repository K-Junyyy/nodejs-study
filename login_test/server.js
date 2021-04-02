var express = require('express');
var http = require("http");
var path = require("path");
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res){

	console.log("login success!");

	var id = req.param("ID");
	var pw = req.param("PW");

	res.writeHead("200", {"Content-Type":"text/html;charset=utf8"});
	res.write("ID : " + id);
	res.write("<br>");
	res.write("PW : " + pw);
	res.end();

});

http.createServer(app).listen(3000, function() {
	console.log("server is running...");

});