module.exports = (server, session, database) => {

    const 
        sharedsession = require("express-socket.io-session"),
        socketIo = require('socket.io')(server);

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
        //Store the session username in a variable
        let username = socket.handshake.session.username ? socket.handshake.session.username : null;

        socket.on('disconnect', () =>{
            if(socketsPerUser(socket) === 0 && (!socket.handshake.session.lastConnection || canNotify(socket))){

                //Send a message to the chat to alert that the user leaved the chat
                socket.broadcast.emit(
                    'message',
                    {
                        messageType : messageType.DISCONNECTED,
                        userName : username,
                        message : 'leaved the chat'
                    }
                );
                getConnectedUsers(socket);
                
            }
        });

        if(!username){
            socket.disconnect();
        }

        if(socketsPerUser(socket) > 1){
            socket.emit('alreadyConnected', `You're already connected`);
            socket.disconnect();
        }

        if(typeof(socket.handshake.session.socketId) === 'undefined'){
            socket.handshake.session.socketId = socket.id;
        }

        if(!socket.handshake.session.lastConnection || canNotify(socket)){
            //Send a message to everyone from the chat that a new user has joined the chat
            socket.broadcast.emit(
                'message', 
                {
                    messageType : messageType.CONNECTION.NOTME, 
                    userName : socket.handshake.session.username,
                    message : `joined the chat`
                }
            );

            socket.handshake.session.lastConnection = new Date();
            
        }

        //Save sessions variables
        socket.handshake.session.save();
        
        //Function that retrieve few documents from a collection with a number of results and a callback function.
        database.actionToDatabase(database.getFewDocuments, 'messages', { limit : 4, searchByFields :{} }, (results) => {
                
                //Send a message to the user session to retrieve lasts messages from the chat.
                socket.emit(
                    'lastMessages', 
                    {
                        messageType: messageType.CONNECTION.ME,
                        messages : results.reverse()//Order last messages in the right order.
                    }
                );
            }
        );

        //Send a welcome message to the user that succesfully connected. 
        socket.emit(
            'message',
            {
                messageType: messageType.CONNECTION.ME, 
                userName : socket.handshake.session.username,
                message : `You're connected as`
            }
        );
    
        
        
        getConnectedUsers(socket);

        //Perform action when the client triggered the "message" event
        socket.on('message', message =>{
            
            //Check if the user has a userName
            if(username){

                //Send the message that session sent to himself
                socket.emit(
                    'message',
                    {   
                        messageType : messageType.MESSAGE,
                        userName : username, 
                        message : message
                    }
                );
        
                //Send the message sent from the session to everyone from the chat expect the current session.
                socket.broadcast.emit(
                    'message',
                    {
                        messageType : messageType.MESSAGE,
                        userName : username, 
                        message : message
                    }
                );
                
                //Add userName and message to the database.
                database.actionToDatabase(
                    database.insertSingleDocument,
                    'messages',
                    {
                        userName : username, 
                        message : message
                    },
                    (results) => null
                );
            }
            else{
                socket.disconnect();
            }
        });
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
     * Return true or false if the user is able to send notification to broadcaster.
     */
    canNotify = (socket) =>{
        if(new Date(socket.handshake.session.lastConnection.getTime() + 1*60000) < new Date()){
            return true;
        }

        return false;
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
 