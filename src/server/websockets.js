import sharedsession from 'express-socket.io-session';
import socketIo from 'socket.io';

let webSockets;
let usersInChat;

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

        //Store the session username in a variable
        let username = socket.handshake.session.username ? socket.handshake.session.username : null;

        socket.on('disconnect', () => {
            if (socketsPerUser(socket) === 0) {
                getConnectedUsers(socket);
                socket.handshake.session.socketId = null;
                socket.handshake.session.cookie.maxAge = new Date(new Date().getTime() + 60 * 60000);
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
            socket.handshake.session.cookie.maxAge = new Date(new Date().getTime() + 1000 * 60000);
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

        getConnectedUsers(socket);

        //last private message search criteria
        let searchLastConversations = { users: { $in: [username] } }

        //Get lasts private messages
        database.actionToDatabase(database.getFewDocuments, 'privateConversations', { limit: 4, searchByFields: searchLastConversations }, (results) => {
            results.map(conversation => {
                conversation.users = conversation.users.filter(user => user != username);
            });

            if (results.length) {
                //Send a message to the user session to retrieve lasts messages from the chat.
                socket.emit(
                    'lastConversations',
                    results
                );
            }
        }
        );

        //Send a welcome message to the user that succesfully connected. 
        socket.emit(
            'message',
            {
                messageType: messageType.CONNECTION.ME,
                myInformations: {
                    username: username,
                    image: socket.handshake.session.image
                },
                message: `You're connected as`
            }
        );

        //Send private message to a socket
        socket.on('sendPrivateMessage', datas => {

            datas.username = username;
            datas.messageType = messageType.MESSAGE;
            datas.seen = { [datas.username]: true, [datas.sendTo]: false };

            let userToSendDatas = usersInChat.filter(user => user.username == datas.sendTo)[0];

            if (userToSendDatas.socketId && username != datas.sendTo) {
                socket.to(userToSendDatas.socketId).emit('privateMessage', datas);
            }

            if(userToSendDatas && username != datas.sendTo){
                socket.emit('privateMessage', datas);

                let search = { users: { $in: [[username, datas.sendTo], [datas.sendTo, username]] } }

                //Retrieve privateMessages that concern both user's and add to the conversation database object a message.
                database.actionToDatabase(database.getFewDocuments, 'privateConversations', { limit: 0, searchByFields: search }, (results) => {
                    addMessageToConversation(
                        datas,
                        results,
                        (isNewConversation, newConversation) => {
    
                            if (isNewConversation) {
                                userToSendDatas.socketId ? socket.to(userToSendDatas.socketId).emit('newConversation', newConversation) : null;
                                socket.emit('newConversation', newConversation);
                            }
                        }
                    );
                });
            }

        });

        socket.on('messagesSeen', (conversationId) => {
            
            database.actionToDatabase(database.getFewDocuments, 'privateConversations', { limit: 0, searchByFields: { _id: conversationId } }, (results) => {

                if (results.length && results[0].users && results[0].users.includes(username)) {
                    let messages = results[0].messages;
                    let users = results[0].users;
                    messages.map((message) => message.seen[username] = true);


                    database.actionToDatabase(
                        database.insertSingleDocument,
                        'privateConversations',
                        {
                            _id: conversationId,
                            users: users,
                            messages: messages
                        },
                        (insertResults) => {

                            if (insertResults.result.n == insertResults.result.ok) {
                                socket.emit('messagesSeen', users.filter(user => user != username));
                            }
                        }
                    );


                }

            });

        })

        //Perform action when the client triggered the "message" event
        socket.on('message', message => {

            //Check if the user has a username
            if (username) {

                //Send the message that session sent to himself
                socket.emit(
                    'message',
                    {
                        messageType: messageType.MESSAGE,
                        username: username,
                        message: message
                    }
                );

                //Send the message sent from the session to everyone from the chat expect the current session.
                socket.broadcast.emit(
                    'message',
                    {
                        messageType: messageType.MESSAGE,
                        username: username,
                        message: message
                    }
                );

                //Add username and message to the database.
                database.actionToDatabase(
                    database.insertSingleDocument,
                    'messages',
                    {
                        username: username,
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
    const getConnectedUsers = (socket, callback) => {

        database.actionToDatabase(database.getFewDocuments, 'sessions', { limit: 0 }, (results) => {
            //Filter and map to retrieve only necessary datas from users.
            usersInChat = results.filter(user => user.session.username)
                .map(({ session }) => { return { username: session.username, image: session.image, socketId: session.socketId } });

            let usersInChatToClient = usersInChat.map(user => { return { username: user.username, image: user.image, connected: user.socketId ? true : false } });

            socket.broadcast.emit('connectedUsers', usersInChatToClient);
            socket.emit('connectedUsers', usersInChatToClient);

            callback ? callback(usersInChatToClient) : null;
        });
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
     * Function that add a message to the database in the conversation
     * @param {*} receiver receiver username
     * @param {*} datas 
     * @param {*} results 
     * @param {*} callback 
     */
    const addMessageToConversation = (datas, results, callback) => {
        let users = [datas.username, datas.sendTo];

        if (results.length == 1) {
            let conversationsDatas = results[0];

            database.actionToDatabase(
                database.insertSingleDocument,
                'privateConversations',
                {
                    _id: conversationsDatas._id,
                    users: users,
                    messages: [...conversationsDatas.messages, datas]
                },
                (queryResults) => {
                    if (queryResults.result.n === queryResults.result.ok) {
                        callback(false);
                    }
                }
            );
        } else {
            database.actionToDatabase(
                database.insertSingleDocument,
                'privateConversations',
                {
                    users: users,
                    messages: [datas]
                },
                (queryResults) => {
                    if (queryResults.result.n === queryResults.result.ok) {

                        callback(true, queryResults.ops[0]);
                    }
                }
            );
        }
    }

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
            username: session.username,
            message: `joined the chat`
        }
    );
}

/**
 * Function that alert everyones that a user leaved the chat
 * @param {*} socketId 
 */
const sendLeavedChatMessageBroadcaster = (session, callback) => {

    //Send a message to the chat to alert that the user leaved the chat
    webSockets.sockets.emit(
        'message',
        {
            messageType: messageType.DISCONNECTED,
            username: session.username,
            message: 'leaved the chat'
        }
    );

    if(webSockets.sockets.clients().connected[session.socketId]){
        let socketSession = webSockets.sockets.clients().connected[session.socketId];

        if(socketSession.handshake.session.username == session.username){
            socketSession.disconnect();
            socketSession.handshake.session.destroy((err) => callback());
        }
    }
}

export default startWebsocketsApp;
export { sendJoinedChatMessageBroadcaster, sendLeavedChatMessageBroadcaster };
