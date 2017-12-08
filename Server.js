var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
const translate = require('google-translate-api');

var router = express.Router();
var path = __dirname + '/views/';

var conversations = [];

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

router.get("/connect",function(req,res){
  res.sendFile(path + "connect.html");
});

router.get("/talk",function(req,res){
  res.sendFile(path + "talk.html");
});

app.use("/",router);

app.use(express.static('./public'));

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

/********* SOCKETS **********/

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('start-conversation', function(conversation) {
  	if(!conversation.idconversation) {
  		socket.emit('m-error', "Code 03 : Une erreur a été survenue.");
		  return;
  	}
  	if(conversations[conversation.idconversation]) {
  		socket.emit('m-error', "Une conversation est ouverte avec le même identifiant.");
		  return;
  	}

  	conversation.sockets = {
		start: socket,
		connect: null
	}

  	conversations[conversation.idconversation] = conversation;
  	conversation.sockets.start.emit('m-notif', "La conversation a été crée avec succès.");
  });

  socket.on('connect-conversation', function(connectConversation) {
  	if(!connectConversation.idconversation) {
  		socket.emit('m-error', "Code 04 : Une erreur a été survenue.");
		  return;
  	}
  	if(!conversations[connectConversation.idconversation]) {
  		socket.emit('m-error', "Code 05 : La conversation n'as pas été trouvée.");
		  return;
  	}
  	var conversation = conversations[connectConversation.idconversation];
  	if(conversation.password!=connectConversation.password) {
  		socket.emit('m-error', "Code 06 : Le mot de passe n'est pas valide.");
		  return;
  	}
  	
  	conversation.usernames.connect = connectConversation.usernames.connect;
  	conversation.sockets.connect = socket;
  	conversations[connectConversation.idconversation] = conversation;

  	conversation.sockets.start.emit('conversation-connected', conversation.usernames.connect, 'start');
  	conversation.sockets.connect.emit('conversation-connected', conversation.usernames.start, 'connect');
  });

  socket.on('chat', function(message, conversation) {
    if(!conversation.idconversation) {
      socket.emit('m-error', "Code 03 : Une erreur a été survenue.");
      return;
    }
    if(!conversations[conversation.idconversation]) {
      socket.emit('m-error', "Code 05 : La conversation n'as pas été trouvée.");
      return;
    }

    if(conversation.action=='start') {
      var from = conversations[conversation.idconversation].from;
      var to = conversations[conversation.idconversation].to;
      var socketDest = conversations[conversation.idconversation].sockets.connect;
    }
    if(conversation.action=='connect') {
      var from = conversations[conversation.idconversation].to;
      var to = conversations[conversation.idconversation].from;
      var socketDest = conversations[conversation.idconversation].sockets.start; 
    }

    translate(message, {from: from, to: to}).then(res => {
      socketDest.emit('chat', res.text);
    }).catch(err => {
      console.error(err);
    });
    
  });

});

/****************************/

server.listen(8080,function(){
  console.log("Live at Port 8080");
});

// comment