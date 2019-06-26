var bodyParser = require("body-parser");
var express = require('express');
var app = express();
var https = require('https');
var http = require('http');
var fs = require('fs');
var server = null;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var jwt = require('jsonwebtoken');

var port = 3000;
var isHTTPS = true;

if(isHTTPS){
	console.log("https enabled");
	var pkey = fs.readFileSync('key.pem');
	var pcert = fs.readFileSync('cert.pem')
	var credentials = {key: pkey, cert: pcert};
	server = https.createServer(credentials, app);
}
else{
	server = http.createServer(app);	
}



//Method to receive JWT token and return user info to requestor
app.post('/',function(req,res){
	console.log("post");
	var token=req.body.token;
	console.log("received token: " + token);

	var decoded = jwt.decode(token,{json:true});
	console.log(decoded);
	
	//return decoded values to requestor:
	res.end(JSON.stringify(decoded));

 });

/*
app.get('/',function(req,res){
	console.log("get");
});
*/

server.listen(port);
console.log("** Listening on " + port);