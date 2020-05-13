import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import PublicChat from './publicChat';
import PrivateChat from './privateChat';

const ChatManager = (props) => {

    const [socket, setSocket] = useState();
    const [messagesReceived, setMessagesReceived] = useState([]);
    const [privateMessagesReceived, setPrivateMessagesReceived] = useState({});
    const [usernameMessage, setUsernameMessage] = useState(null);
    const [myInformations, setMyInformations] = useState({});
    const [users, setUsers] = useState(null);
    const [talkTo, setTalkTo] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [chatAreaDOM, setChatAreaDOM] = useState(React.createRef());

    useEffect(() => {
        const initializeSocket = io('http://localhost:8080/');
        initializeSocket.on('connect', () => initializeSocketEvents(initializeSocket));
        setSocket(initializeSocket);
    }, []);

    const initializeSocketEvents = (socket) => {
        if (socket) {

            socket.on('alreadyConnected', message => setErrorMessage(message));

            // Event that retrieve the last messages once the server triggered the event.
            socket.on('lastMessages', ({ messages }) => setMessagesReceived(prevMessages => [...prevMessages, ...messages]));

            socket.on('privateMessage', message => {
                let prevMessages;

                if(message.sendTo == myInformations.username){
                    prevMessages = Array.isArray(privateMessagesReceived[message.username]);
                    prevMessages ? privateMessagesReceived[message.username].push(message) : privateMessagesReceived[message.username]= [message];
                }
                else{
                    prevMessages = Array.isArray(privateMessagesReceived[message.sendTo]);
                    prevMessages ? privateMessagesReceived[message.sendTo].push(message) : privateMessagesReceived[message.sendTo] = [message];
                }

                setPrivateMessagesReceived(messages => {return {...messages}});
            });

            socket.on('connectedUsers', users => setUsers(users));

            //Event that retrieve new messages once the server triggered the event. 
            socket.on('message', message => {
                let prevScrollBarPosition = chatAreaDOM.current.scrollTop;
                let prevMaxScrollBarHeight = chatAreaDOM.current.scrollTopMax;


                if(message.messageType == "me"){
                    myInformations.username = message.myInformations.username;
                    myInformations.image = message.myInformations.image;
                    setUsernameMessage(`${message.message} ${message.myInformations.username}`);
                }
                else{
                    setMessagesReceived(prevMessages => [...prevMessages, message]);
                }

                chatScroller(prevScrollBarPosition, prevMaxScrollBarHeight);
            }
            );
        }
    }

    const getUser = (user) => {
        setTalkTo(user);
    }

    const goToPublicChat = () => {
        setTalkTo(null);
    }

    /**
     * Display an error message if the user is already connected
     */
    const displayAlreadyConnected = () => {
        return <div className="row h-100 align-items-center justify-content-center display-4">{errorMessage}</div>;
    }

    const chatScroller = (prevScrollBarPosition, prevMaxScrollBarHeight) => {
        let newMaxScrollBarHeight = chatAreaDOM.current.scrollTopMax;

        if (prevScrollBarPosition == prevMaxScrollBarHeight) {
            chatAreaDOM.current.scrollTo({
                top: newMaxScrollBarHeight,
                left: 0,
                behavior: 'smooth'
            });
        }
    }

    const windowDisplayer = () => {
        if (!errorMessage && !talkTo) {
            return <PublicChat
                privateMessages={privateMessagesReceived}
                messagesReceived={messagesReceived}
                usernameMessage={usernameMessage}
                users={users}
                myInformations = {myInformations}
                chatAreaDOM={chatAreaDOM}
                socket={socket}
                getUser={getUser}
            />;
        }
        else if (!errorMessage && talkTo) {

            return <PrivateChat
                user={talkTo}
                messages = {privateMessagesReceived[talkTo.username]}
                usernameMessage={usernameMessage}
                myInformations = {myInformations}
                goToPublicChat={goToPublicChat}
                socket={socket}
            />
        }
        else {
            return displayAlreadyConnected();
        }
    }

    return windowDisplayer();



}

export default ChatManager;