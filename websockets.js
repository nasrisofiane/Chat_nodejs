module.exports = (server, session, database) => {

    const sharedsession = require("express-socket.io-session");
    const socketIo = require('socket.io')(server);

    socketIo.use(sharedsession(session));

    //Enum equivalent.
    const messageType = {
        CONNECTION :{
            ME : "me",
            NOTME : "notme"
        },
        DISCONNECTED : "disconnected",
        MESSAGE : "message"
    };

    /**
     * Event that will initialize applications events once a session connected to the server.
     */
    socketIo.sockets.on('connection', socket => {

        if(typeof(socket.handshake.session.socketId) === 'undefined'){
            socket.handshake.session.socketId = socket.id;
            socket.handshake.session.save();
        }
        
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

                getConnectedUsers(socket);
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
                    (results) => null
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
            
            // socket.handshake.session.isConnected = false;
            socketUsername = null;
            socket.emit('redirectTo', '/logout');
        });

        socket.on('disconnect', () =>{
            if(socketsPerUser(socket) === 0){
                getConnectedUsers(socket);
            }
        })

        if(socketsPerUser(socket) > 1){
            socket.emit('alreadyConnected', `You're already connected`);
            socket.disconnect();
        }

    });

    /**
     * Retrieve all connected users
     */
    getConnectedUsers = socket =>{
        let users = [];

        Object.keys(socketIo.sockets.clients().connected).forEach((item) => {
            if(typeof(socketIo.sockets.clients().connected[item].handshake.session.username) !== 'undefined'){
                let user = {
                    username : socketIo.sockets.clients().connected[item].handshake.session.username,
                    image : socketIo.sockets.clients().connected[item].handshake.session.image
                };

                users.push(user);
            }
        });

        socket.broadcast.emit('connectedUsers', users);
        socket.emit('connectedUsers', users);
    }

    /**
     * Return the number of connected sockets for a session
     */
    socketsPerUser = socket =>{
        let socketsNb = 0;

        Object.keys(socketIo.sockets.clients().connected).forEach((item) => {
            if(socketIo.sockets.clients().connected[item].handshake.sessionID == socket.handshake.sessionID){
                socketsNb += 1;     
            }
        });

        return socketsNb;
    }
}
 