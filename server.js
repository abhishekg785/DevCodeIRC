/*
 * Author:ABHISHEK GOSWAMI @abhishekg785
 * using express.js,socket.io and jquery
 */
var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


server.listen(3000,function(){
	console.log('in the port 3000');
});

app.use(express.static('public'));

app.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html');
});

//for adding users and their sockets
var users = {};
var usersArr = [];

//create socket.io
io.sockets.on('connection',function(socket){

	//event for add user
	socket.on('add user',function(username,callback){
		if(users[username] == undefined){
			users[username] = socket;
			usersArr.push(username);
			socket.username = username;
			console.log('user'+ ' ' +socket.username + 'connected');
			callback(true);
			updateUser();
		}
		else{
			callback(false);
		}
	});

	//event for disconncted
	socket.on('disconnect',function(data){
		console.log('user' + ' ' + socket.username + 'disconncted');
		if(users[socket.username] != undefined){
			delete users[socket.username];
			usersArr.splice(usersArr.indexOf(socket.username),1);
		}
		else{
			return;
		}
		updateUser();
	});

  //event for new group message
	socket.on('new group message',function(message){
		// console.log(socket.username + ':' +message);
		var messageObj = {'user':socket.username,'message':message};
		io.emit('new group message',messageObj);
	});

	function updateUser(){
		io.emit('update user',usersArr);
	}
});
