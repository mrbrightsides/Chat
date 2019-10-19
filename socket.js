var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
var usernames={};  
app.listen(9999);

function handler (req, res) {
//console.log(req);
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function(socket){

  console.log("Connection " + socket.id + " accepted.");
   console.log(socket.handshake.foo == true); // writes `true`
  console.log(socket.handshake.address.address); // writes 127.0.0.1
   socket.on('adduser', function(username){
        // store the username in the socket session for this client
        socket.username = username;
        // add the client's username to the global list
        usernames[username] = username;
        // send client to room 1
        console.log(username+' has connected to the server');
  socket.broadcast.emit('updatechat', ' has connected',username);
  });
  // now that we have our connected 'socket' object, we can 
  // define its event handlers
  socket.on('message', function(message){
 // we tell the client to execute 'updatechat' with 2 parameters
 
  io.sockets.emit('updatechat',  message,socket.username);
  
        console.log("Received message: " + message + " - from client " + socket.username);
  });

  socket.on('pmessage',function(message){
  // This works and sends message to all clients
  //io.sockets.emit("updatechat",message,socket.username); 
  console.log(usernames[message] + "  " + socket.username + " to " + message);
  // THIS DOESNOT
  io.sockets.emit("updatechat","Ping " + message,socket.username); 

  });
  socket.on('disconnect', function(){
  
  io.sockets.emit('usersleft',  socket.username);
  delete usernames[socket.username];
 //socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    console.log("Connection " + socket.username + " terminated.");
  });
    
}); 