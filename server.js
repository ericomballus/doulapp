const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const mongo = require('mongodb').MongoClient;
const path = require('path');

//let uri = 'mongodb://localhost:27017/chat';
let io = require('socket.io').listen(server);


mongo.connect('mongodb://127.0.0.1/mongochat', function(err, db){
    if(err){
        throw err;
    }
//ajout du code
    io.on('connection', (socket) => {
      //mongodb connection
      let chat = db.collection('chats');
      
        socket.on('disconnect', function(){
          io.emit('users-changed', {user: socket.nickname, event: 'left'});
          console.log('chat test1');   
        });
    
        socket.on('set-nickname', (nickname) => {
            socket.nickname = nickname;
            io.emit('users-changed', {user: nickname, event: 'joined'});
            //recupére les old messages
            chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
              if(err){
                throw err;
              }
              console.log(res);
    
              socket.emit('message', res);
            });
    
           // io.emit('users-changed', {user: nickname, event: 'joined'});  
            console.log('chat test2'); 
          });
    
          socket.on('add-message', (message) => {
            chat.insert({text: message.text, from: socket.nickname, created: new Date()}, function(){
              io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});
            })
           // io.emit('message', {text: message.text, from: socket.nickname, created: new Date()}); 
            console.log('chat test3');
          });

          socket.on('testmballus', (data) =>{
            console.log('test mballus confirmé');
            console.log(data);
          });
        }); 
  });

//let io = require('socket.io')(server);




const port = process.env.PORT || 3000;

//const server = http.createServer(app);

server.listen(port, () =>{
    console.log('listening on port:' + port);
    console.log(`lancé depuis le fichier ${path.basename(__filename)}`);
});