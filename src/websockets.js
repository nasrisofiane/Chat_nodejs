import sharedsession from 'express-socket.io-session';
import socketIo from 'socket.io';

let webSockets;
//Enum equivalent.
const messageType = {
    CONNECTION: {
        ME: "me",
        NOTME: "notme"
    },
    DISCONNECTED: "disconnected",
    MESSAGE: "message"
};

const startWebsocketsApp = (server, session, database) => {
    
    webSockets = socketIo(server);
    webSockets.use(sharedsession(session));

    /**
     * Event that will initialize applications events once a session connected to the server.
     */
    webSockets.sockets.on('connection', socket => {
        console.log("connected as =>" + socket.id);

        //Store the session username in a variable
        let username = socket.handshake.session.username ? socket.handshake.session.username : null;

        socket.on('disconnect', () => {
            if (socketsPerUser(socket) === 0) {
                getConnectedUsers(socket);
                socket.handshake.session.socketId = null;
                socket.handshake.session.save();
            }
        });

        if (!username) {
            socket.disconnect();
        }

        if (socketsPerUser(socket) > 1) {
            socket.emit('alreadyConnected', `You're already connected`);
            socket.disconnect();
        }
        else {
            socket.handshake.session.socketId = socket.id;
        }

        //Save sessions variables
        socket.handshake.session.save();

        //Function that retrieve few documents from a collection with a number of results and a callback function.
        database.actionToDatabase(database.getFewDocuments, 'messages', { limit: 4, searchByFields: {} }, (results) => {

            //Send a message to the user session to retrieve lasts messages from the chat.
            results.map(message => message.messageType = messageType.MESSAGE);
            socket.emit(
                'lastMessages',
                {
                    messages: results.reverse()//Order last messages in the right order.
                }
            );
        }
        );

        //Send a welcome message to the user that succesfully connected. 
        socket.emit(
            'message',
            {
                messageType: messageType.CONNECTION.ME,
                userName: socket.handshake.session.username,
                message: `You're connected as`
            }
        );

        getConnectedUsers(socket);

        //Perform action when the client triggered the "message" event
        socket.on('message', message => {
            console.log(message);
            //Check if the user has a userName
            if (username) {

                //Send the message that session sent to himself
                socket.emit(
                    'message',
                    {
                        messageType: messageType.MESSAGE,
                        userName: username,
                        message: message
                    }
                );

                //Send the message sent from the session to everyone from the chat expect the current session.
                socket.broadcast.emit(
                    'message',
                    {
                        messageType: messageType.MESSAGE,
                        userName: username,
                        message: message
                    }
                );

                //Add userName and message to the database.
                database.actionToDatabase(
                    database.insertSingleDocument,
                    'messages',
                    {
                        userName: username,
                        message: message
                    },
                    (results) => null
                );
            }
            else {
                socket.disconnect();
            }
        });
    });

    /**
     * Retrieve all connected users
     */
    const getConnectedUsers = socket => {
        let users = [];

        Object.keys(webSockets.sockets.clients().connected).forEach((item) => {
            if (typeof (webSockets.sockets.clients().connected[item].handshake.session.username) !== 'undefined') {
                let user = {
                    username: webSockets.sockets.clients().connected[item].handshake.session.username,
                    image: webSockets.sockets.clients().connected[item].handshake.session.image
                };

                users.push(user);
            }
        });

        // database.actionToDatabase(database.getFewDocuments, 'sessions', {limit : 0} , (results) => {
        //     let usersInChat = results.filter( user => user.username ).map( user => { return { username : user.username, socketId : user.socketId }});
        //     console.log(usersInChat);
        // });
        
        socket.broadcast.emit('connectedUsers', users);
        socket.emit('connectedUsers', users);
    }

    /**
     * Return the number of connected sockets for a session
     */
    const socketsPerUser = socket => {
        let socketsNb = 0;

        Object.keys(webSockets.sockets.clients().connected).forEach((item) => {
            if (webSockets.sockets.clients().connected[item].handshake.sessionID == socket.handshake.sessionID) {
                socketsNb += 1;
            }
        });

        return socketsNb;
    }

    /**
     * Return true or false if the user is able to send messages to broadcaster.
     */
    // const canNotify = (socket) => {
    //     if (new Date(socket.handshake.session.lastConnection.getTime() + 1 * 60000) < new Date()) {
    //         return true;
    //     }

    //     return false;
    // }


}

/**
 * Function that alert everyones that a new user joined the chat
 * @param {*} socketId 
 */
const sendJoinedChatMessageBroadcaster = (session) => {

    //Send a message to everyone from the chat that a new user has joined the chat
    webSockets.sockets.emit(
        'message',
        {
            messageType: messageType.CONNECTION.NOTME,
            userName: session.username,
            message: `joined the chat`
        }
    );
}

/**
 * Function that alert everyones that a user leaved the chat
 * @param {*} socketId 
 */
const sendLeavedChatMessageBroadcaster = (session) => {

    //Send a message to the chat to alert that the user leaved the chat
    webSockets.sockets.emit(
        'message',
        {
            messageType: messageType.DISCONNECTED,
            userName: session.username,
            message: 'leaved the chat'
        }
    );
}

export default startWebsocketsApp;
export { sendJoinedChatMessageBroadcaster, sendLeavedChatMessageBroadcaster };