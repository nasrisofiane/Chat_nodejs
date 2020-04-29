const express = require('express');
const app = express();
const server = require('http').Server(app);
const socketIo = require('socket.io')(server);
const MongoDbConnection = require('./MongoDbConnection').MongoDbConnection;
const database = new MongoDbConnection();
const sessionstore = require('sessionstore');

const customSessionsStore = sessionstore.createSessionStore({
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    dbName: 'chat',
    collectionName: 'sessions',
});
const session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true,
    store : customSessionsStore
});
const sharedsession = require("express-socket.io-session");

//Enum equivalent.
const messageType = {
    CONNECTION :{
        ME : "me",
        NOTME : "notme"
    },
    DISCONNECTED : "disconnected",
    MESSAGE : "message"
};

server.listen(8080);

//Retrieve needed ressources from customs paths.
app.use("/css", express.static(__dirname + '/views/assets/css'));
app.use("/js", express.static(__dirname + '/views/assets/js'));
app.use(session);

socketIo.use(sharedsession(session, {
    autoSave:true
}));

/**
 * Render an HTML file on the route connection
 */
app.get('/login', (req, res) =>{
    if(!req.session.username){
        res.sendFile(`${__dirname}/views/login.html`);
    }
    else{
        res.redirect('/chat');
    }
});

app.get('/chat', (req, res) =>{
    if(!req.session.username){
        res.redirect('/login');
    }
    else{
        res.sendFile(`${__dirname}/views/index.html`);
    }
});

app.get('/logout', (req, res) =>{
    req.session.destroy();
    res.redirect('/login');
});


/**
 * Event that will initialize applications events once a session connected to the server.
 */
socketIo.sockets.on('connection', socket => {

    //Store the session username in a variable
    let socketUsername = socket.handshake.session.username ? socket.handshake.session.username : null;

    //Variable that will contains the lasts messages from the database.
    let lastMessages = null;

    //Function that retrieve few documents from a collection with a number of results and a callback function.
    database.actionToDatabase(database.getFewDocuments, 'messages', 4, (results) => lastMessages = results);

    //Perform action when the client triggered the "newUser" event
    socket.on('newUser', userName =>{
        
        //Allow only alphanumeric character and delete all other characters.
        userName = userName.replace(/[^A-Z0-9]/ig, "");

        if(userName.length && !socketUsername){

            //Attach the username to his current session
            socket.handshake.session.username = userName;
            socket.handshake.session.save();
            
            //Send a message to everyone from the chat that a new user has joined the chat
            socket.broadcast.emit(
                'message', 
                {
                    messageType : messageType.CONNECTION.NOTME, 
                    userName : socket.handshake.session.username,
                    message : `joined the chat`
                }
            );
            
            socket.emit('redirectTo', '/chat');
        }
        
    });

    if(socketUsername){

        socket.on('chatJoined', () =>{

            //Send a welcome message to the user that succesfully connected. 
            socket.emit(
                'message',
                {
                    messageType: messageType.CONNECTION.ME, 
                    userName : socket.handshake.session.username,
                    message : `You're connected as`
                }
            );
    
            //Send a message to the user session to retrieve lasts messages from the chat.
            socket.emit(
                'lastMessages', 
                {
                    messageType: messageType.CONNECTION.ME,
                    messages : lastMessages.reverse()//Order last messages in the right order.
                }
            );
        });
    }
    
    //Perform action when the client triggered the "message" event
    socket.on('message', message =>{

        //Check if the user has a userName
        if(socketUsername){

            //Send the message that session sent to himself
            socket.emit(
                'message',
                {   
                    messageType : messageType.MESSAGE,
                    userName : socketUsername, 
                    message : message
                }
            );
    
            //Send the message sent from the session to everyone from the chat expect the current session.
            socket.broadcast.emit(
                'message',
                {
                    messageType : messageType.MESSAGE,
                    userName : socketUsername, 
                    message : message
                }
            );
            
            //Add userName and message to the database.
            database.actionToDatabase(
                database.insertSingleDocument,
                'messages',
                {
                    userName : socketUsername, 
                    message : message
                },
                (results) => console.log(results.result)
            );
        }
        else{
            socket.emit('redirectTo', '/login');
        }

    });

    //Perform action when the client triggered the "disconnect" event
    socket.on('logout', () =>{

        //Send a message to everyone from the chat that the user leaved the chat
        socket.broadcast.emit(
            'message',
            {
                messageType : messageType.DISCONNECTED,
                userName : socketUsername,
                message : 'leaved the chat'
            }
        );
        
        socketUsername = null;
        socket.emit('redirectTo', '/logout');
    });

});

