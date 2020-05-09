import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Message from './message';
import UsersList from './usersList';

const Chat = (props) => {

    const [socket, setSocket] = useState();
    const [messageToSend, setMessageToSend] = useState("test");
    const [messagesReceived, setMessagesReceived] = useState([]);
    const [usernameMessage, setUsernameMessage] = useState(null);
    const [users, setUsers] = useState(null);
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

            //Event that retrieve new messages once the server triggered the event. 
            socket.on('message', message => {
                let prevScrollBarPosition = chatAreaDOM.current.scrollTop;
                let prevMaxScrollBarHeight = chatAreaDOM.current.scrollTopMax;
                message.messageType != "me" ? setMessagesReceived(prevMessages => [...prevMessages, message]) : null;
                message.messageType == "me" ? setUsernameMessage(`${message.message} ${message.userName}`) : null;
                chatScroller(prevScrollBarPosition, prevMaxScrollBarHeight);

            }
            );

            socket.on('connectedUsers', users => setUsers(users));
        }
    }

    /**
     * Send value from the text input to the server event "message"
     */
    const sendMessage = () => {
        socket ? socket.emit('message', messageToSend) : null;
        // Clean the value once the message has been sent to the server.
        setMessageToSend("");
    }

    /**
     * Display an error message if the user is already connected
     */
    const displayAlreadyConnected = () => {
        return <div className="row h-100 align-items-center justify-content-center display-4">{errorMessage}</div>;
    }

    const chatScroller = (prevScrollBarPosition, prevMaxScrollBarHeight) =>{
        let newMaxScrollBarHeight = chatAreaDOM.current.scrollTopMax;

        if(prevScrollBarPosition == prevMaxScrollBarHeight){
            console.log(`Can scroll automatically`);
            chatAreaDOM.current.scrollTo({
                top: newMaxScrollBarHeight,
                left: 0,
                behavior: 'smooth'
              });
        }
    }

    const displayChat = () => {
        return (
            <div className="container h-100 bg-secondary">


                <section className="row h-100 align-items-center justify-content-center" id="section-container">

                    <div className="container align-items-center justify-content-center">
                        <div className="row-fluid font-weight-normal" id="username-container">
                            <p className="rounded-0 alert m-0 p-2 fade show alert-success text-center col-xl-6  lead">{usernameMessage}</p>
                        </div>
                        {users ? <UsersList users={users} /> : null}
                        <div id="chat-container" className="row-fluid bg-light p-3">


                            <div className="col-sm-12 lead" ref={chatAreaDOM} id="chat-area" >
                                {messagesReceived.length ? messagesReceived.map((message, index) => <Message key={index} message={message} />) : null}
                            </div>
                            <div className="container">
                                <div className="row pl-2 pr-2">
                                    <input className="rounded-0 col-sm-9 form-control" value={messageToSend} onKeyDown={(event) => event.keyCode === 13 ? sendMessage() : null} onChange={(e) => setMessageToSend(e.target.value)} type="text" placeholder="Write a message here" />
                                    <button className="rounded-0 col-sm-2 btn btn-primary" onClick={() => sendMessage()}><i className="fas fa-paper-plane"></i></button>
                                    <a className="rounded-0 col-sm-1 btn btn-danger align-self-end" id="disconnect-button" href="/logout"><i className="fas fa-sign-out-alt"></i></a>
                                </div>
                            </div>

                        </div>

                    </div>
                </section>
            </div>
        );
    }

    return !errorMessage ? displayChat() : displayAlreadyConnected();
}

export default Chat;