import React, { useState, useEffect } from 'react';
import PublicChat from './publicChat';
import PrivateChat from './privateChat';
import SocketManager from './socketManager';
let yo = { title : "haah"}

const ChatManager = (props) => {

    const [messagesReceived, setMessagesReceived] = useState([]);
    const [privateConversations, setPrivateConversations] = useState({});
    const [usernameMessage, setUsernameMessage] = useState(null);
    const [myInformations, setMyInformations] = useState({});
    const [users, setUsers] = useState([]);
    const [talkTo, setTalkTo] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [chatAreaDOM, setChatAreaDOM] = useState(React.createRef());

    /**
     * Prepare conversation, if the opened conversation is new, add an empty object to the conversations
     * @param {*} user 
     */
    const prepareConversation = (user) => {
        setTalkTo(user);
        if (!privateConversations[user.username]) {
            setPrivateConversations(prevConversations => { return { ...prevConversations, [user.username]: {} } });
        }
    }

    /**
     * set Talkto to null to change the view.
     */
    const goToPublicChat = () => {
        setTalkTo(null);
    }

    /**
     * Display an error message if the user is already connected
     */
    const displayAlreadyConnected = () => {
        return <div className="row h-100 align-items-center justify-content-center display-4">{errorMessage}</div>;
    }

    /**
     * If the chatArea bar scroll is fully down, the next message will be automatically scrolled to the new max bottom.
     * @param {*} prevScrollBarPosition 
     * @param {*} prevMaxScrollBarHeight 
     */
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

    /**
     * Return differents view depending on conditions.
     */
    const windowDisplayer = () => {
        if (!errorMessage && !talkTo) {
            return <PublicChat
                privateConversations={privateConversations}
                messagesReceived={messagesReceived}
                usernameMessage={usernameMessage}
                users={users}
                myInformations={myInformations}
                chatAreaDOM={chatAreaDOM}
                socket={props.socket}
                prepareConversation={prepareConversation}
            />;
        }
        else if (!errorMessage && talkTo) {
            
            return <PrivateChat
                user={talkTo}
                conversation={privateConversations[talkTo.username]}
                usernameMessage={usernameMessage}
                myInformations={myInformations}
                chatAreaDOM={chatAreaDOM}
                goToPublicChat={goToPublicChat}
                socket={props.socket}
            />
        }
        else {
            return displayAlreadyConnected();
        }
    }

    return (<div className="container h-100 bg-secondary">
        <SocketManager
            messagesReceived={[messagesReceived, setMessagesReceived]}
            privateConversations={[privateConversations, setPrivateConversations]}
            usernameMessage={[usernameMessage, setUsernameMessage]}
            myInformations={[myInformations, setMyInformations]}
            users={[users, setUsers]}
            errorMessage={[errorMessage, setErrorMessage]}
            chatScroller={chatScroller}
            socket={props.socket}
            talkTo={[talkTo, setTalkTo]}
            chatAreaDOM={chatAreaDOM}
        />

        {windowDisplayer()}
    </div>);



}

export default ChatManager;