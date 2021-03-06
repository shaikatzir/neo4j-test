var net = require("net"); //nodejs version of imports
 
var server = new net.Server(); // a new raw tcp server
 
server.on("connection", function(client) { // on connection event, when someone connects
	console.log("server connections: " + server.connections); // write number of connection to the command line
	client.on("data", function (data) { //event when a client writes data to the server
		console.log("Server received data: " + data); // log what the client sent
	});
});
server.listen(10000, "localhost"); // listen on port 10000, localhost
 
setInterval(function () {
	var connection = net.connect(10000, "localhost", function() { // connect to the server we made
		console.log("client connected");
		setInterval(function () { // every 1000ms,
		connection.write("er-mah-gerd");// write to the connection
		}, 1000);//the 1000 is the delay in between the anon function calls
	});
}, 1000);// add another connection every second
 
/*
for 100 connections it used about 13M or ram
my raspberry Pi made it up to 508 con
*/


var socket = net.createConnection(port, host);
console.log('Socket created.');
socket.on('data', function(data) {
  // Log the response from the HTTP server.
  console.log('RESPONSE: ' + data);
}).on('connect', function() {
  // Manually write an HTTP request.
  socket.write("GET / HTTP/1.0\r\n\r\n");
}).on('end', function() {
  console.log('DONE');
});
